{
	"type":"login",
	"name": "GoDaddy.com",
	"address": "http://www.godaddy.com/",
	"form":
	{
		"action": "https://idp.godaddy.com/login.aspx?ci=9106&spkey=GDSWNET-M1PWCORPWEB114",
		"method": "post",
		"fields":
		{
			"loginname": "@name@",
			"password": "@password@",
			"validate": "1"
		}
	}
}
