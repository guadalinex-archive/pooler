<?php 
/**
 * Module move_pkg.php
 * Mueve paquetes hacia otras distribuciones.
 * 
 * @author Francisco Javier Ramos Álvarez
 * @version 1.0
 * @package php
 * @see mvpkg.py by Antonio Gonzales Romero
 * 
 * @return $code
 */

	session_start();
	
	include_once('config.php');
	include_once('functions.php');
	require_once('myDebLog.class.php');
	
	set_time_limit(TIME_LIMIT);
	
	$dist_o = $_POST['dist_o']; //distro origen
	$dist_d = $_POST['dist_d']; //distro destino
	
	foreach($_POST['files'] as $pck => $filename){
		
		/** COMANDO ************************************************/
		$cmd = "$mv_pkg_py -p $filename -o $dist_o -d $dist_d -c $repo_conf";
		$out_ret = execCmdV3($cmd);
		/***********************************************************/
		
		//registramos el movimiento
		registerMovement(MOVPKG, array(basename($filename), $dist_o . '=>' . $dist_d));
	}
?>