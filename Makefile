APPNAME := postgres-scout

.PHONY: help
help:
	@echo Targets:
	@grep -E '^[a-zA-Z0-9\-]*\:' Makefile | grep -v INACTIVE | sed 's/^\(.*\): *\(.*\)/\* \1/'

.PHONY: run
run:
	cd src-tauri && cargo run dev

.PHONY: build
build:
	cd src-tauri && cargo build --release

.PHONY: test
test:
	cd src-tauri && cargo test

.PHONY: INACTIVE-run-in-container
INACTIVE-run-in-container:
	# Build and run application (as server application) inside a docker container
	cd src-tauri && docker compose up --build
	#
	# Note: missing cleanup of image?
	#
	# INACTIVE, as adjustments are needed for the tauri app

.PHONY: sbom-rust
sbom-rust:
	# Installation:
	# cargo install cargo-cyclonedx
	# 
	# Must then be run from directory containing Cargo.toml
	cd src-tauri && cargo cyclonedx && realpath *.cdx.xml

.PHONY: INACTIVE-sbom-npm
INACTIVE-sbom-npm:
	# Installation:
	# npm install --global @cyclonedx/cyclonedx-npm
	#
	# Note: requires a package.json - so does not work yet
	#
	cyclonedx-npm > postgres-scout-npm.cdx.xml

.PHONY: prettier
prettier:
    # Prettier is a beautifier for javascript
	#
    # Installation:
	# npm install --save-dev --save-exact prettier
	#
	npx prettier . --write

.PHONY: eslint
eslint:
    # eslint gives hints on issues with our js
    #
    # Installation:
    # npm init @eslint/config@latest
	npx eslint ui/*.js

TARGETOS := debian
VERSION := bullseye
BUILDIMAGE := $(APPNAME):$(TARGETOS)-$(VERSION)
CONTAINER := $(APPNAME)-$(TARGETOS)-$(VERSION)
TARGETDIR := target/bin/$(TARGETOS)/$(VERSION)
TARGETFILE := $(TARGETDIR)/$(APPNAME)

.PHONY: INACTIVE-debian-executable-builder
INACTIVE-debian-executable-builder:
	# Build executable inside image and
	# a second image to run it
	#
	# INACTIVE, as adjustments are needed for the tauri app

	cd src-tauri && docker build -t $(BUILDIMAGE) -f Dockerfile.$(TARGETOS) --build-arg DEBIAN_VERSION=$(VERSION) .

.PHONY: INACTIVE-debian-executable-create
INACTIVE-debian-executable-create: INACTIVE-debian-executable-builder
	
	# Extract executable from inside container
	#
	# INACTIVE, as adjustments are needed for the tauri app


	docker container create --name $(CONTAINER) $(BUILDIMAGE)
	mkdir -p $(TARGETDIR)
	docker cp $(CONTAINER):bin/server $(TARGETFILE)
	docker container rm $(CONTAINER)

	@echo Resulting binary file:
	@ls -l $(TARGETFILE)

.PHONY: INACTIVE-debian-executable-run-in-container
INACTIVE-debian-executable-run-in-container: INACTIVE-debian-executable-builder
	# INACTIVE, as adjustments are needed for the tauri app

	docker container run --rm --name $(CONTAINER) $(BUILDIMAGE)

.PHONY: INACTIVE-debian-executable-builder-rm
INACTIVE-debian-executable-builder-rm:
	# INACTIVE, as adjustments are needed for the tauri app

	docker image rm $(BUILDIMAGE)

.PHONY: icon
icon:
	cd src-tauri && cargo tauri icon fernrohr.png

.PHONY: clean
clean:
	cd src-tauri && cargo clean
	rm -rf target
	rm -f *.cdx.xml

.PHONY: all
all: help run build test\
		sbom-rust\
		clean
	# skip: sbom-npm
	# skip: run-in-container
	# skip: debian-executable-create debian-executable-run-in-container
