angular.module('app')
    .controller('register', ['$uibModalInstance', '$scope', 'Httpquery', function ($uibModalInstance, $scope, Httpquery) {
        $scope.user = {};
        $scope.error = null;

        $scope.register = function () {
          if (isValid() == true) {
              console.log('isValid')
          }
        };

        var reg = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        function isValid () {
            if (!$scope.user.firstname) return $scope.error = 'Пожалуйста введите имя!';
            if (!$scope.user.lastname) return $scope.error = 'Пожалуйста введите Фамилию!';
            if (!$scope.user.email) return $scope.error = 'Пожалуйста введите email!';
            if (!reg.test($scope.user.email)) return $scope.error = 'Некоректный email!';
            if (!$scope.user.phone) return $scope.error = 'Пожалуйста введите номер телефона!';

            $scope.error = null;
            return true;
        }

        $scope.close = function () {
            $uibModalInstance.dismiss();
        }
    }]);