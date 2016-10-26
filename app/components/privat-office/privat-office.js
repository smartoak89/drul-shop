angular.module('app')
    .component('privatOffice', {
        templateUrl: "components/privat-office/privat-office.html",
        controller: [function() {
            var self = this;
            self.counter = 0;
            self.countPlus = function(){
                self.counter++;
            };
            self.countMinus = function(){
                self.counter--;
            }
        }]
    });