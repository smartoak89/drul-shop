angular.module('app')
    .component('categoriesSidebar', {
        templateUrl: "components/front-page/category-sidebar.html",
        controller: ['Httpquery', 'category', function(Httpquery, category) {
            this.$onInit = function () {
                this.categories = category.getList();
            }
        }]
    });