/**
 * Created by martindobrev on 03.06.14.
 */

var OfferFinancialModelCollectionView = Backbone.View.extend({
    el: '#test_container',

    initialize : function() {
        this.listenTo(this.collection, 'add', this.onElementAdd);
    },

    render: function() {
        var t = this;
        this.collection.forEach(function(model) {
            t.onElementAdd(model);
        });
    },

    onElementAdd : function(financialModel) {
        L.w('onElementAdd  CALLED!');
        var t = this;
        $('<div/>', {id: financialModel.cid}).appendTo(this.el).each(function() {
            var view = new OfferFinancialModelView({el: '#' + financialModel.cid, model: financialModel});
            view.render();
            L.w('ADDING REMOVE ELEMENT LISTENER TO VIEW');
            t.listenTo(view, 'removeelement', t.onElementRemove);
        });
    },

    onElementRemove : function(view, model) {
        L.w('ON ELEMENT REMOVE!!!!');
        L.w('VIEW ID IS: ' + view.cid);
        L.w('MODEL ID IS: ' + model.cid);
        this.collection.remove(model);
        view.remove();
    }




});