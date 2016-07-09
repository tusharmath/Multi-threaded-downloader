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

## Objects

* [FILE](#FILE) : <code>object</code>
    * [.open(params$)](#FILE.open) ⇒ <code>[Observable](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md)</code>
    * [.fstat(params$)](#FILE.fstat) ⇒ <code>[Observable](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md)</code>
    * [.read(params$)](#FILE.read) ⇒ <code>[Observable](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md)</code>
    * [.write(params$)](#FILE.write) ⇒ <code>[Observable](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md)</code>
    * [.close(params$)](#FILE.close) ⇒ <code>[Observable](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md)</code>
    * [.truncate(params$)](#FILE.truncate) ⇒ <code>[Observable](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md)</code>
    * [.rename(params$)](#FILE.rename) ⇒ <code>[Observable](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md)</code>
* [HTTP](#HTTP) : <code>object</code>
    * [.request(params)](#HTTP.request) ⇒ <code>[Observable](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md)</code>

## Functions

* [CreateMTDFile(options)](#CreateMTDFile) ⇒ <code>[Observable](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md)</code>
* [DownloadFromMTDFile(mtdPath, [meta])](#DownloadFromMTDFile) ⇒ <code>[Observable](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md)</code>
* [FinalizeDownload(params)](#FinalizeDownload) ⇒ <code>[Observable](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md)</code>
* [Completion(meta$)](#Completion) ⇒ <code>[Observable](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md)</code>

<a name="FILE"></a>

## FILE : <code>object</code>
Provides wrappers over the async utils inside the
[fs module](https://nodejs.org/api/fs.html).
The wrappers take in an input stream of arguments
and returns the result of function call as another stream.

**Kind**: global namespace  

* [FILE](#FILE) : <code>object</code>
    * [.open(params$)](#FILE.open) ⇒ <code>[Observable](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md)</code>
    * [.fstat(params$)](#FILE.fstat) ⇒ <code>[Observable](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md)</code>
    * [.read(params$)](#FILE.read) ⇒ <code>[Observable](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md)</code>
    * [.write(params$)](#FILE.write) ⇒ <code>[Observable](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md)</code>
    * [.close(params$)](#FILE.close) ⇒ <code>[Observable](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md)</code>
    * [.truncate(params$)](#FILE.truncate) ⇒ <code>[Observable](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md)</code>
    * [.rename(params$)](#FILE.rename) ⇒ <code>[Observable](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md)</code>

<a name="FILE.open"></a>

### FILE.open(params$) ⇒ <code>[Observable](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md)</code>
**Kind**: static method of <code>[FILE](#FILE)</code>  

| Param | Type |
| --- | --- |
| params$ | <code>[Observable](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md)</code> | 

<a name="FILE.fstat"></a>

### FILE.fstat(params$) ⇒ <code>[Observable](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md)</code>
[https://nodejs.org/api/fs.html#fs_fs_open_path_flags_mode_callback](https://nodejs.org/api/fs.html#fs_fs_open_path_flags_mode_callback)

**Kind**: static method of <code>[FILE](#FILE)</code>  

| Param | Type |
| --- | --- |
| params$ | <code>[Observable](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md)</code> | 

<a name="FILE.read"></a>

### FILE.read(params$) ⇒ <code>[Observable](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md)</code>
[https://nodejs.org/api/fs.html#fs_fs_read_fd_buffer_offset_length_position_callback](https://nodejs.org/api/fs.html#fs_fs_read_fd_buffer_offset_length_position_callback)

**Kind**: static method of <code>[FILE](#FILE)</code>  

| Param | Type |
| --- | --- |
| params$ | <code>[Observable](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md)</code> | 

<a name="FILE.write"></a>

### FILE.write(params$) ⇒ <code>[Observable](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md)</code>
[https://nodejs.org/api/fs.html#fs_fs_write_fd_buffer_offset_length_position_callback](https://nodejs.org/api/fs.html#fs_fs_write_fd_buffer_offset_length_position_callback)

**Kind**: static method of <code>[FILE](#FILE)</code>  

| Param | Type |
| --- | --- |
| params$ | <code>[Observable](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md)</code> | 

<a name="FILE.close"></a>

### FILE.close(params$) ⇒ <code>[Observable](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md)</code>
[https://nodejs.org/api/fs.html#fs_fs_close_fd_callback](https://nodejs.org/api/fs.html#fs_fs_close_fd_callback)

**Kind**: static method of <code>[FILE](#FILE)</code>  

| Param | Type |
| --- | --- |
| params$ | <code>[Observable](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md)</code> | 

<a name="FILE.truncate"></a>

### FILE.truncate(params$) ⇒ <code>[Observable](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md)</code>
[https://nodejs.org/api/fs.html#fs_fs_truncate_path_len_callback](https://nodejs.org/api/fs.html#fs_fs_truncate_path_len_callback)

**Kind**: static method of <code>[FILE](#FILE)</code>  

| Param | Type |
| --- | --- |
| params$ | <code>[Observable](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md)</code> | 

<a name="FILE.rename"></a>

### FILE.rename(params$) ⇒ <code>[Observable](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md)</code>
[https://nodejs.org/api/fs.html#fs_fs_rename_oldpath_newpath_callback](https://nodejs.org/api/fs.html#fs_fs_rename_oldpath_newpath_callback)

**Kind**: static method of <code>[FILE](#FILE)</code>  

| Param | Type |
| --- | --- |
| params$ | <code>[Observable](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md)</code> | 

<a name="HTTP"></a>

## HTTP : <code>object</code>
**Kind**: global namespace  
<a name="HTTP.request"></a>

### HTTP.request(params) ⇒ <code>[Observable](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md)</code>
Stream based wrapper over [npm/request](https://www.npmjs.com/package/request)

**Kind**: static method of <code>[HTTP](#HTTP)</code>  
**Returns**: <code>[Observable](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md)</code> - multiplex stream  

| Param | Type | Description |
| --- | --- | --- |
| params | <code>object</code> | [ request](https://www.npmjs.com/package/request) module params. |

<a name="CreateMTDFile"></a>

## CreateMTDFile(options) ⇒ <code>[Observable](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md)</code>
Creates a new .mtd file that is a little larger in size than the original
file. The file is initially empty and has all the relevant meta
information regarding the download appended to the end.

**Kind**: global function  
**Returns**: <code>[Observable](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md)</code> - A [multiplexed stream](https://github.com/tusharmath/muxer) containing ~
- `written$` - Bytes being saved on disk.
- `meta$` - Meta information about the download.
- `remoteFileSize$` - Size of the content that is to be downloaded.
- `fdW$` - File descriptor in `w` mode.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>object</code> |  | The `options` must have `mtdPath` and `url`. |
| options.url | <code>string</code> |  | Download url. |
| options.path | <code>string</code> |  | Relative path where the file needs to be saved. |
| [options.range] | <code>number</code> | <code>3</code> | Number of concurrent downloads. |
| [options.metaWrite] | <code>number</code> | <code>300</code> | Throttles the write frequency of meta data. |

<a name="DownloadFromMTDFile"></a>

## DownloadFromMTDFile(mtdPath, [meta]) ⇒ <code>[Observable](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md)</code>
Reads a `.mtd` file and resumes the download from the last successfully saved
byte.

**Kind**: global function  
**Returns**: <code>[Observable](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md)</code> - A [multiplexed stream](https://github.com/tusharmath/muxer) containing ~
- `metaWritten$` - Meta data buffer stream.
- `response$` - HTTP response object.
- `responses$` - List of all the HTTP response objects.
- `localFileSize$` - Size of the `.mtd` file on disk.
- `fdR$` - File Descriptor in `r+` mode.
- `meta$` - Download meta information.  

| Param | Type | Description |
| --- | --- | --- |
| mtdPath | <code>String</code> | Relative path to the `.mtd` file. |
| [meta] | <code>Object</code> | Optional meta data to override the one that's being loaded from the `.mtd` file. |

<a name="FinalizeDownload"></a>

## FinalizeDownload(params) ⇒ <code>[Observable](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md)</code>
Removes the meta information and the `.mtd` extension from the file once the
download is successfully completed.

**Kind**: global function  
**Returns**: <code>[Observable](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md)</code> - A [multiplexed stream](https://github.com/tusharmath/muxer) containing ~
- `truncated$` - Fired when the meta data is removed.
- `renamed$` - Fired when the `.mtd` extension is removed.  

| Param | Type | Description |
| --- | --- | --- |
| params | <code>object</code> | `{fd$, meta$}` |
| params.fd$ | <code>[Observable](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md)</code> | File descriptor Observable |
| params.meta$ | <code>[Observable](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md)</code> | Download meta information |

<a name="Completion"></a>

## Completion(meta$) ⇒ <code>[Observable](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md)</code>
Util method that calculates the total completion percentage (between 0-100).

**Kind**: global function  
**Returns**: <code>[Observable](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md)</code> - Value between 0-100  

| Param | Type | Description |
| --- | --- | --- |
| meta$ | <code>Observable</code> | Meta data stream ie. exposed by [DownloadFromMTDFile](#DownloadFromMTDFile) |


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
