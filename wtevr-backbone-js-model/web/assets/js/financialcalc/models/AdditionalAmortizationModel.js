/**
 * Created by martindobrev on 30.05.14.
 */
var AdditionalAmortizationModel = Backbone.Model.extend({

    defaults: {
        amount: 0,
        start_year: new Date().getFullYear(),
        final_year: new Date().getFullYear()
    },


    validate : function(attrs, options) {
        var errors = new Array();

        if (true === isNaN(parseInt(attrs.amount))) {
            errors.push({
                property: 'amount',
                message: 'amount shall be a valid number'
            });
        }

        if (0 >= parseInt(attrs.amount)) {
            errors.push({
                property: 'amount',
                message: 'amount shall be a positive number'
            });
        }

        if (true === isNaN(parseInt(attrs.start_year))) {
            errors.push({
                property: 'start_year',
                message: 'start year shall be a valid number'
            });
        }

        if (0 >= parseInt(attrs.start_year)) {
            errors.push({
                property: 'start_year',
                message: 'start year shall be a positive number'
            });
        }

        if (true === isNaN(parseInt(attrs.final_year))) {
            errors.push({
                property: 'final_year',
                message: 'end year shall be a valid number'
            });
        }

        if (0 >= parseInt(attrs.final_year)) {
            errors.push({
                property: 'final_year',
                message: 'final year shall be a positive number'
            });
        }

        if (attrs.final_year > attrs.start_year) {
            errors.push({
                property: 'final_year',
                message: 'final year cannot be less than start year'
            });
        }

        if (errors.length > 0) {
            return errors;
        }
    }
});