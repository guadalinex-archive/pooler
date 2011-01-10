<?php
/**
 * Class IniReader
 * Con ella podremos leer los ficheros con formato ini:
 * 
 * [section]
 * field = value [ó field : value]
 * ...
 * 
 * @author Francisco Javier Ramos Álvarez
 * @version 1.2
 * @package php
 */
	
class IniReader{
	
	/**
	 * Contiene el path del fichero ini
	 * 
	 * @var string
	 * @access private
	 */
	var $fileini = '';
	
	/**
	 * Contiene un array asociativo con las secciones del fichero.
	 * 
	 * @var associative array of array of string
	 * @access private
	 */
	var $info = array();
	
	/**
	 * Almacena el mensaje de error, si lo hubiera.
	 * 
	 * @var string
	 * @access public
	 */
	var $msg_err = '';
	
	/**
	 * Constructor de la clase. Procederá a leer el contenido del
	 * fichero ini, pasado como parámetro.
	 *
	 * @access public
	 * @param string $fileini
	 * @return IniReader
	 */
	function IniReader($fileini){
		if(file_exists($fileini) and @is_file($fileini)){
			
			//abrimos el fichero y procedemos a leerlo
			if($fp = @fopen($fileini, 'r')){
				$this->fileini = $fileini;
				while(!feof($fp)){
					$line = trim(fgets($fp));
					
					//controlamos los comentarios (; o #)
					if($line and !ereg(';|#', substr($line, 0, 1))){
						
						//formato de sección ([section])
						if(ereg('^\[.+\]$', $line)){
							$section = ereg_replace('\[|\]', '', $line);
							$this->info[$section] = array();
						}
						else{
							
							//controlamos el formato (param = value)
							if(ereg('^[a-zA-Z0-9\._-]+[[:space:]]*(=|:)[[:space:]]*.*$', $line)){
								list($field, $value) = split('[[:space:]]*(=|:)[[:space:]]*', $line);
								
								//tratamos los values para eliminar los comentarios
								if(ereg('^\".+\"', $value))
									$value = substr($value, 0, strpos($value, '"', 1)+1);
								else{
									$aux = split(';|#', $value);
									$value = rtrim($aux[0]);
								}
								
								
								$section = !isset($section) ? 'main' : $section;
								$this->info[$section][$field] = $value;
							}
							else
								$this->msg_err = 'No es correcto el formato del fichero ini';
						}
					}
				}
			}
			else
				$this->msg_err = 'No se pudo abrir el fichero ini';
		}
		else
			$this->msg_err = 'Hay un problema con el fichero ini';
	}
	
	/**
	 * Indica si todo ha ido correctamente, es decir, no ha habido
	 * ningún mensaje de error en el constructor.
	 *
	 * @access public
	 * @return boolean
	 */
	function isOk(){
		return ($this->msg_err == '');
	}
	
	/**
	 * Devolverá el contenido de una sección.
	 *
	 * @access public
	 * @param string $section
	 * @return array of string
	 */
	function getSection($section){
		return $this->info[$section];
	}
	
	/**
	 * Devolverá el valor de un campo, por sección.
	 *
	 * @access public
	 * @param string $section
	 * @param string $field
	 * @return string
	 */
	function getValue($section, $field){
		return $this->info[$section][$field];
	}
	
	/**
	 * Comprueba si existe la sección.
	 *
	 * @access public
	 * @param string $section
	 * @return boolean
	 */
	function sectionExists($section){
		return array_key_exists($section, $this->info);
	}
}
?>