<?php 
/**
 * Module upload_pkg.php
 * Realiza la subida de ficheros deb al servidor y a continuación 
 * llama a un módulo en python que se encargará de colocarlos en su sitio.
 * 
 * @author Francisco Javier Ramos Álvarez
 * @version 1.1
 * @package php
 * @see addpkg.py by Antonio Gonzales Romero
 * 
 * @return $code
 */
	
	session_start();
	
	include_once('config.php');
	include_once('functions.php');
	require_once('myDebLog.class.php');
	
	set_time_limit(TIME_LIMIT);
	
	$msg_err = '';
	
	if(isset($_FILES['in_debs'])){
		
		$dist = $_POST['sel_distribution'];
		$in_debs = $_FILES['in_debs'];
		$nfiles = count($in_debs['name']);
		
		for($i = 0; $i < $nfiles; $i++){
			$pck_tmp = PATH_TEMP . '/' . $in_debs['name'][$i];
			
			if(!file_exists($pck_tmp)){
				//copiamos a un temporal, renombrándolos
				if(@copy($in_debs['tmp_name'][$i], $pck_tmp)){
					
					chmod($pck_tmp, 0777);
					
					/** COMANDO ************************************************/
					$cmd = "$add_pkg_py -p $pck_tmp -d $dist -c $repo_conf";
					$out_ret = execCmdV3($cmd);
					debugPython($cmd, $out_ret);
					/***********************************************************/
					
					@unlink($pck_tmp);
					
					if($out_ret[1] == 0)
						//registramos el movimiento
						registerMovement(ADDPKG, array($in_debs['name'][$i], $dist));
					else
						$msg_err .= 'Error Cod. ' . $out_ret[1] . '\\n';
						
				}
				else
					$msg_err .= 'No se pudo copiar el fichero ' . $in_debs['name'][$i] . ' al temporal\\n';
			}
			else
				$msg_err .= 'El fichero ' . $in_debs['name'][$i] . ' ya existe en el temporal\\n';
		}
	}

?>

<script type="text/javascript">
	
	var p = window.parent;
	p.hideDivLoading();
	<? if($msg_err != ''): ?>
		alert('<?= $msg_err ?>');
	<? endif; ?>
	p.closePopup();
	
</script>