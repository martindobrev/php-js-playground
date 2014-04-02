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


$(document).ready(function() {
    
    var Router = Backbone.Router.extend({
        routes: {
            '': 'home',
            'new' : 'new'
        }
    });
    
    var router = new Router();
    
    var employeeList = new EmployeeListView();
    var createView = new EmployeeAddView();
    createView.setRouter(router);
    
    
    router.on('route:home', function() {
        
        employeeList.render();
    });
    
    router.on('route:new', function() {
        
        
        createView.render();
    });
    
    Backbone.history.start();
});
