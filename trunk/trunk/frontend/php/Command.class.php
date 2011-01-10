<?php
/**
 * Class Command
 * Ejecutará comandos externos, almacenando las salidas, tanto por
 * pantalla como del programa.
 * 
 * @author Francisco Javier Ramos Álvarez
 * @version 1.0
 * @package php
 */

class Command{
	
	/**
	 * Almacenará el comando ejecutado
	 *
	 * @var string
	 * @access private
	 */
	var $cmd = '';
	
	/**
	 * Guardará un array con la salida del comando. El array constará
	 * de cada línea de la salida estandar.
	 *
	 * @var array of string
	 * @access private
	 */
	var $out = array();
	
	/**
	 * Valor de retorno del programa externo.
	 *
	 * @var integer
	 * @access private
	 */
	var $ret = -1;
	
	/**
	 * Almacena el mensaje de error, si lo hubiera.
	 * 
	 * @var string
	 * @access public
	 */
	var $msg_err = '';
	
	/**
	 * Constructor de la clase
	 *
	 * @access public
	 * @param string $cmd
	 * @return Command
	 */
	function Command($cmd = ''){
		$this->cmd = $cmd;
	}
	
	/**
	 * Establece el comando a ejecutar
	 *
	 * @access public
	 * @param string $cmd
	 */
	function setCmd($cmd){
		if($cmd)
			$this->Command($cmd);
		else{
			//en principio esto no tiene mucho sentido, ya que
			//se le pasará siempbre un comando.
			$this->msg_err = '[!] Error: no se puede pasar un comando vacío';
			return false;
		}
	}
	
	/**
	 * Ejecuta un comando externo.
	 *
	 * @access public
	 * @param string $cmd
	 * @return string
	 */
	function execute($cmd = ''){
		$this->cmd = $cmd ? $cmd : $this->cmd;
		if($this->cmd){
			//almacenamos la salida estandar en $this->out,
			//y el valor de retorno en $this->ret
			return exec($this->cmd, $this->out, $this->ret);
		}
		else{
			$this->msg_err = '[!] Error: no se puede ejecutar un comando vacío';
			return false;
		}
	}
	
	/**
	 * Devolverá la salida estandar como un array de líneas.
	 *
	 * @access public
	 * @return array of string
	 */
	function getOut(){
		return $this->out;
	}
	
	/**
	 * Devolverá la salida como una cadena.
	 *
	 * @access public
	 * @return string
	 */
	function getStringOut(){
		return implode("\n", $this->out);
	}
	
	/**
	 * Devuelve la salida del programa.
	 *
	 * @access public
	 * @return integer
	 */
	function getRet(){
		return $this->ret;
	}
}

?>