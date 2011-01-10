<?php 
/**
 * Module get_component.php
 * Devolverá los componentes de una determinada distribución en formato json.
 * 
 * @author Francisco Javier Ramos Álvarez
 * @version 1.0
 * @package php
 * @see JSON.php
 * 
 * @return array
 */

	session_start();
	include_once('config.php');
	include('functions.php');
	include('JSON.php');
	
	$lstComp = array();
	
	if(!empty($_GET['dist'])){
		$pathComp = $_SESSION['repository']['path'] . '/dists/' . $_GET['dist'];
		$out =  execCmdV2('ls ' . $pathComp);
		if($out[0]){
			for($i = 0; $i < count($out); $i++){
				$p = $pathComp . '/' . $out[$i];
				if(isDirectory($p))
					$lstComp[] = $out[$i]; //guardamos sólo directorios
			}
		}
	}
	
	$json = new Services_JSON();
	die($json->encode($lstComp));
?>