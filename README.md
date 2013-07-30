#mt-downloader

This is a nodejs based application which help you in performing downloads via Http. Checkout [tusharm.com](http://tusharm.com/articles/mt-downloader/) to know more about this library.


##Features
1. **Multi threaded downloads:** In a conventional single threaded download you might experience poor performance due to network lags etc. So you don't completely utilize your bandwidth. With multi threads there is always one thread which is getting data thus minimizing the wait period between data packets.

2. **Stop and start from the last downloaded byte:**. You don't have to worry about internet getting disconnected or your computer shutting down while downloading. You can quite easily start from the last byte that was downloaded.

4. **Console application:** If you don't want to use it as a library, instead as an application we have a console application for you - [mt-console](https://github.com/tusharmath/mtd-console)

##Installation

The conventional nom installation process needs to be followed.

```bash
$ npm install mt-downloader
```

##mtd file 
Once the download starts the library will create a file with a **.mtd** extension. This file contains all meta information and is a little bigger *(around 10kb)* than than the original download. The **.mtd** file can be used later to restart downloads from where it stopped. After the download is completed the downloader will truncate the file to remove that meta data.

##New-Downloads
When you want to start a new download you just need to provide a download url and a download path and call the ```start()``` method.

```javascript
var mtd = require('mt-downloader');
	
var url = 'https://upload.wikimedia.org/wikipedia/commons/4/47/Gadget_the_pug_expressive_eyes.jpg';
var file = '/Users/tusharmathur/Desktop/temp/Gadget_the_pug_expressive_eyes.jpg';
	
var downloader = new mtd(file, url);
	
downloader.start();
```
	
See it in action [here](https://github.com/tusharmath/Multi-threaded-downloader/blob/master/demo/NewDownload.js) 
 
##Re-Downloads
If you want to restart a download from where it left off. You just need to provide the path of the **.mtd** file.

```javascript
	
var mtd = require('mt-downloader');
	
//File should have a .mtd extension
var file = '/Users/tusharmathur/Desktop/temp/Gadget_the_pug_expressive_eyes.jpg.mtd';
	
var downloader = new mtd(file);
	
downloader.start();
```

See it in action [here](https://github.com/tusharmath/Multi-threaded-downloader/blob/master/demo/ReDownload.js)

##Download Options
A set of custom options can be sent to control the way a download is performed.

```javascript
var options = {
		    //To set the total number of download threads
		    count: 2, //(Default: 6)
		    
		    //HTTP method
		    method: 'GET', //(Default: GET)
		    
		    //HTTP port
		    port: 80, //(Default: 80)
		    
		    //If no data is received the download times out.
		    timeout: 5, //(Default: 5 seconds)
		    
		    //Download Range, to control how much of the file dow you want to download.
		    range: '0-100', //(Default: '0-100')
		    
		    
		    //Triggered when the download is started
		    onStart: function(meta) {
		        console.log('Download Started', meta);
		    },
		    
		    //Triggered when the download is completed
		    onEnd: function(err, result) {
		        if (err) console.error(err);
		        console.log('Download Complete');
		    }
		};
```

##*onStart* Callback
The onStart method is called with some meta data. The main components are as follows - 

1. **url:** This is particularly useful when you want to know the url of a file which was downloaded from a .mtd file. As we learnt from above that we don't need to provide a url parameter to start a download from .mtd file.

2. **size:** This stores the actual download size of the file on the server from where it has to be downloaded.

3. **threads:** This stores the actual download thread information. Fields such as start, end and position. We will learn more about it later.

4. **headers:** You can get all the http Headers of the download in case you want to use them. For instance, you might want to use the **Content-Disposition** header to get the name of the downloaded file.
	
##*threads* Meta
The ```onStart``` callback return a **threads** object which stores all the information related to the download threads. This vital object is available of consumption for other libraries. With this object you can retrieve all kinds of information related to the download status of the file. A good example is to see it in action is to see how [mt-console](https://github.com/tusharmath/mtd-console) does it [here](https://github.com/tusharmath/mtd-console/blob/master/Analytics.js)

Each thread has a **connection** key which shows its downloading status, namely - 

1. **Idle:** It means that no connection has yet been established successfully.

2. **Open:** Connection has been made and data is getting received through this thread.

3. **Closed:** Download has been completed successfully for this thread.

4. **Failed:** Download abruptly ended for this thread.


**Important Note:** Never modify this object or else your download will be corrupted.