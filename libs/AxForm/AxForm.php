<?php
/*
 * Documento   : AxForm
 * Creado      : 09-ago-2014
 * Autor       : ..... .....
 * Descripcion : 
 */
class AxForm{
    
    private static $_instancias = array();
    
    public function __construct() {
        self::$_instancias[] = $this;
        if(count(self::$_instancias) > 1){
            throw new Exception('Error: class Formulario ya se instancio; para acceder a la instancia ejecutar: Obj::run()->NOMBRE_REGISTRO');
        }
    }
    
    public static function getPost($parametro){
                
        if(isset($_POST[$parametro]) && !empty($_POST[$parametro])){
            if(is_array($_POST[$parametro])){
                $p = array();
                foreach ($_POST[$parametro] as $value) {
                    $p[] = htmlspecialchars(trim($value),ENT_QUOTES);
                }
                $_POST[$parametro] = $p;
                return $_POST[$parametro];
            }else{
                return htmlspecialchars(trim($_POST[$parametro]),ENT_QUOTES);
            }
        }else{
            return false;
        }
    }
    
    public static function getRequest($parametro){
                
        if(isset($_REQUEST[$parametro]) && !empty($_REQUEST[$parametro])){
            if(is_array($_REQUEST[$parametro])){
                $p = array();
                foreach ($_REQUEST[$parametro] as $value) {
                    $p[] = htmlspecialchars(trim($value),ENT_QUOTES);
                }
                $_REQUEST[$parametro] = $p;
                return $_REQUEST[$parametro];
            }else{
                return htmlspecialchars(trim($_REQUEST[$parametro]),ENT_QUOTES);
            }
        }else{
            return false;
        }
    }
    
    public static function getAll($parametro){
                
        if(isset($_REQUEST[$parametro]) && !empty($_REQUEST[$parametro])){
            return $_REQUEST[$parametro];
        }else{
            return false;
        }
    }
    
    private static function serialData($param,$row,$deli='',$subsre=1){
        /*verificar si es array*/
        $data = '';
        if(is_array($param)){
            foreach ($param as $p){
                $data .= $row[$p].$deli;
            }
            $data = substr_replace($data, "", $subsre);
        }else{
            $data = $row[$param];
        }
        return $data;
    }
    
