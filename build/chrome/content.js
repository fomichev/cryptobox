var cryptobox={};cryptobox.form={};cryptobox.form.withToken=function(b){if(b.action=="__token__"){return true}for(var a in b.fields){if(b.fields[a]=="__token__"){return true}}return false};cryptobox.form.login=function(f,e,d){if(e.broken){return}if(d!=undefined){if(e.action=="__token__"){e.action=d.form.action}for(var c in e.fields){if(e.fields[c]=="__token__"){e.fields[c]=d.form.fields[c]}}}var a=null;if(f){a=window.open(e.action,e.name);if(!a){return}}else{a=window;document.close();document.open()}var b="";b+="<html><head></head><body><%= @text[:wait_for_login] %><form id='formid' method='"+e.method+"' action='"+e.action+"'>";for(var c in e.fields){b+="<input type='hidden' name='"+c+"' value='"+e.fields[c]+"'/>"}b+="</form><script type='text/javascript'>document.getElementById('formid').submit()</s";b+="cript></body></html>";a.document.write(b);return a};cryptobox.form.fill=function(c){var a=document.querySelectorAll("input[type=text], input[type=password]");for(var b=0;b<a.length;b++){var d=null;for(var e in c.fields){if(e==a[b].attributes.name.value){d=c.fields[e]}}if(d){a[b].value=d}}};cryptobox.form.sitename=function(a){return a.replace(/[^/]+\/\/([^/]+).+/,"$1").replace(/^www./,"")};cryptobox.form.toJson=function(){var k=document.URL;var c=document.title;var l="";for(var g=0;g<document.forms.length;g++){var d=document.forms[g];var h="";for(var f=0;f<d.elements.length;f++){var e=d.elements[f];if(e.name==""){continue}if(h==""){h='\t\t\t"'+e.name+'": "'+e.value+'"'}else{h+=',\n\t\t\t"'+e.name+'": "'+e.value+'"'}}var b=d.method;if(b!="get"){b="post"}var a='\t\t"action": "'+d.action+'",\n\t\t"method": "'+b+'",\n\t\t"fields":\n\t\t{\n'+h+"\n\t\t}";if(l==""){l+="[\n"}else{l+=",\n"}l+='{\n\t"type":"login",\n\t"name": "'+c+'",\n\t"address": "'+k+'",\n\t"form":\n\t{\n'+a+"\n\t}\n}\n"}if(l){l+="]"}return l};chrome.extension.onMessage.addListener(function(c,b,a){if(c.type=="fillForm"){cryptobox.form.fill(c.data.form);a({})}else{if(c.type=="getFormJson"){a(cryptobox.form.toJson())}else{}}});window.addEventListener("keyup",function(a){if(a.ctrlKey&&a.keyCode){if(a.keyCode==220){}}},false);