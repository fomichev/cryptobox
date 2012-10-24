{
	"name": "Twitter",
	"address": "http://twitter.com/",
	"form":
	{
		"action": "https://twitter.com/sessions?phx=1",
		"method": "post",
		"fields":
		{
			"session[username_or_email]": "<%= @vars[:name] %>",
			"session[password]": "<%= @vars[:pass] %>",
			"remember_me": "0",
			"scribe_log": "",
			"redirect_after_login": "",
			"authenticity_token": "__token__"
		}
	}
}
