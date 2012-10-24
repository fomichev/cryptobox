{
	"name": "Хабрахабр",
	"address": "http://habrahabr.ru/login/",
	"form":
	{
		"action": "http://habrahabr.ru/login/",
		"method": "post",
		"fields":
		{
			"login": "<%= @vars[:name] %>",
			"password": "<%= @vars[:pass] %>",
			"captcha": ""
		}
	}
}
