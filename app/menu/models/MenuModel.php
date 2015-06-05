<?php
/*
 * Documento   : configurarMenuModel
 * Creado      : 05-jul-2014
 * Autor       : ..... .....
 * Descripcion : 
 */
class MenuModel extends Database{
    private $_flag;
    private $_idDominio;
    private $_idModulo;
    private $_idMenuPrincipal;
    private $_idOpcion;
    private $_dominio;
    private $_modulo;
    private $_menu;
    private $_opcion;
    private $_alias;
    private $_url;
    private $_icono;
    private $_class;
    private $_lengthArray;
    private $_activo;
    private $_usuario;
    
    public function __construct() {
        parent::__construct();
        $this->_set();
    }
    
    private function _set(){
        $this->_flag            = SimpleForm::getPost('_flag');
        $this->_idDominio       = Aes::de(SimpleForm::getPost('_idDominio'));    /*se decifra*/
        $this->_idModulo        = Aes::de(SimpleForm::getPost('_idModulo'));
        $this->_idMenuPrincipal = Aes::de(SimpleForm::getPost('_idMenuPrincipal'));
        $this->_idOpcion        = Aes::de(SimpleForm::getPost('_idOpcion'));
        $this->_lengthArray     = SimpleForm::getPost('_lengthArray'); /*para la ordenacion*/
        $this->_dominio         = SimpleForm::getPost(T3.'txt_dominio');
        $this->_modulo          = SimpleForm::getPost(T3.'txt_modulo');
        $this->_menu            = SimpleForm::getPost(T3.'txt_menu');
        $this->_opcion          = SimpleForm::getPost(T3.'txt_opcion');
        $this->_alias           = SimpleForm::getPost(T3.'txt_alias');
        $this->_url             = SimpleForm::getPost(T3.'txt_url');
        $this->_icono           = SimpleForm::getPost(T3.'txt_icono');
        $this->_class           = SimpleForm::getPost(T3.'txt_class');
        $this->_activo          = SimpleForm::getPost(T3.'chk_activo');
        $this->_usuario         = Session::get('sys_idUsuario');
    }
    
    public function menuConsultas($flag,$id){
        $query = "call sp_menuConfigurarMenuConsultas(:flag,:criterio);";
        $parms = array(
            ':flag' => $flag,
            ':criterio' => Aes::de($id)
        );
        $data = $this->queryOne($query,$parms);
        if(!isset($data['error'])){  
            $xdata = $data;
        }else{
            $xdata = $data['error'];
        }
        return $data;
    }
    
    public function getDominios(){
        $query = "call sp_menuConfigurarMenuConsultas(:flag,:criterio);";
        
        $parms = array(
            ':flag' => 1,
            ':criterio' => ''
        );
        $data = $this->queryAll($query,$parms);
        if(!isset($data['error'])){  
            $xdata = $data;
        }else{
            $xdata = $data['error'];
        }
        return $xdata;
    }
    
    public function getModulos($dominio){
        $query = "call sp_menuConfigurarMenuConsultas(:flag,:criterio);";
        
        $parms = array(
            ':flag' => 3,
            ':criterio' => $dominio
        );
        $data = $this->queryAll($query,$parms);
        if(!isset($data['error'])){  
            $xdata = $data;
        }else{
            $xdata = $data['error'];
        }
        return $xdata;
    }
    
    public function getMenus($modulo){
        $query = "call sp_menuConfigurarMenuConsultas(:flag,:criterio);";
        
        $parms = array(
            ':flag' => 5,
            ':criterio' => $modulo
        );
        $data = $this->queryAll($query,$parms);
        if(!isset($data['error'])){  
            $xdata = $data;
        }else{
            $xdata = $data['error'];
        }
        return $xdata;
    }
    
    public function getOpciones($menu){
        $query = "call sp_menuConfigurarMenuConsultas(:flag,:criterio);";
        
        $parms = array(
            ':flag' => 7,
            ':criterio' => $menu
        );
        $data = $this->queryAll($query,$parms);
        if(!isset($data['error'])){  
            $xdata = $data;
        }else{
            $xdata = $data['error'];
        }
        return $xdata;
    }
    
    public function mantenimientoDominio(){
        $query = "call sp_menuConfigurarMenuDominioMantenimiento(:flag,:key,:dominio,:icono,:activo,:usuario,:arrayLength);";
        $parms = array(
            ':flag' => $this->_flag,
            ':key' => $this->_idDominio,
            ':dominio' => $this->_dominio,
            ':icono' => $this->_icono,
            ':activo' => (!empty($this->_activo))?$this->_activo:'I',
            ':usuario' => $this->_usuario,
            ':arrayLength' => $this->_lengthArray
        );
        $data = $this->queryOne($query,$parms);
        
        return $data;
    }
    
    public function mantenimientoModulo(){
        $query = "call sp_menuConfigurarMenuModuloMantenimiento(:flag,:key,:idDominio,:modulo,:activo,:usuario,:arrayLength);";
        $parms = array(
            ':flag' => $this->_flag,
            ':key' => $this->_idModulo,
            ':idDominio' => $this->_idDominio,
            ':modulo' => $this->_modulo,
            ':activo' => (!empty($this->_activo))?$this->_activo:'I',
            ':usuario' => $this->_usuario,
            ':arrayLength' => $this->_lengthArray
        );
        $data = $this->queryOne($query,$parms);
        if(!isset($data['error'])){  
            $xdata = $data;
        }else{
            $xdata = $data['error'];
        }
        return $xdata;
    }
    
    public function mantenimientoMenuPrincipal(){
        $query = "call sp_menuConfigurarMenuMenuPrincipalMantenimiento(:flag,:key,:idModulo,:menu,:activo,:usuario,:arrayLength);";
        $parms = array(
            ':flag' => $this->_flag,
            ':key' => $this->_idMenuPrincipal,
            ':idModulo' => $this->_idModulo,
            ':menu' => $this->_menu,
            ':activo' => (!empty($this->_activo))?$this->_activo:'I',
            ':usuario' => $this->_usuario,
            ':arrayLength' => $this->_lengthArray
        );
        $data = $this->queryOne($query,$parms);
        if(!isset($data['error'])){  
            $xdata = $data;
        }else{
            $xdata = $data['error'];
        }
        return $xdata;
    }
    
    public function mantenimientoOpcion(){
        $query = "call sp_menuConfigurarMenuOpcionMantenimiento(:flag,:key,:idMenu,:opcion,:url,:alias,:activo,:usuario,:arrayLength);";
        $parms = array(
            ':flag' => $this->_flag,
            ':key' => $this->_idOpcion,
            ':idMenu' => $this->_idMenuPrincipal,
            ':opcion' => $this->_opcion,
            ':url' => $this->_url,
            ':alias' => $this->_alias,
            ':activo' => (!empty($this->_activo))?$this->_activo:'I',
            ':usuario' => $this->_usuario,
            ':arrayLength' => $this->_lengthArray
        );
        $data = $this->queryOne($query,$parms);
        if(!isset($data['error'])){  
            $xdata = $data;
        }else{
            $xdata = $data['error'];
        }
        return $xdata;
    }
    
}