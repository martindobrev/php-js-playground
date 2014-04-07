var EmployeeListView = Backbone.View.extend({ 
    el: '#backbone_container',
    template : _.template($('#employee_table_template').html()),
    
    initialize: function(options) {
        
        var defaultEntriesPerPage = 10;
        
        
        if (undefined === options) {
            this.currentPage = 1;
            this.entriesPerPage = defaultEntriesPerPage;
        } else {
            if (undefined !== options.currentPage) {
                this.currentPage = options.currentPage;
            } else {
                this.currentPage = 1;
            }

            if (undefined !== options.entriesPerPage) {
                this.entriesPerPage = options.entriesPerPage;
            } else {
                this.entriesPerPage = defaultEntriesPerPage;
            }
        }
        
        this.entryCount = this.collection.length;
        this.pageCount = Math.ceil(this.entryCount / this.entriesPerPage);
        this.sortBy = null;
        
        console.log('Entries: ' + this.entryCount);
        console.log('Pages: ' + this.pageCount);
        
    },
    
    render: function() {
        var t = this;
        
        $(this.el).html(this.template({cid: t.cid})).each(function() {
            
            //var paginator = new BootstrapPaginatorView({
            //   pageCount: 20,
            //   currentPage: 5
            //});
            
            //paginator.render(this);
            
            
            $('#entries_per_page').change(function(event) {
                t.setEntriesPerPage(parseInt($(this).val()));
            });
            
            
            
            $(this).find('th[data-filter-property]').mouseover(function() {
                $(this).css('cursor', 'pointer');
            }).click(function() {
                if ($(this).find('.glyphicon-sort-by-attributes').length > 0) {
                    $(this).find('.glyphicon-sort-by-attributes').remove();
                    $(this).append('<span class="glyphicon glyphicon-sort-by-attributes-alt"></span>');
                    t.sortBy = {'property' : $(this).attr('data-filter-property'), 'type': 'desc'};
                    t.renderPage(t.currentPage);
                } else if ($(this).find('.glyphicon-sort-by-attributes-alt').length > 0) {
                    $(this).find('.glyphicon-sort-by-attributes-alt').remove();
                    t.sortBy = null;
                    t.renderPage(t.currentPage);
                } else {
                    $(this).append('<span class="glyphicon glyphicon-sort-by-attributes"></span>');
                    t.sortBy = {'property' : $(this).attr('data-filter-property'), 'type': 'asc'};
                    t.renderPage(t.currentPage);
                }
            });
            
            
            $(this).find('#pagination_container').pagination({
                items: t.entryCount,
                itemsOnPage: t.entriesPerPage,
                pages: t.pageCount,
                currentPage: t.currentPage, 
                onPageClick: function(pageNumber, event) {
                    t.currentPage = pageNumber;
                    t.renderPage(pageNumber);
                    event.preventDefault();
                }
            });
            
            
            t.renderPage(t.currentPage);
            /*
            for (var i = 0; i < t.collection.length; i++) {
                var modelData = t.collection.models[i];
                var employee = new EmployeeTableRowView({
                    model: modelData
                });
                employee.render(tbody);
            }
            */
        });
    },
    
    
    renderPage: function(pageNumber) {
        var t = this;
        $('#' + this.cid).find('tbody').empty();
        
        
        t.sortedModels = this.collection.models;
        
        if (t.sortBy !== null) {
            t.sortedModels = _.sortBy(this.sortedModels, function(item) {
                return item.sort(t.sortBy.property);
            });
            
            if ('desc' === t.sortBy.type) {
                t.sortedModels.reverse();
            }
        }
        
        
        var indexes = _.range(((this.currentPage - 1) * this.entriesPerPage), this.currentPage * this.entriesPerPage);
        
        
        _.each(indexes, function(item) {
            console.log('Rendering entry: ' + item);
            if (item < t.sortedModels.length) {
                var modelData = t.sortedModels[item];
                var employee = new EmployeeTableRowView({
                    model: modelData
                });
                
                employee.render($('#' + t.cid).find('tbody'));
            }
        });
    },
    
    setEntriesPerPage: function(count) {
        this.entriesPerPage = count;
        this.pageCount = Math.ceil(this.entryCount / this.entriesPerPage);
        this.currentPage = 1;
        
        
        $('#pagination_container').pagination('updateItemsOnPage', this.entriesPerPage);
        $('#pagination_container').pagination('selectPage', 1);
        
        this.renderPage(1);
        
    }
});