var Employees = Backbone.Collection.extend({
    model: Employee,
    url: ROOT_PATH + '/backbone/' + MODEL
});