<?php set_time_limit(TIME_LIMIT);
/**
 * Module move_src.php
 * Mueve ficheros fuente hacia otras distribuciones.
 * 
 * @author Francisco Javier Ramos Álvarez
 * @version 1.0
 * @package php
 * @see mvpkg.py by Antonio Gonzalez Romero
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
	$ok = true;
	
	foreach($_POST['files'] as $src => $list){
		foreach($list as $filename)
			//sólo es necesario saber la ubicación del fichero dsc
			if(eregi('\.dsc$', $filename)) break;
		
		/** COMANDO ************************************************/
		$cmd = "$mv_pkg_py -p $filename -o $dist_o -d $dist_d -c $repo_conf";
		$out_ret = execCmdV3($cmd);
		debugPython($cmd, $out_ret);
		
		$action = CPYSRC; //estamos copiando
		
		if(isset($_POST['del'])){
			$cmd = "$rm_pkg_py -p $filename -d $dist_o -c $repo_conf";
			$out_ret = execCmdV3($cmd);
			debugPython($cmd, $out_ret);
			
			$action = MOVSRC; //estamos moviendo
		}
		/***********************************************************/
		
		if($out_ret[1] == 0){
			//registramos el movimiento
			registerMovement($action, array(basename($filename), $dist_o . '=>' . $dist_d));
			$ok = $ok and true;
		}
		else{
			$msg_err .= 'Error Cod. ' . $out_ret[1] . '\\n';
			$ok = false;
		}
	}
	
	echo ($ok ? 'OK' : $msg_err);
?>