<?php
/**
 * File config.php
 * Parámetros de configuración de la aplicación
 * 
 * @author Francisco Javier Ramos Álvarez
 * @version 1.1
 * @package php
 */
	
	//Autenticación LDAP
	define('AUTH_LDAP', 1); //si -> 1, no -> 0
	define('LDAP_SERVER', 'ldap.juntadeandalucia.es');
	define('LDAP_PORT', 389);
	define('DN_BASE', 'o=sadesi,o=empleados,o=juntadeandalucia,c=es');
	
	//path
	define('PATH_REPOSITORY', '/home/fran/repositorios/guadalinex-flamenco');
	define('USERS_INI', '/var/www/pooler/trunk/frontend/other/users_repository.ini');
	define('PATH_LOG', '/var/www/pooler/trunk/frontend/logs');
	define('PATH_TEMP', '/var/www/pooler/trunk/frontend/tmp');
	
	//configuración para python
	define('REPO_CONF', '/var/www/pooler/trunk/backend/conf/repo.conf'); $repo_conf = REPO_CONF;
	define('ADD_PKG_PY', '/var/www/pooler/trunk/backend/addpkg.py'); $add_pkg_py = ADD_PKG_PY;
	define('MV_PKG_PY', '/var/www/pooler/trunk/backend/mvpkg.py'); $mv_pkg_py = MV_PKG_PY;
	define('RM_PKG_PY', '/var/www/pooler/trunk/backend/rmpkg.py'); $rm_pkg_py = RM_PKG_PY;
	
	//tiempo máximo de ejecución de ciertos scripts susceptibles
	//de superar el time out
	define('TIME_LIMIT', 300);
	
	//depurar comandos python
	define('PY_DEBUG', 1); //si -> 1, no -> 0
	
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
?>