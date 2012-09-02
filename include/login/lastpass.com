{
	"type":"login",
	"name": "LastPass",
	"address": "https://lastpass.com/index.php?&ac=1&fromwebsite=1&nk=1",
	"form":
	{
		"action": "https://lastpass.com/login.php?",
		"method": "post",
		"fields":
		{
			"method": "web",
			"hash": "",
			"xml": "1",
			"username": "",
			"encrypted_username": "",
			"otp": "",
			"gridresponse": "",
			"multifactorresponse": "",
			"trustlabel": "",
			"uuid": "",
			"sesameotp": "",
			"iterations": "1",
			"email": "@name@",
			"password": "@password@",
			"rememberemail": "off"
		}
	}
}
