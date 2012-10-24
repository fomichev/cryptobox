{
	"name": "Producteev",
	"address": "https://www.producteev.com/login.php",
	"form":
	{
		"action": "https://www.producteev.com/login.php#",
		"method": "post",
		"fields":
		{
			"email": "<%= @vars[:name] %>",
			"password": "<%= @vars[:pass] %>",
			"after_login": ""
		}
	}
}
