/*
 * Documento   : dataGrid.jquery.js v.2.0 .. . heredado desde simpleGrid
 * Creado      : noviembre-2014
 * Heredado    : mayo 2015
 * Autor       : RD
 * Descripcion : data grid -- TABLE_SCROOL_HV
 */
(function($) {
    
    "use strict";
    
    var COUNT_EXE_SCROLL = [];      /*almacena cuantas veces se ejecuta el srcoll por cada grid*/
    
    $.fn.extend({
        
        dataGrid: function(opt){
            
            
            
            var defaults = {
                tObjectContainer: $(this).attr('id'),              /*identificador del contenedor de la grilla*/
                tObjectTable: null,              /*identificador de la grilla*/
                tWidthFormat: 'px',                  /*para dimension de columnas*/
                tChangeLength: true,                /*activa combo de registros a mostrar por pagina*/
                tRegsLength: [10, 25, 50, 100],     /*para numero de registros por pagina*/
                tColumns: [],                       /*columnas del header*/
                tMsnNoData: 'No se encontraron registros.',
                tNumbers: true,                 /*para mostrar la numeracion*/
                sAjaxSource: null,                   /*url para la data via ajax*/
                pPaginate: true,
                pDisplayStart: 0,
                pDisplayLength: 50,
                pItemPaginas: 5,
                pOrderField: '',                    /*para el order ASC o DESC*/
                sAxions: [],                        /*acciones del grid*/
                               
            };
            
            var options = $.extend(defaults, opt);
            
            var _private = {};
            
            _private.cssTable = 'table table-striped table-hover table-condensed dataTable table-bordered';
                    
            _private.pFilterCols = '';                    /*sql generado mediante filtros avanzados*/
            
            _private.positionAxion = 'last';            /*posicion de las acciones*/
            
            _private.btnFirst = 'fa fa-fast-backward';
            
            _private.btnPrev  = 'fa fa-backward';
            
            _private.btnNext  =  'fa fa-forward';
            
            _private.btnLast  = 'fa fa-fast-forward';
                
            _private.iniInfo = 0;
            
            _private.finInfo = 0;
            
            _private.totalInfo = 0;
            
            /*
             * Rretorna info sobre cantidad de registros
             * @returns {String}
             */
            _private.txtInfo = function(){
                return 'comentado tmp';//`${_private.iniInfo} al ${_private.finInfo} de ${_private.totalInfo}`;
            };
            
            _private.aData = [];
            
            _private.spinner = 'public/img/spinner-mini.gif';
            
            _private.iniLoading = function(oSettings){
                $('#btnRefresh_'+oSettings.tObjectTable).html('<img src="'+_private.spinner+'">').attr('disabled',true);
            };
            
            _private.endLoading = function(oSettings){
                $('#btnRefresh_'+oSettings.tObjectTable).html('<i class="fa fa-refresh"></i>').attr('disabled',false);
            };
            
            _private.colspanRecords = 0;
            
            /*
             * Ejecuta el scroll
             * cFixedColsLeft                  columnas fijas del lado izquierdo
             * cFixedColsRight                 columnas fijas del lado derecho
             * cColsInHorizontalScroll         columnas a visualizar en el scroll horizontal
             * cRowsInVerticalScroll           filas a visualizar en el scroll vertical
             * cRowsInFooter                   filas fijas en el foot de la tabla
             * cRowsInHeader                   filas fijas en el head de a tabla
             * @param {type} oSettings
             * @returns {undefined}
             */
            _private.exeScroll = function(oSettings){
                var scroll = oSettings.tScroll;
                if(scroll !== undefined && scroll instanceof Object){ 
                    /*reinicio scroll*/
                    _private.removeScroll(oSettings);
                    
                    $('#'+oSettings.tObjectTable).scrollable({
                        fixedColumnsLeft: (scroll.cFixedColsLeft !== undefined)?scroll.cFixedColsLeft:0,
                        fixedColumnsRight: (scroll.cFixedColsRight !== undefined)?scroll.cFixedColsRight:0,
                        columnsInScrollableArea: (scroll.cColsInHorizontalScroll !== undefined)?scroll.cColsInHorizontalScroll:5,
                        rowsInScrollableArea: (scroll.cRowsInVerticalScroll !== undefined)?scroll.cRowsInVerticalScroll:10,
                        rowsInFooter: (scroll.cRowsInFooter !== undefined)?scroll.cRowsInFooter:null,
                        rowsInHeader: (scroll.cRowsInHeader !== undefined)?scroll.cRowsInHeader:null
                    });
                    
                    if(COUNT_EXE_SCROLL[oSettings.tObjectTable] === undefined){
                        COUNT_EXE_SCROLL[oSettings.tObjectTable] = 1;       /*primera generada de scroll para grid*/
                    }else{
                        COUNT_EXE_SCROLL[oSettings.tObjectTable]++;         /*se suma en uno las veces q se genera el scroll*/
                    }
                }
            };
            
            /*
             * Resetea scroll
             * @param {type} oSettings
             * @returns {undefined}
             */
            _private.removeScroll = function(oSettings){
                /*quitar efecto scroll para volver a crear, no se ejecuta en la pagina 1*/
                if(COUNT_EXE_SCROLL[oSettings.tObjectTable] >= 1 && COUNT_EXE_SCROLL[oSettings.tObjectTable] !== undefined){
                    /*se elimina ultimo <td> de <theader>*/
                    $('#'+oSettings.tObjectTable).find('thead').find('tr').find('td').remove();
                   /*se muestra columnas ocultas*/
                    $('#'+oSettings.tObjectTable).find('thead').find('tr').find('th').css({display:''});
                    $('#'+oSettings.tObjectTable).find('tbody').find('tr').find('td').css({display:''});
                }
            };
            
            /*
             * Crea head axion
             * @param {type} oSettings
             * @returns {$}
             */
            _private.headAxion = function(oSettings) {
                var g = (oSettings.sAxions.group !== undefined)?oSettings.sAxions.group:[];
                var b = (oSettings.sAxions.buttons !== undefined)?oSettings.sAxions.buttons:[];
                
                if (g.length || b.length) {
                    var txtax = $('<th class="center"></th>');
                    txtax.css({width: oSettings.sAxions.width+oSettings.tWidthFormat});
                    txtax.attr('id',oSettings.tObjectTable+'_axions');
                    txtax.html('Acciones');
                    txtax.css({'vertical-align': 'middle'});
                    return txtax;
                }
            };
            
            /*
             * Crea la tabla para el dataGrid
             * @param {type} oSettings
             * @returns {undefined}
             */
            _private.table = function(oSettings){
                oSettings.tObjectTable = 'tab_'+oSettings.tObjectContainer;
                
                var tb = $('<table></table>');
                tb.attr('id',oSettings.tObjectTable);
                tb.attr('class',_private.cssTable);
                
                /*agregando tabla a div*/
                $('#'+oSettings.tObjectContainer).html(tb);
            };
            
            /*
             * Crea el checkbox en el head de la tabla
             * @param {type} oSettings
             * @returns {$}
             */
            _private.headCheckbox = function(oSettings){
                _private.colspanRecords++;
                var td = $('<th></th>');
                td.attr('class', 'center');
                td.attr('id', oSettings.tObjectTable + '_chkall_0');
                td.css({'width': '1%'});
                
                var chk = $('<input></input>');
                chk.attr('type','checkbox');
                chk.attr('onclick','$.method.checkAll(this,\'#'+ oSettings.tObjectTable+'\')');
                
                td.append(chk);
                return td;
            };
            
            /*
             * Crea la cabecera de la tabla
             * @param {type} oSettings
             * @returns {undefined}
             */
            _private.theader = function(oSettings){
                var h  = $('<thead></thead>'),
                    tr = $('<tr></tr>'),
                    chkExist = 0;
            
                /*agregando numeracion*/
                if(oSettings.tNumbers){
                    var th = $('<th onclick="alert(23)">Nro.</th>');         /*se crea la columna*/
                    th.attr('class', 'center');
                    th.css('width', '1%');
                    tr.append(th);                       /*se agrega al <tr>*/
                }
                
                /*agregando accion al inicio de cabecera*/
                if (_private.positionAxion.toLowerCase() === 'first') {
                    _private.colspanRecords++;
                    tr.append(_private.headAxion(oSettings));
                }
                      
                /*agregando checkbox al inicio*/
                if(oSettings.sCheckbox !== undefined && oSettings.sCheckbox instanceof Object){
                    var pos = (oSettings.sCheckbox.position !== undefined) ? oSettings.sCheckbox.position : 'first';
                    if(pos.toLowerCase() === 'first'){                        
                        tr.append(_private.headCheckbox(oSettings));                      /*se agrega al <tr>*/
                        chkExist = 1;
                    }
                }                
                
                /*recorrido de columnas*/
                for (var c in oSettings.tColumns) {
                    var th = $('<th></th>');         /*se crea la columna*/

                    var title   = (oSettings.tColumns[c].title !== undefined) ? oSettings.tColumns[c].title : '';
                    var campo   = (oSettings.tColumns[c].campo !== undefined) ? oSettings.tColumns[c].campo : '';
                    var sortable= (oSettings.tColumns[c].sortable !== undefined) ? ' sorting' : '';
                    var width   = (oSettings.tColumns[c].width !== undefined) ? oSettings.tColumns[c].width + oSettings.tWidthFormat : '';
                    var search  = (oSettings.tColumns[c].search !== undefined) ? oSettings.tColumns[c].search : false;   /*para activar busqueda de columnas*/
                   
                    th.attr('id', oSettings.tObjectTable + '_head_th_' + c);
                    th.attr('class', 'center');        /*agregado class css*/
                    th.css({width: width, 'vertical-align': 'middle'});                                          /*agregando width de columna*/
                    th.append(title);                                                 /*se agrega el titulo*/

                    tr.append(th);                                                  /*se agrega al <tr>*/
                    _private.colspanRecords++;
                }
                
                /*agregando checkbox al final*/
                if(oSettings.sCheckbox !== undefined && oSettings.sCheckbox instanceof Object && chkExist === 0){
                    var pos = (oSettings.sCheckbox.position !== undefined) ? oSettings.sCheckbox.position : 'last';
                    if(pos.toLowerCase() === 'last'){                        
                        tr.append(_private.headCheckbox(oSettings));                      /*se agrega al <tr>*/
                    }
                }
                
                /*agregando accion al final de cabecera*/
                if (_private.positionAxion.toLowerCase() === 'last') {
                    _private.colspanRecords++;
                    tr.append(_private.headAxion(oSettings));
                }
                
                h.html(tr);                                         /*se agrega <tr> al <thead>*/
                $('#' + oSettings.tObjectTable).append(h);          /*se agrega <thead> al <table>*/
            };
            
            /*
             * Crea el tbody de la tabla
             * @param {type} oSettings
             * @returns {undefined}
             */
            _private.tbody = function(oSettings){
                var tbody = $('<tbody></tbody>');
                tbody.attr('id','tbody_'+oSettings.tObjectTable);
                
                $('#' + oSettings.tObjectTable).append(tbody);          /*se agrega <tbody> al <table>*/
            };
            
            /*
             * Crea el combo para cambiar el total de registros a visualizar or pagina
             * @param {type} oSettings
             * @returns {String|$}
             */
            _private.cbLength = function(oSettings){
                var cbCl = '';
                if (oSettings.tChangeLength) {
                    cbCl = $('<div></div>');
                    cbCl.attr('id', 'contCbLength_'+oSettings.tObjectTable);
                    cbCl.attr('class', 'pull-left mr5');

                    var span = $('<span></span>');
                    span.attr('class', 'smart-form');

                    var label = $('<label></label>');
                    label.attr('class', 'select');
                    label.css({width: '60px'});

                    var select = $('<select></select>');
                    select.attr('id', oSettings.tObjectTable + '_cbLength');
                    select.attr('name', oSettings.tObjectTable + '_cbLength');
                    select.css({width: '60px'});
                    select.change(function() {
                        $.method.cbChange(oSettings);
                    });
                    var op = '', lb = oSettings.tRegsLength.length,cc=0;
                    for (var l in oSettings.tRegsLength) {
                        cc++;
                        if(cc <= lb){
                            var sel = '';
                            if (parseInt(oSettings.pDisplayLength) === parseInt(oSettings.tRegsLength[l])) {
                                sel = 'selected="selected"';
                            }
                            op += '<option value="' + oSettings.tRegsLength[l] + '" ' + sel + '>' + oSettings.tRegsLength[l] + '</option>';
                        }
                    }
                    select.html(op);

                    label.html(select);            /*se agrega select a label*/
                    label.append('<i></i>');
                    span.html(label);            /*se agrega label a span*/
                    cbCl.html(span);            /*se agrega span a cbCl*/
                }
                return cbCl;
            };
            
            /*
             * Crea el foot de la tabla
             * @param {type} oSettings
             * @returns {undefined}
             */
            _private.tfoot = function(oSettings){
                var df  = $('<div></div>');
                df.attr('id','foot_'+oSettings.tObjectTable);
                df.attr('class','dt-toolbar-footer');
                
                /*===================INI IZQUIERDO===========================*/
                var dcontlf = $('<div></div>');
                dcontlf.attr('id','info_'+oSettings.tObjectTable);
                dcontlf.attr('class','col-sm-6 col-xs-12 hidden-xs');
                
                var dtxt = $('<div></div>');
                dtxt.attr('class','dataTables_info pull-left mr5');
                dtxt.html(_private.txtInfo);        /*info inicial*/
                
                dcontlf.html(dtxt);
                
                /*combo change length*/
                dcontlf.append(_private.cbLength(oSettings));
                
                /*boton refresh*/
                var btnRefresh = $('<button></button>');
                btnRefresh.attr('id','btnRefresh_'+oSettings.tObjectTable);
                btnRefresh.attr('type', 'button');
                btnRefresh.attr('class', 'btn btn-primary mr5');
                btnRefresh.attr('title', 'Actualizar');
                btnRefresh.html('<i class="fa fa-refresh"></i>');
                dcontlf.append(btnRefresh);                
                
                df.append(dcontlf);   
                /*=========================FIN IZQUIERDO====================*/
                
                /*===================INI DERECHO===========================*/
                var dcontrh = $('<div></div>');
                dcontrh.attr('id','paginate_'+oSettings.tObjectTable);
                dcontrh.attr('class','col-sm-6 col-xs-12');
                
                var dcontpag = $('<div></div>');
                dcontpag.attr('class','dataTables_paginate paging_simple_numbers');
                
                /*ul para paginacion*/
                var ulp = $('<ul></ul>');
                ulp.attr('class','pagination pagination-sm');
                ulp.attr('id','ul_pagin_'+oSettings.tObjectTable);
                
                dcontpag.html(ulp);
                
                dcontrh.html(dcontpag);
                
                df.append(dcontrh);
                /*===================FIN DERECHO===========================*/
                
                /*agregando div a container*/
                $('#'+oSettings.tObjectContainer).append(df);
            };
            
            /*
             * Crea botones primero y anterior de paginacion
             * @param {type} oSettings
             * @param {type} pagActual
             * @returns {undefined}
             */
            _private.liFirstPrev = function(oSettings, pagActual) {
                
                /*se crea boton <li> ptimero*/
                var liFirst = $('<li></li>');

                if (pagActual > 1) {
                    liFirst.attr('class', 'paginate_button previous');
                } else {
                    liFirst.attr('class', 'paginate_button previous disabled');
                }

                /*se crea <a> primero*/
                var aFirst = $('<a></a>');
                aFirst.attr('href', 'javascript:;');
                aFirst.html('<i class="'+_private.btnFirst+'"></i>');
                if (pagActual > 1) {
                    aFirst.click(function() {
                        oSettings.pDisplayStart = 0;
                        $.method.sendAjax(oSettings);
                    });
                }
                $(liFirst).html(aFirst);                /*aFirst dentro de liFirst*/
                $('#ul_pagin_'+oSettings.tObjectTable).append(liFirst);                  /*liFirst dentro de ul*/

                
                /*se crea boton <li> anterior*/
                var liPrev = $('<li></li>');
                if (pagActual > 1) {
                    liPrev.attr('class', 'paginate_button previous');
                } else {
                    liPrev.attr('class', 'paginate_button previous disabled');
                }

                /*se crea <a> anterior*/
                var aPrev = $('<a></a>');
                aPrev.attr('href', 'javascript:;');
                aPrev.html('<i class="'+_private.btnPrev+'"></i>');
                if (pagActual > 1) {
                    aPrev.click(function() {
                        oSettings.pDisplayStart = pagActual - 2;
                        $.method.sendAjax(oSettings);
                    });
                }
                $(liPrev).html(aPrev);                /*aPrev dentro de liPrev*/
                $('#ul_pagin_'+oSettings.tObjectTable).append(liPrev);                  /*liPrev dentro de ul*/
            };
            
            /*
             * Crea botones ultimo y siguiente de paginacion
             * @param {type} oSettings
             * @param {type} pagActual
             * @param {type} numPaginas
             * @returns {undefined}
             */
            _private.liLastNext = function(oSettings, pagActual, numPaginas) {
                /*se crea boton <li> siguiente*/
                var liNext = $('<li></li>');
                if (numPaginas > 1 && pagActual !== numPaginas) {
                    liNext.attr('class', 'paginate_button next');
                } else {
                    liNext.attr('class', 'paginate_button next disabled');
                }

                /*se crea <a> next*/
                var aNext = $('<a></a>');
                aNext.attr('href', 'javascript:;');
                aNext.html('<i class="'+_private.btnNext+'"></i>');
                if (numPaginas > 1 && pagActual !== numPaginas) {
                    aNext.click(function() {
                        oSettings.pDisplayStart = pagActual; 
                        $.method.sendAjax(oSettings);
                    });
                }
                $(liNext).html(aNext);                /*aNext dentro de liNext*/
                $('#ul_pagin_'+oSettings.tObjectTable).append(liNext);                  /*liNext dentro de ul*/

                if (numPaginas > 1 && pagActual !== numPaginas) {
                    oSettings.pDisplayStart = numPaginas - 1;     /*para boton ultimo*/
                }

                /*se crea boton <li> ultimo*/
                var liLast = $('<li></li>');

                if (numPaginas > 1 && pagActual !== numPaginas) {
                    liLast.attr('class', 'paginate_button next');
                } else {
                    liLast.attr('class', 'paginate_button next disabled');
                }

                /*se crea <a> ultimo*/
                var aLast = $('<a></a>');
                aLast.attr('href', 'javascript:;');
                aLast.html('<i class="'+_private.btnLast+'"></i>');
                if (numPaginas > 1 && pagActual !== numPaginas) {
                    aLast.click(function() {
                        $.method.sendAjax(oSettings);
                    });
                }
                $(liLast).html(aLast);                /*aLast dentro de liLast*/
                $('#ul_pagin_'+oSettings.tObjectTable).append(liLast);                  /*liLast dentro de ul*/
            };
            
            /*
             * Crea la paginacion del dataGrid
             * @param {type} oSettings
             * @returns {undefined}
             */
            _private.paginate = function(oSettings){
                var total  = oSettings.sData[0].total;
                var start  = oSettings.pDisplayStart;
                var length = oSettings.pDisplayLength;
                var data   = (oSettings.sData !== undefined)?oSettings.sData:[];
                
                /*verificar si paginate esta activo*/
                if(oSettings.pPaginate && total > 0){
                    $('#ul_pagin_'+oSettings.tObjectTable).html(''); 
                    
                    var paginaActual = start + 1;
                    var numPaginas = Math.ceil(total / length);     /*determinando el numero de paginas*/
                    var itemPag = Math.ceil(oSettings.pItemPaginas / 2);
                    
                    var pagInicio = (paginaActual - itemPag);
                    var pagInicio = (pagInicio <= 0 ? 1 : pagInicio);
                    var pagFinal  = (pagInicio + (oSettings.pItemPaginas - 1));
                    var click     = '';
                    var trIni     = ((paginaActual * length) - length) + 1;
                    var trFin     = (paginaActual * length);
                    
                    var cantRreg  = trFin - (trFin - data.length);
                    var trFinOk   = (cantRreg < length) ? (cantRreg === total) ? cantRreg : (parseInt(trFin) - (parseInt(length) - parseInt(cantRreg))) : trFin;
                    
                    oSettings.pDisplayStart = paginaActual - 1;   /*para boton actualizar*/
                    
                    /*actualizando info*/
                    _private.iniInfo   = trIni;
                    _private.finInfo   = trFinOk;
                    _private.totalInfo = total;
                    
                    $('#info_'+oSettings.tObjectTable).find('div:eq(0)').html(_private.txtInfo);
                    
                    /*====================INI UL NUMERACION ==================*/
                    _private.liFirstPrev(oSettings, paginaActual);
                 
                    /*for para crear numero de paginas*/
                    for (var i = pagInicio; i <= pagFinal; i++) {
                        if (i <= numPaginas) {
                            /*se crea <li> para numeros de paginas*/
                            var liNumero = $('<li></li>');
                            /*se crea <a> anterior*/
                            var aNumero = $('<a></a>');
                            aNumero.attr('href', 'javascript:;');
                            aNumero.html(i);

                            if (i === paginaActual) {
                                liNumero.attr('class', 'num paginate_button active');
                            } else {
                                liNumero.attr('class', 'num paginate_button');
                            }

                            $(liNumero).html(aNumero);                /*aNumero dentro de liNumero*/
                            $('#ul_pagin_'+oSettings.tObjectTable).append(liNumero);                  /*liNumero dentro de ul*/
                        } else {
                            break;
                        }
                    }
                    /*fin for*/
                    
                    _private.liLastNext(oSettings, paginaActual, numPaginas);
                    /*====================FIN UL NUMERACION ==================*/
                    
                }
                
                /*agregando eventos para paginacion*/
                $('#ul_pagin_' + oSettings.tObjectTable).find('li').each(function() {
                    var n = $(this).is('.num');
                    /*solo los numeros de pagina*/
                    if (n) {
                        var activo = $(this).is('.active');     /*numero de pagina actual*/
                        var numero = parseInt($(this).find('a').html());

                        /*evento a numeros inactivos*/
                        if (!activo) {
                            $(this).find('a').click(function() {
                                oSettings.pDisplayStart = numero - 1;
                                $.method.sendAjax(oSettings);
                            });
                        } else {
                            /*agregando evento a boton actualizar*/
                            $('#btnRefresh_' + oSettings.tObjectTable).off('click');
                            $('#btnRefresh_' + oSettings.tObjectTable).click(function() {
                                oSettings.pDisplayStart = numero - 1;
                                $.method.sendAjax(oSettings);
                            });
                        }
                    }
                });
            };
            
            /*
             * Define el limit inferior para paginacion
             * @param {type} oSettings
             * @returns {oSettings.pDisplayStart|oSettings.pDisplayLength}
             */
            _private.limitInferior = function(oSettings) {
                var limit0 = oSettings.pDisplayStart;
                if (oSettings.pDisplayStart > 0) {
                    limit0 = oSettings.pDisplayLength * limit0;
                }
                return limit0;
            };
            
            /*
             * Serializa _private.aData
             * @returns {String}
             */
            _private.serialize = function() {
                var data = '';
                for (var i in _private.aData) {
                    data += _private.aData[i].name + '=' + _private.aData[i].value + '&';
                }
                _private.aData = [];
                data = data.substring(0, data.length - 1);
                return data;
            };
            
            /*
             * Setea desde el servidor
             * @param {type} params
             * @param {type} data
             * @returns {String}
             */
            _private.paramServer = function(params, data) {
                var result = '';
                /*validar si tiene parametros de servidor*/
                if (params) {
                    /*validar si es array*/
                    if (params instanceof Object) {
                        /*se agrega paramtros desde array*/
                        for (var x in params) {
                            result += "'" + data[params[x]] + "',";
                        }
                    } else {
                        /*se agrega parametros directos*/
                        result += "'" + data[params] + "',";
                    }
                }
                return result;
            };
            
            /*
             * Setea parametros desde el cliente
             * @param {type} params
             * @returns {String}
             */
            _private.paramClient = function(params) {
                var result = '';
                /*validar si tiene parametros de cliente*/
                if (params) {
                    /*validar si es array*/
                    if (params instanceof Object) {
                        /*se agrega paramtros desde array*/
                        for (var x in params) {
                            result += params[x] + ",";
                        }
                    } else {
                        /*se agrega parametros directos*/
                        result += params + ",";
                    }
                }
                return result;
            };
                     
            /*
             * Retirna numero de inicio para la numeracion - Nro.
             * @param {type} oSettings
             * @returns {Number}
             */
            _private.numeracion = function(oSettings){
                if(oSettings.tNumbers){
                    _private.colspanRecords++; /*colspan para msn: no se encontraron registros*/
                    var n = oSettings.pDisplayStart * oSettings.pDisplayLength;
                    return n;
                }
            };
            
            /*
             * Crea <button> o <li> para las acciones
             * @param {type} oSettings  ... objeto grid
             * @param {type} buttons    ... array de bototnes
             * @param {type} td         ... td que se esta creando
             * @param {type} tipo       ... si se crea <button> o <li>
             * @param {type} data       ... datos del servidor
             * @param {type} r          ... numero de registro creado
             * @param {type} ig         ... numero de group button creado
             * @returns {undefined}
             */
            _private.createButtons = function(oSettings,buttons,td,tipo,data,r,ig){
                for (var i in buttons) { 
                    var access      = (buttons[i].access !== undefined) ? buttons[i].access : 0;
                    var titulo      = (buttons[i].titulo !== undefined) ? buttons[i].titulo : '';
                    var icono       = (buttons[i].icono !== undefined) ? buttons[i].icono : '';
                    var klass       = (buttons[i].class !== undefined) ? buttons[i].class : '';
                    var fnCallback  = (buttons[i].fnCallback !== undefined) ? buttons[i].fnCallback : '';
                    /*parametros para ajax*/
                    var ajax        = (buttons[i].ajax !== undefined) ? buttons[i].ajax : '';       /*ajax para <td>*/
                    var fn          = '';
                    var flag        = '';
                    var clientParams= '';
                    var serverParams= '';

                    /*verificar si tiene permiso asignado*/
                    if(access){
                        if (ajax) {
                            fn = (ajax.fn !== undefined) ? ajax.fn : '';                                /*funcion ajax*/
                            flag = (ajax.flag !== undefined) ? ajax.flag : '';                          /*flag de la funcion*/
                            clientParams = (ajax.clientParams !== undefined) ? ajax.clientParams : '';  /*parametros desde el cliente*/
                            serverParams = (ajax.serverParams !== undefined) ? ajax.serverParams : '';  /*parametros desde el servidor*/
                        }
                        /*configurando ajax*/
                        if (fn) {
                            var xparams = '';

                            /*validar flag para agregar como parametro*/
                            if (flag) {
                                xparams = flag + ',';
                            }
                            /*parametros de servidor*/
                            xparams += _private.paramServer(serverParams, data[r]);
                            /*parametros de cliente*/
                            xparams += _private.paramClient(clientParams);
                            xparams = xparams.substring(0, xparams.length - 1);
                            fn = fn + '(this,' + xparams + ')';
                        }
                        
                        
                        switch (tipo){
                            case 'btn': /*<button>*/
                                var btn = $('<button></button>');
                                btn.attr('type', 'button');
                                btn.attr('id', 'btn_axion_'+oSettings.tObjectTable + '_' + r);
                                btn.attr('title', titulo);
                                if (icono !== '') {
                                    btn.html('<i class="' + icono + '"></i>');
                                }
                                /*agregando ajax*/
                                if (fn) {
                                    btn.attr('onclick',fn);
                                }
                                if (klass !== '') {
                                    btn.attr('class', klass);
                                }
                                break;
                            case 'li': /*<li>*/
                                var btn = $('<li></li>');
                                var a   = $('<a></a>');
                                a.attr('id', 'btn_axion_'+oSettings.tObjectTable + '_' + r+'_'+ig+'_'+i);
                                a.attr('href','javascript:;');
                                a.html(titulo);
                                /*agregando ajax*/
                                if (fn) {
                                    a.attr('onclick',fn);
                                }

                                btn.html(a);
                                break;   
                        }
                        
                        /*verificar si tiene fnCallback configurado*/
                        if(fnCallback !== undefined && fnCallback instanceof Object){
                            var call = fnCallback(r,data[r]);       /*se ejecuta fnCallback*/
                            if(!call){
                                //call es false, <td> sigue con su contenido original
                            }else{
                                switch(tipo){
                                    case 'btn':
                                        btn = call;  /*se carga return de call*/
                                        break;
                                    case 'li':
                                        btn = '<li><a id="btn_axion_'+oSettings.tObjectTable + '_' + r+'_'+ig+'_'+i+'" href="javascript:;" onclick="'+fn+'">'+call+'</a></li>';  /*se carga return de call*/
                                        break;
                                }
                                
                            }
                        }

                        td.append(btn); 
                    }

                }
            };
            
            /*
             * Genera los botones para las acciones
             * @param {type} r
             * @param {type} data
             * @param {type} oSettings
             * @returns {$}
             */
            _private.axionButtons = function(r, data, oSettings) {
                var buttons = oSettings.sAxions.buttons;
                var group   = (oSettings.sAxions.group !== undefined) ? oSettings.sAxions.group : '';
                
                /*verificar si axiones sera grupal*/
                if(group instanceof Object && group !== ''){
                    var td = $('<td></td>');
                    td.attr('class','center');
                    
                    /*recorrido de acciones*/
                    for (var i in group) {
                        var titulo  = (group[i].titulo !== undefined) ? group[i].titulo : '';
                        var klass   = (group[i].class !== undefined) ? group[i].class : '';
                        var buttong = (group[i].buttons !== undefined) ? group[i].buttons : [];
                    
                        /*div group*/
                        var divg = $('<div></div>');
                        divg.attr('class','btn-group');
                       
                        /*boton para group*/
                        var btng = $('<button></button>');
                        btng.attr('class',klass);
                        btng.attr('data-toggle','dropdown');
                        btng.html(titulo);
                        btng.append(' <span class="caret"></span>');
                        
                        divg.append(btng);      /*se agrega <button> a <div>*/
                        
                        /*ul para botones-opcioens*/
                        var ulb = $('<ul></ul>');
                        ulb.attr('class','dropdown-menu');
                        
                        /*recorrido de botones*/
                        _private.createButtons(oSettings,buttong,ulb,'li',data,r,i);
                        
                        divg.append(ulb);      /*se agrega <ul> a <div>*/

                        td.append(divg);            /*se agrega <div> a <td>*/  
                    }
                    return td;
                }else{
                    if (buttons.length) {
                        var td = $('<td></td>');
                        td.attr('class','center');

                        _private.createButtons(oSettings,buttons,td,'btn',data,r);
                        
                        return td;
                    }
                }
                
            };
            
            /*
             * Setea values del checkbox provenientes del servidor
             * @param {type} params
             * @param {type} data
             * @returns {String}
             */
            _private.valuesServer = function(params, data) {
                var result = '';
                /*validar si tiene parametros de servidor*/
                if (params) {
                    /*validar si es array*/
                    if (params instanceof Object) {
                        /*se agrega paramtros desde array*/
                        for (var x in params) {
                            result += data[params[x]] + "*";
                        }
                    } else {
                        /*se agrega parametros directos*/
                        result += data[params] + "*";
                    }
                }
                return result;
            };
            
            /*
             * Setea values del checkbox provenientes del cliente
             * @param {type} params
             * @returns {String}
             */
            _private.valuesClient = function(params) {
                var result = '';
                /*validar si tiene parametros de cliente*/
                if (params) {
                    /*validar si es array*/
                    if (params instanceof Object) {
                        /*se agrega paramtros desde array*/
                        for (var x in params) {
                            result += params[x] + "*";
                        }
                    } else {
                        /*se agrega parametros directos*/
                        result += params + "*";
                    }
                }
                return result;
            };
            
            /*
             * Setea values del checkbox, asignadole como atributos data-
             * @param {type} params
             * @param {type} data
             * @returns {String}
             */
            _private.attrValuesServer = function(params, data) {
                var result = '';
                /*validar si tiene parametros de servidor*/
                if (params) {
                    /*validar si es array*/
                    if (params instanceof Object) {
                        /*se agrega paramtros desde array*/
                        for (var x in params) {
                            for (var y in params[x]) {
                                if(data[params[x][y]] !== undefined){
                                    result += " data-"+params[x][y]+"=\""+data[params[x][y]]+"\"";
                                }
                            }
                        }
                    } else {
                        /*se agrega parametros directos*/
                        result += " data-"+params+"=\""+data[params]+"\"";
                    }
                }
                return result;
            };
            
            /*
             * Crea los checkbox de la tabla
             * @param {type} oSettings
             * @param {type} data
             * @param {type} r
             * @returns {$}
             */
            _private.createCheckbox = function(oSettings, data, r) {
                var clientValues = (oSettings.sCheckbox.clientValues !== undefined) ? oSettings.sCheckbox.clientValues : '';    /*parametros del cliente*/
                var serverValues = (oSettings.sCheckbox.serverValues !== undefined) ? oSettings.sCheckbox.serverValues : '';    /*parametros del servidor*/
                var attrServerValues = (oSettings.sCheckbox.attrServerValues !== undefined) ? oSettings.sCheckbox.attrServerValues : '';    /*parametros del servidor como atributos*/
                var xvalues = '', attrValues = '';

                if (clientValues !== '') {
                    /*parametros de cliente*/
                    xvalues += _private.valuesClient(clientValues, data[r]);
                }
                if (serverValues !== '') {
                    /*parametros de servidor*/
                    xvalues += _private.valuesServer(serverValues, data[r]);
                }
                xvalues = xvalues.substring(0, xvalues.length - 1);

                if (attrServerValues !== '') {
                    /*parametros de servidor como atributos*/
                    attrValues = _private.attrValuesServer(attrServerValues, data[r]);
                }
                var td = $('<td></td>');
                td.html('<input id="' + oSettings.tObjectTable + '_chk_' + r + '" type="checkbox" value="' + xvalues + '" '+attrValues+' class="chkG">');
                td.attr('class', 'center');
                //td.attr('data-render', '0');
                return td;
            };
            
            /*
             * Crea los registros de la tabla
             * @param {type} oSettings
             * @returns {undefined}
             */
            _private.records = function(oSettings){
                var data = oSettings.sData,
                    chkExist = 0;
                $('#tbody_'+oSettings.tObjectTable).find('tr').remove();        /*remover <tr> para nueva data*/
               
                var num = _private.numeracion(oSettings) + 1;
               
                /*verificar q tenga data*/
                if(data.length){
                    for (var r in data) {
                        var tr   = $('<tr></tr>');        /*se crea el tr*/
                        tr.attr('id','tr_'+oSettings.tObjectTable+'_'+r);
                        
                        /*agregando numeracion*/
                        if(oSettings.tNumbers){
                            var td = $('<td></td>');         /*se crea la columna*/
                            td.html('<b>'+(num++)+'</b>');
                            td.css('width', '1%');
                            //td.attr('data-render', '0');
                            tr.append(td);                   /*se agrega al <tr>*/
                        }
                        
                        /*agregando acciones al inicio*/
                        if (_private.positionAxion.toLowerCase() === 'first') {
                            tr.append(_private.axionButtons(r, data, oSettings));
                        }
                                
                        /*agregando checkbox al inicio*/
                        if(oSettings.sCheckbox !== undefined && oSettings.sCheckbox instanceof Object){
                            var pos = (oSettings.sCheckbox.position !== undefined) ? oSettings.sCheckbox.position : 'first';
                            if(pos.toLowerCase() === 'first'){                        
                                tr.append(_private.createCheckbox(oSettings, data, r));        /*se agrega al <tr>*/
                                chkExist = 1;
                            }
                        }
                
                        /*recorrido de columnas configuradas en js*/
                        for (var c in oSettings.tColumns) {
                            var td          = $('<td></td>');         /*se crea la columna*/
                            var width       = (oSettings.tColumns[c].width !== undefined) ? oSettings.tColumns[c].width + oSettings.tWidthFormat : '';
                            var klass       = (oSettings.tColumns[c].class !== undefined) ? oSettings.tColumns[c].class : '';     /*clase css para <td>*/
                            var fnCallback  = (oSettings.tColumns[c].fnCallback !== undefined) ? oSettings.tColumns[c].fnCallback : '';     /*closure css para <td>*/
                            /*parametros para ajax*/
                            var ajax        = (oSettings.tColumns[c].ajax !== undefined) ? oSettings.tColumns[c].ajax : '';       /*ajax para <td>*/
                            var fn          = '';
                            var flag        = '';
                            var clientParams= '';
                            var serverParams= '';

                            if (ajax) {
                                fn          = (ajax.fn !== undefined) ? ajax.fn : '';                      /*funcion ajax*/
                                flag        = (ajax.flag !== undefined) ? ajax.flag : '';                  /*flag de la funcion*/
                                clientParams= (ajax.clientParams !== undefined) ? ajax.clientParams : '';  /*parametros desde el cliente*/
                                serverParams= (ajax.serverParams !== undefined) ? ajax.serverParams : '';  /*parametros desde el servidor*/
                            }

                            var texto = data[r][oSettings.tColumns[c].campo];
                            
                            /*agregando ajax*/
                            if (fn) {
                                var xparams = '';

                                /*validar flag para agregar como parametro*/
                                if (flag) {
                                    xparams = flag + ',';
                                }
                                /*parametros de servidor*/
                                xparams += _private.paramServer(serverParams, data[r]);
                                /*parametros de cliente*/
                                xparams += _private.paramClient(clientParams);

                                xparams = xparams.substring(0, xparams.length - 1);
                                fn = fn + '(' + xparams + ')';
                                texto = $('<a></a>');
                                texto.attr('href','javascript:;');
                                texto.html(data[r][oSettings.tColumns[c].campo]);
                                texto.attr('onclick',fn);
                            }
                            td.html(texto);                         /*contenido original de <td>*/
                            td.attr('class', klass);                /*agregado class css*/
                            td.attr({width:width});
                            /*verificar si tiene fnCallback configurado*/
                            if(fnCallback !== undefined && fnCallback instanceof Object){
                                var call = fnCallback(r,data[r]);       /*se ejecuta fnCallback*/
                                if(!call){
                                    //call es false, <td> sigue con su contenido original
                                }else{
                                    td.html(call);  /*se carga return de call*/
                                }
                            }
                            
                            tr.append(td);                          /*se agrega al <tr>*/
                        }
                        
                        /*agregando checkbox al inicio*/
                        if(oSettings.sCheckbox !== undefined && oSettings.sCheckbox instanceof Object && chkExist === 0){
                            var pos = (oSettings.sCheckbox.position !== undefined) ? oSettings.sCheckbox.position : 'last';
                            if(pos.toLowerCase() === 'last'){                        
                                tr.append(_private.createCheckbox(oSettings, data, r));        /*se agrega al <tr>*/
                            }
                        }
                        
                        /*agregando acciones al final*/
                        if (_private.positionAxion.toLowerCase() === 'last') {
                            tr.append(_private.axionButtons(r, data, oSettings));
                        }
                        
                        $('#tbody_'+oSettings.tObjectTable).append(tr);
                    }
                }else{
                    var tr   = $('<tr></tr>');        /*se crea el tr*/
                    var td = $('<td></td>');         /*se crea la columna*/
                    td.attr('colspan',_private.colspanRecords);
                    td.html('<div class="alert alert-info center"><i class="fa fa-info"></i> '+oSettings.tMsnNoData+'<div>');
                    
                    tr.html(td);                                    /*se agrega al <tr>*/
                    $('#tbody_'+oSettings.tObjectTable).html(tr);
                }
            };
            
            
            
            return this.each(function(){
                
                var oSettings = options;
                
                $.method = {
                    
                    /*
                     * Marcar / Desmarcar los checks de grid
                     * @param {type} el
                     * @param {type} tab
                     */
                    checkAll: function(el,tab){
                        $(tab).find('tbody').find('tr').each(function(){
                            if ($(el).is(':checked')) {
                               $(this).find('.chkG').attr('checked',true);
                            }else{
                                $(this).find('.chkG').attr('checked',false);
                            }
                        });
                    },
                    /*
                     * Evento para cbChange
                     * @param {type} oSettings
                     */
                    cbChange: function(oSettings) {
                        oSettings.pDisplayStart = 0;
                        oSettings.pDisplayLength = $('#' + oSettings.tObjectTable + '_cbLength').val();
                        $.method.sendAjax(oSettings);
                    },
                    
                    /*
                     * Inicia el dataGrid
                     */
                    ini: function(){
                        
                        /*la tabla*/
                        _private.table(oSettings);
                        
                        /*la cabecera*/
                        _private.theader(oSettings);
                        
                        /*el body de la tabla*/
                        _private.tbody(oSettings);
                        
                        /*el pie*/
                        _private.tfoot(oSettings);
                        
                        /*se valida se data sera via ajax*/
                        if (oSettings.ajaxSource) {
                            this.sendAjax(oSettings);
                        }
                    },
                    
                    /*
                     * Se realiza la consulta via Ajax
                     */
                    sendAjax: function(oSettings){
                        /*inica efecto loading*/
                        _private.iniLoading(oSettings);
                        
                        var limit0 = _private.limitInferior(oSettings);
                        
                        /*Verificamos si se enviara parametros al server*/
                        if(oSettings.fnServerParams !== undefined){ oSettings.fnServerParams(_private.aData); }
                        
                        /*Enviamos datos de paginacion*/
                        _private.aData.push({name: 'pDisplayStart', value: limit0});
                        _private.aData.push({name: 'pDisplayLength', value: oSettings.pDisplayLength});
                        _private.aData.push({name: 'pOrder', value: oSettings.pOrderField});
                        _private.aData.push({name: 'pFilterCols', value: axAjax.stringPost(_private.pFilterCols)});
                        
                        var datosx = _private.serialize();
                        
                        $.ajax({
                            type: "POST",
                            data: datosx,
                            url: oSettings.ajaxSource,
                            dataType: 'json',
                            success: function(data) {
                                /*validar error del SP*/
                                if (data.length > 0 || data.error !== undefined) {
                                    /*no es un array, servidor devuelve cadena, y el unico q devuelve cadena es el ERROR del SP*/
                                    if (data instanceof Object === false || data.error !== undefined) {
                                        var msn = data;
                                        if (data.error !== undefined) {
                                            msn = data.error;
                                        }
                                        axScript.notify.error({
                                            content: msn
                                        });
                                    }
                                }

                                oSettings.sData  = data;

                                /*generar registros*/
                                _private.records(oSettings);

                                /*generar paginacion*/
                                _private.paginate(oSettings);

                                /*se ejecuta callback*/
                                if (oSettings.fnCallback !== undefined) {//si existe callback
                                    var callback = oSettings.fnCallback;
                                    callback(oSettings);
                                }
                                
                                /*finaliza efecto loading*/
                                _private.endLoading(oSettings);
                        
                                /*oculto lo eventos de la grilla: button, a, chk_all*/
                                axScript.removeAttr.click({
                                    container: "#"+oSettings.tObjectTable,
                                    typeElement: "button, a, #"+oSettings.tObjectTable+"_chkall_0 input:checkbox"
                                }); 
                                
                                /*ejecutar el scroll*/
                                _private.exeScroll(oSettings);
                            }
                        });
                        
                    }
                    
                };
                
                $.method.ini();
                
            });
            
        }
        
    });
    
})(jQuery);