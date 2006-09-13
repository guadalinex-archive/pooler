<?php
/**
 * Module functions.php
 * Contiene un conjunto de funciones generales, y que son llamadas
 * por el resto de módulos php.
 * 
 * @author Francisco Javier Ramos Álvarez
 * @version 1.1
 * @package php
 */

include_once('config.php');

/**
 * Ejecuta un comando externo devolviendo la última línea de la salida estandar.
 *
 * @param string $cmd. Comando a ejecutar
 * @return string
 * @see Command.class.php
 */
function execCmd($cmd){
	require_once('Command.class.php');
	
	$oCmd = new Command();
	return $oCmd->execute($cmd);
}

/**
 * Ejecuta un comando externo devolviendo un array con la salida estandar.
 *
 * @param string $cmd.
 * @return array of string
 * @see Command.class.php
 */
function execCmdV2($cmd){
	require_once('Command.class.php');
	
	$oCmd = new Command();
	$oCmd->execute($cmd); //enviamos comando
	return $oCmd->getOut();
}

/**
 * Ejecuta un comando externo devolviendo un array con la salida estandar
 * y el valor de retorno del programa.
 *
 * @param string $cmd.
 * @return [array of string, integer]
 * @see Command.class.php
 */
function execCmdV3($cmd){
	require_once('Command.class.php');
	
	$oCmd = new Command();
	$oCmd->execute($cmd); //enviamos comando
	return array($oCmd->getOut(), $oCmd->getRet());
}

/**
 * Devuelve una lista con todos los ficheros Packages del repositorio.
 *
 * @return array of string
 */
function getListPackages(){
	$pathDists = PATH_REPOSITORY . '/dists';
	return execCmdV2('find ' . $pathDists . ' -name Packages*');
}

/**
 * Retorna una lista con todas las direcciones físicas de los paquetes deb
 * de un determinado fichero Package.
 *
 * @param string $pathPackage
 * @return array of string
 */
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

/**
 * Indica si el fichero tiene extensión gzip.
 *
 * @param string $file
 * @return boolean
 */
function isGzip($file){
	return eregi('.gz$', $file);
}

/**
 * Indica si el fichero tiene extensión bzip2.
 *
 * @param string $file
 * @return boolean
 */
function isBzip2($file){
	return eregi('.bz2$', $file);
}

/**
 * Elimina el slash izquierdo.
 *
 * @param string $path (in/out)
 */
function ltrimslash($path){
	$path = (substr($path, 0, 1) == '/') ? substr($path, 1) : $path; //eliminamos el slash inicial
}

/**
 * Elimina el slash derecho.
 *
 * @param string $path (in/out)
 */
function rtrimslash($path){
	$path = (substr($path, -1, 1) == '/') ? substr($path, 0, strlen($path)-1) : $path; //eliminamos el slash final
}

/**
 * Elimina el slash izquierdo y derecho.
 *
 * @param string $path (in/out)
 */
function trimslash($path){
	ltrimslash(&$path);
	rtrimslash(&$path);
}

/**
 * Coloca slash izquierdo y derecho.
 *
 * @param string $path (in/out)
 */
function slashes($path){
	$path = ((substr($path, 0, 1) != '/') ? '/' : '') . $path . ((substr($path, -1, 1) != '/') ? '/' : '');
}

/**
 * Extrae el contenido de un fichero.
 *
 * @param string $file
 * @return string
 */
function extractFile($file){
	$content = '';
	if($fp = @fopen($file, 'r')){
		$content = fread($fp, filesize($file)); //leemos contenido completo
		fclose($fp);
	}
	return $content;
}

/**
 * Extrae el contenido de un fichero bzip2.
 *
 * @param string $file
 * @return string
 */
function extractBZ2File($bz2file){
	$content = '';
	if($fp = @bzopen($bz2file, 'r')){
		//descomprimimos
		while(!feof($fp)) $content .= bzread($fp, 4096);		
		bzclose($fp);
	}
	return $content;
}

/**
 * Extrae el contenido de un fichero gzip.
 *
 * @param string $file
 * @return string
 */
function extractGZFile($gzfile){
	$content = '';
	if($fp = @gzopen($gzfile, 'r')){
		//descomprimimos
		while(!feof($fp)) $content .= gzread($fp, 4096);
		gzclose($fp);
	}
	return $content;
}

/**
 * Indica si un path se un directorio, exceptuando los . y ..
 *
 * @param string $path
 * @return boolean
 */
function isDirectory($path){
	rtrimslash(&$path);
	return (basename($path) != '.' and basename($path) != '..' and is_dir($path));
}

/**
 * Indica si el path es un fichero release.
 *
 * @param string $path
 * @return boolean
 */
function isRelease($path){
	rtrimslash(&$path);
	return (strcmp(basename($path), 'Release') == 0 and is_file($path));	
}

/**
 * Indica si el path es un fichero Packages.
 *
 * @param string $path
 * @return boolean
 */
function isPackages($path){
	rtrimslash(&$path);
	return (ereg('^Packages', basename($path)) and is_file($path));
}

