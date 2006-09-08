<?php
	session_start();
	include('functions.php');

/*****************************************************************************/
header("Content-type:text/xml"); 
echo '<?xml version="1.0" encoding="utf-8"?>';
echo '<toolbar name=" " width="250" toolbarAlign="left">';
	
	$ids = session_id();
	if(isset($_SESSION['user_' . $ids]['param']['users']))
		$is_writable = eregi("w", $_SESSION['user_' . $ids]['param']['users']);
	else
		$is_writable = false;
	
	echo '<ImageButton src="../img/b_usradd.png" height="25" width="25" id="but_users_1" tooltip="Nuevo Usuario" disableImage="../img/b_usradd_dis.png" ' . (!$is_writable ? 'disable="true"' : '') . ' />';
	echo '<ImageButton src="../img/b_usredit.png" height="25" width="25" id="but_users_2" tooltip="Editar Usuario" disableImage="../img/b_usredit_dis.png" ' . (!$is_writable ? 'disable="true"' : '') . ' />';
	echo '<ImageButton src="../img/b_usrdrop.png" height="25" width="25" id="but_users_3" tooltip="Eliminar Usuario" disableImage="../img/b_usrdrop_dis.png" ' . (!$is_writable ? 'disable="true"' : '') . ' />';
	echo '<divider id="div_1"/>';
	echo '<ImageTextButton src="../img/s_loggoff.png" height="25" width="25" id="but_users_4" tooltip="Salir" />';	
	
echo '</toolbar>';
/*****************************************************************************/

?>