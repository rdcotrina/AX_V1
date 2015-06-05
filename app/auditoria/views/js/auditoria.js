var auditoria_ = function() {

    var _private = {};

    _private.config = {
        modulo: 'auditoria/Auditoria/'
    };

    var _public = {};

    /*graba en¿vento de user para auditoria*/
    _public.logAuditoria = function(txt) {
        axAjax.send({
            root: _private.config.modulo + 'logAuditoria',
            fnServerParams: function(sData) {
                sData.push({name: '_txt', value: txt});
            }
        });
    };

    /*agrega error en log.txt*/
    _public.logErrors = function(e) {
        var archivo = e.fileName;
        var metodo = e.stack;
        var error = e.message;
        var columna = e.columnNumber;
        var linea = e.lineNumber;
        
        axAjax.send({
            root: _private.config.modulo + 'logErrors',
            fnServerParams: function(sData) {
                sData.push({name: '_archivo', value: archivo});
                sData.push({name: '_metodo', value: metodo});
                sData.push({name: '_error', value: error});
                sData.push({name: '_columna', value: columna});
                sData.push({name: '_linea', value: linea});
            }
        });
    };

    return _public;
};

var auditoria = new auditoria_();