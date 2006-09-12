<?php 
/**
 * Module delete_user.php
 * Elimina usuarios del fichero ini
 * 
 * @author Francisco Javier Ramos Álvarez
 * @version 1.0
 * @package php
 * @see IniAccess.class.php
 * 
 * @return $code
 */
	
	session_start();
		
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