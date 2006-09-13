/**
 * Module functions.js
 * Contiene toda la funcionalidad AJAX y de componentes de la interfaz web.
 * Podemos decir que es el corazón de la aplicación, con todas las funciones
 * necesarias para una correcta ejecución.
 * 
 * @author Francisco Javier Ramos Álvarez
 * @version 1.1
 * @package js
 * @see dhtmlXGrid.js
 * @see dhtmlXTabbar.js
 * @see dhtmlXToolbar.js
 * @see dhtmlXTree.js
 * @see md5.js
 * @see prototype.js
 * @see wz_dragdrop.js
 * @see prototype.js
 */

function loadTreeDists(){
	if(myTreeDists != null){
		myTreeDists = null;
		$('dists').innerHTML = '';
	}
	
	//cargamos el árbol de directorio de distribuciones
	myTreeDists = new dhtmlXTreeObject('dists', '100%', '100%', 0);
	
	var loading = getLoading('Cargando distribuciones');
	myTreeDists.allTree.appendChild(loading);
	
	myTreeDists.setOnDblClickHandler(selectedNodeDists);
	myTreeDists.setImagePath('../img/');
	myTreeDists.loadXML('../php/dists.xml.php', function(){
		myTreeDists.allTree.removeChild(loading);
	});
}

function loadTreeUsers(){
	if(myTreeUsers != null){
		myTreeUsers.deleteItem('root_users', true);
		myTreeUsers = null;
		$('users').innerHTML = '';
	}
	//cargamos el árbol de usuarios
	myTreeUsers = new dhtmlXTreeObject('users', '100%', '100%', 0);

	var loading = getLoading('Cargando usuarios');
	myTreeUsers.allTree.appendChild(loading);
	
	myTreeUsers.setOnDblClickHandler(selectedNodeUsers);
	myTreeUsers.setImagePath('../img/');
	myTreeUsers.loadXML('../php/users.xml.php', function(){
		myTreeUsers.allTree.removeChild(loading);
	});
}

function selectedNodeDists(id){
	var path = id;

	/////////////////////////////////////////////////////////////////////////////////////////////
	if(/\/Release(\.gpg)?$/.test(path)){ //Fichero Release
		typeFile = 'rls';
		destroyGridPkg();
		var myAjax = new Ajax.Updater(
			'content',
			'../php/view_release.php',
			{
				method: 'get',
				parameters: 'path=' + encodeURIComponent(path),
				onComplete: function(){
					$('path').innerHTML = '<strong>PATH:</strong> ' + path.substr(path.indexOf('dists/')+6);
				}
			}
		)
	}
	
	
	/////////////////////////////////////////////////////////////////////////////////////////////
	else if(/\/(Packages|Sources)(\.(gz|bz2))?$/.test(path)){ //Ficheros Packages y Sources
		typeFile = /\/Packages(\.(gz|bz2))?$/.test(path) ? 'pkg' : 'src';
		$('path').innerHTML = '';
		if(myGridPkg == null){
			$('content').innerHTML = '<div id="gridcontrol" style="width:100%; height:100%"></div>';
	 		myGridPkg = new dhtmlXGridObject('gridcontrol');
			configureGridPkg();
			myGridPkg.init();
		}
		myGridPkg.datas = [path, 1, 50, ''];
		createToolBarContentPkg();
		myToolbarContent.loadXML("../php/toolbar_content.xml.php?path=" + encodeURIComponent(myGridPkg.datas[0]));
		myToolbarContent.showBar();
		myToolbarContent.setOnShowHandler(setTimeout(loadGridPackages, 500));
	}
	
	
	/////////////////////////////////////////////////////////////////////////////////////////////
	else{ //Intentamos desplegar o replegar la rama
		typeFile = '';
		if(myTreeDists.isLocked(id))
			myTreeDists.openItem(id);
		else
			myTreeDists.closeItem(id);
	}
}

function selectedNodeUsers(user){
	if(isUserSelected())
		toolbarUsersClick('but_users_2'); //edicion
}

