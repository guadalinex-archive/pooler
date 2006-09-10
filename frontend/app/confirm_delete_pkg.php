<?
/**
 * 
 */

include('../php/check_access.php');
include('../php/functions.php');
?>

<div id="datasPackage" style="height:250px">
	<table class="table2">
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
				<button id="but_move" onclick="deleteRegs(); return false;"><img src="../img/ico_papelera.gif" align="absmiddle"> Eliminar</button>
				&nbsp;
				<button onclick="closePopup(); return false;"><img src="../img/s_error.png" align="absmiddle"> Cancelar</button>
			</td>
		</tr>
	</table>
<div>

<script type="text/javascript">printListSelectedPackages();</script>