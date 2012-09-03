{
	"type":"login",
	"name": "Ford Focus Club",
	"address": "http://ffclub.ru/forum/",
	"form":
	{
		"action": "http://ffclub.ru/forum/index.php?act=Login&CODE=01",
		"method": "post",
		"fields":
		{
			"referer": "http://ffclub.ru/forum/",
			"UserName": "<%= @vars[:name] %>",
			"PassWord": "<%= @vars[:pass] %>",
			"submit": "Войти",
			"CookieDate": "1",
			"Privacy": "1"
		}
	}
}
