<?php
/**
 * 
 */
	
	include_once('config.php');
	include_once('functions.php');
	require_once('AuthLDAP.class.php');
	require_once('IniReader.class.php');
	
	if(isset($_GET['login']) and isset($_GET['password'])){
		if($_GET['login'] == 'admin'){
			$inireader = new IniReader(USERS_INI);
			$param = $inireader->getSection('admin');
			
			if(strcmp($param['password'], md5($_GET['password'])) == 0){
				//autenticación correcta.
				session_start();
				
				//añadimos parámetros de administrador
				addParamAdmin(&$param);
				
				$_SESSION['user_' . session_id()] = array(
															'old_mktime' => mktime(),
															'new_mktime' => mktime(),
															'login' => 'admin',
															'param' => $param
															
													);
				registerMovement(LOGIN);
				echo 'OK'; //retornamos OK
			}
			else
				echo ERR_AUTH;
		}
		else{
			$objAuth = new AuthLDAP(
				$_GET['login'],
				$_GET['password']
			);
			
			//nos logeamos
			//if($objAuth->Login()){
			if(true){
				//autenticación correcta.
				session_start();
	
				$inireader = new IniReader(USERS_INI);
				$param = $inireader->getSection($_GET['login']);
				$_SESSION['user_' . session_id()] = array(
															'old_mktime' => mktime(),
															'new_mktime' => mktime(),
															'login' => $_GET['login'],
															'param' => $param
															
													);
				registerMovement(LOGIN);
				echo 'OK'; //retornamos OK
			}
			else
				echo $objAuth->cod_err;
		}
	}
?>