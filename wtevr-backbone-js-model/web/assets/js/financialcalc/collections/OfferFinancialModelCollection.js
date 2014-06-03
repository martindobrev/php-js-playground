/**
 * Created by martindobrev on 03.06.14.
 */

var OfferFinancialModelCollection = Backbone.Collection.extend({
    model: OfferFinancialModel,

    initialize: function() {
        this.listenTo(this, 'change', this.onChange);
    },

    onChange: function(obj) {
        L.e('ON CHANGE FROM MODEL_COLLECTION');
        L.e('---> model ' + obj.cid + ' is valid: ' + obj.isValid());
    }

});