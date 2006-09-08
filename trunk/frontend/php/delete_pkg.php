<?php 
	session_start();
	
	include_once('config.php');
	include_once('functions.php');

	$dist = $_POST['dist'];
	
	foreach($_POST['files'] as $pck => $filename){
		
		/*******************************************************/
		$cmd = "$rm_pkg_py -p $filename -d $dist -c $repo_conf";
		$out_ret = execCmdV3($cmd);
		/*******************************************************/
		
		//registramos el movimiento
		registerMovement(DELPKG, array(basename($filename), $dist));
	}
?>