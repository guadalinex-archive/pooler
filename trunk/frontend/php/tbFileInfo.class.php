<?php
/**
 * Class tbFileInfo
 * Esta clase nos permite trabajar con los ficheros índices, Packages y Sources,
 * de una manera similar a como lo haríamos con una base de datos, realizando
 * consultas por campos y paginación de los resultados.
 * 
 * @author Francisco Javier Ramos Álvarez
 * @version 1.0
 * @package php
 * @see FileInfo.class.php
 * @see BlockInfo.class.php
 * @see functions.php (bzopen by Fran)
 */

include_once('functions.php');
require_once('FileInfo.class.php');

class tbFileInfo extends FileInfo{
	
	/**
	 * Almacena los ids de cada registro, es decir,
	 * sus posiciones dentro del fichero.
	 *
	 * @access private
	 * @var array of integer
	 */
	var $ids = array();
	
	/**
	 * Constructor de la clase. No almacenará el contenido del fichero índice,
	 * de manera que ahorramos memoria en el servidor.
	 *
	 * @access public
	 * @param string $path
	 * @return tbFileInfo
	 */
	function tbFileInfo($path){
		parent::FileInfo($path, false);
	}
	
	/**
	 * Devuelve el listado de bloques leidos, paginados, según las condiciones
	 * de filtrado.
	 *
	 * @access public
	 * @param integer $init, posición inicio
	 * @param integer $end, posición final
	 * @param associative array of string $condition (condicion => valor)
	 * @return array of BlockInfo
	 */
	function getContent($init = 0, $end = 0, $condition = null){
		if(filesize($this->path)){
			if(!$end or $init > $end) $end = $init;
			
			//comenzamos a leer el fichero secuencialmente
			if($fp = $this->__fileOpen('r')){
				$block = '';
				$line = '';
				$cont = 0;
				$id = 0;
				
				//nos ponemos a buscar los bloques según los índices $init - $end
				while(!feof($fp) and $cont <= $end){
					$line = $this->__fileGets($fp);
					//si la línea no está vacía seguimos en el bloque
					if(trim($line))
						$block .= $line;
					else{
						//ya tenemos el bloque, ahora lo procesamos
						if($block = trim($block)){
							$oBlock = new BlockInfo($block);
							//si cumple la condición lo añadimos
							if($this->__compare($condition, $oBlock)){
								if($cont >= $init){
									$this->content[] = $oBlock; //guardamos bloque
									$this->ids[] = $id; //guardamos posición
								}
								$cont++;
							}
							$oBlock = null;
							$block = '';
							$id++;
						}
					}
				}
				
				$this->__fileClose($fp);
			}
			return $this->content;
		}
		else
			return null;
	}
	
	/**
	 * Devuelve el listado de ids de los bloques
	 *
	 * @access public
	 * @return array of integer
	 */
	function getIds(){
		return $this->ids;
	}
	
	/**
	 * Devuelve el valor de un campo según su id (posición dentro del fichero).
	 *
	 * @access public
	 * @param integer $id
	 * @param string $field
	 * @return string
	 */
	function getValueById($id, $field){
		$index = array_search($id, $this->ids);
		return $this->getValue($index, $field);
	}
	
	/**
	 * Devuelve el bloque entero según su id
	 *
	 * @access public
	 * @param integer $id
	 * @return BlockInfo
	 */
	function getBlockInfoById($id){
		$index = array_search($id, $this->ids);
		return $this->getBlockInfo($index);
	}
	
	/**
	 * Enmascara la apertura de ficheros, comprimidos o no
	 *
	 * @access private
	 * @param char $mode
	 * @return file
	 */
	function __fileOpen($mode){
		if(isGzip($this->path))
			return @gzopen($this->path, 'r');
		elseif(isBzip2($this->path))
			return @bzopen($this->path, 'r');
		else
			return @fopen($this->path, 'r');
	}
	
	/**
	 * Lectura del fichero, por línea
	 *
	 * @access private
	 * @param file $resource
	 * @return string
	 */
	function __fileGets($resource){
		if(isGzip($this->path))
			return gzgets($resource, 4096);
		elseif(isBzip2($this->path))
			return bz2gets($resource);
		else
			return fgets($resource);
	}
	
	/**
	 * Cierre del fichero.
	 * 
	 * @access private
	 * @param file $resource
	 */
	function __fileClose($resource){
		if(isGzip($this->path))
			gzclose($resource);
		elseif(isBzip2($this->path))
			bzclose($resource);
		else
			fclose($resource);
	}
	
	/**
	 * Compara un bloque con una serie de criterios de filtrado, devolviendo
	 * cierto (and) si cumple todas las condiciones.
	 *
	 * @access private
	 * @param associative array of string $condition
	 * @param BlockInfo $block
	 * @return boolean
	 */
	function __compare($condition, $block){
		$ok = true; //por defecto aceptamos (posible condición nula)
		if($condition)
			foreach($condition as $field => $value)
				$ok = ($ok and eregi($value, $block->getValue($field)));
		
		return $ok;
	}
}

?>