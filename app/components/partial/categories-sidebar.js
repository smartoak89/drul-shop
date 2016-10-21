angular.module('app')
    .component('categoriesSidebar', {
        templateUrl: "components/partial/categories-sidebar.html",
        controller: [function() {
            console.log('Categories loaded!')
        }]
    });