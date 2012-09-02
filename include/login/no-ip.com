{
	"type":"login",
	"name": "No-IP",
	"address": "http://www.no-ip.com/login/",
	"form":
	{
		"action": "https://www.no-ip.com/login/",
		"method": "post",
		"fields":
		{
			"username": "@name@",
			"password": "@password@",
			"submit_login_page": "1",
			"Login": ""
		}
	}
}
