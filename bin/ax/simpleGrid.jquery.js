/*
 * Documento   : simpleGrid.jquery.js v.1.0
 * Creado      : noviembre-2014
 * Autor       : RD
 * Descripcion : data grid
 */
(function($) {

    "use strict";

    $.method = null;

    $.fn.extend({
        simpleGrid: function(options) {

            var _idGrid = $(this).attr('id');   /*identificador de la grilla*/

            var _aData = [];                    /*almacena datos que van al server*/

            var _s = 0;                         /*ejecuta scrool una vez por gilla*/

            var _tmpTH = null;                  /*id <th> temporal*/

            var _searchOk = false;              /*para activar busqueda por columnas*/

            /*aplicando propiedades por defecto*/
            var defaults = {
                tObjectTable: _idGrid,              /*identificador de la grilla*/
                tWidthFormat: '%',                  /*para dimension de columnas*/
                tChangeLength: true,                /*activa combo de registros a mostrar por pagina*/
                tRegsLength: [10, 25, 50, 100],     /*para numero de registros por pagina*/
                tColumns: [],                       /*columnas del header*/
                tReload: true,                     /*para cargar la data dentro del body solamente*/
                tOrderField: '',                    /*para el order ASC o DESC*/
                tFilter: false,                     /*filtro general de tabla*/
                tFilterAdvanced: false,             /*activa los filtros avanzados*/
                tPlaceHolderFilter: 'Busqueda',     /*palceholder del filter*/
                tSearch: '',                        /*texto a buscar*/
                tScrollY: '',                       /*scrool Y de tabla*/
                tNumeracion: false,                 /*para mostrar la numeracion*/
                pInfo: true,                        /*para mostrar informacion de paginacion*/
                pPaginate: true,                    /*paginacion*/
                pDisplayStart: 0,                   /*registro inicial de la data*/
                pDisplayLength: 50,                 /*numero de registros por pagina*/
                pItemPaginas: 5,                    /*numero de items a mostrar en paginador*/
                ajaxSource: null,                   /*url para la data via ajax*/
                sTotal: 0,                          /*total de registros*/
                sPositionAxion: 'last',            /*posicion de las acciones*/
                sAxions: [],                        /*acciones del grid*/
                sCheckbox: {                        /*para activar checkbox*/
                    start: false,
                    possition: 'first',
                    serverValues: [],
                    clientValues: [],
                    attrServerValues: []
                },
                fnCallback: function() {},          /*callback*/
                sFilterCols: '',                    /*sql generado mediante filtros avanzados*/
                tWidthFilter: '95%'                 /*width de los filtros*/
            };

            var options = $.extend(defaults, options);
            
            /*reemplazar ñ y tildes*/
            var utf8_decode = function(strUtf) {
                // note: decode 3-byte chars first as decoded 2-byte strings could appear to be 3-byte char!
                var strUni = strUtf.replace(
                    /[\u00e0-\u00ef][\u0080-\u00bf][\u0080-\u00bf]/g,  // 3-byte chars
                    function(c) {  // (note parentheses for precence)
                        var cc = ((c.charCodeAt(0)&0x0f)<<12) | ((c.charCodeAt(1)&0x3f)<<6) | ( c.charCodeAt(2)&0x3f);
                        return String.fromCharCode(cc); }
                );
                strUni = strUni.replace(
                    /[\u00c0-\u00df][\u0080-\u00bf]/g,                 // 2-byte chars
                    function(c) {  // (note parentheses for precence)
                        var cc = (c.charCodeAt(0)&0x1f)<<6 | c.charCodeAt(1)&0x3f;
                        return String.fromCharCode(cc); }
                );
                return strUni;
            };

            var utf8_encode = function(strUni) {
                // use regular expressions & String.replace callback function for better efficiency
                // than procedural approaches
                var strUtf = strUni.replace(
                    /[\u0080-\u07ff]/g,  // U+0080 - U+07FF => 2 bytes 110yyyyy, 10zzzzzz
                    function(c) {
                        var cc = c.charCodeAt(0);
                        return String.fromCharCode(0xc0 | cc>>6, 0x80 | cc&0x3f); }
                );
                strUtf = strUtf.replace(
                    /[\u0800-\uffff]/g,  // U+0800 - U+FFFF => 3 bytes 1110xxxx, 10yyyyyy, 10zzzzzz
                    function(c) {
                        var cc = c.charCodeAt(0);
                        return String.fromCharCode(0xe0 | cc>>12, 0x80 | cc>>6&0x3F, 0x80 | cc&0x3f); }
                );
                return strUtf;
            };

            var normalize = (function() {
                var from = "ÃÀÁÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛãàáäâèéëêìíïîòóöôùúüûÑñÇç",
                    to   = "AAAAAEEEEIIIIOOOOUUUUaaaaaeeeeiiiioooouuuuNncc",
                    mapping = {};

                for(var i = 0, j = from.length; i < j; i++ )
                    mapping[ from.charAt( i ) ] = to.charAt( i );

                return function( str ) {
                    var ret = [];
                    for( var i = 0, j = str.length; i < j; i++ ) {
                        var c = str.charAt( i );
                        if( mapping.hasOwnProperty( str.charAt( i ) ) )
                            ret.push( mapping[ c ] );
                        else
                            ret.push( c );
                    }
                    return ret.join( '' );
                }

            })();
            
            var noOrderNro = function(oSettings) {
                /*obteniendo is de tabla de <thead>*/
                if (oSettings.tScrollY === '') {
                    /*cuando no tiene scrool*/
                    var idS = oSettings.tObjectTable;
                } else {
                    /*cuando tiene scrool*/
                    var idS = oSettings.tObjectTable + '_head';
                }
                if (oSettings.tNumeracion) {
                    $('#' + idS).find('thead').find('tr th').eq(0).off('click');
                    $('#' + idS).find('thead').find('tr th').eq(0).removeClass('sorting');
                }
                if (oSettings.sAxions.length) {
                    $('#' + idS).find('thead').find('tr').find('#' + oSettings.tObjectTable + '_axions').off('click');
                    $('#' + idS).find('thead').find('tr').find('#' + oSettings.tObjectTable + '_axions').removeClass('sorting');
                }
                if (oSettings.sCheckbox.start) {
                    $('#' + idS).find('thead').find('tr').find('#' + oSettings.tObjectTable + '_chkall_0').off('click');
                    $('#' + idS).find('thead').find('tr').find('#' + oSettings.tObjectTable + '_chkall_0').removeClass('sorting');
                }
            };
            /*serialisa objeto*/
            var serialObject = function(cadena) {
                cadena = JSON.stringify(cadena).replace(/'/g, '~');
                cadena = cadena.replace(/"/g, '^');
                return cadena;
            };
            /*deserialisa objeto*/
            var unserialObject = function(cadena) {
                var cc = '';

                for (var i in cadena) {
                    if (cadena[i] === '^') {
                        cc += '"';
                    } else {
                        cc += cadena[i];
                    }
                }
                cc = cc.replace(/~/g, "'");

                cc = JSON.parse(cc);
                return cc;
            };
            /*calcula limit inferior*/
            var limitInferior = function(oSettings) {
                var limit0 = oSettings.pDisplayStart;
                if (oSettings.pDisplayStart > 0) {
                    limit0 = oSettings.pDisplayLength * limit0;
                }
                return limit0;
            };
            /*genera busqueda general*/
            var inputFilter = function(oSettings) {
                var fil = '\
                <div class="col-sm-6">\n\
                    <div class="input-group col-sm-6">\n\
                        <span class="input-group-addon"><i class="fa fa-search"></i></span>\n\
                        <input type="text" id="' + oSettings.tObjectTable + '_filter" name="' + oSettings.tObjectTable + '_filter" class="form-control" placeholder="' + oSettings.tPlaceHolderFilter + '">\n\
                    </div>\n\
                </div>';

                $('#' + oSettings.tObjectTable + '_tools').append(fil);
                $('#' + oSettings.tObjectTable + '_filter').keyup(function(tecla) {
                    if (tecla.keyCode === 13) {
                        oSettings.tSearch = this.value;
                        oSettings.pDisplayStart = 0;            /*para busqueda se reinicia a cero*/
                        $.method.sendAjax(oSettings);
                    }
                });

            };
            /*cebra de columna al ordenar*/
            var cebraCol = function(r, tOrderField, campo) {
                var m, classort;
                m = tOrderField.split(' ');
                classort = '';
                if (campo === m[0]) {
                    classort = ' sorting_1';
                    if (r % 2) {
                        classort = ' sorting_2';
                    }
                }
                return classort;
            };
            /*redimensiona header*/
            var resizeHeader = function(oSettings) {
                $('#' + oSettings.tObjectTable).find('tbody tr').each(function(index) {
                    if (index === 0) {
                        $(this).find('td').each(function(i) {
                            var r = ($(this).attr('data-render') !== undefined) ? $(this).attr('data-render') : 1;
                            if (r === 1) {
                                var w = $(this).width();
                                $('#' + oSettings.tObjectTable + '_head').find('thead').find('tr th').eq(i).width(w + oSettings.tWidthFormat);
                            }
                        });
                    }
                });

                var w_h = parseFloat($('#' + oSettings.tObjectTable + '_main').width() + 2);

                /*width de header con scrool se desconfiguraba el ancho, se tuvo q colocal el mismo ancho de la tablas*/
                $('#' + oSettings.tObjectTable + '_head_container').css({width: w_h + 'px'});
            };
            /*agregando sort a <table>*/
            var addSorting = function(oSettings) {
                var sortable;
                if (oSettings.tScrollY === '') {
                    /*si no hay scrool el head no tiene id*/
                    $('#' + oSettings.tObjectTable).find('thead').find('tr th').each(function() {
                        var tthis = this;
                        sortable = $(this).is('.sorting');
                        if (sortable !== '') {
                            $(this).click(function() {
                                $.method.sorting(tthis, oSettings);
                            });
                        }
                    });
                } else {
                    $('#' + oSettings.tObjectTable + '_head').find('thead').find('tr th').each(function() {
                        var tthis = this;
                        sortable = $(this).is('.sorting');
                        if (sortable !== '') {
                            $(this).click(function() {
                                $.method.sorting(tthis, oSettings);
                            });
                        }
                    });
                }
                noOrderNro(oSettings);
            };
            /*activar scrool: Y de tabla*/
            var scroolYY = function(oSettings) {
                if (oSettings.tScrollY !== '') {
                    var c = $('#' + oSettings.tObjectTable).attr('class');                /*class de tabla*/
                    var h = $('#' + oSettings.tObjectTable).find('thead').html();

                    $('#' + oSettings.tObjectTable).find('thead').remove();

                    var dhead = $('<div></div>');
                    dhead.attr('id', oSettings.tObjectTable + '_head_container');
                    dhead.css({
                        'border': '1px solid #ccc',
                        'background': '#ffffff',
                        'padding-right': '16px'
                    });
                    $(dhead).insertBefore('#' + oSettings.tObjectTable + '_main');

                    var head = $('<table></table>');
                    head.attr('class', c);
                    head.attr('id', oSettings.tObjectTable + '_head');
                    head.css({'margin-bottom':'0px'});
                    
                    var headhd = $('<thead></thead>');
                    headhd.html(h);
                    $(head).html(headhd);

                    $(dhead).html(head);

                    $(window).resize(function() {
                        resizeHeader(oSettings);
                    });

                    /*agregar sorting*/
                    addSorting(oSettings);
                    /*agrega evento de busqueda a filtros de columnas*/
                    addSearchCol(oSettings);
                }
            };
            /*crea el main*/
            var mainTable = function(oSettings) {
                var c = $('#' + oSettings.tObjectTable).attr('class');                /*class de tabla*/
                var divMain = $('<div id="' + oSettings.tObjectTable + '_main"></dv>');
                $(divMain).insertBefore('#' + oSettings.tObjectTable);                /*se agrega div main*/
                $('#' + oSettings.tObjectTable).remove();                             /*se elimina tabla*/
                
                var t = $('<table id="' + oSettings.tObjectTable + '" class="' + c + '"></table>');
                t.css({'margin-bottom':'0px'});
                $('#' + oSettings.tObjectTable + '_main').html(t);                      /*se garega la tabla*/

                /*verficamos si se configuro el scrool*/
                if (oSettings.tScrollY !== '') {
                    $('#' + oSettings.tObjectTable + '_main').css({
                        height: oSettings.tScrollY,
                        'overflow-y': 'scroll',
                        position: 'relative !important',
                        'border-right': '1px solid #ccc',
                        'border-left': '1px solid #ccc'
                                //'margin-top': '34px'                /*margin de tabla de registros con el header NO VA XQ ESTA APARTE*/
                    });
                }
            };
            /*crear texto accion en cabecera, y su posicion*/
            var headAxionText = function(oSettings) {
                if (oSettings.sAxions.length) {
                    var txtax = $('<th class="center"></th>');
                    txtax.attr('id',oSettings.tObjectTable+'_axions');
                    txtax.html('Acciones');
                    txtax.css({'vertical-align': 'middle'});
                    return txtax;
                }
            };
            /*generando las acciones*/
            var axionButtons = function(r, data, oSettings) {
                if (oSettings.sAxions.length) {
                    var w = oSettings.sAxions.length * 40;
                    var td = $('<td class="center" style="width:' + w + 'px;"></td>');
                    /*recorrido de acciones*/
                    for (var i in oSettings.sAxions) {
                        var access = (oSettings.sAxions[i].access !== undefined) ? oSettings.sAxions[i].access : 0;
                        var titulo = (oSettings.sAxions[i].titulo !== undefined) ? oSettings.sAxions[i].titulo : '';
                        var icono = (oSettings.sAxions[i].icono !== undefined) ? oSettings.sAxions[i].icono : '';
                        var klass = (oSettings.sAxions[i].class !== undefined) ? oSettings.sAxions[i].class : '';
                        /*parametros para ajax*/
                        var ajax = (oSettings.sAxions[i].ajax !== undefined) ? oSettings.sAxions[i].ajax : '';       /*ajax para <td>*/
                        var fn = '';
                        var flag = '';
                        var clientParams = '';
                        var serverParams = '';
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
                            xparams += $.method.paramServer(serverParams, data[r]);
                            /*parametros de cliente*/
                            xparams += $.method.paramClient(clientParams);
                            xparams = xparams.substring(0, xparams.length - 1);
                            fn = fn + '(this,' + xparams + ')';
                        }

                        var btn = $('<button></button>');
                        btn.attr('type', 'button');
                        btn.attr('id', oSettings.tObjectTable + '_btn' + i);
                        btn.attr('title', titulo);
                        /*agrgando ajax*/
                        if (fn) {
                            btn.attr('onclick',fn);
                        }
                        if (klass !== '') {
                            btn.attr('class', klass);
                        }
                        if (icono !== '') {
                            btn.html('<i class="' + icono + '"></i>');
                        }
                        /*verificar si tiene acceso*/
                        if(access){
                            td.append(btn);
                        }
                    }
                    return td;
                }
            };
            /*coloca los botones en _tools*/
            var renderButtons = function(oSettings) {
                var btnslen = $('#' + oSettings.tObjectTable + '_btns').length,
                    btns = '';

                if(btnslen){
                    btns = $('#' + oSettings.tObjectTable + '_btns').html();        /*se obtiene los botones*/
                    $('#' + oSettings.tObjectTable + '_btns').remove();
                }


                var bt = '\
                <div class="col-sm-6 pull-right">\n\
                    <div class="btn-group pull-right">\n\
                        ' + btns + '\n\
                    </div>\n\
                </div>';

                $('#' + oSettings.tObjectTable + '_tools').append(bt);
            };
            /*values desde el servidor*/
            var valuesServer = function(params, data) {
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
            /*values desde el cliente*/
            var valuesClient = function(params) {
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
            /*values desde el servidor como atributos*/
            var attrValuesServer = function(params, data) {
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
            /*crear checkbox en filas*/
            var createCheckbox = function(oSettings, data, r) {
                var clientValues = (oSettings.sCheckbox.clientValues !== undefined) ? oSettings.sCheckbox.clientValues : '';    /*parametros del cliente*/
                var serverValues = (oSettings.sCheckbox.serverValues !== undefined) ? oSettings.sCheckbox.serverValues : '';    /*parametros del servidor*/
                var attrServerValues = (oSettings.sCheckbox.attrServerValues !== undefined) ? oSettings.sCheckbox.attrServerValues : '';    /*parametros del servidor como atributos*/
                var xvalues = '', attrValues = '';

                if (clientValues !== '') {
                    /*parametros de cliente*/
                    xvalues += valuesClient(clientValues, data[r]);
                }
                if (serverValues !== '') {
                    /*parametros de servidor*/
                    xvalues += valuesServer(serverValues, data[r]);
                }
                xvalues = xvalues.substring(0, xvalues.length - 1);

                if (attrServerValues !== '') {
                    /*parametros de servidor como atributos*/
                    attrValues = attrValuesServer(attrServerValues, data[r]);
                }
                var td = $('<td></td>');
                td.html('<input id="' + oSettings.tObjectTable + '_chk_' + r + '" type="checkbox" value="' + xvalues + '" '+attrValues+'>');
                td.attr('class', 'center');
                td.css('width', '25px');
                td.attr('data-render', '0');
                return td;
            };
            /*reenumarar tabla*/
            var reNumeracion = function(oSettings) {
                $('#' + oSettings.tObjectTable).find('tbody').find('tr').each(function(index) {
                    $(this).find('td').eq(0).html((1 + index));
                });

            };
            /*crea botones primero y anterior de paginacion*/
            var liFirstPrev = function(ul, oSettings, pagActual) {
                if (pagActual > 1) {
                    oSettings.pDisplayStart = 0;                /*para boton primero*/
                }
                /*se crea boton <li> ptimero*/
                var liFirst = $('<li></li>');

                if (pagActual > 1) {
                    liFirst.attr('class', 'first');
                } else {
                    liFirst.attr('class', 'first disabled');
                }

                /*se crea <a> primero*/
                var aFirst = $('<a></a>');
                aFirst.attr('href', 'javascript:;');
                aFirst.html('<i class="'+oSettings.btnFirst+'"></i>');
                if (pagActual > 1) {
                    aFirst.click(function() {
                        $.method.sendAjax(oSettings);
                    });
                }
                $(liFirst).html(aFirst);                /*aFirst dentro de liFirst*/
                $(ul).append(liFirst);                  /*liFirst dentro de ul*/

                if (pagActual > 1) {
                    oSettings.pDisplayStart = pagActual - 2;   /*para boton anterior*/
                }
                /*se crea boton <li> anterior*/
                var liPrev = $('<li></li>');
                if (pagActual > 1) {
                    liPrev.attr('class', 'prev');
                } else {
                    liPrev.attr('class', 'prev disabled');
                }

                /*se crea <a> anterior*/
                var aPrev = $('<a></a>');
                aPrev.attr('href', 'javascript:;');
                aPrev.html('<i class="'+oSettings.btnPrev+'"></i>');
                if (pagActual > 1) {
                    aPrev.click(function() {
                        $.method.sendAjax(oSettings);
                    });
                }
                $(liPrev).html(aPrev);                /*aPrev dentro de liPrev*/
                $(ul).append(liPrev);                  /*liPrev dentro de ul*/
            };
            /*crea botones ultimo y siguiente de paginacion*/
            var liLastNext = function(ul, oSettings, pagActual, numPaginas) {
                if (numPaginas > 1 && pagActual !== numPaginas) {
                    oSettings.pDisplayStart = pagActual;             /*para boton siguiente*/
                }

                /*se crea boton <li> siguiente*/
                var liNext = $('<li></li>');
                if (numPaginas > 1 && pagActual !== numPaginas) {
                    liNext.attr('class', 'next');
                } else {
                    liNext.attr('class', 'next disabled');
                }

                /*se crea <a> next*/
                var aNext = $('<a></a>');
                aNext.attr('href', 'javascript:;');
                aNext.html('<i class="'+oSettings.btnNext+'"></i>');
                if (numPaginas > 1 && pagActual !== numPaginas) {
                    aNext.click(function() {
                        $.method.sendAjax(oSettings);
                    });
                }
                $(liNext).html(aNext);                /*aNext dentro de liNext*/
                $(ul).append(liNext);                  /*liNext dentro de ul*/

                if (numPaginas > 1 && pagActual !== numPaginas) {
                    oSettings.pDisplayStart = numPaginas - 1;     /*para boton ultimo*/
                }

                /*se crea boton <li> ultimo*/
                var liLast = $('<li></li>');

                if (numPaginas > 1 && pagActual !== numPaginas) {
                    liLast.attr('class', 'last');
                } else {
                    liLast.attr('class', 'last disabled');
                }

                /*se crea <a> ultimo*/
                var aLast = $('<a></a>');
                aLast.attr('href', 'javascript:;');
                aLast.html('<i class="'+oSettings.btnLast+'"></i>');
                if (numPaginas > 1 && pagActual !== numPaginas) {
                    aLast.click(function() {
                        $.method.sendAjax(oSettings);
                    });
                }
                $(liLast).html(aLast);                /*aLast dentro de liLast*/
                $(ul).append(liLast);                  /*liLast dentro de ul*/
            };
            /*obtener operador*/
            var operator = function(o) {
                var com1 = '', com2 = '', op = o;
                /*si operator es LIKE se agrea comodin % */
                if (o.toLowerCase() === 'like') {
                    com1 = '*';  /*este sera el comodin*/
                    com2 = '*';  /*este sera el comodin*/
                } else if (o.toLowerCase() === 'c') {/*compienza por*/
                    op = 'LIKE';
                    com2 = '*';  /*este sera el comodin*/
                } else if (o.toLowerCase() === 't') {/*termina por*/
                    op = 'LIKE';
                    com1 = '*';  /*este sera el comodin*/
                }
                return {a: com1, b: com2, c: op};
            };
            /*ejecuta la busqueda de fitros de columnas*/
            var executeSearchCols = function(oSettings) {
                var searchTxt = '';
                /*agregar evento a searchs*/
                $('#' + oSettings.tObjectTable + '_input_search').find('td').each(function() {
                    var tipoElement = $(this).attr('data-elemento');

                    /*si existe tipo elemento en <td>, entonces se ha configurado los filtros*/
                    if (tipoElement !== undefined) {
                        switch (tipoElement.toLowerCase()) {
                            case 'text':
                                var input = $(this).find('input:text');
                                break;
                            case 'select':
                                var input = $(this).find('select');
                                break;
                        }
                        var operator1 = $(this).find('.operator1').val();
                        var operator2 = $(this).find('.operator2').val();
                        var operator3 = $(this).find('.operator3').val();
                        var input2 = $(this).find('label .input2').val();
                        var campo = input.attr('data-campo');

                        /* = <> > >= < <= C T LIKE */
                        /*valor de primer filtro tiene contenido*/
                        if (input.val() !== '') {
                            var oA = operator(operator1);
                            /*verificar si hay AND o OR*/
                            if (input2 !== '') {
                                var oB = operator(operator3);

                                searchTxt += ' AND (' + campo + ' ' + oA.c + ' "' + oA.a + input.val() + oA.b + '" ' + operator2 + ' ' + campo + ' ' + oB.c + ' "' + oB.a + input2 + oB.b + '")';
                            } else {
                                searchTxt += ' AND ' + campo + ' ' + oA.c + ' "' + oA.a + input.val() + oA.b + '"';
                            }
                        }
                    }
                });

                oSettings.sFilterCols = searchTxt;
                oSettings.pDisplayStart = 0;
                $.method.sendAjax(oSettings);
            };
            /*agrega evento a elemento para filtros de columnas*/
            var addSearchCol = function(oSettings) {
                var objCampo = [],
                    numAx = 0,          /*para contar una unidad si axions es FIRST*/
                    numChk = 0,         /*para contar una unidad si CHK esta activo*/
                    numNum = 0;         /*para contar una unidad si numeracion esta activo*/
                    
                /*validar si hay ACCIONES y es FIRST*/
                if (oSettings.sPositionAxion.toLowerCase() === 'first' && oSettings.sAxions.length > 0) {
                    numAx = 1;
                }
                /*verificar si se agrega CHECKBOX y si esta en la posicion first*/
                if (oSettings.sCheckbox.start) {
                    var pos = (oSettings.sCheckbox.possition !== undefined) ? oSettings.sCheckbox.possition : 'first';

                    if (pos.toLowerCase() === 'first') {
                        numChk = 1;
                    }
                }
                /*verificar si numaracion esta activo*/
                if (oSettings.tNumeracion) {
                    numNum = 1;
                }
                
                /*agregar evento a searchs*/
                $('#' + oSettings.tObjectTable + '_input_search').find('td').each(function(i) {
                    var element = $(this).attr('data-elemento');

                    /*si existe tipo de elemento*/
                    if (element !== undefined) {
                        /*si alguna de las validaciones es 1 no debe restar el indice para oSettings.tColumns*/
                        var index = parseInt(i) - parseInt(numAx) - parseInt(numChk) - parseInt(numNum);
                        var campo = oSettings.tColumns[index].campo;
                        /*verificar si existe compare*/
                        if(oSettings.tColumns[index].search.compare !== undefined){
                            campo = oSettings.tColumns[index].search.compare;
                        }
                        objCampo.push(campo);                          /*para ocultar filtros al dar click en document*/

                        /*agregar evento segun elemento*/
                        switch (element.toLowerCase()) {
                            case 'text':
                                var input = $(this).find('input:text');
                                input.css({width: '100%'});
                                input.keyup(function(tecla) {
                                    if (tecla.keyCode === 13) {
                                        executeSearchCols(oSettings);
                                    }
                                });
                                break;
                            case 'select':
                                /*como hay mas combos en <td> debo aplicar el change al primer combo*/
                                var input = $(this).find('#' + oSettings.tObjectTable + '_search_' + campo);
                                input.change(function() {
                                    executeSearchCols(oSettings);
                                });
                                break;
                        }
                        /*agregar evento a <button> filtrar*/
                        var bFilter = $(this).find('button:eq(1)');
                        bFilter.click(function() {
                            executeSearchCols(oSettings);
                        });
                        /*agregar evento < <button> limpiar*/
                        var bClear = $(this).find('button:eq(2)');
                        bClear.click(function() {
                            $('#' + oSettings.tObjectTable + '_' + campo + '_filter').find('input:text').val('');
                        });
                    }
                });
                /*para ocultar filtros al dar click en document*/
                if (objCampo.length) {
                    $(document).click(function(a) {
                        for (var n in objCampo) {
                            if ($(a.target).attr('id') === oSettings.tObjectTable + '_' + objCampo[n] + '_filter' ||
                                    $(a.target).attr('id') === oSettings.tObjectTable + '_' + objCampo[n] + '_btn_filter' ||
                                    $(a.target).attr('data-campo') === objCampo[n]) {
                                //
                            } else {
                                $('#' + oSettings.tObjectTable + '_' + objCampo[n] + '_cont_filter').css('display', 'none');
                            }
                        }
                    });
                }
            };
            /*crea los filtros avanzados*/
            var advancedFilters = function(oSettings, c) {
                var campo = oSettings.tColumns[c].campo;
                var operator = oSettings.tColumns[c].search.operator;
                /*verifico si existe compare*/
                if(oSettings.tColumns[c].search.compare !== undefined){
                    campo = oSettings.tColumns[c].search.compare;
                }
                
                var fContMain = $('<div></div>');
                fContMain.attr('id', oSettings.tObjectTable + '_' + campo + '_cont_filter');
                fContMain.css({display: 'none'});
                fContMain.attr('class', 'advancedFilter');

                var fContainer = $('<div></div>');
                fContainer.attr('id', oSettings.tObjectTable + '_' + campo + '_filter');
                fContainer.css({
                    border: '1px solid #cccccc',
                    background: '#ffffff',
                    padding: '5px',
                    position: 'absolute'
                });

                /*texto en filtro*/
                var p = $('<p></p>');
                p.attr('data-campo', campo);
                p.html('Mostrar registros que sean:');
                p.css({width: '153px'});
                fContainer.append(p);
                /*combo con operadores 1*/
                var fOperators1 = $('<label></label>');
                fOperators1.attr('class', 'select');
                fOperators1.html('<select class="operator1" data-campo="' + campo + '">\n\
                                    <option value="=" ' + (operator === '=' ? 'selected="selected"' : '') + ' data-campo="' + campo + '">Igual</option>\n\
                                    <option value="<>" ' + (operator === '<>' ? 'selected="selected"' : '') + ' data-campo="' + campo + '">Diferente</option>\n\
                                    <option value=">" ' + (operator === '>' ? 'selected="selected"' : '') + ' data-campo="' + campo + '">Mayor</option>\n\
                                    <option value=">=" ' + (operator === '>=' ? 'selected="selected"' : '') + ' data-campo="' + campo + '">Mayor o igual</option>\n\
                                    <option value="<" ' + (operator === '<' ? 'selected="selected"' : '') + ' data-campo="' + campo + '">Menor</option>\n\
                                    <option value="<=" ' + (operator === '<=' ? 'selected="selected"' : '') + ' data-campo="' + campo + '">Menor o igual</option>\n\
                                    <option value="C" ' + (operator === 'C' ? 'selected="selected"' : '') + ' data-campo="' + campo + '">Comienza</option>\n\
                                    <option value="T" ' + (operator === 'T' ? 'selected="selected"' : '') + ' data-campo="' + campo + '">Termina</option>\n\
                                    <option value="LIKE" ' + (operator === 'LIKE' ? 'selected="selected"' : '') + ' data-campo="' + campo + '">Contiene</option>\n\
                                </select>');
                fContainer.append(fOperators1);
                /*combo con operadores 2 AND, OR*/
                var fOperators2 = $('<label></label>');
                fOperators2.attr('class', 'select');
                fOperators2.css({'margin-top': '5px', 'margin-bottom': '5px', width: '60px'});
                fOperators2.html('<select class="operator2" data-campo="' + campo + '">\n\
                                    <option value="AND" data-campo="' + campo + '">AND</option>\n\
                                    <option value="OR" data-campo="' + campo + '">OR</option>\n\
                                </select>');
                fContainer.append(fOperators2);
                /*combo con operadores 3*/
                var fOperators3 = $('<label></label>');
                fOperators3.attr('class', 'select');
                fOperators3.html('<select class="operator3" data-campo="' + campo + '">\n\
                                    <option value="=" data-campo="' + campo + '">Igual a</option>\n\
                                    <option value="<>" data-campo="' + campo + '">Diferente de</option>\n\
                                    <option value=">" data-campo="' + campo + '">Mayor a</option>\n\
                                    <option value=">=" data-campo="' + campo + '">Mayor o igual a</option>\n\
                                    <option value="<" data-campo="' + campo + '">Menor a</option>\n\
                                    <option value="<=" data-campo="' + campo + '">Menor o igual a</option>\n\
                                    <option value="C" data-campo="' + campo + '">Comienza con</option>\n\
                                    <option value="T" data-campo="' + campo + '">Termina con</option>\n\
                                    <option value="LIKE" data-campo="' + campo + '">Contiene a</option>\n\
                                </select>');
                fContainer.append(fOperators3);
                /*input de filtro 2*/
                var input2 = $('<label></label>');
                input2.attr('class', 'input');
                input2.css({'margin-top': '5px', 'margin-bottom': '5px'});
                input2.html('<input class="input2" type="text" data-campo="' + campo + '">');
                fContainer.append(input2);
                /*boton filtrar*/
                var btnFilter = $('<button></button>');
                btnFilter.attr('class', 'btn btn-default pull-left');
                btnFilter.html('Filtrar');
                btnFilter.css({padding: '5px'});
                fContainer.append(btnFilter);
                /*boton limpiar*/
                var btnClear = $('<button></button>');
                btnClear.attr('class', 'btn btn-default pull-right');
                btnClear.attr('data-campo', campo);
                btnClear.html('Limpiar');
                btnClear.css({padding: '5px'});
                fContainer.append(btnClear);

                fContMain.html(fContainer);

                return fContMain;
            };
            /*activar busqueda por columnas*/
            var searchColumns = function(oSettings) {
                var axf = 0;
                var tr = $('<tr></tr>');
                tr.attr('id', oSettings.tObjectTable + '_input_search');

                /*
                 * verificar si se agrega la numeracion
                 * NUMERACION
                 */
                if (oSettings.tNumeracion) {
                    var th = $('<td>&nbsp;</td>');         /*se crea la columna*/
                    th.css('width', '35px');
                    tr.append(th);                       /*se agrega al <tr>*/
                }

                /*
                 * verificar si se agrega acciones
                 * ACCIONES
                 */
                /*verificar si hay axions y es first*/
                if (oSettings.sPositionAxion.toLowerCase() === 'first' && oSettings.sAxions.length > 0) {
                    var td = $('<td></td>');
                    tr.append(td);
                }

                /*verificar si se agrega CHECKBOX y si esta en la posicion first*/
                if (oSettings.sCheckbox.start) {
                    var pos = (oSettings.sCheckbox.possition !== undefined) ? oSettings.sCheckbox.possition : 'first';

                    if (pos.toLowerCase() === 'first') {
                        var th = $('<td>&nbsp;</td>');
                        th.css({'width': '25px'});
                        tr.append(th);                       /*se agrega al <tr>*/
                        axf = 1;
                    }                    
                }

                /*recorrido de columnas*/
                for (var c in oSettings.tColumns) {
                    var fButton = '';               /*boton para busqueda avanzada*/
                    var th = $('<td></td>');         /*se crea la columna*/
                    th.css({position: 'relative'});

                    var campo = (oSettings.tColumns[c].campo !== undefined) ? oSettings.tColumns[c].campo : '';
                    var search = (oSettings.tColumns[c].search !== undefined) ? oSettings.tColumns[c].search : false;   /*para activar busqueda de columnas*/

                    /*activando busqueda de columnas*/
                    var lbInput = $('<label></label>');
                    lbInput.attr('class', 'input');
                    lbInput.css({width: '100%'});

                    /*se configuro search por columna*/
                    if (search instanceof Object) {
                        var tipo = (search.type !== undefined) ? search.type : 'text';          /*tipo de elemento*/
                        var operator = (search.operator !== undefined) ? search.operator : '='; /*para el where en sql*/
                        /*varifico si existe compare*/
                            if(search.compare !== undefined){
                                campo = search.compare; /*campo sera compare para sql*/
                            }
                            
                        var inputSearch;
                        /*validando type de pbjeto*/
                        switch (tipo.toLowerCase()) {
                            case 'text':
                                th.attr('data-elemento', tipo);         /*se agrega el tipo de elemento a la columna*/
                                inputSearch = $('<input></input>');
                                inputSearch.attr('type', 'text');
                                break;
                            case 'select':
                                var url = (search.url !== undefined) ? search.url : ''; /*para data de combo*/
                                var datax = (search.data !== undefined) ? search.data : [];          /*campos para select*/
                                var dataClient = (search.dataClient !== undefined) ? search.dataClient : [];          /*data desde el cliente*/
                                
                                th.attr('data-elemento', tipo);          /*se agrega el tipo de elemento a la columna*/
                                lbInput.attr('class', 'select');         /*se cambia class a <label>*/
                                operator = '=';                         /*en <select> operador es =*/

                                inputSearch = $('<select></select>');

                                /*options*/
                                var opt = $('<option></option>');
                                opt.attr('value', '');
                                opt.html('Todos...');

                                inputSearch.append(opt);

                                if(dataClient.length > 0){ /*datos desde el cliente*/
                                    var nn = dataClient.length;
                                    for (var x in dataClient) {
                                        /*VALIDACION SOLO PARA ERP UNI*/
                                        if(x < nn){
                                            var opt = $('<option></option>');
                                            opt.attr('value', dataClient[x].value);
                                            opt.html(dataClient[x].etiqueta);

                                            inputSearch.append(opt);
                                        }
                                    }
                                }else{ /*datos desde el servidor*/
                                    oSettings.boolAjax = true;               /*hay <select> q se cargaran via ajax*/
                                    /*agregar options segun data de query*/
                                    if (url === '') {
                                        alert('URL no definido');
                                    }
                                    $.ajax({
                                        url: url,
                                        dataType: 'json',
                                        data:{_lstData: datax,_campo: campo},       /*se envia configuracion de <select> porq la llamada es multiple*/
                                        success: function(data) {
                                            var nn = data.dataServer.length;
                                            for (var x in data.dataServer) {
                                                /*VALIDACION SOLO PARA ERP UNI*/
                                                if(x < nn){
                                                    var opt = $('<option></option>');
                                                    opt.attr('value', data.dataServer[x][data.params.value]);
                                                    opt.html(data.dataServer[x][data.params.etiqueta]);

                                                    $('#' + oSettings.tObjectTable + '_search_' + data.element).append(opt);
                                                }
                                            }
                                        }
                                    });
                                }
                                break;
                        }

                        inputSearch.attr('data-operator', operator);
                        inputSearch.attr('data-campo', campo);
                        inputSearch.attr('id', oSettings.tObjectTable + '_search_' + campo);

                        /*filtros avanzados*/
                        fButton = $('<div></div>');                     /*div que contiene filtro*/
                        /*para activar filtros avanzados*/
                        var had = 'hide';
                        if(oSettings.tFilterAdvanced){
                            had = '';
                        }
                        var btn = $('<button></button>');               /*boton filtro*/
                        btn.attr('type', 'button');
                        btn.attr('title','Filtros avanzados');
                        btn.attr('id', oSettings.tObjectTable + '_' + campo + '_btn_filter');
                        btn.html('<i class="'+oSettings.iconFilter+'"></i>');
                        btn.attr('class', 'btn btn-default bFilter '+had);
                        btn.attr('onclick', '$("#' + oSettings.tObjectTable + '_' + campo + '_cont_filter").toggle();');
                        btn.css({'padding': '6px','margin-top':'1px'});

                        fButton.append(btn);                              /*agrega boton a <div>*/
                        fButton.css({'position': 'absolute', top: '4px', right: '2px', 'z-index': 9});

                        /*se agrega los filtros*/
                        fButton.append(advancedFilters(oSettings, c));
                    } else {
                        var inputSearch = $('<span></span>');
                        inputSearch.html('&nbsp;');
                    }

                    lbInput.append(inputSearch);                                      /*se agrega al <label>*/
                    th.append(lbInput);                                                 /*se agrega al <th>*/
                    th.append(fButton);                                             /*se agrega boto filter a <th>*/
                    tr.append(th);                                                    /*se agrega al <tr>*/
                }

                /*verificar si se agrega CHECKBOX y si esta en la posicion last*/
                if (oSettings.sCheckbox.start) {
                    var pos = (oSettings.sCheckbox.possition !== undefined) ? oSettings.sCheckbox.possition : 'last';

                    if (pos.toLowerCase() === 'last' && axf === 0) {
                        var th = $('<td>&nbsp;</td>');
                        //th.css('width', '25px');
                        tr.append(th);                       /*se agrega al <tr>*/
                    }
                }

                /*verificar si se agrega acciones*/
                /*verificar si es last*/
                if (oSettings.sPositionAxion.toLowerCase() === 'last') {
                    var td = $('<td></td>');
                    tr.append(td);
                }
                $('#' + oSettings.tObjectTable).find('thead').append(tr);     /*se agrega al <thead>*/

                if (oSettings.tScrollY !== '') {
                    /**/
                } else {
                    /*si no tiene scroll Y se activa los filtros*/
                    addSearchCol(oSettings);
                }
            };
            /*renderizar columnas a exportar*/
            var columnsExport = function(oSettings){
                var exCol = (oSettings.sExport.columns !== undefined)?oSettings.sExport.columns:oSettings.tColumns;
                return exCol;
            };
            /*crear html a exportar*/
            var generateHtmlExport = function(data, oSettings,doc){
                var columns = columnsExport(oSettings);
                var caption = (oSettings.sExport.caption !== undefined) ? oSettings.sExport.caption : '';
                    //'+oSettings.tLogo+'
                var pag = '';
                if(doc === 'P'){
                    pag = '<div>{{page}}/{{totalPages}}</div>'; /*si es PDF mostrar paginacion*/
                }
                var tableEx = '<HEADER>'+pag+'</HEADER>';
                tableEx += '<table border="1">';
                tableEx += '<caption>'+normalize(caption)+'</caption>';
                tableEx += '<thead>';
                tableEx += '<tr>';

                tableEx += '<th>Nro.</th>';
                /*recorrido de columnas*/
                for (var c in columns) {
                    /*esta validacion es solo para ERP UNI*/
                    if(c < columns.length){
                        var title = (columns[c].title !== undefined) ? normalize(columns[c].title) : '';
                        tableEx += '<th>'+title+'</th>';
                    }
                }
                /*================================*/
                var lll = data.length,
                    n = 0;
                if (data.length) {
                    /*recorrido de los registros del server*/
                    for (var r in data) {
                        if(r < lll){
                            n++;
                            tableEx += '<tr>';
                            tableEx += '<td>'+n+'</td>';

                            var ncol = columns.length;
                            /*recorrido de columnas configuradas en js*/
                            for (var c in columns) {
                                /*esta validacion es solo para ERP UNI*/
                                if(c < ncol){
                                    var zell = (data[r][columns[c].campo] == null)? '': normalize(data[r][columns[c].campo]);
                                    tableEx += '<td>'+zell+'</td>';
                                }
                            }
                            tableEx += '</tr>';
                        }
                    }
                } else {
                    tableEx += '<tr>';
                    tableEx += '<td><div class="alert alert-info center"><i class="fa-info"></i> No se encontraron registros.<div></td>';
                    tableEx += '</tr>';
                }
                /*=================================*/
                tableEx += '<tr>';
                tableEx += '</thead>';
                tableEx += '</table>';
                return tableEx;
            };
            /*crear pdf con js*/
            var createJsPDF = function(oSettings,html){
                var pdf = new jsPDF('l', 'mm', [ 841.89,  595.28])
                    , source = html
                // we support special element handlers. Register them with jQuery-style
                // ID selector for either ID or node name. ("#iAmID", "div", "span" etc.)
                // There is no support for any other type of selectors
                // (class, of compound) at this time.
                    , specialElementHandlers = {

                    },
                margins = {
                    top: 10,
                    bottom: 10,
                    left: 30,
                    width: 1700
                };

                //pdf.addImage(oSettings.tLogo, 'png', 15, 10, 200, 70);
                // all coords and widths are in jsPDF instance's declared units
                // 'inches' in this case
                pdf.fromHTML(
                    source // HTML string or DOM elem ref.
                    , margins.left // x coord
                    , margins.top // y coord
                    , {
                        'width': margins.width // max width of content on PDF
                        , 'elementHandlers': specialElementHandlers
                    },
                    function(dispose) {
                        // dispose: object with X, Y of the last line add to the PDF
                        //          this allow the insertion of new lines after html
                        $.each(pdf.internal.pages, function (index, value) {
                            if (value) {
                                $.each(value, function (innerIndex, innerValue) {
                                    var continueAfterThis = true;
                                    if (innerValue.indexOf('{{page}}') > -1) {
                                        //value[innerIndex] = innerValue.replace('{{{logo}}}',oSettings.tLogo);
                                        //pdf.internal.addImage(oSettings.tLogo, 'png', 15, 10, 200, 80);
                                        continueAfterThis = false;
                                    }
                                    return continueAfterThis;
                                });
                                $.each(value, function (innerIndex, innerValue) {
                                    var continueAfterThis = true;
                                    if (innerValue.indexOf('{{totalPages}}') > -1) {
                                        value[innerIndex] = innerValue.replace('{{totalPages}}', pdf.internal.getNumberOfPages);
                                        continueAfterThis = false;
                                    }
                                    return continueAfterThis;
                                });
                                $.each(value, function (innerIndex, innerValue) {
                                    var continueAfterThis = true;
                                    if (innerValue.indexOf('{{page}}') > -1) {
                                        value[innerIndex] = innerValue.replace('{{page}}', index);
                                        continueAfterThis = false;
                                    }
                                    return continueAfterThis;
                                });
                            }
                        });
                        pdf.save('ExportPDF.pdf');
                    },
                    margins
                );
            };
            /*data desde server para exportar*/
            var ajaxExport = function(oSettings,params,doc){
                $('#' + oSettings.tObjectTable + '_loadingGrid').removeClass('hide');
                $.ajax({
                    type: "POST",
                    data: params+'&sExport=1',
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
                                alert(msn)
                            }
                        }

                        /*generar html*/
                        var html = generateHtmlExport(data, oSettings);

                        switch(doc.toString()){
                            case 'E':/*a excel*/
                                window.open('data:application/vnd.ms-excel,' + encodeURIComponent(html));
                                break;
                            case 'P':/*a PDF*/
                                createJsPDF(oSettings,html);
                                break;
                        }

                        $('#' + oSettings.tObjectTable + '_loadingGrid').addClass('hide');

                    }
                });
            };
            /*crear botones para exportar*/
            var addButtonsExport = function(oSettings,params){
                var btnExcelt = (oSettings.sExport.buttons.excel !== undefined)?oSettings.sExport.buttons.excel:false;   /*boton excel*/
                var btnPDFt = (oSettings.sExport.buttons.pdf !== undefined)?oSettings.sExport.buttons.pdf:false;         /*boton pdf*/

                /*si al menos existe un boton agregar botones*/
                if(btnExcelt || btnPDFt){
                    /*EXCEL*/
                    if(btnExcelt){
                        $('#'+oSettings.tObjectTable+'_btn_excel').remove();

                        var btnExcel = $('<button></button>');
                        btnExcel.attr('class','btn btn-default');
                        btnExcel.attr('id',oSettings.tObjectTable+'_btn_excel');
                        btnExcel.html('<i class="icon-file"></i> Excel');
                        btnExcel.click(function(){
                            ajaxExport(oSettings,params,'E');
                        });

                        $('#'+oSettings.tObjectTable+'_tools').find('div:eq(1)').append(btnExcel);
                    }
                    /*PDF*/
                    if(btnPDFt){
                        $('#'+oSettings.tObjectTable+'_btn_pdf').remove();

                        var btnPDF = $('<button></button>');
                        btnPDF.attr('class','btn btn-default');
                        btnPDF.attr('id',oSettings.tObjectTable+'_btn_pdf');
                        btnPDF.html('<i class="icon-file"></i> PDF');
                        btnPDF.click(function(){
                            ajaxExport(oSettings,params,'P');
                        });

                        $('#'+oSettings.tObjectTable+'_tools').find('div:eq(1)').append(btnPDF);
                    }
                }
            };
            
            return this.each(function() {

                var oSettings = options;
                /*
                *Otros atributon internos del grid
                */
                oSettings.iconFilter = 'fa fa-filter';       /*css de boton filter en columnas*/
                oSettings.btnFirst = 'fa fa-fast-backward ',
                oSettings.btnPrev = 'fa fa-backward';
                oSettings.btnNext = 'fa fa-forward';
                oSettings.btnLast = 'fa fa-fast-forward';
                oSettings.boolAjax = false;               /*para saber si <select> se cargaran via ajax*/
                oSettings.tLogo = '<img src="img/logo_institucion.png" width="100" height="35">';// 'data:image/png;base64,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';/*logo para cabecera*/
                /*
                 * METODOS CALLBACK
                 */
                /*borrar una fila <tr>*/
                oSettings.fnDeleteRow = function(i) {
                    $('#' + oSettings.tObjectTable).find('tbody').find('tr').each(function(index) {
                        if (index === i) {
                            $(this).remove();
                            /*si existe numeracion se reordena los numeros*/
                            if (oSettings.tNumeracion) {
                                reNumeracion(oSettings);
                            }
                        }
                    });
                };
                /*onclick en <tr>*/
                oSettings.fnClickRow = function(fn) {
                    var objTd = [];
                    $('#' + oSettings.tObjectTable).find('tbody').find('tr').each(function(index) {
                        $(this).click(function() {
                            /*recorrer <td>*/
                            $(this).find('td').each(function() {
                                var c = $.trim($(this).html());
                                objTd.push(c);
                            });
                            fn(objTd);
                        });
                    });
                };
                /*return data de <table>*/
                oSettings.fnGetData = function(fn) {
                    var objTr = [];
                    $('#' + oSettings.tObjectTable).find('tbody').find('tr').each(function(index) {
                        var objTd = [];
                        /*recorrer <td>*/
                        $(this).find('td').each(function() {
                            var c = $.trim($(this).html());
                            objTd.push(c);
                        });
                        objTr.push(objTd);
                    });
                    fn(objTr);
                };
                /*para actualizar filas*/
                oSettings.fnUpdate = (function(obj, i) {
                    $('#' + oSettings.tObjectTable).find('tbody').find('tr').each(function(index) {
                        if (index === i) {
                            /*recorrer <td>*/
                            $(this).find('td').each(function(ii) {
                                /*se recorre data obj*/
                                for (var k in obj) {
                                    if (parseInt(k) === parseInt(ii)) {
                                        $(this).html(obj[k]);
                                    }
                                }
                            });
                        }
                    });
                });
                /*para hacer cambios en info*/
                var nFoot = oSettings.tObjectTable + '_info';
                oSettings.fnFooterCallback = function(fn) {
                    fn(nFoot, oSettings.data, oSettings.iStart, oSettings.iEnd, oSettings.sTotal);
                };
                /*color a un <tr>*/
                oSettings.fnStyleRow = function(obj, style) {
                    var txtCompare2;
                    $('#' + oSettings.tObjectTable).find('tbody').find('tr').each(function(index) {
                        var txtCompare1 = '', txtCompare2 = '';
                        ;
                        /*se concatena dato a comparar*/
                        /*se recorre data obj*/
                        for (var k in obj) {
                            txtCompare1 += obj[k]; /*dato a comparar*/
                        }
                        /*recorrer <td>*/
                        $(this).find('td').each(function(ii) {
                            /*se recorre data obj*/
                            for (var kk in obj) {
                                if (parseInt(ii) === parseInt(kk)) {
                                    txtCompare2 += $(this).html(); /*dato a comparar*/
                                }
                            }

                        });

                        if (txtCompare1 === txtCompare2) {
                            /*busco tr con indice index y agregar style*/
                            $('#' + oSettings.tObjectTable).find('tbody').find('tr').each(function(indice) {
                                if (index === indice) {
                                    $(this).find('td').css(style);
                                }
                            });
                        }
                    });
                };
                /*renumeracion de numeros, publico*/
                oSettings.fnDrawNumber = function(oSettings) {
                    reNumeracion(oSettings);
                };

                $.method = {
                    /*marcar/desmarcar los checks de grid*/
                    checkAll: function(el,tab){
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
                    },
                    /*ordenamiento por columnas*/
                    sorting: function(tthis, oSettings) {
                        var thId = $(tthis).attr('id'),
                                orienta;
                        var cad = thId.split('_');

                        oSettings.tOrderField = $('#' + thId).attr('data-order');
                        var _grid = cad[0];

                        /*se coloca el head en .sorting*/
                        if (_tmpTH !== thId) {
                            $('#' + _grid).find('thead').find('tr').find('th').removeClass('sorting_asc');
                            $('#' + _grid).find('thead').find('tr').find('th').removeClass('sorting_desc');
                            $('#' + _grid).find('thead').find('tr').find('th').addClass('sorting');

                            $('#' + _grid + '_head').find('thead').find('tr').find('th').removeClass('sorting_asc');
                            $('#' + _grid + '_head').find('thead').find('tr').find('th').removeClass('sorting_desc');
                            $('#' + _grid + '_head').find('thead').find('tr').find('th').addClass('sorting');
                        }

                        if ($('#' + thId).is('.sorting')) {                /*ordenacion ascendente*/
                            $('#' + thId).removeClass('sorting');
                            $('#' + thId).addClass('sorting_asc');
                            orienta = ' ASC';
                        } else if ($('#' + thId).is('.sorting_desc')) {     /*ordenacion descendente*/
                            $('#' + thId).removeClass('sorting_desc');
                            $('#' + thId).addClass('sorting_asc');
                            orienta = ' ASC';
                        } else if ($('#' + thId).is('.sorting_asc')) {      /*ordenacion ascendente*/
                            $('#' + thId).removeClass('sorting_asc');
                            $('#' + thId).addClass('sorting_desc');
                            orienta = ' DESC';
                        }

                        oSettings.tOrderField += orienta;
                        oSettings.pDisplayLength = $('#' + _grid + '_cbLength').val();
                        oSettings.tObjectTable = _grid;
                        oSettings.pDisplayStart = parseInt($('#' + _grid + '_paginate').find('ul.pagination').find('li.active').find('a').html()) - 1;

                        $.method.sendAjax(oSettings);
                        _tmpTH = thId;
                        noOrderNro(oSettings);
                    },
                    /*serialisa datos que van al server*/
                    serialize: function() {
                        var data = '';
                        for (var i in _aData) {
                            data += _aData[i].name + '=' + _aData[i].value + '&';
                        }
                        _aData = [];
                        data = data.substring(0, data.length - 1);
                        return data;
                    },
                    /*parametros desde el servidor*/
                    paramServer: function(params, data) {
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
                    },
                    /*parametros desde el cliente*/
                    paramClient: function(params) {
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
                    },
                    /*crea el header*/
                    theader: function() {
                        var h = $('<thead></thead>'),
                                tr = $('<tr></tr>'),
                                defaultOrder,
                                cad,
                                axf = 0;                /*para validar q chk ya se inicio*/

                        /*
                         * verificar si se agrega la numeracion
                         * NUMERACION
                         */
                        if (oSettings.tNumeracion) {
                            var th = $('<th>Nro.</th>');         /*se crea la columna*/
                            th.attr('class', 'center');
                            th.css('width', '35px');
                            tr.append(th);                       /*se agrega al <tr>*/
                        }

                        /*
                         * verificar si se agrega acciones
                         * ACCIONES
                         */
                        /*verificar si es first*/
                        if (oSettings.sPositionAxion.toLowerCase() === 'first') {
                            tr.append(headAxionText(oSettings));
                        }

                        /*verificar si se agrega CHECKBOX y si esta en la posicion first*/
                        if (oSettings.sCheckbox.start) {
                            var pos = (oSettings.sCheckbox.possition !== undefined) ? oSettings.sCheckbox.possition : 'first';

                            if (pos.toLowerCase() === 'first') {
                                var th = $('<th></th>');
                                th.html('<input type="checkbox" onclick="$.method.checkAll(this,\'#' + oSettings.tObjectTable + '\')">');
                                th.attr('class', 'center');
                                th.attr('id', oSettings.tObjectTable + '_chkall_0');
                                th.css({'width': '25px', 'margin': '0px'});
                                tr.append(th);                       /*se agrega al <tr>*/
                                axf = 1;
                            }                            
                        }

                        /*recorrido de columnas*/
                        for (var c in oSettings.tColumns) {
                            var th = $('<th></th>');         /*se crea la columna*/

                            var title = (oSettings.tColumns[c].title !== undefined) ? oSettings.tColumns[c].title : '';
                            var campo = (oSettings.tColumns[c].campo !== undefined) ? oSettings.tColumns[c].campo : '';
                            var sortable = (oSettings.tColumns[c].sortable !== undefined) ? ' sorting' : '';
                            var width = (oSettings.tColumns[c].width !== undefined) ? oSettings.tColumns[c].width + oSettings.tWidthFormat : '';
                            var search = (oSettings.tColumns[c].search !== undefined) ? oSettings.tColumns[c].search : false;   /*para activar busqueda de columnas*/
                            var pointer = '';

                            if (sortable !== '') {
                                pointer = ' pointer';
                                th.attr('data-order', campo);
                            }
                            /*verificar si se inicio ordenamiento y agegar class a th*/
                            cad = oSettings.tOrderField.split(' ');
                            defaultOrder = '';
                            if (cad[0] === campo) {
                                defaultOrder = ' sorting_' + cad[1];
                            }
                            /*activando busqueda de columnas*/
                            if (search) {
                                _searchOk = true;
                            }
                            th.attr('id', oSettings.tObjectTable + '_head_th_' + c);
                            th.attr('class', 'center' + sortable + pointer + defaultOrder);        /*agregado class css*/
                            th.css({width: width, 'vertical-align': 'middle'});                                          /*agregando width de columna*/
                            th.append(title);                                                 /*se agrega el titulo*/

                            tr.append(th);                                                  /*se agrega al <tr>*/
                        }

                        /*verificar si se agrega CHECKBOX y si esta en la posicion last*/
                        if (oSettings.sCheckbox.start) {
                            var pos = (oSettings.sCheckbox.possition !== undefined) ? oSettings.sCheckbox.possition : 'last';

                            if (pos.toLowerCase() === 'last' && axf === 0) {
                                var th = $('<th></th>');
                                th.attr('class', 'center');
                                th.css('width', '25px');
                                th.html('<input type="checkbox" onclick="$.method.checkAll(this,\'#' + oSettings.tObjectTable + '\')">');
                                tr.append(th);                       /*se agrega al <tr>*/
                            }
                        }

                        /*verificar si se agrega acciones*/
                        /*verificar si es last*/
                        if (oSettings.sPositionAxion.toLowerCase() === 'last') {
                            tr.append(headAxionText(oSettings));
                        }

                        h.html(tr);                 /*se agrega al <thead>*/
                        $('#' + oSettings.tObjectTable).append(h);     /*se agrega al <table>*/

                        /*verificar si tiene botones*/
                        var btns = $('#' + oSettings.tObjectTable + '_btns').length;

                        /*si tiene botones o filter o exportar agregar tools para botones*/
                        if (oSettings.tFilter || btns || oSettings.sExport !== undefined) {
                            /*contenedor de filter y botones*/
                            var contTools = $('<div id="' + oSettings.tObjectTable + '_tools" class="dt-row dt-bottom-row borderTools"></div>');
                            $(contTools).insertBefore('#' + oSettings.tObjectTable + '_main');

                            /*renderizar botones*/
                            renderButtons(oSettings);
                        }

                        /*si no existe scrool activar sorting*/
                        if (oSettings.tScrollY === '') {
                            addSorting(oSettings);
                        }
                        /*activando busquedas por columna*/
                        if (_searchOk) {
                            searchColumns(oSettings);
                        }
                    },
                    /*onchange pata combo length*/
                    cbChange: function(oSettings) {
                        var oSett = oSettings;
                        oSett.pDisplayStart = 0;
                        oSett.pDisplayLength = $('#' + oSett.tObjectTable + '_cbLength').val();
                        $.method.sendAjax(oSett);
                    },
                    /*crea combo lenght*/
                    cbLength: function(oSettings) {
                        var cbCl = '';
                        if (oSettings.tChangeLength) {
                            cbCl = $('<div></div>');
                            cbCl.attr('id', oSettings.tObjectTable + '_contCbLength');
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
                            span.html(label);            /*se agrega label a span*/
                            cbCl.html(span);            /*se agrega span a cbCl*/
                        }
                        return cbCl;
                    },
                    /*crear los registros*/
                    records: function(data, oSettings) {
                        var tbody = $('<tbody></tbody>');
                        var n = oSettings.pDisplayStart * oSettings.pDisplayLength;     /*para la numeracion*/
                        var classort;
                        var axf = 0;                                /*para validar q chk ya se inicio*/
                        var lll = data.length;
                        
                        if (data.length) {
                            oSettings.sTotal = data[0].total;     /*total de registros*/
                            /*recorrido de los registros del server*/
                            for (var r in data) {
                                if(r < lll){
                                    n++;
                                    var tr = $('<tr></tr>');        /*se crea el tr*/

                                    /*verificar si se agrega la numeracion*/
                                    if (oSettings.tNumeracion) {
                                        var td = $('<td></td>');         /*se crea la columna*/
                                        td.html(n);
                                        td.css('width', '35px');
                                        td.attr('data-render', '0');
                                        tr.append(td);                   /*se agrega al <tr>*/
                                    }

                                    /*verificar si se agrega ACCIONES*/
                                    /*verificar si es first*/
                                    if (oSettings.sPositionAxion.toLowerCase() === 'first') {
                                        tr.append(axionButtons(r, data, oSettings));
                                    }

                                    /*verificar si se agrega CHECKBOX y si esta en la posicion first*/
                                    if (oSettings.sCheckbox.start) {
                                        var pos = (oSettings.sCheckbox.possition !== undefined) ? oSettings.sCheckbox.possition : 'first';

                                        if (pos.toLowerCase() === 'first') {
                                            tr.append(createCheckbox(oSettings, data, r));        /*se agrega al <tr>*/
                                            axf = 1;
                                        }
                                    }

                                    /*recorrido de columnas configuradas en js*/
                                    for (var c in oSettings.tColumns) {
                                        var width = (oSettings.tColumns[c].width !== undefined) ? oSettings.tColumns[c].width + oSettings.tWidthFormat : '';
                                        var klass = (oSettings.tColumns[c].class !== undefined) ? oSettings.tColumns[c].class : '';    /*clase css*/                                /*clase css para <td>*/
                                        /*parametros para ajax*/
                                        var ajax = (oSettings.tColumns[c].ajax !== undefined) ? oSettings.tColumns[c].ajax : '';       /*ajax para <td>*/
                                        var fn = '';
                                        var flag = '';
                                        var clientParams = '';
                                        var serverParams = '';
                                        if (ajax) {
                                            fn = (ajax.fn !== undefined) ? ajax.fn : '';                                /*funcion ajax*/
                                            flag = (ajax.flag !== undefined) ? ajax.flag : '';                          /*flag de la funcion*/
                                            clientParams = (ajax.clientParams !== undefined) ? ajax.clientParams : '';  /*parametros desde el cliente*/
                                            serverParams = (ajax.serverParams !== undefined) ? ajax.serverParams : '';  /*parametros desde el servidor*/
                                        }

                                        var td = $('<td></td>');    /*se crea el td*/

                                        var texto = data[r][oSettings.tColumns[c].campo];
                                        /*agregando ajax*/
                                        if (fn) {
                                            var xparams = '';

                                            /*validar flag para agregar como parametro*/
                                            if (flag) {
                                                xparams = flag + ',';
                                            }
                                            /*parametros de servidor*/
                                            xparams += this.paramServer(serverParams, data[r]);
                                            /*parametros de cliente*/
                                            xparams += this.paramClient(clientParams);

                                            xparams = xparams.substring(0, xparams.length - 1);
                                            fn = fn + '(' + xparams + ')';
                                            texto = '<a href="javascript:;" onclick="' + fn + '">' + texto + '</a>';
                                        }
                                        td.html(texto);
                                        /*verificar si se ordena para marcar*/
                                        classort = cebraCol(r, oSettings.tOrderField, oSettings.tColumns[c].campo);

                                        td.attr('class', klass + classort);        /*agregado class css*/
                                        td.attr({width:width});
                                        tr.append(td);                          /*se agrega al <tr>*/
                                    }

                                    /*verificar si se agrega CHECKBOX y si esta en la posicion first*/
                                    if (oSettings.sCheckbox.start) {
                                        var pos = (oSettings.sCheckbox.possition !== undefined) ? oSettings.sCheckbox.possition : 'last';

                                        if (pos.toLowerCase() === 'last' && axf === 0) {
                                            tr.append(createCheckbox(oSettings, data, r));        /*se agrega al <tr>*/
                                        }
                                    }

                                    /*verificar si se agrega acciones*/
                                    /*verificar si es first*/
                                    if (oSettings.sPositionAxion.toLowerCase() === 'last') {
                                        tr.append(axionButtons(r, data, oSettings));
                                    }
                                    tbody.append(tr);                           /*se agrega al <tbody>*/
                                }
                            }
                        } else {
                            oSettings.sTotal = 0;     /*total de registros*/
                            var tr = $('<tr></tr>');        /*se crea el tr*/
                            var td = $('<td></td>');         /*se crea la columna*/
                            td.html('<div class="alert alert-info center"><i class="fa-info"></i> No se encontraron registros.<div>');

                            tr.append(td);                          /*se agrega al <tr>*/
                            tbody.append(tr);                           /*se agrega al <tbody>*/
                        }
                        $('#' + oSettings.tObjectTable).find('tbody').remove();
                        $('#' + oSettings.tObjectTable).append(tbody);     /*se agrega al <table>*/
                    },
                    /*crear paginacion*/
                    pagination: function(data, oSettings) {
                        var total = oSettings.sTotal;
                        var start = oSettings.pDisplayStart;
                        var length = oSettings.pDisplayLength;

                        var paginaActual = start + 1;
                        var numPaginas = Math.ceil(total / length);     /*determinando el numero de paginas*/
                        var itemPag = Math.ceil(oSettings.pItemPaginas / 2);

                        var pagInicio = (paginaActual - itemPag);
                        var pagInicio = (pagInicio <= 0 ? 1 : pagInicio);
                        var pagFinal = (pagInicio + (oSettings.pItemPaginas - 1));
                        var click = '';

                        var trIni = ((paginaActual * length) - length) + 1;
                        var trFin = (paginaActual * length);

                        var cantRreg = trFin - (trFin - data.length);
                        var trFinOk = (cantRreg < length) ? (cantRreg === total) ? cantRreg : (parseInt(trFin) - (parseInt(length) - parseInt(cantRreg))) : trFin;

                        oSettings.pDisplayStart = paginaActual - 1;   /*para boton actualizar*/

//                        /*crear paginador content*/
//                        var cPag = $('<div></div>');
//                        cPag.attr('id',oSettings.tObjectTable+'_paginate');
//                        cPag.attr('class','dt-row dt-bottom-row top-pagin');

                        /*se crea div row*/
                        var cRow = $('<div></div>');
                        cRow.attr('class', 'row');

                        /*se crea div col-sm-6 para info y btn actualizar*/
                        var cInfoUp = $('<div></div>');
                        cInfoUp.attr('class', 'col-sm-6');

                        $(cRow).append(cInfoUp);            /*se agrega cInfoUp a div cRow*/

                        /*se verifica si la info se visualizara*/
                        if (oSettings.pInfo) {
                            oSettings.iStart = trIni;
                            oSettings.iEnd = trFinOk;
                            /*se crea div _info*/
                            var cInfo = $('<div></div>');
                            cInfo.attr('class', 'dataTables_info pull-left mr5');
                            cInfo.attr('id', oSettings.tObjectTable + '_info');
                            cInfo.html(trIni + ' al ' + trFinOk + ' de ' + total);

                            $(cInfoUp).append(cInfo);           /*se agrega cInfo dentro de div cInfoUp*/

                            var cb = this.cbLength(oSettings);
                            $(cInfoUp).append(cb);                /*se agrega combo cb a cInfoUp*/

                            /*creando boton update*/
                            var btnUp = $('<button></button>');
                            btnUp.attr('type', 'button');
                            btnUp.attr('id', oSettings.tObjectTable + '_btn_update');
                            btnUp.attr('class', 'btn btn-primary mr5');
                            btnUp.attr('title', 'Actualizar');
                            btnUp.html('<i class="fa fa-refresh"></i>');

                            $(cInfoUp).append(btnUp);           /*se garega btnUp a cInfoUp*/

                            /*creando img loadding*/
//                            var imgL = $('<img></img>');
//                            imgL.attr('id', oSettings.tObjectTable + '_loadingGrid');
//                            imgL.attr('class', 'hide');
//                            imgL.attr('src', 'public/img/spinner-mini.gif');
//
//                            $(cInfoUp).append(imgL);           /*se garega imgL a cInfoUp*/
                        }

                        if (oSettings.pPaginate) {
                            /*se crea div paginador*/
                            var cDivPagin = $('<div></div>');
                            cDivPagin.attr('class', 'col-sm-6 text-right');

                            /*se crea div dataTables_paginate*/
                            var cDivTablePagin = $('<div></div>');
                            cDivTablePagin.attr('class', 'dataTables_paginate');

                            /*se crea el <ul>*/
                            var ul = $('<ul></ul>');
                            ul.attr('class', 'pagination');
                            ul.attr('id', oSettings.tObjectTable + '_ul_paginas');

                            /*INICIO BOTONES PRIMERO Y ANTERIOR*/
                            liFirstPrev(ul, oSettings, paginaActual);

                            /*INICIO FOR PARA LA NUMERACION*/
                            for (var i = pagInicio; i <= pagFinal; i++) {
                                if (i <= numPaginas) {
                                    /*se crea <li> para numeros de paginas*/
                                    var liNumero = $('<li></li>');
                                    /*se crea <a> anterior*/
                                    var aNumero = $('<a></a>');
                                    aNumero.attr('href', 'javascript:;');
                                    aNumero.html(i);

                                    if (i === paginaActual) {
                                        liNumero.attr('class', 'num active');
                                    } else {
                                        liNumero.attr('class', 'num');
                                    }

                                    $(liNumero).html(aNumero);                /*aNumero dentro de liNumero*/
                                    $(ul).append(liNumero);                  /*liNumero dentro de ul*/
                                } else {
                                    break;
                                }
                            }
                            /*FIN FOR PARA LA NUMERACION*/

                            /*BOTONES ULTIMO Y SIGUIENTE*/
                            liLastNext(ul, oSettings, paginaActual, numPaginas);

                            cDivTablePagin.html(ul);                /*ul dentro de cDivTablePagin*/
                            cDivPagin.html(cDivTablePagin);         /*cDivTablePagin es html de cDivPagin*/
                            $(cRow).append(cDivPagin);           /*se agrega cDivPagin dentro de cRow*/
                        }

                        //cPag.html(cRow);            /*se agrega row a cPag*/
                        $('#' + oSettings.tObjectTable + '_paginate').html(cRow);            /*se agrega row a cPag*/

                        //$('#'+oSettings.tObjectTable+'_paginate').remove();
//                        $(cPag).insertAfter('#'+oSettings.tObjectTable+'_main');

                        /*agregando eventos para paginacion*/
                        $('#' + oSettings.tObjectTable + '_ul_paginas').find('li').each(function() {
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
                                    $('#' + oSettings.tObjectTable + '_btn_update').click(function() {
                                        oSettings.pDisplayStart = numero - 1;
                                        $.method.sendAjax(oSettings);
                                    });
                                }
                            }
                        });

                    },
                    ini: function() {
                        _s = 1;
                        
                        if(oSettings.tReload){
                            /*se crea el main*/
                            mainTable(oSettings);
                        }
                        /*si existe columnas se genera el header, y ademas es reload = true*/
                        if (oSettings.tColumns.length && oSettings.tReload) {
                            $.method.theader(oSettings);
                        }
                        /*se valida se data sera via ajax*/
                        if (oSettings.ajaxSource) {
                            this.sendAjax(oSettings);
                        }
                        if(oSettings.tReload){
                            /*se verifica si se genera el filter*/
                            if (oSettings.tFilter) {
                                inputFilter(oSettings);
                            }
                            /*crear paginador content*/
                            var cPag = $('<div></div>');
                            cPag.attr('id', oSettings.tObjectTable + '_paginate');
                            cPag.attr('class', 'dt-row dt-bottom-row top-pagin');

                            $(cPag).insertAfter('#' + oSettings.tObjectTable + '_main');
                        }
                    },
                    sendAjax: function(oSettings) {
                        var _Grid = oSettings.tObjectTable;
                        //$('#' + _Grid + '_loadingGrid').removeClass('hide');
                        $('#' + _Grid + '_btn_update').html('<img src="public/img/spinner-mini.gif">').attr('disabled',true);

                        /*configurando limit inferior*/
                        var limit0 = limitInferior(oSettings);
                        
                        /*para enviar parametros al server*/
                        if(oSettings.fnServerParams !== undefined){ oSettings.fnServerParams(_aData); }
                        
                        _aData.push({name: 'pDisplayStart', value: limit0});
                        _aData.push({name: 'pDisplayLength', value: oSettings.pDisplayLength});
                        _aData.push({name: 'pOrder', value: oSettings.tOrderField});
                        _aData.push({name: 'pSearch', value: oSettings.tSearch});
                        _aData.push({name: 'sFilterCols', value: axAjax.stringPost(oSettings.sFilterCols)});

                        /*serializacion de datos*/
                        var datosx = this.serialize();

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

                                /*generar registros*/
                                $.method.records(data, oSettings);

                                /*generar paginacion*/
                                $.method.pagination(data, oSettings);

                                if (_s === 1 && oSettings.tReload) {
                                    /*se activa scrool*/
                                    scroolYY(oSettings);
                                }
                                _s++;

                                /*se ejecuta callback*/
                                if (oSettings.fnCallback !== 0) {//si existe callback
                                    var callback = oSettings.fnCallback;
                                    oSettings.data = data;

                                    callback(oSettings);

                                }

                                //$('#' + _Grid + '_loadingGrid').addClass('hide');
                                
                                /*si se activo scrool renderizar header*/
//                                if (oSettings.tScrollY !== '') {
//                                    resizeHeader(oSettings);
//                                }
                            }
                        });
                        
                        /*validar si se exporte*/
                        if(oSettings.sExport !== undefined){
                            /*se agrega botones para exportar*/
                            addButtonsExport(oSettings,datosx);
                        }
                    }

                };

                $.method.ini();

            });
        }

    });

})(jQuery);