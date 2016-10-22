angular.module('app')
    .component('categoriesSidebar', {
        templateUrl: "components/front-page/category-sidebar.html",
        controller: ['Category', function(Category) {
            this.$onInit = function () {
                this.categories = Category.getList();
            }
        }]
    });