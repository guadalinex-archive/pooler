<?php
/**
 * Frame content_pck.php
 * Contenido de la pestaña Paquetes.
 * 
 * @author Francisco Javier Ramos Álvarez
 * @version 1.0
 * @package app
 * @see app.php
 * 
 * @return xml
 */

include('../php/check_access.php');
eregi('pck', $_SESSION['user_' . $ids]['param']['app']) or die($html_err);
	
header("Content-type:text/xml"); 
echo '<?xml version="1.0" encoding="iso-8859-1"?>';
?>

<content tab="tab_pck"><![CDATA[
<table>
	<tr>
		<td>
			<fieldset class="frame1">
				<legend><img src="../img/distros.png" align="absmiddle" /> Distribuciones</legend>
				<div id="toolbar_dists"></div>
				<div id="dists"></div>
			</fieldset>
		
		</td>
		<td>
		
			<fieldset class="frame1" style="width:650px">
				<legend><img src="../img/b_view.png" align="absmiddle" /> Visualizar Contenidos</legend>
				<div id="toolbar_content"></div>
				<div id="content"></div>
				<div id="path"></div>
			</fieldset>
		
		</td>
	</tr>
	<tr>
		<td colspan="2"></td>
	</tr>
</table>
<iframe name="ajax_upload" id="ajax_upload"></iframe>
<script type="text/javascript">init_pck()</script>
]]></content>