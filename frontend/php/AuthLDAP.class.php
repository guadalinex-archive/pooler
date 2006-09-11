<?php
/**
 * Class AuthLDAP
 * Nos sirve para realizar una autenticación LDAP
 * 
 * @author Francisco Javier Ramos Álvarez
 * @version 1.0
 * @package php
 */

//constantes de error para una atenticación LDAP
define('ERR_BIND', 1);
define('ERR_SEARCH', 2);
define('ERR_USERNAME', 3);
define('ERR_MORE_USERNAME', 4);
define('ERR_FETCH', 5);
define('ERR_DN', 6);
define('ERR_AUTH', 7);
define('ERR_CONNECT', 8);

class AuthLDAP{
	
	/**
	 * Almacena el nombre de usuario
	 *
	 * @var string
	 * @access private
	 */
	var $username = '';
	
	/**
	 * Almacena la password
	 *
	 * @var string
	 * @access private
	 */
	var $password = '';
	
	/**
	 * Servidor LDAP. Por defecto "ldap.juntadeandalucia.es"
	 *
	 * @var string
	 * @access private
	 */
	var $ldap_server = 'ldap.juntadeandalucia.es';
	
	/**
	 * Puerto LDAP. Por defecto "ldap.juntadeandalucia.es"
	 *
	 * @var int
	 * @access private
	 */
	var $ldap_port = 389;
	
	/**
	 * DN Base. Por defecto "ldap.juntadeandalucia.es"
	 *
	 * @var string
	 * @access private
	 */
	var $dn_base = 'o=sadesi,o=empleados,o=juntadeandalucia,c=es';
	
	/**
	 * Código de error. Almacenará la constante de error
	 * definidas más arriba.
	 *
	 * @var integer
	 * @access private
	 */
	var $cod_err = 0;
	
	/**
	 * Constructor de la clase. Establecerá las propiedades por defecto
	 *
	 * @access public
	 * @param string $username
	 * @param string $password
	 * @param string $ldap_server
	 * @param string $ldap_port
	 * @param string $dn_base
	 * @return AuthLDAP
	 */
	function AuthLDAP($username, $password, $ldap_server = null, $ldap_port = null, $dn_base = null){
		//parámetros obligatorios
		$this->username = $username;
		$this->password = $password;
		
		//parámetros opcionales
		$this->ldap_server = $ldap_server ? $ldap_server : 'ldap.juntadeandalucia.es';
		$this->ldap_port = $ldap_port ? $ldap_port : 389;
		$this->dn_base = $dn_base ? $dn_base : 'o=sadesi,o=empleados,o=juntadeandalucia,c=es';
	}

	/**
	 * Realiza la autenticación LDAP con los parámetros pasados
	 * en el constructor al objeto. Si hubiese cualquier problema
	 * el código del error se almacenará en el atributo $cod_err
	 *
	 * @access public
	 * @return boolean
	 */
	function Login(){
		if($connect = @ldap_connect($this->ldap_server, $this->ldap_port)){
			
			// realizamos un acceso anónimo
			if(!($bind = @ldap_bind($connect)))
				$this->cod_err = ERR_BIND;
				
			// buscamos al usuario
			elseif(!($res_id = @ldap_search( $connect, $this->dn_base, 'uid=' . $this->username)))
				$this->cod_err = ERR_SEARCH;

			// comprobamos el número de usernames que hay
			elseif(($num_users = @ldap_count_entries($connect, $res_id)) != 1){
				if(!$num_users)
					$this->cod_err = ERR_USERNAME;
				else
					$this->cod_err = ERR_MORE_USERNAME;
			}
				
			// comprobamos que se pueda leer el resultado
			elseif(!($entry_id = @ldap_first_entry($connect, $res_id)))
				$this->cod_err = ERR_FETCH;
		
			// comprobamos que podamos leer su dn
			elseif(!($user_dn = @ldap_get_dn($connect, $entry_id)))
				$this->cod_err = ERR_DN;
		
			// Autenticación del usuario
			elseif($this->password){
				if(!($link_id = @ldap_bind($connect, $user_dn, $this->password)))
					$this->cod_err = ERR_AUTH;
			}
			else //evitamos la conexión anónima
				$this->cod_err = ERR_AUTH;

			@ldap_close($connect);
		}
		else
			$this->cod_err = ERR_CONNECT;
		
		return !$this->cod_err; //si no hay errores la autenticación ha sido correcta
	}
}	
?>