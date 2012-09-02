{
	"type":"login",
	"name": "PlayStation",
	"address": "http://playstation.com",
	"form":
	{
		"action": "https://store.playstation.com/j_acegi_external_security_check?target=/external/loginDefault.action",
		"method": "post",
		"fields":
		{
			"loginName": "@name@",
			"password": "@password@"
		}
	}
}
