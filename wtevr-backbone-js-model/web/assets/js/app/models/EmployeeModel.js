var Employee = Backbone.Model.extend({

    defaults: {
        firstname: 'Joe',
        lastname: 'Black',
        position: 'unemployed',
        salary: 0,
        age: -1
    },

    initialize: function() {
        console.log("Employee with id: " + this.cid + " created!");
    }
    /*
    events: {
        'change' : 'changeParameters'
    },

    changeParameters: function() {
        console.log('SOME PARAMETERS CHANGED!!!');
    }
    */
});


