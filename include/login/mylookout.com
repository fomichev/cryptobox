{
	"type":"login",
	"name": "Lookout",
	"address": "https://www.mylookout.com/user/login",
	"form":
	{
		"action": "https://www.mylookout.com/user/login",
		"method": "post",
		"fields":
		{
			"authenticity_token": "__token__",
			"redirect": "",
			"user[email]": "@name@",
			"user[password]": "@password@",
			"login": "Log In"
		}
	}
}
