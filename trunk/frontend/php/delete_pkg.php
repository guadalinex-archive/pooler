<?php 
/**
 * Module delete_pgk.php
 * Elimina paquetes del repositorio.
 * 
 * @author Francisco Javier Ramos Álvarez
 * @version 1.1
 * @package php
 * @see rmpkg.py by Antonio González Romero
 * 
 * @return $code
 */

	session_start();
	
	include_once('config.php');
	include_once('functions.php');
	require_once('myDebLog.class.php');
	
	set_time_limit(TIME_LIMIT);
	
	$repository = $_SESSION['repository']['name'];
	$dist = $_POST['dist'];
	$arch = $_POST['arch'];
	$ok = true;
	
	foreach($_POST['files'] as $pck => $filename){
		
		/** COMANDO ********************************************/
		$cmd = "$rm_pkg_py -p $filename -d $dist -a $arch -c $repo_conf -r $repository";
		$out_ret = execCmdV3($cmd);
		debugPython($cmd, $out_ret);
		/*******************************************************/
		
		$bnf = basename($filename);
		if($out_ret[1] == 0){
			//registramos el movimiento
			registerMovement(DELPKG, array($bnf, $dist));
			$ok = $ok and true;
		}
		else{
			include('msg_err_python.php');
			$msg_err .= "Error Cod. " . $out_ret[1] . "\n";
			$msg_err .= "Fichero: " . $bnf . "\n";
			$msg_err .= "Mensaje: " . $err_python[$out_ret[1]] . ".\n\n";
			$ok = false;
		}
	}
	
	echo ($ok ? 'OK' : $msg_err);
?>