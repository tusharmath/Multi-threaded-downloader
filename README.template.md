# mt-downloader

[![Join the chat at https://gitter.im/tusharmath/Multi-threaded-downloader](https://badges.gitter.im/tusharmath/Multi-threaded-downloader.svg)](https://gitter.im/tusharmath/Multi-threaded-downloader?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![Build Status](https://travis-ci.org/tusharmath/Multi-threaded-downloader.svg?branch=master)](https://travis-ci.org/tusharmath/Multi-threaded-downloader)
[![npm](https://img.shields.io/npm/v/mt-downloader.svg)](https://www.npmjs.com/package/mt-downloader)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)
[![Coverage Status](https://coveralls.io/repos/github/tusharmath/Multi-threaded-downloader/badge.svg)](https://coveralls.io/github/tusharmath/Multi-threaded-downloader)

This is a nodejs based utility library that helps in performing **resumable**, **multi-threaded** downloads over Http. The module is highly inspired by Speedbit's — [Download Accelerator Plus](http://www.speedbit.com/dap/).


## Features
0. **Multi connection downloads:** In a conventional download we don't completely utilize our bandwidth. With multiple connections there is always one thread which is getting data thus minimizing the wait period between data packets. **This doesn't mean that we will be able to download faster than what our ISP allows**.

0. **Stop and start from the last downloaded byte:** You don't have to worry about internet getting disconnected or your computer shutting down while downloading. You can quite easily start from the last byte that was downloaded.

0. **Console application:** If installed globally, `mtd` command would be available.

## Installation

The conventional npm installation process needs to be followed.

```bash
npm install mt-downloader --save
```

## CLI Installation

```bash
$ npm install -g mt-downloader
$ mtd --help
```

{{>main}}

## .mtd file
Once the download starts the library will create a file with a **.mtd** extension. This file contains some meta information related to the download and is a little bigger *(around 4kb)* than the original file size. The **.mtd** file can be used later to restart downloads from where the last byte that was downloaded. After the download is completed the downloader will truncate the `.mtd` file to remove that meta information.

## Releases
There are two release channels viz. — `latest` and `next`. The `next` is unstable and must be used with caution.

**Latest**
```bash
npm i mt-downloader
```
**Next**
```bash
npm i mt-downloader@next
```
