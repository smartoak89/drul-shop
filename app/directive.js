angular.module('app')
    //Modal window
    .directive('modal', function($uibModal) {
        var modalInstance;
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                var type = attrs.modal;

                element.on('click', (function() {
                    if (modalInstance) {
                        modalInstance.dismiss();
                    }

                    modalInstance = $uibModal.open({
                        animation: false,
                        templateUrl: 'components/modal/' + type + '.html',
                        controller: type,
                        size: type,
                        resolve: {
                            modalData: function () {
                                return scope;
                            }
                        }
                    });
                }));
            }
        };
    });