{
	"type":"login",
	"name": "Evernote",
	"address": "https://www.evernote.com/Login.action?message=registration.confirmation.complete",
	"form":
	{
		"action": "https://www.evernote.com/Login.action;jsessionid=53F841E89ED05D8EFB65B4C518757AE7",
		"method": "post",
		"fields":
		{
			"username": "@name@",
			"password": "@password@",
			"rememberMe": "true",
			"targetUrl": "",
			"login": "Sign in",
			"_sourcePage": "__token__",
			"__fp": "__token__"
		}
	}
}
