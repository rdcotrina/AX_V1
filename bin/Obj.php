<?php
/*
 * Documento   : Obj
 * Creado      : 21-ene-2014, 18:41:48
 * Autor       : RDCC
 * Descripcion : clase para instanciar todos los objetos registrados
 */
class Obj{
    
    public static $call;

    public function __construct() {
        self::$call = Registry::$get;
    }

    public static function run() {
        return Registry::$get;
    }
    
}