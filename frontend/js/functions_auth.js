/**
 * 
 */

function auth(){
	openPopup('Autenticaci&oacute;n', 'auth.php', '', 400, 135, '../img/iconClient.gif', 'auth')
	$('imgCloseWin').style.visibility = 'hidden';
}

function checkAuth(){
	if(evalInputAuth()){
		showDivLoading('Comprobando usuario...');
		var param = Form.serialize('frmAuth');
		var myAjax = new Ajax.Request(
			'../php/check_user_ldap.php',
			{
				method: 'get',
				parameters: param,
				onComplete: completeAuth
			}
		);
	}
}

function completeAuth(request){
	hideDivLoading();
	var ret = request.responseText.replace(/\s/, '');
	if(ret == 'OK')
		document.location = 'app.php';
	else{
		alert('Error en la autenticacion. Codigo del error: ' + ret);
		Form.reset('frmAuth');
		Field.focus('login');
	}
}

function evalInputAuth(){
	if(!Field.present('login')){
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

function resetFieldAuth(){
	Field.clear('login');
	Field.clear('password');
	Field.focus('login');
}

function filterIntro(evt){
	if(Event.keyCode(evt) == Event.KEY_RETURN)
		checkAuth();
}