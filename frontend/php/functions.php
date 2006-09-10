<?php
/**
 * 
 */

include_once('config.php');

function execCmd($cmd){
	require_once('Command.class.php');
	
	$oCmd = new Command();
	return $oCmd->execute($cmd);
}

function execCmdV2($cmd){
	require_once('Command.class.php');
	
	$oCmd = new Command();
	$oCmd->execute($cmd); //enviamos comando
	return $oCmd->getOut();
}

function execCmdV3($cmd){
	require_once('Command.class.php');
	
	$oCmd = new Command();
	$oCmd->execute($cmd); //enviamos comando
	return array($oCmd->getOut(), $oCmd->getRet());
}

function getListPackages(){
	$pathDists = PATH_REPOSITORY . '/dists';
	return execCmdV2('find ' . $pathDists . ' -name Packages*');
}

function getListFilenames($pathPackage){
	$cmd = $pathPackage . ' | awk \'/Filename:/{print $2}\'';
	if(isGzip($pathPackage))
		$cmd = 'gzip -dc ' .$cmd;
	elseif(isBzip2($pathPackage))
		$cmd = 'bzip2 -dc ' .$cmd;
	else
		$cmd = 'cat ' . $cmd;
	return execCmdV2($cmd);
}

function isGzip($file){
	return eregi('.gz$', $file);
}

function isBzip2($file){
	return eregi('.bz2$', $file);
}

function ltrimslash($path){
	$path = (substr($path, 0, 1) == '/') ? substr($path, 1) : $path; //eliminamos el slash inicial
}

function rtrimslash($path){
	$path = (substr($path, -1, 1) == '/') ? substr($path, 0, strlen($path)-1) : $path; //eliminamos el slash final
}

function trimslash($path){
	ltrimslash(&$path);
	rtrimslash(&$path);
}

function slashes($path){
	$path = ((substr($path, 0, 1) != '/') ? '/' : '') . $path . ((substr($path, -1, 1) != '/') ? '/' : '');
}

function extractFile($file){
	$content = '';
	if($fp = @fopen($file, 'r')){
		$content = fread($fp, filesize($file));
		fclose($fp);
	}
	return $content;
}

function extractBZ2File($bz2file){
	$content = '';
	if($fp = @bzopen($bz2file, 'r')){
		//descomprimimos
		while(!feof($fp)) $content .= bzread($fp, 4096);		
		bzclose($fp);
	}
	return $content;
}

function extractGZFile($gzfile){
	$content = '';
	if($fp = @gzopen($gzfile, 'r')){
		//descomprimimos
		while(!feof($fp)) $content .= gzread($fp, 4096);
		gzclose($fp);
	}
	return $content;
}

function isDirectory($path){
	rtrimslash(&$path);
	return (basename($path) != '.' and basename($path) != '..' and is_dir($path));
}

function isRelease($path){
	rtrimslash(&$path);
	return (strcmp(basename($path), 'Release') == 0 and is_file($path));	
}

function isSection($path){
	global $sections;
	rtrimslash(&$path);
	return in_array(basename($path), $sections);
}

function isPackages($path){
	rtrimslash(&$path);
	return (ereg('^Packages', basename($path)) and is_file($path));
}


function isSources($path){
	rtrimslash(&$path);
	return (ereg('^Sources', basename($path)) and is_file($path));
}

function comparePath($item1, $item2){
	if(get_class($item1) == 'File'){
		if(get_class($item2) == 'File')
			return strcasecmp($item1->getBasename(), $item2->getBasename());
		else
			return -1;
	}
	else{
		if(get_class($item2) == 'File')
			return 1;
		else
			return strcasecmp($item1->getBasename(), $item2->getBasename());
	}
}

function comparePath2($path1, $path2){
	if(is_file($path1)){
		if(is_file($path2))
			return strcasecmp(basename($path1), basename($path2));
		else
			return -1;
	}
	else{
		if(is_file($path2))
			return 1;
		else
			return strcasecmp(basename($path1), basename($path2));
	}
}

function bz2gets($resource){
	$line = '';
	$char = '';
	while(!feof($resource) and $char != "\n"){
		$char = bzread($resource, 1);
		$line .= $char;
	}
	return $line;
}

function createTreeItems($path, $nivel){
	if(isDirectory($path)){
		$content = array();
		$out =  execCmdV2('ls ' . $path);
		if($out[0]){
			for($i = 0; $i < count($out); $i++){
				$p = $path . '/' . $out[$i];
				if(isDirectory($p) or is_file($p))
					$content[] = $p;
			}
			//ordenamos alfabéticamente
			if($content) usort($content, 'comparePath2');
			
			//imprimirmos
			foreach($content as $item){
				if($nivel == 1){
					//comprobamos si tiene acceso a nivel de distribución
					if(hasPermission($item, 'r')){
						echo '<item id="' . $item  . '" text="' . basename($item) . '" ' . getFieldImg0($item) . '>';
						createTreeItems($item, $nivel+1);
						echo '</item>';
					}
				}
				else{
					echo '<item id="' . $item  . '" text="' . basename($item) . '" ' . getFieldImg0($item) . '>';
					createTreeItems($item, $nivel+1);
					echo '</item>';
				}
			}
		}
	}
}

function getFieldImg0($path){
	if(is_file($path))
		//visualizamos sólo los archivos importantes
		if(ereg('^Release', basename($path))) return 'im0="release.png"';
		if(ereg('^Packages', basename($path))) return 'im0="package.png"';
		if(ereg('^Source', basename($path))) return 'im0="source.png"';
	else{
		$out =  execCmdV2('ls ' . $path);
		return (!$out[0] ? ' im0="folderClosed.gif"' : '');
	}
}

