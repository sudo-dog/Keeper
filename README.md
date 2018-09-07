# Markus

[![Build Status](https://travis-ci.org/sudo-dog/Markus.svg?branch=master)](https://travis-ci.org/sudo-dog/Markus)
[![codecov](https://codecov.io/gh/sudo-dog/Markus/branch/master/graph/badge.svg)](https://codecov.io/gh/sudo-dog/Markus)
[![Version](https://img.shields.io/badge/Version-3.5.7-purple.svg?longCache=true)](https://github.com/sudo-dog/Markus)
[![Gitter](https://badges.gitter.im/WMXPY/Markus.svg)](https://gitter.im/Markus?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

:rainbow: My name is Markus; I am one of them; These are your images!

> Host your Markus and read the following simple documents to get starting!

## Install

### Via Clone

```bash
git clone https://github.com/sudo-dog/Markus.git
make install
```

### Via script

```bash
curl -sSL https://raw.githubusercontent.com/sudo-dog/Markus/master/bin/install.sh | sudo sh -
# or
wget -qO- https://raw.githubusercontent.com/sudo-dog/Markus/master/bin/install.sh | sudo sh -
```

## Host

```bash
# Use your process daemon controller
make build
node dist/script/service/service.js

# Run in terminal
make
```

## Test

```bash
make tests
```

## Documents

### Config

[Config your markus.conf](https://github.com/sudo-dog/Markus/wiki/Admin-Testing-API)

### APIS

Host your markus service in debug mode, and launch `<markus host domain>/doc` to see auto generated documentation.

### Markus SDKs

-   [Markus-SDK-Node](https://github.com/sudo-dog/Markus-SDK-Node)
-   [Markus-SDK-Fetch](https://github.com/sudo-dog/Markus-SDK-Fetch)

> Created by [Ghoti-CLI](https://github.com/WMXPY/Ghoti-CLI/) 4.1.2
