# Postgres-Scout

A simple GUI application intended to VIEW and EXPLORE postgres databases. Manipulating database (CRUD) is intentionally NOT not part of the scope (though possible through direct SQL-commands, if these are enabled).

The longterm wish is to also enable connections with other database management systems, as well as non-relational databases or possibly brokers such as MQTT.

## Intentions

### In freeform wording...

The goal in mind is to make usage as easy for the user as possible. This includes some automagical stuff, such as automatically guessing the testing the correct database connection settings, showing all available databases when starting by default, just browsing by clicking on databases and table names.

In other words, be a guide by your hand, to show the important information while subtly pointing out fields of interest. Think "do you want to know more about ..." - to quote a famous movie.

Enable the user to focus on exploring and understanding content, rather than fighting with the technical bits.

In short: make it easy and fun for me to understand the data.

### Do what

- Opinionated database browser with automatic helpers
- Secondarily, be transparent
- Nice but simple UI
- Mac, Linux, Win
- Proactive Automagical or Each action user mandated? Proactive Automagical!

## Steps

1. Application hull (rust hello world) `OK`
2. License `POSTPONED UNTIL NEEDED`
3. Build Pipeline first:
   1. Build targets locally `OK`
   2. Build target via docker based builder `OK`(Debian)
4. Security
   1. Create software bill of materials (SBOM) `OK` (done for rust and npm - missing docker)
   2. Create security scoring for used dependencies `SKIP`
5. Testing
   1. Run tests for components `OK`
   2. Run tests for application (initially just empty hull)
6. Documentation
   1. Building `OK`
   2. Running `OK`
   3. Testing `OK`
   4. Architecture `SKIP` (not needed until tauri application exists)
7. Enhance application hull to tauri application hull
   1. Build
   2. Test
8. Initial version: copy from [desktop-gui-dingo (tauri-postgres)](https://github.com/tommis-dojo/desktop-gui-dingo), while reviewing sourcecode
9. Company internal (if needed): see [registry](doc/registry.md)

## Quickstart

Show available tasks:

    make

To simply build and run the software in development mode locally:

    make run

## Command line options

### Run with or without GUI

Run the application without GUI.

```
--gui=0  # run without gui
--gui=1  # run with gui (default)
```

### Close application automatically after open

The GUI and application is closed automatically shortly after start. This is
intended for testing purposes and automation, e.g. when running the
application from the build process.

```
--autoclose-after-init    # gui closes automatically after init
--autoclose-after-init=1  # gui closes automatically after init
--autoclose-after-init=0  # gui stays open (default behavior)
```

Note that at time of writing, this only works if the application is run in
GUI mode.

## Additional information

- [Building and running](doc/build-and-run.md): how to build for production, building for debian, inside a container, etc.
- [Testing](doc/testing.md): Running the tests