function configureGridPkg(){
	if(myGridPkg != null){
		//configuramos
		myGridPkg.setImagePath('../img/');
		myGridPkg.setHeader('&nbsp;,Paquete,Versi&oacute;n,Acci&oacute;n');
		myGridPkg.setInitWidths('25,300,200,100');
		myGridPkg.setColAlign("center,left,left,center");
		myGridPkg.setColTypes("ch,ro,ro,ro");
		myGridPkg.setColSorting("int,str,str");
		myGridPkg.enableBuffering(numRegsBuffer);
	}
}

function configureGridLog(){
	if(myGridLog != null){
		//configuramos
		myGridLog.setImagePath('../img/');
		myGridLog.setHeader('Usuario,Acci&oacute;n,&nbsp;,Hora');
		myGridLog.setInitWidths('170,65,320,70');
		myGridLog.setColAlign("left,center,left,center");
		myGridLog.setColTypes("ro,ro,ro,ro");
		myGridLog.enableBuffering(numRegsBuffer);
		//myGridLog.setColSorting("str,null,str,date");
	}
}

function createToolBarContentPkg(){
	myToolbarContent = null;
	$('toolbar_content').innerHTML = '';
	myToolbarContent = new dhtmlXToolbarObject('toolbar_content','100%','20');
	myToolbarContent.setOnClickHandler(toolbarContentClick);
}

function createToolBarContentLog(){
	myToolbarContentLog = null;
	$('toolbar_content').innerHTML = '';
	myToolbarContentLog = new dhtmlXToolbarObject('toolbar_content','100%','20');
	myToolbarContentLog.setOnClickHandler(toolbarContentLogClick);
}

function toolbarDistsClick(button){
	switch(button){
		case 'but_dists_1': newPackages(); break;
		case 'but_dists_2': newSources(); break;
		//case 'but_dists_3': findPackages(); break;
		case 'but_dists_4': myTreeDists.openAllItems(myTreeDists.getSelectedItemId()); break;
		case 'but_dists_5': myTreeDists.closeAllItems(myTreeDists.getSelectedItemId()); break;
		case 'but_dists_6': loadTreeDists(); break;
		case 'but_dists_7': endSessionByApp(); break;
	}
}

function toolbarUsersClick(button){
	myGridDistsUser = null;
	
	switch(button){
		case 'but_users_1': newUser(); break;
		case 'but_users_2': editUser(); break;
		case 'but_users_3': deleteUser(); break;
		case 'but_users_4': endSessionByApp(); break;
	}
}

function toolbarCalendarClick(button){

	switch(button){
		case 'but_calendar_1': endSessionByApp(); break;
	}
}

function newPackages(){
	openPopup('Subir nuevos paquetes', '../app/new_pkg.php', '', 640, 480, '../img/iconNewNewsEntry.gif', 'new');
}

function newSources(){
	openPopup('Subier nuevos ficheros fuente', '../app/new_src.php', '', 640, 480, '../img/source.png', 'new');
}

function findPackages(){
	alert('Buscar paquetes por los diferentes campos');
}

function newUser(){
	myTreeUsers.clearSelection();
	
	//insertamos formulario de nuevo
	var myAjax = new Ajax.Updater(
		'content',
		'edit_user.php',
		{
			method: 'get',
			evalScripts: true
		}
	);
}

function editUser(){
	if(isUserSelected()){
		//editamos usuario
		var myAjax = new Ajax.Updater(
			'content',
			'edit_user.php?user=' + encodeURIComponent(myTreeUsers.getSelectedItemId()),
			{
				method: 'get',
				evalScripts: true
			}
		);
	}
	else
		alert('Seleccione antes al usuario a editar/visualizar');
}

function deleteUser(){
	if(isUserSelected()){
		if(confirm('Desea realmente eliminar a este usuario?')){
			showDivLoading('Eliminando usuario...');
			var user = myTreeUsers.getSelectedItemId();
			var param = 'user=' + encodeURIComponent(user);
			
			var myAjax = new Ajax.Request(
				'../php/delete_user.php',
				{
					method: 'get',
					parameters: param,
					onComplete: function(){
						//myTreeUsers.deleteSelectedItem();
						myTreeUsers.deleteItem(user);
						hideDivLoading();
						emptyContentUser();
					}
				}
			);
		}
	}
	else
		alert('Seleccione antes al usuario a eliminar');
}

