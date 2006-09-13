<?
/**
 * Frame app.php
 * Contenedor principal de la aplicación.
 * 
 * @author Francisco Javier Ramos Álvarez
 * @version 1.1
 * @package app
 * 
 * @return html
 */

include('../php/check_access.php');
include('../php/functions.php');
include_once('../php/config.php');
?>

<html>
	<head>
		<meta http-equiv="content-type" content="text/xml; charset=utf-8" />
		
		<title>..:: Pooler ::..</title>
		
		<!-- Cargamos hojas de estilo -->
		<link rel="stylesheet" type="text/css" href="../css/styles.css">
		<link rel="stylesheet" type="text/css" href="../css/dhtmlXToolbar.css">
		<link rel="stylesheet" type="text/css" href="../css/dhtmlXTree.css">
		<link rel="stylesheet" type="text/css" href="../css/dhtmlXGrid.css">
		<link rel="stylesheet" type="text/css" href="../css/dhtmlXTabBar.css">
		
		<!-- Cargamos librerías JavaScript que componene la aplicación AJAX -->
		
		<!-- Traducción de mensajes en JavaScript -->
		<script type="text/javascript" src="../php/language.js.php"></script>
		
		<!-- Variables globales y funciones de inicio de la aplicación -->
		<script type="text/javascript" src="../js/init.js"></script>
		
		<!-- Funciones del núcleo de la aplicación -->
		<script type="text/javascript" src="../js/functions.js"></script>
		
		<!-- Framework Prototype (http://prototype.conio.net) -->
		<script type="text/javascript" src="../js/prototype.js"></script>
		
		<!-- 
			Componentes para la interfaz gráfica (regilla de datos, 
			árboles, barras de herramientas, pestañas, etc...)
		-->
		<script type="text/javascript" src="../js/dhtmlXCommon.js"></script>
		<script type="text/javascript" src="../js/dhtmlXProtobar.js"></script>
		<script type="text/javascript" src="../js/dhtmlXToolbar.js"></script>
		<script type="text/javascript" src="../js/dhtmlXTree.js"></script>
		<script type="text/javascript" src="../js/dhtmlXGrid.js"></script>
		<script type="text/javascript" src="../js/dhtmlXGridCell.js"></script>
		<script type="text/javascript" src="../js/dhtmlXTabbar.js"></script>
		
		<!-- Librería para realizar Drag Drop con capas (http://www.walterzorn.com) -->
		<script type="text/javascript" src="../js/wz_dragdrop.js"></script>
		
		<? if(!AUTH_LDAP and eregi('user', $_SESSION['user_' . $ids]['param']['app'])): ?>
			<!-- Librería para encriptación MD5 -->
			<script type="text/javascript" src="../js/md5.js"></script>
		<? endif; ?>
		
		
		<? if(eregi('log', $_SESSION['user_' . $ids]['param']['app'])): ?>
			<!-- Calendario de Zapatec (http://www.zapatec.com) -->
			<link rel="stylesheet" type="text/css" href="../zpcal/themes/mycal.css">
			<link rel="stylesheet" type="text/css" href="../zpcal/themes/layouts/big.css">
			<script type="text/javascript" src="../zpcal/utils/zapatec.js"></script>
			<script type="text/javascript" src="../zpcal/src/calendar.js"></script>
			<script type="text/javascript" src="../zpcal/lang/calendar-sp.js"></script>
			<a href="http://www.zapatec.com" />
		<? endif; ?>
		
	</head>
	<body onload="init_app()" onbeforeunload="endSession()">
		
		<center>
			<!-- Pestañas de la aplicación -->
			<div id="tabbar"></div>
		</center>

	</body>
</html>