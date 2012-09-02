{
	"type":"login",
	"name": "Diginate",
	"address": "http://www.diginate.com/account/login/",
	"form":
	{
		"action": "http://www.diginate.com/account/login/",
		"method": "post",
		"fields":
		{
			"username": "@name@",
			"password": "@password@"
		}
	}
}
