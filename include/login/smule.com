{
	"type":"login",
	"name": "Smule",
	"address": "http://www.smule.com/user/login?redirection_url=http%3A%2F%2Fwww.smule.com%2F",
	"form":
	{
		"action": "http://www.smule.com/user/login",
		"method": "post",
		"fields":
		{
			"utf8": "✓",
			"authenticity_token": "__token__",
			"user[login]": "<%= @vars[:name] %>",
			"user[password]": "<%= @vars[:pass] %>",
			"commit": "Log in"
		}
	}
}
