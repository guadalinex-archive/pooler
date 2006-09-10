<?
/**
 * 
 */

include('../php/check_access.php');
include('../php/functions.php');
?>

<div id="datasPackage" style="height:245px" align="left">
	<table style="margin-top: 10px">
		<tr>
			<td>
				<div id="lstDistros" align="left">
					<table class="table1" cellspacing="0" cellpadding="0">
						<tbody id="distribuciones"></tbody>
					</table>
				<div>
			</td>
		</tr>
		<tr>
			<td align="center">
				<button id="butAddDists" onclick="addDists(); return false;"><img src="../img/add.gif" align="absmiddle"> A&ntilde;adir</button>
				&nbsp;
				<button onclick="closePopup(); return false;"><img src="../img/s_error.png" align="absmiddle"> Cancelar</button>
			</td>
		</tr>
	</table>
<div>

<script type="text/javascript">
	<? $dists = getListDistribution() ?>
	
	//lista de distribuciones
	oDists = {
		<?
			for($i = 0; $i < count($dists); $i++)
				echo "'" . $dists[$i] . "': 1" . ($i+1 < count($dists) ? ",\n" : '' );
		?>
	};
	
	//imprimimos la lista de distribuciones no seleccionadas
	printListDistNoSelected(oDists);
	
	oDists = null;
</script>