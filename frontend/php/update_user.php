<?php 

	session_start();
	
	//modificamos el fichero ini	

	include_once('config.php');
	require_once('IniAccess.class.php');
	
	if(isset($_POST['username'])){
		
		$oIni = new IniAccess(USERS_INI);
		$user = $_POST['username'];
		$isEdit = isset($_POST['olduser']);
		
		//si hemos actualizado el username eliminamos el anterior
		if($isEdit) unset($oIni->info[$_POST['olduser']]);
		
		$oIni->info[$user] = array();
		
		if(isset($_POST['app'])) $oIni->info[$user]['app'] = $_POST['app'];
		if(isset($_POST['users'])) $oIni->info[$user]['users'] = $_POST['users'];
		
		if(isset($_POST['dists']) and is_array($_POST['dists'])){
			$dists = $_POST['dists'];
			foreach($dists as $dist => $rw)
				$oIni->info[$user]['dist.' . $dist] = $rw;
		}
		
		$oIni->printFileIni(); //guardamos cambios
		
		//registramos el movimiento
		registerMovement($isEdit ? EDTUSER : ADDUSER, array($user));
		
		echo 'OK';
	}
	
?>