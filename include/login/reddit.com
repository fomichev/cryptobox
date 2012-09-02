{
	"type":"login",
	"name": "Reddit",
	"address": "http://www.reddit.com/",
	"form":
	{
		"action": "https://ssl.reddit.com/post/login",
		"method": "post",
		"fields":
		{
			"op": "login-main",
			"user": "@name@",
			"passwd": "@password@",
			"rem": "on"
		}
	}
}
