<?
/**
 * 
 */

	session_start();
	include('functions.php');

/*****************************************************************************/
header("Content-type:text/xml"); 
echo '<?xml version="1.0" encoding="utf-8"?>';
echo '<toolbar name="Listado de Paquetes" width="645" toolbarAlign="left">';
	
	if($dists = getAccessDists() and isset($_GET['path']) and !empty($_GET['path'])){
		//si se tiene permiso de escritura
		if(hasPermission($_GET['path'], 'w')){
			echo '<ImageButton src="../img/move2.png" height="25" width="25" id="but_content_1" disableImage="../img/move_dis.png" tooltip="Mover Paquetes" />';
			echo '<ImageButton src="../img/delpkg.png" height="25" width="25" id="but_content_2" disableImage="../img/delpkg_dis.png" tooltip="Eliminar Paquetes" />	';
		}
		else{
			echo '<ImageButton src="../img/move2.png" height="25" width="25" id="but_content_1" tooltip="Mover Paquetes" disableImage="../img/move_dis2.png" disable="true" />';
			echo '<ImageButton src="../img/delpkg.png" height="25" width="25" id="but_content_2" tooltip="Eliminar Paquetes" disableImage="../img/delpkg_dis.png" disable="true" />	';
		}
		
		echo '<divider id="div_1" />';
		echo '<ImageButton src="../img/b_firstpage.png" height="25" width="25" id="but_content_3" tooltip="Primera pagina" />';
		echo '<ImageTextButton src="../img/b_prevpage.png" width="20" height="25" id="but_content_4" tooltip="Anterior pagina"  />';
		echo '<ImageTextButton src="../img/b_nextpage.png" width="15" height="25" id="but_content_5" tooltip="Siguiente pagina"  />';	
		echo '<ImageButton src="../img/b_lastpage.png" height="25" width="25" id="but_content_6" tooltip="Última pagina" />';
		echo '<divider id="div_2" />';
		echo '<ImageButton src="../img/iconFilter.gif" height="25" width="25" id="but_content_7" tooltip="Filtramos Paquetes" />';
		echo '<ImageButton src="../img/reload.gif" height="25" width="25" id="but_content_8" tooltip="Recarga Pagina" />';
		echo '<divider id="div_3" />';
	}
	
echo '</toolbar>';
/*****************************************************************************/

?>