var httpR;
var axAjax_ = function(){
    /*metodos y variables privadas*/
    var _private = {};
    
    /*reset formulario*/
    _private.clear = function(form){
        $(form)[0].reset();
    };
    
    /*activa img loading*/
    _private.processIn = function(){
        $('#process-general').fadeIn();
    };
    
    _private.btnString = [];
    
    _private.processObjetoIn = function(el){
        /*guardo texto de boton*/
        _private.btnString.push({
            objeto: el,
            xhtml: $(el).html()
        });
        $(el).html('<i class="fa fa-gear fa-lg fa-spin"></i>');
        $(el).attr('disabled',true);
    };
      
    _private.processObjetoOut = function(el){
        var txt = '', xobj = '';
        for(var i in _private.btnString){
            if(el === _private.btnString[i].objeto){
                xobj= _private.btnString[i].objeto;
                txt =  _private.btnString[i].xhtml;
                $(xobj).html(txt);
                $(xobj).attr('disabled',false);
                break;
            }
        }
    };
            
    _private.processOut = function(){
        $('#process-general').fadeOut();
    };
    
    /*almacena datos que van al server*/
    _private.sData = [];
    
    /*serialisa datos que van al server*/
    _private.serialize = function(){
        var data = '';
        for(var i in _private.sData){
            data += _private.sData[i].name+'='+_private.sData[i].value+'&';
        }
        _private.sData = [];
        data = data.substring(0, data.length - 1);
        return data;
    };
    
    /*metodos y variables publicas*/
    var _public = {};
    
    _public.cadena = function(){
        return String.fromCharCode(97,100,65,66,75,67,68,76,90,69,70,88,71,72,73,74);
    };
    
    _public.send = function(obj){ //form, obj, ruta, evt,data, datatype, processImg
        var myRand   = parseInt(Math.random()*999999999999999);
        _private.sData.push({name: '_keypassw', value: myRand});
        
        /*se activa boton loading en boton*/
        if(obj.element !== undefined){
            _private.processObjetoIn(obj.element);
        }
        /*se activa gif loadinf*/
        if(obj.gifProcess !== undefined && obj.gifProcess !== false){
            _private.processIn();
        }
        
        var typeData = (obj.dataType !== undefined)?obj.dataType:'json';
        var clear = (obj.clear === undefined)?true:obj.clear;
        
        if(obj.flag !== undefined) { _private.sData.push({name: '_flag', value: obj.flag}); }
        if(obj.fnServerParams !== undefined){ obj.fnServerParams(_private.sData); }
     
        /*serializacion de datos*/
        var datos = _private.serialize();
        datos += (obj.form !== undefined)?'&'+$(obj.form).serialize():'';
        
        $.ajax({
            type: "POST",
            data: datos,
            url: obj.root,
            dataType: typeData,
            beforeSend: function(data2){
                if(obj.abort !== undefined && obj.abort !== false){
                    if (httpR) {
                        httpR.abort();
                    }
                    httpR = data2;
                }
            },
            success: function(data){
                var er = 1;
                /*validar error del SP*/
                if(typeData === 'json' && data.length>0 || data.error !== undefined){
                    /*no es un array, servidor devuelve cadena, y el unico q devuelve cadena es el ERROR del SP*/
                    if(data instanceof Object === false || data.error !== undefined){
                        var msn = data;
                        if(data.error !== undefined){
                            msn = data.error;
                        }
                        axScript.notify.error({
                            content: msn
                        });
                        er = 0;
                    }
                }
                if(obj.fnCallback !== undefined){//si existe callback
                    var callBback = obj.fnCallback;
                    callBback(data);
                }
                /*oculta img cargando de boton*/
                if(obj.element !== undefined){
                    _private.processObjetoOut(obj.element);//respuesta de servidor finalizada
                } 
                /*limpia el formulario*/
                if(clear && parseInt(data.duplicado) !== 1 && er && obj.form !== undefined){
                    _private.clear(obj.form);
                }
                /*se desactiva gif loading*/
                if(obj.gifProcess !== undefined && obj.gifProcess !== false){
                    _private.processOut();//respuesta de servidor finalizada
                }
            }
        });
    };
    
    _public.stringPost = function(c){
        return Aes.Ctr.post(c, 256);
    };
            
    _public.stringGet = function(c){
        return Aes.Ctr.get(c, 256);
    };
    
    return _public;
};
  
var axAjax = new axAjax_();
