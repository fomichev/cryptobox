{
	"type":"login",
	"name": "OpenDNS",
	"address": "https://www.opendns.com/auth/?return_to=http%3A%2F%2Fdashboard.opendns.com%2F",
	"form":
	{
		"action": "https://www.opendns.com/auth/",
		"method": "post",
		"fields":
		{
			"username": "@name@",
			"password": "@password@",
			"dont_expire": "on",
			"sign-in": "Sign in",
			"return_to": "http://dashboard.opendns.com/",
			"formtoken": "__token__"
		}
	}
}
