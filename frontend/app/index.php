<?
//evitamos el uso de Internet Explorer
include('../php/no_ie.php');
include('../php/end_session.php');
include_once('../php/functions.php');
?>

<!--
/**
 * Frame index.php
 * Inicio de la aplicación. Lanzará el formulario de autenticación.
 * 
 * @author Francisco Javier Ramos Álvarez
 * @version 1.0
 * @package app
 * @see auth.php
 * 
 * @return html
 */
-->
<html>
	<head>
		<meta http-equiv="content-type" content="text/xml; charset=utf-8" />
		
		<title>..:: Pooler - Autenticaci&oacute;n ::..</title>
		
		<link rel="stylesheet" type="text/css" href="../css/styles.css">
		<script type="text/javascript" src="../php/language.js.php"></script>
		<script type="text/javascript" src="../js/prototype.js"></script>
		<script type="text/javascript" src="../js/wz_dragdrop.js"></script>
		<script type="text/javascript" src="../js/functions.js"></script>
		<script type="text/javascript" src="../js/functions_auth.js"></script>
	</head>
	<body onload="auth()"></body>
</html>