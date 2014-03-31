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

                var r = new Employee();
                
                employees.add(r);
                
                
            }
            
            
            
            
        })
    }
});