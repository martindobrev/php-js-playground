var Employee = Backbone.Model.extend({
    
    urlRoot: ROOT_PATH + '/backbone/employee',
    
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
    
    getValidationAttributes: function() {
        console.log('VALIDATION_PARAMETER GO HERE!!!');
    },
    
    validate: function(attrs, options) {
        console.log('VALIDATE CALLED!!!!');
        var errors = [];
        
        if (NaN === parseInt(attrs.age) || '' === attrs.age) {
            errors.push('AGE MUST BE NUMBER');
        }
        
        if (NaN === parseInt(attrs.salary) || '' === attrs.salary) {
            errors.push('SALARY MUST BE NUMBER');
        }
        
        if (errors.length > 0) {
            console.log('ERRORS ARE: ' + errors);
            return errors;
        } else {
            // DO NOTHING
        }
    }
});


