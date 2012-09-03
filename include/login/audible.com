{
	"type":"login",
	"name": "Audible.com",
	"address": "https://www.audible.com/sign-in",
	"form":
	{
		"action": "https://www.audible.com/sign-in/ref=ah_signin",
		"method": "post",
		"fields":
		{
			"email": "<%= @vars[:name] %>",
			"password": "<%= @vars[:pass] %>",
			"appActionToken": "__token__",
			"appAction": "audibleAction",
			"rdpath": "",
			"metadata1": "__token__"
		}
	}
}
