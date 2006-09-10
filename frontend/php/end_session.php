<?php
/**
 * 
 */

	session_start();
	
	include('config.php');
	include('functions.php');
	
	if(isset($_SESSION['user_' . session_id()]['login']))
		registerMovement(LOGOUT);
	
	session_unset();
	session_destroy();
?>