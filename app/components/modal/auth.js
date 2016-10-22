angular.module('app')
    .controller('auth', ['$uibModalInstance', '$scope', function ($uibModalInstance, $scope) {
        $scope.close = function () {
            $uibModalInstance.dismiss();
        }
    }]);