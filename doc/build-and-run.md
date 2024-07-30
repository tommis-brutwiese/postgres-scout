# Building and running

To see all available make-tasks, just type:

    make

## Building and running locally

To build and run the software in development mode locally:

    make run

<!--
Running in development mode, you edit most of the program files (`.rs`, `.js`, ...)
while the program is running, and the program will either reload them or rebuild the
application and restart.
-->

To build the software in releasemode locally:

    make build

## Running the software using a container

To run the software inside a docker-compose:

    make run-in-container

## Building a debian package

To build a debian executable using a container:

    make build-debian-executable

