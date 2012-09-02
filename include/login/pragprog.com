{
	"type":"login",
	"name": "The Pragmatic Bookshelf",
	"address": "https://pragprog.com/login",
	"form":
	{
		"action": "https://pragprog.com/session",
		"method": "post",
		"fields":
		{
			"utf8": "✓",
			"authenticity_token": "__token__",
			"email": "@name@",
			"password": "@password@",
			"identity_url": "Click to Sign In",
			"remember_me": "1"
		}
	}
}
