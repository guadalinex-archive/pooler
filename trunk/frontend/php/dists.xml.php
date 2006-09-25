<?php
/**
 * XML dists.xml.php
 * Mostrará el árbol de distribuciones del repositorio.
 * 
 * @author Francisco Javier Ramos Álvarez
 * @version 1.0
 * @package php
 * 
 * @return xml
 */

	session_start();
	include_once('config.php');
	include('functions.php');
	
	/*****************************************************************************/
	header("Content-type:text/xml"); 
	echo '<?xml version="1.0" encoding="utf-8"?>';
	echo '<tree id="0">';
	
		if($dists = getAccessDists()){
			echo '<item id="' . $_SESSION['repository']['path'] . '/dists" text="dists" open="1">';
				//creamos el arbol recursivamente
				createTreeItems($_SESSION['repository']['path'] . '/dists', 1);
			echo '</item>';
		}
		else
			echo '<item id="no_access" text="No tiene acceso a las distribuciones" im0="s_cancel.png" imw="16" imh="16" />';
		
	echo '</tree>';
	/*****************************************************************************/

?>