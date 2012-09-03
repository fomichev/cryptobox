{
	"type":"login",
	"name": "resume.io",
	"address": "http://resume.io/login",
	"form":
	{
		"action": "http://resume.io/login",
		"method": "post",
		"fields":
		{
			"user[email]": "<%= @vars[:name] %>",
			"user[password]": "<%= @vars[:pass] %>"
		}
	}
}
