<?php
/**
 * 
 */

class BlockInfo{

	var $datas = array();
	
	function BlockInfo($block){
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
	
	function getValue($field){
		return array_key_exists($field, $this->datas) ? $this->datas[$field] : null;
	}
	
	function getDatas(){
		return $this->datas;
	}
}

?>