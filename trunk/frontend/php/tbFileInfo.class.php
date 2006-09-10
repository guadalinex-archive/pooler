<?php
/**
 * 
 */

include_once('functions.php');
require_once('FileInfo.class.php');

class tbFileInfo extends FileInfo{
	
	var $ids = array();
	
	function tbFileInfo($path){
		parent::FileInfo($path, false);
	}
	
	function getContent($init = 0, $end = 0, $condition = null){
		if(filesize($this->path)){
			if(!$end or $init > $end) $end = $init;
			if($fp = $this->__fileOpen('r')){
				$block = '';
				$line = '';
				$cont = 0;
				$id = 0;
				
				//nos ponemos a buscar los bloques según los índices $init - $end
				while(!feof($fp) and $cont <= $end){
					$line = $this->__fileGets($fp);
					if(trim($line)) //si la línea no está vacía seguimos en el bloque
						$block .= $line;
					else{
						//ya tenemos el bloque, ahora lo procesamos
						if($block = trim($block)){
							$oBlock = new BlockInfo($block);
							if($this->__compare($condition, $oBlock)){
								if($cont >= $init){
									$this->content[] = $oBlock;
									$this->ids[] = $id;
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
	
	function getIds(){
		return $this->ids;
	}
	
	function getValueById($id, $field){
		$index = array_search($id, $this->ids);
		return $this->getValue($index, $field);
	}
	
	function getBlockInfoById($id){
		$index = array_search($id, $this->ids);
		return $this->getBlockInfo($index);
	}
	
	function __fileOpen($mode){
		if(isGzip($this->path))
			return @gzopen($this->path, 'r');
		elseif(isBzip2($this->path))
			return @bzopen($this->path, 'r');
		else
			return @fopen($this->path, 'r');
	}
	
	function __fileGets($resource){
		if(isGzip($this->path))
			return gzgets($resource, 4096);
		elseif(isBzip2($this->path))
			return bz2gets($resource);
		else
			return fgets($resource);
	}
	
	function __fileClose($resource){
		if(isGzip($this->path))
			gzclose($resource);
		elseif(isBzip2($this->path))
			bzclose($resource);
		else
			fclose($resource);
	}
	
	function __compare($condition, $block){
		$ok = true; //por defecto aceptamos (posible condición nula)
		if($condition)
			foreach($condition as $field => $value)
				$ok = ($ok and eregi($value, $block->getValue($field)));
		
		return $ok;
	}
}

?>