    public static function widgetOpen($obj){
        if(is_array($obj)){
            $id     = (isset($obj['id']))?$obj['id']:'';
            $title  = (isset($obj['title']))?$obj['title']:'';
            $width  = (isset($obj['width']))?' width:'.$obj['width'].'; ':'';
            $height = (isset($obj['height']))?' height:'.$obj['height'].';overflow:auto; ':'';
            $padding= (isset($obj['padding']))? '':'no-padding';
            $actions= (isset($obj['actions']))? $obj['actions']:'';
            $wizard = (isset($obj['wizard']))? 'fuelux':false;
        }else{
            $id     = $obj;
            $title  = $obj;
            $width  = '';
            $height = '';
            $padding= 'no-padding';
            $actions= '';
        }
        $bottom = '';
        $border = '';
        if(empty($padding) && !$wizard){
            $bottom = 'margin-bottom:15px;';
            $border = 'border: #dddddd solid 1px;';
        }
        $toolButton = '';
        if(!empty($actions) && is_array($actions)){
            $toolButton = '
            <div class="widget-toolbar" role="menu">
                <div class="btn-group">
                    <button class="btn dropdown-toggle btn-xs btn-warning" data-toggle="dropdown">
                            Acciones <i class="fa fa-caret-down"></i>
                    </button>
                    <ul class="dropdown-menu pull-right">';
            foreach ($actions as $btn) {
                $toolButton .= '
                <li>
                    <a href="javascript:void(0);" onclick="'.$btn['click'].'">'.$btn['label'].'</a>
                </li>';
            }
            $toolButton .='  
                    </ul>
                </div>
            </div>';
        }
        $html = '
        <div id="widget_'.$id.'" class="jarviswidget jarviswidget-color-darken jarviswidget-sortable" data-widget-editbutton="false" style="'.$width.'" role="widget">
            <header role="heading">
                <div class="jarviswidget-ctrls" role="menu">
                    <!--<a style="display: block;" data-original-title="Collapse" href="#" class="button-icon jarviswidget-toggle-btn" rel="tooltip" title="" data-placement="bottom"><i class="fa fa-minus"></i></a> 
                    <a data-original-title="Fullscreen" href="javascript:void(0);" class="button-icon jarviswidget-fullscreen-btn" rel="tooltip" title="" data-placement="bottom"><i class="fa fa-resize-full"></i></a>
                    <div style="top: 33px; left: 1311px; display: block;" class="tooltip fade bottom in">
                        <div class="tooltip-arrow"></div>
                        <div class="tooltip-inner">Fullscreen</div>
                    </div> 
                    <a style="display: block;" data-original-title="Eliminar" href="javascript:void(0);" class="button-icon jarviswidget-delete-btn" rel="tooltip" title="" data-placement="bottom"><i class="fa fa-times"></i></a>-->
                </div>
                <!--<div class="widget-toolbar" role="menu">
                    <a data-toggle="dropdown" class="dropdown-toggle color-box selector" href="javascript:void(0);"></a>
                        <ul class="dropdown-menu arrow-box-up-right color-select pull-right">
                            <li><span class="bg-color-green" data-widget-setstyle="jarviswidget-color-green" rel="tooltip" data-placement="left" data-original-title="Green Grass"></span></li>
                            <li><span class="bg-color-greenDark" data-widget-setstyle="jarviswidget-color-greenDark" rel="tooltip" data-placement="top" data-original-title="Dark Green"></span></li>
                            <li><span class="bg-color-greenLight" data-widget-setstyle="jarviswidget-color-greenLight" rel="tooltip" data-placement="top" data-original-title="Light Green"></span></li>
                            <li><span class="bg-color-purple" data-widget-setstyle="jarviswidget-color-purple" rel="tooltip" data-placement="top" data-original-title="Purple"></span></li><li><span class="bg-color-magenta" data-widget-setstyle="jarviswidget-color-magenta" rel="tooltip" data-placement="top" data-original-title="Magenta"></span></li>
                            <li><span class="bg-color-pink" data-widget-setstyle="jarviswidget-color-pink" rel="tooltip" data-placement="right" data-original-title="Pink"></span></li>
                            <li><span class="bg-color-pinkDark" data-widget-setstyle="jarviswidget-color-pinkDark" rel="tooltip" data-placement="left" data-original-title="Fade Pink"></span></li><li><span class="bg-color-blueLight" data-widget-setstyle="jarviswidget-color-blueLight" rel="tooltip" data-placement="top" data-original-title="Light Blue"></span></li><li><span class="bg-color-teal" data-widget-setstyle="jarviswidget-color-teal" rel="tooltip" data-placement="top" data-original-title="Teal"></span></li><li><span class="bg-color-blue" data-widget-setstyle="jarviswidget-color-blue" rel="tooltip" data-placement="top" data-original-title="Ocean Blue"></span></li><li><span class="bg-color-blueDark" data-widget-setstyle="jarviswidget-color-blueDark" rel="tooltip" data-placement="top" data-original-title="Night Sky"></span></li><li><span class="bg-color-darken" data-widget-setstyle="jarviswidget-color-darken" rel="tooltip" data-placement="right" data-original-title="Night"></span></li><li><span class="bg-color-yellow" data-widget-setstyle="jarviswidget-color-yellow" rel="tooltip" data-placement="left" data-original-title="Day Light"></span></li><li><span class="bg-color-orange" data-widget-setstyle="jarviswidget-color-orange" rel="tooltip" data-placement="bottom" data-original-title="Orange"></span></li><li><span class="bg-color-orangeDark" data-widget-setstyle="jarviswidget-color-orangeDark" rel="tooltip" data-placement="bottom" data-original-title="Dark Orange"></span></li><li><span class="bg-color-red" data-widget-setstyle="jarviswidget-color-red" rel="tooltip" data-placement="bottom" data-original-title="Red Rose"></span></li><li><span class="bg-color-redLight" data-widget-setstyle="jarviswidget-color-redLight" rel="tooltip" data-placement="bottom" data-original-title="Light Red"></span></li><li><span class="bg-color-white" data-widget-setstyle="jarviswidget-color-white" rel="tooltip" data-placement="right" data-original-title="Purity"></span></li><li><a href="javascript:void(0);" class="jarviswidget-remove-colors" data-widget-setstyle="" rel="tooltip" data-placement="bottom" data-original-title="Reset widget color to default">Remove</a></li></ul>
                </div>-->
                <span class="widget-icon"><i class="fa fa-table"></i></span>
                <h2>'.$title.'</h2>
                <span class="jarviswidget-loader"><i class="fa fa-refresh fa-spin"></i></span>
                '.$toolButton.'
            </header>
            <div role="content">
                <!-- widget edit box -->
                <div class="jarviswidget-editbox">
                        <!-- This area used as dropdown edit box -->

                </div>
                <!-- end widget edit box -->

                <!-- widget content -->
                <div class="widget-body '.$padding.' '.$wizard.'" style="'.$height.$bottom.$border.'">';
        return $html;
    }
    
