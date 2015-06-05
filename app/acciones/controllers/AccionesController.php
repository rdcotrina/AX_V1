<?php

class AccionesController extends Controller{
    
    private static $Auditoria;
    
    private static $AccionesModel;

    public function __construct() {
        self::$AccionesModel = $this->loadModel();
        self::$Auditoria = $this->loadAuditoria();
    }
    
    public function index() {
        try{
            Obj::run()->View->render();
        }  catch (Exception $e){
            self::$Auditoria->logErrors($e);
        }
    }
    
    public function getGridAcciones(){
        try{
            $data =  self::$AccionesModel->getGridAcciones();
            
            echo json_encode($data);
        }  catch (Exception $e){
            self::$Auditoria->logErrors($e);
        }
        
    }
    
}
