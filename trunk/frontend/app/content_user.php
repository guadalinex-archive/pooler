<?php
	include('../php/check_access.php');
	eregi('user', $_SESSION['user_' . $ids]['param']['app']) or die($html_err);
	
	header("Content-type:text/xml"); 
	echo '<?xml version="1.0" encoding="iso-8859-1"?>';
?>
<content tab="tab_user"><![CDATA[
<table>
	<tr>
		<td>
			<fieldset class="frame1">
				<legend><img src="../img/book.gif" align="absmiddle" /> Listado de Usuarios</legend>
				<div id="toolbar_users"></div>
				<div id="users"></div>
			</fieldset>
		
		</td>
		<td>
			<fieldset class="frame1" style="width:650px">
				<legend><img src="../img/b_tblops.png" align="absmiddle" /> A&ntilde;adir - Editar / Visualizar</legend>
				<div id="toolbar_content"></div>
				<div id="content"></div>
			</fieldset>
		</td>
	</tr>
	<tr>
		<td colspan="2"></td>
	</tr>
</table>
<script type="text/javascript">init_user()</script>
]]></content>