angular.module('app')
    .controller('register', ['$uibModalInstance', '$scope', 'Httpquery', function ($uibModalInstance, $scope, Httpquery) {
        $scope.user = {};
        $scope.error = null;

        $scope.register = function () {
          if (isValid() == true) {
              Httpquery.save({params1: 'user', params2: 'register'}, $scope.user, function (res) {
                console.log('success', res);
              }, function (ex) {
                  $scope.error = ex.data.message;
                  console.log('error', ex);
              })
          }
        };

        var reg = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        function isValid () {
            if (!$scope.user.firstname) return $scope.error = 'Пожалуйста введите имя!';
            if (!$scope.user.lastname) return $scope.error = 'Пожалуйста введите Фамилию!';
            if (!$scope.user.email) return $scope.error = 'Пожалуйста введите email!';
            if (!reg.test($scope.user.email)) return $scope.error = 'Некоректный email!';
            if (!$scope.user.phone) return $scope.error = 'Пожалуйста введите номер телефона!';
            if (!$scope.user.password) return $scope.error = 'Пожалуйста введите пароль!';
            if ($scope.user.password.length < 4) return $scope.error = 'Пароль должен быть не менее 4 символов!';

            $scope.error = null;
            return true;
        }

        $scope.close = function () {
            $uibModalInstance.dismiss();
        }
    }]);