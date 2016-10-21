angular.module('app')
    .component('filterPage', {
        templateUrl: "components/filter-page/filter-page.html",
        controller: ['Httpquery', function(Httpquery) {
            console.log('filterPage')
        }]
    });