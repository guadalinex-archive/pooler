<?php
/**
 * Module end_session.php
 * Termina la sesión de usuario. Elimina las variables de sesión y registra
 * el logout de dicho usuario.
 * 
 * @author Francisco Javier Ramos Álvarez
 * @version 1.0
 * @package php
 */

	session_start();
	
	include_once('config.php');
	include_once('functions.php');
	require_once('myDebLog.class.php');

	//registramos movimiento
	if(isset($_SESSION['user_' . session_id()]['login']))
		registerMovement(LOGOUT);
	
	//eliminamos la sesión
	session_unset();
	session_destroy();
?>