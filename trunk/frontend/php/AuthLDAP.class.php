<?php
/**
 * 
 */

define('ERR_BIND', 1);
define('ERR_SEARCH', 2);
define('ERR_USERNAME', 3);
define('ERR_MORE_USERNAME', 4);
define('ERR_FETCH', 5);
define('ERR_DN', 6);
define('ERR_AUTH', 7);
define('ERR_CONNECT', 8);

class AuthLDAP{
	
	var $username = '';
	var $password = '';
	var $ldap_server = '';
	var $ldap_port = 0;
	var $dn_base = '';
	var $err_log = 0;
	
	function AuthLDAP($username, $password, $ldap_server = null, $ldap_port = null, $dn_base = null){
		//parámetros obligatorios
		$this->username = $username;
		$this->password = $password;
		
		//parámetros opcionales
		$this->ldap_server = $ldap_server ? $ldap_server : 'ldap.juntadeandalucia.es';
		$this->ldap_port = $ldap_port ? $ldap_port : 389;
		$this->dn_base = $dn_base ? $dn_base : 'o=sadesi,o=empleados,o=juntadeandalucia,c=es';
	}

	function Login(){
		if($connect = @ldap_connect($this->ldap_server, $this->ldap_port)){
			
			// realizamos un acceso anónimo
			if(!($bind = @ldap_bind($connect)))
				$this->err_log = ERR_BIND;
				
			// buscamos al usuario
			elseif(!($res_id = @ldap_search( $connect, $this->dn_base, 'uid=' . $this->username)))
				$this->err_log = ERR_SEARCH;

			// comprobamos el número de usernames que hay
			elseif(($num_users = @ldap_count_entries($connect, $res_id)) != 1){
				if(!$num_users)
					$this->err_log = ERR_USERNAME;
				else
					$this->err_log = ERR_MORE_USERNAME;
			}
				
			// comprobamos que se pueda leer el resultado
			elseif(!($entry_id = @ldap_first_entry($connect, $res_id)))
				$this->err_log = ERR_FETCH;
		
			// comprobamos que podamos leer su dn
			elseif(!($user_dn = @ldap_get_dn($connect, $entry_id)))
				$this->err_log = ERR_DN;
		
			// Autenticación del usuario
			elseif($this->password){
				if(!($link_id = @ldap_bind($connect, $user_dn, $this->password)))
					$this->err_log = ERR_AUTH;
			}
			else //evitamos la conexión anónima
				$this->err_log = ERR_AUTH;

			@ldap_close($connect);
		}
		else
			$this->err_log = ERR_CONNECT;
		
		return !$this->err_log; //si no hay errores la autenticación ha sido correcta
	}
}	
?>