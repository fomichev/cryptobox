{
	"type":"login",
	"name": "Spool",
	"address": "https://getspool.com/login",
	"form":
	{
		"action": "",
		"method": "post",
		"fields":
		{
			"login_email": "<%= @vars[:name] %>",
			"login_password": "<%= @vars[:pass] %>",
			"login_button": "Login"
		}
	}
}
