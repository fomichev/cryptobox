{
	"type":"login",
	"name": "Rosyama",
	"address": "http://rosyama.ru/userGroups/",
	"form":
	{
		"action": "http://rosyama.ru/userGroups/",
		"method": "post",
		"fields":
		{
			"UserGroupsUser[username]": "<%= @vars[:name] %>",
			"UserGroupsUser[password]": "<%= @vars[:pass] %>",
			"UserGroupsUser[rememberMe]": "0",
			"UserGroupsUser[rememberMe]": "1",
			"yt0": "Войти"
		}
	}
}
