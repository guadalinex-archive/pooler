<?php
/**
 * Class Path
 * Se trata de una clase abstracta para trabajar con path.
 * 
 * @author Francisco Javier Ramos Álvarez
 * @version 1.0
 * @package php
 * @see File.class.php
 * 
 * @abstract 
 */


include_once('functions.php');

class Path{
	
	/**
	 * Dirección física del fichero o directorio
	 *
	 * @access private
	 * @var unknown_type
	 */
	var $path = '';
	
	/**
	 * Contenido del fichero o directorio.
	 *
	 * @access private
	 * @var unknown_type
	 */
	var $content = null;
	
	/**
	 * Constructor de la clase
	 *
	 * @param string $path
	 * @return Path
	 */
	function Path($path){
		if($path and @file_exists($path)){
			rtrimslash(&$path); //eliminamos el último slash
			$this->path = $path;
		}
	}
	
	/**
	 * Devuelve el nombre del fichero o carpeta.
	 *
	 * @access public
	 * @return unknown
	 */
	function getBasename(){
		return basename($this->path);
	}
	
	/**
	 * Indica si el path es directorio.
	 *
	 * @access public
	 * @return boolean
	 */
	function isDirectory(){
		return is_dir($this->path);	
	}
	
	/**
	 * Indica si el path es fichero.
	 *
	 * @access public
	 * @return boolean
	 */
	function isFile(){
		return is_file($this->path);
	}
	
	/**
	 * Devuelve el path del fichero o directorio.
	 *
	 * @access public
	 * @return string
	 */
	function getPath(){
		return $this->path;	
	}
	
	/**
	 * Devuelve el contenido del fichero o del directorio (en este último caso
	 * la lista de ficheros y directorios)
	 *
	 * @access public
	 * @abstract 
	 * @return unknown
	 */
	function getContent(){
		return $this->content;
	}
}
?>