    public static function widgetClose(){
        $html = '</div>
            </div>
        </div>';
        return $html;
    }
    
    public static function selectHtml($obj) {
        $data = isset($obj['data'])?$obj['data']:array();
        $attr = isset($obj['atributes'])?$obj['atributes']:array();
        $all  = isset($obj['txtAll'])?$obj['txtAll']:false;
        $sel  = isset($obj['txtSelect'])?$obj['txtSelect']:true;
        $etiq = isset($obj['etiqueta'])?$obj['etiqueta']:'';
        $valo = isset($obj['value'])?$obj['value']:'';
        $etid = isset($obj['defaultEtiqueta'])?$obj['defaultEtiqueta']:'';
        
        $html = '<select ';
        foreach ($attr as $key => $value) {
            $html .= $key . '="' . $value . '" ';
        }
        $html .= '>';
        
        if (count($data) > 0) {
            if ($sel){
                $html .= '<option value="">Seleccionar</option>';
            }
            if ($all){
                $html .= '<option value="ALL">Todo(s)</option>';
            }


            foreach ($data as $item) {
                
                /*las etiquetas*/
                if(is_array($etiq)){
                    $desc = '';
                    foreach ($etiq as $val) {
                        $desc .= $item[$val].' - ';
                    }
                    $desc = substr_replace($desc, "", -2);
                }else{
                    $desc = $item[$etiq];
                }
                
                /*los valores*/
                if(is_array($valo)){
                    $key = '';
                    foreach ($valo as $vall) {
                        $key .= $item[$vall].'-';
                    }
                    $key = substr_replace($key, "", -1);
                }else{
                    $key = $item[$valo];
                }
                
                $selected = "";
                if ($key == $etid) {
                    $selected = '  selected="selected"';
                }

                $html .= '<option title="' . $desc . '" value="' . $key . '" ' . $selected . '>' . $desc . '</option>';
            }

            $html .= '</select>';
        }
        else{
            $html .= '<option value=""> - Sin datos - </option></select>';
        }
        //echo $html; exit();
        return $html;
    }
    
    /*
     * INICIO -->> groupSelectHtml();
     */
    private static function optionGroup($obj,$mrginLeft=0){
        $data = isset($obj['data'])?$obj['data']:array();
        $etid  = isset($obj['defaultEtiqueta'])?$obj['defaultEtiqueta']:'';
        $nivel = isset($obj['levels'])?$obj['levels']:'';
        
        $html = '';
        $tmp = '';
        
        $label = isset($nivel['label'])?$nivel['label']:'';
        $value = isset($nivel['value'])?$nivel['value']:'';
        $disabled = isset($nivel['disabled'])?($nivel['disabled'])?'disabled':'':'';
        $levels = isset($nivel['levels'])?$nivel['levels']:'';

        /*primer nivel*/
        foreach ($data as $row){
            $id = self::serialData($value, $row, '*', 1);
            /*se muestra los que no se duplican*/
            if($tmp != $id){
                $desc = self::serialData($label, $row, ' - ', -3);

                $selected = '';
                if ($id == $etid) {
                    $selected = '  selected="selected"';
                }
                
                $html .= '<option title="' . $desc . '" value="' . $id . '" ' . $disabled . ' style="margin-left:'.$mrginLeft.'px" '.$selected.'>' . $desc . '</option>';

                /*si tiene sub niveles*/
                if(is_array($levels) && !empty($levels)){                    
                    $html .= self::optionGroup2($obj,$levels, $mrginLeft,$id);
                }
            }
            $tmp = $id;

        }           
                           
        return $html;
    }
    
