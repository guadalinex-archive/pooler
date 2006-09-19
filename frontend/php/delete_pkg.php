<?php 
/**
 * Module delete_pgk.php
 * Elimina paquetes del repositorio.
 * 
 * @author Francisco Javier Ramos Álvarez
 * @version 1.0
 * @package php
 * @see rmpkg.py by Antonio Gonzalez Romero
 * 
 * @return $code
 */

	session_start();
	
	include_once('config.php');
	include_once('functions.php');
	require_once('myDebLog.class.php');
	
	set_time_limit(TIME_LIMIT);
	
	$dist = $_POST['dist'];
	$arch = $_POST['arch'];
	$ok = true;
	
	foreach($_POST['files'] as $pck => $filename){
		
		/** COMANDO ********************************************/
		$cmd = "$rm_pkg_py -p $filename -d $dist -a $arch -c $repo_conf";
		$out_ret = execCmdV3($cmd);
		debugPython($cmd, $out_ret);
		/*******************************************************/
		
		if($out_ret[1] == 0){
			//registramos el movimiento
			registerMovement(DELPKG, array(basename($filename), $dist));
			$ok = $ok and true;
		}
		else{
			$msg_err .= 'Error Cod. ' . $out_ret[1] . '\\n';
			$ok = false;
		}
	}
	
	echo ($ok ? 'OK' : $msg_err);
?>