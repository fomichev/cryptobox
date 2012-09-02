{
	"type":"login",
	"name": "Remember The Milk",
	"address": "https://www.rememberthemilk.com/login/",
	"form":
	{
		"action": "https://www.rememberthemilk.com/auth.rtm",
		"method": "post",
		"fields":
		{
			"username": "@name@",
			"password": "@password@",
			"remember": "on",
			"login": "Login",
			"continue": "home",
			"secure": "1",
			"u": "1"
		}
	}
}
