<?php

include_once('config.php');
require_once('Log.class.php');

class myDebLog extends Log{
	
	var $user = '';
	
	function myDebLog($user = 'admin'){
		$this->user = $user;
		parent::Log(PATH_LOG . '/' . date('Ymd') . '.log');
	}
	
	function putLine($action, $params = array()){
		$line = $this->user . '|';
		$line .= $action;
		$line .= ($params ? '|' . implode('|', $params) : '') . '|';
		$line .= date('H:i:s');
		parent::putLine($line);
	}
}

?>