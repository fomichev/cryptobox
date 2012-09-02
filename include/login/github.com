{
	"name": "GitHub",
	"address": "https://github.com/login",
	"form":
	{
		"action": "https://github.com/session",
		"method": "post",
		"fields":
		{
			"authenticity_token": "__token__",
			"login": "@name@",
			"password": "@password@",
			"commit": "Log in"
		}
	}
}
