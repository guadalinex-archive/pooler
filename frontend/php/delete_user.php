<?php 
/**
 * 
 */
	
	session_start();
	
	//eliminamos usuario del fichero ini
		
	include_once('config.php');
	require_once('IniAccess.class.php');

	if(isset($_GET['user'])){
		
		$oIni = new IniAccess(USERS_INI);
		$oIni->delSection($_GET['user']); //eliminamos
		$oIni->printFileIni(); //guardamos cambios
		
		//registramos el movimiento
		registerMovement(DELUSER, array($_GET['user']));
		
		echo 'OK';
	}
?>