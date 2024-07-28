APPNAME := postgres-scout

.PHONY: run
run:
	cd src-tauri && cargo run dev

.PHONY: build
build:
	cd src-tauri && cargo build --release

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

.PHONY: build-debian-executable
build-debian-executable:
	cd src-tauri && docker build -t $(BUILDIMAGE) -f Dockerfile.$(TARGETOS) --build-arg DEBIAN_VERSION=$(VERSION) .
	docker container create --name $(CONTAINER) $(BUILDIMAGE)
	mkdir -p $(TARGETDIR)
	docker cp $(CONTAINER):bin/server $(TARGETFILE)
	docker container rm $(CONTAINER)
	docker image rm $(BUILDIMAGE)
	@echo Resulting binary file:
	@ls -l $(TARGETFILE)

.PHONY: clean
clean:
	cd src-tauri && cargo clean
	rm -rf target