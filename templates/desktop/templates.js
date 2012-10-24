(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['locked'] = template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  


  return "<div id=\"div-locked\">\n	<h1><%= @text[:enter_password] %></h1>\n\n	<div id=\"div-locked\">\n		<form id=\"form-unlock\">\n			<input id=\"input-password\" size=\"16\" type=\"password\">\n			<div>\n				<button id=\"button-unlock\" type=\"submit\" class=\"btn btn-primary\">\n					<i class=\"icon-lock\"></i> <%= @text[:button_unlock] %>\n				</button>\n			</div>\n		</form>\n	</div>\n</div>\n";});
templates['unlocked'] = template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1, foundHelper;
  buffer += "\n				<li><a href=\"#";
  foundHelper = helpers.id;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.id; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
  buffer += escapeExpression(stack1) + "\" data-toggle=\"tab\">";
  foundHelper = helpers.name;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.name; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
  buffer += escapeExpression(stack1) + "</a></li>\n				";
  return buffer;}

function program3(depth0,data) {
  
  var buffer = "", stack1, foundHelper;
  buffer += "\n				<div id=\"";
  foundHelper = helpers.id;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.id; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
  buffer += escapeExpression(stack1) + "\" class=\"tab-pane fade\">\n					";
  stack1 = depth0.tag;
  stack1 = helpers.each.call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(4, program4, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n				</div>\n				";
  return buffer;}
function program4(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n					<table class=\"table table-hover\">\n						";
  stack1 = depth0.name;
  stack1 = helpers['if'].call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(5, program5, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n\n						";
  stack1 = depth0.item;
  stack1 = helpers.each.call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(7, program7, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n					</table>\n					";
  return buffer;}
function program5(depth0,data) {
  
  var buffer = "", stack1, foundHelper;
  buffer += "\n						<caption>";
  foundHelper = helpers.name;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.name; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
  buffer += escapeExpression(stack1) + "</caption>\n						";
  return buffer;}

function program7(depth0,data) {
  
  var buffer = "", stack1, stack2, foundHelper;
  buffer += "\n						<tr json=\"";
  foundHelper = helpers.stringify;
  stack1 = foundHelper ? foundHelper.call(depth0, depth0, {hash:{}}) : helperMissing.call(depth0, "stringify", depth0, {hash:{}});
  buffer += escapeExpression(stack1) + "\">\n						<td>\n							";
  stack1 = depth0.type;
  stack2 = {};
  stack2['to'] = "webform";
  foundHelper = helpers.if_eq;
  stack1 = foundHelper ? foundHelper.call(depth0, stack1, {hash:stack2,inverse:self.program(10, program10, data),fn:self.program(8, program8, data)}) : helperMissing.call(depth0, "if_eq", stack1, {hash:stack2,inverse:self.program(10, program10, data),fn:self.program(8, program8, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n						</td>\n						<td>\n							<button class=\"button-details btn btn-mini btn-primary pull-right\" type=\"button\">\n								<%= @text[:button_details] %>\n							</button>\n						</td>\n						</tr>\n						";
  return buffer;}
function program8(depth0,data) {
  
  var buffer = "", stack1, foundHelper;
  buffer += "\n							<a class=\"button-login\" href=\"#\">";
  foundHelper = helpers.name;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.name; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
  buffer += escapeExpression(stack1) + " (";
  stack1 = depth0.form;
  stack1 = stack1 == null || stack1 === false ? stack1 : stack1.vars;
  stack1 = stack1 == null || stack1 === false ? stack1 : stack1.user;
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  buffer += escapeExpression(stack1) + ")</a>\n							";
  return buffer;}

function program10(depth0,data) {
  
  var buffer = "", stack1, foundHelper;
  buffer += "\n							";
  foundHelper = helpers.name;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.name; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
  buffer += escapeExpression(stack1) + "\n							";
  return buffer;}

  buffer += "<div class=\"container\">\n	<div class=\"navbar\">\n		<div class=\"navbar-inner\">\n			<form class=\"navbar-search\">\n				<input type=\"text\" id=\"input-filter\" class=\"search-query\" placeholder=\"<%= @text[:filter] %>\">\n			</form>\n			<ul class=\"nav pull-right\">\n				<li><a id=\"button-generate-show\" href=\"#\"><i class=\"icon-asterisk\"></i> <%= @text[:button_generate] %></a></li>\n				<li><a id=\"button-lock\" href=\"#\"><i class=\"icon-lock\"></i> <%= @text[:button_lock] %></a></li>\n			</ul>\n		</div>\n	</div>\n\n	<div class=\"row\">\n		<div class=\"span3\">\n			<ul id=\"ul-nav\" class=\"nav nav-pills nav-stacked\">\n				";
  stack1 = depth0.page;
  stack1 = helpers.each.call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(1, program1, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n			</ul>\n		</div>\n		<div class=\"span9\">\n			<div id=\"div-tabs\">\n				<div class=\"tab-content\">\n				";
  stack1 = depth0.page;
  stack1 = helpers.each.call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(3, program3, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n				</div>\n			</div>\n		</div>\n	</div>\n</div>\n\n<div id=\"div-details\" class=\"modal hide fade\">\n	<div class=\"modal-header\">\n		<button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">&times;</button>\n		<h3></h3>\n	</div>\n	<div class=\"modal-body\"></div>\n	<div class=\"modal-footer\">\n		<a href=\"#\" class=\"btn\" data-dismiss=\"modal\" aria-hidden=\"true\"><%= @text[:button_close] %></a>\n	</div>\n</div>\n\n<div id=\"div-generate\" class=\"modal hide fade\">\n	<div class=\"modal-header\">\n		<button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">&times;</button>\n		<h3><%= @text[:title_generate] %></h3>\n	</div>\n	<div class=\"modal-body\">\n		<form>\n			<label><%= @text[:generate_length] %></label>\n			<input type=\"text\" id=\"input-password-length\" value=\"<%= @config[:ui][:default_password_length] %>\" size=\"4\" />\n			<label class=\"checkbox\">\n				<input type=\"checkbox\" id=\"input-include-num\" checked /> <%= @text[:generate_numbers] %>\n			</label>\n			<label class=\"checkbox\">\n				<input type=\"checkbox\" id=\"input-include-punc\" checked /> <%= @text[:generate_punctuation] %>\n			</label>\n			<label class=\"checkbox\">\n				<input type=\"checkbox\" id=\"input-include-uc\" checked /> <%= @text[:generate_upper_case] %>\n			</label>\n			<label class=\"checkbox\">\n				<input type=\"checkbox\" id=\"input-pronounceable\" /> <%= @text[:generate_pronounceable] %>\n			</label>\n			<label><%= @text[:generated] %></label>\n			<input type=\"text\" id=\"intput-generated-password\" size=\"30\" />\n		</form>\n	</div>\n	<div class=\"modal-footer\">\n		<a href=\"#\" class=\"btn\" data-dismiss=\"modal\" aria-hidden=\"true\"><%= @text[:button_close] %></a>\n		<a id=\"button-generate\" href=\"#\" class=\"btn btn-primary\"><%= @text[:button_generate] %></a>\n	</div>\n</div>\n\n<div id=\"div-token\" class=\"modal hide fade\">\n	<div class=\"modal-header\">\n		<button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">&times;</button>\n		<h3><%= @text[:title_token] %></h3>\n	</div>\n	<div class=\"modal-body\">\n		<input type=\"text\" id=\"input-json\" />\n	</div>\n	<div class=\"modal-footer\">\n		<a href=\"#\" class=\"btn\" data-dismiss=\"modal\" aria-hidden=\"true\"><%= @text[:button_close] %></a>\n		<a id=\"button-token\" href=\"#\" class=\"btn btn-success\" target=\"_blank\"><%= @text[:get_token] %></a>\n		<a id=\"button-token-login\" href=\"#\" class=\"btn btn-primary\"><%= @text[:log_in] %></a>\n	</div>\n</div>\n";
  return buffer;});
})();