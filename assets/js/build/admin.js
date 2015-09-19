
var myApp = angular.module('myApp', ['ng-admin']);
myApp.config(['NgAdminConfigurationProvider', function (nga) {
    // create an admin application
    var admin = nga.application('BLAIRLINES').debug(false)
      .baseApiUrl(location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '') + '/'); // main API endpoint
    // create a user entity
    // the API endpoint for this entity will be 'http://jsonplaceholder.typicode.com/users/:id
    var user = nga.entity('user').label('User');
    var dashboard = nga.dashboard();

    // set the fields of the user entity list view
    user.listView().fields([
        nga.field('email'),
        nga.field('password'),
        nga.field('userType')
    ]);
    admin.addEntity(user)

    // add the user entity to the admin application
    // var menu = nga.menu();
    var pilot = nga.entity('pilot').label('Pilot');
    pilot.listView().fields([
        nga.field('name'),
        nga.field('age'),
        nga.field('phone'),
        nga.field('raiting'),
        nga.field('status'),
    ]);
    admin.addEntity(pilot)

        // attach the admin application to the DOM and execute it
    nga.configure(admin);
}]);

myApp.config(['RestangularProvider', function (RestangularProvider) {
    RestangularProvider.addFullRequestInterceptor(function(element, operation, what, url, headers, params) {
        if (operation == "getList") {
            // custom pagination params
            if (params._page) {
                params._start = (params._page - 1) * params._perPage;
                params._end = params._page * params._perPage;
            }
            delete params._page;
            delete params._perPage;
            // custom sort params
            if (params._sortField) {
                params._sort = params._sortField;
                params._order = params._sortDir;
                delete params._sortField;
                delete params._sortDir;
            }
            // custom filters
            if (params._filters) {
                for (var filter in params._filters) {
                    params[filter] = params._filters[filter];
                }
                delete params._filters;
            }
        }
        return { params: params };
    });
}]);