<?php
/**
 * 
 */
	
	if(isset($_GET['path']) and !empty($_GET['path'])){
		$path = $_GET['path'];
		require_once('tbFileInfo.class.php');
		
		//cargamos el fichero
		$tbfileinfo = new tbFileInfo($path);
		$package = $tbfileinfo->getContent($_GET['id']);
		
		//lo mostramos. Construimos una tabla
		$datas = $package[0]->getDatas();
		
		echo '<div id="datasPackage" style="text-align:center;">';
			echo '<table class="table1">';
			foreach($datas as $field => $value){
				echo '<tr>';
				if(strcmp($field, 'Files') == 0){
					echo '<td valign="top"><strong>' . $field . ':<strong></td>';
					echo '<td>';
					
					$checks = explode("\n", trim($value));
					
					echo '<table width="600" class="table1">';
					foreach($checks as $value){
						$lensum = strpos($value, ' ');
						echo '<tr>';
						echo '<td>' . substr($value, 0, $lensum) . '</td>';
						
						$chkdatas = explode(' ', trim(substr($value, $lensum)));
						echo '<td align="right">' . $chkdatas[0] . '</td>';
						echo '<td width="20"></td>';
						echo '<td>' . $chkdatas[1] . '</td>';
						echo '</tr>';
					}
					echo '</table>';
					
					
					echo '</td>';
				}
				else{
					echo '<td valign="top"><strong>' . $field . ':<strong></td>';
					echo '<td>' . nl2br($value) . '</td>';
				}
				echo '</tr>';
			}
			echo '</table>';
		echo '</div>';
	}
?>