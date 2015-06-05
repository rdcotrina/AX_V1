<?php

class AuditoriaController extends Controller{
    
    private static $auditoriaModel;

    public function __construct() {
        self::$auditoriaModel = $this->loadModel(array('modulo'=>'auditoria','modelo'=>'Auditoria'));
    }
    
    public function index(){}
    
    public function logAuditoria($ev='') {
        $data = self::$auditoriaModel->insertAuditoria($ev);
        
        if(!empty($ev)){
            return $data;
        }else{
            echo json_encode($data);
        }
    }
    
    public function logErrors($exception=''){
        $fecha      = 'Fecha: '.date('d-m-Y H:m:s');
        
        if(empty($exception)){
            $_entorno   = 'ERROR EN EL CLIENTE:';
            $_archivo   = 'Archivo: '.SimpleForm::getPost('_archivo');
            $_metodo    = 'Método: '.SimpleForm::getPost('_metodo');
            $_error     = 'Error: '.SimpleForm::getPost('_error');
            $_columna   = 'Columna: '.SimpleForm::getPost('_columna');
            $_linea     = 'Línea: '.SimpleForm::getPost('_linea');

            $pos        = strpos($_metodo, '@');
            $_metodo    = substr($_metodo,0, $pos);
        }else{
            $trace = $exception->getTrace();
            $last_call = $trace[0]; 
         
            $_entorno   = 'ERROR EN EL SERVIDOR:';
            $_archivo   = 'Archivo: '.$exception->getFile();
            $_metodo    = 'Método: '.$last_call['function'];
            $_error     = 'Error: '.$exception->getMessage();
            $_columna   = '';
            $_linea     = 'Línea: '.$exception->getLine();
        }
        
        
        
        $fp = fopen(ROOT.'log/logErrors.txt', 'a');
        fwrite($fp, chr(13).chr(10).$_entorno);
        fwrite($fp, chr(13).chr(10).'====================');
        fwrite($fp, chr(13).chr(10).$fecha);
        fwrite($fp, chr(13).chr(10).$_archivo);
        fwrite($fp, chr(13).chr(10).$_metodo);
        fwrite($fp, chr(13).chr(10).$_error);
        fwrite($fp, chr(13).chr(10).$_linea);
        fwrite($fp, chr(13).chr(10).$_columna);
        fwrite($fp, chr(13).chr(10));
        fwrite($fp, chr(13).chr(10));
        fclose($fp);
        
        $data = array('result'=>1);
        echo json_encode($data);
    }
    
}