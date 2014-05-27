/**
 * Created by martindobrev on 22.05.14.
 */

var OfferFinancialModel = Backbone.Model.extend({

    defaults: {
        loan_amount: 0,
        duration: 0,
        debit_interest_percentage: 0,
        constant_duration: 0,
        real_interest_percentage: 0,
        overdue_interest_percentage: 0,
        start_amortization_percentage: 0,
        start_annuity : 0,
        end_annuity : 0
    },

    initialize: function() {
        this.listenTo(this, 'change:start_amortization_percentage', this.onStartAmortizationChange);
        this.listenTo(this, 'change:duration')
    },

    validate : function(attrs, options) {
        var errors = new Array();
        if (attrs.loan_amount <= 0) {
            errors.push({
                property : 'loan_amount',
                message  : 'load amount has to be a positive number'
            });
        }

        if (attrs.duration <= 0) {
            errors.push({
                property : 'duration',
                message : 'duration has to be a positive integer'
            });
        }

        if (attrs.debit_interest >= 1 || attrs.debit_interest <= 0) {
            errors.push({
                property : 'debit_interest',
                message  : 'debit interest has to be less than 1 and greater than 0'
            });
        }

        if (attrs.constant_duration > attrs.duration) {
            errors.push({
                property : 'constant_duration',
                message  : 'constant duration cannot be greater than duration'
            });
        }

        if (attrs.real_interest >= 1 || attrs.real_interest <= 0) {
            errors.push({
                property : 'real_interest',
                message  : 'real interest has to be less than 1 and greater than 0'
            });
        }


        if (attrs.overdue_interest >= 1 || attrs.overdue_interest <= 0) {
            errors.push({
                property : 'overdue_interest',
                message  : 'overdue interest has to be less than 1 and greater than 0'
            });
        }

        if (attrs.start_amortization >= 1 || attrs.start_amortization <= 0)

        if (errors.length > 0) {
            return errors;
        }
    },

    onStartAmortizationChange : function(e) {
        //L.d('on start amortization change...');
        //L.d('THIS IS: ');
        //L.d(this);

        var startAmortizationPercentage = e.changed.start_amortization_percentage;

        var valuesValid = this.validate({
            real_interest_percentage: this.get('real_interest_percentage'),
            start_amortization_percentage: startAmortizationPercentage,
            loan_amount: this.get('loan_amount')
        });

        if (undefined !== valuesValid) {
            //L.w('CANNOT CALCULATE duration etc.., values invalid!');

        } else {
            //L.d('Values valid, calculating duration...');

            var duration = Math.ceil(OfferFinancialModel.calculateDurationInYears(
                this.get('real_interest_percentage'), startAmortizationPercentage
            ));

            var annuity = (this.get('real_interest_percentage') + startAmortizationPercentage)
                * this.get('loan_amount');

            this.set({'start_annuity' : annuity, 'duration' : duration}, {silent: true});
            this.trigger('silentchange', {changed: {annuity : annuity, duration : duration}});
        }
    }

}, {
    /**
     * Calculates the annuity value
     *
     *
     *
     * @param interest Interest value in float representation (for example 4% -> 0.04)
     * @param years Years for the clearance of the credit
     * @param creditAmount
     * @param partsPerYear used to calculate different annuity values. For monthly annuity
     *                     a value of 12 shall be used (a year has 12 months).
     */
    calculateAnnuity : function(interest, years, creditAmount, amortizationsPerYear) {
        if (!amortizationsPerYear) {
            amortizationsPerYear = 1;
        }

        var part = Math.pow((1 + interest), years);
        var numerator = interest * part;
        var denominator = part - 1;
        var annuity = creditAmount * (numerator / denominator);

        if (amortizationsPerYear === 1) {
            return annuity;
        } else {
            return annuity / (amortizationsPerYear + interest / 2 * (amortizationsPerYear - 1));
        }
    },

    /**
     * Calculates the yearly interest for the specified values
     *
     * (Default values - months undefined - use the full 12 months of the year,
     * if you want to calculate the interest for some part of the year,
     * specify another number of months)
     *
     * @param sum               - Amount of money to calculate
     * @param interest          - interest in percent (values shall be ready for calculations - 4% -> 0.04)
     * @param annuity           - monthly annuity
     * @param months            - number of months (default is 12)
     */
    calculateInterestAmount: function(sum, interest, annuity, months) {
        if (!months) months = 12;

        var amount = (sum * interest * months / 12) - (annuity * interest * (months - 1)) / 2;
        if (amount < 0) {
            amount = (sum * interest * months / 12);
        }
        return amount;
    },

    /**
     * Calculates the amortization period in years based on the
     * real interest and start amortization percentage
     *
     * The result is rounded with Math.ceil to provide a whole number of years
     *
     * @param realInterestPercentage
     * @param startAmortizationPercentage
     */
    calculateDurationInYears : function(realInterestPercentage, startAmortizationPercentage) {
        return Math.ceil(Math.log(1 + realInterestPercentage / startAmortizationPercentage)
            / Math.log(1 + startAmortizationPercentage));
    },


    getAmortizationSchedule : function(interestRatePerPeriod
                                      , principal
                                      , duration
                                      , realInterest
                                      , overdueInterests
                                      , paymentBeginYear
                                      , paymentBeginMonth
                                      ) {

        L.w('GETTING AMORTIZATION SCHEDULE:');
        L.w('+++ principal         : ' + principal);
        L.w('+++ monthlyAnnuity    : ' + interestRatePerPeriod);
        L.w('+++ duration          : ' + duration);
        L.w('+++ realInterest      : ' + realInterest);
        L.w('+++ overdueInterest   : ' + overdueInterests);
        L.w('+++ paymentBeginYear  : ' + paymentBeginYear);
        L.w('+++ paymentBeginMonth : ' + paymentBeginMonth);

        var balance = principal;
        var sumInterest = 0;
        var sumAmortization = 0;
        var annuity = interestRatePerPeriod;
        var interest = realInterest;

        var interestCombinationActive = false;
        var overdueAnnuityActive = false;
        var i = 0;
        var restMonths = 12;
           // TODO: Extend to support begin from all months
        var time = duration;


        L.w('-------------------- CALCULATION BEGIN -------------------');
        // TODO: Add second annuity calculation
        while(Math.round(balance) > 0) {

            var months = 12;

            if (0 === i || time === i) {
                L.w('---------> FIRST OR LAST YEAR -> CHECKING FOR SPLIT...');
                months = (13 - paymentBeginMonth);
                if (12 !== months) {
                    restMonths = 12 - months;
                }
                L.w('---------> REST MONTHS: ' + restMonths + ', MONTHS: ' + months);
            }



            var interestAmount = OfferFinancialModel.calculateInterestAmount(balance, interest, annuity, months);
            var amortizationAmount = annuity * months - interestAmount;

            var storeRest = balance;
            balance = balance - amortizationAmount;

            if (balance < 0) {
                L.e('!!! LAST YEAR !!!');
                amortizationAmount = storeRest;
                annuity = interestAmount + amortizationAmount;
                balance = 0;
            }

            L.w(i + ' ---> amortization: ' + amortizationAmount + ', interest: ' + interestAmount);

            sumAmortization += amortizationAmount;
            sumInterest += interestAmount;
            i++;
            L.w('  ---> sum amort.: ' + sumAmortization + ', sum interest: ' + sumInterest);
            L.e('  ---> REST: ' + balance);
        }
        L.e('********* SUM AMORT: ' + sumAmortization + ', SUM INTEREST: ' + sumInterest);
    }
});