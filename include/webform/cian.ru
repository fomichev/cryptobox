{
	"name": "ЦИАН",
	"address": "http://www.cian.ru/",
	"form":
	{
		"action": "http://www.cian.ru/users.php?mode=login",
		"method": "post",
		"fields":
		{
			"remember": "0",
			"id_user": "<%= @vars[:name] %>",
			"password": "<%= @vars[:pass] %>"
		}
	}
}
