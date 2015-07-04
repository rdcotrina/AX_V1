<?php

class AccionesController extends Controller{
    
    use Auditoria;
    
    private static $AccionesModel;

    public function __construct() {
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
    
}
