<?
/**
 * 
 */
?>

<div id="contentAuth">
	<form id="frmAuth">
		<table id="tableAuth">
			<tr>
				<td bgcolor="#EEEEEE" align="right">Usuario:</td>
				<td><input type="text" name="login" id="login" style="width:200px" /></td>
			</tr>
			<tr>
				<td bgcolor="#EEEEEE" align="right">Password:</td>
				<td><input type="password" name="password" id="password" style="width:200px" /></td>
			</tr>
			<tr>
				<td colspan="2" align="center">
					<!-- <input type="button" name="aceptar" value="Upload" /> -->
					<button onclick="checkAuth(); return false;"><img src="../img/b_usrcheck.png" align="absmiddle"> Acceder</button>
					&nbsp;
					<button onclick="resetFieldAuth(); return false;"><img src="../img/ico_papelera.gif" align="absmiddle"> Borrar</button>
				</td>
			</tr>
		</table>
	</form>
<div>

<script type="text/javascript">
	Field.focus('login');
	//Event.observe('password', 'keypress', filterIntro);
</script>