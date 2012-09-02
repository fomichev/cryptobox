{
	"type":"login",
	"name": "Google",
	"address": "https://accounts.google.com/ServiceLogin?passive=1209600&continue=https%3A%2F%2Faccounts.google.com%2FManageAccount&followup=https%3A%2F%2Faccounts.google.com%2FManageAccount",
	"form":
	{
		"action": "https://accounts.google.com/ServiceLoginAuth",
		"method": "post",
		"fields":
		{
			"continue": "https://accounts.google.com/ManageAccount",
			"followup": "https://accounts.google.com/ManageAccount",
			"dsh": "3935909577910171801",
			"GALX": "Qw03eRb3AWs",
			"pstMsg": "1",
			"dnConn": "",
			"checkConnection": "youtube:120:1",
			"checkedDomains": "youtube",
			"timeStmp": "",
			"secTok": "",
			"Email": "@name@",
			"Passwd": "@password@",
			"signIn": "Войти",
			"PersistentCookie": "yes",
			"rmShown": "1"
		}
	}
}
