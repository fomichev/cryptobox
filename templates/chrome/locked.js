(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['locked'] = template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  


  return "<div id=\"div-locked\">\n	<h1><%= @text[:enter_password] %></h1>\n\n	<div id=\"div-locked\">\n		<form id=\"form-unlock\">\n				<input id=\"input-password\" size=\"16\" type=\"password\">\n				<div>\n				<button id=\"button-unlock\" type=\"submit\" class=\"btn btn-primary\">\n					<i class=\"icon-lock\"></i> <%= @text[:button_unlock] %>\n				</button>\n			</div>\n		</form>\n	</div>\n</div>\n\n<div id=\"div-login-error\">\n	<%= @text[:login_not_found] %>\n</div>\n";});
})();