function endSessionByApp(){
	if(confirm('Desea realmente salir de la aplicacion?'))
		endSession();
}

function endSession(){
	if(!exitApp){
		exitApp = true;
		var myAjax = new Ajax.Request(
			'../php/end_session.php',
			{
				method: 'get',
				onComplete: endApplication
			}
		);
	}
}

function endApplication(){
	document.location = 'index.php';
}

function toolbarContentClick(button){
	switch(button){
		case 'but_content_1': showMoveTo(); break;
		case 'but_content_2': showConfirmDelete(); break;
		case 'but_content_3': firstPage(); break;
		case 'but_content_4': previousPage(); break;
		case 'but_content_5': nextPage(); break;
		case 'but_content_6': lastPage(); break;
		case 'but_content_7': showFilterPackages(); break;
		case 'but_content_8': loadGridPackages(); break;
	}
}

function toolbarContentLogClick(button){
	switch(button){
		case 'but_content_1': loadGridLog(myCalendar.date.print("%Y%m%d")); break;
		case 'but_content_2': emptyFieldsFilterLog(); break;
	}
}

function movePackages(){
	alert('Movemos paquetes seleccionados.');
}

function deletePackages(){
	alert('Eliminamos paquetes seleccionados.');
}

function firstPage(){
	if(myGridPkg != null){
		if(myGridPkg.datas[1] > 1){
			myGridPkg.datas[1] = 1;
			loadGridPackages();
		}
	}
}

function previousPage(){
	if(myGridPkg != null){
		if(myGridPkg.datas[1] > 1){
			myGridPkg.datas[1]--;
			loadGridPackages();
		}
	}
}

function nextPage(){
	if(myGridPkg != null){
		maxpag = Math.ceil(parseInt(myGridPkg.getNode('rows').getAttribute('num'))/50);
		if(myGridPkg.datas[1] < maxpag){
			myGridPkg.datas[1]++;
			loadGridPackages();
		}
	}
}

function lastPage(){
	if(myGridPkg != null){
		maxpag = Math.ceil(parseInt(myGridPkg.getNode('rows').getAttribute('num'))/50);
		if(myGridPkg.datas[1] < maxpag){
			myGridPkg.datas[1] = Math.ceil(parseInt(myGridPkg.getNode('rows').getAttribute('num'))/50);
			loadGridPackages();
		}
	}
}

function showFilterPackages(){
	openPopup('Filtrado de registros', '../app/filter.php', '', 490, 180, '../img/iconFilter.gif', 'filter');
}

function loadGridPackages(){
	if(myGridPkg != null){
		
		//cerramos popup para los casos en los que sean para mover o para borrar
		if($('popup')){
			switch($('popup').getAttribute('type')){
				case 'move':
				case 'delete':
					closePopup();
			}
		}
		
		myGridPkg.clearAll();
		
		var loading = getLoading('Cargando datos...');
		myGridPkg.objBox.appendChild(loading);
		myGridPkg.setOnEndLoad(function(){
			myGridPkg.objBox.removeChild(loading);
			
			maxpag = Math.ceil(parseInt(myGridPkg.getNode('rows').getAttribute('num'))/50);
			
			var titleToolbar = myGridPkg.datas[3] ? '<img class="alink" src="../img/s_warn.png" align="absmiddle" title="Se esta utilizando un filtro. Click para eliminarlo" onclick="deleteFilterAndReload()" /> ' : '';
			titleToolbar += 'Listado de Paquetes ';
			titleToolbar += '<font style="color:#990000; font-size:10px;">[P&aacute;g. ' + myGridPkg.datas[1] + ' de ' + maxpag + ']</font>';
			myToolbarContent.setText(titleToolbar);
			
			$('path').innerHTML = '<strong>PATH:</strong> ' + myGridPkg.datas[0].substr(myGridPkg.datas[0].indexOf('dists/')+6);
		});
		myGridPkg.setOnCheckHandler(onCheckHandler);
		
		myGridPkg.loadXML('../php/packages.xml.php?' + getParamGrid());
	}
}

