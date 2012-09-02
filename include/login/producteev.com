{
	"type":"login",
	"name": "Producteev",
	"address": "https://www.producteev.com/login.php",
	"form":
	{
		"action": "https://www.producteev.com/login.php#",
		"method": "post",
		"fields":
		{
			"email": "@name@",
			"password": "@password@",
			"after_login": ""
		}
	}
}
