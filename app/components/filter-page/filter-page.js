angular.module('app')
    .component('filterPage', {
        templateUrl: "components/filter-page/filter-page.html",
        controller: ['Httpquery', 'category', function(Httpquery, category) {
            console.log(category.getList())
        }]
    });