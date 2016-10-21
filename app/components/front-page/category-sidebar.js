angular.module('app')
    .component('categoriesSidebar', {
        templateUrl: "components/front-page/category-sidebar.html",
        controller: ['Httpquery', function(Httpquery) {
            this.$onInit = function () {
                var self = this;
                Httpquery.query({path: 'categories'}, function (res) {
                    self.categories = res;
                })
            }
        }]
    });