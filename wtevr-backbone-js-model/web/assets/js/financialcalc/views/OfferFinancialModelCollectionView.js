/**
 * Created by martindobrev on 03.06.14.
 */

var OfferFinancialModelCollectionView = Backbone.View.extend({
    el: '#test_container',
    collection : OfferFinancialModelCollection,
    render: function() {
        this.collection.forEach(function(model) {
            var view = new OfferFinancialModelView({el: this.el, model: model});
            view.render();
        });
    }
});