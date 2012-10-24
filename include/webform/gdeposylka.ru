{
	"name": "ГдеПосылка.ру",
	"address": "http://gdeposylka.ru/auth/login",
	"form":
	{
		"action": "http://gdeposylka.ru/auth/login",
		"method": "post",
		"fields":
		{
			"token": "__token__",
			"username": "<%= @vars[:name] %>",
			"password": "<%= @vars[:pass] %>",
			"sid": ""
		}
	}
}
