/*
 * Testing Backbone Structure
 */

$(document).ready(function() {
    
    var p = new Employee({
        firstname: 'Tim',
        lastnane: 'Thomas',
        position: 'Senior Developer',
        salary: 7300,
        age: 29
    });
    
    p.set({firstname: 'fgfhgfh'});
    
    
    var employeeList = new EmployeeListView();
    employeeList.render();
});