{
	"type":"login",
	"name": "Stack Overflow",
	"address": "http://stackoverflow.com/users/login#log-in",
	"form":
	{
		"action": "https://stackoverflow/affiliate/form/login/submit",
		"method": "post",
		"fields":
		{
			"email": "@name@",
			"password": "@password@"
		}
	}
}
