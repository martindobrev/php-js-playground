/*
 * Testing Backbone Structure
 */

$(document).ready(function() {
    
    var ROOT_PATH = '/php-js-playground/wtevr-backbone-js-model/web';
    
    var Employee = Backbone.Model.extend({
        
        url: ROOT_PATH + '/backbone/employee',
        
        defaults: {
            firstname: 'Joe',
            lastname: 'Black',
            age: -1,
        },
        
        initialize: function() {
            console.log("Employee with id: " + this.cid + " created!");
        }
    });
    
    var SearchView = Backbone.View.extend({
        initialize: function() {
            //alert('Alerts suck!');
            console.log("SearchView with id '" + this.cid + "' created!");
            this.render();
        },
        render: function() {
            console.log("rendering the search view...");
            var template = _.template($('#search_template').html(), {});
            this.$el.html(template);
        },
        events: {
            'keyup input[type="text"]': 'doSearch'
        },
        
        doSearch: function(event) {
            console.log("Searching for '" + $(event.target).val() + "'");
        }
    });
    
    var Employees = Backbone.Collection.extend({
//        model: Person,
        url: ROOT_PATH + '/backbone/list/employee'
    });
    
    var EmployeeListView = Backbone.View.extend({
        
        el: '#employee_table_body',
        
        render: function() {
            var employees = new Employees();
            var t = this;
            employees.fetch({
                success: function(employees) {
                    for (var i = 0; i < employees.length; i++) {
                        var employeeData = employees.models[i];
                        var employee = new EmployeeTableRowView();
                        employee.render(employeeData);
                    }
                    
                    console.log(employees);
                    //var employee = new Employee()
                }
            })
        }
    });
    
    var EmployeeTableRowView = Backbone.View.extend({
        render: function(model) {
            var template = _.template($('#employee_table_representation_template').html(), {model: model});
            var t = this;
            $(template).appendTo(this.$table).each(function() {
                t.el = this;
                t.events['click input'] = 'action';
            });
            //this.$el.html(template);
        },
        
        table: '#employee_table_body',
        
        initialize: function() {
            //console.log('Initializing table row view with table selector: ' + this.table);
            this.$table = $(this.table);
        },
        
        events: {
            'click input': 'action'
        },
        
        action: function(e) {
            console.log('TESTING!');
        }
        
    });
    
    
    var p = new Employee({
        firstname: 'Martin',
        lastnane: 'Dobrev',
        position: 'CTO',
        salary: 16780,
        age: 27
    });
    
    p.save();
    
    var employeeList = new EmployeeListView();
    
    employeeList.render();
    
    
    
});