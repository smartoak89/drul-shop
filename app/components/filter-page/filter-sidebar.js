angular.module('app')
    .component('filterSidebar', {
        templateUrl: "components/filter-page/filter-sidebar.html",
        controller: ['Httpquery', function(Httpquery) {
            console.log('filter sidebar')
        }]
    });