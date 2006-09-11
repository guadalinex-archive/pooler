<? 
include('../php/check_access.php');
include('../php/functions.php');
	
$user = isset($_GET['user']) ? $_GET['user'] : '';
$uparam = $user ? getParamByUser($user) : array();
$param = $_SESSION['user_' . $ids]['param'];
?>

<!--
/**
 * Frame edit_user.php
 * formulario de nuevo/edición de usuarios
 * 
 * @author Francisco Javier Ramos Álvarez
 * @version 1.0
 * @package app
 * 
 * @return html
 */
-->
<table class="table2">
	<tr>
		<td width="150" bgcolor="#EEEEEE">Usuario:</td>
		<td>
			<input type="text" id="username" value="<?= $user ?>" />
			<input type="hidden" id="old_username" value="<?= $user ?>">
		</td>
	</tr>
	<tr>
		<td width="150" bgcolor="#EEEEEE">Aplicaci&oacute;n:</td>
		<td>
			<table class="table1" cellspacing="0" cellpadding="0">
				<tr>
					<td><input type="checkbox" id="chk_pck" value="pck" <?= eregi('pck', $uparam['app']) ? 'checked="true"' : (!$user ? 'checked="true"' : '') ?> /></td><td>Paquetes&nbsp;&nbsp;&nbsp;</td>
					<td><input type="checkbox" id="chk_user" value="user" <?= eregi('user', $uparam['app']) ? 'checked="true"' : '' ?> /></td><td>Usuarios&nbsp;&nbsp;&nbsp;</td>
					<td><input type="checkbox" id="chk_log" value="log" <?= eregi('log', $uparam['app']) ? 'checked="true"' : '' ?> /></td><td>Logs</td>
				</tr>
			</table>
		</td>
	</tr>
	<tr>
		<td width="150" bgcolor="#EEEEEE" valign="top">Distribuciones:</td>
		<td id="dists_user"></td>
	</tr>
	<tr>
		<td></td>
		<td align="right">
			<button onclick="updateUser(); return false;" <?= !eregi('w', $param['users']) ? 'disabled="true"' : '' ?>><img src="../img/b_usrcheck.png" align="absmiddle"> Actualizar</button>
			&nbsp;
			<button onclick="closeAction(); return false;"><img src="../img/s_error.png" align="absmiddle"> Cancelar</button>
		</td>
	</tr>
</table>

<script type="text/javascript">
	showDistsUser('<?= $user ?>');
	Field.focus('username');
</script>