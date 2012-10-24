{
	"name": "Wunderkit",
	"address": "https://www.wunderkit.com/login",
	"form":
	{
		"action": "https://www.wunderkit.com/login",
		"method": "post",
		"fields":
		{
			"email": "<%= @vars[:name] %>",
			"password": "<%= @vars[:pass] %>",
			"forgot_password": "Reset password"
		}
	}
}