function loadGridLog(date){
	if(myGridLog != null){
		
		myGridLog.clearAll();

		var loading = getLoading('Cargando Log...');
		myGridLog.objBox.appendChild(loading);
		myGridLog.setOnEndLoad(function(){
			myGridLog.objBox.removeChild(loading);
		});
		
		var filter = serializeParamFilterLog();
		myGridLog.loadXML('../php/log.xml.php?date=' + date + (filter ? '&' + filter : ''));
	}
}

function serializeParamFilterLog(){
	if(myToolbarContentLog != null){
		var p = [];
		var user = myToolbarContentLog.items[3].getOptionValue();
		var action = myToolbarContentLog.items[4].getOptionValue();
		var other = myToolbarContentLog.items[5].getValue();
		
		if(user!=0) p.push('fuser=' + user);
		if(action!=0) p.push('faction=' + action);
		if(other!='') p.push('fother=' + encodeURIComponent(other));
		
		return p.join('&');
	}
	else
		return '';
}

function onCheckHandler(rowId, state){
	if($('popup')){
		switch($('popup').getAttribute('type')){
			case 'move':
			case 'delete':
				var action = ($('popup').getAttribute('type') == 'move') ? 'mover' : 'eliminar';
				if(state){
					li = $TAG('li');
					li.id = 'li_' + rowId;
					li.innerHTML = myGridPkg.cells(rowId, 1).getValue();
					$('lstPackages').appendChild(li);
					if($('lstPackages').childNodes.length == 1){
						$('msg_move').innerHTML = '<img src="../img/s_warn.png" align="absmiddle" /> Se van a ' + action + ' los siguientes paquetes:';
						$('but_move').disabled = false;
					}
				}
				else{
					$('lstPackages').removeChild($('li_' + rowId));
					if($('lstPackages').childNodes.length == 0){
						$('msg_move').innerHTML = '<img src="../img/s_cancel.png" align="absmiddle" /> No hay paquetes seleccionados para ' + action;
						$('but_move').disabled = true;
					}
				}
		}
	}
}

function getParamGrid(){
	var param = '';
	param += 'path=' + encodeURIComponent(myGridPkg.datas[0]);
	param += '&pag=' + myGridPkg.datas[1];
	param += '&toshow=' + myGridPkg.datas[2];
	param += (myGridPkg.datas[3] ? '&' : '') + myGridPkg.datas[3];
	return param;
}

function destroyGridPkg(){
	myGridPkg = null;
	myToolbarContent = null;
	$('toolbar_content').innerHTML = '';
	$('path').innerHTML = '';
}

function emptyContentPkg(){
	destroyGridPkg();
	$('content').innerHTML = '<dir style="text-align:center; margin-top:100px"><img src="../img/s_notice.png" align="absmiddle"> <strong>NOTA:</strong> s&oacute;lo se podr&aacute;n visualizar los ficheros <i>Release</i>, <i>Packages</i> y <i>Sources</i></dir>';
}

function emptyContentUser(){
	myGridDistsUser = null;
	$('content').innerHTML = '<div style="text-align:center; margin-top:100px"><img src="../img/s_info.png" align="absmiddle"> <strong>NOTA:</strong> se mostrar&aacute;n los formularios de A&ntilde;adir y Editar / Visualizar usuario.</div>';
}

function emptyContent3(){
	$('content').innerHTML = '<div style="text-align:center; margin-top:100px"><img src="../img/s_info.png" align="absmiddle"> <strong>NOTA:</strong> se mostrar&aacute; el contenido del log seg&uacute;n el d&iacute seleccionado.</div>';
}

