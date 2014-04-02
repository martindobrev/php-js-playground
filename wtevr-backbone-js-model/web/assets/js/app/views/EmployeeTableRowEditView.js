var EmployeeTableRowEditView = EmployeeTableRowView.extend({
    render: function(view) {
        var template = _.template($('#employee_table_row_edit_template').html(), {model: this.model});
        var t = this;
        $(template).insertAfter(view.$el).each(function() {
            t.setElement(this);
            
        });
        return this;
    },

    initialize: function() {
        var t = this;
        this.model.on('sync', function() {
            t.trigger('edition-complete');
        });
    },

    events: {
        'click [data-id="save_btn"]': 'editEmployee',
        'click [data-id="cancel_btn"]': 'cancel',
        'keyup input': 'onKeyUp'
    },

    editEmployee: function(e) {
        var attrs = {};
        attrs.firstname = this.$el.find('input[name="firstname"]').val();
        attrs.lastname = this.$el.find('input[name="lastname"]').val();
        attrs.position = this.$el.find('input[name="position"]').val();
        attrs.salary = this.$el.find('input[name="salary"]').val();
        attrs.age = this.$el.find('input[name="age"]').val();
        console.log(this.model.changed);
        this.model.save(attrs, {wait: true});
    },
    
    onKeyUp: function(e) {
        if (e.keyCode == '13') {
           this.editEmployee();
        }
    },
    
    cancel: function(e) {
        this.trigger('edition-complete');
    }
});