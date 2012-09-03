{
	"type":"login",
	"name": "Appiny",
	"address": "http://appiny.ru/",
	"form":
	{
		"broken": true,
		"action": "http://appiny.ru/",
		"method": "post",
		"fields":
		{
			"LoginForm[email]": "<%= @vars[:name] %>",
			"LoginForm[password]": "<%= @vars[:pass] %>",
			"LoginForm[rememberMe]": "0"
		}
	}
}
