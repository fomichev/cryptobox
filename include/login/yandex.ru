{
	"type":"login",
	"name": "Яндекс.Почта",
	"address": "http://mail.yandex.ru/",
	"form":
	{
		"action": "http://passport.yandex.ru/passport?mode=auth&from=mail",
		"method": "post",
		"fields":
		{
			"retpath": "http%3A%2F%2Fmail.yandex.ru%2F",
			"login": "@name@",
			"passwd": "@password@",
			"twoweeks": "yes",
			"timestamp": ""
		}
	}
}
