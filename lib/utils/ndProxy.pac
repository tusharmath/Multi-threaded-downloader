function FindProxyForURL(url, host) {
	var _proxy = "PROXY localhost:8080; DIRECT";
	return _proxy;
	if (shExpMatch(url, "*.youtube.com")) {
		return _proxy;
	}
	return "DIRECT";
}