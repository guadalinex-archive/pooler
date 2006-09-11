<?php
/**
 * Class File
 * Trabajará con ficheros, almacenando el contenido como una cadena.
 * 
 * @author Francisco Javier Ramos Álvarez
 * @version 1.0
 * @package php
 * @see Path.class.php
 */

include_once('functions.php');
require_once('Path.class.php');

class File extends Path{
	
	/**
	 * Almacena el mensaje de error, si lo hubiera.
	 * 
	 * @var string
	 * @access public
	 */
	var $msg_err = '';
	
	/**
	 * Constructor de la clase. Abrirá o no el fichero, almacenándo 
	 * el contenido.
	 *
	 * @access public
	 * @param string $path
	 * @param boolean $open. Indicará si leemos el contenido o no, volcándolo.
	 * @return File
	 */
	function File($path, $open = false){
		parent::Path($path);
		
		if($this->isFile()){
			if($open) 
				$this->getContent(); //volcamos el contenido del fichero
		}
		else{
			$this->msg_err = '[!] Error: File.class - No es un Fichero';
			return false;
		}
	}
	
	/**
	 * Este método nos devolverá el contenido del fichero, independiéntemente
	 * que el fichero esté comprimido en gzip o en bzip2
	 *
	 * @access public
	 * @return string
	 * @see functions.php (extractGZFile, extractBZ2File, extractFile)
	 */
	function getContent(){
		if(isGzip($this->path))
			$this->content = extractGZFile($this->path);
		elseif(isBzip2($this->path))
			$this->content = extractBZ2File($this->path);
		else
			$this->content = extractFile($this->path);
		
		return parent::getContent();
	}
}
?>