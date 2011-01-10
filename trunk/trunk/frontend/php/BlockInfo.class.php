<?php
/**
 * Class BlockInfo
 * Almacenará un bloque de datos, campo/valor, proveniente de los
 * ficheros índice Packages/.gz/bz2, Release o Sources/.gz/bz2 .
 * En estos ficheros, cada bloque está separado por dos saltos de línea
 * 
 * @author Francisco Javier Ramos Álvarez
 * @version 1.0
 * @package php
 * @see FileInfo.class.php
 */

class BlockInfo{

	/**
	 * Almacena la lista de pares campo/valor
	 *
	 * @var associative array of string
	 * @access private
	 */
	var $datas = array();
	
	/**
	 * Constructor de la clase
	 *
	 * @access public
	 * @param string $block. Contiene el bloque leido, previamente, en una cadena
	 * @return BlockInfo
	 */
	function BlockInfo($block){
		$field = '';
		
		//separamos la lista de campos/valor
		$lines = explode("\n", $block);
		for($i = 0; $i < count($lines); $i++){
			if(substr(ltrim($lines[$i]), 0, 1) != '#'){ //nos saltamos los comentarios tipo #
			
				//comprobamos si estamos leyendo campos con varias líneas,
				//y que se distinguen por llevar un espacio delante
				if(strcmp(substr($lines[$i], 0, 1), ' ') != 0){
					$field = substr($lines[$i], 0, strpos($lines[$i], ':'));
					$this->datas[$field] = ltrim(substr($lines[$i], strlen($field . ':')));
				}
				else
					//eliminamos sólo el primer espacio
					$this->datas[$field] .= "\n" . substr($lines[$i], 1);
			}
		}
	}
	
	/**
	 * Este método nos devolverá el valor asociado a un campo
	 *
	 * @access public
	 * @param string $field
	 * @return string
	 */
	function getValue($field){
		return array_key_exists($field, $this->datas) ? $this->datas[$field] : null;
	}
	
	/**
	 * Devuelve el array asociativo con la lista de campos/valores
	 * para el bloque procesado.
	 *
	 * @access public
	 * @return associative array of string
	 */
	function getDatas(){
		return $this->datas;
	}
}

?>