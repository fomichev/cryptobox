{
	"type":"login",
	"name": "Busuu",
	"address": "http://www.busuu.com/",
	"form":
	{
		"action": "http://www.busuu.com/enc",
		"method": "post",
		"fields":
		{
			"name": "@name@",
			"pass": "@password@",
			"form_id": "user_login"
		}
	}
}
