{
	"type":"login",
	"name": "eBay",
	"address": "https://signin.ebay.com/ws/eBayISAPI.dll?SignIn&ru=http%3A%2F%2Fwww.ebay.com%2F",
	"form":
	{
		"action": "https://signin.ebay.com/ws/eBayISAPI.dll?co_partnerId=2&siteid=0&UsingSSL=1",
		"method": "post",
		"fields":
		{
			"MfcISAPICommand": "SignInWelcome",
			"bhid": "__token__",
			"UsingSSL": "1",
			"inputversion": "2",
			"lse": "false",
			"lsv": "",
			"mid": "__token__",
			"kgver": "1",
			"kgupg": "1",
			"kgstate": "",
			"omid": "",
			"hmid": "",
			"rhr": "f",
			"siteid": "0",
			"co_partnerId": "2",
			"ru": "http://www.ebay.com/",
			"pp": "",
			"pa1": "",
			"pa2": "",
			"pa3": "",
			"i1": "-1",
			"pageType": "-1",
			"rtmData": "__token__",
			"bUrlPrfx": "__token__",
			"kgct": "",
			"userid": "@name@",
			"pass": "@password@",
			"keepMeSignInOption": "1"
		}
	}
}
