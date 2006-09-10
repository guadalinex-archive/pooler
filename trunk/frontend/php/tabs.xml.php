<?php
/**
 * 
 */

	session_start();
	$ids = session_id();
	
	/*****************************************************************************/
	header("Content-type:text/xml"); 
	echo '<?xml version="1.0" encoding="utf-8"?>';
	echo '<tabbar hrefmode="ajax">';
    	echo '<row>';
    	
    		if(eregi('pck', $_SESSION['user_' . $ids]['param']['app']))
        		echo '<tab id="tab_pck" width="100px" selected="1"  href="content_pck.php">Paquetes</tab>';
        	
        	if(eregi('user', $_SESSION['user_' . $ids]['param']['app']))
        		echo '<tab id="tab_user" width="100px" href="content_user.php">Usuarios</tab>';
        	
        	if(eregi('log', $_SESSION['user_' . $ids]['param']['app']))	
        		echo '<tab id="tab_log" width="100px" href="content_log.php">Logs</tab>';
        		
    	echo '</row>';
	echo '</tabbar>';
	/*****************************************************************************/
	
?>