{
	"type":"login",
	"name": "Gravatar",
	"address": "https://en.gravatar.com/site/login/",
	"form":
	{
		"action": "https://en.gravatar.com/sessions/",
		"method": "post",
		"fields":
		{
			"user": "@name@",
			"pass": "@password@",
			"commit": "Login"
		}
	}
}
