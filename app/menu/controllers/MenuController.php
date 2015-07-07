<?php
/*
 * Documento   : configurarMenuController
 * Creado      : 05-jul-2014
 * Autor       : ..... .....
 * Descripcion : 
 */
class MenuController extends Controller{
    
    use Auditoria,
        MenuFilter{
            MenuFilter::__construct as private __mfConstruct;
        }
    
    private static $MenuModel;

    public function __construct() {
        $this->__mfConstruct();
        self::$MenuModel = $this->loadModel();
    }

    public function index(){
        try{
            Obj::run()->View->render();
            $this->auditar()->logAuditoria(AxForm::getPost('_rootTitle'));
        }  catch (Exception $e){
            $this->auditar()->logErrors($e);
        }
    }
    
    public static function getDominios(){   
        try{
            $rResult = self::$MenuModel->getDominios();
            return $rResult;
        }  catch (Exception $e){
            $this->auditar()->logErrors($e);
        }
    }
    
    public static function getModulos($dominio){  
        try{
            $rResult = self::$MenuModel->getModulos($dominio);
            return $rResult;
        }  catch (Exception $e){
            $this->auditar()->logErrors($e);
        }
    }
    
    public static function getMenus($modulo){    
        try{
            $rResult = self::$MenuModel->getMenus($modulo);
            return $rResult;
        }  catch (Exception $e){
            $this->auditar()->logErrors($e);
        }
    }
    
    public static function getOpciones($menu){  
        try{
            $rResult = self::$MenuModel->getOpciones($menu);
            return $rResult;
        }  catch (Exception $e){
            $this->auditar()->logErrors($e);
        }
    }
    
    public function dominios(){
        try{
            Obj::run()->View->render();
        }  catch (Exception $e){
            $this->auditar()->logErrors($e);
        }
    }
    
    public function formNuevoDominio(){
        try{
            Obj::run()->View->render();
            $this->auditar()->logAuditoria(AUDI_1);
        }  catch (Exception $e){
            $this->auditar()->logErrors($e);
        }
    }
    
    public function formNuevoModulo(){
        try{
            Obj::run()->View->render();
            $this->auditar()->logAuditoria(AUDI_2);
        }  catch (Exception $e){
            $this->auditar()->logErrors($e);
        }
    }
    
    public function formNewMenu(){
        try{
            Obj::run()->View->render();
            $this->auditar()->logAuditoria(AUDI_3);
        }  catch (Exception $e){
            $this->auditar()->logErrors($e);
        }
    }
    
    public function formEditDominio(){ 
        try{
            Obj::run()->View->render();
            $this->auditar()->logAuditoria(AUDI_4);
        }  catch (Exception $e){
            $this->auditar()->logErrors($e);
        }
    }
    
    public function formEditModulo(){ 
        try{
            Obj::run()->View->render();
            $this->auditar()->logAuditoria(AUDI_5);
        }  catch (Exception $e){
            $this->auditar()->logErrors($e);
        }
    }
    
    public function formEditMenu(){
        try{
            Obj::run()->View->render();
            $this->auditar()->logAuditoria(AUDI_6);
        }  catch (Exception $e){
            $this->auditar()->logErrors($e);
        }
    }
    
    public function formNewOpcion(){
        try{
            Obj::run()->View->render();
            $this->auditar()->logAuditoria(AUDI_7);
        }  catch (Exception $e){
            $this->auditar()->logErrors($e);
        }
    }
    
    public function formEditOpcion(){
        try{
            Obj::run()->View->render();
            $this->auditar()->logAuditoria(AUDI_8);
        }  catch (Exception $e){
            $this->auditar()->logErrors($e);
        }
    }
    
    public static function getDominio(){
        try{
            $data = self::$MenuModel->menuConsultas(2,AxForm::getPost('_idDominio'));
        
            return $data;
        }  catch (Exception $e){
            $this->auditar()->logErrors($e);
        }
    }
    
    public static function findModulo(){ 
        try{
            $data = self::$MenuModel->menuConsultas(4,AxForm::getPost('_idModulo'));
        
            return $data;
        }  catch (Exception $e){
            $this->auditar()->logErrors($e);
        }
    }
    
    public static function findMenu(){ 
        try{
            $data = self::$MenuModel->menuConsultas(6,AxForm::getPost('_idMenuPrincipal'));
        
            return $data;
        }  catch (Exception $e){
            $this->auditar()->logErrors($e);
        }
    }
    
    public static function findOpcion(){ 
        try{
            $data = self::$MenuModel->menuConsultas(8,AxForm::getPost('_idOpcion'));
        
            return $data;
        }  catch (Exception $e){
            $this->auditar()->logErrors($e);
        }
    }
    
    public function postNewDominio(){ 
        try{
            if($this->isValidateDominio()){
                $data = self::$MenuModel->mantenimientoDominio();
                $this->auditar()->logAuditoria(AUDI_9);
            }else{
                $data = $this->valida()->messages();
            }
            echo json_encode($data);
        }  catch (Exception $e){
            $this->auditar()->logErrors($e);
        }
    }
    
