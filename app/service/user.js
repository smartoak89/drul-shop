angular.module('app')
    .factory('User', ['Httpquery', '$cookies', function (Httpquery, $cookies) {
        function tryActivate () {
            try {
                return JSON.parse($cookies.get('user'))
            } catch (ex){
                return null;
            }
        }
        return {
            active: tryActivate(),
            set: function (user) {
                this.active = user;
                $cookies.put('user', JSON.stringify(user));
            },
            deactive: function () {
                this.active = null;
                $cookies.remove('user');
            }

        };

    }]);