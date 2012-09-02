{
	"type":"login",
	"name": "Boxcar",
	"address": "http://boxcar.io/sign-in",
	"form":
	{
		"action": "http://boxcar.io/site/sessions",
		"method": "post",
		"fields":
		{
			"session[email]": "@name@",
			"session[password]": "@password@",
			"session[remember_token]": "0",
			"commit": "Sign In"
		}
	}
}
