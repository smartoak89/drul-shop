angular.module('app')
    .component('headerr', {
        templateUrl: "components/common/headerr.html",
        controller: ['User', function(User) {
            this.User = User;
            this.logout = function () {
                // this.user = null;
                User.deactive();
            };
            this.click = function () {
                User.set({id: 92873928219});
            }
        }]
    });