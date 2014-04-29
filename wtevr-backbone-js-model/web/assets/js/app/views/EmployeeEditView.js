var EmployeeEditView = Backbone.View.extend({
    el: '#backbone_container',
    template: _.template($('#employee_edit_template').html()),
    
    render: function(id) {
        console.log('ID is: ' + id);
        var employee = new Employee({id: id});
        var t = this;
        employee.fetch({
            success: function(data) {
                $(t.el).html(t.template({model: data}));
            } 
        });
        
    }
});
