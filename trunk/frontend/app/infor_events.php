<?
/**
 * Frame inform_events.php
 * Mostrará un pequeño informe con posibles errores o avisos que pueda
 * tener la aplicación. Este página va ligada al módulo check_app.php.
 * 
 * @author Francisco Javier Ramos Álvarez
 * @version 1.0
 * @package app
 * @see check_app.php
 * 
 * @return html
 */
?>

<style type="text/css">
	body { 
		font-size: 12px;
		background-color: #EFEBE7;
		margin: 0 0 0 0;
	}
	
	#informe {
		border: 1px outset #999999;
		background-color: #FFFFFF;
		width: 640px;
	}
	
	#cabecera {
		background-color: #D0DCE0;
		text-align: center;
	}
	
	li { margin-bottom: 10px }
</style>

<br>
<center>
	<div id="informe">
		<div id="cabecera"><img src="../img/s_info.png" align="absmiddle" /> <b>Informe de Sucesos</b></div>
		<div align="left">
			<ul>

				<? foreach($msg_err as $err): ?>
					<li><img src="../img/s_error.png" align="absmiddle" /> <?= $err ?></li>
				<? endforeach; ?>
				
				<? foreach($msg_warn as $warn): ?>
					<li><img src="../img/s_attention.png" align="absmiddle" /> <?= $warn ?></li>
				<? endforeach; ?>

			</ul>
		</div>
	</div>
</center>