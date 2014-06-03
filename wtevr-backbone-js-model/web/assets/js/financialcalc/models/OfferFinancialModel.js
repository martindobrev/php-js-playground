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
        this.listenTo(this, 'change:duration', this.onMainParameterChange);
        this.listenTo(this, 'change:real_interest_percentage', this.onMainParameterChange);
        this.listenTo(this, 'change:loan_amount', this.onMainParameterChange);
    },

    validate : function(attrs, options) {
//L.e('VALIDATING MODEL!!!');
//L.e(attrs);
        var errors = new Array();
        if (attrs.loan_amount !== undefined) {
            if (attrs.loan_amount <= 0) {
                errors.push({
                    property : 'loan_amount',
                    message  : 'load amount has to be a positive number'
                });
            }            
        }
        
        if (attrs.duration !== undefined) {
            if (attrs.duration <= 0 || isNaN(attrs.duration)) {
                errors.push({
                    property : 'duration',
                    message : 'duration has to be a positive integer'
                });
            }            
        }
        
        if (attrs.debit_interest !== undefined) {
            if (attrs.debit_interest >= 1 || attrs.debit_interest <= 0) {
                errors.push({
                    property : 'debit_interest',
                    message  : 'debit interest has to be less than 1 and greater than 0'
                });
            }            
        }
        
        if (attrs.constant_duration !== undefined) {
            if (attrs.constant_duration > attrs.duration) {
                errors.push({
                    property : 'constant_duration',
                    message  : 'constant duration cannot be greater than duration'
                });
            }            
        }
        
        if (attrs.real_interest_percentage !== undefined) {
            if (attrs.real_interest_percentage >= 1 || attrs.real_interest_percentage <= 0) {
                errors.push({
                    property : 'real_interest',
                    message  : 'real interest has to be less than 1 and greater than 0'
                });
            }            
        }
        
        if (attrs.start_amortization_percentage !== undefined) {
            if (attrs.start_amortization_percentage >= 1 || attrs.start_amortization_percentage <= 0) {
                errors.push({
                    property: 'start_amortization_percentage',
                    message: 'start amortization percentage cannot be less than 1 or greater than 0'
                });
            }
        }

        if (errors.length > 0) {

//L.e('THERE ARE SOME ERRORS:');
            _.each(errors, function(e) {
//L.e('---> ' + e.property + ' : ' + e.message);
            });

            return errors;
        }
    },

    onStartAmortizationChange : function(e) {
//L.d('on start amortization change...');

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

            var annuity = annuity / 12;

            this.set({'start_annuity' : annuity, 'duration' : duration}, {silent: true});
            this.trigger('silentchange', {changed: {annuity : annuity, duration : duration}});
        }
    },
    
    onMainParameterChange : function(e) {
        var valuesValid = this.validate({
            duration : this.get('duration'),
            real_interest_percentage: this.get('real_interest_percentage'),
            loan_amount: this.get('loan_amount')
        });
        
        if (undefined !== valuesValid) {
//L.w('CANNOT CALCULATE START AMORTIZATION, values INVALID!!!');
        } else {
            var annuity = OfferFinancialModel.calculateAnnuity(this.get('real_interest_percentage'), 
                this.get('duration'), this.get('loan_amount'), 12);
                
            var interestAmount = OfferFinancialModel.calculateInterestAmount(this.get('loan_amount'),
                this.get('real_interest_percentage'), annuity, 12);
            
            var startAmortizationPercentage = interestAmount / this.get('loan_amount');
            
//L.e('START AMORTIZATION: ' + startAmortizationPercentage);
            
            this.set({'start_amortization_percentage' : startAmortizationPercentage, 'start_annuity' : annuity}, {silent: true});
            this.trigger('silentchange', {changed: {start_amortization_amount: startAmortizationPercentage, annuity: annuity}});
            
        }
    }

}, {
    /**
     * Calculates the annuity value
     *
     *
     *
     * @param interestPercentage Interest value in float representation (for example 4% -> 0.04)
     * @param years Years for the clearance of the credit
     * @param creditAmount
     * @param partsPerYear used to calculate different annuity values. For monthly annuity
     *                     a value of 12 shall be used (a year has 12 months).
     */
    calculateAnnuity : function(interestPercentage, years, creditAmount, amortizationsPerYear) {
        if (!amortizationsPerYear) {
            amortizationsPerYear = 1;
        }
//L.d('FUNC calculateAnnuity');
//L.d('++++ interestPercentage     : ' + interestPercentage);
//L.d('++++ years                  : ' + years);
//L.d('++++ creditAmount           : ' + creditAmount);
//L.d('++++ amortizationsPerYear   : ' + amortizationsPerYear);

        var part = Math.pow((1 + interestPercentage), years);
        var numerator = interestPercentage * part;
        var denominator = part - 1;
        var annuity = creditAmount * (numerator / denominator);

        if (amortizationsPerYear !== 1) {
            annuity = annuity / (amortizationsPerYear + interestPercentage / 2 * (amortizationsPerYear - 1));
        }
//L.d('<------ ' + annuity);
        return annuity;
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
//L.d('FUNC calculateInterestAmount');
//L.d('++++ sum: ' + sum);
//L.d('++++ interest: ' + interest);
//L.d('++++ annuity: ' + annuity);
//L.d('++++ months: '  + months);

        if (!months) months = 12;

        var amount = (sum * interest * months / 12) - (annuity * interest * (months - 1)) / 2;
        if (amount < 0) {
            amount = (sum * interest * months / 12);
        }

//L.d('<------- ' + amount);

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
                                      , realInterestDuration
                                      , realInterest
                                      , overdueInterest
                                      , paymentBeginYear
                                      , paymentBeginMonth
                                      , additionalAmortizationCollection
                                      ) {

// TODO: TEST A SOLUTION WHERE CALCULATIONS ARE MONTHLY-BASED (optional)
/*
L.w('GETTING AMORTIZATION SCHEDULE:');
L.w('+++ interestRatePerPeriod    : ' + interestRatePerPeriod);
L.w('+++ principal                : ' + principal);
L.w('+++ duration                 : ' + duration);
L.w('+++ realInterestDuration     : ' + realInterestDuration);
L.w('+++ realInterest             : ' + realInterest);
L.w('+++ overdueInterest          : ' + overdueInterest);
L.w('+++ paymentBeginYear         : ' + paymentBeginYear);
L.w('+++ paymentBeginMonth        : ' + paymentBeginMonth);
*/


        var balance = principal;
        var sumInterest = 0;
        var sumAmortization = 0;
        var tempInterestRatePerPeriod = interestRatePerPeriod;
        var startInterestRatePerPeriod = interestRatePerPeriod;
        var finalInterestRatePerPeriod = 0;    // Final annuity
        var tempInterest = realInterest;

        var interestCombinationActive = false;
        var overdueAnnuityActive = false;
        var i = 0;
        var restMonths = 12;
        var time = duration;

        /*
         * Check that overdue interest parameters are set correctly
         * 1. the duration of the real interest shall be a valid number
         *    less than the duration
         * 2. the overdue interest shall be a valid float
         *    greater than 0 and less than 1
         */
        var overdueInterestCanBeCalculated = (0 < parseInt(realInterestDuration)
            && false === isNaN(realInterestDuration)
            && duration > realInterestDuration
            && false === isNaN(overdueInterest)
            && 0 < parseFloat(overdueInterest)
            && 1 > parseFloat(overdueInterest)
        );

        var schedule = new Array();

        //L.w('-------------------- CALCULATION BEGIN -------------------');

        while(balance !== 0) {

            var months = 12;
            var restMonths = 0;
            var additionalSplitInterest = 0;            // variables to store the additional interest
            var additionalSplitAmortization = 0;       // and amortization amount
                                                        // in case a split has taken place



            /*
             * If first year, calculate the number of months until the end of the year
             * For example if the amortization begins in April - the 4th month, this
             * means that for the months April, Mai ... December there will be an
             * amortization
             */
            if (0 === i) {
                months = (13 - paymentBeginMonth);
                //L.w('---------> FIRST YEAR ----> Calculating months: ' + months);
            }

            // CHECKING FOR SPLIT


//L.w(i + '------------ BALANCE BEFORE: ' + balance);

            if (i === realInterestDuration) {
                //L.e('!!!!!!!!!! SPLIT REACHED !!!!!!!!!');
                if (true === overdueInterestCanBeCalculated)  {

                    months = paymentBeginMonth - 1;
                    if (0 !== months) {
//L.w('!!!! SPLITTING AMOUNTS ON i: ' + i);
                        additionalSplitInterest = OfferFinancialModel.calculateInterestAmount(balance,
                            tempInterest, tempInterestRatePerPeriod, months);
                        additionalSplitAmortization = tempInterestRatePerPeriod * months - additionalSplitInterest;
//L.w('------> additionalSplitInterest       : ' + additionalSplitInterest);
//L.w('------> additionalSplitAmortization   : ' + additionalSplitAmortization);
//L.w('------> First temp months: ' + months);
                        balance = balance - additionalSplitAmortization;

//L.w(i + '-------------> BALANCE AFTER SPLIT SUBTRACTION: ' + balance);

                        months = 13 - paymentBeginMonth;
//L.w('------> Second temp months: ' + months);

                    } else {
//L.w('!!!! SPLIT YEAR REACHED, BUT MONTHS IS 12!!!!');
                        months = 12;
                    }
                    
                    // Calculate the new annuity (interest rate per month after the overdue)
                    finalInterestRatePerPeriod = OfferFinancialModel.calculateAnnuity(overdueInterest,
                        duration - realInterestDuration, balance, 12);
                    tempInterestRatePerPeriod = finalInterestRatePerPeriod;
                    tempInterest = overdueInterest;
                    L.e('SETTING TEMP INTEREST TO: ' + overdueInterest);

                } else {
//L.e('!!!!! OVERDUE INTEREST CAN NOT BE CALCULATED !!!!!');
                }
            }


            /*
             * If the begin of the amortization is not in January the
             * amount of years in which there will be any amortization
             * is stretched with extra year (the first and the last
             * will be incomplete). To calculate the interest amount
             * we have to correctly set the number of months
             * for the last year's amortization
             */
            if (time == i) {
                months = paymentBeginMonth - 1;
//L.w('--------->  LAST YEAR ----> Calculating months: ' + months);
            }

            var interestAmount = OfferFinancialModel.calculateInterestAmount(balance, tempInterest, tempInterestRatePerPeriod, months);
            var amortizationAmount = tempInterestRatePerPeriod * months - interestAmount;

//L.w(i + '---- amortization amount: ' + amortizationAmount);
//L.e(i + '---- TEMP INTEREST PER PERIOD IS: ' + tempInterestRatePerPeriod);

            var storeRest = balance;
            balance = balance - amortizationAmount;
//L.w(i + '------------ BALANCE AFTER: ' + balance);
            if (balance < 0) {
//L.e('!!! LAST YEAR - BALANCE IS < 0');
                amortizationAmount = storeRest;
                tempInterestRatePerPeriod = interestAmount + amortizationAmount;
                balance = 0;

            }

//L.w(i + ' ---> amortization: ' + (amortizationAmount + additionalSplitAmortization)
//                + ', interest: ' + (interestAmount + additionalSplitInterest));
//L.w('  ---> sum: ' + (amortizationAmount + additionalSplitAmortization
//                        + interestAmount + additionalSplitInterest));

            sumAmortization += amortizationAmount + additionalSplitAmortization;
            sumInterest += interestAmount + additionalSplitInterest;


            var yearOverview = {
                count: i,
                year: i + paymentBeginYear,
                interest: interestAmount,
                amortization: amortizationAmount,
                balance: balance,
                temporaryAmortization: sumAmortization,
                temporaryInterest: sumInterest
            }


            schedule.push(yearOverview);


            i++;
//L.w('  ---> sum amort.: ' + sumAmortization + ', sum interest: ' + sumInterest);
//L.e('  ---> REST: ' + balance);
        }
//L.e('********* SUM AMORT: ' + sumAmortization + ', SUM INTEREST: ' + sumInterest);

        return {
            startInterestRate: {
                monthly: startInterestRatePerPeriod,
                yearly: startInterestRatePerPeriod * 12
            },
            finalInterestRate: {
                monthly: finalInterestRatePerPeriod,
                yearly: finalInterestRatePerPeriod * 12
            },

            startInterestPercentage: realInterest,
            finalInterestPercentage: tempInterest,
            duration: duration,
            startInterestDuration: realInterestDuration,
            overdueInterestCalculable: overdueInterestCanBeCalculated,
            schedule: schedule,
            totalAmortization: sumAmortization,
            totalInterest: sumInterest
        };

    }
});