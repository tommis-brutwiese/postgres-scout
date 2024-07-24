.PHONY: run
run:
	cd src-tauri && cargo run dev

.PHONY: build
build:
	cd src-tauri && cargo build --release

.PHONY: clean
clean:
	cd src-tauri && cargo clean