var EmployeeAddView = Backbone.View.extend({ 
    el: '#backbone_container',
    template: _.template('<div>TEST</div>'),
    
    render: function() {
        console.log('Add new employee');
        console.log(this.template);
        var html = $('#employee_add_template').html();
        $(this.el).html(html).each(function() {
            
            var div = this;
            
            $(this).find('#random_generator').click(function(e) {
                
                var firstnames = ['Martin', 'Maria', 'Tim', 'Erik', 'Daniel', 'Danilo',
                    'Tom', 'Patrik', 'Marcel', 'Kamen', 'Julia', 'Silvia', 'Christin',
                    'Elgin', 'Liusy', 'Jasen', 'Manuela', 'Wolfgang', 'Uwe'];
                var lastnames = ['Dobrev', 'Deltschew', 'Meier', 'Black', 'White',
                'Sorgenfrei', 'Problemefrei', 'Reiche', 'Hurst', 'Smithsson', 'Larsson',
                'Morgensson'];
            
                var positions = ['Software Engineer', 'Senior Software Engineer', 'Tester',
                    'Software Architect', 'CEO', 'CTO', 'Graphic Designer', 'Chief Graphic Designer',
                    'Sales Manager'];
                
                var randomIndex = Math.floor(Math.random() * firstnames.length);
                $(div).find('[name="firstname"]').val(firstnames[randomIndex]);
                
                randomIndex = Math.floor(Math.random() * lastnames.length);
                $(div).find('[name="lastname"]').val(lastnames[randomIndex]);
                
                randomIndex = Math.floor(Math.random() * positions.length);
                $(div).find('[name="position"]').val(positions[randomIndex]);
                
                
                $(div).find('[name="salary"]').val(Math.floor(Math.random() * 1000) + '00');
                $(div).find('[name="age"]').val(Math.floor(Math.random() * 30) + 20);
                
                e.preventDefault();
                
            });
        });
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
        
        //newEmployee.on('invalid', this.invalid);
        
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