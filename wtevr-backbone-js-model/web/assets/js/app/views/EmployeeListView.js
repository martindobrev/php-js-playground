var EmployeeListView = Backbone.View.extend({ 
    el: '#backbone_container',
    template : _.template($('#employee_table_template').html()),
    
    initialize: function(options) {
        if (undefined === options) {
            this.currentPage = 1;
            this.entitiesPerPage = 5;
        } else {
            if (undefined !== options.currentPage) {
                this.currentPage = options.currentPage;
            } else {
                this.currentPage = 1;
            }

            if (undefined !== options.entitiesPerPage) {
                this.entitiesPerPage = 5;
            } else {
                this.entitiesPerPage = options.entitiesPerPage;
            }
        }
    },
    
    render: function() {
        var t = this;
        
        $(this.el).html(this.template({cid: t.cid})).each(function() {
            var tbody = $(this).find('tbody');
            
            var paginator = new BootstrapPaginatorView({
               pageCount: 20,
               currentPage: 5
            });
            
            paginator.render(this);
            
            for (var i = 0; i < t.collection.length; i++) {
                var modelData = t.collection.models[i];
                var employee = new EmployeeTableRowView({
                    model: modelData
                });
                employee.render(tbody);
            }
        });
    }
});