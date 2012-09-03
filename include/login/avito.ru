{
	"type":"login",
	"name": "AVITO.ru",
	"address": "http://www.avito.ru/profile",
	"form":
	{
		"broken": true,
		"action": "http://www.avito.ru/profile",
		"method": "post",
		"fields":
		{
			"login": "<%= @vars[:name] %>",
			"password": "<%= @vars[:pass] %>",
			"quick_expire": "on",
			"submit": "logon"
		}
	}
}
