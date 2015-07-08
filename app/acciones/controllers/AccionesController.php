<?php

class AccionesController extends Controller{
    
    use Auditoria,
        AccionesFilter{
            AccionesFilter::__construct as private __axConstruct;
        }
    
    private static $AccionesModel;

    public function __construct() {
        $this->__axConstruct();
        self::$AccionesModel = $this->loadModel();
    }
    
    public function index() {
        try{
            Obj::run()->View->render();
        }  catch (Exception $e){
            $this->auditar()->logErrors($e);
        }
    }
    
    public function getGridAcciones(){
        try{
            $data =  self::$AccionesModel->getGridAcciones();
            
            echo json_encode($data);
        }  catch (Exception $e){
            $this->auditar()->logErrors($e);
        }
    }
    
    public function getAlias(){
        try{
            $data =  self::$AccionesModel->getAlias();
            
            $res = array(
                'dataServer'=>$data, 
                'field'=> AxForm::getPost('_field'),
                'opt'=>AxForm::getAll('_options')
            );
            
            echo json_encode($res);
        }  catch (Exception $e){
            $this->auditar()->logErrors($e);
        }
    }
    
    public function getAccion(){ 
        try{
            $data = self::$AccionesModel->getAccion();
        
            return $data;
        }  catch (Exception $e){
            $this->auditar()->logErrors($e);
        }
    }
    
    public function formNuevaAccion(){
        try{
            Obj::run()->View->render();
            $this->auditar()->logAuditoria(AXI_2);
        }  catch (Exception $e){
            $this->auditar()->logErrors($e);
        }
    }
    
    public function formEditAccion(){
        try{
            Obj::run()->View->render();
            $this->auditar()->logAuditoria(AXI_3);
        }  catch (Exception $e){
            $this->auditar()->logErrors($e);
        }
    }
    
    public function postNuevaAccion(){ 
        try{
            if($this->isValidateAccion()){
                $data = self::$AccionesModel->mantenimiento();
                $this->auditar()->logAuditoria(AXI_14);
            }else{
                $data = $this->valida()->messages();
            }
            echo json_encode($data);
        }  catch (Exception $e){
            $this->auditar()->logErrors($e);
        }
    }
    
    public function postEditAccion(){ 
        try{
            if($this->isValidateAccion()){
                $data = self::$AccionesModel->mantenimiento();
                $this->auditar()->logAuditoria(AXI_15);
            }else{
                $data = $this->valida()->messages();
            }
            echo json_encode($data);
        }  catch (Exception $e){
            $this->auditar()->logErrors($e);
        }
    }
    
    public function postDeleteAccion(){ 
        try{
            $data = self::$AccionesModel->mantenimiento();
        
            echo json_encode($data);
        }  catch (Exception $e){
            $this->auditar()->logErrors($e);
        }
    }
    
}
