/**
 * Class poolerToolBar.class.js
 * Con esta clase simularemos una barra de herramientas al estilo
 * dhtmlXtoolbar by Scand LLC (http://www.scbr.com), pero para
 * las necesidades de esta aplicación (por lo tanto no es generica),
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
 * @return clsToolBar
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

poolerTbImageButton = function(elemTag, toolbar){
	this.imgEnable = elemTag.getAttribute('src');
	this.imgDisable = elemTag.getAttribute('disableImage') || '';
	this.disabled = (elemTag.getAttribute('disable') == 'true');
	
	this.td = $TAG('td');
	this.td.className = this.disabled ? 'icongray' : 'tbbutton';
	this.td.width = elemTag.getAttribute('width') || '25';
	this.td.height = elemTag.getAttribute('height') || '25';
	this.td.align = 'center';
	
	var img = $TAG('img');
	img.id = elemTag.getAttribute('id');
	img.src = this.disabled ? this.imgDisable : this.imgEnable;
	img.title = elemTag.getAttribute('tooltip') || '';
	
	var objThis = this;
	img.onmouseover = function(){objThis.td.className = 'tbbuttonover'};
	img.onmouseout = function(){objThis.td.className = 'tbbutton'};
	img.onmousedown = function(){objThis.td.className = 'tbbuttondown'};
	img.onmouseup = function(){objThis.td.className = 'tbbutton'};
	img.onclick = function(){toolbar.onClick(img.id)};
	
	this.td.appendChild(img);
}

/**********************************************************************/

poolerTbSelectButton = function(elemTag, toolbar){
	this.td = $TAG('td');
}

/**********************************************************************/

poolerTbInputText = function(elemTag, toolbar){
	this.td = $TAG('td');
}

/**********************************************************************/

poolerTbdivider = function(elemTag, toolbar){
	this.td = $TAG('td');
	this.td.width = '1';
	this.td.innerHTML = '<div class="tbdivider"></div >';
}