    public function postEditDominio(){ 
        try{
            if($this->isValidateDominio()){
                $data = self::$MenuModel->mantenimientoDominio();
                $this->auditar()->logAuditoria(AUDI_10);
            }else{
                $data = $this->valida()->messages();
            }
            echo json_encode($data);
        }  catch (Exception $e){
            $this->auditar()->logErrors($e);
        }
    }
    
    public function deleteDominio(){ 
        try{
            $data = self::$MenuModel->mantenimientoDominio();
        
            echo json_encode($data);
            $this->auditar()->logAuditoria(AUDI_11);
        }  catch (Exception $e){
            $this->auditar()->logErrors($e);
        }
    }
    
    public function postNewModulo(){ 
        try{
            if($this->isValidateModulo()){
                $data = self::$MenuModel->mantenimientoModulo();
                $this->auditar()->logAuditoria(AUDI_12);
            }else{
                $data = $this->valida()->messages();
            }
            echo json_encode($data);
        }  catch (Exception $e){
            $this->auditar()->logErrors($e);
        }
    }
    
    public function postEditModulo(){ 
        try{
            if($this->isValidateModulo()){
                $data = self::$MenuModel->mantenimientoModulo();
                $this->auditar()->logAuditoria(AUDI_13);
            }else{
                $data = $this->valida()->messages();
            }
            echo json_encode($data);
        }  catch (Exception $e){
            $this->auditar()->logErrors($e);
        }
    }
    
    public function postDeleteModulo(){ 
        try{
            $data = self::$MenuModel->mantenimientoModulo();
        
            echo json_encode($data);
            $this->auditar()->logAuditoria(AUDI_14);
        }  catch (Exception $e){
            $this->auditar()->logErrors($e);
        }
    }
    
    public function postNewMenu(){ 
        try{
            if($this->isValidateMenu()){
                $data = self::$MenuModel->mantenimientoMenuPrincipal();
                $this->auditar()->logAuditoria(AUDI_15);
            }else{
                $data = $this->valida()->messages();
            }
            echo json_encode($data);
        }  catch (Exception $e){
            $this->auditar()->logErrors($e);
        }
    }
    
    public function postEditMenu(){ 
        try{
            if($this->isValidateMenu()){
                $data = self::$MenuModel->mantenimientoMenuPrincipal();
                $this->auditar()->logAuditoria(AUDI_16);
            }else{
                $data = $this->valida()->messages();
            }
            echo json_encode($data);
        }  catch (Exception $e){
            $this->auditar()->logErrors($e);
        }
    }
    
    public function postDeleteMenu(){ 
        try{
            $data = self::$MenuModel->mantenimientoMenuPrincipal();
        
            echo json_encode($data);
            $this->auditar()->logAuditoria(AUDI_17);
        }  catch (Exception $e){
            $this->auditar()->logErrors($e);
        }
    }
    
    public function postNewOpcion(){ 
        try{
            if($this->isValidateOpcion()){
                $data = self::$MenuModel->mantenimientoOpcion();
                $this->auditar()->logAuditoria(AUDI_18);
            }else{
                $data = $this->valida()->messages();
            }
            echo json_encode($data);
        }  catch (Exception $e){
            $this->auditar()->logErrors($e);
        }
    }
    
    public function postEditOpcion(){ 
        try{
            if($this->isValidateOpcion()){
                $data = self::$MenuModel->mantenimientoOpcion();
                $this->auditar()->logAuditoria(AUDI_19);
            }else{
                $data = $this->valida()->messages();
            }
            echo json_encode($data);
        }  catch (Exception $e){
            $this->auditar()->logErrors($e);
        }
    }
    
    public function postDeleteOpcion(){ 
        try{
            $data = self::$MenuModel->mantenimientoOpcion();
        
            echo json_encode($data);
            $this->auditar()->logAuditoria(AUDI_20);
        }  catch (Exception $e){
            $this->auditar()->logErrors($e);
        }
    }
    
    public function postSortDominio(){ 
        try{
            $data = self::$MenuModel->mantenimientoDominio();
        
            echo json_encode($data);
        }  catch (Exception $e){
            $this->auditar()->logErrors($e);
        }
    }
    
    public function postOrdenarModulo(){ 
        try{
            $data = self::$MenuModel->mantenimientoModulo();
        
            echo json_encode($data);
        }  catch (Exception $e){
            $this->auditar()->logErrors($e);
        }
    }
    
    public function postOrdenarMenu(){ 
        try{
            $data = self::$MenuModel->mantenimientoMenuPrincipal();
        
            echo json_encode($data);
        }  catch (Exception $e){
            $this->auditar()->logErrors($e);
        }
    }
    
    public function postOrdenarOpciones(){ 
        try{
            $data = self::$MenuModel->mantenimientoOpcion();
        
            echo json_encode($data);
        }  catch (Exception $e){
            $this->auditar()->logErrors($e);
        }
    }
    
}