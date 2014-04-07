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
    
    
    validate: function(attrs, options) {
        var errors = [];
        
        var fields = Employee.fields;
        
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
    },
    
    sort: function(property) {
        var prop = Employee.fields[property];
        if (prop) {
            if (prop.type === 'string') {
                return this.get(property);
            } else if (prop.type === 'integer') {
                return parseInt(this.get(property));
            }
        }
    },
    
    search: function(query) {
        var exists = false;
        for (var attr in this.attributes) {
            var value = this.get(attr);
            
            if ('string' === typeof(value)) {
                if (value.indexOf(query) !== -1) {
                    exists = true;
                    break;
                }
            }
        }
        
        return exists;
    }
    
}, {
    fields: {
        firstname: {
            type: 'string',
            length: 20,
            nullable: false
        },
        lastname: {
            type: 'string',
            length: 20,
            nullable: false
        },
        position: {
            type: 'string',
            length: 50,
            nullable: false
        },
        salary: {
            type: 'integer',
            length: 10,
            nullable: false
        },
        age: {
            type: 'integer',
            length: 10,
            nullable: false,
            min_value: 18
        }
    }
});