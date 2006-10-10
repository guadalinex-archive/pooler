<?php 
/**
 * Module upload_pkg.php
 * Realiza la subida de ficheros fuente al servidor y a continuación 
 * llama a un módulo en python que se encargará de colocarlos en su sitio.
 * 
 * @author Francisco Javier Ramos Álvarez
 * @version 1.2
 * @package php
 * @see addpkg.py by Antonio González Romero
 * 
 * @return $code
 */

	session_start();
	
	include_once('config.php');
	include_once('functions.php');
	require_once('myDebLog.class.php');
	
	set_time_limit(TIME_LIMIT);
	
	$msg_err = '';
	
	if(isset($_FILES['in_srcs'])){
		
		$repository = $_SESSION['repository']['name'];
		$dist = $_POST['sel_distribution'];
		$in_srcs = $_FILES['in_srcs'];
		$nfiles = count($in_srcs['name']);
		$dscs = array();
		$others = array();
		
		for($i = 0; $i < $nfiles; $i++){
			$src_tmp = PATH_TEMP . '/' . $in_srcs['name'][$i];
			
			if(!file_exists($src_tmp)){
				//copiamos el fichero a un temporal donde python los pueda coger
				if(@copy($in_srcs['tmp_name'][$i], $src_tmp)){
					
					chmod($src_tmp, 0664);
					
					//separamos los dsc del resto. Python sólo necesita éstos
					if(eregi('\.dsc$', $src_tmp))
						$dscs[$in_srcs['name'][$i]] = $src_tmp;
					else
						$others[$in_srcs['name'][$i]] = $src_tmp;
				}
				else
					$msg_err .= 'No se pudo copiar el fichero ' . $in_srcs['name'][$i] . '\\n';
			}
			else
				$msg_err .= 'El fichero ' . $in_srcs['name'][$i] . ' ya existe en el temporal\\n';
		}

		foreach($dscs as $src => $src_tmp){
			
			/** COMANDO ************************************************/
			$cmd = "$add_pkg_py -p $src_tmp -d $dist -c $repo_conf -r $repository";
			$out_ret = execCmdV3($cmd);
			debugPython($cmd, $out_ret);
			/***********************************************************/
			
			@unlink($src_tmp);
			
			if($out_ret[1] == 0)
				//registramos el movimiento
				registerMovement(ADDSRC, array($src, $dist));
			else{
				include('msg_err_python.php');
				$msg_err .= 'Error Cod. ' . $out_ret[1] . '\\n';
				$msg_err .= 'Fichero: ' . basename($src_tmp) . '\\n';
				$msg_err .= 'Mensaje: ' . $err_python[$out_ret[1]] . '.\\n\\n';
			}
		}
		
		//eliminamos resto de ficheros temporales
		foreach($others as $src => $src_tmp)
			@unlink($src_tmp);
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