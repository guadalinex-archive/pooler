/**
 * Class poolerToolBar.class.js
 * Con esta clase simularemos una barra de herramientas al estilo
 * dhtmlXtoolbar by Scand LLC (http://www.scbr.com), pero para
 * las necesidades de esta aplicación (por lo tanto no es genérico),
 * además, la licencia de dicha herramienta no nos permitía publicarla
 * libremente.
 * 
 * @author Francisco Javier Ramos Álvarez
 * @version 1.0
 * @package js
 * @see toolbar.css
 * @see prototype.js necesaria para hacer las funciones AJAX
 */
 
/**
 * Constructor de la clase. Establecerá las propiedades por defecto
 *
 * @access public
 * @param string isTag
 * @param string width
 * @param string height
 * @return poolerToolBar
 */
poolerToolBar = function(idTag, width, height){
	/**
	 * Guarda el id de la etiqueta contenedora
	 *
	 * @var string
	 * @access private
	 */
	this.idTag = idTag;
	
	/**
	 * Nombre de la barra de herramientas
	 *
	 * @var string
	 * @access private
	 */
	this.tdname = '';
	
	/**
	 * Guarda el ancho en % o en px
	 *
	 * @var string
	 * @access private
	 */
	this.width = width || '100%';
	
	/**
	 * Guarda el alto en % o en px
	 *
	 * @var string
	 * @access private
	 */
	this.height = height || '30px';
	
	/**
	 * Contiene el XML
	 *
	 * @var XML
	 * @access private
	 */
	this.xmlToolbar = null;
	
	/**
	 * Contiene el HTML que la forma
	 *
	 * @var HTML
	 * @access private
	 */
	this.toolbar = null;
	
	/**
	 * Contiene la lista de controles de la barra
	 *
	 * @var array of poolerTbObject
	 * @access private
	 */
	this.items = [];
	
	/**
	 * Handler del onClick
	 *
	 * @var Function
	 * @access private
	 */
	this.onClick = function(){};
	
	/**
	 * Handler del onShow
	 *
	 * @var Function
	 * @access private
	 */
	this.onShow = function(){};
}

/**
 * Este método cargará la barra de herramientas por medio
 * de un fichero XML con los datos de la misma.
 *
 * @access public
 * @param string pathXML
 */
poolerToolBar.prototype.loadXML = function(pathXML, showBar){
	var tbThis = this;
	
	//cargamos el XML
	new Ajax.Request(
		pathXML,
		{
			method: 'get',
			onSuccess: function(req){

				tbThis.xmlToolbar = req.responseXML;
				var elemToolbar = tbThis.xmlToolbar.firstChild;

				//creamos la barra de herramientas
				var toolbar = $TAG('table');
				toolbar.id = 'toolbar';
				toolbar.setAttribute('cellpadding', 0);
				toolbar.setAttribute('cellspacing', 0);
				toolbar.style.display = 'none';
				toolbar.style.width = elemToolbar.getAttribute('width') ? elemToolbar.getAttribute('width') + 'px' : tbThis.width;
				toolbar.style.height = elemToolbar.getAttribute('height') ? elemToolbar.getAttribute('height') + 'px' : tbThis.height;
				
				//insertamos fila
				var tr = $TAG('tr');
				toolbar.appendChild(tr);

				var elem = null;
				var objFunc = null;
				var obj = null;
				
				//recorremos los controles definidos en el XML
				for(var i = 0; i < elemToolbar.childNodes.length; i++){
					elem = elemToolbar.childNodes[i];
					objFunc = eval('poolerTb' + elem.nodeName);
					obj = new objFunc(elem, tbThis);
					tbThis.items.push(obj); //agregamos control
					tr.appendChild(obj.td); //agregamos celda
				}
				
				//última celda, nombre de la barra de herramientas
				var td = $TAG('td');
				td.align = 'right';
				td.className = 'toolbarname';
				td.innerHTML = elemToolbar.getAttribute('name');
				tbThis.tdname = td;
				tr.appendChild(td); //agregamos celda name
				
				//insertamos la barra de herramientas
				tbThis.toolbar = toolbar;
				$(tbThis.idTag).appendChild(toolbar);
				
				if(showBar) tbThis.showBar();
				
			},
			onFailure: function(){alert('Ocurrio un error')}
		}
	);
}

/**
 * Muestra la barra de herramientas y llama al evento onShow.
 *
 * @access public
 */
poolerToolBar.prototype.showBar = function(){
	if(this.toolbar){
		this.toolbar.style.display = '';
		this.onShow();
	}
}

/**
 * Evento onClick de la barra de herramientas. Se llamará a esta función
 * cada vez que se pulse algún botón, pasándole como parámetro el id del botón.
 *
 * @access public
 * @param Function func
 */
poolerToolBar.prototype.setOnClickHandler = function(func){
	if(typeof(func) == 'function')
		this.onClick = func;
	else
		this.onClick = eval(func);
}

/**
 * El evento onShow saltará cuando se muestre la barra de herramientas.
 *
 * @access public
 * @param Function func
 */
poolerToolBar.prototype.setOnShowHandler = function(func){
	if(typeof(func) == 'function')
		this.onShow = func;
	else
		this.onShow = eval(func);
}

/**
 * Dará texto a la barra de herramientas.
 *
 * @access public
 * @param string text
 */
poolerToolBar.prototype.setText = function(html){
	this.tdname.innerHTML = html;
}

/**********************************************************************/

/**
 * Constructor de la clase poolerTbImageButton. Creará un objeto ImageButton
 * para la barra de herramientas.
 *
 * @access public
 * @param Element elemTag (Elemento ImageButton del XML)
 * @param poolerToolBar oToolbar
 * @return poolerTbImageButton
 */
