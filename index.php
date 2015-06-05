<?php
define('DS',DIRECTORY_SEPARATOR);
define('ROOT',  realpath(dirname(__FILE__)) . DS);

require_once (ROOT . 'config' . DS . 'config.php');


Session::init();

try{
    /*registro de clases*/
    Registry::anonimous('Request');
    Registry::anonimous('DatabaseProvider');
    Registry::anonimous('View');    

    Bootstrap::run(Obj::run()->Request);    
}  
catch (Exception $e){
    echo $e->getMessage();
}

