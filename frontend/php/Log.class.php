<?php

include_once('functions.php');

define('ORDER_ASC', 'ASC');
define('ORDER_DESC', 'DESC');

class Log{
	
	var $log = '';
	
	function Log($log){
		$this->log = $log;
	}
	
	function putLine($line){
		if($fp = openFileWithLock($this->log, 'a', 10)){
			fputs($fp, $line . "\n");
			flock($fp, LOCK_UN);
			fclose($fp);
		}
		else
			die('[!] Error: no se pudo abrir el fichero log');
	}
	
	function getLog($order = ORDER_DESC){
		if(file_exists($this->log)){
			if($order == ORDER_ASC)
				return file($this->log);
			else{
				$file = file($this->log);
				return array_reverse($file);
			}
		}
		else
			return null;
	}
	
	function getLogByAwkFilter($awkFilter, $order = ORDER_DESC){
		if(file_exists($this->log)){
			if($order == ORDER_ASC)
				$cmd = 'cat ';
			else
				$cmd = 'tac ';
			
			$cmd .= $this->log;
			return execCmdV2($cmd . " | awk '/" . $awkFilter . "/'");
		}
		else
			return null;
	}
}
	
?>