function openPopup(title, page, param, width, height, icon, other){
	closePopup();
	
	popup = $TAG('div');
	var titlebar = $TAG('div');
	var frame = $TAG('div');
	
	if(!width) width = 640;
	if(!height) height = 480;
	
	popup.id = 'popup';
	popup.setAttribute('type', (other ? other : 'undefined'));
	titlebar.id = 'titlebar';
	titlebar.style.width = width + 'px';
	titlebar.innerHTML = '<div style="margin:5px 0 0 5px; float:left">' + (icon ? '<img src="' + icon + '" align="absmiddle">' : '') + ' <strong>' + title + '</strong></div><div id="imgCloseWin" style="margin: 5px 5px 0 0; float:right"><img src="../img/close2.gif" onclick="closePopup()" style="cursor:pointer" /></div>';
	
	frame.id = 'frame';
	frame.style.width = width + 'px';
	frame.style.height = height + 'px';
	frame.align = 'center';
	
	//centramos el popup
	titlebar.style.left = Math.round((1005/2 - width/2)) + 'px';
	frame.style.left = titlebar.style.left;
	
	//situamos horizontalmente
	titlebar.style.top = document.body.scrollTop + 30 + 'px';
	frame.style.top = document.body.scrollTop + 60 + 'px';
	
	var loading = getLoading('Cargando contenido...');
	frame.innerHTML = '<div style="height:' + Math.round((height/2) - 15 -10) + '"></div>';
	frame.appendChild(loading);
	
	//mostramos el popup
	popup.appendChild(titlebar);
	popup.appendChild(frame);
	document.body.appendChild(popup);
	
	//le damos dragdrop
	SET_DHTML('titlebar'+CURSOR_MOVE, 'frame'+NO_DRAG);
	dd.elements.titlebar.addChild('frame');
	
	//insertamos contenido
	var myAjax = new Ajax.Updater(
		'frame',
		page,
		{
			method: 'get',
			parameters: param, 
			evalScripts: true
		}
	)
}

function closePopup(){
	if($('popup')){
		dd.elements.titlebar.del();
		dd.elements.frame.del();
		document.body.removeChild($('popup'));
	}
}


function addInputFile(type){
	var container = $(type);
	var span = $TAG('span');
	var field = $TAG('input');
	field.type = 'file';
	field.name = 'in_' + type + '[]';
	field.size = 30;
	
	var a = $TAG('span');
	a.className = 'alink';
	a.onclick = function (){
		container.removeChild(span);
	};
	a.innerHTML = ' <img src="../img/b_drop.png" align="absmiddle">';
	
	span.appendChild(field);
	span.appendChild(a);
	span.appendChild($TAG('br'));
	container.appendChild(span);
}

function uploadDebs(){
	if(evalFieldNewPkg()){
		//todo correcto subimos los paquetes uno a uno
		showDivLoading('Subiendo paquetes...');
		$('frm_nuevo').submit();
	}
}

function evalFieldNewPkg(){
	if(!Field.present('sel_distribucion')){
		alert('Seleccione la distribucion.');
		return false;
	}
	
	var deb1 = false;
	var deb2 = true;
	var in_debs = Form.getInputs('frm_nuevo', 'file');
	for(var i = 0; i < in_debs.length; i++){
		deb1 = deb1 || (in_debs[i].value != '');
		deb2 = deb2 && (/\.deb$/).test(in_debs[i].value);
	}
	
	if(!deb1){
		alert('Introduzca al menos un paquete.');
		return false;
	}
	else if(!deb2){
		alert('Existen ficheros que no tienen la extension deb');
		
		return false;
	}
	
	return true;
}

function uploadSrcs(){
	if(evalFieldNewSrc()){
		//todo correcto subimos los paquetes uno a uno
		//showDivLoading('Subiendo ficheros fuente...');
		$('frm_nuevo').submit();
	}
}

function evalFieldNewSrc(){
	if(!Field.present('sel_distribucion')){
		alert('Seleccione la distribucion.');
		return false;
	}
	
	var src1 = 0;
	var src2 = false;
	var in_srcs = Form.getInputs('frm_nuevo', 'file');
	for(var i = 0; i < in_srcs.length; i++){
		if(in_srcs[i].value != '') src1++;
		if((/\.dsc$/).test(in_srcs[i].value)) src2 = true;
	}
	
	if(src1 < 2){
		alert('Introduzca al menos dos fichero (el dsc y codigo fuente comprimido).');
		return false;
	}
	else if(!src2){
		alert('No se ha encontrado ningun fichero dsc');
		return false;
	}
	
	return true;
}

function getLoading(msg){
	if($('wait')){ //si hay un loading lo eliminamos
		var divParent = $('wait').parentNode;
		divParent.removeChild($('wait'));
	}
	
	var loading = $TAG('div');
	loading.innerHTML = '<div id="wait"><img src="../img/loading3.gif" align="absmiddle" /> ' + msg + '</div>';
	return loading;
}

