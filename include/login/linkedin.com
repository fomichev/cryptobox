{
	"type":"login",
	"name": "LinkedIn",
	"address": "https://www.linkedin.com/uas/login",
	"form":
	{
		"action": "https://www.linkedin.com/uas/login-submit",
		"method": "post",
		"fields":
		{
			"source_app": "",
			"session_key": "<%= @vars[:name] %>",
			"session_password": "<%= @vars[:pass] %>",
			"signin": "Sign In",
			"session_redirect": "",
			"csrfToken": "__token__",
			"sourceAlias": "__token__"
		}
	}
}
