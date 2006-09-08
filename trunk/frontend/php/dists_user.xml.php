<?php
	session_start();
	include('functions.php');
	
	if(isset($_GET['user']) and !empty($_GET['user'])){
		
		/*****************************************************************************/
		header("Content-type:text/xml"); 
		echo '<?xml version="1.0" encoding="utf-8"?>';
		
		echo '<rows>';
		
		if($dists = getAccessDists($_GET['user'])){
			foreach($dists as $dist => $access){
				echo '<row id="' . $dist . '">';
					echo '<cell>' . $dist . '</cell>';
					echo '<cell>' . (eregi('r', $access) ? '1' : '0')  . '</cell>';
					echo '<cell>' . (eregi('w', $access) ? '1' : '0')  . '</cell>';
					echo '<cell><![CDATA[<img src="../img/b_drop.png" border="0" style="cursor:pointer" onclick="myGridDistsUser.deleteRow(\'' . $dist . '\')" title="Eliminar distribuci&oacute;n" align="absmiddle" />]]></cell>';
				echo '</row>';
			}
		}
		else{
			//echo '<row id="no_access">';
				//echo '<cell><![CDATA[<img src="../img/s_cancel.png" align="absmiddle" /> No tiene acceso a las distribuciones]]></cell>';
			//echo '</row>';
		}
		
		echo '</rows>';
		/*****************************************************************************/
	
	}
	else{
		
		/*****************************************************************************/
		header("Content-type:text/xml"); 
		echo '<?xml version="1.0" encoding="iso-8859-1"?>';
		
		echo '<rows>';
			//echo '<row id="new_user">';
				//echo '<cell><![CDATA[<img src="../img/s_notice.png" align="absmiddle" /> No hay distribuciones asignadas]]></cell>';
			//echo '</row>';
		echo '</rows>';
		/*****************************************************************************/
		
	}
?>