function showDivLoading(msg){
	hideDivLoading();
	loading = getLoading(msg);
	loading.innerHTML = '<br /><br /><br />' + loading.innerHTML;
	loading.id = 'loading';
	loading.style.left = Math.round((1005/2 - 400/2)) + 'px';
	loading.style.top = document.body.scrollTop + Math.round((document.height/2 - 175/2)) + 'px';
	document.body.appendChild(loading);
}

function hideDivLoading(){
	if($('loading'))
		document.body.removeChild($('loading'));
}

function showComboFields(){
	$('combobox').style.visibility = 'visible';
	Field.focus('combobox');
}

function selFieldFilter(){
	$('in_buscaren').value = $F('combobox');
	$('combobox').selectedIndex = -1;
	Field.activate('in_buscar');
	hideComboFileds();
}

function hideComboFileds(){
	$('combobox').style.visibility = 'hidden';
}

function filterRegs(){
	if(!Field.present('in_buscar')){
		alert('Introduazca la busqueda.');
		Field.focus('in_buscar');
	}
	else if(!Field.present('in_buscaren')){
		alert('Seleccione o introduzca el campo donde buscar.');
		Field.focus('in_buscaren');
	}	
	else{
		var filter = 'condition[' + $F('in_buscaren') + ']=' + $F('in_buscar');
		myGridPkg.datas[3] = filter; //damos filtro
		myGridPkg.datas[1] = 1;
		loadGridPackages();
		closePopup();
	}
}

function deleteFilterAndReload(){
	myGridPkg.datas[3] = '';
	myGridPkg.datas[1] = 1;
	loadGridPackages();
}

function markPackage(id){
	var cell_ch = myGridPkg.cells(id, 0);
	if(cell_ch.getValue() == 0)
		cell_ch.changeState();
}

function unmarkPackages(){
	var numRows = myGridPkg.getRowsNum();
	numRows.times(function(i){
		var cell_ch = myGridPkg.cells2(i, 0);
		if(cell_ch.getValue() == 1)
			cell_ch.changeState();
	});
}

function showMoveTo(){
	openPopup('Mover paquetes a ...', 'move_pkg_to.php?dist=' + encodeURIComponent(getDistByPath(myGridPkg.datas[0])), '', 490, 280, '../img/move2.png', 'move');
}

function showConfirmDelete(){
	openPopup('Eliminar paquetes? ...', 'confirm_delete_pkg.php', '', 490, 280, '../img/delpkg.png', 'delete');
}

function printListSelectedPackages(){
	var li = null;
	var ok = false;
	var ul = $('lstPackages');
	var numRows = myGridPkg.getRowsNum();
	
	numRows.times(function(i){
		if(myGridPkg.cells2(i, 0).getValue() == 1){
			li = $TAG('li');
			li.id = 'li_' + myGridPkg.getRowId(i);
			li.innerHTML = myGridPkg.cells2(i, 1).getValue();
			ul.appendChild(li);
			ok = true;
		}
	});
	
	var action = ($('popup').getAttribute('type') == 'move') ? 'mover' : 'eliminar';
	if(ok)
		$('msg_move').innerHTML = '<img src="../img/s_warn.png" align="absmiddle" /> Se van a ' + action + ' los siguientes paquetes:';
	else
		$('msg_move').innerHTML = '<img src="../img/s_cancel.png" align="absmiddle" /> No hay paquetes seleccionados para ' + action;
	
	$('but_move').disabled = !ok;
}

function moveRegs(){
	if(!Field.present('sel_distribucion')){
		alert('Seleccione la distribucion donde quiera mover los paquetes.');
		Field.focus('sel_distribucion');
	}
	else{
		//procedemos a moverlos
		showDivLoading('Moviendo paquetes...');
		var param = 'dist_o=' + encodeURIComponent(getDistByPath(myGridPkg.datas[0])); //origen
		param += '&dist_d=' + encodeURIComponent($F('sel_distribucion')); //destino
		param += '&' + serializeSelectedFiles();
		
		var myAjax = new Ajax.Request(
			'../php/move_' + typeFile + '.php',
			{
				method: 'post',
				parameters: param,
				onComplete: endMoveHandler
			}
		);
	}
}

function endMoveHandler(){
	hideDivLoading(); 
	closePopup();
	loadGridPackages();
}

