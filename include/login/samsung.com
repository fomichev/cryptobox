{
	"type":"login",
	"name": "Samsung",
	"address": "https://account.samsung.com/account/signIn.do",
	"form":
	{
		"action": "https://account.samsung.com/account/signIn.do",
		"method": "post",
		"fields":
		{
			"serviceID": "199r2a1fk7",
			"inputUserID": "@name@",
			"inputPassword": "@password@",
			"remIdCheck": "on"
		}
	}
}
