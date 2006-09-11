<?php
/**
 * Class IniAccess
 * Con esta clase podremos, además de leer, escribir en un fichero ini. 
 * 
 * @author Francisco Javier Ramos Álvarez
 * @version 1.0
 * @package php
 * @see IniReader.class.php
 */

include_once('functions.php');
require_once('IniReader.class.php');

class IniAccess extends IniReader{
	
	/**
	 * Constructor de la clase
	 *
	 * @param string $fileini
	 * @return IniAccess
	 */
	function IniAccess($fileini){
		parent::IniReader($fileini);
		if($this->msg_err != '')
			return false;
	}
	
	/**
	 * Modifica una sección completa (lista de campos/valores)
	 *
	 * @param array of string
	 */
	function setSection($section){
		if(is_array($section))
			$this->info[$section] = $section;
	}
	
	/**
	 * Elimina una sección
	 *
	 * @param string $section
	 */
	function delSection($section){
		unset($this->info[$section]);
	}
	
	/**
	 * elimina un campo
	 *
	 * @param string $section
	 * @param string $field
	 */
	function delField($section, $field){
		unset($this->info[$section][$field]);
	}
	
	/**
	 * Establece un nuevo valor para un campo en unsa sección
	 *
	 * @param string $section
	 * @param string $field
	 * @param string $value
	 */
	function setValue($section, $field, $value){
		$this->info[$section][$field] = $value;
	}
	
	/**
	 * Escribe en el fichero ini los nuevos datos. Devolverá
	 * cierto o falso según haya podido o no.
	 *
	 * @return boolean
	 */
	function printFileIni(){
		
		//abrimos el fichero, bloqueando
		if($fp = openFileWithLock($this->fileini, 'w', 10)){
			$str = '';
			
			//montamos la cadena a escribir en el fichero
			foreach($this->info as $section => $content){
				$str .= "[" . $section . "]\n";
				foreach($content as $field => $value)
					$str .= $field . " = " . $value . "\n";
				
				$str .= "\n";
			}
			
			//escribimos, desbloqueamos y cerramos
			fputs($fp, rtrim($str));
			flock($fp, LOCK_UN);
			fclose($fp);
			
			return true;
		}
		else
			return false;
	}
}
?>