    private static function optionGroup2($obj,$levels, $mrginLeft,$idd){
        $mrginLeft += 15; /*para la identacion*/
        $data = isset($obj['data'])?$obj['data']:array();
        $etid  = isset($obj['defaultEtiqueta'])?$obj['defaultEtiqueta']:'';
        $nivel = $levels;
        $html = '';
        $temp = '';
        
        $label = isset($nivel['label'])?$nivel['label']:'';
        $value = isset($nivel['value'])?$nivel['value']:'';
        $disabled = isset($nivel['disabled'])?($nivel['disabled'])?'disabled':'':'';
        $levell = isset($nivel['levels'])?$nivel['levels']:'';
        $parent = isset($nivel['parent'])?$nivel['parent']:'';
        
        /*primer nivel*/        
        foreach ($data as $row){
            $ppar = self::serialData($parent, $row, '*', -1);
            $id = self::serialData($value, $row, '*', -1);
            
            /*que no se repitan y pertenezcan a su parent*/
            if($temp != $id && $ppar == $idd){
                $desc = self::serialData($label, $row, ' - ', -3);
            
                $selected = '';
                if ($id == $etid) {
                    $selected = '  selected="selected"';
                }
                
                $html .= '<option title="' . $desc . '" value="' . $id . '" ' . $disabled . ' style="margin-left:'.$mrginLeft.'px" '.$selected.'>' . $desc . '</option>';

                /*si tiene sub niveles*/
                if(is_array($levell) && !empty($levell)){
                    $newId = $idd.'*'.$id;
                    $html .= self::optionGroup2($obj,$levell, $mrginLeft,$newId);
                }
            }
            $temp = $id;
        }            
                           
        return $html;
    }

    public static function groupSelectHtml($obj) {
        $data = isset($obj['data'])?$obj['data']:array();
        $attr = isset($obj['atributes'])?$obj['atributes']:array();
        $all  = isset($obj['txtAll'])?$obj['txtAll']:false;
        $sel  = isset($obj['txtSelect'])?$obj['txtSelect']:true;        
        $etid  = isset($obj['defaultEtiqueta'])?$obj['defaultEtiqueta']:'';
        
        $id = '';
        
        $html = '<select ';
        foreach ($attr as $key => $value) {
            if($key == 'id'){ $id = $value;} /*para el select2*/
            $html .= $key . '="' . $value . '" ';
        }
        $html .= '>';
        
        if (count($data) > 0) {
            if ($sel){
                $html .= '<option value="">Seleccionar</option>';
            }
            if ($all){
                $html .= '<option value="ALL">Todo(s)</option>';
            }
            
            $html .= self::optionGroup($obj);
            

            $html .= '</select>';
        }
        else{
            $html .= '<option value=""> - Sin datos - </option></select>';
        }
        
        $html .= '<script>$("#'.$id.'").chosen();$("#'.$id.'_chosen").css("width","100%");</script>';
        if(!empty($etid)){
            $html .= '<script>$("#'.$id.'").val("'.$etid.'").trigger("chosen:updated");</script>';
        }
        return $html;
    }

    /*
     * FIN -->> groupSelectHtml();
     */
    public static function capitalize($cadena){
        $c = strtoupper (substr($cadena, 0,1));
        $d = substr($cadena, 1);
        
        $r = $c.$d;
        
        return $r;
    }
    
    public static function labelState($e){
        switch ($e) {
            case 'A':
                $c = 'label label-success';
                $a = 'Activo';
                break;
            case 'I':
                $c = 'label label-danger';
                $a = 'Inactivo';
                break;
            default:
                $c = '';
                $a = '';
        }
        
        return '<label class="'.$c.'">'.$a.'</label>';
    }
    
}