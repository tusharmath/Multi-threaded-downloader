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
	"status_update_every": 1000,

	//Default download path
	"download_path": "/Users/tusharmathur/desktop/temp/",

	//Enable disable the logger
	"show_download_status": true,

	//Type of logger
	"analytics_logger": "console"
};