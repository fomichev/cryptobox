{
	"type":"login",
	"name": "Appress",
	"address": "https://www.apress.com/customer/account/login/referer/aHR0cDovL3d3dy5hcHJlc3MuY29tL2Ntcy9pbmRleC9pbmRleC8,/",
	"form":
	{
		"action": "https://www.apress.com/customer/account/loginPost/referer/aHR0cDovL3d3dy5hcHJlc3MuY29tL2Ntcy9pbmRleC9pbmRleC8,/",
		"method": "post",
		"fields":
		{
			"login[username]": "@name@",
			"login[password]": "@password@",
			"send": ""
		}
	}
}
