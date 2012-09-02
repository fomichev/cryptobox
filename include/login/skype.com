{
	"type":"login",
	"name": "Skype",
	"address": "https://login.skype.com/account/login-form?setlang=ru&return_url=https%3A%2F%2Fsecure.skype.com%2Faccount%2Flogin",
	"form":
	{
		"action": "https://login.skype.com/intl/ru/account/login-form",
		"method": "post",
		"fields":
		{
			"pie": "__token__",
			"etm": "__token__",
			"js_time": "",
			"timezone_field": "__token__",
			"username": "@name@",
			"password": "@password@",
			"blackbox": "__token__",
			"session_token": "__token__"
		}
	}
}
