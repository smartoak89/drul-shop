angular.module('admin')
    .component('adminNavigation', {
        templateUrl: "admin/components/common/admin-navigation.html",
        controller: [function() {
            var self = this;
            self.categs =[
                {name: 'Категории', url: 'categsAdmin'},
                {name: 'Торвары', url: 'tovs'},
                {name: 'Пользователи', url: 'users'},
                {name: 'Заказы', url: 'reqs'},
                {name: 'Акции', url: 'stocks'},
                {name: 'Валюта', url: 'curr'},
                {name: 'Доставка', url: 'deliv'},
                {name: 'Комментарии', url: 'com'}
            ]

        }]
    });