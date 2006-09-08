<?php

include_once('functions.php');

class Path{
	
	var $path = '';
	var $content = null;
	
	function Path($path){
		if($path and @file_exists($path)){
			rtrimslash(&$path);
			$this->path = $path;
		}
	}
	
	function getBasename(){
		return basename($this->path);
	}
	
	function isDirectory(){
		return is_dir($this->path);	
	}
	
	function isFile(){
		return is_file($this->path);
	}
	
	function getPath(){
		return $this->path;	
	}
	
	function getContent(){
		return $this->content;
	}
}
?>