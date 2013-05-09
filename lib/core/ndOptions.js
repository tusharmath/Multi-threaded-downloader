module.exports = {
	"retry_on_failure": true,

	//If true then the logs are not deleted after the file download is completed
	"save_download_log": true,

	//A JSON file containing the thread information is created
	"create_download_log": true,


	//Default number of threads
	"thread_count": 32,

	//Thread creation style
	"thread_style": "equal",

	//Duration of updating the selected logger
	"status_update_every": 5000,

	//Default download path
	"download_path": "/Users/tusharmathur/desktop/temp/",

	//Type of logger <console, none>
	"analytics_logger": "console",

	//Details to be logged on the console
	/*[
		"completed",
		"speed",
		"time",
		"eta",
		"dataReceived",
		"activeThreads",
		"completedThreads"
		"threadPositions"
		]*/
	"console_log_info": [
		"completed",
		"speed",
		"time",
		"eta",
		"dataReceived",
		"downloadSize",
		"openConnections",
		"closedConnections"]
};