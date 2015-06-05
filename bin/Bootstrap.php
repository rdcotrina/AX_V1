<?php

/*
 * --------------------------------------
 * creado por:  RDCC
 * fecha: 03.01.2014
 * Bootstrap.php
 * --------------------------------------
 */

class Bootstrap {

    public static function run(Request $peticion) {
        $modulo = $peticion->getModulo();
        $controller = $peticion->getControlador() . 'Controller';
        
        $rutaControlador = ROOT . DEFAULT_APP_FOLDER . DS . $modulo. DS . 'controllers' . DS . $controller . '.php';
        
        $metodo = $peticion->getMetodo();
        $args = $peticion->getArgumentos(); #se obtiene los argumentos

        if (is_readable($rutaControlador)) {
            require_once ($rutaControlador);
            Registry::anonimous($controller); /*registro el controlador por unica vez*/
            
            if (!is_callable(array(Obj::run()->$controller, $metodo))) {
                throw new Exception('Error de Metodo: <b>'.$metodo.'</b> no encontrado.');
            }

            if (isset($args)) {
                call_user_func_array(array(Obj::run()->$controller, $metodo), $args);
            } else {
                call_user_func(array(Obj::run()->$controller, $metodo));
            }
        } else {
            throw new Exception('Error de Controlador: <b>'.$rutaControlador.'</b> no encontrado.');
        }
    }

}