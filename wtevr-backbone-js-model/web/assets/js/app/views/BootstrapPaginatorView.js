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
            
            var html = this.template({
                cid: this.cid, 
                pageCount: this.pageCount,
                currentPage: this.currentPage
            });
            
            $(html).appendTo(view).each(function() {
                
                var ul = this;
                
                $(this).find('a').click(function(e) {
                    if ($(this).parent().hasClass('active')) {
                        // DO NOTHING...
                    } else {
                        $(ul).find('.active').removeClass('active');
                        
                        $(this).parent().addClass('active');
                    }
                });
            });
        }
    }
});


