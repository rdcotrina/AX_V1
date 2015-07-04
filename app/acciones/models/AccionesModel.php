<?php

class AccionesModel extends Database{
    
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
        $this->_pDisplayStart  =   AxForm::getPost("pDisplayStart"); 
        $this->_pDisplayLength =   AxForm::getPost("pDisplayLength"); 
        $this->_pSortingCols   =   AxForm::getPost("pSortingCols");
        $this->_pOrder         =   AxForm::getPost("pOrder");
        $this->_sExport        =   AxForm::getPost("_sExport");
        $this->_pFilterCols    =   htmlspecialchars(trim(AesCtr::de(AxForm::getPost("pFilterCols"))),ENT_QUOTES);
    }
    
    public function getGridAcciones(){
        $query = "call sp_rolesAccionesGrid(:iDisplayStart,:iDisplayLength,:pOrder,:pFilterCols,:sExport);";
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
    
    public function getAlias(){
        $query = "call sp_rolesAccionesConsultas(:flag,:criterio);";
        
        $parms = array(
            ":flag" => 2,
            ":criterio" => ''
        );
        $data = $this->queryAll($query,$parms);
       
        return $data;
    }
    
}