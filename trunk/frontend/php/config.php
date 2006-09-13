<?php
/**
 * File config.php
 * Parámetros de configuración de la aplicación
 * 
 * @author Francisco Javier Ramos Álvarez
 * @version 1.0
 * @package php
 */
	
	//Autenticación LDAP
	define('AUTH_LDAP', 1); //si -> 1, no -> 0
	
	//path
	define('PATH_REPOSITORY', '/home/fran/repositorios/guadalinex-flamenco');
	define('USERS_INI', '/var/www/pooler/trunk/frontend/other/users_repository.ini');
	define('PATH_LOG', '/var/www/pooler/trunk/frontend/logs');
	define('PATH_TEMP', '/var/www/pooler/trunk/frontend/tmp');
	
	//configuración para python
	define('REPO_CONF', '/etc/poolmanager/repo.conf'); $repo_conf = REPO_CONF;
	define('ADD_PKG_PY', '/usr/share/poolmanager/bin/addpkg.py'); $add_pkg_py = ADD_PKG_PY;
	define('MV_PKG_PY', '/usr/share/poolmanager/bin/mvpkg.py'); $mv_pkg_py = MV_PKG_PY;
	define('RM_PKG_PY', '/usr/share/poolmanager/bin/rmpkg.py'); $rm_pkg_py = RM_PKG_PY;
	
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