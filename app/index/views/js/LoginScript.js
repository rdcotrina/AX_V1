var LoginScript_ = function() {

    var _private = {};

    var _public = {};

    _public.main = function() {
        $("#login-form").validate({
            // Rules for form validation
            rules: {
                txtUser: {
                    required: true,
                    email: true
                },
                txtClave: {
                    required: true,
                    minlength: 3,
                    maxlength: 20
                }
            },
            // Messages for form validation
            messages: {
                txtEmail: {
                    required: 'Ingrese su correo'
                },
                txtClave: {
                    required: 'Ingrese su clave'
                }
            },
            // Do not change code below
            errorPlacement: function(error, element) {
                error.insertAfter(element.parent());
            },
            submitHandler: function() {
                Login.postEntrar();
            }
        });
    };

    return _public;
};

var LoginScript = new LoginScript_();

LoginScript.main();