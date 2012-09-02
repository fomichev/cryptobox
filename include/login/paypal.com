{
	"type":"login",
	"name": "PayPal",
	"address": "https://www.paypal.com/ru",
	"form":
	{
		"action": "https://www.paypal.com/ru/cgi-bin/webscr?cmd=_login-submit&dispatch=5885d80a13c0db1f8e263663d3faee8d8494db9703d295b4a2116480ee01a05c",
		"method": "post",
		"fields":
		{
			"login_email": "@name@",
			"login_password": "@password@",
			"target_page": "0",
			"submit.x": "Log In",
			"form_charset": "UTF-8",
			"bp_mid": "v=1;a1=na~a2=na~a3=na~a4=Mozilla~a5=Netscape~a6=5.0 (Macintosh; Intel Mac OS X 10_7_4) AppleWebKit/536.11 (KHTML, like Gecko) Chrome/20.0.1132.47 Safari/536.11~a7=20030107~a8=na~a9=true~a10=~a11=true~a12=MacIntel~a13=na~a14=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_4) AppleWebKit/536.11 (KHTML, like Gecko) Chrome/20.0.1132.47 Safari/536.11~a15=true~a16=en-US~a17=ISO-8859-1~a18=www.paypal.com~a19=na~a20=na~a21=na~a22=na~a23=1366~a24=768~a25=24~a26=657~a27=na~a28=Sun Jul 01 2012 21:10:44 GMT+0400 (MSK)~a29=4~a30=~a31=yes~a32=na~a33=na~a34=no~a35=no~a36=yes~a37=yes~a38=online~a39=no~a40=MacIntel~a41=yes~a42=no~",
			"bp_ks1": "v=1;l=9;Di0:3552Ui0:95Di1:200Ui1:112Di2:25Ui2:87Di3:121Ui3:71Di4:81Ui4:79Di5:97Ui5:95Di6:81Ui6:103Di7:49Ui7:87Di8:136Ui8:96",
			"bp_ks2": "",
			"bp_ks3": "",
			"browser_name": "Chrome",
			"browser_version": "536.11",
			"browser_version_full": "20.0.1132.47",
			"operating_system": "Mac",
			"flow_name": "xpt/Marketing_CommandDriven/homepage/MainHome",
			"fso_enabled": "11"
		}
	}
}
