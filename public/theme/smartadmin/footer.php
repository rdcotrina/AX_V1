    </body>

<!-- PACE LOADER - turn this on if you want ajax loading to show (caution: uses lots of memory on iDevices)
    <script data-pace-options='{ "restartOnRequestAfter": true }' src="js/plugin/pace/pace.min.js"></script>-->


    <!-- #PLUGINS -->
    <script src="<?php echo $rutaLayout['_js']; ?>libs/jquery-2.0.2.min.js"></script> 

    <script src="<?php echo $rutaLayout['_js']; ?>libs/jquery-ui-1.10.3.min.js"></script> 

    <!-- IMPORTANT: APP CONFIG -->
    <script src="<?php echo $rutaLayout['_js']; ?>app.config.js"></script>

    <!-- JS TOUCH : include this plugin for mobile drag / drop touch events-->
    <script src="<?php echo $rutaLayout['_js']; ?>plugin/jquery-touch/jquery.ui.touch-punch.min.js"></script> 

    <!-- BOOTSTRAP JS -->
    <script src="<?php echo $rutaLayout['_js']; ?>bootstrap/bootstrap.min.js"></script>

    <!-- CUSTOM NOTIFICATION -->
    <script src="<?php echo $rutaLayout['_js']; ?>notification/SmartNotification.min.js"></script>

    <!-- JARVIS WIDGETS -->
    <script src="<?php echo $rutaLayout['_js']; ?>smartwidgets/jarvis.widget.min.js"></script>

    <!-- EASY PIE CHARTS -->
    <script src="<?php echo $rutaLayout['_js']; ?>plugin/easy-pie-chart/jquery.easy-pie-chart.min.js"></script>

    <!-- SPARKLINES -->
    <script src="<?php echo $rutaLayout['_js']; ?>plugin/sparkline/jquery.sparkline.min.js"></script>
    
    <!-- JQUERY VALIDATE -->
    <script src="<?php echo $rutaLayout['_js']; ?>plugin/jquery-validate/jquery.validate.min.js"></script>

    <!-- JQUERY MASKED INPUT -->
    <script src="<?php echo $rutaLayout['_js']; ?>plugin/masked-input/jquery.maskedinput.min.js"></script>

    <!-- JQUERY SELECT2 INPUT -->
    <script src="<?php echo $rutaLayout['_js']; ?>plugin/select2/select2.min.js"></script>
    
    <!-- JQUERY CLOCKPICKER -->
    <script src="<?php echo $rutaLayout['_js']; ?>plugin/clockpicker/clockpicker.min.js"></script>

    <!-- JQUERY UI + Bootstrap Slider -->
    <script src="<?php echo $rutaLayout['_js']; ?>plugin/bootstrap-slider/bootstrap-slider.min.js"></script>

    <!-- browser msie issue fix -->
    <script src="<?php echo $rutaLayout['_js']; ?>plugin/msie-fix/jquery.mb.browser.min.js"></script>

    <!-- CONTEXTMENU -->
    <script src="<?php echo $rutaLayout['_root']; ?>public/js/menuRight/menuRight.js"></script>
    
    <!-- FastClick: For mobile devices: you can disable this in app.js -->
    <script src="<?php echo $rutaLayout['_js']; ?>plugin/fastclick/fastclick.min.js"></script>

    <!--[if IE 8]>
            <h1>Your browser is out of date, please update your browser by going to www.microsoft.com/download</h1>
    <![endif]-->

    <!-- Demo purpose only -->
    <script src="<?php echo $rutaLayout['_js']; ?>demo.min.js"></script>

    <!-- MAIN APP JS FILE -->
    <script src="<?php echo $rutaLayout['_js']; ?>app.min.js"></script>

    <!-- ENHANCEMENT PLUGINS : NOT A REQUIREMENT -->
    <!-- Voice command : plugin -->
    <script src="<?php echo $rutaLayout['_js']; ?>speech/voicecommand.min.js"></script>
    
    <!-- SCRIPT AX -->
    <script src="<?php echo $rutaLayout['_root']; ?>bin/ax/axExe.js"></script>
    
    <script src="<?php echo $rutaLayout['_root']; ?>public/js/dataGrid/dataGrid.jquery.js"></script>
    
    <script src="<?php echo $rutaLayout['_root']; ?>public/js/scrollTable/scrollTable.js"></script>
    
    <!-- EXCEL FACTORY -->
    <script type="text/javascript" src="<?php echo $rutaLayout['_root']; ?>public/js/excelFactory/js/require.min.js"></script>
    <script type="text/javascript" src="<?php echo $rutaLayout['_root']; ?>public/js/excelFactory/js/underscore.min.js"></script>
    <script type="text/javascript" src="<?php echo $rutaLayout['_root']; ?>public/js/excelFactory/js/json2.js"></script>
    <script type="text/javascript" src="<?php echo $rutaLayout['_root']; ?>public/js/excelFactory/js/swfobject.js"></script>
    <script type="text/javascript" src="<?php echo $rutaLayout['_root']; ?>public/js/excelFactory/js/downloadify.min.js"></script>
    <script type="text/javascript" src="<?php echo $rutaLayout['_root']; ?>public/js/excelFactory/excelFactory.js"></script>
    
    
    <?php require_once (ROOT . 'config' . DS . 'prefijosJs.php'); ?>
    <!--se cierra tabs a prefijosJS JS debido a q en el archivo debe permanecer abierto para agregar las constantes con CREATOR-->
    </script>

</html>
<script>
    /*obtener el src de los js incluidos, para verificar que no sean suplantados*/
    /*
    $.each($('script'),function(){
        alert($(this).attr('src'))
    });
    */
   
   /*si no esta logueado, bloqueo de pantalla no se activa*/
    var inactvo = function(){};
</script>
<?php if(Session::get('sys_usuario')):?>
<script>
    /*evento para bloquear por inactividad*/
    var activityTimeout = 0;
    
    var inactvo = function() {
        var activityTimeout = null;
        $(document).mousemove(function(event) {
            if (activityTimeout) {
                clearTimeout(activityTimeout);
            }
            activityTimeout = setTimeout(function() {
                Index.inactividad();
            }, 1000);
        });
    };
</script>
<?php endif; ?>
<script>
    /*contenedor de html null, para bloqueadr app*/
    localStorage.setItem('mainBodyHtml',null);
    /*activando menu top*/
    localStorage.setItem("sm-setmenu", "top");
    $('input[type="checkbox"]#smart-fixed-header').prop("checked", !0);
    $('input[type="checkbox"]#smart-fixed-navigation').prop("checked", !0);
    $('input[type="checkbox"]#smart-fixed-ribbon').prop("checked", !0);
    $.root_.addClass("fixed-header");
    $.root_.addClass("fixed-navigation");
   // $.root_.addClass("fixed-ribbon");
    $('input[type="checkbox"]#smart-fixed-container').prop("checked", !1);
    $.root_.removeClass("container");

    
    /*cargar requires*/
    axExe.require("lang/js/lang_ES");
    axExe.require("bin/ax/axScript");
    axExe.require("bin/ax/axAjax",function(){
        tostring = axAjax.cadena();
    });
    axExe.require("libs/Aes/js/aes",function(){
        axExe.require("libs/Aes/js/aesctr");
    });    
    axExe.require("libs/Aes/js/base64");
    axExe.require("libs/Aes/js/utf8");
    axExe.require({
        auditoria: 'auditoria',
        index: 'Login'
    });
    
    
    axExe.require({
        index: 'Index'
    },function(){
        //inactvo();
    });
</script>