function getNumBlocks($path, $condition = null){
	$num = 0;
	$condition = $condition ? $condition : array('Package' => '');
	
	if(isGzip($path))
		$cmd = 'gzip -dc ';
	elseif(isBzip2($path))
		$cmd = 'bzip2 -dc ';
	else
		$cmd = 'cat ';
		
	$cmd .= $path;
	
	if(count($condition) == 1){
		$cmd .= ' | awk \'BEGIN{RS="\n\n"}{gsub("\n ", " "); print}\'';
		list($field, $value) = each($condition);
		$cmd .= ' | awk \'/^' . $field . ': ' . ($value ? '.*' . $value : '') . '/\' | wc -l';
		$num = intval(shell_exec($cmd));
	}
	elseif(count($condition) > 1){
		//hemos de tratar esto de otra manera
	}
	
	return $num;
}

function getListDistribution(){
	$dists = array();
	$pathDists = PATH_REPOSITORY . '/dists';
	$out =  execCmdV2('ls ' . $pathDists);
	for($i = 0; $i < count($out); $i++){
		$p = $pathDists . '/' . $out[$i];
		if(isDirectory($p))
			$dists[] = $out[$i];
	}
	
	return $dists;
}

function printListDistributions($noDist = ''){
	$dists = getListDistribution();
	echo '<option value="">[Seleccione la distribuci&oacute;n...]</option>';
	for($i = 0; $i < count($dists); $i++){
		if(strcmp($dists[$i], $noDist) != 0)
			if(hasPermission($dists[$i], 'w'))
				echo '<option value="' . $dists[$i] . '">' . $dists[$i] . '</option>';
	}

}

function printListFieldsFilter(){
	global $fieldsFilter;
	foreach($fieldsFilter as $field)
		echo '<option value="' . $field . '">' . $field . '</option>';
}

	
function getOrderedKeys($info){
	$keys = array_keys($info); //extraemos las claves
	sort($keys); //ordenamos
	return $keys;
}

function getAccessDists($user = null){
	if(!$user){
		//obtenemos las distribuciones del usuario conectado
		$ids = session_id();
		
		if(isset($_SESSION['user_' . $ids]) and !empty($_SESSION['user_' . $ids])){
			$param = $_SESSION['user_' . $ids]['param'];
			return getDistsByParamUser($param);
		}
		else
			return null;
	}
	else{
		$param = getParamByUser($user);
		return getDistsByParamUser($param);
	}
}

function getDistsByParamUser($param){
	$dists = array();
	foreach($param as $key => $value){
		if(eregi('^dist.', $key))
			$dists[substr($key, strpos($key, '.')+1)] = $value;
	}
	
	return $dists;
}

function hasPermission($path, $type, $user = null){
	$dists = getAccessDists($user);
	$dist = getDistributionFromPath($path);
	
	if(array_key_exists($dist, $dists))
		return (strpos($dists[$dist], $type) !== false);
	else
		return false;
	
}

function getDistributionFromPath($path){
	$dpath = str_replace(PATH_REPOSITORY . '/dists/', '', $path);
	$exp = explode('/', $dpath);
	
	if(count($exp))
		return $exp[0];
	else
		return '';
}

function addParamAdmin($param){
	$param['app'] = 'pck|user|log';
	$dists = getListDistribution();
	for($i = 0; $i < count($dists); $i++)
		$param['dist.' . $dists[$i]] = 'rw'; //damos permisos de rw

	$param['users'] = 'rw';
}

function getParamByUser($user){
	//obtenemos los parámetros del usuario indicado
	require_once('IniReader.class.php');
	$oIni = new IniReader(USERS_INI);
	return $oIni->getSection($user);
}

function openFileWithLock($filename, $mode, $attempts){
	$cnt = 0;
	$lock = ($mode == 'r') ? LOCK_SH : LOCK_EX;
	
	while(true){
		if($cnt > $attempts)
			return false;

		if($fp = @fopen($filename, $mode)){
			if(flock($fp, $lock))
				return $fp;
			else
				@fclose($fp);
		}

		$cnt++;
		$k = rand(0, 20);
		usleep(round($k * 10000));  # k * 10ms
	}

	return false;
}

function imgByAction($action){
	switch($action){
		case LOGIN: return '<img src="../img/iconClient.gif" title="Usuario login" />'; break;
		case LOGOUT: return '<img src="../img/s_loggoff.png" title="Usuario logout" />'; break;
		case ADDPKG: return '<img src="../img/upload.gif" title="Subido paquete" />'; break;
		case MOVPKG: return '<img src="../img/move2.png" title="Paquete movido" />'; break;
		case DELPKG: return '<img src="../img/delpkg.png" title="Paquete eliminado" />'; break;
		case ADDSRC: return '<img src="../img/upload_src.gif" title="Subido fuente" />'; break;
		case MOVSRC: return '<img src="../img/move2_src.png" title="Fuente movido" />'; break;
		case DELSRC: return '<img src="../img/delsrc.png" title="Fuente eliminado" />'; break;
		case ADDUSER: return '<img src="../img/b_usradd.png" title="Usuario a&ntilde;adido" />'; break;
		case EDTUSER: return '<img src="../img/b_usredit.png" title="Usuario editado" />'; break;
		case DELUSER: return '<img src="../img/b_usrdrop.png" title="Usuario eliminado" />'; break;
	}
}

function registerMovement($action, $param = array()){
	require_once('myDebLog.class.php');
	$log = new myDebLog($_SESSION['user_' . session_id()]['login']);
	$log->putLine($action, $param);
}
?>