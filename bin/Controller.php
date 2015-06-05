<?php
/*
 * --------------------------------------
 * creado por:  RDCC
 * fecha: 03.01.2014
 * Controller.php
 * --------------------------------------
 */
abstract class Controller extends Obj{
    
    /*para crear el onjeto $call;*/
    public function __construct() {
        parent::__construct();
    }

    #obliga a que todas las clases que heredan Controller tengan un metodo index,
    #esto es para la validacion del metodo en Request
    abstract public function index(); 
    
    /*para llamar controladores de un modulo a otro*/
    protected function loadController($control){
        $modulo = $control['modulo'];
        $controller = $control['controller'] . 'Controller';
        $rutaControlador = ROOT . DEFAULT_APP_FOLDER . DS . $modulo. DS . 'controllers' . DS . $controller . '.php';
        
        if (is_readable($rutaControlador)) {
            require_once ($rutaControlador);
            Registry::anonimous($controller); /*registro el controlador por unica vez*/
        } else {
            echo 'Error de Controlador: <b>'.$rutaControlador.'</b> no encontrado.';
        }
    }

    protected function loadModel($modelo=''){   
        /*se verifica si es array*/
        if(is_array($modelo)){ /*esto es para cuando modelo se llamara desde un modulo externo*/
            $mod = $modelo['modelo'] . 'Model';
            
            $rutaModelo = ROOT . DEFAULT_APP_FOLDER . DS . $modelo['modulo'] . DS .'models' . DS . $mod . '.php';
        }else{/*se carga modelo desde el mismo modulo*/
           
            if(empty($modelo)){
                /*detectar en que metodo se ejecuta loadModel();*/
                $e = new Exception();
                $trace = $e->getTrace();
                $last_call = $trace[1]; /*trae datos de clase donde se ejecuta loadModel()*/
                $modelo = $last_call['class'];
            }
            
            /*verifica si modelo tiene la palabra Controller*/
            $c = strpos($modelo,'Controller'); 
                 
            if($c){
                /*se extrae la palabra Controller*/
                $mod = substr($modelo,0,-10) . 'Model';
            }else{
                $mod = $modelo.'Model';
            }
            $rutaModelo = ROOT . DEFAULT_APP_FOLDER . DS . Obj::run()->Request->getModulo() . DS .'models' . DS . $mod . '.php';
        }
        
        if(is_readable($rutaModelo)){
            require_once ($rutaModelo);
            return new $mod; /*retorna instancia del objeto*/
        }else{
            throw new Exception('Error de Modelo: <b>'.$rutaModelo.'</b> no encontrado');
        }
    }
    
    protected function loadAuditoria(){
        require_once (ROOT . DEFAULT_APP_FOLDER . DS . 'auditoria' . DS . 'controllers' . DS . 'AuditoriaController.php');
        return new AuditoriaController();
    }

    protected function redirect($ruta = false){
        if($ruta){
            header('location:' . BASE_URL . $ruta);
        }else{
            header('location:' . BASE_URL);
        }
    }
    
}