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
                    Acciones.getGridAcciones2();
                }
            });
        } catch (ex) {
            auditoria.logErrors(ex);
        }
    };

    _public.getGridAcciones = function (){
        var pEdit   = axScript.getPermiso("ACCED");
        var pDelete = axScript.getPermiso("ACCDE");

        $("#"+tabs.T2+"gridAcciones").dataGrid({
            tScrollY: "200px",
            tRegsLength: [3, 25, 50, 100],
            pDisplayLength: 3,
            tColumns: [
                {title: lang.Acciones.AXION,campo: "accion",width: "300",sortable: true,search: {operator:"LIKE"}},
                {title: lang.Acciones.DISEN, campo: "disenio", width: "220", search:{operator:"LIKE"}},
                {title: lang.Acciones.ALAIS, campo: "alias", width: "220", sortable: true,search:{operator:"LIKE"}},
                {title: lang.generic.EST, campo: "estado", width: "220", sortable: true, class: "center",search:{operator:"LIKE"}}
            ],
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
    
    _public.lafuncionjs = function(f,al,est,a,b){
        alert(f+'--'+al+'--'+est+'--'+a+'--'+b)
    };
    _public.lafuncionjs2 = function(btn,f,al,est,a,b){
        alert(btn.id+'--'+f+'--'+al+'--'+est+'--'+a+'--'+b)
    };
    
    _public.getGridAcciones2 = function (){
        var pEdit   = axScript.getPermiso("ACCED");
        var pDelete = axScript.getPermiso("ACCDE");

        $("#"+tabs.T2+"gridAcciones2").dataGrid({
            tWidthFormat: "px",
            tScrollY: "200px",
            tRegsLength: [3, 25, 50, 100],
            pDisplayLength: 3,
            tColumns: [
                {title: lang.Acciones.AXION,campo: "accion",width: "330",sortable: true,search: {operator:"LIKE"},
                    ajax:{
                        flag: 11,
                        fn: 'Acciones.lafuncionjs',
                        serverParams:['alias','estado'],
                        clientParams:['$("#tab_TAB_CRDACgridAcciones2_cbLength").val()','$("#tab_TAB_CRDACgridAcciones_cbLength").val()']
                    }
                },
                {title: lang.Acciones.DISEN, campo: "disenio", width: "280", search:{operator:"LIKE"}},
                {title: lang.Acciones.ALAIS, campo: "alias", width: "250", sortable: true,search:{operator:"LIKE"},
                    fnCallback:function(fila,row){
                        if(row.alias == 'GR'){
                            return 'modificado_'+fila;
                        }else{
                            return false;
                        }
                    }
                },
                {title: lang.generic.EST, campo: "estado", width: "250", sortable: true, class: "center",search:{operator:"LIKE"}}
            ],
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