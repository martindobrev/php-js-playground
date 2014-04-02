var EmployeeAddView = Backbone.View.extend({ 
    el: '#backbone_container',
    template: _.template('<div>TEST</div>'),
    
    render: function() {
        console.log('Add new employee');
        console.log(this.template);
        var html = $('#employee_add_template').html();
        $(this.el).html(html);
    },
    
    events: {
        'submit form' : 'addEmployee',
        'click #cancel_btn' : 'cancel',
        'invalid' : 'invalid'
    },
    
    addEmployee: function(ev) {
        ev.preventDefault();
        var data = $(ev.currentTarget).serializeObject();
        
        var t = this;
        var newEmployee = new Employee();
        
        newEmployee.on('invalid', this.invalid);
        
        newEmployee.save(data, {
            success: function() {
                console.log('Created successfully!!!');
                t.router.navigate('', {trigger: true});
            }
        });
    },
    
    setRouter: function(router) {
        this.router = router;
    },
    
    cancel: function() {
        this.router.navigate('', {trigger: true});
    }
});