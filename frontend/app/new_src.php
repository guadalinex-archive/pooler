<?
/**
 * 
 */

include('../php/check_access.php');
include('../php/functions.php');
?>

<form id="frm_nuevo" method="post" enctype="multipart/form-data" action="../php/upload_src.php" target="ajax_upload">
	<div id="datasPackage">
		<table class="table2">
			<tr>
				<td width="150" bgcolor="#EEEEEE">Distribuci&oacute;n:</td>
				<td>
					<select id="sel_distribucion" name="sel_distribution">
						<? printListDistributions() ?>
					</select>
				</td>
			</tr>
			<tr>
				<td width="100" bgcolor="#EEEEEE" valign="top">Fuentes:</td>
				<td>
					<input type="file" name="in_srcs[]" size="30" /><br />
					<input type="file" name="in_srcs[]" size="30" /><br />
					<span id="srcs"></span>
					<span class="alink" onclick="addInputFile('srcs')">[A&ntilde;adir otro] <img src="../img/arrow_up.gif" align="top" /></span>
				</td>
			</tr>
			<tr>
				<td></td>
				<td align="right">
					<!-- <input type="button" name="aceptar" value="Upload" /> -->
					<button onclick="uploadSrcs(); return false;"><img src="../img/upload.gif" align="absmiddle">Subir</button>
					&nbsp;
					<button onclick="closePopup(); return false;"><img src="../img/s_error.png" align="absmiddle"> Cancelar</button>
				</td>
			</tr>
		</table>
	<div>
</form>

<script type="text/javascript">Field.focus('sel_distribucion');</script>