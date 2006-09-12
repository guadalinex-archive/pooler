<?php
/**
 * Module upload_pkg.php
 * Realiza la subida de ficheros deb al servidor y a continuación 
 * llama a un módulo en python que se encargará de colocarlos en su sitio.
 * 
 * @author Francisco Javier Ramos Álvarez
 * @version 1.0
 * @package php
 * @see addpkg.py by Antonio Gonzales Romero
 * 
 * @return $code
 */
	
	session_start();
	
	include_once('config.php');
	include_once('functions.php');

	if(isset($_FILES['in_debs'])){
		
		$dist = $_POST['sel_distribution'];
		$in_debs = $_FILES['in_debs'];
		$nfiles = count($in_debs['name']);
		
		for($i = 0; $i < $nfiles; $i++){
			$pck_tmp = PATH_TEMP . '/' . $in_debs['name'][$i];
			
			//copiamos a un temporal, renombrándolos
			if(@copy($in_debs['tmp_name'][$i], $pck_tmp)){
				
				chmod($pck_tmp, 0777);
				
				/** COMANDO ************************************************/
				$cmd = "$add_pkg_py -p $pck_tmp -d $dist -c $repo_conf";
				$out_ret = execCmdV3($cmd);
				/***********************************************************/
				
				@unlink($pck_tmp);
				
				//registramos el movimiento
				registerMovement(ADDPKG, array($in_debs['name'][$i], $dist));
			}
		}
	}

?>

<script type="text/javascript">
	
	var p = window.parent;
	p.hideDivLoading();
	p.closePopup();
	
</script>