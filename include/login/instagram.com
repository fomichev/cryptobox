{
	"type":"login",
	"name": "Instagram",
	"address": "https://instagram.com/accounts/login/?next=/accounts/edit/",
	"form":
	{
		"action": "https://instagram.com/accounts/login/?next=/accounts/edit/",
		"method": "post",
		"fields":
		{
			"csrfmiddlewaretoken": "__token__",
			"username": "@name@",
			"password": "@password@"
		}
	}
}
