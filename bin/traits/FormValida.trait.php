<?php

trait FormValida{
    
    private $_obj;

    public function __construct(){
        $this->_obj = new FormValidation();
    }
    
    public function valida() {
        return $this->_obj;
    }
    
}
