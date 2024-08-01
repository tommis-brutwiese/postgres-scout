APPNAME := postgres-scout

.PHONY: help
help:
	@echo Targets:
	@grep -E '^[a-zA-Z0-9\-]*\:' Makefile | sed 's/^\(.*\): *\(.*\)/\* \1/'

.PHONY: run
run:
	cd src-tauri && cargo run dev

.PHONY: build
build:
	cd src-tauri && cargo build --release

.PHONY: test
test:
	cd src-tauri && cargo test

.PHONY: run-in-container
run-in-container:
	# Build and run application (as server application) inside a docker container
	cd src-tauri && docker compose up --build
	#
	# Note: missing cleanup of image?

.PHONY: sbom-rust
sbom-rust:
	# Installation:
	# cargo install cargo-cyclonedx
	# 
	# Must then be run from directory containing Cargo.toml
	cd src-tauri && cargo cyclonedx && realpath *.cdx.xml

.PHONY: sbom-npm
sbom-npm:
	# Installation:
	# npm install --global @cyclonedx/cyclonedx-npm
	#
	# Note: requires a package.json - so does not work yet
	#
	cyclonedx-npm > postgres-scout-npm.cdx.xml

TARGETOS := debian
VERSION := bullseye
BUILDIMAGE := $(APPNAME):$(TARGETOS)-$(VERSION)
CONTAINER := $(APPNAME)-$(TARGETOS)-$(VERSION)
TARGETDIR := target/bin/$(TARGETOS)/$(VERSION)
TARGETFILE := $(TARGETDIR)/$(APPNAME)

.PHONY: debian-executable-builder
debian-executable-builder:
	# Build executable inside image and
	# a second image to run it

	cd src-tauri && docker build -t $(BUILDIMAGE) -f Dockerfile.$(TARGETOS) --build-arg DEBIAN_VERSION=$(VERSION) .

.PHONY: debian-executable-create
debian-executable-create: debian-executable-builder
	
	# Extract executable from inside container

	docker container create --name $(CONTAINER) $(BUILDIMAGE)
	mkdir -p $(TARGETDIR)
	docker cp $(CONTAINER):bin/server $(TARGETFILE)
	docker container rm $(CONTAINER)

	@echo Resulting binary file:
	@ls -l $(TARGETFILE)

.PHONY: debian-executable-run-in-container
debian-executable-run-in-container: debian-executable-builder
	docker container run --rm --name $(CONTAINER) $(BUILDIMAGE)

.PHONY: debian-executable-builder-rm
debian-executable-builder-rm:
	docker image rm $(BUILDIMAGE)

.PHONY: icon
icon:
	cd src-tauri && cargo tauri icon fernrohr.png

.PHONY: clean
clean: debian-executable-builder-rm
	cd src-tauri && cargo clean
	rm -rf target
	rm -f *.cdx.xml

.PHONY: all
all: help run build test\
		run-in-container sbom-rust\
		debian-executable-create debian-executable-run-in-container\
		clean
	# skip: sbom-npm
