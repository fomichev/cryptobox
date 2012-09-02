{
	"type":"login",
	"name": "Zinio",
	"address": "https://ru.zinio.com/account/login.jsp",
	"form":
	{
		"action": "https://ru.zinio.com/account/login.jsp?_DARGS=/account/f-account-login.jsp",
		"method": "post",
		"fields":
		{
			"_dyncharset": "UTF-8",
			"_dynSessConf": "5408764597036918482",
			"/atg/userprofiling/ProfileFormHandler.value.login": "@name@",
			"_D:/atg/userprofiling/ProfileFormHandler.value.login": " ",
			"/atg/userprofiling/ProfileFormHandler.value.password": "@password@",
			"_D:/atg/userprofiling/ProfileFormHandler.value.password": " ",
			"/atg/userprofiling/ProfileFormHandler.login": "Войти",
			"_D:/atg/userprofiling/ProfileFormHandler.login": " ",
			"/atg/userprofiling/ProfileFormHandler.showPreferencesIfNeeded": "true",
			"_D:/atg/userprofiling/ProfileFormHandler.showPreferencesIfNeeded": " ",
			"/atg/userprofiling/ProfileFormHandler.loginSuccessURL": "../index.jsp",
			"_D:/atg/userprofiling/ProfileFormHandler.loginSuccessURL": " ",
			"/atg/userprofiling/ProfileFormHandler.login": "submit",
			"_D:/atg/userprofiling/ProfileFormHandler.login": " ",
			"_DARGS": "/account/f-account-login.jsp"
		}
	}
}
