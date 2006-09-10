<?php
/**
 * 
 */

	include_once('config.php');
	include_once('functions.php');
	require_once('IniReader.class.php');
	
	/*****************************************************************************/
	header("Content-type:text/xml"); 
	echo '<?xml version="1.0" encoding="utf-8"?>';
	echo '<tree id="0">';
	
		echo '<item id="root_users" text="Usuarios" im0="b_usrlist.png" im1="b_usrlist.png" im2="b_usrlist.png" open="1">';
			$oIni = new IniReader(USERS_INI);
			
			//ordenamos alfabéticamente los nombres de usuarios
			$sections = getOrderedKeys($oIni->info);
			foreach($sections as $section)
				if(strcmp($section, 'admin') != 0)
					echo '<item id="' . $section  . '" text="' . $section . '" im0="user.gif" imw="7" imh="11" />';
				
		echo '</item>';
		
	echo '</tree>';
	/*****************************************************************************/
	
?>