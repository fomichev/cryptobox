{
	"name": "Xmarks",
	"address": "https://login.xmarks.com/?referrer=https%3A%2F%2Fwww.xmarks.com%2F&mode=",
	"form":
	{
		"action": "https://login.xmarks.com/login/login?referrer=https%3A%2F%2Fwww.xmarks.com%2F&mode=",
		"method": "post",
		"fields":
		{
			"username": "@name@",
			"password": "@password@",
			"referrer": "https://www.xmarks.com/",
			"append": "",
			"token": "__token__",
			"passwordhash": ""
		}
	}
}
