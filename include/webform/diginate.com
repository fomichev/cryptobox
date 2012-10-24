{
	"name": "Diginate",
	"address": "http://www.diginate.com/account/login/",
	"form":
	{
		"action": "http://www.diginate.com/account/login/",
		"method": "post",
		"fields":
		{
			"username": "<%= @vars[:name] %>",
			"password": "<%= @vars[:pass] %>"
		}
	}
}
