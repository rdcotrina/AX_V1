<?php

class AccionesModel extends Database{
    
    /*para el grid*/
    private $_pDisplayStart;
    private $_pDisplayLength;
    private $_pSortingCols;
//    private $_pSearch;
    private $_pOrder;
    private $_sFilterCols;
    
    public function __construct() {
        parent::__construct();
        $this->_set();
    }
    
    private function _set(){
        $this->_pDisplayStart  =   SimpleForm::getPost("pDisplayStart"); 
        $this->_pDisplayLength =   SimpleForm::getPost("pDisplayLength"); 
        $this->_pSortingCols   =   SimpleForm::getPost("pSortingCols");
        $this->_pOrder         =   SimpleForm::getPost("pOrder");
        $this->_sFilterCols    =   htmlspecialchars(trim(AesCtr::de(SimpleForm::getPost("pFilterCols"))),ENT_QUOTES);
    }
    
    public function getGridAcciones(){
        $query = "call sp_rolesAccionesGrid(:iDisplayStart,:iDisplayLength,:pOrder,:pFilterCols);";
        
        $parms = array(
            ":iDisplayStart" => $this->_pDisplayStart,
            ":iDisplayLength" => $this->_pDisplayLength,
            ":pOrder" => $this->_pOrder,
            ":pFilterCols" => $this->_sFilterCols
        );
        $data = $this->queryAll($query,$parms);
       
        return $data;
    }
    
}