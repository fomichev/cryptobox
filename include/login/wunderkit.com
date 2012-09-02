{
	"type":"login",
	"name": "Wunderkit",
	"address": "https://www.wunderkit.com/login",
	"form":
	{
		"action": "https://www.wunderkit.com/login",
		"method": "post",
		"fields":
		{
			"email": "@name@",
			"password": "@password@",
			"forgot_password": "Reset password"
		}
	}
}
