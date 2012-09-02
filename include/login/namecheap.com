{
	"type":"login",
	"name": "Namecheap.com",
	"address": "https://www.namecheap.com/myaccount/login-only.aspx",
	"form":
	{
		"action": "https://www.namecheap.com/myaccount/login-only.aspx?sflang=en",
		"method": "post",
		"fields":
		{
			"__VIEWSTATE": "__token__",
			"__EVENTVALIDATION": "__token__",
			"LoginUserName": "",
			"LoginPassword": "",
			"hidden_LoginPassword": "",
			"domain": "",
			"LoginUserName": "@name@",
			"LoginPassword": "@password@",
			"ctl00$ctl00$ctl00$ctl00$base_content$web_base_content$home_content$page_content_left$ctl00$LoginButton": "Login »",
			"hidden_LoginPassword": "",
			"subscriberEmail": "",
			"ctl00$ctl00$ctl00$ctl00$base_content$web_base_content$footer_area$page_content_footer_area$ctl00$ncbutton$actionObjectPlaceHolder": "__token__"
		}
	}
}
