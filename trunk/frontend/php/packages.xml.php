<?php 
/**
 * XML packages.xml.php
 * Construye el grid de datos, tanto de paquetes como de ficheros fuente. Realiza
 * una paginación, que por defecto será de 50 registros por página.
 * 
 * @author Francisco Javier Ramos Álvarez
 * @version 1.0
 * @package php
 * @see tbFileInfo.class.php
 * 
 * @return xml
 */

	session_start();
	include('functions.php');
	include_once('config.php');
	
	set_time_limit(TIME_LIMIT);
	
	if(isset($_GET['path']) and !empty($_GET['path'])){
		$path = $_GET['path'];
		$pag = (isset($_GET['pag']) and !empty($_GET['pag'])) ? $_GET['pag'] : 1;
		$toshow = (isset($_GET['toshow']) and !empty($_GET['toshow'])) ? $_GET['toshow'] : 50;
		$condition = (isset($_GET['condition']) and !empty($_GET['condition'])) ? $_GET['condition'] : null;
		
		require_once('tbFileInfo.class.php');
		
		//cargamos los paquetes
		$tbfileinfo = new tbFileInfo($path);
		
		//paginamos
		$init = ($pag-1)*$toshow;
		$end = $init+($toshow-1);

		$packages = $tbfileinfo->getContent($init, $end, $condition);
		$ids = $tbfileinfo->getIds();
		
		/*****************************************************************************/
		header("Content-type:text/xml"); 
		echo '<?xml version="1.0" encoding="utf-8"?>';
		
		echo '<rows num="' . getNumBlocks($path, $condition) . '">';
		
		if($dists = getAccessDists()){
			for($i = 0; $i < count($packages); $i++){
				echo '<row id="' . $ids[$i] . '">';
					echo '<cell>0</cell>';
					echo '<cell>' . $packages[$i]->getValue('Package') . '</cell>';
					echo '<cell>' . $packages[$i]->getValue('Version')  . '</cell>';
					echo '<cell><![CDATA[';
					echo '<img src="../img/b_view.png" border="0" style="cursor:pointer" onclick="openPopup(\'' . $packages[$i]->getValue('Package') . '\', \'../php/view_package.php\', \'id=' . $ids[$i] . '&path=' . urlencode($path) . '\', 640, 480, \'../img/b_view.png\', \'view\')" title="Visualizar datos del paquete" align="absmiddle" /> | ';
					
					if(hasPermission($path, 'w')){
						echo '<img src="../img/move2.png" border="0" style="cursor:pointer" onclick="unmarkPackages(); markPackage(' . $ids[$i] . '); showMoveTo();" title="Mover paquete" align="absmiddle" /> | ';
						echo '<img src="../img/delpkg.png" border="0" style="cursor:pointer" onclick="unmarkPackages(); markPackage(' . $ids[$i] . '); showConfirmDelete();" title="Eliminar paquete" align="absmiddle" />';
					}
					else{
						echo '<img src="../img/move_dis2.png" align="absmiddle" /> | ';
						echo '<img src="../img/delpkg_dis.png" align="absmiddle" />';
					}
					
					
					echo ']]></cell>';
					
					//a continuación almacenamos las direcciones físicas de los ficheros
					//para poder enviarsela a los módulos de python
					if(isPackages($path))
						echo '<cell>' . $packages[$i]->getValue('Filename') . '</cell>';
					elseif(isSources($path)){
						$files = explode("\n", trim($packages[$i]->getValue('Files')));
						foreach($files as $line){
							$dfile = explode(' ', $line);
							echo '<cell>' . $packages[$i]->getValue('Directory') . '/' . $dfile[2] . '</cell>';
						}
					}
					
					
				echo '</row>';
			}
		}
		else{
			echo '<row id="no_access">';
				echo '<cell>0</cell>';
				echo '<cell><![CDATA[<img src="../img/s_cancel.png" align="absmiddle" /> No tiene acceso a las distribuciones]]></cell>';
				echo '<cell></cell>';
				echo '<cell></cell>';
			echo '</row>';
		}
		
		echo '</rows>';
		/*****************************************************************************/
	
	}
?>