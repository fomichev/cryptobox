{
	"type":"login",
	"name": "Bookmate",
	"address": "http://bookmate.com/login?return_to=%2F",
	"form":
	{
		"broken": true,
		"action": "http://bookmate.com/login",
		"method": "post",
		"fields":
		{
			"utf8": "✓",
			"authenticity_token": "__token__",
			"user_session[login]": "@name@",
			"user_session[password]": "$passworf",
			"not_remember_me": "1"
		}
	}
}
