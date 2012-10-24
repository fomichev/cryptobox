{
	"name": "deviantART",
	"address": "http://www.deviantart.com/",
	"form":
	{
		"action": "https://www.deviantart.com/users/login",
		"method": "post",
		"fields":
		{
			"ref": "",
			"username": "<%= @vars[:name] %>",
			"password": "<%= @vars[:pass] %>",
			"remember_me": "1",
			"action": "Login"
		}
	}
}
