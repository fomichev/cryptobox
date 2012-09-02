{
	"type":"login",
	"name": "Pocket",
	"address": "http://getpocket.com/l/",
	"form":
	{
		"action": "http://getpocket.com/login_process/",
		"method": "post",
		"fields":
		{
			"feed_id": "@name@",
			"password": "@password@",
			"form_check": "__token__"
		}
	}
}
