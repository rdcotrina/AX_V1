<?php
/*
 * Carga controlador para grabar auditorias y logs
 */
require_once (ROOT . DEFAULT_APP_FOLDER . DS . 'auditoria' . DS . 'controllers' . DS . 'AuditoriaController.php');

trait Auditoria {
    
    public function auditar(){
        return new AuditoriaController();
    }
    
}
