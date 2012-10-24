{
	"name": "Gravatar",
	"address": "https://en.gravatar.com/site/login/",
	"form":
	{
		"action": "https://en.gravatar.com/sessions/",
		"method": "post",
		"fields":
		{
			"user": "<%= @vars[:name] %>",
			"pass": "<%= @vars[:pass] %>",
			"commit": "Login"
		}
	}
}
