{
	"type":"login",
	"name": "Facebook",
	"address": "http://www.facebook.com/",
	"form":
	{
		"action": "https://www.facebook.com/login.php?login_attempt=1",
		"method": "post",
		"fields":
		{
			"lsd": "AVpaXg_I",
			"email": "@name@",
			"pass": "@password@",
			"persistent": "1",
			"default_persistent": "0",
			"charset_test": "€,´,€,´,水,Д,Є",
			"timezone": "-240",
			"lgnrnd": "084726_cNVY",
			"lgnjs": "1341157650",
			"locale": "en_US"
		}
	}
}
