var axExe_ = function() {

    var _private = {};

    _private.root = function(m) {
        return 'app/' + m + '/views/js/';
    };

    _private.title = '';
    
    _private.breadcrumb = '';

    _private.jsArray = {};

    _private.jsArrayId = {};

    _private.createScript = function(scriptId, scriptName, callback) {
        scriptId = scriptId.replace(/\//g, ""); 
        var myRand   = parseInt(Math.random()*999999999999999);
        /*verificar si archivo existe*/
        var body = document.getElementsByTagName('body')[0];
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.id = 'script_' + scriptId;
        //script.async= true;
        script.src = scriptName + '.js?'+myRand;

        // then bind the event to the callback function
        // there are several events for cross browser compatibility
        //script.onreadystatechange = callback;
        script.onload = callback;

        body.appendChild(script);
        /*DESCOMENTAR CUANDO ESTE EN PRODUCCION*/
        $('#script_' + scriptId).remove();
    };

    _private.executeMain = function(scriptId) {
        /*verifico si existe la funcion para ejecutarla*/
        if (_private.jsArrayId[scriptId] !== undefined) {
            eval(_private.jsArrayId[scriptId] + '.main();');
        }
    };

    var _publico = {};

    /*devuelve la raiz absoluta de la opcion*/
    _publico.getRoot = function() {
        return _private.breadcrumb;
    };
    
    _publico.getTitle = function() {
        return _private.title;
    };

    _publico.init = function(scriptName, tthis, callback) {
        var parent0 = $(tthis).parent().parent().parent().parent().parent().parent().parent().parent().parent().find('a').find('span').html();
        var parent1 = $(tthis).parent().parent().parent().parent().parent().parent().find('a').html();
        var parent2 = $(tthis).parent().parent().parent().find('a').html();

        _private.breadcrumb = parent0 + ' / ' + parent1+' / '+parent2+' / '+$(tthis).attr('title');
        _private.title = $(tthis).attr('title');


        var scriptId = scriptName;

        if (_private.jsArrayId[scriptId] === undefined) {
            _private.jsArrayId[scriptId] = scriptId;
        }

        scriptName = _private.root(scriptName) + scriptName;

        if (!_private.jsArray[scriptName]) {
            _private.jsArray[scriptName] = true;

            _private.createScript(scriptId, scriptName, callback);
            
        } else if (callback) {// changed else to else if(callback)
            //execute function
            callback();
        } else if (_private.jsArray[scriptName]) {
            _private.executeMain(scriptId);
        }
    };

    /*para incluir archivos*/
    _publico.require = function(requires,callback){
        if(requires instanceof Object === true){
            for(var i in requires){
                /*verificar si es un array*/
                if($.isArray(requires[i])){     /*cuando se requiere varios js de una opcion de APP*/
                    for(var x in requires[i]){
                        if (!_private.jsArray[requires[i][x]]) {
                            _private.jsArray[requires[i][x]] = true;
                            var scriptName = _private.root(i) + requires[i][x]; 
                            _private.createScript(requires[i][x], scriptName,callback);
                        }
                    }
                }else{                          /*cuando se requiere un js de una opcion de APP*/
                    if (!_private.jsArray[requires[i]]) {
                        _private.jsArray[requires[i]] = true;
                        var scriptName = _private.root(i) + requires[i]; 
                        _private.createScript(requires[i], scriptName,callback);
                    }
                }

            }
        }else{  /*se envia la ruta*/
            if (!_private.jsArray[requires]) { 
                _private.jsArray[requires] = true;
                var scriptName = requires; 
                _private.createScript(requires, scriptName,callback);
            }
        }
        
    };
    
    return _publico;
};
var axExe = new axExe_();