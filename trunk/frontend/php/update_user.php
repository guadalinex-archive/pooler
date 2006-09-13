<?php 
/**
 * Module update_user.php
 * Añadirá o editará los datos de un usuario, así como las distribuciones a las que
 * pueda tener acceso y sus permisos.
 * 
 * @author Francisco Javier Ramos Álvarez
 * @version 1.1
 * @package php
 * @see IniAccess.class.php by
 * 
 * @return $code
 */

	session_start();
	
	//modificamos el fichero ini	

	include_once('config.php');
	require_once('IniAccess.class.php');
	require_once('myDebLog.class.php');
	
	if(isset($_POST['username'])){
		
		//cargamos la configuración de usuarios
		$oIni = new IniAccess(USERS_INI);
		$user = $_POST['username'];
		$isEdit = isset($_POST['olduser']);
		$isPass = isset($_POST['passuser']);
		
		//si hemos actualizado el username eliminamos el anterior
		if($isEdit) unset($oIni->info[$_POST['olduser']]);
		
		$oIni->info[$user] = array();
		
		if(!AUTH_LDAP and $isPass) $oIni->info[$user]['password'] = $_POST['passuser'];
		if(isset($_POST['app'])) $oIni->info[$user]['app'] = $_POST['app'];
		if(isset($_POST['users'])) $oIni->info[$user]['users'] = $_POST['users'];
		
		if(isset($_POST['dists']) and is_array($_POST['dists'])){
			$dists = $_POST['dists'];
			foreach($dists as $dist => $rw)
				//damos nuevos valores
				$oIni->info[$user]['dist.' . $dist] = $rw;
		}
		
		$oIni->printFileIni(); //guardamos cambios
		
		//registramos el movimiento
		registerMovement($isEdit ? EDTUSER : ADDUSER, array($user));
		
		echo 'OK';
	}
	
?>