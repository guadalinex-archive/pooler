<?php

include_once('functions.php');
require_once('IniReader.class.php');

class IniAccess extends IniReader{
	
	function IniAccess($fileini){
		parent::IniReader($fileini);
	}
	
	function setSection($section){
		if(is_array($section))
			$this->info[$section] = $section;
	}
	
	function delSection($section){
		unset($this->info[$section]);
	}
	
	function delField($section, $field){
		unset($this->info[$section][$field]);
	}
	
	function setValue($section, $field, $value){
		$this->info[$section][$field] = $value;
	}
	
	function printFileIni(){
		//escribimos el nuevo fichero ini
		
		if($fp = openFileWithLock($this->fileini, 'w', 10)){
			$str = '';
			foreach($this->info as $section => $content){
				$str .= "[" . $section . "]\n";
				foreach($content as $field => $value)
					$str .= $field . " = " . $value . "\n";
				
				$str .= "\n";
			}
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