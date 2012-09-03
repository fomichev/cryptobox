{
	"name": "Fab.com",
	"address": "http://fab.com/",
	"form":
	{
		"action": "https://fab.com/?",
		"method": "post",
		"fields":
		{
			"utf8": "✓",
			"user[un_or_email]": "<%= @vars[:name] %>",
			"user[password]": "<%= @vars[:pass] %>",
			"user[form_type]": "login",
			"user[referrer_url]": "",
			"invitecode": "",
			"fref": "",
			"frefl": "",
			"nan_pid": ""
		}
	}
}
