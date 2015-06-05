var Login_ = function() {

    /*cargar requires*/
    try{
        axExe.require({
            index: 'LoginScript'
        });
    }catch (ex){
        auditoria.logErrors(e);
    }
    

    var _private = {};

    _private.config = {
        modulo: 'index/Index/',
        moduloLG: 'index/Login/'
    };

    var _public = {};  _public.post = function() {};

    _public.postEntrar = function() {
        try {
            axAjax.send({
                flag: 1,
                element: '#btnEntrar',
                root: _private.config.moduloLG,
                fnServerParams: function(sData) {
                    sData.push({name: '_user', value: axAjax.stringPost($('#txtUser').val())});
                    sData.push({name: '_clave', value: axAjax.stringPost($('#txtClave').val())});
                },
                fnCallback: function(data) {
                    if (!isNaN(data.id_usuario) && data.id_usuario > 0 && localStorage.getItem('mainBodyHtml') === 'null') {
                        axScript.notify.ok({
                            content: lang.mensajes.MSG_2,
                            callback: function() {
                                axScript.redirect('index');
                            }
                        });
                    }else if (!isNaN(data.id_usuario) && data.id_usuario > 0 && localStorage.getItem('mainBodyHtml') !== 'null') {
                        axScript.notify.ok({
                            content: lang.mensajes.MSG_2
                        });
                        /*se debloquea el sistema*/
                        $('#mainBodyHtml').html(localStorage.getItem('mainBodyHtml'));
                        localStorage.setItem('mainBodyHtml',null);
                    }else {
                        axScript.notify.error({
                            content: lang.mensajes.MSG_1
                        });
                    }
                }
            });
        } catch (e) {             
            auditoria.logErrors(e);
        }
    };
    
    _public.postLogout = function() {
        try {
            axAjax.send({
                root: _private.config.moduloLG + 'logout',
                fnCallback: function(data) {
                    if (!isNaN(data.result) && parseInt(data.result) === 1) {
                        axScript.notify.ok({
                            content: lang.mensajes.MSG_11
                        });
                        axScript.redirect('index');
                    }
                }
            });
        } catch (ex) {
            auditoria.logErrors(ex);
        }
    };

    return _public;
};

var Login = new Login_();

//var numbers = [1,2];
//numbers.map(function(numbers) {
//  alert(numbers)
//});
//
//var str = '12345';
//[].map.call(str, function(x) {
//  alert(x);
//}).reverse().join(''); 


//function copy(o) {
//  var copy = Object.create(Object.getPrototypeOf(o));
//  var propNames = Object.getOwnPropertyNames(o);
//
//  propNames.forEach(function(name) {
//    var desc = Object.getOwnPropertyDescriptor(o, name);
//    Object.defineProperty(copy, name, desc);
//    alert(desc+'--'+name)
//  });
//
//  return copy;
//}
//
//var o2 = copy(Login);
