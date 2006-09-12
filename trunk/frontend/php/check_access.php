<?php
/**
 * Module check_access.php
 * Realiza un chequeo del usuario y sus permisos. Hace de capa protectora para la
 * aplicación impidiendo accesos no válidos y obligando a acceder por medio de
 * autenticación.
 * 
 * @author Francisco Javier Ramos Álvarez
 * @version 1.0
 * @package php
 */

	session_start();
	$ids = session_id();
	$html_err = '<div align="center"><img src="../img/gnome-error.png" align="absmiddle" /> <font color="#990000" size="+1">Acceso no autorizado.</font><br /><a href="index.php">&lt;&lt; Volver</a></div>';
	($access = isset($_SESSION['user_' . $ids])) or die($html_err);
	($access = $access and !empty($_SESSION['user_' . $ids])) or die($html_err);
	($access = $access and (count($_SESSION['user_' . $ids]) == 4)) or die($html_err);
	($access = $access and (count($_SESSION['user_' . $ids]['param']) > 0)) or die($html_err);
	
	$access_app = eregi('pck', $_SESSION['user_' . $ids]['param']['app']);
	$access_app = $access_app or eregi('user', $_SESSION['user_' . $ids]['param']['app']);
	$access_app = $access_app or eregi('log', $_SESSION['user_' . $ids]['param']['app']);
	
	($access = $access and $access_app) or die($html_err);
	$_SESSION['user_' . $ids]['new_mktime'] = mktime();
?>