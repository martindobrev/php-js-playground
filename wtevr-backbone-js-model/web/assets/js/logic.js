$.fn.serializeObject = function() {
  var o = {};
  var a = this.serializeArray();
  $.each(a, function() {
      if (o[this.name] !== undefined) {
          if (!o[this.name].push) {
              o[this.name] = [o[this.name]];
          }
          o[this.name].push(this.value || '');
      } else {
          o[this.name] = this.value || '';
      }
  });
  return o;
};


var GLOBAL = this;

$(document).ready(function() {
    
    var Router = Backbone.Router.extend({
        routes: {
            '': 'home',
            'new' : 'new',
            'edit/:id': 'edit'
        }
    });
    
    var router = new Router();
    
    
    var createView = new EmployeeAddView();
    createView.setRouter(router);
    
    var editView = new EmployeeEditView();
    
    router.on('route:home', function() {
        var employees = new Employees();
        employees.fetch({
            success: function(collection, response, options) {
                var employeeList = new EmployeeListView({
                    collection: collection
                });
                employeeList.render();
            }
        });
    });
    
    router.on('route:new', function() {
        createView.render();
    });
    
    router.on('route:edit', function(id) {
        editView.render(id);
    });
    
    Backbone.history.start();
});
