<?php
/**
 * File config.php
 * Parámetros de configuración de la aplicación
 * 
 * @author Francisco Javier Ramos Álvarez
 * @version 1.3
 * @package php
 */
	
	//autenticación LDAP
	define('AUTH_LDAP', 1); //si -> 1, no -> 0
	define('LDAP_SERVER', 'ldap.juntadeandalucia.es');
	define('LDAP_PORT', 389);
	define('DN_BASE', 'o=sadesi,o=empleados,o=juntadeandalucia,c=es');
	
	//paths de la aplicación
	define('USERS_INI', '/var/www/pooler/trunk/frontend/other/users_repository.ini');
	define('PATH_LOG', '/var/www/pooler/trunk/frontend/logs');
	define('PATH_TEMP', '/var/www/pooler/trunk/frontend/tmp');
	
	//configuración para python
	define('REPO_CONF', '/var/www/pooler/trunk/backend/conf/repo.conf');
	define('ADD_PKG_PY', '/var/www/pooler/trunk/backend/addpkg.py');
	define('MV_PKG_PY', '/var/www/pooler/trunk/backend/mvpkg.py');
	define('RM_PKG_PY', '/var/www/pooler/trunk/backend/rmpkg.py');
	
	//tiempo máximo de ejecución de ciertos scripts susceptibles
	//de superar el time out (se recomienda no decrementar)
	define('TIME_LIMIT', 1200);
	
	//depurar comandos python
	define('PY_DEBUG', 1); //si -> 1, no -> 0
	
	//Indica si se muestran o no los warnigns de inicio
	define('SHOW_WARNIGN', 1); //si -> 1, no -> 0
	
	//campos de filtrado, tanto de paquetes como de ficheros fuentes
	$fieldsFilter = array(
		'Package',
		'Version',
		'Maintainer',
		'Architecture',
		'Depends',
		'Conflicts',
		'Description'
	);
	
	############################################################################
	
	/**** NO MODIFICAR ****/
	$repo_conf = REPO_CONF;
	$add_pkg_py = ADD_PKG_PY;
	$mv_pkg_py = MV_PKG_PY;
	$rm_pkg_py = RM_PKG_PY;
	/**********************/
?>