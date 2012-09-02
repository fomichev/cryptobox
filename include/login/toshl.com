{
	"type":"login",
	"name": "Toshl",
	"address": "https://toshl.com/",
	"form":
	{
		"action": "https://toshl.com/login/?next=https%3A%2F%2Ftoshl.com%2Ftimeline%2F",
		"method": "post",
		"fields":
		{
			"email": "@name@",
			"password": "@password@",
			"remember": "on",
			"sign_in": "Log in"
		}
	}
}
