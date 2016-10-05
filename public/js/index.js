function Http (url) {
    $.ajax({
        url: url,
        data: data,
        success: success
    });
}

$(document).ready(function () {
    (function () {
        var currency = $('#currency .list');
        currency.click( function (event) {
            var current = event.target.textContent;

            $.ajax({
                type: "POST",
                url: '/currency',
                data: { currency: current },
                success: function () {
                    console.log('sucs');
                },
                error: function () {
                    console.log('error');
                }
            });
        })
    })();

    (function () {
        function clock() {
            var date = new Date();
            var hour=date.getHours();
            var minute=date.getMinutes();
            var sec=date.getSeconds();

            $('#clock').html((hour<10?'0':'')+hour+':'+(minute<10?'0':'')+minute+':'+(sec<10?'0':'')+sec);
            window.setTimeout('clock()',1000);
        }
        clock();
    })();
});