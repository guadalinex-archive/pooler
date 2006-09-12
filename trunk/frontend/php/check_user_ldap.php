<?php
/**
 * Module check_user_ldap.php
 * Realiza la autenticación por LDAP, devolviendo OK si la autenticación ha ido bien,
 * en caso contrario devolverá el código del error.
 * 
 * @author Francisco Javier Ramos Álvarez
 * @version 1.0
 * @package php
 * @see AuthLDAP.class.php
 * @see IniReader.class.php
 * 
 * @return $code
 */
	
	include_once('config.php');
	include_once('functions.php');
	require_once('AuthLDAP.class.php');
	require_once('IniReader.class.php');
	
	if(isset($_GET['login']) and isset($_GET['password'])){
		//distinguimos entre usuario normal y superusuario admin
		if($_GET['login'] == 'admin'){
			$inireader = new IniReader(USERS_INI);
			$param = $inireader->getSection('admin');
			
			if(strcmp($param['password'], md5($_GET['password'])) == 0){
				//autenticación correcta por parte de admin
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
			if($objAuth->Login()){
			//if(true){
				//autenticación correcta por parte de un usuario normal
				session_start();
				
				//obtenemos su permisos de usuario
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