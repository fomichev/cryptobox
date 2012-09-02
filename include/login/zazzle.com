{
	"type":"login",
	"name": "Zazzle.com",
	"address": "https://www.zazzle.com/lgn/signin",
	"form":
	{
		"action": "https://www.zazzle.com/lgn/signin",
		"method": "post",
		"fields":
		{
			"process": "login",
			"lru": "http://www.zazzle.com/",
			"tosmsg": "True",
			"login_username": "@name@",
			"login_password": "@password@"
		}
	}
}
