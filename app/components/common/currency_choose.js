    angular.module('app')

    .component('currencyChoose', {
        template: '<ui-select ng-model="$ctrl.selectedItem" ng-change="$ctrl.changeCurrency($select.selected.name)">' +
                        '<ui-select-match>' +
                            '<span ng-bind="$select.selected.name"></span>' +
                        '</ui-select-match>' +
                        '<ui-select-choices repeat="item in ($ctrl.itemArray | filter: $select.search) track by item.id">' +
                            '<span ng-bind="item.name"></span>' +
                        '</ui-select-choices>' +
                    '</ui-select>',
        controller: ['$cookies', 'Product', function($cookies, Product) {
            var self = this;
            self.itemArray = [
                {id: 1, name: 'UAH'},
                {id: 2, name: 'RUR'},
                {id: 3, name: 'USD'}
            ];

            var currency = $cookies.get('currency');

            self.selectedItem = {name: currency} || self.itemArray[0];

            this.changeCurrency = function (value) {
                Product.changeCurrency(value);
                $cookies.put('currency', value);
            }
        }]
    });
