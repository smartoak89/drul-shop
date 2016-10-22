angular.module('app')
    .controller('register', ['$uibModalInstance', '$scope', function ($uibModalInstance, $scope) {
        $scope.close = function () {
            $uibModalInstance.dismiss();
        }
    }]);