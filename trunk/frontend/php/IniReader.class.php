<?php
	
class IniReader{
	
	var $fileini = '';
	var $info = array();
	
	function IniReader($fileini){
		if(file_exists($fileini) and @is_file($fileini)){
			//abrimos el fichero y procedemos a leerlo
			if($fp = @fopen($fileini, 'r')){
				$this->fileini = $fileini;
				while(!feof($fp)){
					$line = trim(fgets($fp));
					if($line and substr($line, 0, 1) != ';'){
						if(ereg('^\[.+\]$', $line)){
							$section = ereg_replace('\[|\]', '', $line);
							$this->info[$section] = array();
						}
						else{
							if(ereg('^[a-zA-Z0-9\._-]+[[:space:]]*=[[:space:]]*.*$', $line)){
								list($field, $value) = split('[[:space:]]*=[[:space:]]*', $line);
								
								//tratamos los values para eliminar los comentarios
								if(ereg('^\".+\"', $value))
									$value = substr($value, 0, strpos($value, '"', 1)+1);
								else
									if(($pc = strpos($value, ';')) !== false)
										$value = rtrim(substr($value, 0, $pc));
								
								
								$section = !isset($section) ? 'main' : $section;
								$this->info[$section][$field] = $value;
							}
							else{
								echo $line."<br>\n";
								die('[!] Error: no es correcto el formato del fichero ini');
							}
						}
					}
				}
			}
			else
				die('[!] Error: no se pudo abrir el fichero ini');
		}
		else
			die('[!] Error: hay un problema con el fichero');
	}
	
	function getSection($section){
		return $this->info[$section];
	}
	
	function getValue($section, $field){
		return $this->info[$section][$field];
	}
	
	function sectionExists($section){
		return array_key_exists($section, $this->info);
	}
}

?>