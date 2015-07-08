<?php

class AccionesModel extends Database{
    private $_flag;
    private $_key;
    private $_accion;
    private $_alias;
    private $_activo;
    private $_icono;
    private $_theme;
    private $_usuario;
    
    /*para el grid*/
    private $_pDisplayStart;
    private $_pDisplayLength;
    private $_pSortingCols;
    private $_sExport;
    private $_pOrder;
    private $_pFilterCols;
    
    public function __construct() {
        parent::__construct();
        $this->_set();
    }
    
    private function _set(){
        $this->_flag    = AxForm::getPost('_flag');
        //$this->_key     = Aes::de(AxForm::getPost('_key'));    /*se decifra*/
        $this->_key     = AxForm::getPost('_key');
        $this->_accion  = AxForm::getPost(T2.'txt_accion');
        $this->_alias   = AxForm::getPost(T2.'txt_alias');
        $this->_icono   = AxForm::getPost(T2.'txt_icono');
        $this->_theme   = AxForm::getPost(T2.'txt_theme');
        $this->_activo  = AxForm::getPost(T2.'chk_activo');
        $this->_usuario = Session::get('sys_idUsuario');
        
        $this->_pDisplayStart  =   AxForm::getPost("pDisplayStart"); 
        $this->_pDisplayLength =   AxForm::getPost("pDisplayLength"); 
        $this->_pSortingCols   =   AxForm::getPost("pSortingCols");
        $this->_pOrder         =   AxForm::getPost("pOrder");
        $this->_sExport        =   AxForm::getPost("_sExport");
        $this->_pFilterCols    =   htmlspecialchars(trim(AesCtr::de(AxForm::getPost("pFilterCols"))),ENT_QUOTES);
    }
    
    public function getGridAcciones(){
        $query = "call sp_confAccionesGrid(:iDisplayStart,:iDisplayLength,:pOrder,:pFilterCols,:sExport);";
        $parms = array(
            ":iDisplayStart" => $this->_pDisplayStart,
            ":iDisplayLength" => $this->_pDisplayLength,
            ":pOrder" => $this->_pOrder,
            ":pFilterCols" => $this->_pFilterCols,
            ":sExport" => $this->_sExport
        );
        $data = $this->queryAll($query,$parms);
       
        return $data;
    }
    
    public function mantenimiento(){
        $query = "call sp_confAccionesMantenimiento(:flag,:key,:accion,:alias,:activo,:icono,:theme,:usuario);";
        $parms = array(
            ':flag' => $this->_flag,
            ':key' => $this->_key,
            ':accion' => $this->_accion,
            ':alias' => $this->_alias,
            ':activo' => ($this->_activo == 'A')?$this->_activo:'I',
            ':icono' => $this->_icono,
            ':theme' => $this->_theme,
            ':usuario' => $this->_usuario
        );
        $data = $this->queryOne($query,$parms);
        return $data;
    }
    
    public function getAlias(){
        $query = "call sp_confAccionesConsultas(:flag,:criterio);";
        
        $parms = array(
            ":flag" => 2,
            ":criterio" => ''
        );
        $data = $this->queryAll($query,$parms);
       
        return $data;
    }
    
    public function getAccion(){
        $query = "call sp_confAccionesConsultas(:flag,:criterio);";
        $parms = array(
            ':flag' => 1,
            ':criterio' => $this->_key
        );
        $data = $this->queryOne($query,$parms);
        return $data;
    }
    
}