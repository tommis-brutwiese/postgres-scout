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

.PHONY: clean
clean:
	cd src-tauri && cargo clean