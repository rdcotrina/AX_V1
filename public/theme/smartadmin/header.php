<!DOCTYPE html>
<html lang="en-us">	

    <!-- Mirrored from 192.241.236.31/themes/preview/smartadmin/1.4.1/ajaxversion/ by HTTrack Website Copier/3.x [XR&CO'2014], Tue, 21 Oct 2014 03:24:53 GMT -->
    <head>
        <meta charset="utf-8">
        <title><?php echo APP_NAME; ?></title>
        <meta name="description" content="">
        <meta name="author" content="">

        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">

        <!-- #CSS Links -->
        <!-- Basic Styles -->
        <link rel="stylesheet" type="text/css" media="screen" href="<?php echo $rutaLayout['_css']; ?>bootstrap.min.css">
        <link rel="stylesheet" type="text/css" media="screen" href="<?php echo $rutaLayout['_css']; ?>font-awesome.min.css">

        <!-- SmartAdmin Styles : Please note (smartadmin-production.css) was created using LESS variables -->
        <link rel="stylesheet" type="text/css" media="screen" href="<?php echo $rutaLayout['_css']; ?>smartadmin-production.min.css">
        <link rel="stylesheet" type="text/css" media="screen" href="<?php echo $rutaLayout['_css']; ?>smartadmin-skins.min.css">

        <!-- SmartAdmin RTL Support is under construction
                 This RTL CSS will be released in version 1.5
        <link rel="stylesheet" type="text/css" media="screen" href="<?php echo $rutaLayout['_css']; ?>smartadmin-rtl.min.css"> -->

        <!-- We recommend you use "your_style.css" to override SmartAdmin
             specific styles this will also ensure you retrain your customization with each SmartAdmin update.
        <link rel="stylesheet" type="text/css" media="screen" href="<?php echo $rutaLayout['_css']; ?>your_style.css"> -->

        <!-- Demo purpose only: goes with demo.js, you can delete this css when designing your own WebApp -->
        <link rel="stylesheet" type="text/css" media="screen" href="<?php echo $rutaLayout['_css']; ?>demo.min.css">

        <!-- #FAVICONS -->
        <link rel="shortcut icon" href="<?php echo $rutaLayout['_img']; ?>favicon/favicon.ico" type="image/x-icon">
        <link rel="icon" href="<?php echo $rutaLayout['_img']; ?>favicon/favicon.ico" type="image/x-icon">

        <!-- #GOOGLE FONT 
        <link rel="stylesheet" href="http://fonts.googleapis.com/css?family=Open+Sans:400italic,700italic,300,400,700">-->

        <!-- #APP SCREEN / ICONS -->
        <!-- Specifying a Webpage Icon for Web Clip 
                 Ref: https://developer.apple.com/library/ios/documentation/AppleApplications/Reference/SafariWebContent/ConfiguringWebApplications/ConfiguringWebApplications.html -->
        <link rel="apple-touch-icon" href="<?php echo $rutaLayout['_img']; ?>splash/sptouch-icon-iphone.png">
        <link rel="apple-touch-icon" sizes="76x76" href="<?php echo $rutaLayout['_img']; ?>splash/touch-icon-ipad.png">
        <link rel="apple-touch-icon" sizes="120x120" href="<?php echo $rutaLayout['_img']; ?>splash/touch-icon-iphone-retina.png">
        <link rel="apple-touch-icon" sizes="152x152" href="<?php echo $rutaLayout['_img']; ?>splash/touch-icon-ipad-retina.png">

        <!-- iOS web-app metas : hides Safari UI Components and Changes Status Bar Appearance -->
        <meta name="apple-mobile-web-app-capable" content="yes">
        <meta name="apple-mobile-web-app-status-bar-style" content="black">

        <!-- Startup image for web apps -->
        <link rel="apple-touch-startup-image" href="<?php echo $rutaLayout['_img']; ?>splash/ipad-landscape.png" media="screen and (min-device-width: 481px) and (max-device-width: 1024px) and (orientation:landscape)">
        <link rel="apple-touch-startup-image" href="<?php echo $rutaLayout['_img']; ?>splash/ipad-portrait.png" media="screen and (min-device-width: 481px) and (max-device-width: 1024px) and (orientation:portrait)">
        <link rel="apple-touch-startup-image" href="<?php echo $rutaLayout['_img']; ?>splash/iphone.png" media="screen and (max-device-width: 320px)">
        
        <link rel="stylesheet" type="text/css" media="screen" href="<?php echo $rutaLayout['_root']; ?>public/css/general.css">
        
        <link rel="stylesheet" type="text/css" media="screen" href="<?php echo $rutaLayout['_root']; ?>public/css/menuRight/menuRight.css">
        
        <script src="<?php echo $rutaLayout['_js']; ?>plugin/pace/pace.min.js"></script>
        <script>
            var tostring;
        </script>
    </head>

    <!--

    TABLE OF CONTENTS.
    
    Use search to find needed section.
    
    ===================================================================
    
    |  01. #CSS Links                |  all CSS links and file paths  |
    |  02. #FAVICONS                 |  Favicon links and file paths  |
    |  03. #GOOGLE FONT              |  Google font link              |
    |  04. #APP SCREEN / ICONS       |  app icons, screen backdrops   |
    |  05. #BODY                     |  body tag                      |
    |  06. #HEADER                   |  header tag                    |
    |  07. #PROJECTS                 |  project lists                 |
    |  08. #TOGGLE LAYOUT BUTTONS    |  layout buttons and actions    |
    |  09. #MOBILE                   |  mobile view dropdown          |
    |  10. #SEARCH                   |  search field                  |
    |  11. #NAVIGATION               |  left panel & navigation       |
    |  12. #MAIN PANEL               |  main panel                    |
    |  13. #MAIN CONTENT             |  content holder                |
    |  14. #PAGE FOOTER              |  page footer                   |
    |  15. #SHORTCUT AREA            |  dropdown shortcuts area       |
    |  16. #PLUGINS                  |  all scripts and plugins       |
    
    ===================================================================
    
    -->

    <!-- #BODY -->
    <!-- Possible Classes

            * 'smart-skin-{SKIN#}'
            * 'smart-rtl'         - Switch theme mode to RTL (will be avilable from version SmartAdmin 1.5)
            * 'menu-on-top'       - Switch to top navigation (no DOM change required)
            * 'hidden-menu'       - Hides the main menu but still accessable by hovering over left edge
            * 'fixed-header'      - Fixes the header
            * 'fixed-navigation'  - Fixes the main menu
            * 'fixed-ribbon'      - Fixes breadcrumb
            * 'fixed-footer'      - Fixes footer
            * 'container'         - boxed layout mode (non-responsive: will not work with fixed-navigation & fixed-ribbon)
    -->
    <body id="mainBodyHtml" class="">