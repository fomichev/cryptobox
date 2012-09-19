(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['locked'] = template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  


  return "<div id=\"div-locked\">\n	<h1><%= @text[:enter_password] %></h1>\n\n	<div id=\"div-locked\">\n		<form id=\"form-unlock\">\n				<input id=\"input-password\" size=\"16\" type=\"password\">\n				<div>\n				<button id=\"button-unlock\" type=\"submit\" class=\"btn btn-primary\">\n					<i class=\"icon-lock\"></i> <%= @text[:button_unlock] %>\n				</button>\n			</div>\n		</form>\n	</div>\n</div>\n\n<div id=\"div-login-error\">\n	<%= @text[:login_not_found] %>\n</div>\n";});
templates['unlocked'] = template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  var buffer = "", stack1, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, functionType="function", self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n		<table class=\"table table-hover\">\n		<tbody>\n		";
  stack1 = depth0.matched;
  stack1 = helpers.each.call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(2, program2, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n		</tbody>\n		</table>\n	";
  return buffer;}
function program2(depth0,data) {
  
  var buffer = "", stack1, foundHelper;
  buffer += "\n			<tr json=\"";
  foundHelper = helpers.stringify;
  stack1 = foundHelper ? foundHelper.call(depth0, depth0, {hash:{}}) : helperMissing.call(depth0, "stringify", depth0, {hash:{}});
  buffer += escapeExpression(stack1) + "\">\n			<td>\n				<a class=\"button-login-matched\" href=\"#\">";
  foundHelper = helpers.name;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.name; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
  buffer += escapeExpression(stack1) + " (";
  stack1 = depth0.form;
  stack1 = stack1 == null || stack1 === false ? stack1 : stack1.vars;
  stack1 = stack1 == null || stack1 === false ? stack1 : stack1.user;
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  buffer += escapeExpression(stack1) + ")</a>\n			</td>\n			<td>\n				<button class=\"button-details btn btn-mini btn-primary pull-right\" type=\"button\">\n					<%= @text[:button_details] %>\n				</button>\n			</td>\n			</tr>\n		";
  return buffer;}

function program4(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n		<table class=\"table table-hover\">\n		<caption><h3><%= @text[:unmatched_sites] %></h3></caption>\n		<tbody>\n		";
  stack1 = depth0.unmatched;
  stack1 = helpers.each.call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(5, program5, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n	";
  return buffer;}
function program5(depth0,data) {
  
  var buffer = "", stack1, foundHelper;
  buffer += "\n			<tr json=\"";
  foundHelper = helpers.stringify;
  stack1 = foundHelper ? foundHelper.call(depth0, depth0, {hash:{}}) : helperMissing.call(depth0, "stringify", depth0, {hash:{}});
  buffer += escapeExpression(stack1) + "\">\n			<td>\n				<a class=\"button-login\" href=\"#\">";
  foundHelper = helpers.name;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.name; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
  buffer += escapeExpression(stack1) + " (";
  stack1 = depth0.form;
  stack1 = stack1 == null || stack1 === false ? stack1 : stack1.vars;
  stack1 = stack1 == null || stack1 === false ? stack1 : stack1.user;
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  buffer += escapeExpression(stack1) + ")</a>\n			</td>\n			<td>\n				<button class=\"button-details btn btn-mini btn-primary pull-right\" type=\"button\">\n					<%= @text[:button_details] %>\n				</button>\n			</td>\n			</tr>\n		";
  return buffer;}

  buffer += "<div id=\"div-navbar\" class=\"navbar\">\n	<div class=\"navbar-inner\">\n		<form class=\"navbar-search pull-left\">\n			<input type=\"text\" id=\"input-filter\" class=\"search-query\" placeholder=\"<%= @text[:filter] %>\">\n		</form>\n		<ul class=\"nav pull-right\">\n			<li class=\"dropdown\">\n			<a href=\"#\" class=\"dropdown-toggle\" data-toggle=\"dropdown\"><%= @text[:actions] %> <b class=\"caret\"></b></a>\n				<ul class=\"dropdown-menu\">\n					<li><a id='button-generate-show' href=\"#\"><i class=\"icon-asterisk\"></i> <%= @text[:button_generate] %></a></li>\n					<li class=\"disabled\"><a href=\"#\"><i class=\"icon-list\"></i> Fetch form</a></li>\n					<li><a id=\"button-lock\" href=\"#\"><i class=\"icon-lock\"></i> <%= @text[:button_lock] %></a></li>\n				</ul>\n			</li>\n		</ul>\n	</div>\n</div>\n\n<div id=\"div-unlocked\">\n	";
  stack1 = depth0.matched;
  stack1 = stack1 == null || stack1 === false ? stack1 : stack1.length;
  stack1 = helpers['if'].call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(1, program1, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n	";
  stack1 = depth0.unmatched;
  stack1 = stack1 == null || stack1 === false ? stack1 : stack1.length;
  stack1 = helpers['if'].call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(4, program4, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n\n	</tbody></table>\n</div>\n\n<div id=\"div-details\">\n	<div id=\"div-details-body\"></div>\n\n	<form>\n		<div class=\"pull-right\">\n		<button id=\"button-hide-details\" href=\"#\" class=\"btn\"><%= @text[:button_close] %></button>\n	</div>\n	</form>\n</div>\n\n<div id=\"div-generate\">\n	<form>\n		<label><%= @text[:generate_length] %></label>\n		<input type=\"text\" id=\"input-password-length\" value=\"<%= @config[:ui][:default_password_length] %>\" size=\"4\" />\n		<label class=\"checkbox\">\n			<input type=\"checkbox\" id=\"input-include-num\" checked /> <%= @text[:generate_numbers] %>\n		</label>\n		<label class=\"checkbox\">\n			<input type=\"checkbox\" id=\"input-include-punc\" checked /> <%= @text[:generate_punctuation] %>\n		</label>\n		<label class=\"checkbox\">\n			<input type=\"checkbox\" id=\"input-include-uc\" checked /> <%= @text[:generate_upper_case] %>\n		</label>\n		<label class=\"checkbox\">\n			<input type=\"checkbox\" id=\"input-pronounceable\" /> <%= @text[:generate_pronounceable] %>\n		</label>\n		<label><%= @text[:generated] %></label>\n		<input type=\"text\" id=\"intput-generated-password\" size=\"30\" />\n	</form>\n\n	<div class=\"pull-right\">\n		<a id=\"button-generate\" href=\"#\" class=\"btn btn-primary\"><%= @text[:button_generate] %></a>\n		<a id=\"button-hide-generate\" href=\"#\" class=\"btn\"><%= @text[:button_close] %></a>\n	</div>\n	<div class=\"clearfix\"></div>\n</div>\n";
  return buffer;});
})();