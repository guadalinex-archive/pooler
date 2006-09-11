<?php
	
	$html_err = '<div align="center"><img src="../img/no_explorer.gif" align="absmiddle" /> <font color="#990000" size="+1">No use Internet Explorer !!.</font><br /></div>';
	!eregi('MSIE', $_SERVER['HTTP_USER_AGENT']) or die($html_err);
?>