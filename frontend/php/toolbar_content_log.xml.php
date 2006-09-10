<?
/**
 * 
 */

	include_once('functions.php');
	require_once('myDebLog.class.php');
	require_once('IniReader.class.php');

/*****************************************************************************/
header("Content-type:text/xml"); 
echo '<?xml version="1.0" encoding="utf-8"?>';
echo '<toolbar name=" " width="645" toolbarAlign="left">';
	
	echo '<ImageButton src="../img/reload.gif" height="25" width="25" id="but_content_1" tooltip="Recarga Pagina" />';
	echo '<ImageButton src="../img/ico_papelera.gif" height="25" width="25" id="but_content_2" tooltip="Limpiar filtros" />';
	echo '<divider id="div_1" />';

	$oIni = new IniReader(USERS_INI);
	$sections = getOrderedKeys($oIni->info);

	echo '<SelectButton id="sel_user" width="200px" height="25px">';
	echo '<option value="0">[Usuario...]</option>';
	foreach($sections as $section)
		echo '<option value="' . $section  . '">' . $section  . '</option>';
	echo '</SelectButton>';
	
	echo '<SelectButton id="sel_actionr" width="130px" height="25px">';
	echo '<option value="0">[Acción...]</option>';
	echo '<option value="' . LOGIN . '">Logins</option>';
	echo '<option value="' . LOGOUT . '">Logouts</option>';
	echo '<option value="' . ADDPKG . '">Pckg. Subidos</option>';
	echo '<option value="' . MOVPKG . '">Pckg. Movidos</option>';
	echo '<option value="' . DELPKG . '">Pckg. Eliminados</option>';
	echo '<option value="' . ADDUSER . '">Usr. Añadidos</option>';
	echo '<option value="' . EDTUSER . '">Usr. Editados</option>';
	echo '<option value="' . DELUSER . '">Usr. Borrados</option>';
	echo '</SelectButton>';
	echo '<InputText id="in_text" width="245" height="25"></InputText>';
	
	
echo '</toolbar>';
/*****************************************************************************/

?>