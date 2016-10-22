angular.module('app')
    .component('headerr', {
        templateUrl: "components/common/headerr.html",
        controller: [function() {
            var self = this;
            self.itemArray = [
                {id: 1, name: 'UAH'},
                {id: 2, name: 'RUB'},
                {id: 3, name: 'DOL'}
            ];

            self.selectedItem = self.itemArray[0];
        }]
    });