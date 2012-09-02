{
	"type":"login",
	"name": "Kobo",
	"address": "https://secure.kobobooks.com/PortalSignIn?redirectUrl=http%3A%2F%2Fwww.kobobooks.com%2F&LoginType=0",
	"form":
	{
		"action": "",
		"method": "post",
		"fields":
		{
			"SignInCreateMode": "1",
			"SignInCreateMode": "2",
			"UseKoboAuthentication": "True",
			"UserIdentifier": "@name@",
			"Password": "@password@",
			"createSubmit": "Continue"
		}
	}
}
