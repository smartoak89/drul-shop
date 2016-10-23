angular.module('app')
    .controller('product', ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {
        $scope.close = function () {
            $uibModalInstance.dismiss();
        }
    }]);