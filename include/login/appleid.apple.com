{
	"type":"login",
	"name": "Apple ID",
	"address": "https://appleid.apple.com/cgi-bin/WebObjects/MyAppleId.woa/131/wa/directToSignIn?wosid=8BEW7xlvojhmv1LbtHulOw&localang=en_US",
	"form":
	{
		"action": "__token__",
		"method": "post",
		"fields":
		{
			"0.29.145.1.1": "",
			"theAccountName": "@name@",
			"theAccountPW": "@password@",
			"signInHyperLink": "Sign in",
			"theTypeValue": "",
			"Nojive": "",
			"wosid": "__token__"
		}
	}
}
