var MenuScript_ = function(){
    
   var _public = {};
   
   _public.sortable = function(){
       //    mover listas dominios
        $("."+tabs.T3+"ul-dominios").sortable({
            update: function () {
                var ordenElementos = $(this).sortable("toArray",{attribute: 'data-doorden'}).toString(); 
                Menu.postOrdenar('DOM',ordenElementos);
            }
        });

        //    mover listas modulos
        $("."+tabs.T3+"ul-modulos").sortable({
            update: function () {
                var ordenElementos = $(this).sortable("toArray",{attribute: 'data-moorden'}).toString(); 
                Menu.postOrdenar('MOD',ordenElementos);
            }
        });
        
        //    mover listas menus
        $("."+tabs.T3+"ul-menus").sortable({
            update: function () {
                var ordenElementos = $(this).sortable("toArray",{attribute: 'data-meorden'}).toString(); 
                Menu.postOrdenar('MNU',ordenElementos);
            }
        });
        
        //    mover listas opciones
        $("."+tabs.T3+"ul-opciones").sortable({
            update: function () {
                var ordenElementos = $(this).sortable("toArray",{attribute: 'data-opcorden'}).toString(); 
                Menu.postOrdenar('OPC',ordenElementos);
            }
        });
   };
   
   _public.menuRight = function(){
       $(".menuRight").menuRight({
            menu: '#'+tabs.T3+'myMenuRright',
            callback: function (element, idTarget) {
                var action = $(element).data('href');
                var id = $('#'+idTarget).attr('data-id');;
                var nivel = $('#'+idTarget).attr('data-nivel');
                
                switch(nivel.toString()){
                    /*DOMINIOS*/
                    case 'DO':
                        switch (action) {
                            case 'NEW':
                                Menu.getFormNewModulo(id);
                                break;
                            case 'EDIT':
                                Menu.getFormEditDominio(id);
                                break;
                            case 'DELETE':
                                Menu.postDeleteDominio(id);
                                break;
                        }
                        break;
                    /*MODULOS*/
                    case 'MO':
                        var idDominio = $('#'+idTarget).attr('data-dominio');
                        switch (action) {
                            case 'NEW':
                                Menu.getFormNewMenu(id);
                                break;
                            case 'EDIT':
                                Menu.getFormEditModulo(id,idDominio);
                                break;
                            case 'DELETE':
                                Menu.postDeleteModulo(id);
                                break;
                        }
                        break;
                    /*MENUS*/
                    case 'MNU':
                        var idModulo = $('#'+idTarget).attr('data-modulo');
                        switch (action) {
                            case 'NEW':
                                Menu.getFormNewOpcion(id);
                                break;
                            case 'EDIT':
                                Menu.getFormEditMenu(id,idModulo);
                                break;
                            case 'DELETE':
                                Menu.postDeleteMenu(id);
                                break;
                        }
                        break;
                    /*OPCION*/
                    case 'OPC':
                        var idMenu = $('#'+idTarget).attr('data-menu');
                        /*desabilitar opcion Nuevo en menu derecho|*/
                        switch (action) {
                            case 'NEW':
                                /*nada*/
                                break;
                            case 'EDIT':
                                Menu.getFormEditOpcion(id,idMenu);
                                break;
                            case 'DELETE':
                                Menu.postDeleteOpcion(id);
                                break;
                        }
                        break;
                }
            }
        });
   };
   
   return _public;
   
};
var MenuScript = new MenuScript_();