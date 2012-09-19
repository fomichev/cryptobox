(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['locked'] = template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  


  return "<div data-role=\"page\" id=\"div-locked\">\n	<div data-role=\"header\">\n		<h1><%= @text[:title] %></h1>\n	</div>\n\n	<div data-role=\"content\">\n		<form id=\"form-unlock\" action=\"#div-main\" method=\"get\" data-ajax=\"false\">\n			<label for=\"input-password\"><%= @text[:enter_password] %></label>\n			<input type=\"password\" id=\"input-password\" value=\"\" />\n			<input type=\"submit\" value=\"<%= @text[:button_unlock] %>\" />\n		</form>\n	</div>\n</div>\n";});
templates['unlocked'] = template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this, helperMissing=helpers.helperMissing;

function program1(depth0,data) {
  
  var buffer = "", stack1, foundHelper;
  buffer += "\n			<li><a href=\"#";
  foundHelper = helpers.id;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.id; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
  buffer += escapeExpression(stack1) + "\" data-toggle=\"tab\">";
  foundHelper = helpers.name;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.name; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
  buffer += escapeExpression(stack1) + "</a></li>\n			";
  return buffer;}

function program3(depth0,data) {
  
  var buffer = "", stack1, foundHelper;
  buffer += "\n<div data-role=\"page\" id=\"";
  foundHelper = helpers.id;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.id; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
  buffer += escapeExpression(stack1) + "\" class=\"generated\">\n	<div data-role=\"header\">\n		<h1>";
  foundHelper = helpers.name;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.name; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
  buffer += escapeExpression(stack1) + "</h1>\n		<a data-rel=\"back\" href=\"#\" data-icon=\"back\"><%= @text[:button_back] %></a>\n		<a class=\"button-lock\" href=\"#\" data-icon=\"delete\"><%= @text[:button_lock] %></a>\n	</div>\n	<div data-role=\"content\">\n		<ul data-role=\"listview\" data-inset=\"true\" data-filter=\"true\">\n		";
  stack1 = depth0.tag;
  stack1 = helpers.each.call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(4, program4, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n		</ul>\n	</div>\n</div>\n";
  return buffer;}
function program4(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n			";
  stack1 = depth0.name;
  stack1 = helpers['if'].call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(5, program5, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n			";
  stack1 = depth0.item;
  stack1 = helpers.each.call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(7, program7, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n		";
  return buffer;}
function program5(depth0,data) {
  
  var buffer = "", stack1, foundHelper;
  buffer += "\n			<li data-role=\"list-divider\">";
  foundHelper = helpers.name;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.name; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
  buffer += escapeExpression(stack1) + "</li>\n			";
  return buffer;}

function program7(depth0,data) {
  
  var buffer = "", stack1, foundHelper;
  buffer += "\n			<li><a href=\"#page-";
  foundHelper = helpers.id;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.id; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
  buffer += escapeExpression(stack1) + "\">";
  foundHelper = helpers.name;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.name; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
  buffer += escapeExpression(stack1) + "</a></li>\n			";
  return buffer;}

function program9(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n	";
  stack1 = depth0.tag;
  stack1 = helpers.each.call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(10, program10, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n";
  return buffer;}
function program10(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n		";
  stack1 = depth0.item;
  stack1 = helpers.each.call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(11, program11, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n	";
  return buffer;}
function program11(depth0,data) {
  
  var buffer = "", stack1, stack2, foundHelper;
  buffer += "\n		<div data-role=\"page\" id=\"page-";
  foundHelper = helpers.id;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.id; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
  buffer += escapeExpression(stack1) + "\" class=\"generated\">\n			<div data-role=\"header\">\n				<h1>";
  foundHelper = helpers.name;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.name; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
  buffer += escapeExpression(stack1) + "</h1>\n				<a data-rel=\"back\" href=\"#\" data-icon=\"back\"><%= @text[:button_back] %></a>\n				<a class=\"button-lock\" href=\"#\" data-icon=\"delete\"><%= @text[:button_lock] %></a>\n			</div>\n			<div data-role=\"content\">\n				";
  stack1 = depth0.type;
  stack2 = {};
  stack2['to'] = "login";
  foundHelper = helpers.if_eq;
  stack1 = foundHelper ? foundHelper.call(depth0, stack1, {hash:stack2,inverse:self.program(17, program17, data),fn:self.program(12, program12, data)}) : helperMissing.call(depth0, "if_eq", stack1, {hash:stack2,inverse:self.program(17, program17, data),fn:self.program(12, program12, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n			</div>\n		</div>\n		";
  return buffer;}
function program12(depth0,data) {
  
  var buffer = "", stack1, foundHelper;
  buffer += "\n				<a class=\"button-login\" href=\"#\" data-role=\"button\" json=\"";
  foundHelper = helpers.stringify;
  stack1 = foundHelper ? foundHelper.call(depth0, depth0, {hash:{}}) : helperMissing.call(depth0, "stringify", depth0, {hash:{}});
  buffer += escapeExpression(stack1) + "\"><%= @text[:log_in] %></a>\n				<a href=";
  foundHelper = helpers.address;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.address; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
  buffer += escapeExpression(stack1) + " data-role=\"button\"><%= @text[:goto] %></a>\n				<div data-role=\"collapsible\"><h3><%= @text[:username] %></h3><p>";
  stack1 = depth0.form;
  stack1 = stack1 == null || stack1 === false ? stack1 : stack1.vars;
  stack1 = stack1 == null || stack1 === false ? stack1 : stack1.user;
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  buffer += escapeExpression(stack1) + "</p></div>\n				<div data-role=\"collapsible\"><h3><%= @text[:password] %></h3><p>";
  stack1 = depth0.form;
  stack1 = stack1 == null || stack1 === false ? stack1 : stack1.vars;
  stack1 = stack1 == null || stack1 === false ? stack1 : stack1.pass;
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  buffer += escapeExpression(stack1) + "</p></div>\n					";
  stack1 = depth0.form;
  stack1 = stack1 == null || stack1 === false ? stack1 : stack1.vars;
  stack1 = stack1 == null || stack1 === false ? stack1 : stack1.secret;
  stack1 = helpers['if'].call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(13, program13, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n					";
  stack1 = depth0.form;
  stack1 = stack1 == null || stack1 === false ? stack1 : stack1.vars;
  stack1 = stack1 == null || stack1 === false ? stack1 : stack1.note;
  stack1 = helpers['if'].call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(15, program15, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n				";
  return buffer;}
function program13(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n				<div data-role=\"collapsible\"><h3><%= @text[:secret] %></h3><p>";
  stack1 = depth0.form;
  stack1 = stack1 == null || stack1 === false ? stack1 : stack1.vars;
  stack1 = stack1 == null || stack1 === false ? stack1 : stack1.secret;
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  buffer += escapeExpression(stack1) + "</p></div>\n					";
  return buffer;}

function program15(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n				<div data-role=\"collapsible\"><h3><%= @text[:note] %></h3><p>";
  stack1 = depth0.form;
  stack1 = stack1 == null || stack1 === false ? stack1 : stack1.vars;
  stack1 = stack1 == null || stack1 === false ? stack1 : stack1.note;
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  buffer += escapeExpression(stack1) + "</p></div>\n					";
  return buffer;}

function program17(depth0,data) {
  
  var buffer = "", stack1, foundHelper;
  buffer += "\n				";
  foundHelper = helpers.name;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.name; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
  buffer += escapeExpression(stack1) + "\n				";
  return buffer;}

  buffer += "<div data-role=\"page\" id=\"div-main\" class=\"generated\">\n	<div data-role=\"header\">\n		<h1><%= @text[:title] %></h1>\n		<a class=\"button-lock ui-btn-right\" href=\"#\" data-icon=\"delete\"><%= @text[:button_lock] %></a>\n	</div>\n\n	<div data-role=\"content\">\n		<ul id=\"ul-pages-list\" data-role=\"listview\" data-inset=\"true\">\n			";
  stack1 = depth0.page;
  stack1 = helpers.each.call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(1, program1, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n		</ul>\n	</div>\n</div>\n";
  stack1 = depth0.page;
  stack1 = helpers.each.call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(3, program3, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n";
  stack1 = depth0.page;
  stack1 = helpers.each.call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(9, program9, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n";
  return buffer;});
})();