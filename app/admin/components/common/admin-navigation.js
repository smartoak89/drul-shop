angular.module('admin')
    .component('adminNavigation', {
        templateUrl: "admin/components/common/admin-navigation.html",
        controller: [function() {
            var self = this;
            self.categs =[
                {name: 'Категории', url: 'categoriesAdmin'},
                {name: 'Торвары', url: 'goodsAdmin'},
                {name: 'Пользователи', url: 'usersAdmin'},
                {name: 'Заказы', url: 'requestsAdmin'},
                {name: 'Акции', url: 'stocksAdmin'},
                {name: 'Валюта', url: 'currencyAdmin'},
                {name: 'Доставка', url: 'deliveryAdmin'},
                {name: 'Комментарии', url: 'commentsAdmin'}
            ]

        }]
    });