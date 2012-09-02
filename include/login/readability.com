{
	"type":"login",
	"name": "Readability",
	"address": "https://www.readability.com/readers/register",
	"form":
	{
		"action": "https://www.readability.com/readers/login/",
		"method": "post",
		"fields":
		{
			"csrfmiddlewaretoken": "__token__",
			"username": "@name@",
			"password": "@password@",
			"remember-me": "on",
			"next": ""
		}
	}
}
