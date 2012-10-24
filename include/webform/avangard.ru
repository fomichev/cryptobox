{
	"name": "Банк Авангард",
	"address": "https://www.avangard.ru/login/logon_enter.html",
	"form":
	{
		"action": "https://www.avangard.ru/client4/afterlogin",
		"method": "post",
		"fields":
		{
			"login": "<%= @vars[:name] %>",
			"passwd": "<%= @vars[:pass] %>"
		}
	}
}
