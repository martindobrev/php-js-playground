$(document).ready(function() {
    
    var Router = Backbone.Router.extend({
        routes: {
            '': 'home'
        }
    });
    
    var router = new Router();
    
    
    router.on('route:home', function() {
        console.log('We have loaded the home page');
    });
    
    
    Backbone.history.start();
    
    
    var p = new Employee({
        firstname: 'Tim',
        lastnane: 'Thomas',
        position: 'Senior Developer',
        salary: 7300,
        age: 29
    });
    
    p.set({firstname: 'fgfhgfh'});
    
    var employeeList = new EmployeeListView();
    employeeList.render();
    
});
