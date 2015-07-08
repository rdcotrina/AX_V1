<?php

trait AccionesFilter{
    
    use FormValida{
            FormValida::__construct as private __fvConstruct;
        }
        
    public function __construct() {
        $this->__fvConstruct();
    }
    
    public function isValidateAccion() {
        $this->valida()
            ->filter(['field'=>T2.'txt_accion','label'=>AXI_6])
                ->rule(['rule'=>'required'])
                ->rule(['rule'=>'minlength:3'])
            ->filter(['field'=>T2.'txt_alias','label'=>AXI_7])
                ->rule(['rule'=>'required'])
                ->rule(['rule'=>'rangelength:3,5'])
            ->filter(['field'=>T2.'txt_icono','label'=>AXI_8])
                ->rule(['rule'=>'required'])
                ->rule(['rule'=>'minlength:3'])
            ->filter(['field'=>T2.'txt_theme','label'=>AXI_9])
                ->rule(['rule'=>'required'])
                ->rule(['rule'=>'minlength:3']);
            
            if($this->valida()->isTrue()){
                return true;
            }
            return false;
    }
    
}