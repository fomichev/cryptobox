{
	"name": "Dropbox",
	"address": "https://www.dropbox.com/",
	"form":
	{
		"action":"https://www.dropbox.com/login",
		"method": "post",
		"fields":
		{
			"login_email": "<%= @vars[:name] %>",
			"login_password": "<%= @vars[:pass] %>",
			"remember_me": "on",
			"cont": "/home"
		}
	}
}
