var Index_ = function() {

    var _private = {};

    _private.config = {
        modulo: 'index/index/'
    };

    var _public = {};

    _public.inactividad = function() {
        try {
            axAjax.send({
                dataType: 'html',
                gifProcess: true,
                root: _private.config.modulo + 'lock',
                fnCallback: function(data) {
                    /*se verifica si navegador soorta Storage*/
                    if(typeof(Storage) !== "undefined") {
                        /*se guarda contenido de app*/
                        localStorage.setItem("mainBodyHtml", $('#mainBodyHtml').html());
                    } else {
                        alert('Su navegador es antiguo...!');
                    }

                    $('#mainBodyHtml').html(data);
                    $(document).off('mousemove');
                }
            });
        } catch (ex) {
            auditoria.logErrors(ex);
        }
    };

    _public.getChangeRol = function(idRol) {
        try {
            axAjax.send({
                gifProcess: true,
                root: _private.config.modulo + 'changeRol',
                fnServerParams: function(sData) {
                    sData.push({name: '_idRol', value: idRol});
                },
                fnCallback: function() {
                    axScript.redirect('index');
                }
            });
        } catch (ex) {
            auditoria.logErrors(ex);
        }
    };

    return _public;

};
var Index = new Index_();