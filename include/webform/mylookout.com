{
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
			"user[email]": "<%= @vars[:name] %>",
			"user[password]": "<%= @vars[:pass] %>",
			"login": "Log In"
		}
	}
}
