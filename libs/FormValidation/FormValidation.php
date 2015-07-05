<?php
/**
 * Description of FormValidation
 *
 * @author DAVID
 */
class FormValidation {
    
    private $_input = array();
    private $_rules = array();
    private $_field;


    public function input($field) {
        $this->_input[] = $field;
        $this->_field   = $field;   /*guardo elemento q se esta configurando sus reglas*/
        return $this;
    }
    
    public function rule($obj) {
        $this->_rules[$this->_field][] = $obj;
        
        
        return $this;
    }
    
    /*
     *  required : "Este campo es requerido",
        email : "Ingrese un email válido",
        url : "Ingrese una URL válida",
        date : "Ingrese una fecha válida",
        time : 'Ingrese una hora válida',
        number : "Ingrese un número válido",
        equalTo : "Ingrese el mismo valor de nuevo",
        maxlength : $.validator.format("Ingrese un máximo de {0} caracteres"),
        minlength : $.validator.format("Ingrese un minimo de {0} caracteres"),
        rangelength : $.validator.format("Ingrese un valor entre {0} y {1} caracteres de longitud"),
        range : $.validator.format("Ingrese un valor entre {0} y {1}"),
        max : $.validator.format("Ingrese un valor menor o igual a {0}"),
        min : $.validator.format("Ingrese un valor mayor o igual a {0}")
     */
    public function isTrue(){
        print_r($this->_rules);
    }
    
    public function error(){
        
    }
    
}
