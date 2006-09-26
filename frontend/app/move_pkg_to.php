<?
/**
 * Window move_pkg_to.php
 * Ventana de confirmación para mover paquetes o ficheros fuente.
 * 
 * @author Francisco Javier Ramos Álvarez
 * @version 1.0
 * @package app
 * 
 * @return html
 */

include('../php/check_access.php');
include('../php/functions.php');

$noDist = isset($_GET['dist']) ? $_GET['dist'] : '';
?>

<div id="datasPackage" style="height:250px">
	<table class="table2">
		<tr>
			<td bgcolor="#EEEEEE">
				Distribuci&oacute;n:<br />
				<select id="sel_distribucion">
					<? printListDistributions($noDist) ?>
				</select>
			</td>
		</tr>
		<tr>
			<td bgcolor="#EEEEEE" align="right">
				Mantener <input type="checkbox" id="maintain" value="1" />
			</td>
		</tr>
		<tr>
			<td>
				<div style="font-size:10px">
					<span id="msg_move"></span><br />
					<ul id="lstPackages"></ul>
				</div>
			</td>
		</tr>
		<tr>
			<td align="center">
				<button id="but_move" onclick="moveRegs(); return false;"><img src="../img/move3.png" align="absmiddle"> Mover</button>
				&nbsp;
				<button onclick="closePopup(); return false;"><img src="../img/s_error.png" align="absmiddle"> Cancelar</button>
			</td>
		</tr>
	</table>
<div>

<script type="text/javascript">
	printListSelectedPackages();
	Field.focus('sel_distribucion');
</script>