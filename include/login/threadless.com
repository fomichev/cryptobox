{
	"type":"login",
	"name": "Threadless",
	"address": "http://www.threadless.com/",
	"form":
	{
		"action": "https://www.threadless.com",
		"method": "post",
		"fields":
		{
			"username": "@name@",
			"password": "@password@",
			"login_threadless": "Login to Threadless!"
		}
	}
}
