angular.module('app')
    .controller('product', ['$scope', '$uibModalInstance', 'Cart', 'modalData', function ($scope, $uibModalInstance, Cart, modalData) {
        var product = modalData.product;

        $scope.addToDeferred = function () {
            Cart.addToDeferred(product);
        };

        $scope.close = function () {
            $uibModalInstance.dismiss();
        }
    }]);