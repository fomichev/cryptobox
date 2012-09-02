{
	"type":"login",
	"name": "VKontakte",
	"address": "http://vk.com/",
	"form":
	{
		"action": "https://login.vk.com/?act=login",
		"method": "post",
		"fields":
		{
			"act": "login",
			"q": "1",
			"al_frame": "1",
			"expire": "",
			"captcha_sid": "",
			"captcha_key": "",
			"from_host": "vk.com",
			"from_protocol": "http",
			"ip_h": "9a65fa6d28ba1bd980",
			"email": "@name@",
			"pass": "@password@"
		}
	}
}
