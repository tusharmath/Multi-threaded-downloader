# [mt-downloader](http://tusharmath.github.io/Multi-threaded-downloader)


This is a multi threaded downloader which is made in nodejs. It is highly configurable and extremely efficient.

## Features
1. Supports virtually unlimited number of threads.
2. Auto selective re-download in case of failure.
3. Supports checksum verification.


## How to use
1. Install [nodejs](http://nodejs.org/) (skip if already done).
2. Install mt-downloader globally.

   ```bash
   npm install -g mt-downloader
   ```

3. Open the config file and set the default __download_path__ for your downloads. To know where your config file is located just type __mtd__ and search for the __Config:__ key word.

   ```bash
   mtd
   ```

4. Start using eg.

   ```bash
   mtd -u "http://mirror.switch.ch/ftp/mirror/videolan/vlc/2.0.6/macosx/vlc-2.0.6.dmg"
   ```

By default it will take the last bit of the url as the file name, alternatively you can pass the name of the file with the __-f__ parameter.

## Upcoming features!

1. Have a user interface.
2. Work as a proxy with video sites such as youtube so that buffering is completely removed.
3. Support partial downloads for eg - downloading from 30 to 70% of the complete file.

## Issues or Feature Requests?
Feel free to create one [here](https://github.com/tusharmath/Multi-threaded-downloader/issues/new)

__I Need help in developing code for this application so please contribute if you can!__