<?php
/**
 * Module no_ie.php
 * Capa protectora que realiza un chequeo del navegador, evitando el 
 * uso de Internet Explorer.
 * 
 * @author Francisco Javier Ramos Álvarez
 * @version 1.0
 * @package php
 */
	
	$html_err = '<div align="center"><img src="../img/no_explorer.gif" align="absmiddle" /> <font color="#990000" size="+1">No use Internet Explorer !!.</font><br /></div>';
	!eregi('MSIE', $_SERVER['HTTP_USER_AGENT']) or die($html_err);
?>