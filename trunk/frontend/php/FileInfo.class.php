<?php
/**
 * Class FileInfo
 * Cargará los ficheros índices, Packages y Sources, como una lista de bloques.
 * En resumen, será como una tabla con registros (bloques de datos).
 * 
 * @author Francisco Javier Ramos Álvarez
 * @version 1.0
 * @package php
 * @see File.class.php
 * @see BlockInfo.class.php
 */

include_once('functions.php');
require_once('File.class.php');
require_once('BlockInfo.class.php');

class FileInfo extends File{
	
	/**
	 * Constructor de la clase. Por defecto cargará el fichero en memoria.
	 *
	 * @access public
	 * @param string $path
	 * @param boolean $open
	 * @return FileInfo
	 */
	function FileInfo($path, $open = true){
		//sólo ficheros Release, Packages y Sources
		if(ereg('^Release|^Packages|^Sources', basename($path))){
			parent::File($path, $open);
			
			if($open){
				//formateamos la información, separando por bloques de datos
				$aux = array();
				$expinfo = explode("\n\n", trim($this->content));
				for($i = 0; $i < count($expinfo); $i++)
					$aux[] = new BlockInfo($expinfo[$i]);
				$this->content = $aux;
			}

		}
		else
			$this->msg_err = '[!] Error: el tipo de fichero ha de ser Packages, Sources, Release';
	}
	
	/**
	 * Devuelve el valor de un campo, dado por su id.
	 *
	 * @access public
	 * @param integer $index
	 * @param string $field
	 * @return string
	 */
	function getValue($index, $field){
		if($index < count($this->content)){
			$block = $this->content[$index];
			return $block->getValue($field);
		}
		else
			return false;
	}
	
	/**
	 * Devuelve un bloque de datos, dado por el índice dentro de la lista.
	 *
	 * @access public
	 * @param integer $index
	 * @return BlockInfo
	 */
	function getBlockInfo($index){
		if($index < count($this->content))
			return $this->content[$index];
		else
			return false;
	}
}

?>