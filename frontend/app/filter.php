<?
include('../php/check_access.php');
include('../php/functions.php');
?>

<!--
/**
 * Window filter.php
 * Formulario de filtrado de paquetes/ficheros fuente.
 * 
 * @author Francisco Javier Ramos Álvarez
 * @version 1.0
 * @package app
 * 
 * @return html
 */
-->
<div id="datasPackage" style="height:150px">
	<table class="table2">
		<tr>
			<td bgcolor="#EEEEEE">
				Buscar:<br />
				<input type="text" id="in_buscar" />
			</td>
		</tr>
		<tr>
			<td bgcolor="#EEEEEE" valign="top">
				En:<br />
				<input type="text" id="in_buscaren" style="width:333px" /><img src="../img/butcombo.jpg" align="absmiddle" class="alink" onclick="showComboFields()" />
				<div>
					<select id="combobox" size=2 style="height:150px" onblur="hideComboFileds()" onclick="selFieldFilter()">
						<? printListFieldsFilter() ?>
					</select>
				<div>
			</td>
		</tr>
		<tr>
			<td align="center">
				<button onclick="filterRegs(); return false;"><img src="../img/iconReport.gif" align="absmiddle"> Filtrar</button>
				&nbsp;
				<button onclick="closePopup(); return false;"><img src="../img/s_error.png" align="absmiddle"> Cancelar</button>
			</td>
		</tr>
	</table>
<div>

<script type="text/javascript">Field.focus('in_buscar');</script>