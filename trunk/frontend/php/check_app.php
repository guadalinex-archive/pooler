<?php
/**
 * Module check_app.php
 * Comprueba los permisos de las diferentes carpetas y archivos a los que 
 * ha de tener acceso la aplicación, e informa de posibles problemas que
 * pueda haber.
 * 
 * @author Francisco Javier Ramos Álvarez
 * @version 1.2
 * @package php
 * @see inform_events.php
 */

include_once('config.php');
include_once('functions.php');

$msg_err = array();
$msg_warn = array();

//comprobamos permisos de carpetas y directorios

$repos = getSectionRepoConf('repositorios');
foreach($repos as $repo => $path)
	checkPath($path, &$msg_err);
	
checkPath(USERS_INI, &$msg_err);
checkPath(PATH_LOG, &$msg_err);
checkPath(PATH_TEMP, &$msg_err);
checkPath(REPO_CONF, &$msg_err, false);
checkPath(ADD_PKG_PY, &$msg_err, false);
checkPath(MV_PKG_PY, &$msg_err, false);
checkPath(RM_PKG_PY, &$msg_err, false);

//comprobamos parametros del fichero php.ini
if(get_cfg_var('safe_mode') == true)
	$msg_err[] = 'La directiva <b>safe_mode</b> ha de estar a <b>Off</b>';
if(intval(get_cfg_var('post_max_size')) < 150)
	$msg_warn[] = 'Se recomienda un tamaño mayor para la directiva <b>post_max_size</b>.<br>Valor mínimo recomendado <b>150M</b>';
if(intval(get_cfg_var('upload_max_filesize')) < 150)
	$msg_warn[] = 'Se recomienda un tamaño mayor para la directiva <b>upload_max_filesize</b>.<br>Valor mínimo recomendado <b>150M</b>';
if(intval(get_cfg_var('max_execution_time')) < 1200)
	$msg_warn[] = 'Se recomienda un tiempo mayor para la directiva <b>max_execution_time</b>.<br>Valor mínimo recomendado <b>1200 (20 minutos)</b>';
if(intval(get_cfg_var('max_input_time')) < 1200)
	$msg_warn[] = 'Se recomienda un tiempo mayor para la directiva <b>max_input_time</b>.<br>Valor mínimo recomendado <b>1200 (20 minutos)</b>';
if(intval(get_cfg_var('memory_limit')) < 8)
	$msg_warn[] = 'Se recomienda una capacidad mayor para la directiva <b>memory_limit</b>.<br>Mínimo recomendado <b>8M</b>';
	
if($msg_err or ($msg_warn and SHOW_WARNIGN)):
	//informamos de posibles errores
	include('../app/infor_events.php');
	//si hay errores no permitimos la ejecución de la aplicación
	if($msg_err) exit;
endif;
?>