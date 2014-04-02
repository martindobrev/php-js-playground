var EmployeeListView = Backbone.View.extend({ 
    el: '#backbone_container',
    $table : null,
    
    render: function() {
        var employees = new Employees();
        var t = this;
        var tableTemplate = _.template($('#employee_table_template').html());
        
        $(this.el).html(tableTemplate).each(function() {
            t.$table = this;
            
            var tbody = $(this).find('tbody');
            
            employees.fetch({
                success: function(employees) {
                    
                    for (var i = 0; i < employees.length; i++) {
                        var employeeData = employees.models[i];
                        var employee = new EmployeeTableRowView({model: employeeData});
                        employee.render(tbody);
                    }
                }
            });
        });
    }
});