function deleteRegs(){
	//procedemos a eliminarlos
	showDivLoading('Eliminando paquetes...');
	var param = 'dist=' + encodeURIComponent(getDistByPath(myGridPkg.datas[0])); //origen
	param += '&' + serializeSelectedFiles();

	var myAjax = new Ajax.Request(
		'../php/delete_' + typeFile + '.php',
		{
			method: 'post',
			parameters: param,
			onComplete: endDeleteHandler
		}
	);

}

function endDeleteHandler(){
	endMoveHandler();
}

function serializeSelectedFiles(){
	var files = '';
	var cells = null;
	var numRows = myGridPkg.getRowsNum();
	numRows.times(function(i){
		if(myGridPkg.cells2(i, 0).getValue() == 1){
			cells = myGridPkg.getRowsXPath('//row[' + (i+1) + ']/cell');
			switch(typeFile){
				case 'pkg': 
					files += 'files[' + myGridPkg.cells2(i, 1).getValue() + ']=' + encodeURIComponent(cells[4].firstChild.nodeValue) + '&'; 
					break;
				case 'src':
					for(var j = 4; j < cells.length; j++)
						files += 'files[' + myGridPkg.cells2(i, 1).getValue() + '][]=' + encodeURIComponent(cells[j].firstChild.nodeValue) + '&'; 
			}
		}
	});
	
	return files.substr(0, files.length-1);
}

function isUserSelected(){
	var itemId = myTreeUsers.getSelectedItemId();
	return (itemId != '' && itemId != 'root_users');
}

function showDistsUser(user){
	if(myGridDistsUser == null){
		$('dists_user').innerHTML = '<div id="gridcontrol" style="width:100%; height:100%"></div>';
		myGridDistsUser = new dhtmlXGridObject('gridcontrol');
		configureGridDistsUser();
		myGridDistsUser.init();
		
		myGridDistsUser.datas = user ? [user] : [];
	}
	
	loadGridDistsUser();
}

function configureGridDistsUser(){
	if(myGridDistsUser != null){
		myGridDistsUser.setImagePath('../img/');
		myGridDistsUser.setHeader('Distribuci&oacute;n,r,w,<img src="../img/iconNewNewsEntry.gif" style="cursor:pointer" onclick="selDistributionUser()" />');
		myGridDistsUser.setInitWidths('250,25,25,30');
		myGridDistsUser.setColAlign("left,center,center,center");
		myGridDistsUser.setColTypes("ro,ch,ch,ro");
		myGridDistsUser.setColSorting("str");
	}
}

function loadGridDistsUser(){
	if(myGridDistsUser != null){
		//cerramos popup "añadir nueva distribución"
		if($('popup')) closePopup();
		
		myGridDistsUser.clearAll();
		
		var loading = getLoading('Cargando datos...');
		myGridDistsUser.objBox.appendChild(loading);
		myGridDistsUser.setOnEndLoad(function(){
			myGridDistsUser.objBox.removeChild(loading);
		});
		//myGridDistsUser.setOnCheckHandler(onCheckHandler);
		
		var param = myGridDistsUser.datas[0] ? '?user=' + myGridDistsUser.datas[0] : '';
		myGridDistsUser.loadXML('../php/dists_user.xml.php' + param);
	}
}

function closeAction(){
	emptyContentUser();
}

function selDistributionUser(){
	openPopup('A&ntilde;adir distribuci&oacute;n', '../app/add_dist.php', '', 300, 270, '../img/iconNewNewsEntry.gif', 'add_dist');
}

function printListDistNoSelected(oDists){
	if(myGridDistsUser != null){
		//desmarcamos las que ya estén seleccionadas
		var numRows = myGridDistsUser.getRowsNum();
		for(var i = 0; i < numRows; i++)
			oDists[myGridDistsUser.cells2(i, 0).getValue()] = 0;
		
		//mostramos
		var chk = null, txt = null, tr = null;
		var lst = $('distribuciones');
		for(var d in oDists){
			if(oDists[d] == 1){
				chk = $TAG('input'); chk.type = 'checkbox'; chk.value = d;
				txt = $TEXT(d);
				tr = lst.insertRow(lst.childNodes.length);
				tr.insertCell(0).appendChild(chk);
				tr.insertCell(1).appendChild(txt);
			}
		}
		
		if(!lst.childNodes.length){
			tr = lst.insertRow(0);
			tr.insertCell(0).innerHTML = '<img src="../img/s_info.png" align="absmiddle" /> No quedan distribuciones.';
			$('butAddDists').disabled = true;
		}
	}
}

