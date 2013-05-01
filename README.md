Multi-threaded-downloader (0.0.1)
=================================



This is a multi threaded downloader which is made in nodejs. It is highly configurable and extremely efficient.

Features
--------
1. Supports virtually unlimted number of threads.
2. Supports partial downloads for eg - downloading from 30 to 70% of the complete file.
3. Supports restarting of failed downloads (Downloads only the parts that were not downloaded).


How to use
----------
1. Install Nodejs.
2. Clone the repository.

	```bash
	git clone https://github.com/tusharmath/Multi-threaded-downloader.git
	```
3. Navigate to the root folder of the project.
4. Create a global command line alias.

	```bash
	npm link
	```
5. Start using eg.

	```bash
	mtd -u "http://mirror.switch.ch/ftp/mirror/videolan/vlc/2.0.6/macosx/vlc-2.0.6.dmg" -p "vlc-2.0.6.dmg"
	```

6. Open the Config.json for configuring your downloads.


Upcomming features!
-------------------
1. Create a user interface.
2. Have different video download algorithms to boost up video download performance.
3. Work as a proxy with video sites such as youtube so that buffering is completely removed.