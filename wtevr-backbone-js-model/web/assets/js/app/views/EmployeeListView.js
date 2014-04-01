var EmployeeListView = Backbone.View.extend({ 
    el: '#backbone_container',
    $table : null,
    
    render: function() {
        var employees = new Employees();
        var t = this;
        
        var tableTemplate = _.template($('#employee_table_template').html());
        
        console.log(tableTemplate());
        
        this.$el.append(tableTemplate());
        
        $(tableTemplate()).appendTo(this.$el).each(function() {
            t.$table = this;
            
            employees.fetch({
                success: function(employees) {
                    for (var i = 0; i < employees.length; i++) {
                        var employeeData = employees.models[i];
                        //employeeData.on('change', function() {
                        //    console.log('Change the properties here...');
                        //});
                        var employee = new EmployeeTableRowView({model: employeeData, el: $(t.$table).find('tbody')});
                        employee.render();
                    }
                }
            });
        });
    }
});