function addDists(){
	var chk = null, txt = null, tr = null, cols = '', isCheck = false;
	var lst = $('distribuciones');
	for(var i = 0; i < lst.childNodes.length; i++){
		tr = lst.childNodes[i];
		chk = tr.childNodes[0].firstChild;
		txt = tr.childNodes[1].firstChild
		if(chk.checked){
			isCheck = true;
			cols = txt.nodeValue + ',0,0,<img src="../img/b_drop.png" border="0" style="cursor:pointer" onclick="myGridDistsUser.deleteRow(\'' + txt.nodeValue + '\')" title="Eliminar distribuci&oacute;n" align="absmiddle" />';
			myGridDistsUser.addRow(txt.nodeValue, cols);
		}
	}
	
	if(!isCheck) alert('Debe seleccionar al menos una distribucion.');
	else closePopup();
}

function updateUser(){
	if(evalInputUser()){
		showDivLoading('Actualizando usuario...');
		
		//montamos la cadéna con los datos del usuario
		var param = '', user, olduser, passuser, app = [], dists = [], rw = [];
		user = $F('username');
		olduser = $F('old_username');
		passuser = $('pass_user') ? $F('pass_user') : '';
		
		if($('chk_pck').checked) app.push($F('chk_pck'));
		if($('chk_user').checked) app.push($F('chk_user'));
		if($('chk_log').checked) app.push($F('chk_log'));
		
		//obtenemos las distribuciones y sus permisos
		var numRows = myGridDistsUser.getRowsNum();
		var r, w;
		for(var i = 0; i < numRows; i++){
			dists.push(myGridDistsUser.cells2(i, 0).getValue());
			r = myGridDistsUser.cells2(i, 1).getValue();
			w = myGridDistsUser.cells2(i, 2).getValue();
			rw.push((r==1 ? 'r' : '') + (w==1 ? 'w' : ''));
		}
		
		param += 'username=' + encodeURIComponent(user) + '&';
		param += olduser ? 'olduser=' + encodeURIComponent(olduser) + '&' : '';
		param += passuser ? 'passuser=' + hex_md5(passuser) + '&' : '';
		param += 'app=' + encodeURIComponent(app.join('|')) + '&';
		param += $('chk_user').checked ? 'users=rw&' : '';
		for(var i = 0; i < dists.length; i++)
			param += 'dists[' + dists[i] + ']=' + rw[i] + '&';
		
		param = param.substr(0, param.length-1);
		
		//procedemos a actualizar al usuario
		var myAjax = new Ajax.Request(
			'../php/update_user.php',
			{
				method: 'post',
				parameters: param,
				onComplete: function(){
					hideDivLoading();
					loadTreeUsers();
					emptyContentUser();
				}
			}
		);
	}
}

function evalInputUser(){
	var isNew = !Field.present('old_username');
	
	if(!Field.present('username')){
		alert('Introduzca al menos el nombre de usuario');
		Field.focus('username');
		return false;
	}
	if($('pass_user')){
		if(Field.present('pass_user')){
			if($F('pass_user') != $F('confirm_pass')){
				alert('No coincides las password introducidas. Revise la confirmacion.');
				Field.focus('confirm_pass');
				return false;
			}
		}
		else{
			if(isNew){
				alert('Introduzca la password.');
				Field.focus('pass_user');
				return false;
			}
		}
	}
	
	return true;
}

function getDistByPath(path){
	var sub_path = myGridPkg.datas[0].substr(myGridPkg.datas[0].indexOf('dists/')+6);
	return sub_path.substr(0, sub_path.indexOf('/'));
}

function flatCalendarCallback(cal){
	loadGridLog(cal.date.print("%Y%m%d"));
}

function emptyFieldsFilterLog(){
	myToolbarContentLog.items[3].setSelected('0');
	myToolbarContentLog.items[4].setSelected('0');
	myToolbarContentLog.items[5].clearField();
}