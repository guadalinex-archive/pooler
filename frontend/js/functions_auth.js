/**
 * Module functions_auth.js
 * Contiene toda la funcionalidad del formulario de autenticaci�n,
 * chequeo de formulario, comprobaci�n as�ncrona en el LDAP, etc...
 * 
 * @author Francisco Javier Ramos �lvarez
 * @version 1.3
 * @package js
 * @see prototype.js (uso del AJAX, y manejo de formularios)
 */

/**
 * Funci�n que mostrar� un popup con el formulario de autenticaci�n.
 * 
 * @see functions.js (openPopup)
 */
function auth(){
	openPopup('Autenticaci&oacute;n', 'auth.php', '', 400, 165, '../img/iconClient.gif', 'auth')
	$('imgCloseWin').style.visibility = 'hidden';
}

/**
 * Realizar� el chequeo LDAP del usuario, y para ello realizar�
 * una llamada as�ncrona a un m�dulo php que hace esta funci�n.
 * 
 * @see functions.js (openPopup)
 */
function checkAuth(){
	if(evalInputAuth()){
		showDivLoading('Comprobando usuario...');
		//var param = Form.serialize('frmAuth'); //obtenemos los campos
		var param = 'login=' + encodeURIComponent($F('login')) + '&';
		param += 'password=' + encodeURIComponent($F('password')) + '&';
		param += 'sel_repository[name]=' + encodeURIComponent($TSEL('sel_repository')) + '&';
		param += 'sel_repository[path]=' + encodeURIComponent($F('sel_repository'));
		
		//realizamos la llamada al m�dulo de comprobaci�n
		var myAjax = new Ajax.Request(
			'../php/check_user_ldap.php',
			{
				method: 'post',
				parameters: param,
				onComplete: completeAuth
			}
		);
	}
}

/**
 * Handler onComplete. Cuando se completa la llamada AJAX salta esta
 * funci�n que comprobar� cual ha sido la salida, si ha ocurrido alg�n
 * error o todo ha ido correctamente.
 * 
 * @param Object (objeto devuelto por AJAX) 
 * @see method checkAuth
 */
function completeAuth(request){
	hideDivLoading();
	var resp = request.responseText;
	if(resp == 'OK') //todo correcto, redireccionamos
		document.location = 'app.php';
	else{ //ocurri� un error que mostramos
		alert(resp);
		Form.reset('frmAuth');
		Field.focus('login');
	}
}

/**
 * Eval�a los cuadros de texto del formulario.
 * 
 * @return boolean
 * @see method checkAuth
 */
function evalInputAuth(){
	if(!Field.present('sel_repository')){
		alert('No hay repositorio seleccionado.');
		Field.focus('sel_repository');
		return false;
	}
	else if(!Field.present('login')){
		alert('Introduzca el nombre de usuario.');
		Field.focus('login');
		return false;
	}
	else if(!Field.present('password')){
		alert('Introduzca la password.');
		Field.focus('password');
		return false;
	}
	
	return true;
}

/**
 * Limpia los cuadros de texto del formulario.
 */
function resetFieldAuth(){
	$('sel_repository').selectedIndex = 0;
	Field.clear('login');
	Field.clear('password');
	Field.focus('login');
}

/**
 * Filtra la pulsaci�n del intro para llamar al m�todo de chequeo de usuario.
 */
function filterIntro(evt){
	if(Event.keyCode(evt) == Event.KEY_RETURN)
		checkAuth();
}