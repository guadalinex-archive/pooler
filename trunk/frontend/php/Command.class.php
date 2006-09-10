<?php
/**
 * 
 */

class Command{
	
	var $cmd = '';
	var $out = array();
	var $ret = -1;
	
	function Command($cmd = ''){
		$this->cmd = $cmd;
	}
	
	function setCmd($cmd){
		if($cmd)
			$this->Command($cmd);
		else
			die('[!] Error: no se puede pasar un comando vacío');
	}
	
	function execute($cmd = ''){
		$this->cmd = $cmd ? $cmd : $this->cmd;
		if($this->cmd)
			return exec($this->cmd, $this->out, $ret);
		else
			die('[!] Error: no se puede ejecutar un comando vacío');
	}
	
	function getOut(){
		return $this->out;
	}
	
	function getStringOut(){
		return implode("\n", $this->out);
	}
	
	function getRet(){
		$this->ret;
	}
}

?>