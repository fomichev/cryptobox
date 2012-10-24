{
	"name": "Elance",
	"address": "https://www.elance.com/php/landing/main/login.php",
	"form":
	{
		"action": "https://www.elance.com/php/reg/main/signInAHR.php",
		"method": "post",
		"fields":
		{
			"mode": "signin",
			"crypted": "",
			"redirect": "",
			"login_type": "",
			"token": "__token__",
			"lnm": "<%= @vars[:name] %>",
			"pwd": "<%= @vars[:pass] %>",
			"keepmesignin": "on"
		}
	}
}
