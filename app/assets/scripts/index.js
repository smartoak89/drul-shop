
$(document).ready(function () {
    (function () {
        var currency = $('#currency .list');
        currency.click( function (event) {
            var current = event.target.textContent;
            console.log('currency', currency);
            $.ajax({
                type: "POST",
                url: '/currency',
                data: { currency: current },
                success: function () {
                    window.location.reload();
                },
                error: function () {
                    console.log('error');
                }
            });
        })
    })();

    (function () {
        function clock () {
            var date = new Date();
            var hour=date.getHours();
            var minute=date.getMinutes();
            var sec=date.getSeconds();

            $('#clock').html((hour<10?'0':'')+hour+':'+(minute<10?'0':'')+minute+':'+(sec<10?'0':'')+sec);
            setTimeout(clock,1000);
        }
        clock();
    })();

    // Add and delete category
    (function () {
        $('button.create-categ').click(function () {
            $('#create-categ').modal('show');
        });

        $('button[data-add=category]').click(function () {
            var input = $('form.add-category input');
            var formData = {
                name: $(input[0]).val(),
                link: $(input[1]).val(),
                article: $(input[2]).val()
            };

            $.ajax({
                type: "POST",
                url: '/api/category',
                data: formData,
                success: function (data) {
                    addToTemplate(formData, data.uuid);
                    $('#create-categ').modal('hide');
                },
                error: function (err) {
                    console.log('error', err);
                }
            });

        });

        $('a.delete-categ').click(function () {
            var self = $(this);
            $('#deleteCateg').modal('show');

            $('button[data-modal-delete=categ]').click(function () {
                $.ajax({
                    type: "DELETE",
                    url: '/api/category/' + self.attr('data-id'),
                    success: function (msg) {
                        self.parent().parent().remove();
                        $('#deleteCateg').modal('hide');
                    },
                    error: function (err) {
                        console.log('error', err);
                    }
                });
            });
        });

        $('button[data-modal=close]').click(function () {
            $('#create-categ').modal('hide');
            $('#deleteCateg').modal('hide');
        });

        function addToTemplate(form, id) {
            var body = $('.category-body');
            var tr = $("<tr></tr>");
            for (key in form) {
                tr.append($("<td></td>").html(form[key]));
            }
        }

    })();
});