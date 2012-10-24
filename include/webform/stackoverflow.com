{
	"name": "Stack Overflow",
	"address": "http://stackoverflow.com/users/login#log-in",
	"form":
	{
		"action": "https://stackoverflow/affiliate/form/login/submit",
		"method": "post",
		"fields":
		{
			"email": "<%= @vars[:name] %>",
			"password": "<%= @vars[:pass] %>"
		}
	}
}
