angular.module('app')
    .controller('userAdmin', ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {
        $scope.close = function () {
            $uibModalInstance.dismiss();
        }
    }]);