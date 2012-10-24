{
	"name": "Threadless",
	"address": "http://www.threadless.com/",
	"form":
	{
		"action": "https://www.threadless.com",
		"method": "post",
		"fields":
		{
			"username": "<%= @vars[:name] %>",
			"password": "<%= @vars[:pass] %>",
			"login_threadless": "Login to Threadless!"
		}
	}
}
