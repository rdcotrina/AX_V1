/*
 * Documento   : dataGrid.jquery.js v.2.0 .. . heredado desde simpleGrid
 * Creado      : noviembre-2014
 * Heredado    : mayo 2015
 * Autor       : RD
 * Descripcion : data grid -- TABLE_SCROOL_HV
 */
(function($) {
    
    "use strict";
    
    var COUNT_EXE_SCROLL    = [];       /*almacena cuantas veces se ejecuta el srcoll por cada grid*/
    
    var FIELDS              = [];       /*almacena los campos, para ocultar los filtros de cada columna*/
    
    var DATA_SELECT         = [];       /*almacena los datos de un <select> via ajax o cliente*/
    
    var TH_TMP              = null;     /*para detectar a q columna no se reiniciara los css de sorting*/
    
    $.fn.extend({
        
        dataGrid: function(opt){
            
            var defaults = {
                tObjectContainer: $(this).attr('id'),               /*identificador del contenedor de la grilla*/
                tObjectTable: null,                                 /*identificador de la grilla*/
                tWidthFormat: 'px',                                 /*para dimension de columnas*/
                tChangeLength: true,                                /*activa combo de registros a mostrar por pagina*/
                tRegsLength: [10, 25, 50, 100],                     /*para numero de registros por pagina*/
                tColumns: [],                                       /*columnas del header*/
                tMsnNoData: 'No se encontraron registros.',
                tNumbers: true,                                     /*para mostrar la numeracion*/
                sAjaxSource: null,                                  /*url para la data via ajax*/
                pPaginate: true,
                pDisplayStart: 0,
                pDisplayLength: 50,
                pItemPaginas: 5,
                pOrderField: '',                                    /*para el order ASC o DESC*/
                sAxions: [],                                        /*acciones del grid*/
                               
            };
            
            var options = $.extend(defaults, opt);
            
            var _private = {};
            
            _private.cssTable       = 'table table-striped table-hover table-condensed dataTable table-bordered dataGrid';
                    
            _private.positionAxion  = 'last';                           /*posicion de las acciones*/
            
            _private.btnFirst       = 'fa fa-fast-backward';
            
            _private.btnPrev        = 'fa fa-backward';
            
            _private.btnNext        =  'fa fa-forward';
            
            _private.btnLast        = 'fa fa-fast-forward';
                
            _private.iniInfo        = 0;
            
            _private.finInfo        = 0;
            
            _private.totalInfo      = 0;
            
            _private.colspanRecords = 0;
            
            _private.ifSearch       = false;
            
            _private.ifDatePicker   = false;
            
            _private.ifTimePicker   = false;
            
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
             * Obtener el operador
             * @param {type} o
             * @returns {dataGrid.jquery_L8.dataGrid.jqueryAnonym$0.dataGrid._private.operator.dataGrid.jqueryAnonym$7}
             */
            _private.operator = function(o) {
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
            
            /*
             * Ejecuta la busqueda mediante los filtros
             * @param {type} oSettings
             * @returns {undefined}
             */
            _private.executeFilter = function(oSettings){
                var searchTxt = '';
                $('#' + oSettings.tObjectTable).find('thead').find('tr:eq(1)').find('th').each(function() {
                    var filter1 = $(this).find('div:eq(0)').find('input, select');
                    var field = filter1.attr('field');
                    
                    if(field !== undefined){
                        var div2 = $(this).find('#cont_filter_'+oSettings.tObjectTable+'_'+field);
                        
                        var operator1 = div2.find('.operador1').val();
                        var operator2 = div2.find('.operador2').val();
                        var operator3 = div2.find('.operador3').val();
                        var filter2   = div2.find('.filter2').val();
                        var campo = field;
                       
                        /* = <> > >= < <= C T LIKE */
                        /*valor de primer filtro tiene contenido*/
                        if (filter1.val() !== '') {
                            var oA = _private.operator(operator1);
                            /*verificar si hay AND o OR*/
                            if (filter2 !== '') {
                                var oB = _private.operator(operator3);

                                searchTxt += ' AND (' + campo + ' ' + oA.c + ' "' + oA.a + filter1.val() + oA.b + '" ' + operator2 + ' ' + campo + ' ' + oB.c + ' "' + oB.a + filter2 + oB.b + '")';
                            } else {
                                searchTxt += ' AND ' + campo + ' ' + oA.c + ' "' + oA.a + filter1.val() + oA.b + '"';
                            }
                        }
                    }
                    $(this).find('.main-filter').css({display: 'none'});
                });
             
                oSettings.pFilterCols = searchTxt;
                oSettings.pDisplayStart = 0;
                $.method.sendAjax(oSettings);
            };
            
            /*
             * Limpia la busqueda, reset
             * @param {type} oSettings
             * @returns {undefined}
             */
            _private.clearFilter = function(oSettings){
                $('#' + oSettings.tObjectTable).find('thead').find('tr:eq(1)').find('th').each(function() {
                    $(this).find('div').find('input, .filter1, .filter2').val('');
                    $(this).find('.main-filter').css({display: 'none'});
                });
                
                oSettings.pFilterCols = '';
                oSettings.pDisplayStart = 0;
                $.method.sendAjax(oSettings);
            };
            
            /*
             * Crea los filtros y condiciones q se visualizaran al pulsar el icono: FILTRO
             * @param {type} field
             * @param {type} oSettings
             * @param {type} tipo
             * @returns {undefined}
             */
            _private.addFilters = function(field,oSettings,tipo){
                var idCont = 'cont_filter_'+oSettings.tObjectTable+'_'+field;
                var divF = $('<div></div>');
                divF.attr('data-filter',field);
                divF.attr('class','well well-sm main-filter');
                divF.css({
                    'display': 'none',
                    'position': 'absolute',
                    'right': '6px',
                    'z-index':5
                });
                divF.attr('id',idCont);
                
                /*agregar texto 1*/
                var txt1 = $('<p></p>');
                txt1.attr('data-filter',field);
                txt1.html('Mostrar&nbsp;registros&nbsp;que&nbsp;sean:');
                
                divF.append(txt1);
                
                /*agregar primer <select> de operadores 1*/
                var operator1 = $('<select></select>');
                operator1.attr('id','op1_'+oSettings.tObjectTable+'_'+field);
                operator1.attr('data-filter',field);
                operator1.attr('class','form-control operador1');
                operator1.html('<option value="=">Igual</option>\n\
                                <option value="!=">Diferente</option>\n\
                                <option value=">">Mayor</option>\n\
                                <option value=">=">Mayor o igual</option>\n\
                                <option value="<">Menor</option>\n\
                                <option value="<=">Menor o igual</option>\n\
                                <option value="C">Comienza</option>\n\
                                <option value="T">Termina</option>\n\
                                <option value="LIKE">Contiene</option>');
                operator1.find('option').attr('data-filter',field);
                divF.append(operator1);
                
                /*combo con operadores 2 AND, OR*/
                var operator2 = $('<select></select>');
                operator2.attr('id','op2_'+oSettings.tObjectTable+'_'+field);
                operator2.attr('data-filter',field);
                operator2.attr('class', 'form-control operador2');
                operator2.css({'margin-top': '5px', 'margin-bottom': '5px', width: '80px'});
                operator2.html('<option value="AND">AND</option>\n\
                                <option value="OR">OR</option>');
                operator2.find('option').attr('data-filter',field);
                divF.append(operator2);
                
                /*agregar primer <select> de operadores 3*/
                var operator3 = $('<select></select>');
                operator3.attr('id','op3_'+oSettings.tObjectTable+'_'+field);
                operator3.attr('data-filter',field);
                operator3.attr('class','form-control operador3');
                operator3.css({'margin-bottom':'5px'});
                operator3.html('<option value="=">Igual</option>\n\
                                <option value="<>">Diferente</option>\n\
                                <option value=">">Mayor</option>\n\
                                <option value=">=">Mayor o igual</option>\n\
                                <option value="<">Menor</option>\n\
                                <option value="<=">Menor o igual</option>\n\
                                <option value="C">Comienza</option>\n\
                                <option value="T">Termina</option>\n\
                                <option value="LIKE">Contiene</option>');
                operator3.find('option').attr('data-filter',field);
                divF.append(operator3);
                
                
                /*agregando filtro dos*/
                var filter2 = null, cont, icon; 
                
                switch (tipo.toLowerCase()) {
                    case 'text':                            /*se crea input:text*/
                        filter2 = $('<input></input>');
                        filter2.attr('type','text');
                        filter2.addClass('form-control filter2');

                        break;
                    case 'date':                            /*se crea input:text, con datepicker*/
                        filter2 = $('<input></input>');
                        filter2.addClass('datepickerGrid');
                        filter2.attr('type','text');
                        filter2.addClass('form-control filter2');

                        icon = $('<label></label>');
                        icon.attr('for',field);
                        icon.attr('data-filter',field);
                        icon.attr('class','glyphicon glyphicon-calendar');

                        cont = $('<div></div>');
                        cont.addClass('icon-addon addon-md');                      /*para los iconos*/
                        cont.attr('data-filter',field);
                        cont.html(filter2);
                        cont.append(icon);

                        filter2 = cont;
                        break;
                    case 'time':                        /*se crea input:text, con clockpicker*/
                        filter2 = $('<input></input>');
                        filter2.addClass('timepickerGrid');
                        filter2.attr('data-filter',field);
                        filter2.attr('type','text');
                        filter2.addClass('form-control filter2');

                        icon = $('<label></label>');
                        icon.attr('for',field);
                        icon.attr('data-filter',field);
                        icon.attr('class','glyphicon glyphicon-time');

                        cont = $('<div></div>');
                        cont.addClass('icon-addon addon-md');                      /*para los iconos*/
                        cont.attr('data-filter',field);
                        cont.html(filter2);
                        cont.append(icon);

                        filter2 = cont;
                        break;
                    case 'select': 
                        filter2 = $('<select></select>');

                        /*options*/
                        var opt = $('<option></option>');
                        opt.attr('value', '');
                        opt.html('Seleccionar...');

                        filter2.append(opt);
                        filter2.addClass('form-control filter2');

                        var dataClient = '';
                        for(var t in DATA_SELECT){
                            for(var g in DATA_SELECT[t]){
                                if(oSettings.tObjectTable+'_'+field === g){
                                    dataClient = DATA_SELECT[t][g];
                                }
                            }
                        }

                        filter2.append(dataClient);
                        break;
                }
                filter2.attr('id','f2_'+oSettings.tObjectTable+'_'+field);
                filter2.attr('data-filter',field);
                
                divF.append(filter2);
                
                /*botones filtrar y cerrar*/
                var cntBtn = $('<div></div>');
                cntBtn.attr('data-filter',field);
                cntBtn.css({'margin-top': '5px'});
                
                var btnFilter = $('<button></button>');
                btnFilter.attr('type','button');
                btnFilter.attr('class','btn btn-default');
                btnFilter.attr('data-filter',field);
                btnFilter.css({float: 'left'});
                btnFilter.html('<i class="fa fa-search"></i> Filtrar');
                btnFilter.click(function(){
                    _private.executeFilter(oSettings);
                });
                
                cntBtn.append(btnFilter);
                
                var btnClose = $('<button></button>');
                btnClose.attr('type','button');
                btnClose.attr('class','btn btn-default');
                btnClose.attr('data-filter',field);
                btnClose.css({float: 'right'});
                btnClose.html('<i class="fa fa-trash-o"></i> Limpiar');
                btnClose.click(function(){
                    $("#"+idCont).css({display:"none"});
                    _private.clearFilter(oSettings);
                });
                
                cntBtn.append(btnClose);
                
                divF.append(cntBtn);
                
                $('#th_cont_search_'+oSettings.tObjectTable+'_'+field).append(divF);
            };
            
            /*
             * Crea icono filtro en cada <th>
             * @param {type} idTH   --  id del <th> de cada filtro en el <thead>
             * @returns {undefined}
             */
            _private.addIconFilter = function(field,oSettings,tipo){
                var sp = $('<span></span>');
                sp.attr('class','input-group-addon');
                sp.attr('data-filter',field);
                sp.attr('onclick','$("#cont_filter_' + oSettings.tObjectTable + '_' + field + '").toggle();');
                
                var ii = $('<i></i>');
                ii.attr('data-filter',field);
                ii.css({cursor: 'pointer'});
                ii.attr('class','glyphicon glyphicon-filter');
                
                sp.html(ii);
                $('#th_cont_search_'+oSettings.tObjectTable+'_'+field).find('div:eq(0)').append(sp);
                
                /*insertar capa con condicionales*/
                _private.addFilters(field,oSettings,tipo);
            };
            
            /*
             * Crea los elementos para los filtros
             * @param {type} oSettings
             * @returns {undefined}
             */
            _private.addSearchCols = function(oSettings){
                /*recorrido de columnas, creando los filtros*/
                for (var c in oSettings.tColumns) {
                    var elementSearch = null;                          /*el filtro*/
                    var cont,idTH;
                    var kfield = (oSettings.tColumns[c].field !== undefined) ? oSettings.tColumns[c].field : '';
                    var search = (oSettings.tColumns[c].filter !== undefined) ? oSettings.tColumns[c].filter : false;   /*para activar busqueda de columnas*/
                    
                    /*verificar si se configuro la busqueda*/
                    if (search instanceof Object && search !== false) {
                        var tipo    = (search.type !== undefined) ? search.type : 'text';                  /*tipo de elemento*/
                        var field   = (search.compare !== undefined) ? search.compare : kfield;            /*el campo q se buscara, en caso oSettings.tColumns[c].campo no sea util*/
                        var idField = 'input_search_'+oSettings.tObjectTable+'_'+field;
                        var icon    = null;           /*para el icono del field*/
                        
                        FIELDS.push(field);                          /*para ocultar filtros al dar click en document*/
                        
                        /*id del <th>*/
                        idTH    = 'th_cont_search_'+oSettings.tObjectTable+'_'+field;
                        
                        /*switch segun type de objeto*/
                        switch (tipo.toLowerCase()) {
                            case 'text':                            /*se crea input:text*/
                                elementSearch = $('<input></input>');
                                elementSearch.attr('type','text');
                                elementSearch.attr('id','f1_'+oSettings.tObjectTable+'_'+field);
                                elementSearch.addClass('form-control filter1');
                                elementSearch.attr('field',field);
                                elementSearch.keyup(function(tecla) {
                                    if (tecla.keyCode === 13) {
                                        _private.executeFilter(oSettings);
                                    }
                                });

                                cont = $('<label></label>');
                                cont.css({display: 'block'});       /*para que ocupe todo el <th>*/
                                cont.html(elementSearch);
                                
                                
                                $('#'+idTH).find('div').html(cont);
                                
                                /*agregando el operador*/
                                _private.addIconFilter(field,oSettings,tipo);
                                break;
                            case 'date':                            /*se crea input:text, con datepicker*/
                                _private.ifDatePicker = true;

                                elementSearch = $('<input></input>');
                                elementSearch.addClass('datepickerGrid');
                                elementSearch.attr('type','text');
                                elementSearch.attr('id','f1_'+oSettings.tObjectTable+'_'+field);
                                elementSearch.addClass('form-control filter1');
                                elementSearch.attr('field',field);
                                elementSearch.keyup(function(tecla) {
                                    if (tecla.keyCode === 13) {
                                        _private.executeFilter(oSettings);
                                    }
                                });
                                elementSearch.change(function(tecla) {
                                    _private.executeFilter(oSettings);
                                });
                                
                                icon = $('<label></label>');
                                icon.attr('for',idField);
                                icon.attr('class','glyphicon glyphicon-calendar');

                                cont = $('<div></div>');
                                cont.addClass('icon-addon addon-md');                      /*para los iconos*/
                                cont.html(elementSearch);
                                cont.append(icon);
                                
                                $('#'+idTH).find('div').html(cont);
                                
                                /*agregando el operador*/
                                _private.addIconFilter(field,oSettings,tipo);
                                break;
                            case 'time':                        /*se crea input:text, con clockpicker*/
                                _private.ifTimePicker = true;

                                elementSearch = $('<input></input>');
                                elementSearch.addClass('timepickerGrid');
                                elementSearch.attr('type','text');
                                elementSearch.attr('id','f1_'+oSettings.tObjectTable+'_'+field);
                                elementSearch.addClass('form-control filter1');
                                elementSearch.attr('field',field);
                                elementSearch.keyup(function(tecla) {
                                    if (tecla.keyCode === 13) {
                                        _private.executeFilter(oSettings);
                                    }
                                });
                                elementSearch.change(function() {
                                    _private.executeFilter(oSettings);
                                });
                                
                                icon = $('<label></label>');
                                icon.attr('for',idField);
                                icon.attr('class','glyphicon glyphicon-time');

                                cont = $('<div></div>');
                                cont.addClass('icon-addon addon-md');                      /*para los iconos*/
                                cont.html(elementSearch);
                                cont.append(icon);
                                
                                $('#'+idTH).find('div').html(cont);
                                
                                /*agregando el operador*/
                                _private.addIconFilter(field,oSettings,tipo);
                                break;
                            case 'select':                      /*se crea <select>*/
                                var url         = (search.ajaxData !== undefined) ? search.ajaxData : null; /*para data de combo*/
                                var options     = (search.options !== undefined) ? search.options : [];          /*campos para select*/
                                var dataClient  = (search.dataClient !== undefined) ? search.dataClient : [];          /*data desde el cliente*/
                                var flag        = (search.flag !== undefined) ? search.flag : '';

                                if(options.length === 0){
                                    alert('[options] No definido, defina [options].')
                                }
                                
                                if(url !== null){                    /*datos desde el servidor*/
                                    var data_s;
                                    var promise = $.ajax({
                                                    type: "POST",
                                                    url: url,
                                                    dataType: 'json',
                                                    data:{_flag: flag, _field: field},       /*se envia configuracion de <select> porq la llamada es multiple*/
                                                    success: function(resp) {
                                                        data_s = resp;
                                                    }
                                                });
                                    /*promesa se ejecuta a la respuesta del server*/
                                    promise.done(function(){
                                        elementSearch = $('<select></select>');
                                        elementSearch.attr('id','f1_'+oSettings.tObjectTable+'_'+data_s.field);
                                        elementSearch.addClass('form-control filter1');
                                        elementSearch.attr('field',data_s.field);
                                        elementSearch.change(function() {
                                            _private.executeFilter(oSettings);
                                        });
                                
                                        /*options*/
                                        var opt = $('<option></option>');
                                        opt.attr('value', '');
                                        opt.html('Todos...');

                                        elementSearch.append(opt);
                                        
                                        var oopp = '';
                                        for (var x in data_s.dataServer) {
                                            oopp += '<option value="'+data_s.dataServer[x][options.value]+'">'+data_s.dataServer[x][options.label]+'</option>';
                                        }
                                        
                                        elementSearch.append(oopp);
                                        
                                        cont = $('<label></label>');
                                        cont.css({display: 'block'});       /*para que ocupe todo el <th>*/
                                        cont.html(elementSearch);

                                        /*data retorna del server, se debe insertar en <th> con html()*/
                                        $('#th_cont_search_'+oSettings.tObjectTable+'_'+data_s.field).find('div').html(cont);
                                        
                                        /*guardando data para el filtro 2*/
                                        var indice = oSettings.tObjectTable+'_'+data_s.field;
                                        eval('DATA_SELECT.push({'+indice+': \''+oopp+'\'});');
                                        
                                        /*agregando el operador*/
                                        _private.addIconFilter(data_s.field,oSettings,'select');
                                    });
                                }else if(dataClient.length > 0 && dataClient instanceof Object){    /*datos desde el cliente*/
                                    cont = $('<label></label>');
                                    cont.css({display: 'block'});       /*para que ocupe todo el <th>*/

                                    elementSearch = $('<select></select>');

                                    /*options*/
                                    var opt = $('<option></option>');
                                    opt.attr('value', '');
                                    opt.html('Todos...');

                                    elementSearch.append(opt);
                                    elementSearch.attr('id','f1_'+oSettings.tObjectTable+'_'+field);
                                    elementSearch.addClass('form-control filter1');
                                    elementSearch.attr('field',field);
                                    elementSearch.change(function() {
                                        _private.executeFilter(oSettings);
                                    });
                                        
                                    var oopp = '';
                                    for (var x in dataClient) {
                                        oopp += '<option value="'+dataClient[x].value+'">'+dataClient[x].etiqueta+'</option>';
                                    }
                                    elementSearch.append(oopp);

                                    cont.html(elementSearch);
                                    $('#'+idTH).find('div').html(cont);
                                    
                                    /*guardando data para el filtro 2*/
                                    var indice = oSettings.tObjectTable+'_'+field;
                                    eval('DATA_SELECT.push({'+indice+': \''+oopp+'\'});');
                                        
                                    /*agregando el operador*/
                                    _private.addIconFilter(field,oSettings,tipo);
                                }
                                break;
                        }
                    }
                }
                
                /*verificar si se aplica datepicker*/
                if(_private.ifDatePicker){
                    $('.datepickerGrid').datepicker({
                        prevText: '<i class="fa fa-chevron-left"></i>',
                        nextText: '<i class="fa fa-chevron-right"></i>',
                        changeMonth: true,
                        changeYear: true,
                        dateFormat: 'dd-mm-yy'
                    });
                    $('.datepickerGrid').mask('99-99-9999');
                }

                /*verificar si se aplica clockpicker*/
                if(_private.ifTimePicker){
                    $('.timepickerGrid').clockpicker({
                        autoclose: true
                    });
                    $('.timepickerGrid').mask('99:99');
                }
            };
            
            /*
             * Crea <tr> para busqueda por columnas
             * @param {type} oSettings
             * @returns {$}
             */
            _private.addTrSearchCols = function(oSettings){
                var tr = $('<tr></tr>'),
                    chkExist = 0;
                
                /*agregando <th> por numeracion*/
                if(oSettings.tNumbers){
                    var th = $('<th></th>');         
                    tr.append(th);                              /*se agrega al <tr>*/
                }
                
                /*agregando <th> por txt de accion al inicio de cabecera*/
                if (_private.positionAxion.toLowerCase() === 'first') {
                    var th = $('<th></th>');         
                    tr.append(th);                              /*se agrega al <tr>*/
                }
                
                /*agregando <th> por el checkbox al inicio*/
                if(oSettings.sCheckbox !== undefined && oSettings.sCheckbox instanceof Object){
                    var pos = (oSettings.sCheckbox.position !== undefined) ? oSettings.sCheckbox.position : 'first';
                    if(pos.toLowerCase() === 'first'){                        
                        var th = $('<th></th>');                            
                        tr.append(th);                          /*se agrega al <tr>*/                       
                        chkExist = 1;
                    }
                }   
                
                /*recorrido de columnas, creando <tr> para filtros*/
                for (var c in oSettings.tColumns) {
                    var kfield = (oSettings.tColumns[c].field !== undefined) ? oSettings.tColumns[c].field : '';
                    var search = (oSettings.tColumns[c].filter !== undefined) ? oSettings.tColumns[c].filter : false;   /*para activar busqueda de columnas*/
                    var field   = (search.compare !== undefined) ? search.compare : kfield;            /*el campo q se buscara, en caso oSettings.tColumns[c].campo no sea util*/
                    var idTH    = 'th_cont_search_'+oSettings.tObjectTable+'_'+field;

                    var th = $('<th></th>');                    /*se crea la columna*/
                    th.attr('id',idTH);
                    th.css({position: 'relative'});
                    th.addClass('hasinput');
                        
                    var divg = $('<div></div>');
                    divg.attr('class','input-group input-group-md');                    
                    
                    th.html(divg);
                    tr.append(th);                              /*se agrega al <tr>*/ 
                }
                
                /*agregando <th> por el checkbox al final*/
                if(oSettings.sCheckbox !== undefined && oSettings.sCheckbox instanceof Object && chkExist === 0){
                    var pos = (oSettings.sCheckbox.position !== undefined) ? oSettings.sCheckbox.position : 'last';
                    if(pos.toLowerCase() === 'last'){                        
                        var th = $('<th></th>');         
                        tr.append(th);                          /*se agrega al <tr>*/
                    }
                }
                
                /*agregando <th> por txt de accion al final de cabecera*/
                if (_private.positionAxion.toLowerCase() === 'last') {
                    var th = $('<th></th>');         
                    tr.append(th);                              /*se agrega al <tr>*/
                }
                
                return tr;
            };
            
            /*
             * Ejecuta la ordenacion por columnas
             * @param {type} tthis
             * @param {type} oSettings
             * @returns {undefined}
             */
            _private.executeSorting = function(tthis,oSettings){
                var thId = $(tthis).attr('id'),
                    orienta;
                oSettings.pOrderField = $(tthis).data('order');
                
                /*antes de dar efecto se resetea para dar los nuevos css*/
                if (TH_TMP !== thId) {
                    /*a todos los <th> del primer <tr> que tengan los css .sorting_asc y .sorting_desc les agreso el css .sorting*/
                    $('#' + oSettings.tObjectTable).find('thead').find('tr:nth-child(1)').find('.sorting_asc').addClass('sorting');
                    $('#' + oSettings.tObjectTable).find('thead').find('tr:nth-child(1)').find('.sorting_desc').addClass('sorting');
                    
                    /*a todos los <th> del primer <tr> les remuevo los css .sorting_asc y .sorting_desc*/
                    $('#' + oSettings.tObjectTable).find('thead').find('tr:nth-child(1)').find('th').removeClass('sorting_asc');
                    $('#' + oSettings.tObjectTable).find('thead').find('tr:nth-child(1)').find('th').removeClass('sorting_desc');
                    
                }
            
                if ($('#' + thId).is('.sorting')) {                /*ordenacion ascendente*/
                    $('#' + thId).removeClass('sorting');
                    $('#' + thId).addClass('sorting_asc');
                    orienta = ' ASC';
                } else if ($('#' + thId).is('.sorting_asc')) {      /*ordenacion ascendente*/
                    $('#' + thId).removeClass('sorting_asc');
                    $('#' + thId).addClass('sorting_desc');
                    orienta = ' DESC';
                } else if ($('#' + thId).is('.sorting_desc')) {     /*sin ordenacion*/
                    $('#' + thId).removeClass('sorting_desc');
                    $('#' + thId).addClass('sorting');
                    orienta = ' ';
                } 
                
                TH_TMP = thId;
                        
                oSettings.pOrderField += orienta;
                oSettings.pDisplayLength = $('#' + oSettings.tObjectTable + '_cbLength').val();  /*tomo el valor del combo para los registros a mostrar*/
                oSettings.pDisplayStart = parseInt($('#paginate_' + oSettings.tObjectTable).find('ul.pagination').find('li.active').find('a').html()) - 1;
                $.method.sendAjax(oSettings);
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
                    var field   = (oSettings.tColumns[c].field !== undefined) ? oSettings.tColumns[c].field : '';
                    var sortable= (oSettings.tColumns[c].sortable !== undefined) ? ' sorting' : '';
                    var width   = (oSettings.tColumns[c].width !== undefined) ? oSettings.tColumns[c].width + oSettings.tWidthFormat : '';
                    var search  = (oSettings.tColumns[c].filter !== undefined) ? oSettings.tColumns[c].filter : false;   /*para activar busqueda de columnas*/
                   
                    th.attr('id', oSettings.tObjectTable + '_head_th_' + c);
                    th.attr('class', 'center');        /*agregado class css*/
                    th.css({width: width, 'vertical-align': 'middle'});                                          /*agregando width de columna*/
                    th.append(title);                                                 /*se agrega el titulo*/
                    th.attr('data-order',field);
                    
                    /*agregando css para sortable*/
                    if(sortable !== ''){
                        th.addClass(sortable);
                        th.data(field);
                        th.click(function(){
                            _private.executeSorting(this,oSettings);
                        });
                    }
                    /*verificar si se inicio ordenamiento y agegar class a th*/
                    var cad = oSettings.pOrderField.split(' ');
                    if (cad[0] === field) {
                        th.removeClass(sortable);
                        th.addClass('sorting_' + cad[1])
                    }
                    
                    if(search instanceof Object){    /*se verifica si existe busquedas por columnas*/
                        _private.ifSearch = true;
                    }
                    
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
                
                h.html(tr);                                         /*se agrega <tr> de cabeceras al <thead>*/
              
                /*agregando controles para busqueda por columna*/ 
                if(_private.ifSearch){
                    h.append(_private.addTrSearchCols(oSettings));      /*se agrega <tr> de busquedas al <thead>*/ 
                }
                
                $('#' + oSettings.tObjectTable).append(h);          /*se agrega <thead> al <table>*/
                
                /*agregando filtros a <tr>*/
                if(_private.ifSearch){
                    _private.addSearchCols(oSettings);      /*se agrega elementos de busquedas al <tr>*/ 
                }
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
                if(oSettings.sData.length === 0){ return false; }
                
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
             * Cebra de columna al ordenar
             * @param {type} r
             * @param {type} pOrderField
             * @param {type} campo
             * @returns {String}
             */
            _private.cebraCol = function(r, oSettings, campo) {
                var m, classort;
                m = oSettings.pOrderField.split(' ');
                classort = '';
                
                var cssTh = $('#'+oSettings.tObjectTable+'_head_th_'+r).is('.sorting');
                
                if (campo === m[0]) {
                    classort = ' sorting_1';
                    if (r % 2) {
                        classort = ' sorting_2';
                    }
                }
                /*si tiene .soting no se envia css*/
                if(cssTh){
                    classort = '';
                }
                return classort;
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

                            var texto = data[r][oSettings.tColumns[c].field];
                            
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
                                texto.html(data[r][oSettings.tColumns[c].field]);
                                texto.attr('onclick',fn);
                            }
                            td.html(texto);                         /*contenido original de <td>*/
                            td.attr('class', klass);                /*agregado class css*/
                            
                            /*verificar si se ordena para marcar*/
                            var classort = _private.cebraCol(r, oSettings, oSettings.tColumns[c].field);
                            
                            td.addClass(classort);
                            
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
                        
                        /*para ocultar filtros avanzados al dar click en document*/
                        if(FIELDS.length){
                            $(document).click(function(a) {
                                for(var i in FIELDS){
                                    var filterParent = $(a.target).parent().attr('data-filter');    /*cuando es un date*/
                                    if(FIELDS[i] !== $(a.target).attr('data-filter') && FIELDS[i] !== filterParent){
                                        $('#cont_filter_'+oSettings.tObjectTable+'_'+FIELDS[i]).css({display: 'none'});
                                    }
                                }
                            });
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
                        
                        var filters = (oSettings.pFilterCols !== undefined)?axAjax.stringPost(oSettings.pFilterCols):'';
                        
                        /*Enviamos datos de paginacion*/
                        _private.aData.push({name: 'pDisplayStart', value: limit0});
                        _private.aData.push({name: 'pDisplayLength', value: oSettings.pDisplayLength});
                        _private.aData.push({name: 'pOrder', value: oSettings.pOrderField});
                        _private.aData.push({name: 'pFilterCols', value: filters});
                   
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
                                
                                oSettings.pFilterCols = '';
                                oSettings.sData  = (data.length > 0)?data:[];

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
                                    typeElement: "button, a, span, #"+oSettings.tObjectTable+"_chkall_0 input:checkbox"
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