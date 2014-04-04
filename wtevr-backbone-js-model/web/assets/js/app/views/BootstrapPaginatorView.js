var BootstrapPaginatorView = Backbone.View.extend({
    template: _.template($('#basic_bootstrap_paginator_template').html()),
    
    initialize: function(options) {
        if (undefined === options) {
            this.show = false;
        } else {
            
            this.show = true;
            
            if (undefined === options.pageCount) {
                this.show = false;
            } else {
                this.pageCount = options.pageCount;
            }
            
            if (undefined === options.currentPage) {
                this.show = false;
            } else {
                this.currentPage = options.currentPage;
            }
        }
    },
    
    events: {
        '' : ''
    },
    
    render: function(view) {
        if (view) {
            $(view).append(this.template({cid: this.cid}));
        }
    }
});


