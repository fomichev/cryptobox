{
	"type":"login",
	"name": "Lenovo",
	"address": "http://shop.lenovo.com/SEUILibrary/controller/e/web/LenovoPortal/en_US/account.workflow:StartMyAccount",
	"form":
	{
		"action": "http://shop.lenovo.com/SEUILibrary/controller/e/web/LenovoPortal/en_US/seutil.workflow:ShowIncompleteURLPage",
		"method": "post",
		"fields":
		{
			"session-start": "1341161889776",
			"Domain": "",
			"user_locale": "en_US",
			"LoginName": "@name@",
			"Password": "@password@"
		}
	}
}
