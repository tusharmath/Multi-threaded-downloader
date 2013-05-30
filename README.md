
# [mt-downloader](http://tusharmath.github.io/Multi-threaded-downloader)

This is a multi threaded downloader which is made in nodejs. It is highly configurable and extremely efficient.

## Distinctive Features
*  Supports virtually unlimited number of threads.  

*  Auto selective re-download in case of failure.  

*  Supports checksum verification.  

*  Extensive control over the application using custom configurations.


## How to use
1. Install [nodejs](http://nodejs.org/) (skip if already done).

2. Install mt-downloader globally.

   ```bash
   $ npm install -g mt-downloader
   ```

3. Set a user config file.

   ```bash
   $ mtd --config /Users/james/Desktop/
   ```
   This will create a config file _mt-downloader.config.json_ which will give you all the configurable options.

4. Start using like this -

   ```bash
   $ mtd -u "http://mirror.switch.ch/ftp/mirror/videolan/vlc/2.0.6/macosx/vlc-2.0.6.dmg"
   ```

   By default it will take the last bit of the url as the file name. In this case the file will be downloaded in the default directory (Specified in config) and will be automatically name 'vlc-2.0.6.dmg'.  

   Alternatively you can pass the name of the file with the _-f_ parameter like this -

   ```bash
   $ mtd -u "http://mirror.switch.ch/ftp/mirror/videolan/vlc/2.0.6/macosx/vlc-2.0.6.dmg" -f "vlc.latest.dmg"

   ```

## Current work on the develop branch
 1. Refactoring the code to make it more modular.
 2. The downloader should be usable through code.
 3. Some feature improvements.


## Issues or Feature Requests?
   Feel free to create one [here](https://github.com/tusharmath/Multi-threaded-downloader/issues/new)
   
   _I Need help in developing code for this application so please contribute if you can!_
