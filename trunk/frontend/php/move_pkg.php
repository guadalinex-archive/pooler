<?php 
	session_start();
	
	include_once('config.php');
	include_once('functions.php');
	
	$dist_o = $_POST['dist_o'];
	$dist_d = $_POST['dist_d'];
	
	foreach($_POST['files'] as $pck => $filename){
		
		/***********************************************************/
		$cmd = "$mv_pkg_py -p $filename -o $dist_o -d $dist_d -c $repo_conf";
		$out_ret = execCmdV3($cmd);
		/***********************************************************/
		
		//registramos el movimiento
		registerMovement(MOVPKG, array(basename($filename), $dist_o . '=>' . $dist_d));
	}
?>