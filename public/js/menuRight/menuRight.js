/*
 * Documento   : simpleGrid.jquery.js v.1.0
 * Creado      : noviembre-2014
 * Autor       : RD
 * Descripcion : data grid
 */
(function ($) {

    "use strict";

    $.method = null;

    $.fn.extend({
        menuRight: function (options) {
            
            var _instance = 0;
            
            var _idMenu = $(this);   
            
            var disableOpcion = function(e,o){
                if($('#'+o.idGestionar).data('disabled') !== undefined){
                    /*se recibe las opciones a desabilitar*/
                    var d = $('#'+o.idGestionar).data('disabled').split(',');
                    for(var i in d){
                        $('.'+d[i]).addClass('disabled');
                    }
                }
            };
            
            /*inicio del menu*/
            var ready = function(o){
                
                $(o.obMenu).off("contextmenu");
                $(o.obMenu).on("contextmenu", function (e) {
                    _instance++;
                    
                    o.idGestionar = e.target.parentNode.parentNode.id;
                    
                    $(o.menu).css("display", "none");
                    $(o.menu).find('li').removeClass('disabled');
                    
                    disableOpcion(e,o);
                    /*si existe id a gestionar se muestra el menu*/
                    if(o.idGestionar.length > 0 || _instance === 1){ 
                        $(o.menu).css({display: 'block', left: e.pageX - 150, top: e.pageY - 250});
                        return false;
                    }
                    return false;
                });
            };
            
            /*ocultar menu*/
            var hide = function(o){
                //controlamos ocultado de menu cuando esta activo
                //click boton principal raton
                $(document).off("click");
                $(document).click(function(e){
                    if(e.button === 0 && e.target.parentNode.parentNode.id !== o.menu){
                        $(o.menu).css("display", "none");
                    }
                });
            };
            
            /*ocutar con escape*/
            var escape = function(o){
                //pulsacion tecla escape
                $(o.obMenu).off("keydown");
                $(o.obMenu).keydown(function(e){
                    if(e.keyCode === 27){
                        $(o.menu).css("display", "none");
                    }
                });
            };
            
            /*capturar y ejecutar acciones*/
            var exeActions = function(o){
                $(o.menu).off("click");
                $(o.menu).click(function(e){
                    //si la opcion esta desactivado, no pasa nada
                    if(e.target.className === "disabled"){
                        return false;
                    }
                    //si esta activada, gestionamos cada una y sus acciones
                    else{
                        /*verificar que exista o.idGestionar*/
                        if(o.idGestionar.length > 0){
                            o.callback(e.target,o.idGestionar);
                        }
                        $(o.menu).css("display", "none");
                    }
                });
            };
            
            /*activar navecacion con flechas*/
            var activeKey = function(o){
                $(document).off('keypress');
                $(document).keypress( function(e) {
                    switch( e.keyCode ) {
                        case 38: // up
                            if( $(o.menu).find('LI.hover').size() === 0 ) {
                                $(o.menu).find('LI:last').addClass('hover');
                            } else {
                                $(o.menu).find('LI.hover').removeClass('hover').prevAll('LI:not(.disabled)').eq(0).addClass('hover');
                                if( $(o.menu).find('LI.hover').size() === 0 ) $(o.menu).find('LI:last').addClass('hover');
                            }
                        break;
                        case 40: // down
                            if( $(o.menu).find('LI.hover').size() === 0 ) {
                                $(o.menu).find('LI:first').addClass('hover');
                            } else {
                                    $(o.menu).find('LI.hover').removeClass('hover').nextAll('LI:not(.disabled)').eq(0).addClass('hover');
                                if( $(o.menu).find('LI.hover').size() === 0 ) $(o.menu).find('LI:first').addClass('hover');
                            }
                        break;
                        case 13: // enter
                            $(o.menu).find('LI.hover A').trigger('click');
                        break;
                    }
                });
            };
            
            /*aplicando propiedades por defecto*/
            var defaults = {
                obMenu: _idMenu,              /*identificador en el que se hace click derecho*/
                menu: '',
                callback: null
            };

            var options = $.extend(defaults, options);

            return this.each(function () {

                var o = options;

                o.idGestionar = 0;
                
                var method = {
                    exe: function () {
                        
                        ready(o);
                        
                        hide(o);

                        escape(o);
                        
                        exeActions(o);
                        
                        activeKey(o);
                                                        
                    }

                };

                method.exe();

            });
        }

    });

})(jQuery);