<?php
/**
 * 
 */

include_once('functions.php');
require_once('File.class.php');
require_once('BlockInfo.class.php');

class FileInfo extends File{
	
	function FileInfo($path, $open = true){
		if(ereg('^Release|^Packages|^Sources', basename($path))){
			parent::File($path, $open);
			
			if($open){
				//formateamos la información
				$aux = array();
				$expinfo = explode("\n\n", trim($this->content));
				for($i = 0; $i < count($expinfo); $i++)
					$aux[] = new BlockInfo($expinfo[$i]);
				$this->content = $aux;
			}

		}
		else
			die('[!] Error: el tipo de fichero ha de ser Packages, Sources, Release');
	}
	
	function getValue($index, $field){
		if($index < count($this->content)){
			$block = $this->content[$index];
			return $block->getValue($field);
		}
		else
			return false;
	}
	
	function getBlockInfo($index){
		if($index < count($this->content))
			return $this->content[$index];
		else
			return false;
	}
}

?>