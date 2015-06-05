<?php
/*
 * Documento   : configurarMenuController
 * Creado      : 05-jul-2014
 * Autor       : ..... .....
 * Descripcion : 
 */
class MenuController extends Controller{
    
    private static $Auditoria;
    
    private static $MenuModel;

    public function __construct() {
        self::$MenuModel = $this->loadModel();
        self::$Auditoria = $this->loadAuditoria();
    }

    public function index(){
        try{
            Obj::run()->View->render();
            self::$Auditoria->logAuditoria(SimpleForm::getPost('_rootTitle'));
        }  catch (Exception $e){
            self::$Auditoria->logErrors($e);
        }
    }
    
    public static function getDominios(){   
        try{
            $rResult = self::$MenuModel->getDominios();
            return $rResult;
        }  catch (Exception $e){
            self::$Auditoria->logErrors($e);
        }
    }
    
    public static function getModulos($dominio){  
        try{
            $rResult = self::$MenuModel->getModulos($dominio);
            return $rResult;
        }  catch (Exception $e){
            self::$Auditoria->logErrors($e);
        }
    }
    
    public static function getMenus($modulo){    
        try{
            $rResult = self::$MenuModel->getMenus($modulo);
            return $rResult;
        }  catch (Exception $e){
            self::$Auditoria->logErrors($e);
        }
    }
    
    public static function getOpciones($menu){  
        try{
            $rResult = self::$MenuModel->getOpciones($menu);
            return $rResult;
        }  catch (Exception $e){
            self::$Auditoria->logErrors($e);
        }
    }
    
    public function dominios(){
        try{
            Obj::run()->View->render();
        }  catch (Exception $e){
            self::$Auditoria->logErrors($e);
        }
    }
    
    public function formNuevoDominio(){
        try{
            Obj::run()->View->render();
            self::$Auditoria->logAuditoria(AUDI_1);
        }  catch (Exception $e){
            self::$Auditoria->logErrors($e);
        }
    }
    
    public function formNuevoModulo(){
        try{
            Obj::run()->View->render();
            self::$Auditoria->logAuditoria(AUDI_2);
        }  catch (Exception $e){
            self::$Auditoria->logErrors($e);
        }
    }
    
    public function formNewMenu(){
        try{
            Obj::run()->View->render();
            self::$Auditoria->logAuditoria(AUDI_3);
        }  catch (Exception $e){
            self::$Auditoria->logErrors($e);
        }
    }
    
    public function formEditDominio(){ 
        try{
            Obj::run()->View->render();
            self::$Auditoria->logAuditoria(AUDI_4);
        }  catch (Exception $e){
            self::$Auditoria->logErrors($e);
        }
    }
    
    public function formEditModulo(){ 
        try{
            Obj::run()->View->render();
            self::$Auditoria->logAuditoria(AUDI_5);
        }  catch (Exception $e){
            self::$Auditoria->logErrors($e);
        }
    }
    
    public function formEditMenu(){
        try{
            Obj::run()->View->render();
            self::$Auditoria->logAuditoria(AUDI_6);
        }  catch (Exception $e){
            self::$Auditoria->logErrors($e);
        }
    }
    
    public function formNewOpcion(){
        try{
            Obj::run()->View->render();
            self::$Auditoria->logAuditoria(AUDI_7);
        }  catch (Exception $e){
            self::$Auditoria->logErrors($e);
        }
    }
    
    public function formEditOpcion(){
        try{
            Obj::run()->View->render();
            self::$Auditoria->logAuditoria(AUDI_8);
        }  catch (Exception $e){
            self::$Auditoria->logErrors($e);
        }
    }
    
    public static function getDominio(){
        try{
            $data = self::$MenuModel->menuConsultas(2,SimpleForm::getPost('_idDominio'));
        
            return $data;
        }  catch (Exception $e){
            self::$Auditoria->logErrors($e);
        }
    }
    
    public static function findModulo(){ 
        try{
            $data = self::$MenuModel->menuConsultas(4,SimpleForm::getPost('_idModulo'));
        
            return $data;
        }  catch (Exception $e){
            self::$Auditoria->logErrors($e);
        }
    }
    
    public static function findMenu(){ 
        try{
            $data = self::$MenuModel->menuConsultas(6,SimpleForm::getPost('_idMenuPrincipal'));
        
            return $data;
        }  catch (Exception $e){
            self::$Auditoria->logErrors($e);
        }
    }
    
    public static function findOpcion(){ 
        try{
            $data = self::$MenuModel->menuConsultas(8,SimpleForm::getPost('_idOpcion'));
        
            return $data;
        }  catch (Exception $e){
            self::$Auditoria->logErrors($e);
        }
    }
    
