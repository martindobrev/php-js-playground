var EmployeeTableRowView = Backbone.View.extend({
    render: function(view) {
        var template = _.template($('#employee_table_row_view_template').html(), {model: this.model});
        var t = this;

        if (view) {
            $(template).insertAfter(view.$el).each(function() {
                t.setElement(this);
            });
        } else {
            $(template).appendTo(this.$table).each(function() {
                t.setElement(this);
            });
        }

        return this;
    },

    table: '#employee_table_body',

    initialize: function() {
        var self = this;

        //console.log('Initializing table row view with table selector: ' + this.table);
        this.$table = $(this.table);

        this.model.on('change', function() {
            console.log('CHANGE PROPERTIES HERE...');
        });

        this.model.on('sync', function() {
            self.refresh();
        });

    },

    refresh: function() {
        console.log('REFRESHING PROPERTIES...');
        var params = ['firstname', 'lastname', 'position', 'salary', 'age'];
        for (var i = 0; i < params.length; i++) {
            this.$el.find('[data-property="' + params[i] + '"]').text(this.model.get(params[i]));
        }
    },

    events: {
        'click [data-id="edit_btn"]': 'triggerEditView',
        'click [data-id="delete_btn"]': 'deleteModel',
        'dblclick td': 'triggerEditPopover'
    },

    triggerEditView: function() {
        console.log('SHOW EDIT ELEMENT INSTED!');

        var editView = new EmployeeTableRowEditView({model: this.model});

        var t = this;
        editView.on('edition-complete', function() {
            t.render(this);
            this.remove();
        });  
        editView.render(this);
        this.remove();


    },
    
    deleteModel: function(e) {
        console.log('DELETE CALLED!!!');
        console.log(this.model);
        
        var t = this;
        
        this.model.destroy({success: function(model, response) {
            t.$el.remove();
        }});
    },

    triggerEditPopover: function(e) {

        var t = this;
        var target = e.currentTarget;

        var value = $(target).text();
        var property = $(target).attr('data-property');
        $(target).popover({
           html: true,
           title: 'Edit property',
           content: '<input type="text" data-property="' + property + '" id="edit_popup" value="' + value + '" class="form-control"/>',
           placement: 'top',
           container: 'body'
        });

        $(target).on('shown.bs.popover', function() {

            $('#edit_popup').focus();

            $('#edit_popup').keyup(function(e) {
                if (e.which == 13) {

                    var attr = {};
                    attr[$(this).attr('data-property')] = $(this).val();

                    t.model.save(attr, {wait: true});

                    $(target).popover('hide');
                    $(this).css('disabled', 'disabled');
                }
            });
            //console.log('POPOVER SHOWN!'); 
        });

        $(target).popover('show');

    }
});