<?php 
/**
 * Módulo delete_src.php
 * Elimina paquetes del repositorio.
 * 
 * @author Francisco Javier Ramos Álvarez
 * @version 1.0
 * @package php
 * @see rmpkg.py by Antonio Gonzales Romero
 * 
 * @return $code
 */

	session_start();
	
	include_once('config.php');
	include_once('functions.php');
	require_once('myDebLog.class.php');

	$dist = $_POST['dist'];
	
	foreach($_POST['files'] as $src => $list){
		foreach($list as $filename)
			if(eregi('\.dsc$', $filename)) break;
		
		
		/** COMANDO ********************************************/
		$cmd = "$rm_pkg_py -p $filename -d $dist -c $repo_conf";
		$out_ret = execCmdV3($cmd);
		/*******************************************************/
		
		//registramos el movimiento
		registerMovement(DELSRC, array(basename($filename), $dist));
	}
?>