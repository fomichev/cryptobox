{
	"type":"login",
	"name": "Springpad",
	"address": "http://springpad.com/login",
	"form":
	{
		"action": "https://springpad.com/processLogin.action",
		"method": "post",
		"fields":
		{
			"username": "@name@",
			"password": "@password@"
		}
	}
}
