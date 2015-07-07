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
    
    public function isValidateDominio() {
        $this->valida()
            ->filter(['field'=>T3.'txt_dominio','label'=>M_FG_DOM_L_DOM])
                ->rule(['rule'=>'required'])
                ->rule(['rule'=>'minlength:5'])
            ->filter(['field'=>T3.'txt_icono','label'=>M_FG_DOM_L_ICON])
                ->rule(['rule'=>'required'])
                ->rule(['rule'=>'minlength:5']);
            
            if($this->valida()->isTrue()){
                return true;
            }
            return false;
    }
    
    public function isValidateModulo() {
        $this->valida()
            ->filter(['field'=>T3.'txt_modulo','label'=>M_FG_MOD_L_MOD])
                ->rule(['rule'=>'required'])
                ->rule(['rule'=>'minlength:3']);
            
            if($this->valida()->isTrue()){
                return true;
            }
            return false;
    }
    
    public function isValidateMenu() {
        $this->valida()
            ->filter(['field'=>T3.'txt_menu','label'=>M_FE_MNU_L_MNU])
                ->rule(['rule'=>'required'])
                ->rule(['rule'=>'minlength:3']);
            
            if($this->valida()->isTrue()){
                return true;
            }
            return false;
    }
    
    public function isValidateOpcion() {
        $this->valida()
            ->filter(['field'=>T3.'txt_opcion','label'=>M_FE_OPC_L_OPC])
                ->rule(['rule'=>'required'])
                ->rule(['rule'=>'minlength:3'])
            ->filter(['field'=>T3.'txt_alias','label'=>M_FE_OPC_L_OPC_AL])
                ->rule(['rule'=>'required'])
                ->rule(['rule'=>'minlength:3'])
                ->rule(['rule'=>'maxlength:5'])
            ->filter(['field'=>T3.'txt_url','label'=>M_FE_OPC_L_OPC_URL])
                ->rule(['rule'=>'required'])
                ->rule(['rule'=>'minlength:3']);
            
            if($this->valida()->isTrue()){
                return true;
            }
            return false;
    }
    
    public function messages() {
        return $this->valida()->messages();
    }
        
}
