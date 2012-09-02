{
	"name": "Gmail",
	"address": "https://accounts.google.com/ServiceLogin?service=mail&passive=true&rm=false&continue=https://mail.google.com/mail/&ss=1&scc=1<mpl=default<mplcache=2",
	"form":
	{
		"action": "https://accounts.google.com/ServiceLoginAuth",
		"method": "post",
		"fields":
		{
			"continue": "https://mail.google.com/mail/",
			"service": "mail",
			"rm": "false",
			"dsh": "-402191300946954003",
			"ltmpl": "default",
			"scc": "1",
			"ss": "1",
			"GALX": "zCydBFBIdYw",
			"pstMsg": "1",
			"dnConn": "",
			"checkConnection": "youtube:114:1",
			"checkedDomains": "youtube",
			"timeStmp": "",
			"secTok": "",
			"Email": "<%= @vars[:user] %>",
			"Passwd": "<%= @vars[:pass] %>",
			"signIn": "Sign in",
			"PersistentCookie": "yes",
			"rmShown": "1"
		}
	}
}
