var Acciones_ = function() {

    var _private = {};
    
    _private.idAccion = 0;
    
    _private.idGrid   = '';

    _private.config = {
        modulo: 'acciones/Acciones/'
    };

    var _public = {};

    _public.main = function() {
        try {
            axScript.addTab({
                id: tabs.T2,
                label: axExe.getTitle(),
                fnCallback: function() {
                    Acciones.index(axExe.getRoot());
                }
            });
        } catch (ex) {
            auditoria.logErrors(ex);
        }
    };

    _public.index = function(root) {
        try {
            axAjax.send({
                dataType: 'html',
                root: _private.config.modulo,
                fnServerParams: function(sData) {
                    sData.push({name: '_rootTitle', value: root});
                },
                fnCallback: function(data) {
                    $('#' + tabs.T2 + '_CONTAINER').html(data);
                    Acciones.getGridAcciones();
                    //Acciones.getGridAcciones2();
                }
            });
        } catch (ex) {
            auditoria.logErrors(ex);
        }
    };

    _public.getGridAcciones = function (){
        var pNew    = axScript.getPermiso("ACCNEW");
        var pEdit   = axScript.getPermiso("ACCED");
        var pDelete = axScript.getPermiso("ACCDE");

        $("#"+tabs.T2+"gridAcciones").dataGrid({
            tScrollY: "200px",
            pDisplayLength: 25,
            pOrderField: 'accion asc',
            tColumns: [
                {title: lang.Acciones.AXION,field: "accion",width: "300",sortable: true,filter: {type: 'text'}},
                {
                    title: lang.Acciones.DISEN, 
                    width: "220", 
                    field: "disenio", 
                    class: "center",
                    fnCallback:function(fila,row){
                        return '<button type="button" class="'+row.theme+'"><i class="'+row.icono+'"></i></button>';
                    }
                },
                {
                    title: lang.Acciones.ALAIS, 
                    field: "alias", 
                    width: "220", 
                    sortable: true,
                    filter:{
                        type:"select",
                        ajaxData: _private.config.modulo+'getAlias',
                        options:{label:'alias',value:'alias'}
                    }
                },
                {
                    title: lang.generic.EST, 
                    width: "220", 
                    field: "estado", 
                    sortable: true, 
                    class: "center",
                    filter:{
                        type:"select",
                        dataClient:[{etiqueta:'Activo',value:'A'},{etiqueta:'Inactivo',value:'I'}],
                        options:{label:'etiqueta',value:'value'}
                    },
                    fnCallback:function(fila,row){
                        return axScript.labelState(row.estado);
                    }
                }
            ],
            tButtons:[{
                access: pNew.permiso,
                icono: pNew.icono,
                titulo: pNew.accion,
                class: pNew.theme,
                ajax: "Acciones.getFormNuevaAccion(this);"
            }],
        sExport:{
                buttons:{excel:true,pdf:true},
                nameFile: 'axs',
                orientation: 'landscape',
                caption: 'RELACIÓN DE ACCIONES',
                columns:[
                    {title:lang.Acciones.AXION ,field:'accion',type: 'string'},
                    {title:lang.Acciones.ALAIS ,field:'alias'},
                    {title:lang.generic.EST ,field:'estado'}
                ]
            },
            pPaginate: true,
            sAxions: {
                buttons:[{
                    access: pEdit.permiso,
                    icono: pEdit.icono,
                    titulo: pEdit.accion,
                    class: pEdit.theme,
                    ajax: {
                        fn: "Acciones.getEditAccion",
                        serverParams: "id_acciones"
                    }
                }, {
                    access: pDelete.permiso,
                    icono: pDelete.icono,
                    titulo: pDelete.accion,
                    class: pDelete.theme,
                    ajax: {
                        fn: "Acciones.postDeleteAccion",
                        serverParams: "id_acciones"
                    }
                }]
            },
            tScroll:{
                cRowsInVerticalScroll: 10
            },
            ajaxSource: _private.config.modulo+"getGridAcciones",
            fnCallback: function(oSettings) {
                _private.idGrid = oSettings.tObjectTable;
            }
        });
        setup_widgets_desktop();
    };
    
    _public.lafuncionjs = function(f,al,est,a,b){
        alert(f+'--'+al+'--'+est+'--'+a+'--'+b)
    };
    _public.lafuncionjs2 = function(btn,f,al,est,a,b){
        alert(btn.id+'--'+f+'--'+al+'--'+est+'--'+a+'--'+b)
    };
    
    _public.getGridAcciones2 = function (){
        var pEdit   = axScript.getPermiso("ACCED");
        var pDelete = axScript.getPermiso("ACCDE");

        var pr1 = 43;
        var pr2 = 57;
        
        $("#"+tabs.T2+"gridAcciones2").dataGrid({
            tWidthFormat: "px",
            tScrollY: "200px",
            tShowHideColumn: true,
            tRegsLength: [3, 25, 50, 100],
            pOrderField: 'accion asc',
            pDisplayLength: 3,
            sCheckbox: {
                serverValues: ['alias','estado'],
                clientValues: [pr1,pr2],
                attrServerValues: [
                    {alias: 'alias'},
                    {estado: 'estado'}
                ]
            },
            tColumns: [
                {
                    title: lang.Acciones.AXION,
                    field: "accion",
                    width: "330",
                    sortable: true,
                    filter: {type:"date"},
                    ajax:{
                        flag: 11,
                        fn: 'Acciones.lafuncionjs',
                        serverParams:['alias','estado'],
                        clientParams:['$("#tab_TAB_CRDACgridAcciones2_cbLength").val()','$("#tab_TAB_CRDACgridAcciones_cbLength").val()']
                    }
                },
                {title: lang.Acciones.DISEN, field: "disenio", width: "280", sortable: true, filter:{type:"time"}},
                {
                    title: lang.Acciones.ALAIS, 
                    field: "alias", 
                    width: "250", 
                    sortable: true,
                    filter:{
                        type:"select",
                        ajaxData: _private.config.modulo+'getAlias',
//                        dataClient:[{etiqueta:'ED',value:'ED'},{etiqueta:'DE',value:'DE'}],
                        options:{label:'alias',value:'alias'}
                    },
                    fnCallback:function(fila,row){
                        if(row.alias == 'GR'){
                            return 'modificado_'+fila;
                        }else{
                            return false;
                        }
                    }
                },
                {title: lang.generic.EST, field: "estado", width: "250", sortable: true, class: "center",filter:{type:"text"}}
            ],
            sExport:{
                buttons:{excel:true,pdf:true},
                nameFile: 'axs',
                orientation: 'landscape',
                caption: 'RELACIÓN DE ACCIONES',
                columns:[
                    {title:lang.Acciones.AXION ,field:'accion',type: 'string'},
                    {title:lang.Acciones.DISEN ,field:'disenio'},
                    {title:lang.Acciones.ALAIS ,field:'alias'},
                    {title:lang.generic.EST ,field:'estado'}
                ]
            },
            pPaginate: true,
            sAxions: {
                width: '200',
                /*se genera group nuttons*/
                group: [{
                    titulo: '<i class="fa fa-gear fa-lg"></i>',
                    class: 'btn btn-primary dropdown-toggle',
                    buttons:[{
                        access: pEdit.permiso,
                        icono: pEdit.icono,
                        titulo: pEdit.accion,
                        class: pEdit.theme,
                        ajax: {
                            fn: "Acciones.lafuncionjs2",
                            flag: 45,
                            serverParams:['alias','estado'],
                            clientParams:['$("#tab_TAB_CRDACgridAcciones2_cbLength").val()','$("#tab_TAB_CRDACgridAcciones_cbLength").val()']
                        }
                    }, {
                        access: pDelete.permiso,
                        icono: pDelete.icono,
                        titulo: pDelete.accion,
                        class: pDelete.theme,
                        ajax: {
                            fn: "Empleados.postDeleteEmpleados",
                            serverParams: "id_acciones"
                        },
                        fnCallback:function(fila,row){
                            if(row.alias == 'GR'){
                                return 'btn modificado '+fila;
                            }else{
                                return false;
                            }
                        }
                    }]
                },{
                    titulo: 'group 2',
                    class: 'btn btn-primary dropdown-toggle',
                    buttons: [{
                        access: pEdit.permiso,
                        icono: pEdit.icono,
                        titulo: pEdit.accion,
                        class: pEdit.theme,
                        ajax: {
                            fn: "Acciones.lafuncionjs2",
                            flag: 45,
                            serverParams:['alias','estado'],
                            clientParams:['$("#tab_TAB_CRDACgridAcciones2_cbLength").val()','$("#tab_TAB_CRDACgridAcciones_cbLength").val()']
                        }
                    }]
                }],
                /*se genera botones directamente*/
                buttons: [{
                    access: pEdit.permiso,
                    icono: pEdit.icono,
                    titulo: pEdit.accion,
                    class: pEdit.theme,
                    ajax: {
                        fn: "Acciones.lafuncionjs2",
                        flag: 45,
                        serverParams:['alias','estado'],
                        clientParams:['$("#tab_TAB_CRDACgridAcciones2_cbLength").val()','$("#tab_TAB_CRDACgridAcciones_cbLength").val()']
                    }
                }, {
                    access: pDelete.permiso,
                    icono: pDelete.icono,
                    titulo: pDelete.accion,
                    class: pDelete.theme,
                    ajax: {
                        fn: "Empleados.postDeleteEmpleados",
                        serverParams: "id_acciones"
                    },
                    fnCallback:function(fila,row){
                        if(row.alias == 'GR'){
                            return 'btn modificado '+fila;
                        }else{
                            return false;
                        }
                    }
                }]
            },
            tScroll:{
                cFixedColsLeft: 2,
                cFixedColsRight: 1,
                cColsInHorizontalScroll: 2,
                cRowsInVerticalScroll: 2
            },
            ajaxSource: _private.config.modulo+"getGridAcciones",
            fnCallback: function(oSettings) {
               
            }
        });
        setup_widgets_desktop();
    };
    
    _public.getFormNuevaAccion = function(btn) {
        try {
            axAjax.send({
                element: btn,
                dataType: 'html',
                root: _private.config.modulo + 'formNuevaAccion',
                fnCallback: function(data) {
                    $('#cont-modal').append(data);  /*los formularios con append*/
                    $('#' + tabs.T2 + 'formNuevaAccion').modal('show');
                }
            });
        } catch (ex) {
            auditoria.logErrors(ex);
        }
    };
    
    _public.getEditAccion = function(btn,id) {
        try {
            _private.idAccion = id;

            axAjax.send({
                dataType: 'html',
                element: btn,
                root: _private.config.modulo + 'formEditAccion',
                fnServerParams: function(sData) {
                    sData.push({name: '_key', value: _private.idAccion});
                },
                fnCallback: function(data) {
                    $('#cont-modal').append(data);
                    $('#' + tabs.T2 + 'formEditAccion').modal('show');
                }
            });
        } catch (ex) {
            auditoria.logErrors(ex);
        }
    };
    
    _public.postNuevaAccion = function() {
        try {
            axAjax.send({
                flag: 1,
                element: '#' + tabs.T2 + 'btnGrabaAccion',
                root: _private.config.modulo + 'postNuevaAccion',
                form: '#' + tabs.T2 + 'formNuevaAccion',                
                fnCallback: function(data) {
                    if (!isNaN(data.result) && parseInt(data.result) === 1) {
                        axScript.notify.ok({
                            content: lang.mensajes.MSG_3,
                            callback: function() {
                                axScript.refreshGrid(_private.idGrid);
                            }
                        });
                    } else if (!isNaN(data.result) && parseInt(data.result) === 2) {
                        axScript.notify.error({
                            content: lang.Acciones.EXISTAXION
                        });
                    } else if (!isNaN(data.result) && parseInt(data.result) === 3) {
                        axScript.notify.error({
                            content: lang.Acciones.EXISTALAIS
                        });
                    }
                }
            });
        } catch (ex) {
            auditoria.logErrors(ex);
        }
    };
    
    _public.postEditAccion = function() {
        try {
            axAjax.send({
                flag: 2,
                element: '#' + tabs.T2 + 'btnEdAccion',
                root: _private.config.modulo + 'postEditAccion',
                form: '#' + tabs.T2 + 'formEditAccion',     
                fnServerParams: function(sData) {
                    sData.push({name: '_key', value: _private.idAccion});
                },
                fnCallback: function(data) {
                    if (!isNaN(data.result) && parseInt(data.result) === 1) {
                        axScript.notify.ok({
                            content: lang.mensajes.MSG_3,
                            callback: function() {
                                axScript.closeModal('#' + tabs.T2 + 'formEditAccion');
                                axScript.refreshGrid(_private.idGrid);
                                _private.idAccion = 0;
                            }
                        });
                    } else if (!isNaN(data.result) && parseInt(data.result) === 2) {
                        axScript.notify.error({
                            content: lang.Acciones.EXISTAXION
                        });
                    } else if (!isNaN(data.result) && parseInt(data.result) === 3) {
                        axScript.notify.error({
                            content: lang.Acciones.EXISTALAIS
                        });
                    }
                }
            });
        } catch (ex) {
            auditoria.logErrors(ex);
        }
    };
    
    _public.postDeleteAccion = function(btn,id){
        try {
            _private.idAccion = id;

            axScript.notify.confirm({
                content: lang.mensajes.MSG_5,
                callbackSI: function() {
                    axAjax.send({
                        flag: 3,
                        element: btn,
                        root: _private.config.modulo + 'postDeleteAccion',
                        fnServerParams: function(sData) {
                            sData.push({name: '_key', value: _private.idAccion});
                        },
                        fnCallback: function(data) {
                            if (!isNaN(data.result) && parseInt(data.result) === 1) {
                                axScript.notify.ok({
                                    content: lang.mensajes.MSG_6,
                                    callback: function() {
                                        axScript.refreshGrid(_private.idGrid);
                                    }
                                });
                            }
                        }
                    });
                }
            });
        } catch (ex) {
            auditoria.logErrors(ex);
        }
    };
    
    return _public;

};
var Acciones = new Acciones_();

Acciones.main();