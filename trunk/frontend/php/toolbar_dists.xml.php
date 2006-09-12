<?php
/**
 * XML toolbar_dists.xml.php
 * Barra de herramientas para el árbol de distribuciones.
 * 
 * @author Francisco Javier Ramos Álvarez
 * @version 1.0
 * @package php
 * 
 * @return xml
 */

	session_start();
	include('functions.php');

/*****************************************************************************/
header("Content-type:text/xml"); 
echo '<?xml version="1.0" encoding="utf-8"?>';
echo '<toolbar name=" " width="250" toolbarAlign="left">';
	 
	//si tenemos acceso a las distribuciones mostramos el total de opciones
	if($dists = getAccessDists()){
		
		$has = false;
		foreach($dists as $dist => $permission)
			$has = ($has or (strpos($permission, 'w') !== false));
		
		echo '<ImageButton src="../img/iconNewNewsEntry.gif" height="25" width="25" id="but_dists_1" tooltip="Nuevo Paquete" disableImage="../img/iconNewNewsEntry_dis.gif" ' . (!$has ? 'disable="true"' : '') . ' />';
		echo '<ImageButton src="../img/source.png" height="25" width="25" id="but_dists_2" tooltip="Nueva Fuente" disableImage="../img/source_dis.png" ' . (!$has ? 'disable="true"' : '') . ' />';
		echo '<divider id="div_1"/>';
		//echo '<ImageButton src="../img/iconSearch.gif" height="25" width="25" id="but_dists_3" tooltip="Buscar Paquetes" disableImage="../img/iconSearch_dis.gif" disable="true" />';
		echo '<ImageTextButton src="../img/arbol2.gif" height="25" width="25" id="but_dists_4" tooltip="Desplegar Arbol" />';
		echo '<ImageTextButton src="../img/arbol3.gif" height="25" width="25" id="but_dists_5" tooltip="Replegar Arbol" />';	
		echo '<ImageTextButton src="../img/reload.gif" height="25" width="25" id="but_dists_6" tooltip="Refrescar Arbol" />';
		echo '<divider id="div_2"/>';
	}
	
	echo '<ImageTextButton src="../img/s_loggoff.png" height="25" width="25" id="but_dists_7" tooltip="Salir" />';	
echo '</toolbar>';
/*****************************************************************************/

?>