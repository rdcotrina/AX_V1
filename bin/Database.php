<?php
/*
 * Documento   : Model
 * Creado      : 03-ene-2014, 17:05:26
 * Autor       : RDCC
 * Descripcion :
 */
class Database{
    
    protected $_db;
    
    public function __construct() {
        $this->_db = Obj::run()->DatabaseProvider;
        
        /*detectar en que metodo se ejecuta __construct();*/
        $e = new Exception();
        $trace = $e->getTrace();
        $last_call = $trace[1]; /*trae datos de clase donde se ejecuta __construct()*/
        $class = $last_call['class'];
                
        Registry::singleton($class);      /*se registra modelo donde se extiende Database*/ 
    }
    
    public function execute($query,$arrayValues){
        try{
            $statement = $this->_db->prepare($query);
            $statement->execute($arrayValues);

            $bug = $statement->errorInfo();

            if($bug[0] == '00000'){// ok
                $result = true;
            }else{//error
                if(DB_ENTORNO == 'D'){
                    $result = array('error'=>'ERROR:: '.$bug[2]);
                }elseif(DB_ENTORNO == 'P'){
                    $result = array('error'=>'ERROR:: '.$this->messageError($bug[1]));
                }
            }

            return $result;
        }  catch (Exception $e){
            throw new ErrorException ($e->getMessage());
        }
    }
    
    public function queryOne($query,$arrayValues){
        try{
            $statement = $this->_db->prepare($query);
            $statement->execute($arrayValues);

            $bug = $statement->errorInfo();

            if($bug[0] == '00000'){// ok
                $result = $statement->fetch(PDO::FETCH_ASSOC);
            }else{//error
                if(DB_ENTORNO == 'D'){
                    $result = array('error'=>'ERROR:: '.$bug[2]);
                }elseif(DB_ENTORNO == 'P'){
                    $result = array('error'=>'ERROR:: '.$this->messageError($bug[1]));
                }
            }

            return $result;
        }  catch (Exception $e){
            throw new ErrorException ($e->getMessage());
        }
    }
    
    public function queryAll($query,$arrayValues){
        try{
            $statement = $this->_db->prepare($query);
            $statement->execute($arrayValues);

            $bug = $statement->errorInfo();

            if($bug[0] == '00000'){// ok
                $result = $statement->fetchAll(PDO::FETCH_ASSOC);
            }else{//error
                if(DB_ENTORNO == 'D'){
                    $result = array('error'=>'ERROR:: '.$bug[2]);
                }elseif(DB_ENTORNO == 'P'){
                    $result = array('error'=>'ERROR:: '.$this->messageError($bug[1]));
                }
            }

            return $result;
        }  catch (Exception $e){
            throw new ErrorException ($e->getMessage());
        }
        
    }
    
    private function messageError($code) {
        $msg = '';
        switch ($code) {
            case 1305:
                $msg = 'Procedimiento almacenado no existe.';
                break;
            case 1318:
                $msg = 'Numero de argumentos en el procedimiento incorrectos.';
                break;
            case 1061:
                $msg = 'Nombre de clave duplicado.';
                break;
            case 547:
                $msg = 'No se puede eliminar el registro porque se necesitan en otras tablas.';
                break;
            case 1451:
                $msg = 'No se pudo eliminar el registro debido a que está siendo utilizada en otras operaciones.';
                break;
            case 1452:
                $msg = 'Algunas claves primarias no existen en las tablas maestras. No se pudo realizar la relaci&oacute;n.';
                break;
            case 1062:
                $msg = 'Registro duplicado. Esta intentando registrar un registro que ya existe.';
                break;
            case 1146:
                $msg = 'La tabla no existe.';
                break;
            case 1054:
                $msg = 'La columna es desconocida.';
                break;
            case 1064:
                $msg = 'Sintaxis incorrecta.';
                break;
            case 1136:
                $msg = 'Numero de columnas no corresponde al numero de campos.';
                break;
            case 1362:
                $msg = 'Error de clave unica.';
                break;
            case 1022:
                $msg = 'Ya existe un registro con este nombre.';
                break;
            default:
                $msg = 'Codigo de error: ' . $code . ': 
                        Por favor comun&iacute;que de este problema a la Oficina de Sistemas.';
        }
        return $msg;
    }
    
}