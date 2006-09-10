<?
/**
 * 
 */

include('../php/check_access.php');
include('../php/functions.php');
?>

<html>
	<head>
		<meta http-equiv="content-type" content="text/xml; charset=utf-8" />
		
		<title>..:: Pooler ::..</title>
		
		<link rel="stylesheet" type="text/css" href="../css/styles.css">
		<link rel="stylesheet" type="text/css" href="../css/dhtmlXToolbar.css">
		<link rel="stylesheet" type="text/css" href="../css/dhtmlXTree.css">
		<link rel="stylesheet" type="text/css" href="../css/dhtmlXGrid.css">
		<link rel="stylesheet" type="text/css" href="../css/dhtmlXTabBar.css">
		
		<script type="text/javascript" src="../php/language.js.php"></script>
		<script type="text/javascript" src="../js/init.js"></script>
		<script type="text/javascript" src="../js/functions.js"></script>
		<script type="text/javascript" src="../js/prototype.js"></script>
		<script type="text/javascript" src="../js/dhtmlXCommon.js"></script>
		<script type="text/javascript" src="../js/dhtmlXProtobar.js"></script>
		<script type="text/javascript" src="../js/dhtmlXToolbar.js"></script>
		<script type="text/javascript" src="../js/dhtmlXTree.js"></script>
		<script type="text/javascript" src="../js/dhtmlXGrid.js"></script>
		<script type="text/javascript" src="../js/dhtmlXGridCell.js"></script>
		<script type="text/javascript" src="../js/dhtmlXTabbar.js"></script>
		<script type="text/javascript" src="../js/wz_dragdrop.js"></script>
		
		
		<? if(eregi('log', $_SESSION['user_' . $ids]['param']['app'])): ?>
			<!-- Calendario de Zapatec -->
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
			<div id="tabbar"></div>
		</center>

	</body>
</html>