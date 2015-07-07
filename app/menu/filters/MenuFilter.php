<?php

/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
trait MenuFilter{
    
    use FormValida{
            FormValida::__construct as private __vaConstruct;
        }
        
    public function __construct() {
        $this->__vaConstruct();
    }
    
    public function isValidate() {
        $this->valida()
            ->filter(['field'=>T3.'txt_dominio','label'=>M_FG_DOM_L_DOM])
                ->rule(['rule'=>'required'])
                ->rule(['rule'=>'email'])
                ->rule(['rule'=>'url'])
            ->filter(['field'=>T3.'txt_icono','label'=>M_FG_DOM_L_ICON])
                ->rule(['rule'=>'required'])
                ->rule(['rule'=>'minlength:3'])
            ->filter(['field'=>T3.'chk_activo','label'=>CK_ACTIVO])
                ->rule(['rule'=>'required']);
            
            if($this->valida()->isTrue()){
                return true;
            }
            return false;
    }
    
    public function messages() {
        return $this->valida()->messages();
    }
        
}
