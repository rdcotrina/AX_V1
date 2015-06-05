<?php

class AuditoriaModel extends Database {
    
    private $_txt;
    
    public function __construct() {
        parent::__construct();
        $this->_set();
    }

    private function _set(){
        $this->_txt  =   SimpleForm::getPost('_txt'); 
        $this->_usuario = Session::get('sys_idUsuario');
    }
    
    public function insertAuditoria($evento=''){
        if(!empty($evento)){
            $this->_txt = $evento;
        }
        
        $query = "INSERT INTO a_auditoria (evento,id_usuario)"
                . "VALUES(:evento, :usuario);";
        
        $parms = array(
            ':evento' => $this->_txt,
            ':usuario' => $this->_usuario
        );
        $this->execute($query,$parms);
        
        $data = array('result'=>1);
        return $data;
    }
    
}