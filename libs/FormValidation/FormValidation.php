<?php
/**
 * Description of FormValidation
 *
 * @author RDCC www.rogerdavid.org
 */
class FormValidation {
    
    private $_labels = array();
    private $_rules = array();
    private $_field;
    private $_message;
    private $_messages = array(
        "required"=>"{label} es requerido.{br}",
        "email"=>"{label} no es un email válida.{br}",
        "url"=>"{label} no es una url válida.{br}",
        "date"=>"{label} no es una fecha válida.{br}",
        "time"=>'{label} no es una hora válida.{br}',
        "number"=>"{label} no es un número entero válido.{br}",
        "decimal"=>"{label} no es un número decimal válido.{br}",
        "equalto"=>"Introduzca el mismo valor de nuevo, en {label}.{br}",
        "noequalto"=>"Introduzca un valor diferente en {label}.{br}",
        "maxlength"=>"{label} debe contener como máximo {n} caracteres.{br}",
        "minlength"=>"{label} debe contener como minimo {n} caracteres.{br}",
        "rangelength"=>"{label} debe contener entre {i} y {f} caracteres de longitud.{br}",
        "range"=>"{label} debe ser entre {i} y {f}.{br}",
        "max"=>"{label} debe ser menor o igual a {n}.{br}",
        "min"=>"{label} debe ser mayor o igual a {n}.{br}"
    );

    /*
     * Carga los elementos a validar
     */
    public function filter($field) {
        $this->_field   = $field['field'];   /*guardo elemento q se esta configurando sus reglas*/
        
        /*se guarda los labels*/
        $this->_labels[$this->_field] = $field['label'];
        return $this;
    }
    
    /*
     * Carga las reglas de cada elemento a validar
     */
    public function rule($obj) {
        $this->_rules[$this->_field][] = $obj;
        
        return $this;
    }

    /*
     * Verifica si todos los elemntos se validaron
     */
    public function isTrue(){
        $this->_message = '';
        if($this->validator()){
            return true;
        }
        return false;
    }
    
    /*
     * Rretorna los mensajes de error
     */
    public function messages(){
        return str_replace('{br}', '<br>', $this->_message) ;
    }
    
    /*
     * Ejecuta cada una de las reglas
     */
    private function validator() {
        $element = '';  /*elemento del formulario a validar*/
        $error   = array();
        /*se recorre array que se configuro en el filter de la opcion a validar*/
        foreach ($this->_rules as $key => $value) {
            $element = $key;
            /*se recorre las reglas del elemento*/
            foreach($value as $rule){
                $ru = explode(':', $rule['rule']);
                
                $regla  = strtolower($ru[0]);           /*la regla para validar*/
                $params = isset($ru[1])?$ru[1]:null;    /*los parametros*/
                
                /*se ejecuta validacion segun la regla enviada y guardo los errores*/
                $error[] = $this->$regla($element,$regla,$params);      
            }
        }
       
        /*verfificar si existe algun error*/
        foreach ($error as $value) {
            if(!$value){
                return false;
            }
        }
        return true;
    }
    
    private function required($element,$regla,$params) {
        if(!AxForm::getPost($element)){
            $this->addMsn($element,$regla);
            return false;
        }else{
            return true;
        }
    }
    
    private function email($element,$regla,$params) {
        if (!preg_match('{^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,3})$}',AxForm::getPost($element)) && AxForm::getPost($element)){
            $this->addMsn($element,$regla);
            return false;
        }else{
            return true;
        }
    }
    
    private function url($element,$regla,$params) {
        if (!filter_var(AxForm::getPost($element), FILTER_VALIDATE_URL) && AxForm::getPost($element)) {
            $this->addMsn($element,$regla);
            return false;
        } else {
            return true;
        }
    }
    
    private function min($element,$regla,$params) {
        if((int)AxForm::getPost($element) < $params && AxForm::getPost($element)){
            $this->addMsn($element,$regla,$params);
            return false;
        }else{
            return true;
        }
    }
    
    private function max($element,$regla,$params) {
        if((int)AxForm::getPost($element) > $params && AxForm::getPost($element)){
            $this->addMsn($element,$regla,$params);
            return false;
        }else{
            return true;
        }
    }
    
    private function number($element,$regla,$params) {
        if (!filter_var(AxForm::getPost($element), FILTER_VALIDATE_INT) && AxForm::getPost($element)) {
            $this->addMsn($element,$regla);
            return false;
        } else {
            return true;
        }
    }
    
