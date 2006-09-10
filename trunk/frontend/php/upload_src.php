<?php 
	
	session_start();
	
	include_once('config.php');
	include_once('functions.php');
	
	if(isset($_FILES['in_srcs'])){
		
		$dist = $_POST['sel_distribution'];
		$in_srcs = $_FILES['in_srcs'];
		$nfiles = count($in_srcs['name']);
		$dscs = array();
		$others = array();
		
		for($i = 0; $i < $nfiles; $i++){
			$src_tmp = PATH_TEMP . '/' . $in_srcs['name'][$i];
			
			//copiamos el fichero a un temporal donde el python lo pueda coger
			if(@copy($in_srcs['tmp_name'][$i], $src_tmp)){
				chmod($src_tmp, 0777);
				
				//separamos los dsc del resto. El python sólo necesita éstos
				if(eregi('\.dsc$', $src_tmp))
					$dscs[$in_srcs['name'][$i]] = $src_tmp;
				else
					$others[$in_srcs['name'][$i]] = $src_tmp;
			}
		}

		foreach($dscs as $src => $src_tmp){
			
			/***********************************************************/
			$cmd = "$add_pkg_py -p $src_tmp -d $dist -c $repo_conf";
			$out_ret = execCmdV3($cmd);
			/***********************************************************/
			
			@unlink($src_tmp);
			
			//registramos el movimiento
			registerMovement(ADDSRC, array($src, $dist));
		}
		
		foreach($others as $src => $src_tmp)
			@unlink($src_tmp);
	}

?>

<script type="text/javascript">
	
	var p = window.parent;
	p.hideDivLoading();
	p.closePopup();
	
</script>