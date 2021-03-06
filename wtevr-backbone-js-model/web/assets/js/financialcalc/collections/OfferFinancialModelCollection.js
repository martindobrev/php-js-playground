/**
 * Created by martindobrev on 03.06.14.
 */

var OfferFinancialModelCollection = Backbone.Collection.extend({
    model: OfferFinancialModel,
    combinedOverview : null,

    initialize: function() {
        this.listenTo(this, 'change', this.onChange);
        this.listenTo(this, 'add', this.calculateCommonSum);
        this.listenTo(this, 'remove', this.calculateCommonSum);
    },

    onChange: function(obj) {
        L.e('ON CHANGE FROM COLLECTION...');
        this.calculateCommonSum();
    },
    
    calculateCommonSum : function() {
        L.d('FUNC calculateCommonSum called');
        $('#test_overview_table').empty();

        var activeModels = _.filter(this.models, function(model) {
           return model.get('active');
        });
        
        var objectsValid = _.every(activeModels, function(model) {
            return  model.isValid();
        });
        
        if (objectsValid === false) {
            this.combinedOverview = null;
        } else {
            var overviews = new Array();
            _.each(this.models, function(model) {
                overviews.push(model.getOverview());
            });
            //L.e(overviews);
            var schedules = new Array();
            _.each(overviews, function(o) {
                _.each(o.schedule, function(s) {
                    schedules.push(s);
                });
            });
            //L.e(schedules);
            var years = _.groupBy(schedules, function(sc) {
                return sc.year
            });
            
            
            var html = '';
            html += '<table class="table">';
            html += '<thead>';
            html += '<tr>';
            html += '<th>Jarh</th>';
            html += '<th>Annuität</th>';
            html += '<th>Zinsen</th>';
            html += '<th>Tilgung</th>';
            html += '<th>Restschuld</th>';
            html += '</tr>';
            html += '</thead>';
            
            html += '<tbody>';
            
            _.each(years, function(value, key) {
                html += '<tr>';
                var sumInterest = _.reduce(value, function(memo, num) {
                    return memo + num.interest
                }, 0);

                var sumAmortization = _.reduce(value, function(memo, num) {
                    return memo + num.amortization;
                }, 0);
                
                var sumBalance = _.reduce(value, function(memo, num) {
                    return memo + num.balance;
                }, 0);
                
                html += '<td>' + key + '</td>';
                html += '<td>' + accounting.formatNumber(sumInterest + sumAmortization) + '</td>';
                html += '<td>' + accounting.formatNumber(sumInterest) + '</td>';
                html += '<td>' + accounting.formatNumber(sumAmortization) + '</td>';
                html += '<td>' + accounting.formatNumber(sumBalance) + '</td>';
                
                
                html += '</tr>';
                L.e('Year: ' + key + ', interest: ' + sumInterest + ', amortization: ' + sumAmortization + ', balance: ' + sumBalance);
                L.e('------> Formatted: interest: ' + accounting.formatNumber(sumInterest) + ', amortization: ' + accounting.formatNumber(sumAmortization) + ', balance: ' + sumBalance);
            });
            
            html += '</tbody>';
            html += '</table>';
            
            $('#test_overview_table').html(html);
            
            
        }
    }

});