angular.module('app')
    .component('topNav', {
        templateUrl: "components/common/top-nav.html",
        controller: [function() {
            var self = this;
            self.volume = 's-7';
            self.volumeSlider = {
                value: 100,
                options: {
                    showSelectionBar: true,
                    onChange: function(){
                        if(self.volumeSlider.value > 0) {
                            self.volume = 's-7'
                        }else{
                            self.volume = 's-6';
                        }
                    }
                }
            };
            $(window).scroll(function () {
                var scrollh = $(this).scrollTop();
                if (scrollh > 60) {
                    $(".navv").addClass('compact');
                } else {
                    $(".navv").removeClass('compact');
                }
            });
        }]
    });