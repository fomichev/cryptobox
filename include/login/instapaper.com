{
	"type":"login",
	"name": "Instapaper",
	"address": "http://www.instapaper.com/user/login",
	"form":
	{
		"action": "http://www.instapaper.com/user/login",
		"method": "post",
		"fields":
		{
			"username": "@name@",
			"password": "@password@"
		}
	}
}