    private function decimal($element,$regla,$params) {
        if (!filter_var(AxForm::getPost($element), FILTER_VALIDATE_FLOAT) && AxForm::getPost($element)) {
            $this->addMsn($element,$regla);
            return false;
        } else {
            return true;
        }
    }
    
    private function date($element,$regla,$params) {
        $fech = str_replace('-', '*', AxForm::getPost($element));
        $fech = str_replace('.', '*', $fech);
        $fech = str_replace('/', '*', $fech);
       
        $fe = explode('*', $fech);
        
        $dia = null;
        $mes = null;
        $ani = null;
            
        /*verifico si es formato ddmmY o Ymmdd*/
        if(strlen($fe[0]) == 4){        /*Ymmdd*/
            $dia = $fe[2];
            $mes = isset($fe[1])?$fe[1]:'99';
            $ani = isset($fe[0])?$fe[0]:'99';
        }elseif(strlen($fe[0]) == 2){   /*ddmmY*/
            $dia = $fe[0];
            $mes = isset($fe[1])?$fe[1]:'99';
            $ani = isset($fe[2])?$fe[2]:'99';
        }
        
        /*verificar si son numeros*/
        if(!filter_var($mes.$dia.$ani, FILTER_VALIDATE_INT)){
            $this->addMsn($element,$regla);
            return false;
        }
        
        if((!checkdate($mes,$dia,$ani) || (strlen($dia) != 2 || strlen($mes) != 2 || strlen($ani) != 4)) && AxForm::getPost($element)){
            $this->addMsn($element,$regla);
            return false;
        }else{
            return true;
        }
    }
    
    private function time($element,$regla,$params) {
        $pattern="/^([0-1][0-9]|[2][0-3])[\:]([0-5][0-9])[\:]([0-5][0-9])$/";

        if(!preg_match($pattern,AxForm::getPost($element)) && AxForm::getPost($element)){
            $this->addMsn($element,$regla);
            return false;
        }else{
            return true;
        }
    }
    
    private function maxlength($element,$regla,$params) {
        if(strlen(AxForm::getPost($element)) > $params && AxForm::getPost($element)){
            $this->addMsn($element,$regla,$params);
            return false;
        }else{
            return true;
        }
    }
    
    private function minlength($element,$regla,$params) {
        if(strlen(AxForm::getPost($element)) < $params && AxForm::getPost($element)){
            $this->addMsn($element,$regla,$params);
            return false;
        }else{
            return true;
        }
    }
    
    private function range($element,$regla,$params) {
        $pr = explode(',', $params);
        $ini = $pr[0];
        $fin = $pr[1];
        
        if(((int)AxForm::getPost($element) >= $ini && (int)AxForm::getPost($element) <= $fin)){
            return true;
        }else{
            $this->addMsn($element,$regla,$ini,$fin);
            return false;
        }
    }
    
    private function rangelength($element,$regla,$params) {
        $pr = explode(',', $params);
        $ini = $pr[0];
        $fin = $pr[1];

        if(strlen(AxForm::getPost($element)) >= $ini || strlen(AxForm::getPost($element)) <= $fin){
            return true;
        }elseif(AxForm::getPost($element)){
            $this->addMsn($element,$regla,$ini,$fin);
            return false;
        }
    }
    
    private function equalto($element,$regla,$params) {
        if(AxForm::getPost($element) !== AxForm::getPost($params)){
            $this->addMsn($element,$regla);
            return false;
        }else{
            return true;
        }
    }
    
    private function noequalto($element,$regla,$params) {
        if(AxForm::getPost($element) === AxForm::getPost($params) && AxForm::getPost($element)){
            $this->addMsn($element,$regla);
            return false;
        }else{
            return true;
        }
    }
    
    /*
     * Carga los mensajes de error 
     */
    private function addMsn($element,$regla,$params1='',$params2=''){
        if(!empty($params1) && empty($params2)){
            $m = str_replace('{label}', $this->_labels[$element], $this->_messages[$regla]) ;
            $m = str_replace('{n}', $params1, $m) ;
            
            $this->_message .= $m;
        }elseif(!empty ($params2)) {
            $m = str_replace('{label}', $this->_labels[$element], $this->_messages[$regla]) ;
            $m = str_replace('{i}', $params1, $m) ;
            $m = str_replace('{f}', $params2, $m) ;
            
            $this->_message .= $m;
        }else{
            $this->_message .= str_replace('{label}', $this->_labels[$element], $this->_messages[$regla]) ;
        }
    }
    
}