poolerTbImageButton = function(elemTag, oToolbar){
	/**
	 * URL de la imagen del botón
	 *
	 * @var string
	 * @access private
	 */
	this.imgEnable = elemTag.getAttribute('src');
	
	/**
	 * URL de la imagen disabled
	 *
	 * @var string
	 * @access private
	 */
	this.imgDisable = elemTag.getAttribute('disableImage') || '';
	
	/**
	 * Indica si la imagen está o no deshabilitada
	 *
	 * @var boolean
	 * @access private
	 */
	this.disabled = (elemTag.getAttribute('disable') == 'true');
	
	/**
	 * Contiene la celda donde se coloca el botón
	 *
	 * @var HTML (TD)
	 * @access private
	 */
	this.td = $TAG('td');
	this.td.className = this.disabled ? 'icongray' : 'tbbutton';
	this.td.width = elemTag.getAttribute('width') || '25';
	this.td.height = elemTag.getAttribute('height') || '25';
	this.td.align = 'center';
	
	//creamos la imagen
	var img = $TAG('img');
	img.id = elemTag.getAttribute('id');
	img.src = this.disabled ? this.imgDisable : this.imgEnable;
	img.title = elemTag.getAttribute('tooltip') || '';
	
	var objThis = this;
	
	//asignamos eventos
	img.onmouseover = function(){if(!objThis.disabled) objThis.td.className = 'tbbuttonover'};
	img.onmouseout = function(){if(!objThis.disabled) objThis.td.className = 'tbbutton'};
	img.onmousedown = function(){if(!objThis.disabled) objThis.td.className = 'tbbuttondown'};
	img.onmouseup = function(){if(!objThis.disabled) objThis.td.className = 'tbbutton'};
	img.onclick = function(){if(!objThis.disabled) oToolbar.onClick(img.id)};
	
	this.td.appendChild(img); //añadimos imagen
}

/**********************************************************************/

/**
 * Constructor de la clase poolerTbSelectButton. Creará un objeto SelectButton
 * para la barra de herramientas.
 *
 * @access public
 * @param Element elemTag (Elemento SelectButton del XML)
 * @param poolerToolBar oToolbar
 * @return poolerTbSelectButton
 */
poolerTbSelectButton = function(elemTag, oToolbar){
	/**
	 * Contiene la celda donde se coloca el control select
	 *
	 * @var HTML (TD)
	 * @access private
	 */
	this.td = $TAG('td');
	
	//objeto select
	var select = $TAG('select');
	select.id = elemTag.getAttribute('id');
	if(elemTag.getAttribute('width')){
		this.td.style.width = elemTag.getAttribute('width');
		select.style.width = elemTag.getAttribute('width');
	}
	if(elemTag.getAttribute('height'))
		select.style.height = elemTag.getAttribute('height');
	
	//elementos option
	var option = null;
	for(var i = 0; i < elemTag.childNodes.length; i++){
		option = elemTag.childNodes[i];
		select.options[select.options.length] = new Option(option.firstChild.nodeValue, option.getAttribute('value'));
	}
	
	select.onchange = function(){oToolbar.onClick(select.id, select.value)}
	
	this.td.appendChild(select); //añadimos select
}

/**
 * Devolverá el valor del la opción actualmente seleccionada.
 *
 * @access public
 * @return string
 */
poolerTbSelectButton.prototype.getOptionValue = function(){
	var select = this.td.firstChild;
	return select.value;
}

/**
 * Seleccionará el valor establecido.
 *
 * @access public
 * @param string value
 */
poolerTbSelectButton.prototype.setSelected = function(value){
	var select = this.td.firstChild;
	select.value = value;
}

/**********************************************************************/

/**
 * Constructor de la clase poolerTbInputText. Creará un objeto InputText
 * para la barra de herramientas.
 *
 * @access public
 * @param Element elemTag (Elemento InputText del XML)
 * @param poolerToolBar oToolbar
 * @return poolerTbInputText
 */
poolerTbInputText = function(elemTag, oToolbar){
	/**
	 * Contiene la celda donde se coloca el control text
	 *
	 * @var HTML (TD)
	 * @access private
	 */
	this.td = $TAG('td');
	
	//objeto input
	var input = $TAG('input');
	input.type = 'text';
	input.id = elemTag.getAttribute('id');
	if(elemTag.getAttribute('width')){
		this.td.style.width = elemTag.getAttribute('width');
		input.style.width = elemTag.getAttribute('width');
	}
	if(elemTag.getAttribute('height'))
		input.style.height = elemTag.getAttribute('height');
	
	input.value = elemTag.firstChild ? elemTag.firstChild.nodeValue : '';
	
	this.td.appendChild(input); //añadimos input
}

/**
 * Devolverá el valor del introducido en el cuadro de texto.
 *
 * @access public
 * @return string
 */
poolerTbInputText.prototype.getValue = function(){
	var input = this.td.firstChild;
	return input.value;
}

/**
 * Limpiará el cuadro de texto.
 *
 * @access public
 */
poolerTbInputText.prototype.clearField = function(){
	var input = this.td.firstChild;
	input.value = '';
}

/**********************************************************************/

/**
 * Constructor de la clase poolerTbdivider. Creará un objeto divider
 * encargado de dividir secciones.
 *
 * @access public
 * @param Element elemTag (Elemento divider del XML)
 * @return poolerTbdivider
 */
poolerTbdivider = function(elemTag){
	/**
	 * Contiene la celda donde se coloca el objeto
	 *
	 * @var HTML (TD)
	 * @access private
	 */
	this.td = $TAG('td');
	this.td.width = '1';
	this.td.innerHTML = '<div class="tbdivider"></div >';
}