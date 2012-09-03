{
	"type":"login",
	"name": "IFTTT",
	"address": "https://ifttt.com/login",
	"form":
	{
		"action": "https://ifttt.com/session",
		"method": "post",
		"fields":
		{
			"utf8": "✓",
			"authenticity_token": "__token__",
			"login": "<%= @vars[:name] %>",
			"password": "<%= @vars[:pass] %>",
			"remember_me": "1",
			"commit": "Sign in"
		}
	}
}