    public function postNewDominio(){ 
        try{
            $data = self::$MenuModel->mantenimientoDominio();
        
            echo json_encode($data);
            self::$Auditoria->logAuditoria(AUDI_9);
        }  catch (Exception $e){
            self::$Auditoria->logErrors($e);
        }
    }
    
    public function postEditDominio(){ 
        try{
            $data = self::$MenuModel->mantenimientoDominio();
        
            echo json_encode($data);
            self::$Auditoria->logAuditoria(AUDI_10);
        }  catch (Exception $e){
            self::$Auditoria->logErrors($e);
        }
    }
    
    public function deleteDominio(){ 
        try{
            $data = self::$MenuModel->mantenimientoDominio();
        
            echo json_encode($data);
            self::$Auditoria->logAuditoria(AUDI_11);
        }  catch (Exception $e){
            self::$Auditoria->logErrors($e);
        }
    }
    
    public function postNewModulo(){ 
        try{
            $data = self::$MenuModel->mantenimientoModulo();
        
            echo json_encode($data);
            self::$Auditoria->logAuditoria(AUDI_12);
        }  catch (Exception $e){
            self::$Auditoria->logErrors($e);
        }
    }
    
    public function postEditModulo(){ 
        try{
            $data = self::$MenuModel->mantenimientoModulo();
        
            echo json_encode($data);
            self::$Auditoria->logAuditoria(AUDI_13);
        }  catch (Exception $e){
            self::$Auditoria->logErrors($e);
        }
    }
    
    public function postDeleteModulo(){ 
        try{
            $data = self::$MenuModel->mantenimientoModulo();
        
            echo json_encode($data);
            self::$Auditoria->logAuditoria(AUDI_14);
        }  catch (Exception $e){
            self::$Auditoria->logErrors($e);
        }
    }
    
    public function postNewMenu(){ 
        try{
            $data = self::$MenuModel->mantenimientoMenuPrincipal();
        
            echo json_encode($data);
            self::$Auditoria->logAuditoria(AUDI_15);
        }  catch (Exception $e){
            self::$Auditoria->logErrors($e);
        }
    }
    
    public function postEditMenu(){ 
        try{
            $data = self::$MenuModel->mantenimientoMenuPrincipal();
        
            echo json_encode($data);
            self::$Auditoria->logAuditoria(AUDI_16);
        }  catch (Exception $e){
            self::$Auditoria->logErrors($e);
        }
    }
    
    public function postDeleteMenu(){ 
        try{
            $data = self::$MenuModel->mantenimientoMenuPrincipal();
        
            echo json_encode($data);
            self::$Auditoria->logAuditoria(AUDI_17);
        }  catch (Exception $e){
            self::$Auditoria->logErrors($e);
        }
    }
    
    public function postNewOpcion(){ 
        try{
            $data = self::$MenuModel->mantenimientoOpcion();
        
            echo json_encode($data);
            self::$Auditoria->logAuditoria(AUDI_18);
        }  catch (Exception $e){
            self::$Auditoria->logErrors($e);
        }
    }
    
    public function postEditOpcion(){ 
        try{
            $data = self::$MenuModel->mantenimientoOpcion();
        
            echo json_encode($data);
            self::$Auditoria->logAuditoria(AUDI_19);
        }  catch (Exception $e){
            self::$Auditoria->logErrors($e);
        }
    }
    
    public function postDeleteOpcion(){ 
        try{
            $data = self::$MenuModel->mantenimientoOpcion();
        
            echo json_encode($data);
            self::$Auditoria->logAuditoria(AUDI_20);
        }  catch (Exception $e){
            self::$Auditoria->logErrors($e);
        }
    }
    
    public function postSortDominio(){ 
        try{
            $data = self::$MenuModel->mantenimientoDominio();
        
            echo json_encode($data);
        }  catch (Exception $e){
            self::$Auditoria->logErrors($e);
        }
    }
    
    public function postOrdenarModulo(){ 
        try{
            $data = self::$MenuModel->mantenimientoModulo();
        
            echo json_encode($data);
        }  catch (Exception $e){
            self::$Auditoria->logErrors($e);
        }
    }
    
    public function postOrdenarMenu(){ 
        try{
            $data = self::$MenuModel->mantenimientoMenuPrincipal();
        
            echo json_encode($data);
        }  catch (Exception $e){
            self::$Auditoria->logErrors($e);
        }
    }
    
    public function postOrdenarOpciones(){ 
        try{
            $data = self::$MenuModel->mantenimientoOpcion();
        
            echo json_encode($data);
        }  catch (Exception $e){
            self::$Auditoria->logErrors($e);
        }
    }
    
}