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
		
		<!-- Cargamos hoja de estilo de la aplicación -->
		<link rel="stylesheet" type="text/css" href="../css/styles.css">
		
		<!-- Cargamos librerías JavaScript que componene la aplicación AJAX -->
		
		<!-- Traducción de mensajes en JavaScript -->
		<script type="text/javascript" src="../php/language.js.php"></script>
		
		<!-- Variables globales y funciones de inicio de la aplicación -->
		<script type="text/javascript" src="../js/init.js"></script>
		
		<!-- Funciones del núcleo de la aplicación -->
		<script type="text/javascript" src="../js/functions.js"></script>
		
		<!-- Framework Prototype -->
		<script type="text/javascript" src="../js/prototype.js"></script>
		
		<!-- Componentes para la interfaz gráfica (DataGrid, TreeView, Tabs) -->
		<link rel="stylesheet" type="text/css" href="../css/dhtmlXGrid.css">
		<link rel="stylesheet" type="text/css" href="../css/dhtmlXTabBar.css">
		<link rel="stylesheet" type="text/css" href="../css/dhtmlXTree.css">
		<script type="text/javascript" src="../js/dhtmlXCommon.js"></script>
		<script type="text/javascript" src="../js/dhtmlXGrid.js"></script>
		<script type="text/javascript" src="../js/dhtmlXGridCell.js"></script>
		<script type="text/javascript" src="../js/dhtmlXTabbar.js"></script>
		<script type="text/javascript" src="../js/dhtmlXTree.js"></script>
		
		<!-- Barra de herramientas -->
		<link rel="stylesheet" type="text/css" href="../css/toolbar.css">
		<script type="text/javascript" src="../js/poolerToolBar.class.js"></script>
		
		<!-- Librería para realizar Drag Drop con capas -->
		<script type="text/javascript" src="../js/wz_dragdrop.js"></script>
		
		<? if(!AUTH_LDAP and eregi('user', $_SESSION['user_' . $ids]['param']['app'])): ?>
			<!-- Librería para encriptación MD5 -->
			<script type="text/javascript" src="../js/md5.js"></script>
		<? endif; ?>
		
		
		<? if(eregi('log', $_SESSION['user_' . $ids]['param']['app'])): ?>
			<!-- Calendario JSCalendar -->
			<link rel="stylesheet" type="text/css" href="../css/calendar.css">
			<script type="text/javascript" src="../js/calendar.js"></script>
			<script type="text/javascript" src="../js/calendar-setup.js"></script>
			<script type="text/javascript" src="../js/calendar-es.js"></script>
		<? endif; ?>
		
	</head>
	<body onload="init_app()" onbeforeunload="endSession()">
		
		<center>
			<!-- Sistema de pestañas -->
			<div id="tabbar"></div>
		</center>
		
	</body>
</html>