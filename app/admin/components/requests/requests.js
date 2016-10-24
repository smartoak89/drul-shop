angular.module('admin')
    .component('requests', {
        templateUrl: "admin/components/requests/requests.html",
        controller: [function() {
            var self = this;
            self.status = "question-circle-o";

        }]
    });