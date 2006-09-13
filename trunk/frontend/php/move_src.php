<?php set_time_limit(TIME_LIMIT);
/**
 * Module move_src.php
 * Mueve ficheros fuente hacia otras distribuciones.
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
	
	$dist_o = $_POST['dist_o']; //distribución origen
	$dist_d = $_POST['dist_d']; //distribución destino
	
	foreach($_POST['files'] as $src => $list){
		foreach($list as $filename)
			//sólo es necesario saber la ubicación del fichero dsc
			if(eregi('\.dsc$', $filename)) break;
		
		/** COMANDO ************************************************/
		$cmd = "$mv_pkg_py -p $filename -o $dist_o -d $dist_d -c $repo_conf";
		$out_ret = execCmdV3($cmd);
		/***********************************************************/
		
		//registramos el movimiento
		registerMovement(MOVSRC, array(basename($filename), $dist_o . '=>' . $dist_d));
	}
?>