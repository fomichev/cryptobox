{
	"type":"login",
	"name": "Hover",
	"address": "https://www.hover.com/signin",
	"form":
	{
		"action": "https://www.hover.com/signin",
		"method": "post",
		"fields":
		{
			"username": "@name@",
			"password": "@password@",
			"remember": "no"
		}
	}
}
