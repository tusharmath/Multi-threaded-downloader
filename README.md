# mt-downloader

[![Join the chat at https://gitter.im/tusharmath/Multi-threaded-downloader](https://badges.gitter.im/tusharmath/Multi-threaded-downloader.svg)](https://gitter.im/tusharmath/Multi-threaded-downloader?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![Build Status](https://travis-ci.org/tusharmath/Multi-threaded-downloader.svg?branch=master)](https://travis-ci.org/tusharmath/Multi-threaded-downloader)
[![npm](https://img.shields.io/npm/v/mt-downloader.svg)](https://www.npmjs.com/package/mt-downloader)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)
[![Coverage Status](https://coveralls.io/repos/github/tusharmath/Multi-threaded-downloader/badge.svg)](https://coveralls.io/github/tusharmath/Multi-threaded-downloader)

This is a nodejs based module that helps you in performing **resumable**, **multi-threaded** downloads via Http. The module is highly inspired by Speedbit's — [Download Accelerator Plus](http://www.speedbit.com/dap/).


## Features
0. **Multi connection downloads:** In a conventional download we don't completely utilize our bandwidth. With multiple connections there is always one thread which is getting data thus minimizing the wait period between data packets. This doesn't mean that we will be able to download faster than what our ISP allows.

0. **Stop and start from the last downloaded byte:**. You don't have to worry about internet getting disconnected or your computer shutting down while downloading. You can quite easily start from the last byte that was downloaded.

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

<a name="module_mtd"></a>

## mtd
**Example**  
```js
import * as mtd from 'mt-downloader'
```

* [mtd](#module_mtd)
    * _static_
        * [.CreateMTDFile(options)](#module_mtd.CreateMTDFile) ⇒ <code>[Observable](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md)</code>
        * [.DownloadFromMTDFile(mtdPath)](#module_mtd.DownloadFromMTDFile) ⇒ <code>[Observable](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md)</code>
        * [.FinalizeDownload(meta$)](#module_mtd.FinalizeDownload) ⇒ <code>[Observable](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md)</code>
        * [.Completion(meta$)](#module_mtd.Completion) ⇒ <code>[Observable](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md)</code>
    * _inner_
        * [~Options](#module_mtd..Options) : <code>object</code>

<a name="module_mtd.CreateMTDFile"></a>

### mtd.CreateMTDFile(options) ⇒ <code>[Observable](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md)</code>
Creates a new .mtd file that is a little larger in size than the original
file. The file is initially empty and has all the relevant meta
information regarding the download appended to the end.

**Kind**: static method of <code>[mtd](#module_mtd)</code>  
**Returns**: <code>[Observable](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md)</code> - multiplexed stream  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>Options</code> | The `options` must have `mtdPath` and `url`. |

<a name="module_mtd.DownloadFromMTDFile"></a>

### mtd.DownloadFromMTDFile(mtdPath) ⇒ <code>[Observable](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md)</code>
Reads a `.mtd` file and resumes the download from the last successfully saved
byte.

**Kind**: static method of <code>[mtd](#module_mtd)</code>  
**Returns**: <code>[Observable](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md)</code> - multiplexed stream  

| Param | Type | Description |
| --- | --- | --- |
| mtdPath | <code>String</code> | Relative path to the `.mtd` file. |

<a name="module_mtd.FinalizeDownload"></a>

### mtd.FinalizeDownload(meta$) ⇒ <code>[Observable](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md)</code>
Removes the meta information and the `.mtd` extension from the file once the
download is successfully completed.

**Kind**: static method of <code>[mtd](#module_mtd)</code>  
**Returns**: <code>[Observable](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md)</code> - multiplexed stream  

| Param | Type | Description |
| --- | --- | --- |
| meta$ | <code>Observable</code> | Meta data stream ie. exposed by [DownloadFromMTDFile](DownloadFromMTDFile) |

<a name="module_mtd.Completion"></a>

### mtd.Completion(meta$) ⇒ <code>[Observable](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md)</code>
Util method that calculates the total completion percentage.

**Kind**: static method of <code>[mtd](#module_mtd)</code>  
**Returns**: <code>[Observable](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md)</code> - Value between 0 - 100  

| Param | Type | Description |
| --- | --- | --- |
| meta$ | <code>Observable</code> | Meta data stream ie. exposed by [DownloadFromMTDFile](DownloadFromMTDFile) |

<a name="module_mtd..Options"></a>

### mtd~Options : <code>object</code>
A dictionary of all the options required for the download.

**Kind**: inner namespace of <code>[mtd](#module_mtd)</code>  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| url | <code>string</code> |  | Download url. |
| path | <code>string</code> |  | Relative path where the file needs to be saved. |
| range | <code>number</code> | <code>3</code> | Number of concurrent downloads. |
| metaWrite | <code>number</code> | <code>300</code> | Throttles the write frequency of meta data. |


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