/**
 * Indica si el path es un fichero Sources.
 *
 * @param string $path
 * @return boolean
 */
function isSources($path){
	rtrimslash(&$path);
	return (ereg('^Sources', basename($path)) and is_file($path));
}

/**
 * Realiza una comparación entre paths para una posterios ordenación.
 * 
 * @param string $item1
 * @param string $item2
 * @return boolean
 * @see method comparePath2
 */
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

/**
 * Realiza una comparación entre paths para una posterios ordenación.
 *
 * @param string $path1
 * @param string $path2
 * @return boolean
 * @see method createTreeItems - usort
 */
function comparePath2($path1, $path2){
	if(is_file($path1)){
		if(is_file($path2))
			return strcasecmp(basename($path1), basename($path2));
		else
			return -1; // primero los directorios
	}
	else{
		if(is_file($path2))
			return 1; //primero los directorios
		else
			return strcasecmp(basename($path1), basename($path2));
	}
}

/**
 * Lee una línea de un fichero comprimido en bzip2
 *
 * @param file $resource
 * @return string
 */
function bz2gets($resource){
	$line = '';
	$char = '';
	//leemos la línea caracter a caracter hasta el salto de línea
	while(!feof($resource) and $char != "\n"){
		$char = bzread($resource, 1);
		$line .= $char;
	}
	return $line;
}

/**
 * Función recursiva que general el árbol de distribuciones.
 *
 * @param string $path
 * @param integer $nivel
 * @see method getFieldImg0
 */
