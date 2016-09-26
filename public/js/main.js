function $http (type, url, data, error, success) {
    this.type = type;
    this.url = url;
    this.data = data;
    this.error = error;
    this.success = success;
}
$http.prototype.send = function () {
    $.ajax({
        type: this.type,
        url: this.url,
        error: function error(err) {
            return this.error(err);
        },
        success: function success(data) {
            return this.success(data);
        }
    });
};

$(document).ready(function () {
    user = {
        save: function (id) {
            var option = {
                currency: $('#currency').val()
            };

            var http = new $http("PUT", "/admin/user/" + id, option, function (err) {
                console.log(err);
            }, function (data) {
                console.log(data);
            });

            http.send();
            console.log(http);
        }
    }
});