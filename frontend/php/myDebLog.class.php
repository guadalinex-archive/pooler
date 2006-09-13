<?php
/**
 * Class myDebLog
 * Registrará todos los movimientos que se hagan en la aplicación, tales como
 * añadir nuevos paquetes, eliminarlos, añadir usuarios, logins, etc...
 * 
 * @author Francisco Javier Ramos Álvarez
 * @version 1.0
 * @package php
 * @see Log.class.php
 */

//acciones de paquetes
define('ADDPKG', 'addpkg');
define('MOVPKG', 'movpkg');
define('DELPKG', 'delpkg');

//acciones con fuentes
define('ADDSRC', 'addsrc');
define('MOVSRC', 'movsrc');
define('DELSRC', 'delsrc');

//acciones de login
define('LOGIN', 'login');
define('LOGOUT', 'logout');

//acciones de usuarios
define('ADDUSER', 'adduser');
define('EDTUSER', 'edtuser');
define('DELUSER', 'deluser');

include_once('config.php');
require_once('Log.class.php');

class myDebLog extends Log{
	
	/**
	 * Guardará el nombre de usuario que realiza el movimiento o la acción.
	 *
	 * @see private
	 * @var string
	 */
	var $user = '';
	
	/**
	 * Constructor de la clase.
	 *
	 * @access public
	 * @param string $user
	 * @return myDebLog
	 */
	function myDebLog($user = 'admin'){
		$this->user = $user;
		
		//si no existe, creará un fichero cuyo nombre corresponde con la fecha
		//del día de creación en formato yyyymmdd.log
		parent::Log(PATH_LOG . '/' . date('Ymd') . '.log');
	}
	
	/**
	 * Escribe una línea en el fichero log
	 *
	 * @access public
	 * @param string $action
	 * @param array of string $params
	 * @see config.php (acciones definidas)
	 */
	function putLine($action, $params = array()){
		//montamos la línea, cuyos campos irán separados por el caracter |
		$line = $this->user . '|';
		$line .= $action;
		$line .= ($params ? '|' . implode('|', $params) : '') . '|';
		$line .= date('H:i:s');
		parent::putLine($line);
	}
}

?>