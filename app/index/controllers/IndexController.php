<?php
/*
 * --------------------------------------
 * creado por:  RDCC
 * fecha: 03.01.2014
 * indexController.php
 * --------------------------------------
 */
class IndexController extends Controller{
    
    private static $Auditoria;
    
    private static $indexModel;

    private static $loginModel;

    public function __construct() {  
        try{
            self::$indexModel = $this->loadModel();
            self::$loginModel = $this->loadModel(array('modulo'=>'index','modelo'=>'Login'));
        }  catch (Exception $e){
            self::$Auditoria->logErrors($e);
        }
    }

    public function index(){
        try{
            if(Session::get('sys_idUsuario')){  
                Session::set('sys_menu', $this->getMenu());
                Obj::run()->View->render('index',false);
            }else{
                Obj::run()->View->render('login',false);
            }
        }  catch (Exception $e){
            self::$Auditoria->logErrors($e);
        }
        
    }

    private function getMenu(){
        try{
            return self::$loginModel->getMenu();
        }  catch (Exception $e){
            self::$Auditoria->logErrors($e);
        }
    }
    
    public function getAccionesOpcion($opcion){
        try{
            return self::$loginModel->getAccionesOpcion($opcion);
        }  catch (Exception $e){
            self::$Auditoria->logErrors($e);
        }
    }
    
    public function menu(){
        try{
            Obj::run()->View->render();
        }  catch (Exception $e){
            self::$Auditoria->logErrors($e);
        }
    }
    
    public function lock(){
        try{
            Session::destroy();
            Obj::run()->View->usuario = Session::get('sys_usuario');
            Obj::run()->View->nameUsuario = Session::get('sys_nombreUsuario');
            Obj::run()->View->render('lock',true);
            
            $ev = LBL_LOCK;
            self::$Auditoria->logAuditoria($ev);
        }  catch (Exception $e){
            self::$Auditoria->logErrors($e);
        }
    }
    
    public function changeRol(){
        try{
            $idRol = SimpleForm::getPost('_idRol');
            $rol   = Session::get('sys_defaultNameRol');

            foreach (Session::get('sys_roles') as $value) {
                if($value['id_rol'] == $idRol){
                    Session::set('sys_defaultRol', $value['id_rol']);
                    Session::set('sys_defaultNameRol', $value['rol']);
                }
            }

            $result = array('result'=> 1);
            echo json_encode($result);
            
            $ev = 'Cambió de rol: de '.$rol.' a '.Session::get('sys_defaultNameRol');
            self::$Auditoria->logAuditoria($ev);
        }  catch (Exception $e){
            self::$Auditoria->logErrors($e);
        }
        
    }
    
}