function createTreeItems($path, $nivel){
	if(isDirectory($path)){
		$content = array();
		//consultamos el contenido del directorio
		$out =  execCmdV2('ls ' . $path);
		if($out[0]){ //si tenemos contenido...
			for($i = 0; $i < count($out); $i++){
				$p = $path . '/' . $out[$i];
				if(isDirectory($p) or is_file($p))
					$content[] = $p; //guardamos elemento (directorio o fichero)
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

/**
 * Devuelve el tipo de imagen para el árbol de distribuciones (atributo del
 * elemento item, del xml dists.xml)
 *
 * @param string $path
 * @return string (atributo="imagen")
 * @see dists.xml.php
 * @see method createTreeItems
 */
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

/**
 * Devuelve el número total de bloques de un fichero índice Packages o Sources, 
 * teniendo en cuenta posibles filtros seleccionados.
 *
 * @param string $path. Path del fichero índice.
 * @param associative array of string $condition
 * @return integer
 */
function getNumBlocks($path, $condition = null){
	$num = 0;
	
	//si no hay condición contamos todos los bloques ya que
	//todos poseen el campo Package
	$condition = $condition ? $condition : array('Package' => '');
	
	//dependiendo del tipo de compresión, ejecutamos un comando u otro
	//para mostrar el fichero
	if(isGzip($path))
		$cmd = 'gzip -dc ';
	elseif(isBzip2($path))
		$cmd = 'bzip2 -dc ';
	else
		$cmd = 'cat ';
		
	$cmd .= $path;
	
	if(count($condition) == 1){
		//aplicamos filtro por medio de AWK
		$cmd .= ' | awk \'BEGIN{RS="\n\n"}{gsub("\n ", " "); print}\'';
		list($field, $value) = each($condition);
		$cmd .= ' | awk \'/^' . $field . ': ' . ($value ? '.*' . $value : '') . '/\' | wc -l';
		$num = intval(execCmd($cmd));
	}
	elseif(count($condition) > 1){
		//hemos de tratar esto de otra manera...
		//TO-DO
	}
	
	return $num;
}

/**
 * Devuelve la lista total de distribuciones del repositorio.
 *
 * @return array of string
 */
function getListDistribution(){
	$dists = array();
	$pathDists = PATH_REPOSITORY . '/dists';
	
	// consultamos la raiz de distribuciones
	$out =  execCmdV2('ls ' . $pathDists);
	
	for($i = 0; $i < count($out); $i++){
		$p = $pathDists . '/' . $out[$i];
		if(isDirectory($p)) // filtramos los directorios . y ..
			$dists[] = $out[$i];
	}
	
	return $dists;
}

/**
 * Imprime un listado de options para un control select. Listado de distribuciones
 * excepto las que el usuario no tenga permisos de escritura y la distribución
 * del paquete seleccionado.
 *
 * @param string $noDist
 */
function printListDistributions($noDist = ''){
	$dists = getListDistribution();
	echo '<option value="">[Seleccione la distribuci&oacute;n...]</option>';
	for($i = 0; $i < count($dists); $i++){
		if(strcmp($dists[$i], $noDist) != 0)
			if(hasPermission($dists[$i], 'w'))
				echo '<option value="' . $dists[$i] . '">' . $dists[$i] . '</option>';
	}

}

/**
 * Imprime el listado de options para un control select. Listado de filtros
 * indicados en el fichero de configuración.
 *
 * @see config.php ($fieldsFilter)
 */
function printListFieldsFilter(){
	global $fieldsFilter;
	foreach($fieldsFilter as $field)
		echo '<option value="' . $field . '">' . $field . '</option>';
}

/**
 * Devuelve una lista ordenada de claves a partir de un array asociativo.
 *
 * @param associative array of unknown $info
 * @return array of string
 */
function getOrderedKeys($info){
	$keys = array_keys($info); //extraemos las claves
	sort($keys); //ordenamos
	return $keys;
}

/**
 * Devuelve la lista de distribuciones a las que tiene acceso un usuario 
 * determinado, o el actual pasado como parámetro.
 *
 * @param string $user
 * @return associative array of string
 */
function getAccessDists($user = null){
	if(!$user){
		$ids = session_id();
		//obtenemos las distribuciones del usuario conectado
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

/**
 * Devuelve la lista de distribuciones a partir de los parámetros de configuración
 * de un usuario.
 *
 * @param associative array of string $param
 * @return associative array of string
 */
function getDistsByParamUser($param){
	$dists = array();
	foreach($param as $key => $value){
		if(eregi('^dist.', $key))
			//guardamos los permisos asociados a la distribución
			$dists[substr($key, strpos($key, '.')+1)] = $value;
	}
	
	return $dists;
}

/**
 * Indica si un usuario determinado o el usuario actual tiene permisos sobre
 * una determinada distribución.
 *
 * @param string $path
 * @param char $type (r/w)
 * @param string $user
 * @return boolean
 */
function hasPermission($path, $type, $user = null){
	$dists = getAccessDists($user);
	$dist = getDistributionFromPath($path);
	
	if(array_key_exists($dist, $dists))
		return (strpos($dists[$dist], $type) !== false);
	else
		return false;
	
}

/**
 * Extrae el nombre de la distribución a partir de un path
 *
 * @param string $path
 * @return string
 */
function getDistributionFromPath($path){
	$dpath = str_replace(PATH_REPOSITORY . '/dists/', '', $path);
	$exp = explode('/', $dpath);
	
	if(count($exp))
		return $exp[0];
	else
		return '';
}

/**
 * Rellena un array con todos los permisos para el "superusuario" admin
 *
 * @param array of string $param (in/out)
 */
function addParamAdmin($param){
	$param['app'] = 'pck|user|log'; //todas las pestañas
	
	//todas las distribuciones con lectura y escritura
	$dists = getListDistribution();
	for($i = 0; $i < count($dists); $i++)
		$param['dist.' . $dists[$i]] = 'rw'; //damos permisos de rw
	
	//permisos de lectura y escritura para la sección de Usuarios
	$param['users'] = 'rw';
}

/**
 * Devuelve la lista de propiedades y permisos de un usuario.
 *
 * @param string $user
 * @return associative array of string
 * @see IniReader.class.php
 */
function getParamByUser($user){
	//obtenemos los parámetros del usuario indicado
	require_once('IniReader.class.php');
	$oIni = new IniReader(USERS_INI);
	return $oIni->getSection($user);
}

/**
 * Abrirá un fichero bloqueándolo para evitar inconsistencias
 * debido a la posibilidad multiusuario de la aplicación.
 *
 * @param string $filename
 * @param char $mode
 * @param integer $attempts. Número de intentos
 * @return file
 */
function openFileWithLock($filename, $mode, $attempts){
	$cnt = 0;
	
	//LOCK_SH: bloqueo compartido
	//LOCK_EX: bloqueo exclusivo
	$lock = ($mode == 'r') ? LOCK_SH : LOCK_EX;
	
	while(true){ 
		//permitimos $attempts intentos
		if($cnt > $attempts)
			return false;

		if($fp = @fopen($filename, $mode)){
			if(flock($fp, $lock)) //bloqueamos
				return $fp;
			else
				@fclose($fp);
		}
		
		//incrementamos los intentos y a continuación esperamos un 
		//tiempo aleatorio antes de volver a intentar la apertura.
		$cnt++;
		$k = rand(0, 20);
		usleep(round($k * 10000));  # k * 10ms
	}

	return false;
}

/**
 * Devuelve la imágen, en formato HTML, asociada a una acción.
 *
 * @param string $action
 * @return strin (html)
 */
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

/**
 * Función que registra un movimiento realizado por el usuario.
 *
 * @param string $action
 * @param array of string $param
 * @see myDebLog.class.php
 */
function registerMovement($action, $param = array()){
	$log = new myDebLog($_SESSION['user_' . session_id()]['login']);
	$log->putLine($action, $param); //imprimimos la línea
}

/**
 * Registra los parámetros del usuario el cual se ha autenticado correctamente.
 *
 * @param string $login
 * @param array of unknown $param
 * @see check_user_ldap.php
 */
function ldapOk($login, $param){
	require_once('myDebLog.class.php');
	
	$_SESSION['user_' . session_id()] = array(
												'old_mktime' => mktime(),
												'new_mktime' => mktime(),
												'login' => $login,
												'param' => $param
												
										);
	registerMovement(LOGIN);
	echo 'OK';
}
?>