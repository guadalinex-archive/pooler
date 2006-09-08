<?php

include_once('functions.php');
require_once('Path.class.php');

class File extends Path{
	
	function File($path, $open = false){
		parent::Path($path);
		
		if($this->isFile()){
			if($open) $this->getContent();
		}
		else
			die('[!] Error: File.class - No es un Fichero.');
	}
	
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