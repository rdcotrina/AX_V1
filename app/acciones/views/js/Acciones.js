var Acciones_ = function() {

    /*cargar requires*/
//    try{
//        axExe.require({
//            menu: 'MenuScript'
//        });
//    }catch (ex){
//        auditoria.logErrors(ex);
//    }
    

    var _private = {};

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
                ajax: "Empleados.getFormEditEmpleados();"
            }],
            pPaginate: true,
            sAxions: {
                buttons:[{
                    access: pEdit.permiso,
                    icono: pEdit.icono,
                    titulo: pEdit.accion,
                    class: pEdit.theme,
                    ajax: {
                        fn: "Empleados.getFormEditEmpleados",
                        serverParams: "id_acciones"
                    }
                }, {
                    access: pDelete.permiso,
                    icono: pDelete.icono,
                    titulo: pDelete.accion,
                    class: pDelete.theme,
                    ajax: {
                        fn: "Empleados.postDeleteEmpleados",
                        serverParams: "id_acciones"
                    }
                }]
            },
            tScroll:{
                cRowsInVerticalScroll: 7
            },
            ajaxSource: _private.config.modulo+"getGridAcciones",
            fnCallback: function(oSettings) {
                
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
    
    return _public;

};
var Acciones = new Acciones_();

Acciones.main();