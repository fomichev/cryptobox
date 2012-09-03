{
	"type":"login",
	"name": "CrashPlan",
	"address": "https://www.crashplan.com/account/login.vtl",
	"form":
	{
		"action": "https://www.crashplan.com/account/login.vtl",
		"method": "post",
		"fields":
		{
			"cid": "app.loginForm",
			"onSuccess": "/loginSuccess.vtl",
			"onFailure": "/account/login.vtl",
			"onCancel": "",
			"loginForm.username": "<%= @vars[:name] %>",
			"loginForm.password": "<%= @vars[:pass] %>",
			"loginForm.remember": "false"
		}
	}
}
