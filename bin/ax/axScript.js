var axScript_ = function() {
    /*metodos y variables privadas*/
    var _private = {};

    /*variables para los tabs*/
    _private.tabs = $("#cont-general-tabs").tabs();

    _private.tabTemplate = "<li style='position:relative;' id='#{idli}'> \n\
                                <span class='air air-top-left delete-tab' style='top:7px; left:7px;'>\n\
                                    <button class='btn btn-xs font-xs btn-default hover-transparent'><i class='fa fa-times'></i></button>\n\
                                </span>\n\
                                <a href='#{href}'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; #{label}</a>\n\
                            </li>";

    _private.tabs = $("#cont-general-tabs").tabs();

    _private.tabCounter = 0;
    /*fin variables tabs*/

    /*metodos y variables publicos*/
    var _public = {};

    /*para remover eventos de elementos y cargarlos con jquery*/
    /*
     * @uso
     *       axScript.removeAttr.click({
     *           container: '#content',
     *           typeElement: 'button, a ,input ...'
     *       });
     */
    _public.removeAttr = {
        click: function(obj) {
            var collection = $(obj.container).find(obj.typeElement);
            $.each(collection, function() {
                /*obtener evento*/
                var onclick = $(this).attr('onclick');
                /*asignar evento*/
                $(this).click(function() {
                    eval(onclick);
                });
                $(this).attr('onclick', null);
            });
        },
        keypress: function(obj) {
            var collection = $(obj.container).find(obj.typeElement);
            $.each(collection, function() {
                /*obtener evento*/
                var keypress = $(this).attr('onkeypress');
                /*asignar evento*/
                $(this).keypress(function() {
                    eval(keypress);
                });
                $(this).attr('onkeypress', null);
            });
        },
        keyup: function(obj) {
            var collection = $(obj.container).find(obj.typeElement);
            $.each(collection, function() {
                /*obtener evento*/
                var keyup = $(this).attr('onkeyup');
                /*asignar evento*/
                $(this).keyup(function() {
                    eval(keyup);
                });
                $(this).attr('onkeyup', null);
            });
        },
        change: function(obj) {
            var collection = $(obj.container).find(obj.typeElement);
            $.each(collection, function() {
                /*obtener evento*/
                var change = $(this).attr('onchange');
                /*asignar evento*/
                $(this).change(function() {
                    eval(change);
                });
                $(this).attr('onchange', null);
            });
        }
    };

    _public.notify = {
        ok: function(obj) {
            $.smallBox({
                title: (obj.title !== undefined) ? obj.title : "Aviso del Sistema:",
                content: (obj.content !== undefined) ? obj.content : "No content",
                color: (obj.color !== undefined) ? obj.color : "#739E73",
                iconSmall: (obj.icon !== undefined) ? obj.icon : "fa fa-check shake animated",
                timeout: (obj.timeout !== undefined) ? obj.timeout : 6000
            });
            if (obj.callback !== undefined) {
                obj.callback();
            }
        },
        error: function(obj) {
            $.smallBox({
                title: (obj.title !== undefined) ? obj.title : "Aviso del Sistema:",
                content: (obj.content !== undefined) ? obj.content : "No content",
                color: (obj.color !== undefined) ? obj.color : "#C46A69",
                iconSmall: (obj.icon !== undefined) ? obj.icon : "fa fa-warning shake animated",
                timeout: (obj.timeout !== undefined) ? obj.timeout : 6000
            });
            if (obj.callback !== undefined) {
                obj.callback();
            }
        },
        info: function(obj) {
            $.bigBox({
                title: (obj.title !== undefined) ? obj.title : "Aviso del Sistema:",
                content: (obj.content !== undefined) ? obj.content : "No content",
                color: (obj.color !== undefined) ? obj.color : "#3276B1",
                timeout: (obj.timeout !== undefined) ? obj.timeout : 6000,
                icon: (obj.icon !== undefined) ? obj.icon : "fa fa-bell swing animated",
                number: (obj.number !== undefined) ? obj.number : "1"
            });
            if (obj.callback !== undefined) {
                obj.callback();
            }
        },
        warning: function(obj) {
            $.bigBox({
                title: (obj.title !== undefined) ? obj.title : "Aviso del Sistema:",
                content: (obj.content !== undefined) ? obj.content : "No content",
                color: (obj.color !== undefined) ? obj.color : "#C79121",
                timeout: (obj.timeout !== undefined) ? obj.timeout : 6000,
                icon: (obj.icon !== undefined) ? obj.icon : "fa fa-shield fadeInLeft animated",
                number: (obj.number !== undefined) ? obj.number : "1"
            });
            if (obj.callback !== undefined) {
                obj.callback();
            }
        },
        msn: function(obj) {
            $.smallBox({
                title: (obj.title !== undefined) ? obj.title : "",
                content: (obj.content !== undefined) ? obj.content : "No content",
                color: (obj.color !== undefined) ? obj.color : "#296191",
                timeout: (obj.timeout !== undefined) ? obj.timeout : 6000,
                icon: (obj.icon !== undefined) ? obj.icon : "fa fa-bell swing animated"
            });
            if (obj.callback !== undefined) {
                obj.callback();
            }
        },
        smallMsn: function(obj) {
            $.smallBox({
                title: (obj.title !== undefined) ? obj.title : "",
                content: (obj.content !== undefined) ? obj.content : "No content",
                color: (obj.color !== undefined) ? obj.color : "#296191",
                iconSmall: (obj.icon !== undefined) ? obj.icon : "fa fa-thumbs-up bounce animated",
                timeout: (obj.timeout !== undefined) ? obj.timeout : 6000
            });
            if (obj.callback !== undefined) {
                obj.callback();
            }
        },
        confirm: function(obj) {
            $.SmartMessageBox({
                title: "Confirmar:",
                content: (obj.content !== undefined) ? obj.content : "No content",
                buttons: '[No][Si]'
            }, function(ButtonPressed) {
                if (ButtonPressed === "Si") {
                    if (obj.callbackSI !== undefined) {
                        obj.callbackSI();
                    }
                }
                if (ButtonPressed === "No") {
                    if (obj.callbackNO !== undefined) {
                        obj.callbackNO();
                    }
                }
            });
        }

    };

    /*para agregar eventos a elementos*/
    _public.setEvent = {
        click: function(obj) {
            $(obj.element).off('click');
            $(obj.element).on({
                click: function() {
                    eval(obj.event);
                }
            });
        },
        keypress: function(obj) {
            $(obj.element).off('keypress');
            $(obj.element).on({
                keypress: function() {
                    eval(obj.event);
                }
            });
        },
        keyup: function(obj) {
            $(obj.element).off('keyup');
            $(obj.element).on({
                keypress: function() {
                    eval(obj.event);
                }
            });
        },
        change: function(obj) {
            $(obj.element).off('change');
            $(obj.element).on({
                keypress: function() {
                    eval(obj.event);
                }
            });
        },
        date: function(obj) {
            $(obj.element).datepicker({
                showOn: "button",
                buttonImage: "img/date.png",
                buttonImageOnly: true,
                changeMonth: true,
                changeYear: true
            });
            $(obj.element).mask('99/99/9999');
        },
        dateRange: function(obj) {
            $(obj.ini).datepicker({
                showOn: "button",
                buttonImageOnly: true,
                buttonImage: "img/date.png",
                numberOfMonths: 1,
                onClose: function(selectedDate) {
                    $(obj.fin).datepicker("option", obj.opt, selectedDate);
                }
            });
            $(obj.ini).mask('99/99/9999');
        }
    };

    /*
     * 
     * @param {type} obj
     * @returns {undefined}
     * @uso 
     *       axScript.listBox({
     *           data: data,
     *           optionSelec: true,
     *           content: 'content',
     *           attr:{
     *               id: 'lst_element',
     *               name: 'lst_element'
     *           },
     *           dataView:{
     *               etiqueta: 'db_etiqueta',
     *               value: 'db_value'
     *           }
     *       });
     * 
     */
    _public.listBox = function(obj) {
        var data = obj.data,
                optionSelec = (obj.optionSelec === undefined) ? true : obj.optionSelec, /*para mostrar texto seleccionar*/
                content = obj.content, /*id deelemento donde se cargara <select>*/
                required = (obj.required === undefined) ? false : true,
                deffault = (obj.deffault !== undefined) ? obj.deffault : '', /*para seleccionar un registro por defecto*/
                fnCallback = (obj.fnCallback !== undefined) ? obj.fnCallback : '', /*funcion anonima*/
                dataView = obj.dataView, /*la data a setear en <select>*/
                attr = '';                                                                  /*los atributos html del <select>*/

        if (obj.attr !== undefined && obj.attr !== '') {
            for (var i in obj.attr) {
                attr += i + '="' + obj.attr[i] + '" ';
            }
        }
        var cb = '<select ' + attr + ' >';
        if (optionSelec) {
            cb += '<option value="">Seleccionar</option>';
        }
        var sel = '';
        var id = '';
        var value = '';
        for (var i in data) {
            id = '';
            if ($.isArray(dataView.value)) {
                for (var j in dataView.value) {
                    id += eval('data[i].' + dataView.value[j]) + '-';
                }

                id = id.substring(0, id.length - 1);

            } else {
                id = 'data[i].' + dataView.value;
                id = eval(id);
            }
            
            value = '';
            if ($.isArray(dataView.etiqueta)) {
                for (var j in dataView.etiqueta) {
                    value += eval('data[i].' + dataView.etiqueta[j]) + ' - ';
                }

                value = value.substring(0, value.length - 2);

            } else {
                value = 'data[i].' + dataView.etiqueta;
                value = eval(value);
            }
            sel = '';
            if (deffault === id) {
                sel = ' selected = "selected" ';
            }
            cb += '<option value="' + id + '" ' + sel + '>' + value + '</option>';
        }
        cb += '</select><i></i>';
      
        if(required){
            cb += '<div class="obligar"></div>';
        }
        $('#' + content).html(cb);

        if (fnCallback !== '') {
            fnCallback();
        }
    };

    _public.redirect = function(url) {
        self.location = url;
    };

    /*
     *      axScript.addTab({
     *           id : 'xxxxxxx',
     *           label: 'titulo',
     *           content: '----',
     *           fnCallback: function(){
     *               alert(algo)
     *           }
     *       });
     */
    _public.addTab = function(obj) {
        /*verificar si tab existe*/
        if ($('#cont-general-tabs').find('#' + obj.id + '_CONTAINER').length === 0) {
            _private.tabCounter++;
            var li = $(_private.tabTemplate.replace(/#\{href\}/g, "#" + obj.id + '_CONTAINER').replace(/#\{label\}/g, obj.label).replace(/#\{idli\}/g, 'li-' + obj.id)),
                    tabContentHtml = (obj.content !== undefined) ? obj.content : '<h1><i class="fa fa-cog fa-spin"></i> Cargando...</h1>';

            _private.tabs.find("#cont-tabs-sys").append(li);
            _private.tabs.find('#cont-main').append("<div id='" + obj.id + "_CONTAINER'><p>" + tabContentHtml + "</p></div>");
            _private.tabs.tabs("refresh");

            if (obj.fnCallback !== undefined) {
                obj.fnCallback();
            }
        }
        $('#li-' + obj.id).find('a').click();
    };

    /*
     * 
     * @param {type} tab
     * @returns {undefined}
     * @uso:
     *      axScript('tab');
     */
    _public.activeTab = function(tab){
        $('#li-' + tab).find('a').click();
    };
    
    _public.closeTabs = function() {
        $("#cont-general-tabs").on("click", 'span.delete-tab', function() {
            /*detecto id de tab dentro del contenedro del aplicativo*/
            var panelId = $(this).closest("li").remove().attr("aria-controls");
            $("#" + panelId).remove();
            _private.tabs.tabs("refresh");
            _private.tabCounter--;
        });
    };

    /*cierra un TAB de alguna opcion*/
    _public.closeTab = function(tab) {
        $('#li-' + tab).find('span.delete-tab').click();
    };
    
    _public.getParam = function(param) {
        if (param === undefined) {
            return false;
        } else {
            return param;
        }
    };
    
    /*cerrar una ventana modal*/
    _public.closeModal = function(obj) {
        var search = obj.toString().indexOf('#'), id = '';
        if (search === -1) {/*cuando se cierra modal desde botones*/
            id = '#' + $(obj).parent().parent().parent().parent().attr('id');
        } else {/*cuando se cierra modal desde closeModal*/
            id = obj;
        }

        $(id).modal('hide');
        setTimeout("$('" + id + "').remove()", 1000);
    };
    
    /*anular submit en en evento enter de elementos de un formulario*/
    _public.noSubmit = function(form) {
        $(form).find('input').keypress(function(e) {
            if (e.keyCode === 13)
                return false;
        });
    };

    /*disparador de evento click a un elemento mediante enter*/
    _public.triggerPress = function(el, e) {
        if (e.keyCode === 13) {
            $(el).click();
        }
    };

    /*validar si checks estan marcados en una tabla o un ul*/
    /*
     * 
     * @param {type} obj
     * @returns {Boolean}
     * @uso:
     *       axScript.validaCheckBox({
     *           id: '#tabla',
     *           msn: 'mensaje',
     *           fnCallback: function(){
     *               //cpdigo a ejecutar
     *           }
     *       });
     */
    _public.validaCheckBox = function(obj) {
        var marca = 0;
        var collection = ($(obj.id).find('ul').find('li').length > 0) ? $(obj.id).find('ul').find('li') : $(obj.id).find('tbody tr');
        $.each(collection, function() {
            var chk = ($(this).find('label').find('input:checkbox').length > 0) ? $(this).find('label').find('input:checkbox') : $(this).find('input:checkbox');
            if (chk.is(':checked')) {
                marca = 1;
            }
        });
        if (marca === 0) {
            axScript.notify.error({
                content: obj.msn
            });
            return false;
        }
        if (obj.fnCallback !== undefined) {
            obj.fnCallback();
        }
    };
    
    /*marca y sesmarca los checks de una tabla*/
    _public.checkAll = function(el, tab) {
        var d = $(tab).find('tbody tr');
        if ($(el).is(':checked')) {
            d.each(function() {
                $(this).find(':checkbox').prop('checked', 'checked');
            });
        } else {
            d.each(function() {
                $(this).find(':checkbox').prop('checked', '');
            });
        }
    };
    
    /*seta valores a inputs, mayormente para fuscadores*/
    /*
     * 
     * @param {type} obj
     * @param {type} form
     * @returns {undefined}
     * @uso:
     *  axScript.setInput({ALIAStxt_idpersona:'dato_1', ALIAStxt_cliente:'dato_2'},'#ALIASformulario');
     */
    _public.setInput = function(obj, form) {
        for (var i in obj) {
            $('#' + i).val(obj[i]);
        }
        this.closeModal(form);
    };

    /*dibuja celdas vacias para tablas*/
    /*
     * 
     * @param {type} obj
     * @returns {String}
     * @uso:
     *  axScript({
     *      rows: 10,
     *      cols: 5
     *  });
     */
    _public.createCell = function(obj) {
        var t = '';
        for (var i = 0; i < obj.rows; i++) {
            t += '<tr>';
            for (var j = 0; j < obj.cols; j++) {
                t += '<td>&nbsp;</td>';
            }
            t += '</tr>';
        }
        return t;
    };

    /*muestra label segun estado*/
    _public.labelState = function(e){
        var $c = $('<label></label>');
        $c.attr('class','label');
        
        switch (e){
            case 'A':
                $c.html('Activo');
                $c.addClass('label-success');
                break;
            case 'I':
                $c.html('Inctivo');
                $c.addClass('label-danger');
                break;
        }
        
        return $c;
    };
    
    /*obtener permisos de botones*/
    _public.getPermiso = function(clave){
        for(var i in sys_permisos){
            if(sys_permisos[i].opcion === clave){
                return {
                    accion: sys_permisos[i].accion,
                    permiso: sys_permisos[i].permiso,
                    icono: sys_permisos[i].icono,
                    theme: sys_permisos[i].theme
                };
            }
        }
    };
    
    /*
     * Refresca un datagrid
     * @param {type} grid
     * @returns {undefined}
     */
    _public.refreshGrid = function(grid){
        $('#btnRefresh_'+grid).click();
    };

    return _public;

};

var axScript = new axScript_();

/*agregar eventos a boton cerrar de TABS de cada opcion*/
axScript.closeTabs();