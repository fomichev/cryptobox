{
	"type":"login",
	"name": "deviantART",
	"address": "http://www.deviantart.com/",
	"form":
	{
		"action": "https://www.deviantart.com/users/login",
		"method": "post",
		"fields":
		{
			"ref": "",
			"username": "@name@",
			"password": "@password@",
			"remember_me": "1",
			"action": "Login"
		}
	}
}
