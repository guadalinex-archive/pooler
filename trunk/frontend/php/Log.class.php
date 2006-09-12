<?php
/**
 * Class Log
 * Clase para trabajar con logs
 * 
 * @author Francisco Javier Ramos Álvarez
 * @version 1.0
 * @package php
 * @see myDebLog.class.php
 */

include_once('functions.php');

//constantes de ordenación, ascendente, descendente
define('ORDER_ASC', 'ASC');
define('ORDER_DESC', 'DESC');

class Log{
	
	/**
	 * Nombre del fichero log
	 *
	 * @access private
	 * @var string
	 */
	var $log = '';
	
	/**
	 * Constructor de la clase
	 *
	 * @access public
	 * @param string $log. Path del log
	 * @return Log
	 */
	function Log($log){
		$this->log = $log;
	}
	
	/**
	 * Imprime una línea en el fichero log
	 *
	 * @access public
	 * @param string $line
	 */
	function putLine($line){
		//abre bloqueando fichero log
		if($fp = openFileWithLock($this->log, 'a', 10)){
			//imprime, desbloquea un cierra
			fputs($fp, $line . "\n");
			flock($fp, LOCK_UN);
			fclose($fp);
		}
		else
			die('[!] Error: no se pudo abrir el fichero log');
	}
	
	/**
	 * Devuelve el fichero log como una lista ordenada de líneas impresas
	 * en dicho fichero.
	 *
	 * @access public
	 * @param string $order
	 * @return array of string
	 */
	function getLog($order = ORDER_DESC){
		if(file_exists($this->log)){
			if($order == ORDER_ASC)
				return file($this->log);
			else{
				$file = file($this->log);
				return array_reverse($file); //ordenamos descendentemente
			}
		}
		else
			return null;
	}
	
	/**
	 * Devuelve el fichero log como una lista ordenada de líneas impresas
	 * en dicho fichero, las cuales han sido previamente filtradas
	 * por una serie de criterios.
	 *
	 * @access public
	 * @param string $awkFilter. Expresión regular con formato AWK
	 * @param string $order
	 * @return unknown
	 * @see functions.php (execCmdV2)
	 */
	function getLogByAwkFilter($awkFilter, $order = ORDER_DESC){
		if(file_exists($this->log)){
			if($order == ORDER_ASC)
				$cmd = 'cat ';
			else
				$cmd = 'tac ';
			
			$cmd .= $this->log;
			return execCmdV2($cmd . " | awk '/" . $awkFilter . "/'");
		}
		else
			return null;
	}
}
	
?>