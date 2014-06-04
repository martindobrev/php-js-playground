/**
 * Created by martindobrev on 22.05.14.
 */


var OfferFinancialModelView = Backbone.View.extend({
    template: _.template($('#offer_financial_model_view_template').html()),

    initialize: function(options) {
        this.focusedOn = null;

        if (this.model) {
            L.d('Initializing view');

            this.listenTo(this.model, 'change', this.onModelChange);
            this.listenTo(this.model, 'silentchange', this.onModelChange);
        } else {
            L.w('NO MODEL FOR THE FINANCIAL VIEW SPECIFIED!!!');
        }
    },

    render: function() {
        L.d('RENDERING TEST VIEW...');
        var t = this;
        $(this.template({model: this.model})).appendTo(this.$el).each(function() {
            $(this).find('i').parent().click(function() {
                L.w('TRIGGERING REMOVE ELEMENT EVENT!');
                t.trigger('removeelement', t, t.model);
            });
        });
    },

    events: {
        'keyup input[type="text"]'      : 'onTextInputKeyup',
        'focusin input[type="text"]'    : 'onTextInputFocusIn',
        'focusout input[type="text"]'   : 'onTextInputFocusOut',
        'change input[type="checkbox"]' : 'onActiveChange'
    },

    onTextInputFocusIn : function(e) {
        L.d('Focusing on element "' + $(e.target).attr('name') + '"');
        this.focusedOn = $(e.target).attr('name');
    },

    onTextInputFocusOut : function(e) {
        var elName = $(e.target).attr('name');
        if (this.focusedOn === elName) {
            this.focusedOn = null;
        }
    },

    onModelChange : function(change) {
        L.d('Model changed...');
        L.w('CHANGES ARE: ');
        L.w(change.changed);
        //L.w('----> Valid : ' + this.model.isValid());
        //L.e(this.model.attributes);
        //L.e('--------------------------------------');



        for (var i in change.changed) {

            if (i !== this.focusedOn) {
                if (i === 'start_amortization_percentage') {
                    this.$el.find('input[name="' + i + '"]').val(accounting.formatNumber(change.changed[i] * 100));

                } else if (i === 'start_annuity' || i === 'end_annuity') {
                    this.$el.find('input[name="' + i + '"]').val(accounting.formatNumber(change.changed[i] * 12));
                } else {
                    this.$el.find('input[name="' + i + '"]').val(change.changed[i]);
                }
            }

            if (i === 'active') {
                var interactiveProperties = this.model.getInteractiveProperties();
                var t = this;
                if (true === change.changed[i]) {
                    _.each(interactiveProperties, function(prop) {
                        t.$el.find('input[name="' + prop + '"]').prop('disabled', false);
                    });
                } else {
                    _.each(interactiveProperties, function(prop) {
                        t.$el.find('input[name="' + prop + '"]').prop('disabled', true);
                    });
                }
            }
        }


        if (this.model.isValid() && this.model.get('active')) {
            L.w('MODEL IS VALID!!!!');


            var interestRatePerPeriod = OfferFinancialModel.calculateAnnuity(this.model.get('real_interest_percentage')
                , this.model.get('duration')
                , this.model.get('loan_amount')
                , 12);


            var year = parseInt($('#test_year').val());
            var month = parseInt($('#test_month').val());

            if (isNaN(year)) {
                year = 2014;
            }

            if (isNaN(month)) {
                month = 6;
            }


            var result = OfferFinancialModel.getAmortizationSchedule(interestRatePerPeriod
                , this.model.get('loan_amount')
                , this.model.get('duration')
                , this.model.get('constant_duration')
                , this.model.get('real_interest_percentage')
                , this.model.get('overdue_interest_percentage')
                , year
                , month
            );


            if (result.overdueInterestCalculable) {
                this.$el.find('input[name="end_annuity"]').val(accounting.formatNumber(result.finalInterestRate.yearly));
            } else {
                this.$el.find('input[name="end_annuity"]').val('');
            }


//L.w('************************* PRINTING RESULT OUT ***********************');
//for (var i = 0; i < result.schedule.length; i++) {
//    L.d(result.schedule[i]);
//}
//L.e('TOTAL INTEREST: ' + result.totalInterest);
//L.e('TOTAL AMORTIZATION: ' + result.totalAmortization);

        }
    },

    onSilentModelChange : function(change) {
        this.onModelChange(change);
    },

    onTextInputKeyup : function(e) {
        this.focusElement = ''
        var propertyName = $(e.target).attr('name');
        L.d('CHANGING PROPERTY ' + propertyName);

        var stringProperties = ['name'];
        var integerProperties = ['duration', 'constant_duration'];
        var floatProperties = ['start_annuity', 'end_annuity', 'loan_amount'];
        var percentageValues = ['debit_interest_percentage', 'real_interest_percentage'
            , 'start_amortization_percentage', 'overdue_interest_percentage'];

        if (_.contains(stringProperties, propertyName)) {
            this.model.set(propertyName, $(e.target).val());
        }

        if (_.contains(integerProperties, propertyName)) {
            var preparedValue = parseInt($(e.target).val());
            L.d('----> Setting prepared integer value: ' + preparedValue);
            this.model.set(propertyName, preparedValue);
        }

        if (_.contains(floatProperties, propertyName)) {
            var preparedValue = accounting.unformat($(e.target).val(), ',');
            L.d('----> Setting prepared float value: ' + preparedValue);
            this.model.set(propertyName, preparedValue);
        }

        if (_.contains(percentageValues, propertyName)) {
            var preparedValue = parseFloat(accounting.unformat($(e.target).val(), ',') / 100, 4);
            L.d('----> Setting prepared percentage value: ' + preparedValue);
            this.model.set(propertyName, preparedValue);
        }
    },

    onActiveChange : function(e) {
        L.d('ACTIVE SET TO: ' + $(e.target).is(':checked'));
        this.model.set('active', $(e.target).is(':checked'));
    }
});