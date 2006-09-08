<?php

	include_once('config.php');
	include_once('functions.php');
	require_once('myDebLog.class.php');
	
	if(isset($_GET['date']) and !empty($_GET['date'])){
		
		/*****************************************************************************/
		header("Content-type:text/xml"); 
		echo '<?xml version="1.0" encoding="utf-8"?>';

		echo '<rows>';
				
			$log = new Log(PATH_LOG . '/' . $_GET['date'] . '.log');
			
			$regexp = '^.*' . (isset($_GET['fuser']) ? $_GET['fuser'] . '.*' : '');
			$regexp .= '\|.*' . (isset($_GET['faction']) ? $_GET['faction'] . '.*' : '');
			
			if(isset($_GET['fother']))
				$regexp .= '\|.*' . $_GET['fother'] . '.*';
					
			$regexp .= '\|[0-9][0-9]:[0-9][0-9]:[0-9][0-9]$';
			
			//if($content = $log->getLog()){
			if($content = $log->getLogByAwkFilter($regexp)){
				for($id = 0; $id < count($content); $id++){
					$exp_content = explode('|', $content[$id]);
					echo '<row id="' . ($id+1) . '">';
						echo '<cell>' . $exp_content[0] . '</cell>';
						echo '<cell><![CDATA[' . imgByAction($exp_content[1]) . ']]></cell>';
						echo '<cell>' . (isset($exp_content[3]) ? '[' . $exp_content[2] . ']' . (isset($exp_content[4]) ? '-[' . $exp_content[3] . ']' : '') : '') . '</cell>';
						//echo '<cell>' . (isset($exp_content[4]) ? $exp_content[3] : '') . '</cell>';
						echo '<cell>' . rtrim((isset($exp_content[4]) ? $exp_content[4] : (isset($exp_content[3]) ? $exp_content[3] : $exp_content[2]))) . '</cell>';
					echo '</row>';
				}
			}
			else{
				//echo '<row id="no_log">';
					//echo '<cell><![CDATA[<img src="../img/s_notice.png" align="absmiddle" /> No existe fichero Log]]></cell>';
				//echo '</row>';
			}
				
		
		echo '</rows>';
		/*****************************************************************************/
	
	}
?>