var WtevrEntityModel = Backbone.Model.extend({
    urlRoot: ROOT_PATH + '/backbone/' + MODEL,
    
    validate: function(attrs, options) {
        var errors = [];
        
        // INTEGRATE FIELDS HERE...
        
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
        var prop = WtevrEntityModel.fields[property];
        if (prop) {
            if (prop.type === 'string') {
                return this.get(property);
            } else if (prop.type === 'integer') {
                return parseInt(this.get(property));
            }
        }
    }
    
}, {
    fields: MODEL_FIELDS
});

