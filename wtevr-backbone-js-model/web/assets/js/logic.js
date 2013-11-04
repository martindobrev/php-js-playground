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
            position: 'unemployed',
            salary: 0,
            age: -1
        },
        
        initialize: function() {
            console.log("Employee with id: " + this.cid + " created!");
        },
        /*
        events: {
            'change' : 'changeParameters'
        },
        
        changeParameters: function() {
            console.log('SOME PARAMETERS CHANGED!!!');
        }
        */
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
        model: Employee,
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
                        //employeeData.on('change', function() {
                        //    console.log('Change the properties here...');
                        //});
                        var employee = new EmployeeTableRowView({model: employeeData});
                        employee.render();
                    }
                    
                    console.log(employees);
                    //var employee = new Employee()
                }
            })
        }
    });
    
    var EmployeeTableRowView = Backbone.View.extend({
        render: function(view) {
            var template = _.template($('#employee_table_row_view_template').html(), {model: this.model});
            var t = this;
            
            if (view) {
                $(template).insertAfter(view.$el).each(function() {
                    t.setElement(this);
                });
            } else {
                $(template).appendTo(this.$table).each(function() {
                    t.setElement(this);
                });                
            }
            
            return this;
        },
        
        table: '#employee_table_body',
        
        initialize: function() {
            var self = this;
            
            //console.log('Initializing table row view with table selector: ' + this.table);
            this.$table = $(this.table);
            
            this.model.on('change', function() {
                console.log('CHANGE PROPERTIES HERE...');
            });
            
            this.model.on('sync', function() {
                self.refresh();
            });
        
        },
        
        refresh: function() {
            console.log('REFRESHING PROPERTIES...');
            var params = ['firstname', 'lastname', 'position', 'salary', 'age'];
            for (var i = 0; i < params.length; i++) {
                this.$el.find('[data-property="' + params[i] + '"]').text(this.model.get(params[i]));
            }
        },
        
        events: {
            'click .btn': 'triggerEditView',
            'dblclick td': 'triggerEditPopover'
        },
        
        triggerEditView: function() {
            console.log('SHOW EDIT ELEMENT INSTED!');
            
            var editView = new EmployeeTableRowEditView({model: this.model});
            
            var t = this;
            editView.on('edition-complete', function() {
                t.render(this);
                this.remove();
            });  
            editView.render(this);
            this.remove();
            
            
        },
        
        triggerEditPopover: function(e) {
            
            var t = this;
            var target = e.currentTarget;
            
            var value = $(target).text();
            var property = $(target).attr('data-property');
            $(target).popover({
               html: true,
               title: 'Edit property',
               content: '<input type="text" data-property="' + property + '" id="edit_popup" value="' + value + '" class="form-control"/>',
               placement: 'top',
               container: 'body'
            });
            
            $(target).on('shown.bs.popover', function() {
                
                $('#edit_popup').focus();
                
                $('#edit_popup').keyup(function(e) {
                    if (e.which == 13) {
                        
                        var attr = {};
                        attr[$(this).attr('data-property')] = $(this).val();
                        
                        t.model.save(attr, {wait: true});
                        
                        $(target).popover('hide');
                        $(this).css('disabled', 'disabled');
                    }
                });
                //console.log('POPOVER SHOWN!'); 
            });
            
            $(target).popover('show');
            
        }
    });
    
    
    var EmployeeTableRowEditView = EmployeeTableRowView.extend({
        render: function(view) {
            var template = _.template($('#employee_table_row_edit_template').html(), {model: this.model});
            var t = this;
            $(template).insertAfter(view.$el).each(function() {
            //$(template).appendTo(this.$table).each(function() {
                t.setElement(this);
            });
            //this.$el.html(template);
            return this;
        },
        
        initialize: function() {
            var t = this;
            this.model.on('sync', function() {
                t.trigger('edition-complete');
            });
        },
        
        events: {
            'click .btn': 'editEmployee'
        },
        
        editEmployee: function(e) {
            console.log('Saving employee...');
            
            var attrs = {};
            
            attrs.firstname = this.$el.find('input[name="firstname"]').val();
            attrs.lastname = this.$el.find('input[name="lastname"]').val();
            attrs.position = this.$el.find('input[name="position"]').val();
            attrs.salary = this.$el.find('input[name="salary"]').val();
            attrs.age = this.$el.find('input[name="age"]').val();
            
            //console.log('OBJECT TO BE CHANGED, new parameters:');
            //console.log(attrs);
            
            //this.model.set(attrs);
            
            console.log(this.model.changed);
            
            
            this.model.save(attrs, {wait: true});
            
        }
    });
    
    
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