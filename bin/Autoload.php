<?php
class Autoload{
    
    private static $_instancias = array();
    
    public function __construct() {
        self::$_instancias[] = $this;
        if(count(self::$_instancias) > 1){
            throw new Exception('Error: class Autoload ya se instancio; para acceder a la instancia ejecutar: Obj::run()->NOMBRE_REGISTRO');
        }
    }

    public static function js($dir,$subDirectorio=false){
        $directorio=opendir($dir);
        while ($archivo = readdir($directorio)){
            /*los js de layout no se cargan*/
            if(self::extension($archivo) != ''){
                /*
                    *los archivos con prefijo _ no se cargaran 
                */
                if(substr($archivo,0,1)!='_' && self::extension($archivo) == 'js'){
                    echo '<div class="__j__"><script type="text/javascript" src="'.BASE_URL.$dir.$archivo.'"></script></div>';
                    echo '<script>$(".__j__").remove();</script>';
                }                            
            }else{
                if($subDirectorio){
                    if($archivo != '.' && $archivo != '..'){
                        $newdir = $dir.$archivo.'/';
                        self::js($newdir,$subDirectorio);
                    } 
                }   
            }
        }
        closedir($directorio);
    }
    
    private static function extension($filename){
        return substr(strrchr($filename, '.'), 1);
    }
    
}