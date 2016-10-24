angular.module('admin')
    .component('adminNavigation', {
        templateUrl: "admin/components/common/admin-navigation.html",
        controller: [function() {
            var self = this;
            self.categs =[
                {name: 'Категории', url: 'admin.categoriesAdmin'},
                {name: 'Торвары', url: 'admin.goodsAdmin'},
                {name: 'Пользователи', url: 'admin.usersAdmin'},
                {name: 'Заказы', url: 'admin.requestsAdmin'},
                {name: 'Акции', url: 'admin.stocksAdmin'},
                {name: 'Валюта', url: 'admin.currencyAdmin'},
                {name: 'Доставка', url: 'admin.deliveryAdmin'},
                {name: 'Комментарии', url: 'admin.commentsAdmin'}
            ]

        }]
    });