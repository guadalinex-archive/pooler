<?php
	include('../php/check_access.php');
	eregi('log', $_SESSION['user_' . $ids]['param']['app']) or die($html_err);
	
	header("Content-type:text/xml"); 
	echo '<?xml version="1.0" encoding="iso-8859-1"?>';
?>
<content tab="tab_log"><![CDATA[
<table>
	<tr>
		<td>
			<fieldset class="frame1">
				<legend><img src="../img/cal.gif" align="absmiddle" /> Calendario de Logs</legend>
				<div id="toolbar_calendar"></div>
				<div id="calendar" align="center"></div>
			</fieldset>
		
		</td>
		<td>
			<fieldset class="frame1" style="width:650px">
				<legend><img src="../img/b_view.png" align="absmiddle" /> Contenido del Log</legend>
				<div id="toolbar_content"></div>
				<div id="content"></div>
			</fieldset>
		</td>
	</tr>
	<tr>
		<td colspan="2"></td>
	</tr>
</table>
<script type="text/javascript">init_log()</script>
]]></content>