function xmlLoaderObject(funcObject,dhtmlObject,async){
 this.xmlDoc="";
 if(arguments.length==2)
 this.async=true;
 else
 this.async=async;
 this.onloadAction=funcObject||null;
 this.mainObject=dhtmlObject||null;
 return this;
};
 
 xmlLoaderObject.prototype.waitLoadFunction=function(dhtmlObject){
 this.check=function(){
 if(dhtmlObject.onloadAction!=null){
 if(!dhtmlObject.xmlDoc.readyState)dhtmlObject.onloadAction(dhtmlObject.mainObject);
 else{
 if(dhtmlObject.xmlDoc.readyState != 4)return false;
 else dhtmlObject.onloadAction(dhtmlObject.mainObject,null,null,null,dhtmlObject);}
}
};
 return this.check;
};
 
 
 xmlLoaderObject.prototype.getXMLTopNode=function(tagName){
 if(this.xmlDoc.responseXML){var temp=this.xmlDoc.responseXML.getElementsByTagName(tagName);var z=temp[0];}
 else var z=this.xmlDoc.documentElement;
 if(z)return z;
 uiError.throwError("XML","Error de parse XML",[this.xmlDoc])
 return document.createElement("DIV");
};
 
 
 xmlLoaderObject.prototype.loadXMLString=function(xmlString){
 try
{
 var parser = new DOMParser();
 this.xmlDoc = parser.parseFromString(xmlString,"text/xml");
}
 catch(e){
 this.xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
 this.xmlDoc.async=this.async
 this.xmlDoc.loadXML(xmlString);
}
 this.onloadAction(this.mainObject);
}
 
 xmlLoaderObject.prototype.loadXML=function(filePath){
 try
{
 this.xmlDoc = new XMLHttpRequest();
 this.xmlDoc.open("GET",filePath,this.async);
 this.xmlDoc.onreadystatechange=new this.waitLoadFunction(this);
 this.xmlDoc.send(null);
}
 catch(e){

 if(document.implementation && document.implementation.createDocument)
{
 this.xmlDoc = document.implementation.createDocument("","",null);
 this.xmlDoc.onload = new this.waitLoadFunction(this);
}
 else
{
 this.xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
 this.xmlDoc.async=this.async
 this.xmlDoc.onreadystatechange=new this.waitLoadFunction(this);
}
 this.xmlDoc.load(filePath);
}
};
 
 xmlLoaderObject.prototype.destructor=function(){
 this.onloadAction=null;
 this.mainObject=null;
 this.xmlDoc=null;
 return null;
}
 
 
function callerFunction(funcObject,dhtmlObject){
 this.handler=function(e){
 if(!e)e=event;
 funcObject(e,dhtmlObject);
 return true;
};
 return this.handler;
};

 
function getAbsoluteLeft(htmlObject){
 var xPos = htmlObject.offsetLeft;
 var temp = htmlObject.offsetParent;
 while(temp != null){
 xPos+= temp.offsetLeft;
 temp = temp.offsetParent;
}
 return xPos;
}
 
function getAbsoluteTop(htmlObject){
 var yPos = htmlObject.offsetTop;
 var temp = htmlObject.offsetParent;
 while(temp != null){
 yPos+= temp.offsetTop;
 temp = temp.offsetParent;
}
 return yPos;
}
 
 
 
function convertStringToBoolean(inputString){if(typeof(inputString)=="string")inputString=inputString.toLowerCase();
 switch(inputString){
 case "1":
 case "true":
 case "yes":
 case "y":
 case 1: 
 case true: 
 return true;
 break;
 default: return false;
}
}

 
function getUrlSymbol(str){
 if(str.indexOf("?")!=-1)
 return "&"
 else
 return "?"
}
 
 
function dhtmlDragAndDropObject(){
 this.lastLanding=0;
 this.dragNode=0;
 this.dragStartNode=0;
 this.dragStartObject=0;
 this.tempDOMU=null;
 this.tempDOMM=null;
 this.waitDrag=0;
 if(window.dhtmlDragAndDrop)return window.dhtmlDragAndDrop;
 window.dhtmlDragAndDrop=this;

 return this;
};
 
 dhtmlDragAndDropObject.prototype.removeDraggableItem=function(htmlNode){
 htmlNode.onmousedown=null;
 htmlNode.dragStarter=null;
 htmlNode.dragLanding=null;
}
 dhtmlDragAndDropObject.prototype.addDraggableItem=function(htmlNode,dhtmlObject){
 htmlNode.onmousedown=this.preCreateDragCopy;
 htmlNode.dragStarter=dhtmlObject;
 this.addDragLanding(htmlNode,dhtmlObject);
}
 dhtmlDragAndDropObject.prototype.addDragLanding=function(htmlNode,dhtmlObject){
 htmlNode.dragLanding=dhtmlObject;
}
 dhtmlDragAndDropObject.prototype.preCreateDragCopy=function(e)
{
 if(window.dhtmlDragAndDrop.waitDrag){
 window.dhtmlDragAndDrop.waitDrag=0;
 document.body.onmouseup=window.dhtmlDragAndDrop.tempDOMU;
 document.body.onmousemove=window.dhtmlDragAndDrop.tempDOMM;
 return false;
}

 window.dhtmlDragAndDrop.waitDrag=1;
 window.dhtmlDragAndDrop.tempDOMU=document.body.onmouseup;
 window.dhtmlDragAndDrop.tempDOMM=document.body.onmousemove;
 window.dhtmlDragAndDrop.dragStartNode=this;
 window.dhtmlDragAndDrop.dragStartObject=this.dragStarter;
 document.body.onmouseup=window.dhtmlDragAndDrop.preCreateDragCopy;
 document.body.onmousemove=window.dhtmlDragAndDrop.callDrag;

 if((e)&&(e.preventDefault)){e.preventDefault();return false;}
 return false;
};
 dhtmlDragAndDropObject.prototype.callDrag=function(e){
 if(!e)e=window.event;
 dragger=window.dhtmlDragAndDrop;

 if((e.button==0)&&(isIE()))return dragger.stopDrag();
 if(!dragger.dragNode){
 dragger.dragNode=dragger.dragStartObject._createDragNode(dragger.dragStartNode,e);
 if(!dragger.dragNode)return dragger.stopDrag();
 dragger.gldragNode=dragger.dragNode;
 document.body.appendChild(dragger.dragNode);
 document.body.onmouseup=dragger.stopDrag;
 dragger.waitDrag=0;
 dragger.dragNode.pWindow=window;
 dragger.initFrameRoute();
}


 if(dragger.dragNode.parentNode!=window.document.body){
 var grd=dragger.gldragNode;
 if(dragger.gldragNode.old)grd=dragger.gldragNode.old;

 
 grd.parentNode.removeChild(grd);
 var oldBody=dragger.dragNode.pWindow;
 if(isIE()){
 var div=document.createElement("Div");
 div.innerHTML=dragger.dragNode.outerHTML;
 dragger.dragNode=div.childNodes[0];}
 else dragger.dragNode=dragger.dragNode.cloneNode(true);
 dragger.dragNode.pWindow=window;
 dragger.gldragNode.old=dragger.dragNode;
 document.body.appendChild(dragger.dragNode);
 oldBody.dhtmlDragAndDrop.dragNode=dragger.dragNode;
}
 dragger.dragNode.style.left=e.clientX+15+(dragger.fx?dragger.fx*(-1):0)+document.body.scrollLeft+"px";
 dragger.dragNode.style.top=e.clientY+3+(dragger.fy?dragger.fy*(-1):0)+document.body.scrollTop+"px";
 if(!e.srcElement)var z=e.target;else z=e.srcElement;
 dragger.checkLanding(z,e.clientX,e.clientY);
}
 
 dhtmlDragAndDropObject.prototype.calculateFramePosition=function(n){
 
 if(window.name){
 var el =parent.frames[window.name].frameElement.offsetParent;
 var fx=0;
 var fy=0;
 while(el){fx+= el.offsetLeft;fy+= el.offsetTop;el = el.offsetParent;}
 if((parent.dhtmlDragAndDrop)){var ls=parent.dhtmlDragAndDrop.calculateFramePosition(1);fx+=ls.split('_')[0]*1;fy+=ls.split('_')[1]*1;}
 if(n)return fx+"_"+fy;
 else this.fx=fx;this.fy=fy;
}
 return "0_0";
}
 dhtmlDragAndDropObject.prototype.checkLanding=function(htmlObject,x,y){

 if((htmlObject)&&(htmlObject.dragLanding)){if(this.lastLanding)this.lastLanding.dragLanding._dragOut(this.lastLanding);
 this.lastLanding=htmlObject;this.lastLanding=this.lastLanding.dragLanding._dragIn(this.lastLanding,this.dragStartNode,x,y);}
 else{
 if((htmlObject)&&(htmlObject.tagName!="BODY"))this.checkLanding(htmlObject.parentNode,x,y);
 else{if(this.lastLanding)this.lastLanding.dragLanding._dragOut(this.lastLanding,x,y);this.lastLanding=0;}
}
}
 dhtmlDragAndDropObject.prototype.stopDrag=function(e,mode){
 dragger=window.dhtmlDragAndDrop;
 if(!mode)
{
 dragger.stopFrameRoute();
 var temp=dragger.lastLanding;
 dragger.lastLanding=null;
 if(temp)temp.dragLanding._drag(dragger.dragStartNode,dragger.dragStartObject,temp);
}
 dragger.lastLanding=null;
 if((dragger.dragNode)&&(dragger.dragNode.parentNode==document.body))dragger.dragNode.parentNode.removeChild(dragger.dragNode);
 dragger.dragNode=0;
 dragger.gldragNode=0;
 dragger.fx=0;
 dragger.fy=0;
 dragger.dragStartNode=0;
 dragger.dragStartObject=0;
 document.body.onmouseup=dragger.tempDOMU;
 document.body.onmousemove=dragger.tempDOMM;
 dragger.tempDOMU=null;
 dragger.tempDOMM=null;
 dragger.waitDrag=0;
}
 
 dhtmlDragAndDropObject.prototype.stopFrameRoute=function(win){
 if(win)
 window.dhtmlDragAndDrop.stopDrag(1,1);
 
 for(var i=0;i<window.frames.length;i++)
 if((window.frames[i]!=win)&&(window.frames[i].dhtmlDragAndDrop))
 window.frames[i].dhtmlDragAndDrop.stopFrameRoute(window);
 if((parent.dhtmlDragAndDrop)&&(parent!=window)&&(parent!=win))
 parent.dhtmlDragAndDrop.stopFrameRoute(window);
}
 dhtmlDragAndDropObject.prototype.initFrameRoute=function(win,mode){
 if(win){


 window.dhtmlDragAndDrop.preCreateDragCopy();
 window.dhtmlDragAndDrop.dragStartNode=win.dhtmlDragAndDrop.dragStartNode;
 window.dhtmlDragAndDrop.dragStartObject=win.dhtmlDragAndDrop.dragStartObject;
 window.dhtmlDragAndDrop.dragNode=win.dhtmlDragAndDrop.dragNode;
 window.dhtmlDragAndDrop.gldragNode=win.dhtmlDragAndDrop.dragNode;
 window.document.body.onmouseup=window.dhtmlDragAndDrop.stopDrag;
 window.waitDrag=0;
 if(((!_isIE)&&(mode))&&((!_isFF)||(_FFrv<1.8)))
 window.dhtmlDragAndDrop.calculateFramePosition();
}
 if((parent.dhtmlDragAndDrop)&&(parent!=window)&&(parent!=win))
 parent.dhtmlDragAndDrop.initFrameRoute(window);
 for(var i=0;i<window.frames.length;i++)
 if((window.frames[i]!=win)&&(window.frames[i].dhtmlDragAndDrop))
 window.frames[i].dhtmlDragAndDrop.initFrameRoute(window,((!win||mode)?1:0));

}

var _isFF=false;var _isIE=false;var _isOpera=false;var _isKHTML=false;var _isMacOS=false;

if(navigator.userAgent.indexOf('Macintosh')!= -1)_isMacOS=true;
if((navigator.userAgent.indexOf('Safari')!= -1)||(navigator.userAgent.indexOf('Konqueror')!= -1))
 _isKHTML=true;
else if(navigator.userAgent.indexOf('Opera')!= -1)
 _isOpera=true;
else if(navigator.appName.indexOf("Microsoft")!=-1)
 _isIE=true;
else{
 _isFF=true;
 var _FFrv=parseFloat(navigator.userAgent.split("rv:")[1])
}

 
 
function isIE(){
 if(navigator.appName.indexOf("Microsoft")!=-1)
 if(navigator.userAgent.indexOf('Opera')== -1)
 return true;
 return false;
}

 
xmlLoaderObject.prototype.doXPath = function(xpathExp,docObj){
 if((_isOpera)||(_isKHTML))return this.doXPathOpera(xpathExp,docObj);
 if(isIE()){
 if(arguments.length==1){
 docObj = this.xmlDoc
}
 return docObj.selectNodes(xpathExp);
}else{
 var nodeObj = docObj;
 if(!docObj){
 if(!this.xmlDoc.nodeName){
 docObj = this.xmlDoc.responseXML
}else{
 docObj = this.xmlDoc;
}
}
 if(docObj.nodeName.indexOf("document")!=-1){
 nodeObj = docObj;
}else{
 nodeObj = docObj;
 docObj = docObj.ownerDocument;

}
 var rowsCol = new Array();
 var col = docObj.evaluate(xpathExp,nodeObj,null,XPathResult.ANY_TYPE,null);
 var thisColMemb = col.iterateNext();
 while(thisColMemb){
 rowsCol[rowsCol.length] = thisColMemb;
 thisColMemb = col.iterateNext();
}
 return rowsCol;
}
}

if((window.Node)&&(!_isKHTML))
Node.prototype.removeNode = function(removeChildren)
{
 var self = this;
 if(Boolean(removeChildren))
{
 return this.parentNode.removeChild(self);
}
 else
{
 var range = document.createRange();
 range.selectNodeContents(self);
 return this.parentNode.replaceChild(range.extractContents(),self);
}
}

function _uiError(type,name,params){
 if(!this.catches)
 this.catches=new Array();

 return this;
}

_uiError.prototype.catchError=function(type,func_name){
 this.catches[type]=func_name;
}
_uiError.prototype.throwError=function(type,name,params){
 if(this.catches[type])return this.catches[type](type,name,params);
 if(this.catches["ALL"])return this.catches["ALL"](type,name,params);
 alert("Tipo de Error: "+arguments[0]+"\nDescripcion: "+arguments[1]);
 return null;
}

window.uiError=new _uiError();


 
 
xmlLoaderObject.prototype.doXPathOpera = function(xpathExp,docObj){
 
 var z=xpathExp.replace(/[\/]+/gi,"/").split('/');
 var obj=null;
 var i=1;

 if(!z.length)return [];
 if(z[0]==".")
 obj=[docObj];
 else if(z[0]=="")
{
 obj=this.xmlDoc.responseXML.getElementsByTagName(z[i].replace(/\[[^\]]*\]/g,""));
 i++;
}
 else return [];

 for(i;i<z.length;i++)
 obj=this._getAllNamedChilds(obj,z[i]);

 if(z[i-1].indexOf("[")!=-1)
 obj=this._filterXPath(obj,z[i-1]);
 return obj;
}

xmlLoaderObject.prototype._filterXPath = function(a,b){
 var c=new Array();
 var b=b.replace(/[^\[]*\[\@/g,"").replace(/[\[\]\@]*/g,"");
 for(var i=0;i<a.length;i++)
 if(a[i].getAttribute(b))
 c[c.length]=a[i];

 return c;
}
xmlLoaderObject.prototype._getAllNamedChilds = function(a,b){
 var c=new Array();
 for(var i=0;i<a.length;i++)
 for(var j=0;j<a[i].childNodes.length;j++)
 if(a[i].childNodes[j].tagName==b)c[c.length]=a[i].childNodes[j];

 return c;
}



var globalActiveDHTMLGridObject;
String.prototype._dhx_trim = function(){
 return this.replace(/&nbsp;/g," ").replace(/(^[ \t]*)|([ \t]*$)/g,"");
}

Array.prototype._dhx_find = function(pattern){
 for(var i=0;i<this.length;i++){
 if(pattern==this[i])
 return i;
}
 return -1;
}
Array.prototype._dhx_delAt = function(ind){
 if(Number(ind)<0 || this.length==0)
 return false;
 for(var i=ind;i<this.length;i++){
 this[i]=this[i+1];
}
 this.length--;
}
Array.prototype._dhx_insertAt = function(ind,value){
 this[this.length] = null;
 for(var i=this.length-1;i>=ind;i--){
 this[i] = this[i-1]
}
 this[ind] = value
}
Array.prototype._dhx_removeAt = function(ind){
 for(var i=ind;i<this.length;i++){
 this[i] = this[i+1]
}
 this.length--;
}
 
Array.prototype._dhx_swapItems = function(ind1,ind2){
 var tmp = this[ind1];
 this[ind1] = this[ind2]
 this[ind2] = tmp;
}

 
function uiGridObject(id){
 if(id){
 if(typeof(id)=='object'){
 this.entBox = id
 this.entBox.id = "cgrid2_"+(new Date()).getTime();
}else
 this.entBox = document.getElementById(id);
}else{
 this.entBox = document.createElement("DIV");
 this.entBox.id = "cgrid2_"+(new Date()).getTime();
}
 var self = this;
 this.nm = this.entBox.nm || "grid";
 this.cell = null;
 this.row = null;
 this.editor=null;
 this.combos=new Array(0);
 this.defVal=new Array(0);
 this.rowsAr = new Array(0);
 this.rowsCol = new Array(0);
 this.selectedRows = new Array(0);
 this.rowsBuffer = new Array(new Array(0),new Array(0));
 this.loadedKidsHash = null;
 this.UserData = new Array(0)
 
 
 this.styleSheet = document.styleSheets;
 this.entBox.className = "gridbox";
 this.entBox.style.width = this.entBox.getAttribute("width")||(window.getComputedStyle?window.getComputedStyle(this.entBox,null)["width"]:(this.entBox.currentStyle?this.entBox.currentStyle["width"]:0))|| "100%";
 this.entBox.style.height = this.entBox.getAttribute("height")||(window.getComputedStyle?window.getComputedStyle(this.entBox,null)["height"]:(this.entBox.currentStyle?this.entBox.currentStyle["height"]:0))|| "100%";
 
 this.entBox.style.cursor = 'default';
 this.entBox.onselectstart = function(){return false};
 this.obj = document.createElement("TABLE");
 this.obj.cellSpacing = 0;
 this.obj.cellPadding = 0;
 this.obj.style.width = "100%";
 this.obj.style.tableLayout = "fixed";
 this.obj.className = "obj";
 
 this.hdr = document.createElement("TABLE");
 this.hdr.style.border="1px solid gray";
 this.hdr.cellSpacing = 0;
 this.hdr.cellPadding = 0;
 if(!_isOpera)
 this.hdr.style.tableLayout = "fixed";
 this.hdr.className = "hdr";
 this.hdr.width = "100%";
 this.xHdr = document.createElement("TABLE");
 this.xHdr.cellPadding = 0;
 this.xHdr.cellSpacing = 0;
 var r = this.xHdr.insertRow(0)
 var c = r.insertCell(0);
 r.insertCell(1).innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
 c.appendChild(this.hdr)
 this.objBuf = document.createElement("DIV");
 this.objBuf.style.borderBottom = "1px solid white"
 this.objBuf.appendChild(this.obj);
 this.entCnt = document.createElement("TABLE");
 this.entCnt.insertRow(0).insertCell(0)
 this.entCnt.insertRow(1).insertCell(0);
 this.entCnt.cellPadding = 0;
 this.entCnt.cellSpacing = 0;
 this.entCnt.width = "100%";
 this.entCnt.height = "100%";
 this.entCnt.style.tableLayout = "fixed";
 this.objBox = document.createElement("DIV");
 this.objBox.style.width = "100%";
 this.objBox.style.height = this.entBox.style.height;
 this.objBox.style.overflow = "auto";
 this.objBox.style.position = "relative";
 this.objBox.appendChild(this.objBuf);
 this.objBox.className = "objbox";

 this.hdrBox = document.createElement("DIV");
 this.hdrBox.style.width = "100%"
 if((_isOpera)||((_isMacOS)&&(_isFF)))this.hdrSizeA=25;else this.hdrSizeA=100;

 this.hdrBox.style.height=this.hdrSizeA+"px";
 this.hdrBox.style.overflow =((_isOpera)||((_isMacOS)&&(_isFF)))?"hidden":"auto";
 this.hdrBox.style.position = "relative";
 this.hdrBox.appendChild(this.xHdr);
 this.sortImg = document.createElement("IMG")
 this.hdrBox.insertBefore(this.sortImg,this.xHdr)
 this.entCnt.rows[0].cells[0].appendChild(this.hdrBox);
 this.entCnt.rows[1].cells[0].appendChild(this.objBox);
 
 this.entBox.appendChild(this.entCnt);
 
 this.entBox.grid = this;
 this.objBox.grid = this;
 this.hdrBox.grid = this;
 this.obj.grid = this;
 this.hdr.grid = this;
 
 this.cellWidthPX = new Array(0);
 this.cellWidthPC = new Array(0);
 this.cellWidthType = this.entBox.cellwidthtype || "px";
 
 this.delim = this.entBox.delimiter || ",";
 this.hdrLabels =(this.entBox.hdrlabels || "").split(",");
 this.columnIds =(this.entBox.columnids || "").split(",");
 this.columnColor =(this.entBox.columncolor || "").split(",");
 this.cellType =(this.entBox.cellstype || "").split(",");
 this.cellAlign =(this.entBox.cellsalign || "").split(",");
 this.initCellWidth =(this.entBox.cellswidth || "").split(",");
 this.fldSort =(this.entBox.fieldstosort || "").split(",")
 this.imgURL = this.entBox.imagesurl || "gridCfx/";
 this.isActive = false;
 this.isEditable = true;
 this.raNoState = this.entBox.ranostate || "N";
 this.chNoState = this.entBox.chnostate || "N";
 this.selBasedOn =(this.entBox.selbasedon || "cell").toLowerCase()
 this.selMultiRows = this.entBox.selmultirows || false;
 this.multiLine = this.entBox.multiline || false;
 this.noHeader = this.entBox.noheader || false;
 this.dynScroll = this.entBox.dynscroll || false;
 this.dynScrollPageSize = 0;
 this.dynScrollPos = 0;
 this.xmlFileUrl = this.entBox.xmlfileurl || "";
 this.recordsNoMore = this.entBox.infinitloading || true;;
 
 this.onEndLoad = function(){};
 this.rowsBufferOutSize = 0;
 
 if(this.entBox.oncheckbox)
 this.onCheckbox = eval(this.entBox.oncheckbox);
 this.onEditCell = this.entBox.oneditcell || "void";
 this.onRowSelect = this.entBox.onrowselect || "void";
 this.onEnter = this.entBox.onenter || "void";
 
 
 this.loadXML = function(url){
 if(url.indexOf("?")!=-1)
 var s = "&";
 else
 var s = "?";
 this.xmlLoader.loadXML(url+""+s+"rowsLoaded="+this.getRowsNum()+"&lastid="+this.getRowId(this.getRowsNum()-1)+"&sn="+Date.parse(new Date()));
}
 
 this.loadXMLString = function(str){
 this.xmlLoader.loadXMLString(str);
}
 
 this.doLoadDetails = function(obj){
 var root = self.xmlLoader.getXMLTopNode("rows")
 if(root.tagName!="DIV")
 if(!self.xmlLoader.xmlDoc.nodeName){
 self.parseXML(self.xmlLoader.xmlDoc.responseXML);
 self.onEndLoad();
}else{
 self.parseXML(self.xmlLoader.xmlDoc);
}
}
 this.xmlLoader = new xmlLoaderObject(this.doLoadDetails,window);
 this.dragger=new dhtmlDragAndDropObject();

 
 
 this.doOnScroll = function(){
 this.hdrBox.scrollLeft = this.objBox.scrollLeft;
 this.setSortImgPos()
 if(this.objBox.scrollTop+this.hdrSizeA+this.objBox.offsetHeight>this.objBox.scrollHeight){
 if(this._xml_ready && this.addRowsFromBuffer())
 this.objBox.scrollTop = this.objBox.scrollHeight -(this.hdrSizeA+1+this.objBox.offsetHeight)
}
}
 
 this.attachToObject = function(obj){
 obj.appendChild(this.entBox)
 
}
 
 this.init = function(fl){
 
 this.editStop()
 
 this.lastClicked = null;
 this.resized = null;
 this.fldSorted = null;
 this.gridWidth = 0;
 this.gridHeight = 0;
 
 this.cellWidthPX = new Array(0);
 this.cellWidthPC = new Array(0);
 if(this.hdr.rows.length>0){
 this.clearAll();
 this.hdr.rows[0].removeNode(true);
}
 if(this.cellType._dhx_find("tree")!=-1){
 this.loadedKidsHash = new Hashtable();
 this.loadedKidsHash.put("hashOfParents",new Hashtable())
}
 var hdrRow = this.hdr.insertRow(0);
 for(var i=0;i<this.hdrLabels.length;i++){
 var c=hdrRow.insertCell(i);
 c.innerHTML = this.hdrLabels[i];
 c._cellIndex=i;
}
 this.setColumnIds()
 if(this.multiLine==-1)
 this.multiLine = true;
 else
 this.multiLine = false;
 
 
 
 this.sortImg.style.position = "absolute";
 this.sortImg.style.display = "none";
 this.sortImg.src = this.imgURL+"sort_desc.gif";
 this.sortImg.defLeft = 0;
 
 
 this.entCnt.rows[0].style.display = '' 
 
 if(this.noHeader==-1){
 this.noHeader = true
 this.entCnt.rows[0].style.display = 'none';
}else{
 this.noHeader = false
}
 this.setSizes();
 
 
 if(fl)
 this.parseXML()
 this.obj.scrollTop = 0
};
 
 this.setSizes = function(fl){
 if(fl && this.gridWidth==this.entBox.offsetWidth && this.gridHeight==this.entBox.offsetHeight){
 return false
}else if(fl){
 this.gridWidth = this.entBox.offsetWidth
 this.gridHeight = this.entBox.offsetHeight
}

 if(!this.hdrBox.offsetHeight)return;
 this.entCnt.rows[0].cells[0].height = this.hdrBox.offsetHeight+"px";

 var gridWidth = parseInt(this.entBox.offsetWidth);
 var gridHeight = parseInt(this.entBox.offsetHeight);
 if(this.objBox.scrollHeight>this.objBox.offsetHeight)gridWidth-=(this._scrFix||(_isFF?19:16));

 var len = this.hdr.rows[0].cells.length
 for(var i=0;i<this.hdr.rows[0].cells.length;i++){
 if(this.cellWidthType=='px' && this.cellWidthPX.length < len){
 this.cellWidthPX[i] = this.initCellWidth[i];
}else if(this.cellWidthType=='%' && this.cellWidthPC.length < len){
 this.cellWidthPC[i] = this.initCellWidth[i];
}
 if(this.cellWidthPC.length!=0){
 this.cellWidthPX[i] = parseInt(gridWidth*this.cellWidthPC[i]/100)-(_isFF?2:0);
}
}
 this.chngCellWidth(this.rowsCol._dhx_find(this.obj.rows[0]))
 var summ = 0;
 for(var i=0;i<this.cellWidthPX.length;i++)
 summ+= parseInt(this.cellWidthPX[i])
 this.objBuf.style.width = summ+"px";
 this.objBuf.childNodes[0].style.width = summ+"px";
 if(_isOpera)this.hdr.style.width = summ+this.cellWidthPX.length*2+"px";
 
 this.doOnScroll();

 
 
 if(!this.noHeader){
 if((_isMacOS)&&(_isFF))
 var zheight=20;
 else
 var zheight=this.hdr.offsetHeight;
 this.hdr.style.border="0px solid gray";
 this.entCnt.rows[1].cells[0].childNodes[0].style.top =(zheight-this.hdrSizeA+1)+"px";
 this.entCnt.rows[1].cells[0].childNodes[0].style.height =(gridHeight - zheight-1)+"px";
}
};

 
 this.chngCellWidth = function(ind){
 if(!ind)
 var ind = 0;
 for(var i=0;i<this.cellWidthPX.length;i++){
 this.hdr.rows[0].cells[i].style.width = this.cellWidthPX[i]+"px";
 if(this.rowsCol[ind])
 this.rowsCol[ind].cells[i].style.width = this.cellWidthPX[i]+"px";
}
}
 
 this.setDelimiter = function(delim){
 this.delim = delim;
}
 
 this.setInitWidthsP = function(wp){
 this.cellWidthType = "%";
 this.initCellWidth = wp.split(this.delim.replace(/px/gi,""));
}
 
 this.setInitWidths = function(wp){
 this.cellWidthType = "px";
 this.initCellWidth = wp.split(this.delim);
 if(_isFF){
 for(var i=0;i<this.initCellWidth.length;i++)
 this.initCellWidth[i]=parseInt(this.initCellWidth[i])-2;
}
}
 
 
 this.enableMultiline = function(state){
 this.multiLine = state;
}
 
 
 this.enableMultiselect = function(state){
 this.selMultiRows = state;
}
 
 
 this.setImagePath = function(path){
 this.imgURL = path;
}
 
 
 this.changeCursorState = function(ev){
 var el = ev.target||ev.srcElement;
 
 if((el.offsetWidth -(ev.offsetX||(parseInt(this.getPosition(el,this.hdrBox))-ev.layerX)*-1))<10){
   if(el['tagName'] == 'TD')
 	el.style.cursor = "E-resize";
}else
   if(el['tagName'] == 'TD')
    el.style.cursor = "default";
}
 
 this.startColResize = function(ev){
 this.resized = null;
 var el = ev.target||ev.srcElement;
 var x = ev.layerX||ev.x;
 
 var tabW = this.hdr.offsetWidth;
 var startW = parseInt(el.offsetWidth)
 if(el.tagName=="TD" && el.style.cursor!="default"){
 this.entBox.onmousemove = function(e){this.grid.doColResize(e||window.event,el,startW,x,tabW)}
 document.body.onmouseup = new Function("","document.getElementById('"+this.entBox.id+"').grid.stopColResize()");
}
}
 
 this.stopColResize = function(){
 this.entBox.onmousemove = "";
 document.body.onmouseup = "";
 this.setSizes();
 this.doOnScroll()
}
 
 this.doColResize = function(ev,el,startW,x,tabW){
 el.style.cursor = "E-resize";
 this.resized = el;
 var fcolW = startW+((ev.layerX||ev.x)-x);
 var wtabW = tabW+((ev.layerX||ev.x)-x)

 var gridWidth = parseInt(this.entBox.offsetWidth);
 if(this.objBox.scrollHeight>this.objBox.offsetHeight)gridWidth-=(this._scrFix||(_isFF?19:16));

 if(fcolW>10){
 el.style.width = fcolW+"px";
 if(this.rowsCol.length>0)
 
 

 this.rowsCol[this.rowsCol._dhx_find(this.obj.rows[0])].cells[el._cellIndex].style.width = fcolW+"px";
 if(this.cellWidthType=='px'){
 this.cellWidthPX[el._cellIndex]=fcolW;
}else{
 var pcWidth = Math.round(fcolW/gridWidth*100)
 this.cellWidthPC[el._cellIndex]=pcWidth;
}
 this.doOnScroll()
}

 
 this.objBuf.childNodes[0].style.width = "";


}
 
 
 
 
 this.setSortImgPos = function(ind){
 if(!ind)
 var el = this.fldSorted;
 else
 var el = this.hdr.cells[ind];
 if(el!=null){
 var pos = this.getPosition(el,this.hdrBox)
 var wdth = el.offsetWidth;
 this.sortImg.style.left = Number(pos[0]+wdth-13)+"px";
 this.sortImg.defLeft = parseInt(this.sortImg.style.left)
 this.sortImg.style.top = Number(pos[1]+5)+"px";
 this.sortImg.style.display = "inline";
 this.sortImg.style.left = this.sortImg.defLeft+"px";
}
}
 
 this.parseXML = function(xml,startIndex){
 this._xml_ready=true;
 var pid=null;
 var zpid=null;
 if(!xml)
 try{
 var xmlDoc = eval(this.entBox.id+"_xml").XMLDocument;
}catch(er){

 var xmlDoc = this.loadXML(this.xmlFileUrl)
}
 else{
 if(typeof(xml)=="object"){
 var xmlDoc = xml;
}else{
 if(xml.indexOf(".")!=-1){
 if(this.xmlFileUrl=="")
 this.xmlFileUrl = xml
 var xmlDoc = this.loadXML(xml)
 return;

}else
 var xmlDoc = eval(xml).XMLDocument;
}
}

 
 var rowsCol = this.xmlLoader.doXPath("//rows/row",xmlDoc);

 if(rowsCol.length==0){
 this.recordsNoMore = true;
 var pid=0;
}
 else{
 pid=(rowsCol[0].parentNode.getAttribute("parent")||"0");
 zpid=this.getRowById(pid);
 if(zpid)zpid._xml_await=false;
 else pid=0;
 startIndex=this.getRowIndex(pid)+1;
}

 var ar = new Array();
 var idAr = new Array();
 
 var gudCol = this.xmlLoader.doXPath("//rows/userdata",xmlDoc);
 if(gudCol.length>0){
 this.UserData["gridglobaluserdata"] = new Hashtable();
 for(var j=0;j<gudCol.length;j++){
 this.UserData["gridglobaluserdata"].put(gudCol[j].getAttribute("name"),gudCol[j].firstChild?gudCol[j].firstChild.data:"");
}
}
 

 this._innerParse(rowsCol,startIndex,this.cellType._dhx_find("tree"),pid);

 if(zpid)this.expandKids(zpid);

 if(this.dynScroll && this.dynScroll!='false'){
 
 this.doDynScroll()
}

 var oCol = this.xmlLoader.doXPath("//row[@open]",xmlDoc);
 for(var i=0;i<oCol.length;i++)
 this.openItem(oCol[i].getAttribute("id"));


 this.setSizes();
 this._startXMLLoading=false;
}

 this._innerParse=function(rowsCol,startIndex,tree,pId){
 var r=null;

 for(var i=0;i<rowsCol.length;i++){
 if(i<=this.rowsBufferOutSize || this.rowsBufferOutSize==0){
 var rId = rowsCol[i].getAttribute("id")
 var xstyle = rowsCol[i].getAttribute("style");


 
 var udCol = this.xmlLoader.doXPath("./userdata",rowsCol[i]);
 if(udCol.length>0){
 this.UserData[rId] = new Hashtable();
 for(var j=0;j<udCol.length;j++){
 this.UserData[rId].put(udCol[j].getAttribute("name"),udCol[j].firstChild?udCol[j].firstChild.data:"");
}
}

 var cellsCol = this.xmlLoader.doXPath("./cell",rowsCol[i]);
 var strAr = new Array(0);

 for(var j=0;j<cellsCol.length;j++){
 if(j!=tree)
 strAr[strAr.length] = cellsCol[j].firstChild?cellsCol[j].firstChild.data:"";
 else
 strAr[strAr.length] = pId+"^"+(cellsCol[j].firstChild?cellsCol[j].firstChild.data:"")+"^"+(rowsCol[i].getAttribute("xmlkids")?"1":"0")+"^"+(cellsCol[j].getAttribute("image")||"leaf.gif");
}

 this._parsing_=true;
 if(startIndex){
 r = this._addRow(rId,strAr,startIndex)
 startIndex++;
}else{
 r = this._addRow(rId,strAr)
}
 this._parsing_=false;

 
 if(rowsCol[i].getAttribute("selected")==true){
 this.setSelectedRow(rId,false,false,rowsCol[i].getAttribute("call")==true)
}
 
 if(rowsCol[i].getAttribute("expand")=="1"){
 r.expand = "";
}
}else{
 var len = this.rowsBuffer[0].length
 this.rowsBuffer[1][len] = rowsCol[i]
 this.rowsBuffer[0][len] = rowsCol[i].getAttribute("id")
 
}


 if(tree!=-1){
 var rowsCol2 = this.xmlLoader.doXPath("./row",rowsCol[i]);
 if(rowsCol2.length!=0)
 startIndex=this._innerParse(rowsCol2,startIndex,tree,rId);
}

 if(xstyle)this.setRowTextStyle(rId,xstyle);
}
 if((r)&&(this._checkSCL))
 for(var i=0;i<this.hdr.rows[0].cells.length;i++)
 this._checkSCL(r.childNodes[i]);

 return startIndex;
}
 
 this.setActive = function(fl){
 if(arguments.length==0)
 var fl = true;
 if(fl==true){
 
 globalActiveDHTMLGridObject = this;
 this.isActive = true;
}else{
 this.isActive = false;
}
};
 
 this._doClick = function(ev){
 var selMethod = 0;
 var el = this.getFirstParentOfType(_isIE?ev.srcElement:ev.target,"TD");
 var fl = true;
 if(this.selMultiRows!=false){
 if(ev.shiftKey && this.row!=null){
 selMethod = 1;
}
 if(ev.ctrlKey){
 selMethod = 2;
}
 if(!ev.shiftKey)
 this.lastClicked = el.parentNode;
}
 this.doClick(el,fl,selMethod)
};
 
 this.doClick = function(el,fl,selMethod){
 this.setActive(true);
 if(!selMethod)
 selMethod = 0;
 if(this.cell!=null)
 this.cell.className = "";
 if(el.tagName=="TD" && this.rowsCol._dhx_find(this.rowsAr[el.parentNode.idd])!=-1){
 if(selMethod==0){
 this.clearSelection();
}else if(selMethod==1){
 var elRowIndex = this.rowsCol._dhx_find(el.parentNode)
 var lcRowIndex = this.rowsCol._dhx_find(this.lastClicked)
 if(elRowIndex>lcRowIndex){
 var strt = lcRowIndex;
 var end = elRowIndex;
}else{
 var strt = elRowIndex;
 var end = lcRowIndex;
}
 this.clearSelection();
 for(var i=0;i<this.rowsCol.length;i++){
 if(i>=strt && i<=end){
 this.rowsCol[i].className+=" rowselected";
 this.selectedRows[this.selectedRows.length] = this.rowsCol[i]
}
}
 
}else if(selMethod==2){
 if(el.parentNode.className.indexOf("rowselected")!= -1){
 el.parentNode.className=el.parentNode.className.replace("rowselected","");
 this.selectedRows._dhx_removeAt(this.selectedRows._dhx_find(el.parentNode))
 var skipRowSelection = true;
}
}
 this.editStop()
 this.cell = el;
 if(this.row != el.parentNode){
 this.row = el.parentNode;
 if(fl)
 if(typeof(this.onRowSelect)=="string")
 setTimeout(this.onRowSelect+"('"+this.row.idd+"',false);",100)
 else{
 var rid = this.row.idd
 var func = this.onRowSelect
 setTimeout(function(){func(rid,false);},100)
}
}
 if(!skipRowSelection){
 this.row.className+= " rowselected"
 if(this.selectedRows._dhx_find(this.row)==-1)
 this.selectedRows[this.selectedRows.length] = this.row;
}
 if(this.selBasedOn=="cell"){
 if(this.cell.parentNode.className.indexOf("rowselected")!=-1)
 this.cell.className = "cellselected"
}

 if(selMethod!=1)
 this.lastClicked = el.parentNode;
}
 this.isActive = true;
 this.moveToVisible(this.cell)
}
 
 this.selectCell = function(r,cInd,fl,preserve){
 if(!fl)
 fl = false;
 if(typeof(r)!="object")
 r = this.rowsCol[r]
 var c = r.childNodes[cInd];
 if(preserve)
 this.doClick(c,fl,2)
 else
 this.doClick(c,fl)
}
 
 this.moveToVisible = function(cell_obj){
 try{
 var distance = cell_obj.offsetLeft+cell_obj.offsetWidth+20;
 if(distance>(this.objBox.offsetWidth+this.objBox.scrollLeft)){
 var scrollLeft = distance - this.objBox.offsetWidth;
}else if(cell_obj.offsetLeft<this.objBox.scrollLeft){
 var scrollLeft = cell_obj.offsetLeft-5
}
 if(scrollLeft)
 this.objBox.scrollLeft = scrollLeft;
 
 var distance = cell_obj.offsetTop+cell_obj.offsetHeight+20;
 if(distance>(this.objBox.offsetHeight+this.objBox.scrollTop)){
 var scrollTop = distance - this.objBox.offsetHeight;
}else if(cell_obj.offsetTop<this.objBox.scrollTop){
 var scrollTop = cell_obj.offsetTop-5
}
 if(scrollTop)
 this.objBox.scrollTop = scrollTop;
}catch(er){
 
}
}
 
 this.editCell = function(){
 this.editStop();
 if(this.isEditable!=true)
 return false;
 var c = this.cell;
 c.className+=" editable";
 eval("this.editor = new gcell_"+this.cellType[this.cell._cellIndex]+"(c)");
 
 if(this.editor!=null){
 if(typeof(this.onEditCell)=="string"){
 if(eval(this.onEditCell+"(0,'"+this.row.idd+"',"+this.cell._cellIndex+");")!=false){
 this.editor.edit()
 this._Opera_stop=(new Date).valueOf();
 eval(this.onEditCell+"(1,'"+this.row.idd+"',"+this.cell._cellIndex+");")
}else{
 this.editor=null;
}
}else{
 if(this.onEditCell(0,this.row.idd,this.cell._cellIndex)!=false){
 this.editor.edit()
 this.onEditCell(1,this.row.idd,this.cell._cellIndex)
}else{
 this.editor=null;
}
}
}
}
 
 this.editStop = function(){
 if(_isOpera)
 if(this._Opera_stop){
 if((this._Opera_stop*1+250)>(new Date).valueOf())return;
 this._Opera_stop=null;
}
 if(this.editor && this.editor!=null){
 this.cell.className=this.cell.className.replace("editable","");
 this.cell.wasChanged = this.editor.detach();
 if(typeof(this.onEditCell)=="string")
 eval(this.onEditCell+"(2,'"+this.row.idd+"',"+this.cell._cellIndex+");")
 else
 this.onEditCell(2,this.row.idd,this.cell._cellIndex);
}
 this.editor=null;
}
 
 this.doKey = function(ev){
 if(!ev)return true;
 if((globalActiveDHTMLGridObject)&&(this!=globalActiveDHTMLGridObject))
 return globalActiveDHTMLGridObject.doKey(ev);
 if(this.isActive==false){
 
 return false;
}
 try{
 var type = this.cellType[this.cell._cellIndex]
 
 if(ev.keyCode==13 &&(ev.ctrlKey || ev.shiftKey)){
 var rowInd = this.rowsCol._dhx_find(this.row)
 if(window.event.ctrlKey && rowInd!=this.rowsCol.length-1){
 if(this.row.rowIndex==this.obj.rows.length-1 && this.dynScroll && this.dynScroll!='false')
 this.doDynScroll("dn")
 this.selectCell(this.rowsCol[rowInd+1],this.cell._cellIndex,true);
}else if(ev.shiftKey && rowInd!=0){
 if(this.row.rowIndex==0 && this.dynScroll && this.dynScroll!='false')
 this.doDynScroll("up")
 this.selectCell(this.rowsCol[rowInd-1],this.cell._cellIndex,true);
}
 isIE()?ev.returnValue=false:ev.preventDefault();
}
 if(ev.keyCode==13 && !ev.ctrlKey && !ev.shiftKey){
 this.editStop();
 if(typeof(this.onEnter)=="string")
 eval("window."+this.onEnter+"('"+this.row.idd+"',"+this.cell._cellIndex+")")
 else
 this.onEnter(this.row.idd,this.cell._cellIndex);
 isIE()?ev.returnValue=false:ev.preventDefault();
}
 
 if(ev.keyCode==9 && !ev.shiftKey){
 this.editStop();
 var aind=this.cell._cellIndex+1;
 var arow=this.row;
 if(aind==this.row.childNodes.length){
 aind=0;
 arow=this.rowsCol[this.rowsCol._dhx_find(this.row)+1];
 if(!arow){
 aind=this.row.childNodes.length-1;
 return true;}
}
 this.selectCell(arow||this.row,aind);
 this.editCell()
 _isIE?ev.returnValue=false:ev.preventDefault();
}else if(ev.keyCode==9 && ev.shiftKey){
 this.editStop();
 var aind=this.cell._cellIndex-1;
 var arow=this.row;
 if(aind<0)
{
 aind=this.row.childNodes.length-1;
 arow=this.rowsCol[this.rowsCol._dhx_find(this.row)-1];
 if(!arow){aind=0;
 return true;}
}
 this.selectCell(arow||this.row,aind);
 this.editCell()
 _isIE?ev.returnValue=false:ev.preventDefault();
}
 
 if(ev.keyCode==40 || ev.keyCode==38){

 if(this.editor && this.editor.combo){
 if(ev.keyCode==40)this.editor.shiftNext();
 if(ev.keyCode==38)this.editor.shiftPrev();
 return true;
}
 else{
 var rowInd = this.row.rowIndex;
 if(ev.keyCode==38 && rowInd!=0){
 if(this.row.rowIndex==0 && this.dynScroll && this.dynScroll!='false')
 this.doDynScroll("up")
 this.selectCell(this.obj.rows[rowInd-1],this.cell._cellIndex,true);
}else if(ev.keyCode==40 && rowInd!=this.rowsCol.length-1){
 if(this.row.rowIndex==this.obj.rows.length-1 && this.dynScroll && this.dynScroll!='false')
 this.doDynScroll("dn")
 this.selectCell(this.obj.rows[rowInd+1],this.cell._cellIndex,true);
}
}
 isIE()?ev.returnValue=false:ev.preventDefault();
}
 
 if(ev.keyCode==113){
 this.editCell();
 return false;
}
 
 if(ev.keyCode==32){
 var c = this.cell
 eval("var ed = new gcell_"+this.cellType[c._cellIndex]+"(c)");
 
 if(ed.changeState()!=false)
 isIE()?ev.returnValue=false:ev.preventDefault();
}
 
 if(ev.keyCode==27 && this.oe!=false){
 this.editStop();
 isIE()?ev.returnValue=false:ev.preventDefault();
}
 
 if(ev.keyCode==33 || ev.keyCode==34){
 if(ev.keyCode==33)
 this.doDynScroll("up")
 else
 this.doDynScroll("dn")
 isIE()?ev.returnValue=false:ev.preventDefault();
}
 
 if(!this.editor)
{
 if(ev.keyCode==37 && this.cellType._dhx_find("tree")!=-1){
 this.collapseKids(this.row)
 isIE()?ev.returnValue=false:ev.preventDefault();
}
 if(ev.keyCode==39 && this.cellType._dhx_find("tree")!=-1){
 this.expandKids(this.row)
 isIE()?ev.returnValue=false:ev.preventDefault();
}
}
 return true;
}catch(er){return true;}


}
 
 this.getRow = function(cell){
 if(!cell)
 cell = window.event.srcElement;
 if(cell.tagName!='TD')
 cell = cell.parentElement;
 r = cell.parentElement;
 if(this.cellType[cell._cellIndex]=='lk')
 eval(this.onLink+"('"+this.getRowId(r.rowIndex)+"',"+cell._cellIndex+")");
 this.selectCell(r,cell._cellIndex,true)
}
 
 this.selectRow = function(r,fl,preserve){
 if(typeof(r)!='object')
 r = this.rowsCol[r]
 this.selectCell(r,0,fl,preserve)
};
 
 this.sortRows = function(col,type,order){
 
 if(this.cellType._dhx_find("tree")!=-1){
 return this.sortTreeRows(col,type,order)
}
 if(type=='str'){
 this.rowsCol.sort(function(a,b){
 var cA = a.childNodes[col]
 var cB = b.childNodes[col]
 var type = a.grid.cellType[col];
 eval("var edA = new gcell_"+type+"(cA)")
 eval("var edB = new gcell_"+type+"(cB)")
 if(order=="asc")
 return edA.getValue()>edB.getValue()?1:-1
 else
 return edA.getValue()<edB.getValue()?1:-1
});
}else if(type=='int'){
 this.rowsCol.sort(function(a,b){
 var cA = a.childNodes[col]
 var cB = b.childNodes[col]
 var type = a.grid.cellType[col];
 eval("var edA = new gcell_"+type+"(cA)")
 eval("var edB = new gcell_"+type+"(cB)")
 var aVal = parseFloat(edA.getValue())||-99999999999999
 var bVal = parseFloat(edB.getValue())||-99999999999999
 if(order=="asc")
 return aVal-bVal
 else
 return bVal-aVal
 
});
}else if(type=='date'){
 this.rowsCol.sort(function(a,b){
 var cA = a.childNodes[col]
 var cB = b.childNodes[col]
 var type = a.grid.cellType[col];
 eval("var edA = new gcell_"+type+"(cA)")
 eval("var edB = new gcell_"+type+"(cB)")
 var aVal = Date.parse(new Date(edA.getValue())||new Date("01/01/1900"))
 var bVal = Date.parse(new Date(edB.getValue())||new Date("01/01/1900"))
 if(order=="asc")
 return aVal-bVal
 else
 return bVal-aVal
 
});
}

 if(this.dynScroll && this.dynScroll!='false'){
 alert("not implemented yet")
}else{
 var tb = this.obj.firstChild;
 for(var i=0;i<this.rowsCol.length;i++){
 tb.insertBefore(this.rowsCol[i],tb.childNodes[i])
 
}
}
 this.setSizes()
}
 
 
 
 this.setXMLAutoLoading = function(filePath,bufferSize){
 this.recordsNoMore = false;
 this.xmlFileUrl = filePath;
 this.rowsBufferOutSize = bufferSize||40;
}
 
 
 this.enableBuffering = function(bufferSize){
 this.rowsBufferOutSize = bufferSize||40;
}

 
 this.addRowsFromBuffer = function(){
 if(this.rowsBuffer[0].length==0){
 if(!this.recordsNoMore){
 if((this.xmlFileUrl!="")&&(!this._startXMLLoading)){
 this._startXMLLoading=true;
 this.loadXML(this.xmlFileUrl)
}
}else
 return false;
}
 var cnt = Math.min(this.rowsBufferOutSize,this.rowsBuffer[0].length)
 
 for(var i=0;i<cnt;i++){
 var rowNode = this.rowsBuffer[1][0]
 var rId = rowNode.getAttribute("id")
 var cellsCol = rowNode.childNodes;
 var strAr = new Array(0);
 for(var j=0;j<cellsCol.length;j++){
 if(cellsCol.item(j).nodeName=='cell')
 strAr[strAr.length] = cellsCol.item(j).text||cellsCol.item(j).textContent
}
 var r = this._addRow(rId,strAr)
 
 if(rowNode.getAttribute("selected")==true){
 this.setSelectedRow(rId,false,false,rowNode.getAttribute("call")==true)
}
 
 if(rowNode.getAttribute("expand")=="1"){
 r.expand = "";
}
 this.rowsBuffer[0]._dhx_removeAt(0);
 this.rowsBuffer[1]._dhx_removeAt(0);
}
 return true;
}
 
 
 this.setMultiselect = function(fl){
 this.selMultiRows = fl;
}
 
 this.deleteRow = function(row_id,node){
 this.editStop();
 if(typeof(this.onBeforeRowDeleted)=="function" && this.onBeforeRowDeleted(row_id)==false)
 return false;
 if(!node)node = this.getRowById(row_id)

 if(node!=null){
 if(this.cellType._dhx_find("tree")!=-1)this._removeTrGrRow(node);
 node.parentNode.removeChild(node);
 this.rowsCol._dhx_removeAt(this.rowsCol._dhx_find(node))
 node = null;
}
 this.rowsAr[row_id] = null;
 this.setSizes();
}
 
 this.deleteSelectedItem = function(){
 var num = this.selectedRows.length 
 if(num==0)
 return;
 var tmpAr = this.selectedRows;
 this.selectedRows = new Array(0)
 for(var i=num-1;i>=0;i--){
 var node = tmpAr[i]
 
 if(!this.deleteRow(node.idd,node)){
 this.selectedRows[this.selectedRows.length] = node;
}else{
 if(node==this.row){
 var ind = i;
}
}
 
}
 if(ind){
 try{
 if(ind+1>this.rowsCol.length)
 ind--;
 this.selectCell(ind,0,true)
}catch(er){
 this.row = null
 this.cell = null
}
}
}
 
 
 this.getSelectedId = function(){
 var selAr = new Array(0);
 for(var i=0;i<this.selectedRows.length;i++){
 selAr[selAr.length]=this.selectedRows[i].idd
}
 
 
 if(selAr.length==0)
 return null;
 else
 return selAr.join(this.delim);
}
 
 this.getSelectedCellIndex = function(){
 if(this.cell!=null)
 return this.cell._cellIndex;
 else
 return -1;
}
 
 this.getColWidth = function(ind){
 return parseInt(this.cellWidthPX[ind])+((_isFF)?2:0);
}
 
 this.getRowById = function(id){
 var row = this.rowsAr[id]
 if(row)
 return row;
 else
 return null;
}
 
 this.setRowId = function(ind,row_id){
 var r = this.rowsCol[ind]
 this.changeRowId(r.idd,row_id)
}
 
 this.changeRowId = function(oldRowId,newRowId){
 var row = this.rowsAr[oldRowId]
 row.idd = newRowId;
 if(this.UserData[oldRowId]){
 this.UserData[newRowId] = this.UserData[oldRowId]
 this.UserData[oldRowId] = null;
}
 if(this.loadedKidsHash){
 if(this.loadedKidsHash.get(oldRowId)!=null){
 this.loadedKidsHash.put(newRowId,this.loadedKidsHash.get(oldRowId));
 this.loadedKidsHash.remove(oldRowId);
}
 var parentsHash = this.loadedKidsHash.get("hashOfParents")
 if(parentsHash!=null){
 if(parentsHash.get(oldRowId)!=null){
 parentsHash.put(newRowId,row);
 parentsHash.remove(oldRowId);
 this.loadedKidsHash.put("hashOfParents",parentsHash)
}
}
}

 this.rowsAr[oldRowId] = null;
 this.rowsAr[newRowId] = row;
}
 
 
 this.getRowIndex = function(row_id){
 var ind = this.rowsCol._dhx_find(this.getRowById(row_id));
 if(ind!=-1)
 return ind;
 else{
 ind = this.rowsBuffer[0]._dhx_find(row_id)
 if(ind!=-1)
 return ind+this.rowsCol.length;
 return -1;
}
}
 
 this.getRowId = function(ind){
 try{
 return this.rowsCol[parseInt(ind)].idd;
}catch(er){
 return this.rowsBuffer[0][ind-this.rowsCol.length-1]
 
}
}

 
 this.setColumnIds = function(ids){
 if(ids)
 this.columnIds = ids.split(",")
 if(this.hdr.rows[0].cells.length>=this.columnIds.length){
 for(var i=0;i<this.columnIds.length;i++){
 this.hdr.rows[0].cells[i].column_id = this.columnIds[i];
}
}
}
 
 this.getColIndexById = function(id){
 for(var i=0;i<this.hdr.rows[0].cells.length;i++){
 if(this.hdr.rows[0].cells[i].column_id==id)
 return i;
}
}
 
 this.getColumnId = function(cin){
 return this.hdr.rows[0].cells[cin].column_id
}
 
 
 this.getHeaderCol = function(cin){
 return this.hdr.rows[0].cells[Number(cin)].innerHTML;
}
 
 
 this.setRowTextBold = function(row_id){
 this.getRowById(row_id).style.fontWeight = "bold";
}
 
 this.setRowTextStyle = function(row_id,styleString){
 var r = this.getRowById(row_id)

 for(var i=0;i<r.childNodes.length;i++){
 if(_isIE)
 r.childNodes[i].style.cssText = "width:"+r.childNodes[i].style.width+";"+styleString;
 else
 r.childNodes[i].style.cssText = "width:"+r.childNodes[i].style.width+";"+styleString;
}

}
 
 this.setRowTextNormal = function(row_id){
 this.getRowById(row_id).style.fontWeight = "normal";
}
 
 this.isItemExists = function(row_id){
 if(this.getRowById(row_id)!=null)
 return true
 else
 return false
}
 
 this.getAllItemIds = function(separator){
 var ar = new Array(0)
 for(i=0;i<this.rowsCol.length;i++){
 ar[ar.length]=this.rowsCol[i].idd
}
 for(i=0;i<this.rowsBuffer[0].length;i++){
 ar[ar.length]=this.rowsBuffer[0][i]
}
 return ar.join(separator||",")
}
 
 this.getRowsNum = function(){
 return this.rowsCol.length+this.rowsBuffer[0].length;
}
 
 this.getColumnCount = function(){
 return this.hdr.rows[0].cells.length;
}
 
 this.moveRowUp = function(row_id){
 var r = this.getRowById(row_id)
 var rInd = this.rowsCol._dhx_find(r)
 this.rowsCol._dhx_swapItems(rInd,rInd-1)
 try{
 this.obj.firstChild.insertBefore(r,r.previousSibling)
}catch(er){alert('Error en el metodo MoveRowUp: '+(er.description||er))}
}
 
 this.moveRowDown = function(row_id){
 var r = this.getRowById(row_id)
 var rInd = this.rowsCol._dhx_find(r)
 this.rowsCol._dhx_swapItems(rInd,rInd+1)
 try{
 this.obj.firstChild.insertBefore(r,r.nextSibling.nextSibling)
}catch(er){alert('Error en el metodo MoveRowDown: '+er.description)}
}
 
 this.cells = function(row_id,col){
 if(arguments.length==0){
 var c = this.cell;
 return eval("new gcell_"+this.cellType[this.cell._cellIndex]+"(c)");
}else{
 var c = this.getRowById(row_id);
 if(!c)return null;
 return eval("new gcell_"+this.cellType[col]+"(c.childNodes[col])");
}
}
 
 this.cells2 = function(row_index,col){
 var c = this.rowsCol[parseInt(row_index)].cells[parseInt(col)];
 return eval("new gcell_"+this.cellType[c._cellIndex]+"(c)");
}
 
 this.getCombo = function(col_ind){
 if(this.cellType[col_ind].indexOf('co')==0){
 if(!this.combos[col_ind]){
 this.combos[col_ind] = new uiGridComboObject();
}
 return this.combos[col_ind];
}else{
 return null;
}
}
 
 this.setUserData = function(row_id,name,value){
 try{
 if(row_id=="")
 row_id = "gridglobaluserdata";
 if(!this.UserData[row_id])
 this.UserData[row_id] = new Hashtable()
 this.UserData[row_id].put(name,value)
}catch(er){
 alert("UserData Error:"+er.description)
}
}
 
 this.getUserData = function(row_id,name){
 try{
 if(row_id=="")
 row_id = "gridglobaluserdata";
 return this.UserData[row_id].get(name)
}catch(er){}
}
 
 
 this.setEditable = function(fl){
 if(fl!='true' && fl!=1 && fl!=true)
 ifl = true;
 else
 ifl = false;
 for(var j=0;j<this.cellType.length;j++){
 if(this.cellType[j].indexOf('ra')==0 || this.cellType[j]=='ch'){
 for(var i=0;i<this.rowsCol.length;i++){
 var z=this.rowsCol[i].cells[j];
 if((z.childNodes.length>0)&&(z.firstChild.nodeType==1)){
 this.rowsCol[i].cells[j].firstChild.disabled = ifl;
}
}
}
}
 this.isEditable = !ifl;
}
 
 this.setSelectedRow = function(row_id,multiFL,show,call){
 if(!call)
 call = false;
 this.selectCell(this.getRowById(row_id),0,call,multiFL);
 if(arguments.length>2 && show==true){
 this.moveToVisible(this.getRowById(row_id).cells[0])
}
}
 
 this.clearSelection = function(){
 this.editStop()
 for(var i=0;i<this.selectedRows.length;i++){
 this.selectedRows[i].className=this.selectedRows[i].className.replace(/rowselected/g,"");
}
 
 
 this.selectedRows = new Array(0)
 this.row = null;
 if(this.cell!=null){
 this.cell.className = "";
 this.cell = null;
}
}
 
 this.copyRowContent = function(from_row_id,to_row_id){
 var frRow = this.getRowById(from_row_id)
 for(i=0;i<frRow.cells.length;i++){
 this.cells(to_row_id,i).setValue(this.cells(from_row_id,i).getValue())
}
 
 if(!isIE())
 this.getRowById(from_row_id).cells[0].height = frRow.cells[0].offsetHeight
}
 
 this.setHeaderCol = function(col,label){
 this.hdr.rows[0].cells[Number(col)].innerHTML = label;
}
 
 this.clearAll = function(){
 this.editStop();
 
 var len = this.rowsCol.length;
 for(var i=len-1;i>=0;i--){
 this.obj.firstChild.removeChild(this.rowsCol[i])
 this.rowsCol._dhx_removeAt(i);
}
 
 if(this.loadedKidsHash!=null){
 this.loadedKidsHash.clear();
 this.loadedKidsHash.put("hashOfParents",new Hashtable());
}
 
 len = this.obj.rows.length
 for(var i=len-1;i>=0;i--){
 this.obj.firstChild.removeChild(this.obj.rows[i])
}
 
 this.row = null;
 this.cell = null;
 this.rowsAr = new Array(0)
 this.rowsCol = new Array(0)
 this.rowsAr = new Array(0);
 this.rowsBuffer = new Array(new Array(0),new Array(0));
 this.UserData = new Array(0)
 
}
 this._sortField = function(ev){
 var el = this.getFirstParentOfType(ev.target||ev.srcElement,"TD");
 this.sortField(el._cellIndex)
}
 
 this.sortField = function(ind,repeatFl){
 if(this.getRowsNum()==0)
 return false;
 var el = this.hdr.rows[0].cells[ind];
 if(el.tagName == "TD" &&(this.fldSort.length-1)>=el._cellIndex && this.fldSort[el._cellIndex]!='na'){
 if(((this.sortImg.src.indexOf("_desc.gif")==-1 && !repeatFl)||(this.sortImg.style.filter!="" && repeatFl))&& this.fldSorted==el){
 var sortType = "desc";
 this.sortImg.src = this.imgURL+"sort_desc.gif";
}else{
 var sortType = "asc";
 this.sortImg.src = this.imgURL+"sort_asc.gif";
}
 this.sortRows(el._cellIndex,this.fldSort[el._cellIndex],sortType)
 this.fldSorted = el;
 this.setSortImgPos();
}
}
 
 
 this.setHeader = function(hdrStr){
 var arLab = hdrStr.split(this.delim);
 var arWdth = new Array(0);
 var arTyp = new Array(0);
 var arAlg = new Array(0);
 var arSrt = new Array(0);
 for(var i=0;i<arLab.length;i++){
 arWdth[arWdth.length] = Math.round(100/arLab.length);
 arTyp[arTyp.length] = "ed";
 arAlg[arAlg.length] = "left";
 arSrt[arSrt.length] = "na";
}
 this.hdrLabels = arLab;
 this.cellWidth = arWdth;
 this.cellType = arTyp;
 this.cellAlign = arAlg;
 this.fldSort = arSrt;
}
 
 this.setColTypes = function(typeStr){
 this.cellType = typeStr.split(this.delim)
}
 
 this.setColSorting = function(sortStr){
 this.fldSort = sortStr.split(this.delim)
}
 
 this.setColAlign = function(alStr){
 this.cellAlign = alStr.split(this.delim)
}
 
 
 this.setMultiLine = function(fl){
 if(fl==true)
 this.multiLine = -1;
}
 
 this.setNoHeader = function(fl){
 if(fl==true)
 this.noHeader = -1;
}
 
 this.showRow = function(rowID){
 this.moveToVisible(this.getRowById(rowID).cells[0])
}
 
 
 this.setStyle = function(ss_header,ss_grid,ss_selCell,ss_selRow){
 this.ssModifier = new Array(4)
 this.ssModifier[0] = ss_header;
 this.ssModifier[1] = ss_grid;
 this.ssModifier[2] = ss_selCell;
 this.ssModifier[3] = ss_selRow;
 this.styleSheet[0].addRule("#"+this.entBox.id+" table.hdr td",this.ssHeader+""+this.ssModifier[0]);
 this.styleSheet[0].addRule("#"+this.entBox.id+" table.obj td",this.ssGridCell+""+this.ssModifier[1]);
 this.styleSheet[0].addRule("#"+this.entBox.id+" table.obj tr.rowselected td.cellselected",this.ssSelectedCell+""+this.ssModifier[2]);
 this.styleSheet[0].addRule("#"+this.entBox.id+" table.obj td.cellselected",this.ssSelectedCell+""+this.ssModifier[2])
 this.styleSheet[0].addRule("#"+this.entBox.id+" table.obj tr.rowselected td",this.ssSelectedRow+""+this.ssModifier[3]);
}
 
 this.setColumnColor = function(clr){
 this.columnColor = clr.split(this.delim)
}
 
 
 this.doDynScroll = function(fl){
 if(!this.dynScroll || this.dynScroll=='false')
 return false;
 this.objBox.style.overflowY = "hidden";
 this.setDynScrollPageSize();
 
 var tmpAr = new Array(0)
 if(fl && fl=='up'){
 this.dynScrollPos = Math.max(this.dynScrollPos-this.dynScrollPageSize,0);
}else if(fl && fl=='dn' && this.dynScrollPos+this.dynScrollPageSize<this.rowsCol.length){
 if(this.dynScrollPos+this.dynScrollPageSize+this.rowsBufferOutSize>this.rowsCol.length){
 this.addRowsFromBuffer()
}
 this.dynScrollPos+=this.dynScrollPageSize
}
 var start = Math.max(this.dynScrollPos-this.dynScrollPageSize,0);
 for(var i = start;i<this.rowsCol.length;i++){
 if(i>=this.dynScrollPos && i<this.dynScrollPos+this.dynScrollPageSize){
 tmpAr[tmpAr.length] = this.rowsCol[i];
}
 this.rowsCol[i].removeNode(true);
}
 for(var i=0;i<tmpAr.length;i++){
 this.obj.childNodes[0].appendChild(tmpAr[i]);
 if(this.obj.offsetHeight>this.objBox.offsetHeight)
 this.dynScrollPos-=(this.dynScrollPageSize-i)
}
 this.setSizes()
}
 
 this.setDynScrollPageSize = function(){
 if(this.dynScroll && this.dynScroll!='false'){
 var rowsH = 0;
 try{
 var rowH = this.obj.rows[0].scrollHeight;
}catch(er){
 var rowH = 20
}
 for(var i=0;i<1000;i++){
 rowsH = i*rowH;
 if(this.objBox.offsetHeight<rowsH)
 break
}
 this.dynScrollPageSize = i+2;
 this.rowsBufferOutSize = this.dynScrollPageSize*4
}
}


 
 
 
 this.setOnRowSelectHandler = function(func){
 if(!func)
 this.onRowSelect = "void";
 else
 if(typeof(func)=="function")
 this.onRowSelect=func;
 else 
 this.onRowSelect=eval(func);
}
 
 
 this.setOnEditCellHandler = function(func){
 if(!func)
 this.onEditCell = "void";
 else
 if(typeof(func)=="function")
 this.onEditCell=func;
 else 
 this.onEditCell=eval(func);
}
 
 this.setOnCheckHandler = function(func){
 if(!func)
 this.onCheckbox = null;
 else
 if(typeof(func)=="function")
 this.onCheckbox=func;
 else 
 this.onCheckbox=eval(func);
}
 
 
 this.setOnEnterPressedHandler = function(func){
 if(!func)
 this.onEnter = "void";
 else
 if(typeof(func)=="function")
 this.onEnter=func;
 else 
 this.onEnter=eval(func);
}
 
 
 this.setOnBeforeRowDeletedHandler = function(func){
 if(!func)
 this.onBeforeRowDeleted = "void";
 else
 if(typeof(func)=="function")
 this.onBeforeRowDeleted=func;
 else 
 this.onBeforeRowDeleted=eval(func);
}
 
 this.setOnRowAddedHandler = function(func){
 if(!func)
 this.onRowAdded = "void";
 else
 if(typeof(func)=="function")
 this.onRowAdded=func;
 else 
 this.onRowAdded=eval(func);
}
 
 
 
 
 this.getPosition = function(oNode,pNode){
 if(!pNode)
 var pNode = document.body
 var oCurrentNode=oNode;
 var iLeft=0;
 var iTop=0;
 while((oCurrentNode)&&(oCurrentNode!=pNode)){
 iLeft+=oCurrentNode.offsetLeft;
 iTop+=oCurrentNode.offsetTop;
 oCurrentNode=oCurrentNode.offsetParent;
}
 if(((_isKHTML)||(_isOpera))&&(pNode == document.body)){
 iLeft+=document.body.offsetLeft;
 iTop+=document.body.offsetTop;
}

 return new Array(iLeft,iTop);
}
 
 this.getFirstParentOfType = function(obj,tag){
 while(obj.tagName!=tag && obj.tagName!="BODY"){
 obj = obj.parentNode;
}
 return obj;
}

 
 
 this.setColumnCount = function(cnt){alert('setColumnCount method deprecated')}
 
 this.showContent = function(){alert('showContent method deprecated')}
 
 
 this.objBox.onscroll = new Function("","this.grid.doOnScroll()")
 if(!_isOpera)
{
 this.hdr.onmousemove = new Function("e","this.grid.changeCursorState(e||window.event)");
 this.hdr.onmousedown = new Function("e","this.grid.startColResize(e||window.event)");
}
 //this.obj.onmousemove = new Function("e","try{if(!this.grid.editor){var c = this.grid.getFirstParentOfType(e?e.target:event.srcElement,'TD');var r = c.parentNode;var ced = this.grid.cells(r.idd,c._cellIndex);if(!ced)return false;(e?e.target:event.srcElement).title = ced.getTitle?ced.getTitle():ced.getValue()}}catch(er){}");
 this.obj.onmousemove = new Function("e","try{if(!this.grid.editor){var c = this.grid.getFirstParentOfType(e?e.target:event.srcElement,'TD');var r = c.parentNode;var ced = this.grid.cells(r.idd,c._cellIndex);if(!ced)return false;}}catch(er){}");
 this.entBox.onclick = new Function("e","this.grid._doClick(e||window.event)");
 this.obj.ondblclick = new Function("e","this.grid.editCell(e||window.event)");
 this.hdr.onclick = new Function("e","if(this.grid.resized==null)this.grid._sortField(e||window.event);");
 
 document.onkeydown = new Function("e","if(globalActiveDHTMLGridObject)return globalActiveDHTMLGridObject.doKey(e||window.event);return true;");
 
 
 this.entBox.onbeforeactivate = new Function("","this.grid.setActive()");
 this.entBox.onbeforedeactivate = new Function("","this.grid.isActive=-1");
 
 this.doOnRowAdded = function(row){};

}



 uiGridObject.prototype.isTreeGrid= function(){
 return(this.cellType._dhx_find("tree")!=-1);
}

 
 uiGridObject.prototype.addRow = function(new_id,text,ind){
 var r = this._addRow(new_id,text,ind);
 if(typeof(this.onRowAdded)=='function'){
 this.onRowAdded(new_id);
}
 this.setSizes();
 return r;
}
 
 uiGridObject.prototype._addRow = function(new_id,text,ind){
 if(ind<0)ind=this.obj.rows.length;
 
 this.math_off=true;
 this.math_req=false;

 if((arguments.length<3)||(ind===window.undefined))
 ind = this.rowsCol.length 
 else{
 if(ind>this.rowsCol.length)
 ind = this.rowsCol.length;
}
 if(typeof(text)!='object')
 text = text.split(this.delim)



 if((!this.dynScroll || this.dynScroll=='false' || ind<this.obj.rows.length)&&((ind)||(ind==0)))
{
 if((_isKHTML)&&(ind==this.obj.rows.length)){
 var r=document.createElement("TR");
 this.obj.appendChild(r);
}
 else
 var r=this.obj.insertRow(ind);
}
 else
 var r = this.obj.insertRow(this.obj.rows.length);

 if(this.multiLine != true)
 this.obj.className+=" row20px";


 r.idd = new_id;
 r.grid = this;
 
 for(var i=0;i<this.hdr.rows[0].cells.length;i++){
 var c = r.insertCell(i)
 c._cellIndex = i;
 if(this.dragAndDropOff)this.dragger.addDraggableItem(c,this);
 c.align = this.cellAlign[i]
 
 c.bgColor = this.columnColor[i] || ""
 this.editStop();
 if(i<text.length){
 var val = text[i]
 if((this.defVal[i])&&(val==""))val = this.defVal[i];

 eval("this.editor = new gcell_"+this.cellType[i]+"(c)");
 this.editor.setValue(val)
 this.editor = this.editor.destructor();
}else{
 var val = "&nbsp;";
 c.innerHTML = val;
}

}

 this.rowsAr[new_id] = r;
 this.rowsCol._dhx_insertAt(ind,r);

 

 this.chngCellWidth(ind)
 this.doOnRowAdded(r);
 

 this.math_off=false;
 if((this.math_req)&&(!this._parsing_)){
 for(var i=0;i<this.hdr.rows[0].cells.length;i++)
 this._checkSCL(r.childNodes[i]);
}
 return r;

}


uiGridObject.prototype.destructor=function(){
 var a;
 this.xmlLoader=this.xmlLoader.destructor();
 for(var i=0;i<this.rowsCol.length;i++)
 this.rowsCol[i].grid=null;
 for(var i=0;i<this.rowsAr.length;i++)
 if(this.rowsAr[i])this.rowsAr[i].grid=null;

 this.rowsCol=new Array();
 this.rowsAr=new Array();
 this.entBox.innerHTML="";
 this.entBox.onclick = function(){};
 this.entBox.onmousedown = function(){};
 this.entBox.onbeforeactivate = function(){};
 this.entBox.onbeforedeactivate = function(){};
 this.entBox.onbeforedeactivate = function(){};

 for(a in this)
 this[a]=null;


 if(this==globalActiveDHTMLGridObject)
 globalActiveDHTMLGridObject=null;
 return null;
}

uiGridObject.prototype.getNode = function(tagName){
	return this.xmlLoader.getXMLTopNode(tagName);
}

uiGridObject.prototype.isLoadedXML = function(){
	return (this._xml_ready || false);
}

uiGridObject.prototype.getRowsXPath = function(xpathExp){
	if(this.xmlLoader.xmlDoc.responseXML)
		return this.xmlLoader.doXPath(xpathExp);
	else
		return null;
}

uiGridObject.prototype.setOnEndLoad = function(func){
	if(typeof(func) == 'function')
		this.onEndLoad = func;
}
function uiGridCellObject(obj){
 
 this.destructor=function(){
 this.cell.obj=null;
 this.cell=null;
 this.grid=null;
 this.base=null;
 return null;
}

 this.cell = obj;
 
 this.getValue = function(){
 return this.cell.innerHTML._dhx_trim();
}
 
 this.getFont = function(){
 arOut = new Array(3);
 if(this.cell.style.fontFamily)
 arOut[0] = this.cell.style.fontFamily
 if(this.cell.style.fontWeight=='bold' || this.cell.parentNode.style.fontWeight=='bold')
 arOut[1] = 'bold';
 if(this.cell.style.fontStyle=='italic' || this.cell.parentNode.style.fontWeight=='italic')
 arOut[1]+= 'italic';
 if(this.cell.style.fontSize)
 arOut[2] = this.cell.style.fontSize
 else
 arOut[2] = "";
 return arOut.join("-")
}
 
 this.getTextColor = function(){
 if(this.cell.style.color)
 return this.cell.style.color
 else
 return "#000000";
}
 
 this.getBgColor = function(){
 if(this.cell.bgColor)
 return this.cell.bgColor
 else
 return "#FFFFFF";
}
 
 this.getHorAlign = function(){
 if(this.cell.style.textAlign)
 return this.cell.style.textAlign;
 else if(this.cell.align)
 return this.cell.align
 else
 return "left";
}
 
 this.getWidth = function(){
 return this.cell.scrollWidth;
}
 
 this.setFont = function(val){
 fntAr = val.split("-");
 this.cell.style.fontFamily = fntAr[0];
 this.cell.style.fontSize = fntAr[fntAr.length-1]
 if(fntAr.length==3){
 if(/bold/.test(fntAr[1]))
 this.cell.style.fontWeight = "bold";
 if(/italic/.test(fntAr[1]))
 this.cell.style.fontStyle = "italic";
}
 
}
 
 this.setTextColor = function(val){
 this.cell.style.color = val;
}
 
 this.setBgColor = function(val){
 if(val=="")
 val = null;
 this.cell.bgColor = val;
}
 
 this.setHorAlign = function(val){
 if(val.length==1){
 if(val=='c')
 this.cell.style.textAlign = 'center'
 else if(val=='l')
 this.cell.style.textAlign = 'left';
 else
 this.cell.style.textAlign = 'right';
}else 
 this.cell.style.textAlign = val
}
 
 this.wasChanged = function(){
 if(this.cell.wasChanged)
 return true;
 else
 return false;
}
 
 this.isCheckbox = function(){
 var ch = this.cell.firstChild;
 if(ch && ch.tagName=='INPUT'){
 type = ch.type;
 if(type=='radio' || type=='checkbox')
 return true;
 else
 return false;
}else
 return false;
}
 
 this.isChecked = function(){
 if(this.isCheckbox()){
 return this.cell.firstChild.checked;
}
}
 
 this.isDisabled = function(){
 if(this.isCheckbox()){
 return this.cell.firstChild.disabled;
}
}
 
 this.setChecked = function(fl){
 if(this.isCheckbox()){
 if(fl!='true' && fl!=1)
 fl = false;
 this.cell.firstChild.checked = fl;
}
}
 
 this.setDisabled = function(fl){
 if(this.isCheckbox()){
 if(fl!='true' && fl!=1)
 fl = false;
 this.cell.firstChild.disabled = fl;
 if(this.disabledF)this.disabledF(fl);
}
}
}

 
uiGridCellObject.prototype.setValue = function(val){
 if(!val || val.toString()._dhx_trim()=="")
 val="&nbsp;"
 this.cell.innerHTML = val;
}

 
function gcell(){
 this.obj = null;
 
 this.val = null;
 
 this.changeState = function(){return false}
 
 this.edit = function(){this.val = this.getValue()}
 
 this.detach = function(){return false}
 
 this.getPosition = function(oNode){
 var oCurrentNode=oNode;
 var iLeft=0;
 var iTop=0;
 while(oCurrentNode.tagName!="BODY"){
 iLeft+=oCurrentNode.offsetLeft;
 iTop+=oCurrentNode.offsetTop;
 oCurrentNode=oCurrentNode.offsetParent;
}
 return new Array(iLeft,iTop);
}
}
gcell.prototype = new uiGridCellObject;

 
function gcell_ed(cell){
 try{
 this.cell = cell;
 this.grid = this.cell.parentNode.grid;
}catch(er){}
 this.edit = function(){
 this.val = this.getValue();
 this.obj = document.createElement("TEXTAREA");
 this.obj.style.width = "100%";
 this.obj.style.height =(this.cell.offsetHeight-4)+"px";
 this.obj.style.border = "0px";
 this.obj.style.margin = "0px";
 this.obj.style.padding = "0px";
 this.obj.style.overflow = "hidden";
 this.obj.style.fontSize = "12px";
 this.obj.style.fontFamily = "Arial";
 this.obj.wrap = "soft";
 this.obj.style.textAlign = this.cell.align;
 this.obj.onclick = function(e){(e||event).cancelBubble = true}
 this.obj.value = this.val
 this.cell.innerHTML = "";
 this.cell.appendChild(this.obj);
 this.obj.onselectstart=function(e){if(!e)e=event;e.cancelBubble=true;return true;};
 this.obj.focus()
 this.obj.focus()
}
 this.getValue = function(){
 
 return this.cell.innerHTML.toString()._dhx_trim()
}
 
 this.detach = function(){
 this.setValue(this.obj.value);
 return this.val!=this.getValue();
}
}
gcell_ed.prototype = new gcell;

 
function gcell_ch(cell){
 try{
 this.cell = cell;
 this.grid = this.cell.parentNode.grid;
 this.cell.obj = this;
}catch(er){}
 this.disabledF=function(fl){
 if((fl==true)||(fl==1))
 this.cell.innerHTML=this.cell.innerHTML.replace("item_chk0.","item_chk0_dis.").replace("item_chk1.","item_chk1_dis.");
 else
 this.cell.innerHTML=this.cell.innerHTML.replace("item_chk0_dis.","item_chk0.").replace("item_chk1_dis.","item_chk1.");
}

 this.changeState = function(){
 if(typeof(this.grid.onEditCell)=="string"){
 if(eval(this.grid.onEditCell+"(0,'"+this.cell.parentNode.idd+"',"+this.cell._cellIndex+");")!=false){
 this.val = this.getValue()
 if(this.val=="1")
 this.setValue("<checkbox state='false'>")
 else
 this.setValue("<checkbox state='true'>")
 
 eval(this.grid.onEditCell+"(1,'"+this.cell.parentNode.idd+"',"+this.cell._cellIndex+");")
 if(this.grid.onCheckbox)this.grid.onCheckbox(this.cell.parentNode.idd,(this.val!='1'),this.cell._cellIndex);
}else{
 this.grid.editor=null;
}
}else{
 if(this.grid.onEditCell(0,this.cell.parentNode.idd,this.cell._cellIndex)!=false){
 this.val = this.getValue()
 if(this.val=="1")
 this.setValue("<checkbox state='false'>")
 else
 this.setValue("<checkbox state='true'>")
 
 this.grid.onEditCell(1,this.cell.parentNode.idd,this.cell._cellIndex)
 if(typeof(this.grid.onCheckbox)=='function')
 this.grid.onCheckbox(this.cell.parentNode.idd,this.cell._cellIndex,(this.val!='1'))
}else{
 this.editor=null;
}
}
 
 
 
}
 this.getValue = function(){
 try{
 return this.cell.chstate.toString();
}catch(er){
 return null;
}
}
 this.isCheckbox = function(){
 return true;
}
 this.isChecked = function(){
 if(this.getValue()=="1")
 return true;
 else
 return false;
}
 this.setChecked = function(fl){
 this.setValue(fl.toString())
}
 this.detach = function(){
 return this.val!=this.getValue();
}
}
gcell_ch.prototype = new gcell;
gcell_ch.prototype.setValue = function(val){
 
 val=(val||"").toString();
 if(val.indexOf("1")!=-1 || val.indexOf("true")!=-1){
 val = "1";
 this.cell.chstate = "1";
}else{
 val = "0";
 this.cell.chstate = "0"
}
 var obj = this;
 this.cell.innerHTML = "<img src='"+this.grid.imgURL+"item_chk"+val+".gif' onclick='this.parentNode.obj.changeState()'>";
}
 
function gcell_ra(cell){
 this.base = gcell_ch;
 this.base(cell)
 this.disabledF=function(fl){
 if((fl==true)||(fl==1))
 this.cell.innerHTML=this.cell.innerHTML.replace("radio_chk0.","radio_chk0_dis.").replace("radio_chk1.","radio_chk1_dis.");
 else
 this.cell.innerHTML=this.cell.innerHTML.replace("radio_chk0_dis.","radio_chk0.").replace("radio_chk1_dis.","radio_chk1.");
}

 this.changeState = function(){
 
 
 if(typeof(this.grid.onEditCell)=="string"){
 if(eval(this.grid.onEditCell+"(0,'"+this.cell.parentNode.idd+"',"+this.cell._cellIndex+");")!=false){
 this.val = this.getValue()
 if(this.val=="1")
 this.setValue("<checkbox state='false'>")
 else
 this.setValue("<checkbox state='true'>")
 
 eval(this.grid.onEditCell+"(1,'"+this.cell.parentNode.idd+"',"+this.cell._cellIndex+");")
 if(this.grid.onCheckbox)this.grid.onCheckbox(this.cell.parentNode.idd,(this.val!='1'),this.cell._cellIndex);
 for(var i=0;i<this.grid.getRowsNum();i++){
 if(this.grid.cells2(i,this.cell._cellIndex).isChecked()&& this.grid.cells2(i,this.cell._cellIndex).cell!=this.cell)
 this.grid.cells2(i,this.cell._cellIndex).setValue("<checkbox state='false'>")
}
}else{
 this.grid.editor=null;
}
}else{
 if(this.grid.onEditCell(0,this.cell.parentNode.idd,this.cell._cellIndex)!=false){
 this.val = this.getValue()
 if(this.val=="1")
 this.setValue("<checkbox state='false'>")
 else
 this.setValue("<checkbox state='true'>")
 
 this.grid.onEditCell(1,this.cell.parentNode.idd,this.cell._cellIndex)
 if(typeof(this.grid.onCheckbox)=='function')
 this.grid.onCheckbox(this.cell.parentNode.idd,this.cell._cellIndex,(this.val!='1'))
 for(var i=0;i<this.grid.getRowsNum();i++){
 if(this.grid.cells2(i,this.cell._cellIndex).isChecked()&& this.grid.cells2(i,this.cell._cellIndex).cell!=this.cell)
 this.grid.cells2(i,this.cell._cellIndex).setValue("<checkbox state='false'>")
}
}else{
 this.editor=null;
}
}
 
}

}
gcell_ra.prototype = new gcell_ch;
gcell_ra.prototype.setValue = function(val){
 if((val||"").indexOf("1")!=-1 ||(val||"").indexOf("true")!=-1){
 val = "1";
 this.cell.chstate = "1";
}else{
 val = "0";
 this.cell.chstate = "0"
}
 var obj = this;
 this.cell.innerHTML = "<img src='"+this.grid.imgURL+"radio_chk"+val+".gif' onclick='this.parentNode.obj.changeState()'>";
}
 
function gcell_txt(cell){
 try{
 this.cell = cell;
 this.grid = this.cell.parentNode.grid;
}catch(er){}
 this.edit = function(){
 this.val = this.getValue()
 this.obj = document.createElement("TEXTAREA");
 this.obj.style.border = "1px solid"
 this.obj.style.borderColor = "black silver silver black";
 this.obj.style.position = "absolute";
 this.obj.style.height = "100px";
 
 this.obj.onclick = function(e){(e||event).cancelBubble = true}
 var arPos = this.grid.getPosition(this.cell);
 this.obj.value = this.cell.innerHTML;
 
 
 document.body.appendChild(this.obj);
 this.obj.style.left = arPos[0]-this.grid.objBox.scrollLeft;
 this.obj.style.top = arPos[1]+this.cell.offsetHeight-this.grid.objBox.scrollTop;
 if(this.cell.scrollWidth<200)
 this.obj.style.width = 200;
 else
 this.obj.style.width = this.cell.scrollWidth;
 this.obj.style.display = "";
 this.obj.style.textAlign = this.cell.align;
 this.obj.focus();
 this.obj.focus()
}
 this.detach = function(){
 this.setValue(this.obj.value);
 
 document.body.removeChild(this.obj);
 return this.val!=this.getValue();
}
}
gcell_txt.prototype = new gcell;

 
function gcell_co(cell){
 try{
 this.cell = cell;
 this.grid = this.cell.parentNode.grid;
 this.combo = this.grid.getCombo(this.cell._cellIndex);
 this.editable = true
}catch(er){}
 this.shiftNext=function(){
 if(this.cstate==1){
 var z=this.list.options[this.list.selectedIndex+1];
 if(z)z.selected=true;
 this.obj.value=this.list.value;
}
 return true;
}
 this.shiftPrev=function(){
 if(this.cstate==1){
 var z=this.list.options[this.list.selectedIndex-1];
 if(z)z.selected=true;

 this.obj.value=this.list.value;
}
 return true;
}
 this.edit = function(){
 this.val = this.getValue();
 this.text = this.cell.innerHTML._dhx_trim();
 var arPos = this.grid.getPosition(this.cell)

 this.obj = document.createElement("TEXTAREA");
 var objCssText = "width:100%;height:"+(this.cell.offsetHeight-4)+"px;border:0px;padding:0px;margin:0px;font:12px arial;overflow:hidden";
(this.obj.runtimeStyle||this.obj.style).cssText = objCssText;
 this.obj.wrap = "soft";
 this.obj.style.textAlign = this.cell.align;
 this.obj.onclick = function(e){(e||event).cancelBubble = true}
 this.obj.value = this.text
 this.list = document.createElement("SELECT");
 this.list.editor_obj = this;
 this.list.style.cssText = "font-family:arial;font-size:12px;border:1px solid;border-color:black silver silver black;background-color:white;width:"+this.cell.offsetWidth+"px;position:absolute;overflow:hidden;cursor:default;";
 this.list.style.left = arPos[0]-this.grid.objBox.scrollLeft+"px";
 this.list.style.top = arPos[1]+this.cell.offsetHeight-this.grid.objBox.scrollTop+"px";
 this.list.size="6";
 this.list.onclick = function(e){
 var ev = e||window.event;
 var cell = ev.target||ev.srcElement
 
 if(cell.tagName=="OPTION")cell=cell.parentNode;
 cell.editor_obj.setValue(cell.value);
 cell.editor_obj.editable=false;
 cell.editor_obj.detach();
}

 var comboKeys = this.combo.getKeys();
 var fl=false

 for(var i=0;i<comboKeys.length;i++){
 var val = this.combo.get(comboKeys[i])
 this.list.options[this.list.options.length]=new Option(val,comboKeys[i]);
 if(comboKeys[i]==this.val){
 this.list.options[this.list.options.length-1].selected=true;
 fl = true;
}
}
 if(fl==false){
 this.list.options[this.list.options.length]=new Option(this.text,this.val===null?"":this.val);
 this.list.options[this.list.options.length-1].selected=true;
}
 document.body.appendChild(this.list)
 this.cstate=2;
 if(this.editable){
 this.cstate=1;
 this.cell.innerHTML = "";
 this.cell.appendChild(this.obj);
 this.obj.focus()
}
 else{this.list.focus();}
}

 this.getValue = function(){
 return this.cell.combo_value;
}
 this.getText = function(){
 return this.cell.innerHTML;
}
 this.detach = function(){
 if(this.val!=this.getValue()){
 this.cell.wasChanged = true;
}

 if(this.list.parentNode!=null){
 if(this.editable)
 if(this.obj.value._dhx_trim()!=this.text){
 this.setValue(this.obj.value)
}else{
 this.setValue(this.val)
}
 else
 this.setValue(this.list.value)
}
 
 if(typeof(this.grid.onEditCell)=="string")
 eval(this.grid.onEditCell+"(2,'"+this.cell.parentNode.idd+"',"+this.cell._cellIndex+");")
 else if(typeof(this.grid.onEditCell)=='function'){
 this.grid.onEditCell(2,this.cell.parentNode.idd,this.cell._cellIndex)
}
 
 if(this.list.offsetParent!=null)
 this.list.parentNode.removeChild(this.list);
 return this.val!=this.getValue();
}
}
gcell_co.prototype = new gcell;
gcell_co.prototype.setValue = function(val){
 if((val||"").toString()._dhx_trim()=="")
 val=null

 if(val!==null)
 this.cell.innerHTML = this.grid.getCombo(this.cell._cellIndex).get(val)|| val;
 else
 this.cell.innerHTML="&nbsp;";

 this.cell.combo_value = val;
}
 
function gcell_coro(cell){
 this.base = gcell_co;
 this.base(cell)
 this.editable = false;
}
gcell_coro.prototype = new gcell_co;

 
function gcell_cp(cell){
 try{
 this.cell = cell;
 this.grid = this.cell.parentNode.grid;
}catch(er){}
 this.edit = function(){
 this.val = this.getValue()
 this.obj = document.createElement("SPAN");
 this.obj.style.border = "1px solid black";
 this.obj.style.position = "absolute";
 var arPos = this.grid.getPosition(this.cell);
 this.colorPanel(4,this.obj)
 document.body.appendChild(this.obj);
 this.obj.style.left = arPos[0]-this.grid.objBox.scrollLeft;
 this.obj.style.top = arPos[1]+this.cell.offsetHeight-this.grid.objBox.scrollTop;
}
 this.toolDNum = function(value){
 if(value.length==1)
 value = '0'+value;
 return value;
}
 this.colorPanel = function(index,parent){
 var tbl = document.createElement("TABLE");
 parent.appendChild(tbl)
 tbl.cellSpacing = 0;
 tbl.editor_obj = this;
 tbl.style.cursor = "default";
 tbl.style.cursor = "table-layout:fixed";
 tbl.onclick = function(e){
 var ev = e||window.event
 var cell = ev.target||ev.srcElement;
 var ed = cell.parentNode.parentNode.parentNode.editor_obj
 ed.setValue(cell.style.backgroundColor)
 ed.detach()
}
 var cnt = 256/index;
 for(var j=0;j<=(256/cnt);j++){
 var r = tbl.insertRow(j);
 for(var i=0;i<=(256/cnt);i++){
 for(var n=0;n<=(256/cnt);n++){
 R = new Number(cnt*j)-(j==0?0:1)
 G = new Number(cnt*i)-(i==0?0:1)
 B = new Number(cnt*n)-(n==0?0:1)
 var rgb = this.toolDNum(R.toString(16))+""+this.toolDNum(G.toString(16))+""+this.toolDNum(B.toString(16));
 var c = r.insertCell(i);
 c.width = "10px";
 c.innerHTML = "&nbsp;";
 c.title = rgb.toUpperCase()
 c.style.backgroundColor = rgb
 if(this.val!=null && "#"+rgb.toUpperCase()==this.val.toUpperCase()){
 c.style.border = "2px solid white"
}
}
}
}
}
 this.getValue = function(){
 return this.cell.firstChild.style.backgroundColor;
}
 this.getRed = function(){
 return Number(parseInt(this.getValue().substr(1,2),16))
}
 this.getGreen = function(){
 return Number(parseInt(this.getValue().substr(3,2),16))
}
 this.getBlue = function(){
 return Number(parseInt(this.getValue().substr(5,2),16))
}
 this.detach = function(){
 
 if(typeof(this.grid.onEditCell)=="string")
 eval(this.grid.onEditCell+"(2,'"+this.cell.parentNode.idd+"',"+this.cell._cellIndex+");")
 else{
 this.grid.onEditCell(2,this.cell.parentNode.idd,this.cell._cellIndex)
}
 if(this.obj.offsetParent!=null)
 document.body.removeChild(this.obj);
 
 return this.val!=this.getValue();
}
}
gcell_cp.prototype = new gcell;
gcell_cp.prototype.setValue = function(val){
 this.cell.innerHTML = "<div style='width:100%;height:"+(this.cell.offsetHeight-2)+";background-color:"+(val||"")+";border:0px;'>&nbsp;</div>";
}


 
 
function gcell_img(cell){
 try{
 this.cell = cell;
 this.grid = this.cell.parentNode.grid;
}catch(er){}
 this.getValue = function(){
 if(this.cell.firstChild.tagName=="IMG")
 return this.cell.firstChild.src+(this.cell.titFl!=null?"^"+this.cell.tit:"");
 else if(this.cell.firstChild.tagName=="A"){
 var out = this.cell.firstChild.firstChild.src+(this.cell.titFl!=null?"^"+this.cell.tit:"");
 out+="^"+this.cell.lnk;
 if(this.cell.trg)
 out+="^"+this.cell.trg
 return out;
}
}
 this.getTitle = function(){
 return this.cell.tit
}
}
gcell_img.prototype = new gcell;
gcell_img.prototype.setValue = function(val){
 var title = val;
 if(val.indexOf("^")!=-1){
 var ar = val.split("^");
 val = ar[0]
 title = ar[1];
 
 if(ar.length>2){
 this.cell.lnk = ar[2]
 if(ar[3])
 this.cell.trg = ar[3]
}
 this.cell.titFl = "1";
}
 this.cell.innerHTML = "<img src='"+(val||"")._dhx_trim()+"' border='0'>";
 if(this.cell.lnk){
 this.cell.innerHTML = "<a href='"+this.cell.lnk+"' target='"+this.cell.trg+"'>"+this.cell.innerHTML+"</a>"
}
 this.cell.tit = title;
}


 
function gcell_price(cell){
 this.base = gcell_ed;
 this.base(cell)
 this.getValue = function(){
 if(this.cell.childNodes.length>1)
 return this.cell.childNodes[1].innerHTML.toString()._dhx_trim()
 else
 return "0";
}
}
gcell_price.prototype = new gcell_ed;
gcell_price.prototype.setValue = function(val){
 if(isNaN(Number(val))){
 if(!(val||"")||(val||"")._dhx_trim()!="")
 val = 0;
 val = this.val || 0;
}
 if(val>0){
 var color = "green";
 this.cell.innerHTML = "<span>$</span><span style='padding-right:2px;color:"+color+";'>"+val+"</span>";
}else{
 this.cell.innerHTML = "<div align='center' style='color:red;'>&nbsp;</div>";
}

}

 
function gcell_dyn(cell){
 this.base = gcell_ed;
 this.base(cell)
 this.getValue = function(){
 return this.cell.firstChild.childNodes[1].innerHTML.toString()._dhx_trim()
}

}

gcell_dyn.prototype = new gcell_ed;
gcell_dyn.prototype.setValue = function(val){
 if(!val || isNaN(Number(val))){
 val = 0;
}
 if(val>0){
 var color = "green";
 var img = "dyn_up.gif";
}else if(val==0){
 var color = "black";
 var img = "dyn_.gif";
}else{
 var color = "red";
 var img = "dyn_down.gif";
}
 this.cell.innerHTML = "<div style='position:relative;padding-right:2px;width:100%;'><img src='"+this.grid.imgURL+""+img+"' height='15' style='position:absolute;top:0px;left:0px;'><span style='width:100%;color:"+color+";'>"+val+"</span></div>";
}


 
function gcell_ro(cell){
 this.cell = cell;
 this.grid = this.cell.parentNode.grid;
 this.edit = function(){}
}
gcell_ro.prototype = new gcell;


 
function uiGridComboObject(){
 this.keys = new Array();
 this.values = new Array();
 
 this.put = function(key,value){
 for(var i=0;i<this.keys.length;i++){
 if(this.keys[i]==key){
 this.values[i]=value;
 return true;
}
}
 this.values[this.values.length] = value;
 this.keys[this.keys.length] = key;
}
 
 this.get = function(key){
 for(var i=0;i<this.keys.length;i++){
 if(this.keys[i]==key){
 return this.values[i];
}
}
 return null;
}
 
 this.clear = function(){
 
 this.keys = new Array();
 this.values = new Array();
}
 
 this.remove = function(key){
 for(var i=0;i<this.keys.length;i++){
 if(this.keys[i]==key){
 this.keys._dhx_removeAt(i);
 this.values._dhx_removeAt(i);
 return true;
}
}
}
 
 this.size = function(){
 var j=0;
 for(var i=0;i<this.keys.length;i++){
 if(this.keys[i]!=null)
 j++;
}
 return j;
}
 
 this.getKeys = function(){
 var keyAr = new Array(0);
 for(var i=0;i<this.keys.length;i++){
 if(this.keys[i]!=null)
 keyAr[keyAr.length] = this.keys[i];
}
 return keyAr;
}
 return this;
}
function Hashtable(){
 this.keys = new Array();
 this.values = new Array();
 return this;
}
Hashtable.prototype = new uiGridComboObject;

 function uiProtobarObject(){
 return this;
}
 
 
 uiProtobarObject.prototype.setOnShowHandler=function(func){
 if(typeof(func)=="function")this.onShow=func;else this.onShow=eval(func);
};
 
 
 uiProtobarObject.prototype._getItemIndex=function(id){
 for(var i=0;i<this.itemsCount;i++)
{
 if(this.items[i].id==id)return i;
};
 return -1;
};
 
 uiProtobarObject.prototype.setGfxPath=function(path){
 this.sysGfxPath=path;
};
 
 
 uiProtobarObject.prototype.setOnHideHandler=function(func){
 if(typeof(func)=="function")this.onHide=func;else this.onHide=eval(func);
};
 
 uiProtobarObject.prototype.setItemAction=function(id,action){
 var z=this._getItemIndex(id);
 if(z>=0){
 this.items[z].setSecondAction(action);
};
};
 
 uiProtobarObject.prototype.getItem=function(itemId){
 var z=this._getItemIndex(itemId);
 if(z>=0)return this.items[z];
};
 
 uiProtobarObject.prototype.hideButtons=function(idList){
 if(!idList){
 for(var i=0;i<this.itemsCount;i++){
 this.items[i].getTopNode().style.display="none";
 this.items[i].hide=1;
}
 return 0;
}
 
 var temp=idList.split(",");
 for(var i=0;i<temp.length;i++)
{
 this.hideItem(temp[i]);
};
};
 
 uiProtobarObject.prototype.showButtons=function(idList){
 if(!idList){
 for(var i=0;i<this.itemsCount;i++){
 this.items[i].getTopNode().style.display="";
 this.items[i].hide=0;
}
 return 0;
}
 
 var temp=idList.split(",");
 for(var i=0;i<temp.length;i++)
{
 this.showItem(temp[i]);
};
};
 
 uiProtobarObject.prototype.disableItem=function(itemId){
 var z=this.getItem(itemId);
 if(z){if(z.disable)z.disable();}
};
 
 uiProtobarObject.prototype.enableItem=function(itemId){
 var z=this.getItem(itemId);
 if(z){if(z.enable)z.enable();}
};
 
 
 uiProtobarObject.prototype.hideItem=function(itemId){
 var z=this.getItem(itemId);
 if(z){z.getTopNode().style.display="none";z.hide=1;}
}
 
 uiProtobarObject.prototype.showItem=function(id){
 var z=this.getItem(id);
 if(z){z.getTopNode().style.display="";z.hide=0;}
}
 
 uiProtobarObject.prototype.setOnClickHandler=function(func){
 if(typeof(func)=="function")this.defaultAction=func;else this.defaultAction=eval(func);
};
 
 uiProtobarObject.prototype.setTitleText=function(newText){
 this.tname=newText;
 this.nameCell.innerHTML=newText;
 this.preNameCell.innerHTML=newText;
};
 
 
 uiProtobarObject.prototype.setBarSize=function(width,height){
 if(width)this.topNod.width=width;
 if(height)this.topNod.height=height;
};
 
 uiProtobarObject.prototype.resetBar=function(idList){
 for(var i=0;i<this.itemsCount;i++)
{
 this.hideItem(this.items[i].id);
 this.items[i].persAction=0;
};
 var temp=idList.split(",");
 for(var i=0;i<temp.length;i++)
{
 this.showItem(temp[i]);
};
};

 
 uiProtobarObject.prototype.loadXML=function(file){this.xmlUnit.loadXML(file);};

 
 uiProtobarObject.prototype.loadXMLString=function(xmlString){this.xmlUnit.loadXMLString(xmlString);};

 
 uiProtobarObject.prototype.showBar=function(){this.topNod.style.display="";if(this.onShow)this.onShow();};
 
 uiProtobarObject.prototype.hideBar=function(){this.topNod.style.display="none";if(this.onHide)this.onHide();};
 
 uiProtobarObject.prototype.setBarAlign=function(align){
 if((align=="left")||(align=="top")){this.preNameCell.innerHTML="";
 this.preNameCell.style.display="none";
 this.nameCell.style.display="";
 this.nameCell.width="100%";
 this.nameCell.innerHTML=this.tname;
 
};
 if((align=="center")||(align=="middle")){
 this.preNameCell.style.display="";
 this.preNameCell.width="50%";
 this.nameCell.style.display="";
 this.nameCell.width="50%";
 this.nameCell.innerHTML=this.tname;
 this.preNameCell.innerHTML=this.tname;
};
 if((align=="right")||(align=="bottom")){
 this.nameCell.innerHTML="";
 this.nameCell.style.display="none";
 this.preNameCell.style.display="";
 this.preNameCell.width="100%";
 this.preNameCell.innerHTML=this.tname;
};
};
 
 uiProtobarObject.prototype.dummyFunc=function(){return true;};
 uiProtobarObject.prototype.badDummy=function(){return false;};
 
 

 
function uiButtonPrototypeObject(){
 return this;
};
 
 uiButtonPrototypeObject.prototype.setAction=function(func){
 if(typeof(func)=="function")this.action=func;else this.action=eval(func);
}
 
 uiButtonPrototypeObject.prototype.setSecondAction=function(func){
 if(typeof(func)=="function")this.persAction=func;else this.persAction=eval(func);
};
 
 uiButtonPrototypeObject.prototype.enable=function(){
 if(this.disableImage)this.imageTag.src=this.src;
 else 
 if(!this.className)
 this.topNod.className=this.objectNode.className;
 else 
 this.topNod.className=this.className;

 if(this.textTag)
 this.textTag.className=this.textClassName;
 
 this.topNod.onclick=this._onclickX;
 this.topNod.onmouseover=this._onmouseoverX;
 this.topNod.onmouseout=this._onmouseoutX;
 this.topNod.onmousedown=this._onmousedownX;
 this.topNod.onmouseup=this._onmouseupX;
};
 
 uiButtonPrototypeObject.prototype.disable=function(){
 if(this.disableImage)
{
 this.imageTag.src=this.disableImage;
}
 else this.topNod.className="iconGray";
 
 if(this.textTag)
 this.textTag.className="buttonTextDisabled";
 
 
 this.topNod.onclick=this.dummy;
 this.topNod.onmouseover=this.dummy;
 this.topNod.onmouseout=this.dummy;
 this.topNod.onmousedown=this.dummy;
 this.topNod.onmouseup=this.dummy;
};

 
 uiButtonPrototypeObject.prototype._onclickX=function(e,that){
 if(!that)that=this.objectNode;
 if(that.topNod.dstatus)return;
 if((!that.persAction)||(that.persAction()))
 if(that.action){that.action(that.id);}
};
 
 uiButtonPrototypeObject.prototype.setHTML=function(htmlText){
 this.topNod.innerHTML=htmlText;
};
 
 uiButtonPrototypeObject.prototype.setAltText=function(imageText){
 this.imageTag.alt=imageText;
};
 
 uiButtonPrototypeObject.prototype.setImage=function(imageSrc,disabledImageSrc){
 this.src=imageSrc;
 if(disabledImageSrc)this.disableImage=disabledImageSrc;
 
 if(this.topNod.onclick==this.dummy)
{if(disabledImageSrc)this.imageTag.src=disabledImageSrc;}
 else
 this.imageTag.src=imageSrc;
};
 
 uiButtonPrototypeObject.prototype.dummy=function(){};
 
 uiButtonPrototypeObject.prototype.getTopNode=function(){return this.topNod;}
 
 uiButtonPrototypeObject.prototype._onmouseoverY=function(){if(this.topNod.className!=this.className+'Over')this.topNod.className=this.className+'Over';return true;};
 
 uiButtonPrototypeObject.prototype._onmouseoutY=function(){this.topNod.className=this.className;return true;};
 
 uiButtonPrototypeObject.prototype._onmousedownX=function(){this.className=this.objectNode.className+'Down';return true;};
 
 uiButtonPrototypeObject.prototype._onmouseupX=function(){this.className=this.objectNode.className;return true;};


 
 uiButtonPrototypeObject.prototype._onmouseoutX=function(e){
 if(!e)e=event;
 e.cancelBubble=true;
 if(this.timeoutop)clearTimeout(this.timeoutop);
 this.timeoutop=setTimeout(this.objectNode._delayedTimerCall(this.objectNode,"_onmouseoutY"),10);
};
 
 uiButtonPrototypeObject.prototype._onmouseoverX=function(e){
 if(!e)e=event;
 e.cancelBubble=true;
 if(this.timeoutop)clearTimeout(this.timeoutop);
 this.timeoutop=setTimeout(this.objectNode._delayedTimerCall(this.objectNode,"_onmouseoverY"),10);
};
 
 uiButtonPrototypeObject.prototype._delayedTimerCall=function(object,functionName,time){
 this.callFunc=function(){
 eval("object."+functionName+"();");
}
 return this.callFunc;
}

function uiTabBar(parentObject,mode,height)
{
 mode=mode||"top";
 this._mode=mode+"/";


 
 if(typeof(parentObject)!="object")
 this.entBox=document.getElementById(parentObject);
 else
 this.entBox=parentObject;

 this.width = this.entBox.getAttribute("width")||(window.getComputedStyle?window.getComputedStyle(this.entBox,null)["width"]:(this.entBox.currentStyle?this.entBox.currentStyle["width"]:0))|| "100%";
 this.height = this.entBox.getAttribute("height")||(window.getComputedStyle?window.getComputedStyle(this.entBox,null)["height"]:(this.entBox.currentStyle?this.entBox.currentStyle["height"]:0))|| "100%";
 this.activeTab = null;
 this.tabsId = new Object();

 this._align="left";
 this._offset=5;
 this._margin=1;
 this._height=parseInt(height||20);
 this._bMode=(mode=="right"||mode=="bottom");
 this._tabSize='150px';
 this._content=new Array();
 this._tbst="win_text";
 this._styles={
 winDflt:["p_left.gif","p_middle.gif","p_right.gif","a_left.gif","a_middle.gif","a_right.gif","a_middle.gif",3,3,6,"#F4F3EE","#EEEEEE"],
 winScarf:["with_bg/p_left.gif","with_bg/p_middle.gif","with_bg/p_right_skos.gif","with_bg/a_left.gif","with_bg/a_middle.gif","with_bg/a_right_skos.gif","with_bg/p_middle_over.gif",3,18,6,false,false],
 winBiScarf:["with_bg/p_left_skos.gif","with_bg/p_middle.gif","with_bg/p_right_skos.gif","with_bg/a_left_skos.gif","with_bg/a_middle.gif","with_bg/a_right_skos.gif","with_bg/p_middle_over.gif",18,18,6,false,false],
 winRound:["circuses/p_left.gif","circuses/p_middle.gif","circuses/p_right.gif","circuses/a_left.gif","circuses/a_middle.gif","circuses/a_right.gif","circuses/p_middle_over.gif",10,10,6,false,false]

};
 this._createSelf(mode=="right"||mode=="left");
 this.setStyle("winDflt");
 return this;
}

 
uiTabBar.prototype.setOffset = function(offset){
 this._offset=offset;
}
 
uiTabBar.prototype.setAlign = function(align){
 if(align=="top")align="left";
 if(align=="bottom")align="right";
 this._align=align;
}
 
uiTabBar.prototype.setMargin = function(margin){
 this._margin=margin;
}





 
uiTabBar.prototype._createSelf = function(vMode)
{
 this._tabAll=document.createElement("DIV");
 this._tabZone=document.createElement("DIV");
 this._conZone=document.createElement("DIV");


 this.entBox.appendChild(this._tabAll);
 
if(this._bMode){
 this._tabAll.appendChild(this._conZone);
 this._tabAll.appendChild(this._tabZone);
}
 else
 
{
 this._tabAll.appendChild(this._tabZone);
 this._tabAll.appendChild(this._conZone);
}


 this._vMode=vMode;
 
 if(vMode){
 this._tabAll.className='dhx_tabbar_zoneV';
 this._setSizes=this._setSizesV;
 this._redrawRow=this._redrawRowV;

}
 else
 
 this._tabAll.className='dhx_tabbar_zone';

 
 if(this._bMode)
 this._tabAll.className+='B';
 
 this._tabZone.className='dhx_tablist_zone';
 this._conZone.className='dhx_tabcontent_zone';

 this._tabAll.onselectstart = function(){return false;};
 this._tabAll.onclick = this._onClickHandler;
 this._tabAll.onmouseover = this._onMouseOverHandler;
 if(_isFF)
 this._tabZone.onmouseout = this._onMouseOutHandler;
 else
 this._tabZone.onmouseleave = this._onMouseOutHandler;
 this._tabAll.tabbar=this;

 this._lineA=document.createElement("div");
 this._lineA.className="dhx_tablist_line";

 this._lineA.style[vMode?"left":"top"]=(this._bMode?0:(this._height+2))+"px";
 this._lineA.style[vMode?"height":"width"]=this[vMode?"height":"width"];
 
 if(vMode)
 this._conZone.style.height=this.height;
 else
 
 this._conZone.style.width=this.width;

 this.rows=new Array();
 this.rowscount=1;
 this._createRow();
 this._setSizes();
}

 
uiTabBar.prototype._createRow = function(){
 var z=document.createElement("DIV");
 z.className='dhx_tabbar_row';
 this._tabZone.appendChild(z);
 z._rowScroller=document.createElement('DIV');
 z._rowScroller.style.display="none";
 z.appendChild(z._rowScroller);
 this.rows[this.rows.length]=z;
 
 if(this._vMode){
 z.style.width=this._height+3+"px";
 z.style.height=parseInt(this.height)+"px";
 if(!this._bMode)
 this.setRowSizesA();
 else
 this.setRowSizesB();
}
 else
 
{
 z.style.height=this._height+3+"px";
 z.style.width=parseInt(this.width)+"px";
}

 z.appendChild(this._lineA);
}
 
uiTabBar.prototype._setSizes = function(){
 this._tabAll.height=this.height;
 this._tabAll.width=this.width;

 if(this._tabZone.childNodes.length)
 var z=this._tabZone.lastChild.offsetTop-this._tabZone.firstChild.offsetTop+this._height+(_isIE?5:0);
 else
 var z=this._height+(_isIE?5:0);
 this._tabZone.style.height=z-2+"px";
 this._conZone.style.height=parseInt(this.height)-z-4+"px";
}
 
 
uiTabBar.prototype._setSizesV = function(){
 this._tabAll.height=this.height;
 this._tabAll.width=this.width;

 var z=this._height*this.rows.length;

 if(!this._bMode){
 this._tabZone.style.width=z+3+"px";
 this._conZone.style.width=parseInt(this.width)-z+"px";
 this._conZone.style.left= z+3+"px";
}
 else{
 this._tabZone.style.width=z+3+"px";
 this._conZone.style.width=parseInt(this.width)-z+"px";
 this._tabZone.style.left=parseInt(this.width)-z+"px";
}

 this._conZone.style.height=this.height;
 this._tabZone.style.height=this.height;
}


 
uiTabBar.prototype._redrawRowV=function(row){
 var talign=this._align=="left"?"top":"bottom";
 var count=parseInt(this._offset);
 for(var i=0;i<row.tabCount;i++){
 row.childNodes[i]._cInd=i;
 row.childNodes[i].style[talign]=count+"px";
 count+=row.childNodes[i]._offsetSize+parseInt(this._margin);
}


};



 
uiTabBar.prototype.setRowSizesA=function(){
 for(var i=0;i<this.rows.length;i++){
 this.rows[i].style.left=i*this._height+"px";
 this.rows[i].style.zIndex=5+i;
}
}
 
uiTabBar.prototype.setRowSizesB=function(){
 for(var i=this.rows.length-1;i>=0;i--){
 this.rows[i].style.left=i*this._height+"px";
 this.rows[i].style.zIndex=15-i;
}
}
 
uiTabBar.prototype.setRowSizesC=function(){
 for(var i=this.rows.length-1;i>=0;i--){
 this.rows[i].style.zIndex=15-i;
}
}

 


 
uiTabBar.prototype._onMouseOverHandler=function(e)
{
 if(_isIE)
 var target = event.srcElement;
 else
 var target = e.target;
 target=this.tabbar._getTabTarget(target);
 if(!target){
 this.tabbar._hideHover(target);return;
}

 this.tabbar._showHover(target);
}
 
uiTabBar.prototype._onMouseOutHandler=function(e)
{
 this.parentNode.tabbar._hideHover(null);return;
}




 
uiTabBar.prototype._onClickHandler=function(e)
{
 if(_isIE)
 var target = event.srcElement;
 else
 var target = e.target;

 target=this.tabbar._getTabTarget(target);
 if(!target)return;

 this.tabbar._setTabActive(target);
}

 
uiTabBar.prototype._getTabTarget=function(t){
 while(t.className.indexOf("dhx_tab_element")==-1){
 if(t.className.indexOf("dhx_tabbar_zone")!=-1)return null;
 t=t.parentNode;
}
 return t;
}
 
uiTabBar.prototype._redrawRow=function(row){
 var count=parseInt(this._offset);
 for(var i=0;i<row.tabCount;i++){
 row.childNodes[i]._cInd=i;
 row.childNodes[i].style[this._align]=count+"px";
 count+=row.childNodes[i]._offsetSize+parseInt(this._margin);
}

};


 
uiTabBar.prototype.addTab = function(id,text,size,position,row){
 row=row||0;

 var z=this.rows[row].tabCount||0;
 if((!position)&&(position!==0))
 position=z;

 var tab=this._createTab(text,size);
 tab.idd=id;
 this.tabsId[id] = tab;

 this.rows[row].insertBefore(tab,this.rows[row].childNodes[position]);

 this.rows[row].tabCount=z+1;
 this._redrawRow(this.rows[row]);
 this._setSizes();
}

 
uiTabBar.prototype._showHover=function(tab){
 this._hideHover(tab);
 if(tab==this._lastActive)return;
 switch(this._tbst){
 case "win_text":
 tab._lChild.style.backgroundImage='url('+this._imgPath+this._mode+this._styles[this._cstyle][6]+')';
 break;
}
 this._lastHower=tab;
}
 
uiTabBar.prototype._hideHover=function(tab){
 if((!this._lastHower)||(this._lastHower==tab)||(this._lastHower==this._lastActive))
 return;
 switch(this._tbst){
 case "win_text":
 this._lastHower._lChild.style.backgroundImage='url('+this._imgPath+this._mode+this._styles[this._cstyle][1]+')';
 break;
}
 this._lastHower=null;
}

 
uiTabBar.prototype._getTabById=function(tabId){
 return this.tabsId[tabId];
}

 
uiTabBar.prototype.setTabActive=function(tabId){
 var tab=this._getTabById(tabId);
 if(tab)this._setTabActive(tab);
}
 
uiTabBar.prototype._setTabActive=function(tab){
 if((this._onsel)&&(!this._onsel(tab.idd,this._lastActive?this._lastActive.idd:null)))return;
 if(this._lastActive)
 this._lastActive.className=this._lastActive.className.replace(/dhx_tab_element_active/g,"dhx_tab_element_inactive");
 tab.className=tab.className.replace(/dhx_tab_element_inactive/g,"dhx_tab_element_active");
 if((this._lastActive)&&(this._styles[this._cstyle][10]))
 this._lastActive.style.backgroundColor=this._styles[this._cstyle][10];
 if(this._styles[this._cstyle][11])
 tab.style.backgroundColor=this._styles[this._cstyle][11];

 
 if(this._vMode){
 switch(this._tbst){
 case "win_text":
 if(this._lastActive){
 this._lastActive._lChild.style.backgroundImage='url('+this._imgPath+this._mode+this._styles[this._cstyle][1]+')';
 this._lastActive.childNodes[0].childNodes[0].src=this._imgPath+this._mode+this._styles[this._cstyle][0];
 this._lastActive.childNodes[1].childNodes[0].src=this._imgPath+this._mode+this._styles[this._cstyle][2];
 this._lastActive.style.height=parseInt(this._lastActive.style.height)-this._styles[this._cstyle][9]+"px";
 this._lastActive._lChild.style.height=parseInt(this._lastActive._lChild.style.height)-this._styles[this._cstyle][9]+"px";
 this._lastActive.style[this._align=="right"?"marginBottom":"marginTop"]="0px"
 this._lastActive.style.width=this._height+1+"px";
 if(this._bMode)
 this._lastActive._lChild.style.width=this._height+1+"px";
}

 tab._lChild.style.backgroundImage='url('+this._imgPath+this._mode+this._styles[this._cstyle][4]+')';
 tab.childNodes[0].childNodes[0].src=this._imgPath+this._mode+this._styles[this._cstyle][3];
 tab.childNodes[1].childNodes[0].src=this._imgPath+this._mode+this._styles[this._cstyle][5];
 tab.style.height=parseInt(tab.style.height)+this._styles[this._cstyle][9]+"px";
 tab._lChild.style.height=parseInt(tab._lChild.style.height)+this._styles[this._cstyle][9]+"px";
 tab.style[this._align=="right"?"marginBottom":"marginTop"]="-3px"
 tab.style.width=this._height+3+"px";
 if(this._bMode)
 tab._lChild.style.width=this._height+3+"px";
 break;
}
}
 else
 
{
 switch(this._tbst){
 case "win_text":
 if(this._lastActive){
 this._lastActive._lChild.style.backgroundImage='url('+this._imgPath+this._mode+this._styles[this._cstyle][1]+')';
 this._lastActive.childNodes[0].childNodes[0].src=this._imgPath+this._mode+this._styles[this._cstyle][0];
 this._lastActive.childNodes[1].childNodes[0].src=this._imgPath+this._mode+this._styles[this._cstyle][2];
 this._lastActive.style.width=parseInt(this._lastActive.style.width)-this._styles[this._cstyle][9]+"px";
 this._lastActive._lChild.style.width=parseInt(this._lastActive._lChild.style.width)-this._styles[this._cstyle][9]+"px";
 this._lastActive.style[this._align=="left"?"marginLeft":"marginRight"]="0px"
 this._lastActive.style.height=this._height+1+"px";
 
 if(this._bMode)
 this._lastActive._lChild.style.height=this._height+1+"px";
 
}

 tab._lChild.style.backgroundImage='url('+this._imgPath+this._mode+this._styles[this._cstyle][4]+')';
 tab.childNodes[0].childNodes[0].src=this._imgPath+this._mode+this._styles[this._cstyle][3];
 tab.childNodes[1].childNodes[0].src=this._imgPath+this._mode+this._styles[this._cstyle][5];
 tab.style.width=parseInt(tab.style.width)+this._styles[this._cstyle][9]+"px";
 tab._lChild.style.width=parseInt(tab._lChild.style.width)+this._styles[this._cstyle][9]+"px";
 tab.style[this._align=="left"?"marginLeft":"marginRight"]="-3px"
 tab.style.height=this._height+3+"px";
 
 if(this._bMode)
 tab._lChild.style.height=this._height+3+"px";
 
 break;
}
}

 this._lastActive=tab;


 this._setContent(tab);
}





 
uiTabBar.prototype._createTab = function(text,size){
 var tab=document.createElement("DIV");
 tab.className='dhx_tab_element dhx_tab_element_inactive';
 var thml="";

 switch(this._tbst){
 case 'text':
 thml=text;
 break;
 case 'win_text':
 
 if(this._vMode)
{
 thml='<div style="position:absolute;'+(this._bMode?"right":"left")+':0px;top:0px;height:'+this._styles[this._cstyle][7]+'px;width:'+(this._height+3)+'px;"><img src="'+this._imgPath+this._mode+this._styles[this._cstyle][0]+((this._bMode&&(_isFF||_isOpera))?'" style="position:absolute;right:1px;"':'"')+'></div>';
 thml+='<div style="position:absolute;'+(this._bMode?"right":"left")+':0px;bottom:0px;height:'+this._styles[this._cstyle][8]+'px;width:'+(this._height+3)+'px;"><img src="'+this._imgPath+this._mode+this._styles[this._cstyle][2]+((this._bMode&&(_isFF||_isOpera))?'" style="position:absolute;right:1px;"':'"')+'></div>';
 thml+='<div style="position:absolute;background-repeat: repeat-y;background-image:url('+this._imgPath+this._mode+this._styles[this._cstyle][1]+');width:'+(this._height)+'px;left:0px;top:'+this._styles[this._cstyle][7]+'px;height:'+(parseInt(size||this._tabSize)-this._styles[this._cstyle][8]-this._styles[this._cstyle][7]+"px")+'">'+text+'</div>';
}
 else
 
{
 thml='<div style="position:absolute;'+(this._bMode?"bottom":"top")+':0px;left:0px;width:'+this._styles[this._cstyle][7]+'px;height:'+(this._height+3)+'px;"><img src="'+this._imgPath+this._mode+this._styles[this._cstyle][0]+((this._bMode&&_isFF)?'" style="position:absolute;bottom:0px;"':'"')+'></div>';
 thml+='<div style="position:absolute;'+(this._bMode?"bottom":"top")+':0px;right:0px;width:'+this._styles[this._cstyle][8]+'px;height:'+(this._height+3)+'px;"><img src="'+this._imgPath+this._mode+this._styles[this._cstyle][2]+((this._bMode&&_isFF)?'" style="position:absolute;bottom:0px;left:0px;"':'"')+'></div>';
 thml+='<div style="position:absolute;background-repeat: repeat-x;background-image:url('+this._imgPath+this._mode+this._styles[this._cstyle][1]+');height:'+(this._height+(this._bMode?1:3))+'px;top:0px;left:'+this._styles[this._cstyle][7]+'px;width:'+(parseInt(size||this._tabSize)-this._styles[this._cstyle][8]-this._styles[this._cstyle][7]+"px")+';"><div style="padding-top:3px;">'+text+'<div></div>';
}
 if(!this._styles[this._cstyle][10])tab.style.backgroundColor='transparent';
 else tab.style.backgroundColor=this._styles[this._cstyle][10];
 break;
}
 tab.innerHTML=thml;
 tab._lChild=tab.childNodes[tab.childNodes.length-1];


 
 if(this._vMode)
{
 tab.style.height=size||this._tabSize;
 tab.style.width=this._height+1+"px";
}
 else
 
{
 tab.style.width=size||this._tabSize;
 tab.style.height=this._height+1+"px";
}

 tab._offsetSize=parseInt(size||this._tabSize);
 return tab;
}

 
uiTabBar.prototype.clearAll = function(){
 this.tabsId=new Array();
 this.rows=new Array();
 this._lastActive=null;
 this._lastHower=null;
 this.entBox.innerHTML="";
 this._createSelf();
 this.setStyle(this._cstyle);
}



 
uiTabBar.prototype.setImagePath = function(path){
 this._imgPath=path;
}




 
uiTabBar.prototype.loadXMLString=function(xmlString,afterCall){
 this.XMLLoader=new xmlLoaderObject(this._parseXML,this);
 this.waitCall=afterCall||0;
 this.XMLLoader.loadXMLString(xmlString);
};
 
 uiTabBar.prototype.loadXML=function(file,afterCall){
 this.XMLLoader=new xmlLoaderObject(this._parseXML,this);
 this.waitCall=afterCall||0;
 this.XMLLoader.loadXML(file);
}
 
 uiTabBar.prototype._parseXML=function(that,a,b,c,obj){
 var selected="";
 if(!obj)obj=that.XMLLoader;
 var arows = obj.doXPath("//row");
 var atop=obj.getXMLTopNode("tabbar");
 
 that._hrfmode=atop.getAttribute("hrefmode")||that._hrfmode;
 
 
 that._margin =atop.getAttribute("margin")||that._margin;
 that._align =atop.getAttribute("align")||that._align;
 that._offset =atop.getAttribute("offset")||that._offset;

 var acs=atop.getAttribute("tabstyle");
 if(acs)that.setStyle(acs);

 acs=atop.getAttribute("skinColors");
 if(acs)that.setSkinColors(acs.split(",")[0],acs.split(",")[1]);
 
 for(var i=0;i<arows.length;i++){
 var atabs = obj.doXPath("./tab",arows[i]);
 for(var j=0;j<atabs.length;j++){
 var width=atabs[j].getAttribute("width");
 var name=atabs[j].firstChild?atabs[j].firstChild.data:"";
 var id=atabs[j].getAttribute("id");
 that.addTab(id,name,width,"",i);
 if(atabs[j].getAttribute("selected"))selected=id;

 
 if(that._hrfmode)
 that.setContentHref(id,atabs[j].getAttribute("href"));
 else
 
 
 for(var k=0;k<atabs[j].childNodes.length;k++)
 if(atabs[j].childNodes[k].tagName=="content")
 that.setContentHTML(id,atabs[j].childNodes[k].firstChild?atabs[j].childNodes[k].firstChild.data:"");
 


}
}
 if(selected)that.setTabActive(selected);
}
 
 
 uiTabBar.prototype.setHrefMode=function(mode){
 this._hrfmode=mode;
}
 
 uiTabBar.prototype.setContentHref=function(id,href){
 if(!this._hrefs)this._hrefs=new Array();
 this._hrefs[id]=href;

 switch(this._hrfmode){
 case "iframe":
 if(!this._glframe){
 var z=document.createElement("DIV");
 z.style.width='100%';
 z.style.height='100%';
 z.innerHTML="<iframe frameborder='0' width='100%' height='100%' src='about:blank'></iframe>";
 this._glframe=z.childNodes[0];
 this._conZone.appendChild(this._glframe);
}
 break;
 case "iframes":
 var z=document.createElement("DIV");
 z.style.width='100%';
 z.style.height='100%';
 z.style.display='none';
 z.innerHTML="<iframe frameborder='0' width='100%' height='100%' src='about:blank'></iframe>";
 z.childNodes[0].src=href;
 this.setContent(id,z);
 this._conZone.appendChild(z);
 break;
 case "ajax":
 var z=document.createElement("DIV");
 z.style.width='100%';
 z.style.height='100%';
 this.setContent(id,z);
 break;
}
}
 uiTabBar.prototype._ajaxOnLoad=function(obj,a,b,c,loader){
 var z=loader.getXMLTopNode("content");
 var id=z.getAttribute("tab");
 if(z.textContent)
 obj._content[id].innerHTML=z.textContent;
 else
 obj._content[id].innerHTML=z.firstChild?z.firstChild.data:"";
 
 //ejecutamos el JavaScript (necesaria la librería prototype.js)
 var html = obj._content[id].innerHTML;
 if(html.evalScripts) html.evalScripts();

}

 


 
 uiTabBar.prototype.setOnSelectHandler=function(func){
 if(typeof(func)=="function")
 this._onsel=func;
 else
 this._onsel=eval(func);
}
 
 uiTabBar.prototype.setContent=function(id,nodeId){
 if(typeof(nodeId)=="string")
 nodeId=document.getElementById(nodeId);

 if(!nodeId)return;

 this._content[id]=nodeId;
 if(nodeId.parentNode)nodeId.parentNode.removeChild(nodeId);
 if((this._lastActive)&&(this._lastActive.idd==id))this._setContent(this._lastActive);
}
 
 uiTabBar.prototype._setContent=function(tab){
 
 if(this._hrfmode)
 switch(this._hrfmode){
 case "iframe":
 this._glframe.src=this._hrefs[tab.idd];
 return;
 break;
 case "iframes":
 if(this._lastIframe)
 this._lastIframe.style.display="none";
 this._content[tab.idd].style.display="block";
 this._lastIframe=this._content[tab.idd];
 return;
 break;
 case "ajax":
 var z=this._content[tab.idd]; 
 if(!z._loaded){
 z.innerHTML="<div class='dhx_ajax_loader'><img src='"+this._imgPath+"loading_blue.gif' />&nbsp;Loading...</div>";
(new xmlLoaderObject(this._ajaxOnLoad,this,true)).loadXML(this._hrefs[tab.idd]);
 z._loaded=true;
}
 break;
}
 
 if(this._conZone.childNodes.length)this._conZone.removeChild(this._conZone.childNodes[0]);
 if(this._content[tab.idd])
 this._conZone.appendChild(this._content[tab.idd]);
}
 
 uiTabBar.prototype.setContentHTML=function(id,html){
 var z=document.createElement("DIV");
 z.style.width="100%";
 z.style.height="100%";
 z.style.overflow="auto";
 z.innerHTML=html;
 this.setContent(id,z);
}

 
 uiTabBar.prototype.setStyle=function(name){
 if(this._styles[name]){
 this._cstyle=name;
 this._conZone.style.backgroundColor=this._styles[this._cstyle][11];
}
}


 
 uiTabBar.prototype.allignToContainer=function(id,mode){
 if(id)
 this._conZone.style.display='none';

 if(typeof(id)!="object")
 id=document.getElementById(id);
 if(!id)return;

 this.entBox.style.position='absolute';
 document.body.appendChild(this.entBox);

 switch(mode){
 case "t":
 this.entBox.style.top=getAbsoluteTop(id)-this.entBox.offsetHeight+"px";
 this.entBox.style.left=getAbsoluteLeft(id)-this.entBox.offsetWidth+"px";
 break;
}
}

uiTabBar.prototype.setTabBarStyle = function(name){
 this._tbst=name;
}
 

 
 uiTabBar.prototype.enableContentZone=function(mode){
 this._conZone.style.display=convertStringToBoolean(mode)?"":'none';
}

 
 uiTabBar.prototype.setSkinColors=function(a_tab,p_tab){
 this._styles[this._cstyle][10]=p_tab;
 this._styles[this._cstyle][11]=a_tab;
 this._conZone.style.backgroundColor=a_tab;
}

 
uiTabBar.prototype.getActiveTab=function(){
 if(this._lastActive)return this._lastActive.idd;
 return null;
}
 
uiTabBar.prototype.goToNextTab=function(){
 if(this._lastActive){
 if(this._lastActive.nextSibling.idd){
 this._setTabActive(this._lastActive.nextSibling);
 return this._lastActive.nextSibling.idd;
}
 else
 if(this._lastActive.parentNode.nextSibling){
 var arow=this._lastActive.parentNode.nextSibling;
 this._setTabActive(arow.childNodes[0]);
 return arow.childNodes[0].idd;
}
}
 return null;
}
 
uiTabBar.prototype.goToPrevTab=function(){
 if(this._lastActive){
 if(this._lastActive.previousSibling){
 this._setTabActive(this._lastActive.previousSibling);
 return this._lastActive.idd;
}
 else
 if(this._lastActive.parentNode.previousSibling){
 var arow=this._lastActive.parentNode.previousSibling;
 this._setTabActive(arow.childNodes[arow.tabCount-1]);
 return this._lastActive.idd;
}
}
 return null;
}

 function uiToolbarObject(htmlObject,width,height,name,vMode){
 this.width=width;this.height=height;
 if(typeof(htmlObject)!="object")
 this.parentObject=document.getElementById(htmlObject);
 else
 this.parentObject=htmlObject;
 
 this.xmlDoc=0;
 this.topNod=0;this.dividerCell=0;this.firstCell=0;this.nameCell=0;this.crossCell=0;
 this.items=new Array();this.itemsCount=0;
 this.defaultAction=0;
 this.extraMode=convertStringToBoolean(vMode);
 this.onShow=0;this.onHide=0;
 this.oldMouseMove=0;
 this.tname=name;
 
 this.gecko=(document.all?0:1);
 
 this.tableCSS="toolbarTable";
 this.titleCSS="toolbarName";
 
 if(!this.extraMode)
 this._create_self();
 else
{
 this._create_self_vertical();
 this.addItem=this._addItem_vertical;
};
 
 if(this._extendedInit)this._extendedInit();
 this.xmlUnit=new xmlLoaderObject(this._parseXMLTree,this);
 return this;
 
};

 uiToolbarObject.prototype = new uiProtobarObject;

 
 
 

 uiToolbarObject.prototype.addItem=function(item,position){
 if((!position)||(position>this.itemsCount))
 position=this.itemsCount;

 if(position==this.itemsCount)
 this.firstCell.parentNode.insertBefore(item.getTopNode(),this.firstCell);
 else
 this.firstCell.parentNode.insertBefore(item.getTopNode(),this.items[position].getTopNode());

 item.parentNod=this;
 if(this.defaultAction)item.setAction(this.defaultAction);

 for(var i=position;i<this.itemsCount+1;i++){
 var a=this.items[i];
 this.items[i]=item;
 item=a;
}

 this.itemsCount++;
}

 
 uiToolbarObject.prototype._addItem_vertical=function(item,position){
 if((!position)||(position>this.itemsCount))
 position=this.itemsCount;

 var tr=document.createElement("tr");
 tr.style.verticalAlign="top";
 tr.appendChild(item.getTopNode());

 if(position==this.itemsCount)
 this.firstCell.parentNode.parentNode.insertBefore(tr,this.firstCell.parentNode);
 else
 this.firstCell.parentNode.parentNode.insertBefore(tr,this.items[position].getTopNode().parentNode);

 item.parentNod=this;
 if(this.defaultAction)item.setAction(this.defaultAction);

 for(var i=position;i<this.itemsCount+1;i++){
 var a=this.items[i];
 this.items[i]=item;
 item=a;
}

 this.itemsCount++;
}
 

 
 
 uiToolbarObject.prototype._getItemIndexByPosition=function(position){
 var j=0;
 for(var i=0;i<this.itemsCount;i++)
{
 if(this.items[i].hide!=1)j++;
 if(j==position)return i;
};
 return -1;
};


 
 
 uiToolbarObject.prototype.getItemByPosition=function(position){
 var z=this._getItemIndexByPosition(position);
 if(z>=0)return this.items[z];
};
 
 uiToolbarObject.prototype.removeItemById=function(itemId){
 var z=this._getItemIndex(itemId);
 if(z>=0){
 if(this.items[z].removeItem)this.items[z].removeItem();
 this.firstCell.parentNode.removeChild(this.items[z].getTopNode());
 this.items[z]=0;
 this.itemsCount--;
 for(var i=z;i<this.itemsCount;i++){
 this.items[i]=this.items[i+1];
}
}
}
 
 uiToolbarObject.prototype.removeItemByPosition=function(position){
 var z=this._getItemIndexByPosition(position);
 if(z){
 if(this.items[z].removeItem)this.items[z].removeItem();
 this.firstCell.parentNode.removeChild(this.items[z].getTopNode());
 this.items[z]=0;
 this.itemsCount--;
 for(var i=z;i<this.itemsCount;i++){
 this.items[i]=this.items[i+1];
}
}
 
}

 
 uiToolbarObject.prototype.hideItemByPosition=function(position){
 var z=this.getItemByPosition(position);
 if(z){z.getTopNode().style.display="none";z.hide=1;}
}

 

 
 
 
 uiToolbarObject.prototype._parseXMLTree=function(that,node){
 if(!node)node=that.xmlUnit.getXMLTopNode("toolbar");

 var toolbarAlign=node.getAttribute("toolbarAlign");
 if(toolbarAlign)that.setBarAlign(toolbarAlign);
 
 var absolutePosition=node.getAttribute("absolutePosition");
 if(absolutePosition=="yes"){
 that.topNod.style.position="absolute";
 that.topNod.style.top=node.getAttribute("left")||0;
 that.topNod.style.left=node.getAttribute("top")||0;
};
 if((absolutePosition!="auto")&&(absolutePosition!="yes"))that.dividerCell.style.display="none";
 var name=node.getAttribute("name");if(name)that.setTitleText(name);
 var width=node.getAttribute("width");var height=node.getAttribute("height");
 
 that.setBarSize(width,height);
 
 var globalTextCss=node.getAttribute("globalTextCss");
 var globalCss=node.getAttribute("globalCss");
 
 for(var i=0;i<node.childNodes.length;i++)
{
 var localItem=node.childNodes[i];
 if(localItem.nodeType==1)
{
 if((!localItem.getAttribute("className"))&&(globalCss))
 localItem.setAttribute("className",globalCss);
 
 if((!localItem.getAttribute("textClassName"))&&(globalTextCss))
 localItem.setAttribute("textClassName",globalTextCss);
 
 
 var z=eval("window.ui"+localItem.tagName+"Object");
 if(z)
 var TempNode= new z(localItem);
 else 
 var TempNode=null;
 
 if(localItem.tagName=="divider")
{
 var imid=localItem.getAttribute("id");
 if(that.extraMode)
 that.addItem(new uiToolbarDividerYObject(imid));
 else 
 that.addItem(new uiToolbarDividerXObject(imid));
}
 else
 if(TempNode)
{
 that.addItem(TempNode);
 if(that._extendedParse)that._extendedParse(that,TempNode,localItem);
}
}
}
};

 
 uiToolbarObject.prototype.setToolbarCSS=function(table,title){
 this.tableCSS=table;
 this.titleCSS=title;
 this.topNod.className=this.tableCSS;
 this.preNameCell.className=this.titleCSS;
 this.nameCell.className=this.titleCSS;
 
}
 
 
 uiToolbarObject.prototype._create_self=function()
{
 if(!this.width)this.width=1;
 if(!this.height)this.height=1;
 
 var div=document.createElement("div");
 div.innerHTML='<table cellpadding="0" cellspacing="1" class="'+this.tableCSS+'" style="display:none" width="'+this.width+'" height="'+this.height+'"><tbody>'+
 '<tr>'+
 '<td width="'+(this.gecko?5:3)+'px"><div class="toolbarHandle">&nbsp;</div></td>'+
 '<td class="'+this.titleCSS+'" style="display:none">'+this.name+'</td>'+
 '<td></td>'+
 '<td align="right" width="100%" class="'+this.titleCSS+'" style="display:none">'+this.name+'</td>'+
 '<td></td>'+
 '</tr></tbody></table>';
 var table=div.childNodes[0];
 table.setAttribute("UNSELECTABLE","on");
 table.onselectstart=this.badDummy;
 this.topNod=table;
 this.dividerCell=table.childNodes[0].childNodes[0].childNodes[0];
 this.dividerCell.toolbar=this;
 this.preNameCell=this.dividerCell.nextSibling;
 this.firstCell=this.preNameCell.nextSibling;
 this.nameCell=this.firstCell.nextSibling;
 this.crossCell=this.nameCell.nextSibling;
 
 this.parentObject.appendChild(table);
};
 
 
 uiToolbarObject.prototype._create_self_vertical=function()
{
 if(!this.width)this.width=1;
 if(!this.height)this.height=1;
 
 var div=document.createElement("div");
 div.innerHTML='<table cellpadding="0" cellspacing="1" class="'+this.tableCSS+'" style="display:none" width="'+this.width+'" height="'+this.height+'"><tbody>'+
 '<tr><td heigth="'+(this.gecko?5:3)+'px"><div class="vtoolbarHandle" style="height: 3px;width:100%;overflow:hidden"></div></td></tr>'+
 '<tr><td height="100%" class="'+this.titleCSS+'" style="display:none">'+this.name+'</td></tr>'+
 '<tr><td></td></tr>'+
 '<tr><td align="right" height="100%" class="'+this.titleCSS+'" style="display:none">'+this.name+'</td></tr>'+
 '<tr><td></td></tr>'+
 '</tbody></table>';

 var table=div.childNodes[0];
 table.onselectstart=this.badDummy;
 table.setAttribute("UNSELECTABLE","on");
 
 this.topNod=table;
 this.dividerCell=table.childNodes[0].childNodes[0].childNodes[0];
 this.dividerCell.toolbar=this;
 this.preNameCell=table.childNodes[0].childNodes[1].childNodes[0];
 this.firstCell=table.childNodes[0].childNodes[2].childNodes[0];
 this.nameCell=table.childNodes[0].childNodes[3].childNodes[0];
 this.crossCell=table.childNodes[0].childNodes[4].childNodes[0];
 
 this.parentObject.appendChild(table);
};

 
 

 
 
 function uiImageButtonObject(src,width,height,action,id,tooltip,className,disableImage){
 
 if(src.tagName=="ImageButton")
{
 width=src.getAttribute("width");
 height=src.getAttribute("height");
 id=src.getAttribute("id");
 action=src.getAttribute("imaction");
 tooltip=src.getAttribute("tooltip");
 className=src.getAttribute("className");
 disableImage=src.getAttribute("disableImage");
 disable = src.getAttribute("disable");
 src=src.getAttribute("src");
}
 
 this.topNod=0;this.action=0;this.persAction=0;this.id=id||0;
 this.className=className||"defaultButton";
 this.src=src;this.disableImage=disableImage;
 this.tooltip=tooltip||"";
 
 td=document.createElement("td");
 this.topNod=td;
 td.height=height;td.width=width;td.align="center";
 td.innerHTML="<img src='"+src+"' border='0' title='"+this.tooltip+"' style='padding-left:2px;padding-right:2px;'>";
 td.className=this.className;
 td.objectNode=this;
 this.imageTag=td.childNodes[0];
 if(!disable)
 	this.enable();
 else
 	this.disable();
};

 
 uiImageButtonObject.prototype = new uiButtonPrototypeObject;

 
 
 
 
 function uiToolbarDividerYObject(id){
 this.topNod=0;
 if(id)this.id=id;else this.id=0;
 td=document.createElement("td");
 this.topNod=td;td.align="center";td.style.paddingRight="2";td.style.paddingLeft="2";
 td.innerHTML="<div class='toolbarDividerY'>&nbsp;</div>";
 if(!document.all)td.childNodes[0].style.height="0px";
 return this;
};
 uiToolbarDividerYObject.prototype = new uiButtonPrototypeObject;
 
 

 
 
 function uiToolbarDividerXObject(id){
 this.topNod=0;
 if(id)this.id=id;else this.id=0;
 td=document.createElement("td");
 this.topNod=td;td.align="center";td.style.paddingRight="2";td.style.paddingLeft="2";td.width="4px";
 td.innerHTML="<div class='toolbarDivider'></div >";
 if(!document.all){td.childNodes[0].style.width="0px";td.style.padding="0 0 0 0";td.style.margin="0 0 0 0";}
 return this;
};
 uiToolbarDividerXObject.prototype = new uiButtonPrototypeObject;
 


 
 
 function uiImageTextButtonObject(src,text,width,height,action,id,tooltip,className,textClassName,disableImage){
 if(src.tagName=="ImageTextButton")
{
 width=src.getAttribute("width");
 height=src.getAttribute("height");
 id=src.getAttribute("id");
 action=src.getAttribute("imaction");
 tooltip=src.getAttribute("tooltip");
 className=src.getAttribute("className");
 disableImage=src.getAttribute("disableImage");
 textClassName=src.getAttribute("textClassName");
 if(src.childNodes[0])
 text=src.childNodes[0].data;
 else
 text="";
 src=src.getAttribute("src");
}
 this.topNod=0;
 this.action=0;this.persAction=0;
 this.className=className||"defaultButton";
 this.textClassName=textClassName||"defaultButtonText";
 this.src=src;this.disableImage=disableImage;
 this.tooltip=tooltip||"";this.id=id||0;

 
 td=document.createElement("td");
 this.topNod=td;
 td.height=height;
 td.width=width;td.align="center";
 td.noWrap=true;
 td.innerHTML="<table title='"+this.tooltip+"' width='100%' height='100%' cellpadding='0' cellspacing='0'><tr><td valign='middle'>" +  (src ? "<img src='"+src+"' border='0' style='padding-left:2px;padding-right:2px;'>" : "") + "</td><td width='100%' style='padding-left:5px' align='left' class='"+this.textClassName+"'>"+text+"</td></tr></table>";
 td.className=this.className;
 td.objectNode=this;
 this.imageTag=td.childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0];
 this.textTag=td.childNodes[0].childNodes[0].childNodes[0].childNodes[1];
 this.enable();
 
 

 return this;
};
 
 uiImageTextButtonObject.prototype = new uiButtonPrototypeObject;
 
 uiImageTextButtonObject.prototype.setText = function(newText){
 this.textTag.innerHTML=newText;
};

 



 
 
 function uiSelectButtonObject(id,valueList,displayList,action,width,height,className)
{
 if(id.tagName=="SelectButton")
{
 width=id.getAttribute("width");
 height=id.getAttribute("height");
 className=id.getAttribute("className");
 action=id.getAttribute("imaction");
 valueList="";
 displayList="";
 for(var j=0;j<id.childNodes.length;j++)
{
 var z=id.childNodes[j];
 if((z.nodeType==1)&&(z.tagName == "option"))
{
 if(valueList)valueList+=","+z.getAttribute("value");
 else valueList=z.getAttribute("value");
 if(z.childNodes[0])
{
 if(displayList)displayList+=","+z.childNodes[0].data;
 else displayList=z.childNodes[0].data;
}
 else displayList+=",";
};
};
 id=id.getAttribute("id");
}
 this.topNod=0;
 this.action=0;
 this.persAction=0;
 this.selElement=0;
 if(id)this.id=id;else this.id=0;
 
 
 

 td=document.createElement("td");
 this.topNod=td;td.align="center";
 td.width=width;
 var sel=document.createElement("select");
 this.selElement=sel;
 sel.onchange=this._onclickX;
 sel.objectNode=this;
 if(className)sel.className=className;
 if(width)sel.style.width="100%";
 
 
 var temp1=valueList.split(",");
 
 if(displayList)var temp2=displayList.split(",");
 else var temp2=valueList.split(",");
 for(var i=0;i<temp1.length;i++)
{
 sel.options[sel.options.length]=new Option(temp2[i],temp1[i]);
};
 td.appendChild(sel);
 
 td.className="toolbarNormalButton";
 td.objectNode=this;
 
 return this;
};
 
 
 uiSelectButtonObject.prototype = new uiButtonPrototypeObject;
 
 uiSelectButtonObject.prototype.disable=function(){
 this.selElement.disabled=true;
};
 
 
 uiSelectButtonObject.prototype.enable=function(){
 this.selElement.disabled=false;
};
 

 
 uiSelectButtonObject.prototype._onclickX=function(){
 if((!this.objectNode.persAction)||(this.objectNode.persAction(this.objectNode.selElement.value)))
 if(this.objectNode.action){this.objectNode.action(this.objectNode.id,this.objectNode.selElement.value);}
};

 
 uiSelectButtonObject.prototype.addOption=function(value,display){
 this.selElement.options[this.selElement.options.length]=new Option(display,value);
};
 
 uiSelectButtonObject.prototype.removeOption=function(value){
 var i=this.getIndexByValue(value);
 if(i>=0)this.selElement.removeChild(this.selElement.options[i]);
};
 
 uiSelectButtonObject.prototype.setOptionValue=function(oldValue,newValue){
 var i=this.getIndexByValue(oldValue);
 if(i>=0)this.selElement.options[i].value=newValue;
};
 
 uiSelectButtonObject.prototype.setOptionText=function(value,newText){
 var i=this.getIndexByValue(value);
 if(i>=0)this.selElement.options[i].text=newText;
};
 
 uiSelectButtonObject.prototype.setSelected=function(value){
 var i=this.getIndexByValue(value);
 if(i>=0)this.selElement.options[i].selected=true;
};

 uiSelectButtonObject.prototype.getOptionValue=function(){
 return this.selElement.value;
};
 
 uiSelectButtonObject.prototype.getIndexByValue=function(value){
 for(var i=0;i<this.selElement.options.length;i++)
{
 if(this.selElement.options[i].value==value)
 return i;
};
 return -1;
};
 
 

 
 
function uiTwoStateButtonObject(id,src,text,width,height,action,tooltip,className,textClassName,disableImage,pressedState){
 if(id.tagName=="TwoStateButton")
{
 width=id.getAttribute("width")||1;
 height=id.getAttribute("height")||1;
 action=id.getAttribute("imaction");
 tooltip=id.getAttribute("tooltip");
 className=id.getAttribute("className");
 disableImage=id.getAttribute("disableImage");
 textClassName=id.getAttribute("textClassName");
 pressedState=id.getAttribute("pressedState");
 
 if(id.childNodes[0])
 text=id.childNodes[0].data;
 else
 text="";
 src=id.getAttribute("src");
 id=id.getAttribute("id");
}
 this.state=0;
 this.topNod=0;
 this.action=0;this.persAction=0;
 this.className=className||"defaultButton";
 this.textClassName=textClassName||"defaultButtonText";

 this.disableImage=disableImage;
 this.tooltip=tooltip||"";this.id=id||0;
 if(text)this.textP=text.split(',');else this.textP=",".split(',');
 if(src)this.srcA=src.split(',');else this.srcA=",".split(',');
 this.src=this.srcA[0];
 td=document.createElement("td");
 this.topNod=td;
 td.height=height;
 td.width=width;
 td.align="center";
 td.noWrap=true;

 td.innerHTML="<table title='"+this.tooltip+"' width='100%' height='100%' cellpadding='0' cellspacing='0'><tr><td valign='middle'><img src='"+this.srcA[0]+"' border='0' style='padding-left:2px;padding-right:2px;'></td><td width='100%' style='padding-left:5px' align='left' class='"+this.textClassName+"'>"+this.textP[0]+"</td></tr></table>";
 td.className=this.className;
 td.objectNode=this;
 this.imageTag=td.childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0];
 this.textTag=td.childNodes[0].childNodes[0].childNodes[0].childNodes[1];
 
 if(!text)this.textTag.style.display="none";
 if(!src)this.imageTag.style.display="none";
 
 this.enable();
 if(convertStringToBoolean(pressedState))
{
 this.state=1;this.topNod.className=this.className+"down";
 if(this.textP[1])this.textTag.innerHTML=this.textP[1];
 if(this.srcA[1])this.imageTag.src=this.srcA[1];
}
 return this;
};

uiTwoStateButtonObject.prototype = new uiButtonPrototypeObject;

 
uiTwoStateButtonObject.prototype._onclickX = function(e,that){
 if(!that)that=this.objectNode;
 if(that.topNod.dstatus)return;
 if(that.state==0){that.state=1;this.className=that.className+"down";}
 else{that.state=0;this.className=that.className;}
 
 if(that.textP[that.state])that.textTag.innerHTML=that.textP[that.state];
 if(that.srcA[that.state])that.imageTag.src=that.srcA[that.state];

 
 if((!that.persAction)||(that.persAction()))
 if(that.action){that.action(that.id,that.state);}

};
 
 uiTwoStateButtonObject.prototype._onmouseoutX=function(e){
};
 
 uiTwoStateButtonObject.prototype._onmouseoverX=function(e){
};
 
 uiTwoStateButtonObject.prototype.getState=function(){
 return this.state;
};
 
 uiTwoStateButtonObject.prototype.setState=function(state){
 this.state=state;
 if(state==0)this.topNod.className=this.className;
 else this.topNod.className=this.className+"down";

 if(this.textP[this.state])this.textTag.innerHTML=this.textP[this.state];
 if(this.srcA[this.state])this.imageTag.src=this.srcA[this.state];
};
 
 uiToolbarObject.prototype.setText=function(text){
 	var tds = this.topNod.firstChild.firstChild.childNodes;
 	tds[tds.length-2].innerHTML = text;
 };
 
 uiToolbarObject.prototype.refreshDisplay=function(){
 	this.topNod.style.display="";
 }

function uiInputTextObject(elem,width,height,className)
{
 if(elem.tagName=="InputText")
{
 width=elem.getAttribute("width");
 height=elem.getAttribute("height");
 className=elem.getAttribute("className");
 id=elem.getAttribute("id");
}
 this.topNod=0;
 this.action=0;
 this.persAction=0;
 if(id)this.id=id;else this.id=0;
 
 
 

 td=document.createElement("td");
 this.topNod=td;td.align="center";td.width=width;
 var input=document.createElement("input");
 this.inElement = input;
 input.type="text";
 input.objectNode=this;
 if(className)input.className=className;
 if(width)input.style.width=width + "px";
 
 td.appendChild(input);
 
 td.className="toolbarNormalButton";
 td.objectNode=this;
 
 return this;
};
 
 
 uiInputTextObject.prototype = new uiButtonPrototypeObject;
 
 uiInputTextObject.prototype.clearField=function(){
 this.inElement.value = '';
};

 uiInputTextObject.prototype.getValue=function(){
 return this.inElement.value;
};
function uiTreeObject(htmlObject,width,height,rootId){
 this._isOpera=(navigator.userAgent.indexOf('Opera')!= -1);

 if(typeof(htmlObject)!="object")
 this.parentObject=document.getElementById(htmlObject);
 else
 this.parentObject=htmlObject;

 this.xmlstate=0;
 this.mytype="tree";
 this.smcheck=true;
 this.width=width;
 this.height=height;
 this.rootId=rootId;
 this.childCalc=null;
 this.def_img_x="18px";
 this.def_img_y="18px";

 this.style_pointer="pointer";
 if(navigator.appName == 'Microsoft Internet Explorer')this.style_pointer="hand";

 this._aimgs=true;
 this.htmlcA=" [";
 this.htmlcB="]";
 this.lWin=window;
 this.cMenu=0;
 this.mlitems=0;
 this.dadmode=0;
 this.slowParse=false;
 this.autoScroll=true;
 this.hfMode=0;
 this.nodeCut=0;
 this.XMLsource=0;
 this.XMLloadingWarning=0;
 this._globalIdStorage=new Array();
 this.globalNodeStorage=new Array();
 this._globalIdStorageSize=0;
 this.treeLinesOn=true;
 this.checkFuncHandler=0;
 this.openFuncHandler=0;
 this.dblclickFuncHandler=0;
 this.tscheck=false;
 this.timgen=true;

 this.dpcpy=false;
 
 this.imPath="treeGfx/";
 this.checkArray=new Array("iconUnCheckAll.gif","iconCheckAll.gif","iconCheckGray.gif","iconUncheckDis.gif");
 this.lineArray=new Array("line2.gif","line3.gif","line4.gif","blank.gif","blank.gif");
 this.minusArray=new Array("minus2.gif","minus3.gif","minus4.gif","minus.gif","minus5.gif");
 this.plusArray=new Array("plus2.gif","plus3.gif","plus4.gif","plus.gif","plus5.gif");
 this.imageArray=new Array("leaf.gif","folderOpen.gif","folderClosed.gif");
 this.cutImg= new Array(0,0,0);
 this.cutImage="but_cut.gif";
 
 this.dragger= new dhtmlDragAndDropObject();
 
 this.htmlNode=new uiTreeItemObject(this.rootId,"",0,this);
 this.htmlNode.htmlNode.childNodes[0].childNodes[0].style.display="none";
 this.htmlNode.htmlNode.childNodes[0].childNodes[0].childNodes[0].className="hiddenRow";
 
 this.allTree=this._createSelf();
 this.allTree.appendChild(this.htmlNode.htmlNode);
 this.allTree.onselectstart=new Function("return false;");
 this.XMLLoader=new xmlLoaderObject(this._parseXMLTree,this);
 
 this.selectionBar=document.createElement("DIV");
 this.selectionBar.className="selectionBar";
 this.selectionBar.innerHTML="&nbsp;";
 
 if(this.allTree.offsetWidth>20)this.selectionBar.style.width=(this.allTree.offsetWidth-20)+"px";
 this.selectionBar.style.display="none";
 
 this.allTree.appendChild(this.selectionBar);
 
 
 

 return this;
};

 
function uiTreeItemObject(itemId,itemText,parentObject,treeObject,actionHandler,mode){
 this.htmlNode="";
 this.acolor="";
 this.scolor="";
 this.tr=0;
 this.childsCount=0;
 this.tempDOMM=0;
 this.tempDOMU=0;
 this.dragSpan=0;
 this.dragMove=0;
 this.span=0;
 this.closeble=1;
 this.childNodes=new Array();
 this.userData=new Object();
 
 this.checkstate=0;
 this.treeNod=treeObject;
 this.label=itemText;
 this.parentObject=parentObject;
 this.actionHandler=actionHandler;
 this.images=new Array(treeObject.imageArray[0],treeObject.imageArray[1],treeObject.imageArray[2]);


 this.id=treeObject._globalIdStorageAdd(itemId,this);
 if(this.treeNod.checkBoxOff)this.htmlNode=this.treeNod._createItem(1,this,mode);
 else this.htmlNode=this.treeNod._createItem(0,this,mode);
 
 this.htmlNode.objBelong=this;
 return this;
};
 
 
 
 uiTreeObject.prototype._globalIdStorageAdd=function(itemId,itemObject){
 if(this._globalIdStorageFind(itemId,1,1)){d=new Date();itemId=d.valueOf()+"_"+itemId;return this._globalIdStorageAdd(itemId,itemObject);}
 this._globalIdStorage[this._globalIdStorageSize]=itemId;
 this.globalNodeStorage[this._globalIdStorageSize]=itemObject;
 this._globalIdStorageSize++;
 return itemId;
};
 
 uiTreeObject.prototype._globalIdStorageSub=function(itemId){
 for(var i=0;i<this._globalIdStorageSize;i++)
 if(this._globalIdStorage[i]==itemId)
{
 this._globalIdStorage[i]=this._globalIdStorage[this._globalIdStorageSize-1];
 this.globalNodeStorage[i]=this.globalNodeStorage[this._globalIdStorageSize-1];
 this._globalIdStorageSize--;
 this._globalIdStorage[this._globalIdStorageSize]=0;
 this.globalNodeStorage[this._globalIdStorageSize]=0;
}
};
 
 
 uiTreeObject.prototype._globalIdStorageFind=function(itemId,skipXMLSearch,skipParsing){
 
 for(var i=0;i<this._globalIdStorageSize;i++)
 if(this._globalIdStorage[i]==itemId)
{
 return this.globalNodeStorage[i];
}
 
 
 return null;
};






 
 
 uiTreeObject.prototype._drawNewTr=function(htmlObject,node)
{
 var tr =document.createElement('tr');
 var td1=document.createElement('td');
 var td2=document.createElement('td');
 td1.appendChild(document.createTextNode(" "));
 td2.colSpan=3;
 td2.appendChild(htmlObject);
 tr.appendChild(td1);tr.appendChild(td2);
 return tr;
};
 
 uiTreeObject.prototype.loadXMLString=function(xmlString,afterCall){
 this.xmlstate=1;
 this.XMLLoader.loadXMLString(xmlString);this.waitCall=afterCall||0;};
 
 uiTreeObject.prototype.loadXML=function(file,afterCall){
 this.xmlstate=1;
 this.XMLLoader.loadXML(file);this.waitCall=afterCall||0;};
 
 uiTreeObject.prototype._attachChildNode=function(parentObject,itemId,itemText,itemActionHandler,image1,image2,image3,optionStr,childs,beforeNode){
 if(beforeNode)parentObject=beforeNode.parentObject;
 if(((parentObject.XMLload==0)&&(this.XMLsource))&&(!this.XMLloadingWarning))
{
 parentObject.XMLload=1;this.loadXML(this.XMLsource+getUrlSymbol(this.XMLsource)+"itemId="+escape(parentObject.id));
}
 
 var Count=parentObject.childsCount;
 var Nodes=parentObject.childNodes;

 if(beforeNode)
{
 var ik,jk;
 for(ik=0;ik<Count;ik++)
 if(Nodes[ik]==beforeNode)
{
 for(jk=Count;jk!=ik;jk--)
 Nodes[1+jk]=Nodes[jk];
 break;
}
 ik++;
 Count=ik;
}
 
 if((!itemActionHandler)&&(this.aFunc))itemActionHandler=this.aFunc;
 
 if(optionStr){
 var tempStr=optionStr.split(",");
 for(var i=0;i<tempStr.length;i++)
{
 switch(tempStr[i])
{
 case "TOP": if(parentObject.childsCount>0){beforeNode=new Object;beforeNode.tr=parentObject.childNodes[0].tr.previousSibling;}
 for(ik=0;ik<Count;ik++)
 Nodes[ik+Count]=Nodes[ik+Count-1];
 Count=0;
 break;
}
};
};

 Nodes[Count]=new uiTreeItemObject(itemId,itemText,parentObject,this,itemActionHandler,1);

 if(image1)Nodes[Count].images[0]=image1;
 if(image2)Nodes[Count].images[1]=image2;
 if(image3)Nodes[Count].images[2]=image3;
 
 parentObject.childsCount++;
 var tr=this._drawNewTr(Nodes[Count].htmlNode);
 if(this.XMLloadingWarning)
 Nodes[Count].htmlNode.parentNode.parentNode.style.display="none";
 

 
 if((beforeNode)&&(beforeNode.tr.nextSibling))
 parentObject.htmlNode.childNodes[0].insertBefore(tr,beforeNode.tr.nextSibling);
 else
 if((this.parsingOn)&&(this.parsingOn==parentObject.id))
{
 this.parsedArray[this.parsedArray.length]=tr;
}
 else 
 parentObject.htmlNode.childNodes[0].appendChild(tr);

 if((beforeNode)&&(!beforeNode.span))beforeNode=null;
 
 if(this.XMLsource)if((childs)&&(childs!=0))Nodes[Count].XMLload=0;else Nodes[Count].XMLload=1;

 Nodes[Count].tr=tr;
 tr.nodem=Nodes[Count];

 if(parentObject.itemId==0)
 tr.childNodes[0].className="hitemIddenRow";
 
 if(optionStr){
 var tempStr=optionStr.split(",");
 
 for(var i=0;i<tempStr.length;i++)
{
 switch(tempStr[i])
{
 case "SELECT": this.selectItem(itemId,false);break;
 case "CALL": this.selectItem(itemId,true);break;
 case "CHILD": Nodes[Count].XMLload=0;break;
 case "CHECKED": 
 if(this.XMLloadingWarning)
 this.setCheckList+=","+itemId;
 else
 this.setCheck(itemId,1);
 break;
 case "HCHECKED":
 this._setCheck(Nodes[Count],"notsure");
 break;
 case "OPEN": Nodes[Count].openMe=1;break;
}
};
};

 if(!this.XMLloadingWarning)
{
 if(this._getOpenState(parentObject)<0)
 this.openItem(parentObject.id);
 
 if(beforeNode)
{
 this._correctPlus(beforeNode);
 this._correctLine(beforeNode);
}
 this._correctPlus(parentObject);
 this._correctLine(parentObject);
 this._correctPlus(Nodes[Count]);
 if(parentObject.childsCount>=2)
{
 this._correctPlus(Nodes[parentObject.childsCount-2]);
 this._correctLine(Nodes[parentObject.childsCount-2]);
}
 if(parentObject.childsCount!=2)this._correctPlus(Nodes[0]);
 if(this.tscheck)this._correctCheckStates(parentObject);
}
 if(this.cMenu)this.cMenu.setContextZone(Nodes[Count].span,Nodes[Count].id);
 return Nodes[Count];
};

 
 uiTreeObject.prototype.insertNewChild=function(parentId,itemId,itemText,itemActionHandler,image1,image2,image3,optionStr,childs){
 return this.insertNewItem(parentId,itemId,itemText,itemActionHandler,image1,image2,image3,optionStr,childs);
}

 
 uiTreeObject.prototype.insertNewItem=function(parentId,itemId,itemText,itemActionHandler,image1,image2,image3,optionStr,childs){
 var parentObject=this._globalIdStorageFind(parentId);
 if(!parentObject)return(-1);
 return this._attachChildNode(parentObject,itemId,itemText,itemActionHandler,image1,image2,image3,optionStr,childs);
};
 
 uiTreeObject.prototype.insertNewChild=function(parentId,itemId,itemText,itemActionHandler,image1,image2,image3,optionStr,childs){
 return this.insertNewItem(parentId,itemId,itemText,itemActionHandler,image1,image2,image3,optionStr,childs);
}
 
 uiTreeObject.prototype._parseXMLTree=function(dhtmlObject,node,parentId,level){

 
 if(!dhtmlObject.parsCount)dhtmlObject.parsCount=1;else dhtmlObject.parsCount++;
 
 dhtmlObject.XMLloadingWarning=1;
 var nodeAskingCall="";
 if(!node){
 node=dhtmlObject.XMLLoader.getXMLTopNode("tree");
 parentId=node.getAttribute("id");
 dhtmlObject.parsingOn=parentId;
 dhtmlObject.parsedArray=new Array();
 dhtmlObject.setCheckList="";
}


 if(node.getAttribute("order"))
 dhtmlObject._reorderXMLBranch(node);


 for(var i=0;i<node.childNodes.length;i++)
{
 if((node.childNodes[i].nodeType==1)&&(node.childNodes[i].tagName == "item"))
{
 var nodx=node.childNodes[i];
 var name=nodx.getAttribute("text");
 var cId=nodx.getAttribute("id");
 if((!dhtmlObject.waitUpdateXML)||(dhtmlObject.waitUpdateXML.toString().search(","+cId+",")!=-1))
{
 var im0=nodx.getAttribute("im0");
 var im1=nodx.getAttribute("im1");
 var im2=nodx.getAttribute("im2");
 
 var aColor=nodx.getAttribute("aCol");
 var sColor=nodx.getAttribute("sCol");
 
 var chd=nodx.getAttribute("child");

 
 var atop=nodx.getAttribute("top");
 var aopen=nodx.getAttribute("open");
 var aselect=nodx.getAttribute("select");
 var acall=nodx.getAttribute("call");
 var achecked=nodx.getAttribute("checked");
 var closeable=nodx.getAttribute("closeable");
 var tooltip = nodx.getAttribute("tooltip");
 var nocheckbox = nodx.getAttribute("nocheckbox");
 var style = nodx.getAttribute("style");
 
 var zST="";
 if(aselect)zST+=",SELECT";
 if(atop)zST+=",TOP";
 
 if(acall)nodeAskingCall=cId;
 if(achecked==-1)zST+=",HCHECKED";
 else if(achecked)zST+=",CHECKED";
 if(aopen)zST+=",OPEN";

 var temp=dhtmlObject._globalIdStorageFind(parentId);
 temp.XMLload=1;
 var newNode=dhtmlObject.insertNewItem(parentId,cId,name,0,im0,im1,im2,zST,chd);

 if(tooltip)newNode.span.parentNode.title=tooltip;
 if(style)newNode.span.style.cssText+=(";"+style);
 if(nocheckbox){
 newNode.span.parentNode.previousSibling.previousSibling.childNodes[0].style.display='none';
 newNode.nocheckbox=true;
}
 
 newNode._acc=chd||0;
 

 if(dhtmlObject.parserExtension)dhtmlObject.parserExtension._parseExtension(node.childNodes[i],dhtmlObject.parserExtension,cId,parentId);
 
 dhtmlObject.setItemColor(newNode,aColor,sColor);

 if((closeable=="0")||(closeable=="1"))dhtmlObject.setItemCloseable(newNode,closeable);
 var zcall="";
 if((!dhtmlObject.slowParse)||(dhtmlObject.waitUpdateXML))
{
 zcall=dhtmlObject._parseXMLTree(dhtmlObject,node.childNodes[i],cId,1);
}
 else{
 if(node.childNodes[i].childNodes.length>0){
 for(var a=0;a<node.childNodes[i].childNodes.length;a++)
 if(node.childNodes[i].childNodes[a].tagName=="item"){
 newNode.unParsed=node.childNodes[i];
 break;
}
}
}
 
 if(zcall!="")nodeAskingCall=zcall;
 
}
 else dhtmlObject._parseXMLTree(dhtmlObject,node.childNodes[i],cId,1);
}
 else
 if((node.childNodes[i].nodeType==1)&&(node.childNodes[i].tagName == "userdata"))
{
 var name=node.childNodes[i].getAttribute("name");
 if((name)&&(node.childNodes[i].childNodes[0])){
 if((!dhtmlObject.waitUpdateXML)||(dhtmlObject.waitUpdateXML.toString().search(","+parentId+",")!=-1))
 dhtmlObject.setUserData(parentId,name,node.childNodes[i].childNodes[0].data);
};
};
};

 if(!level){
 if(dhtmlObject.waitUpdateXML)
 dhtmlObject.waitUpdateXML="";
 else{
 
 var parsedNodeTop=dhtmlObject._globalIdStorageFind(dhtmlObject.parsingOn);
 for(var i=0;i<dhtmlObject.parsedArray.length;i++)
 parsedNodeTop.htmlNode.childNodes[0].appendChild(dhtmlObject.parsedArray[i]);
 dhtmlObject.parsingOn=0;

 dhtmlObject.lastLoadedXMLId=parentId;

 dhtmlObject.XMLloadingWarning=0;
 var chArr=dhtmlObject.setCheckList.split(",");
 for(var n=0;n<chArr.length;n++)
 if(chArr[n])dhtmlObject.setCheck(chArr[n],1);
 dhtmlObject._redrawFrom(dhtmlObject);

 if(nodeAskingCall!="")dhtmlObject.selectItem(nodeAskingCall,true);
 if(dhtmlObject.waitCall)dhtmlObject.waitCall();
}
}
 

 if(dhtmlObject.parsCount==1){
 dhtmlObject.xmlstate=1;
}
 dhtmlObject.parsCount--;

 return nodeAskingCall;
};


 


 
 uiTreeObject.prototype._redrawFrom=function(dhtmlObject,itemObject){
 if(!itemObject){
 var tempx=dhtmlObject._globalIdStorageFind(dhtmlObject.lastLoadedXMLId);
 dhtmlObject.lastLoadedXMLId=-1;
 if(!tempx)return 0;
}
 else tempx=itemObject;
 var acc=0;
 
 for(var i=0;i<tempx.childsCount;i++)
{
 if(!itemObject)tempx.childNodes[i].htmlNode.parentNode.parentNode.style.display="";
 if(tempx.childNodes[i].openMe==1)
{
 this._openItem(tempx.childNodes[i]);
 tempx.childNodes[i].openMe=0;
}
 
 dhtmlObject._redrawFrom(dhtmlObject,tempx.childNodes[i]);
 
 if(this.childCalc!=null){
 
 if((tempx.childNodes[i].unParsed)||((!tempx.childNodes[i].XMLload)&&(this.XMLsource)))
{

 if(tempx.childNodes[i]._acc)
 tempx.childNodes[i].span.innerHTML=tempx.childNodes[i].label+this.htmlcA+tempx.childNodes[i]._acc+this.htmlcB;
 else 
 tempx.childNodes[i].span.innerHTML=tempx.childNodes[i].label;
}
 
 if((tempx.childNodes[i].childNodes.length)&&(this.childCalc))
{
 if(this.childCalc==1)
{
 tempx.childNodes[i].span.innerHTML=tempx.childNodes[i].label+this.htmlcA+tempx.childNodes[i].childsCount+this.htmlcB;
}
 if(this.childCalc==2)
{
 var zCount=tempx.childNodes[i].childsCount-(tempx.childNodes[i].pureChilds||0);
 if(zCount)
 tempx.childNodes[i].span.innerHTML=tempx.childNodes[i].label+this.htmlcA+zCount+this.htmlcB;
 if(tempx.pureChilds)tempx.pureChilds++;else tempx.pureChilds=1;
}
 if(this.childCalc==3)
{
 tempx.childNodes[i].span.innerHTML=tempx.childNodes[i].label+this.htmlcA+tempx.childNodes[i]._acc+this.htmlcB;
}
 if(this.childCalc==4)
{
 var zCount=tempx.childNodes[i]._acc;
 if(zCount)
 tempx.childNodes[i].span.innerHTML=tempx.childNodes[i].label+this.htmlcA+zCount+this.htmlcB;
}
}
 else if(this.childCalc==4){
 acc++;
}
 
 acc+=tempx.childNodes[i]._acc;
 
 if(this.childCalc==3){
 acc++;
}
 
}
 
 
 
};
 
 if((!tempx.unParsed)&&((tempx.XMLload)||(!this.XMLsource)))
 tempx._acc=acc;
 dhtmlObject._correctLine(tempx);
 dhtmlObject._correctPlus(tempx);
};

 
 uiTreeObject.prototype._createSelf=function(){
 var div=document.createElement('div');
 div.className="containerTableStyle";
 div.style.width=this.width;
 div.style.height=this.height;
 this.parentObject.appendChild(div);
 return div;
};

 
 uiTreeObject.prototype._xcloseAll=function(itemObject)
{
 if(this.rootId!=itemObject.id)this._HideShow(itemObject,1);
 for(var i=0;i<itemObject.childsCount;i++)
 this._xcloseAll(itemObject.childNodes[i]);
};
 
 uiTreeObject.prototype._xopenAll=function(itemObject)
{
 this._HideShow(itemObject,2);
 for(var i=0;i<itemObject.childsCount;i++)
 this._xopenAll(itemObject.childNodes[i]);
};
 
 uiTreeObject.prototype._correctPlus=function(itemObject){
 
 var workArray=this.lineArray;
 if((this.XMLsource)&&(!itemObject.XMLload))
{
 var workArray=this.plusArray;
 itemObject.htmlNode.childNodes[0].childNodes[0].childNodes[2].childNodes[0].src=this.imPath+itemObject.images[2];
}
 else
 if((itemObject.childsCount)||(itemObject.unParsed))
{
 if((itemObject.htmlNode.childNodes[0].childNodes[1])&&(itemObject.htmlNode.childNodes[0].childNodes[1].style.display!="none"))
{
 if(!itemObject.wsign)var workArray=this.minusArray;
 itemObject.htmlNode.childNodes[0].childNodes[0].childNodes[2].childNodes[0].src=this.imPath+itemObject.images[1];
}
 else
{
 if(!itemObject.wsign)var workArray=this.plusArray;
 itemObject.htmlNode.childNodes[0].childNodes[0].childNodes[2].childNodes[0].src=this.imPath+itemObject.images[2];
}
}
 else
{
 itemObject.htmlNode.childNodes[0].childNodes[0].childNodes[2].childNodes[0].src=this.imPath+itemObject.images[0];
}

 
 var tempNum=2;
 if(!itemObject.treeNod.treeLinesOn)itemObject.htmlNode.childNodes[0].childNodes[0].childNodes[0].childNodes[0].src=this.imPath+workArray[3];
 else{
 if(itemObject.parentObject)tempNum=this._getCountStatus(itemObject.id,itemObject.parentObject);
 itemObject.htmlNode.childNodes[0].childNodes[0].childNodes[0].childNodes[0].src=this.imPath+workArray[tempNum];
}
};

 
 uiTreeObject.prototype._correctLine=function(itemObject){
 var sNode=itemObject.parentObject;
 try{
 if(sNode)
 if((this._getLineStatus(itemObject.id,sNode)==0)||(!this.treeLinesOn))
{
 for(var i=1;i<=itemObject.childsCount;i++)
{
 itemObject.htmlNode.childNodes[0].childNodes[i].childNodes[0].style.backgroundImage="";
 itemObject.htmlNode.childNodes[0].childNodes[i].childNodes[0].style.backgroundRepeat="";
}
}
 else
 for(var i=1;i<=itemObject.childsCount;i++)
{
 itemObject.htmlNode.childNodes[0].childNodes[i].childNodes[0].style.backgroundImage="url("+this.imPath+"line1.gif)";
 itemObject.htmlNode.childNodes[0].childNodes[i].childNodes[0].style.backgroundRepeat="repeat-y";
}
}
 catch(e){};
};
 
 uiTreeObject.prototype._getCountStatus=function(itemId,itemObject){
 try{
 if(itemObject.childsCount<=1){if(itemObject.id==this.rootId)return 4;else return 0;}
 
 if(itemObject.htmlNode.childNodes[0].childNodes[1].nodem.id==itemId)if(!itemObject.id)return 2;else return 1;
 if(itemObject.htmlNode.childNodes[0].childNodes[itemObject.childsCount].nodem.id==itemId)return 0;
}
 catch(e){};
 return 1;
};
 
 uiTreeObject.prototype._getLineStatus =function(itemId,itemObject){
 if(itemObject.htmlNode.childNodes[0].childNodes[itemObject.childsCount].nodem.id==itemId)return 0;
 return 1;
}

 
 uiTreeObject.prototype._HideShow=function(itemObject,mode){
 if((this.XMLsource)&&(!itemObject.XMLload)){itemObject.XMLload=1;this.loadXML(this.XMLsource+getUrlSymbol(this.XMLsource)+"id="+escape(itemObject.id));return;};

 var Nodes=itemObject.htmlNode.childNodes[0].childNodes;var Count=Nodes.length;
 if(Count>1){
 if(((Nodes[1].style.display!="none")||(mode==1))&&(mode!=2)){
 
 this.allTree.childNodes[0].border = "1";
 this.allTree.childNodes[0].border = "0";
 nodestyle="none";
}
 else nodestyle="";
 
 for(var i=1;i<Count;i++)
 Nodes[i].style.display=nodestyle;
}
 this._correctPlus(itemObject);
}
 
 uiTreeObject.prototype._getOpenState=function(itemObject){
 if(!itemObject)return;
 var z=itemObject.htmlNode.childNodes[0].childNodes;
 if(z.length<=1)return 0;
 if(z[1].style.display!="none")return 1;
 else return -1;
}


 
 
 uiTreeObject.prototype.onRowClick2=function(){
 if(this.parentObject.treeNod.dblclickFuncHandler)if(!this.parentObject.treeNod.dblclickFuncHandler(this.parentObject.id))return 0;
 if((this.parentObject.closeble)&&(this.parentObject.closeble!="0"))
 this.parentObject.treeNod._HideShow(this.parentObject);
 else
 this.parentObject.treeNod._HideShow(this.parentObject,2);
};
 
 uiTreeObject.prototype.onRowClick=function(){
 if(this.parentObject.treeNod.openFuncHandler)if(!this.parentObject.treeNod.openFuncHandler(this.parentObject.id,this.parentObject.treeNod._getOpenState(this.parentObject)))return 0;
 if((this.parentObject.closeble)&&(this.parentObject.closeble!="0"))
 this.parentObject.treeNod._HideShow(this.parentObject);
 else
 this.parentObject.treeNod._HideShow(this.parentObject,2);
};


 
 uiTreeObject.prototype.onRowClickDown=function(){
 var that=this.parentObject.treeNod;
 that._selectItem(this.parentObject);
};
 
 uiTreeObject.prototype._selectItem=function(node){
 if(this.lastSelected){
 this._unselectItem(this.lastSelected.parentObject);
}
 var z=node.htmlNode.childNodes[0].childNodes[0].childNodes[3].childNodes[0];
 z.className="selectedTreeRow";
 this.lastSelected=z.parentNode;
}
 
 uiTreeObject.prototype._unselectItem=function(node){
 node.htmlNode.childNodes[0].childNodes[0].childNodes[3].childNodes[0].className="standartTreeRow";
}
 
 uiTreeObject.prototype.onRowSelect=function(e,htmlObject,mode){
 
 if(!htmlObject)htmlObject=this.parentObject.span.parentNode;
 htmlObject.parentObject.span.className="selectedTreeRow";
 

 if(htmlObject.parentObject.scolor)htmlObject.parentObject.span.style.color=htmlObject.parentObject.scolor;
 if((htmlObject.parentObject.treeNod.lastSelected)&&(htmlObject.parentObject.treeNod.lastSelected!=htmlObject))
{
 var lastId=htmlObject.parentObject.treeNod.lastSelected.parentObject.id;
 htmlObject.parentObject.treeNod.lastSelected.parentObject.span.className="standartTreeRow";
 if(htmlObject.parentObject.treeNod.lastSelected.parentObject.acolor)htmlObject.parentObject.treeNod.lastSelected.parentObject.span.style.color=htmlObject.parentObject.treeNod.lastSelected.parentObject.acolor;
}
 else var lastId="";
 htmlObject.parentObject.treeNod.lastSelected=htmlObject;
 if(!mode){
 if(window.event)e=event;
 
 if((e)&&(e.button==2)&&(htmlObject.parentObject.treeNod.arFunc))
{htmlObject.parentObject.treeNod.arFunc(htmlObject.parentObject.id);}
 if(htmlObject.parentObject.actionHandler)htmlObject.parentObject.actionHandler(htmlObject.parentObject.id,lastId);
}
};
 



 
 
uiTreeObject.prototype._correctCheckStates=function(dhtmlObject){
 if(!this.tscheck)return;
 if(dhtmlObject.id==this.rootId)return;
 
 var act=dhtmlObject.htmlNode.childNodes[0].childNodes;
 var flag1=0;var flag2=0;
 if(act.length<2)return;
 for(var i=1;i<act.length;i++)
 if(act[i].nodem.checkstate==0)flag1=1;
 else if(act[i].nodem.checkstate==1)flag2=1;
 else{flag1=1;flag2=1;break;}

 if((flag1)&&(flag2))this._setCheck(dhtmlObject,"notsure");
 else if(flag1)this._setCheck(dhtmlObject,false);
 else this._setCheck(dhtmlObject,true);
 
 this._correctCheckStates(dhtmlObject.parentObject);
}

 
 uiTreeObject.prototype.onCheckBoxClick=function(e){
 if(this.treeNod.tscheck)
 if(this.parentObject.checkstate==1)this.treeNod._setSubChecked(false,this.parentObject);
 else this.treeNod._setSubChecked(true,this.parentObject);
 else
 if(this.parentObject.checkstate==1)this.treeNod._setCheck(this.parentObject,false);
 else this.treeNod._setCheck(this.parentObject,true);
 this.treeNod._correctCheckStates(this.parentObject.parentObject);
 if(this.treeNod.checkFuncHandler)return(this.treeNod.checkFuncHandler(this.parentObject.id,this.parentObject.checkstate));
 else return true;
};
 
 uiTreeObject.prototype._createItem=function(acheck,itemObject,mode){
 var table=document.createElement('table');
 table.cellSpacing=0;table.cellPadding=0;
 table.border=0;
 if(this.hfMode)table.style.tableLayout="fixed";
 table.style.margin=0;table.style.padding=0;

 var tbody=document.createElement('tbody');
 var tr=document.createElement('tr');
 
 var td1=document.createElement('td');
 td1.className="standartTreeImage";
 var img0=document.createElement((itemObject.id==this.rootId)?"div":"img");
 img0.border="0";
 if(itemObject.id!=this.rootId)img0.align="absmiddle";
 td1.appendChild(img0);img0.style.padding=0;img0.style.margin=0;
 
 var td11=document.createElement('td');
 
 var inp=document.createElement((itemObject.id==this.rootId)?"div":"img");
 inp.checked=0;inp.src=this.imPath+this.checkArray[0];inp.style.width="16px";inp.style.height="16px";
 
 if(!acheck)(((_isOpera)||(_isKHTML))?td11:inp).style.display="none";

 
 
 td11.appendChild(inp);
 if(itemObject.id!=this.rootId)inp.align="absmiddle";
 inp.onclick=this.onCheckBoxClick;
 inp.treeNod=this;
 inp.parentObject=itemObject;
 td11.width="20px";

 var td12=document.createElement('td');
 td12.className="standartTreeImage";
 var img=document.createElement((itemObject.id==this.rootId)?"div":"img");img.onmousedown=this._preventNsDrag;img.ondragstart=this._preventNsDrag;
 img.border="0";
 if(this._aimgs){
 img.parentObject=itemObject;
 if(itemObject.id!=this.rootId)img.align="absmiddle";
 img.onclick=this.onRowSelect;}
 if(!mode)img.src=this.imPath+this.imageArray[0];
 td12.appendChild(img);img.style.padding=0;img.style.margin=0;
 if(this.timgen)
{img.style.width=this.def_img_x;img.style.height=this.def_img_y;}
 else
{img.style.width="0px";img.style.height="0px";}
 

 var td2=document.createElement('td');
 td2.className="standartTreeRow";

 itemObject.span=document.createElement('span');
 itemObject.span.className="standartTreeRow";
 if(this.mlitems)itemObject.span.style.width=this.mlitems;
 else td2.noWrap=true;
 if(!_isKHTML)td2.style.width="100%";

 
 itemObject.span.innerHTML=itemObject.label;
 td2.appendChild(itemObject.span);
 td2.parentObject=itemObject;td1.parentObject=itemObject;
 td2.onclick=this.onRowSelect;td1.onclick=this.onRowClick;td2.ondblclick=this.onRowClick2;
 if(this.ettip)td2.title=itemObject.label;
 
 if(this.dragAndDropOff){
 if(this._aimgs){this.dragger.addDraggableItem(td12,this);td12.parentObject=itemObject;}
 this.dragger.addDraggableItem(td2,this);
}
 
 itemObject.span.style.paddingLeft="5px";itemObject.span.style.paddingRight="5px";td2.style.verticalAlign="";
 td2.style.fontSize="10pt";td2.style.cursor=this.style_pointer;
 tr.appendChild(td1);tr.appendChild(td11);tr.appendChild(td12);
 tr.appendChild(td2);
 tbody.appendChild(tr);
 table.appendChild(tbody);

 if(this.arFunc){
 
 tr.oncontextmenu=Function("this.childNodes[0].parentObject.treeNod.arFunc(this.childNodes[0].parentObject.id);return false;");
}
 return table;
};
 

 
 
 uiTreeObject.prototype.setImagePath=function(newPath){this.imPath=newPath;};
 


 
 uiTreeObject.prototype.setOnRightClickHandler=function(func){if(typeof(func)=="function")this.arFunc=func;else this.arFunc=eval(func);};

 
 uiTreeObject.prototype.setOnClickHandler=function(func){if(typeof(func)=="function")this.aFunc=func;else this.aFunc=eval(func);};


 
 uiTreeObject.prototype.setXMLAutoLoading=function(filePath){this.XMLsource=filePath;};



 
 
 uiTreeObject.prototype.setOnCheckHandler=function(func){if(typeof(func)=="function")this.checkFuncHandler=func;else this.checkFuncHandler=eval(func);};


 
 uiTreeObject.prototype.setOnOpenHandler=function(func){if(typeof(func)=="function")this.openFuncHandler=func;else this.openFuncHandler=eval(func);};

 
 uiTreeObject.prototype.setOnDblClickHandler=function(func){if(typeof(func)=="function")this.dblclickFuncHandler=func;else this.dblclickFuncHandler=eval(func);};
 
 
 






 
 uiTreeObject.prototype.openAllItems=function(itemId)
{
 var temp=this._globalIdStorageFind(itemId);
 if(!temp)return 0;
 this._xopenAll(temp);
};
 
 
 uiTreeObject.prototype.getOpenState=function(itemId){
 var temp=this._globalIdStorageFind(itemId);
 if(!temp)return "";
 return this._getOpenState(temp);
};
 
 
 uiTreeObject.prototype.closeAllItems=function(itemId)
{
 var temp=this._globalIdStorageFind(itemId);
 if(!temp)return 0;
 this._xcloseAll(temp);
};
 
 
 
 uiTreeObject.prototype.setUserData=function(itemId,name,value){
 var sNode=this._globalIdStorageFind(itemId);
 if(!sNode)return;
 if(name=="hint")sNode.htmlNode.childNodes[0].childNodes[0].title=value;
 sNode.userData["t_"+name]=value;
 if(!sNode._userdatalist)sNode._userdatalist=name;
 else sNode._userdatalist+=","+name;
};
 
 
 uiTreeObject.prototype.getUserData=function(itemId,name){
 var sNode=this._globalIdStorageFind(itemId);
 if(!sNode)return;
 return sNode.userData["t_"+name];
};

 
 uiTreeObject.prototype.getSelectedItemId=function()
{
 if(this.lastSelected)
 if(this._globalIdStorageFind(this.lastSelected.parentObject.id))
 return this.lastSelected.parentObject.id;
 return("");
};
 
 
 uiTreeObject.prototype.getItemColor=function(itemId)
{
 var temp=this._globalIdStorageFind(itemId);
 if(!temp)return 0;

 var res= new Object();
 if(temp.acolor)res.acolor=temp.acolor;
 if(temp.acolor)res.scolor=temp.scolor;
 return res;
};
 
 uiTreeObject.prototype.setItemColor=function(itemId,defaultColor,selectedColor)
{
 if((itemId)&&(itemId.span))
 var temp=itemId;
 else
 var temp=this._globalIdStorageFind(itemId);
 if(!temp)return 0;
 else{
 if((this.lastSelected)&&(temp.tr==this.lastSelected.parentObject.tr))
{if(selectedColor)temp.span.style.color=selectedColor;}
 else
{if(defaultColor)temp.span.style.color=defaultColor;}

 if(selectedColor)temp.scolor=selectedColor;
 if(defaultColor)temp.acolor=defaultColor;
}
};

 
 uiTreeObject.prototype.getItemText=function(itemId)
{
 var temp=this._globalIdStorageFind(itemId);
 if(!temp)return 0;
 return(temp.htmlNode.childNodes[0].childNodes[0].childNodes[3].childNodes[0].innerHTML);
};
 
 uiTreeObject.prototype.getParentId=function(itemId)
{
 var temp=this._globalIdStorageFind(itemId);
 if((!temp)||(!temp.parentObject))return "";
 return temp.parentObject.id;
};



 
 uiTreeObject.prototype.changeItemId=function(itemId,newItemId)
{
 var temp=this._globalIdStorageFind(itemId);
 if(!temp)return 0;
 temp.id=newItemId;
 temp.span.contextMenuId=newItemId;
 for(var i=0;i<this._globalIdStorageSize;i++)
 if(this._globalIdStorage[i]==itemId)
{
 this._globalIdStorage[i]=newItemId;
}
};

 
 
 uiTreeObject.prototype.doCut=function(){
 if(this.nodeCut)this.clearCut();
 this.nodeCut=this.lastSelected;
 if(this.nodeCut)
{
 var tempa=this.nodeCut.parentObject;
 this.cutImg[0]=tempa.images[0];
 this.cutImg[1]=tempa.images[1];
 this.cutImg[2]=tempa.images[2];
 tempa.images[0]=tempa.images[1]=tempa.images[2]=this.cutImage;
 this._correctPlus(tempa);
}
};
 
 
 uiTreeObject.prototype.doPaste=function(itemId){
 var temp=this._globalIdStorageFind(itemId);
 if(!temp)return 0;
 if(this.nodeCut){
 if((!this._checkParenNodes(this.nodeCut.parentObject.id,temp))&&(id!=this.nodeCut.parentObject.parentObject.id))
 this._moveNode(temp,this.nodeCut.parentObject);
 this.clearCut();
}
};
 
 
 uiTreeObject.prototype.clearCut=function(){
 if(this.nodeCut)
{
 var tempa=this.nodeCut.parentObject;
 tempa.images[0]=this.cutImg[0];
 tempa.images[1]=this.cutImg[1];
 tempa.images[2]=this.cutImg[2];
 if(tempa.parentObject)this._correctPlus(tempa);
 if(tempa.parentObject)this._correctLine(tempa);
 this.nodeCut=0;
}
};
 


 
 uiTreeObject.prototype._moveNode=function(itemObject,targetObject){
 
 var mode=this.dadmodec;
 if(mode==1)
{
 var z=targetObject;
 if(this.dadmodefix<0)
{

 while(true){
 z=this._getPrevNode(z);
 if((z==-1)){z=this.htmlNode;break;}
 if((z.tr.style.display=="")||(!z.parentObject))break;
 
 
}

 var nodeA=z;
 var nodeB=targetObject;

}
 else
{
 while(true){
 z=this._getNextNode(z);
 if((z==-1)){z=this.htmlNode;break;}
 if((z.tr.style.display=="")||(!z.parentObject))break;
 
 
}

 var nodeB=z;
 var nodeA=targetObject;
}


 if(this._getNodeLevel(nodeA,0)>this._getNodeLevel(nodeB,0))
{
 return this._moveNodeTo(itemObject,nodeA.parentObject);
}
 else
{
 
 return this._moveNodeTo(itemObject,nodeB.parentObject,nodeB);
}


 
 

}
 else return this._moveNodeTo(itemObject,targetObject);
 
}

 

uiTreeObject.prototype._fixNodesCollection=function(target,zParent){
 var flag=0;var icount=0;
 var Nodes=target.childNodes;
 var Count=target.childsCount-1;
 
 if(zParent==Nodes[Count])return;
 for(var i=0;i<Count;i++)
 if(Nodes[i]==Nodes[Count]){Nodes[i]=Nodes[i+1];Nodes[i+1]=Nodes[Count];}

 
 for(var i=0;i<Count+1;i++)
{
 if(flag){
 var temp=Nodes[i];
 Nodes[i]=flag;
 flag=temp;
}
 else 
 if(Nodes[i]==zParent){flag=Nodes[i];Nodes[i]=Nodes[Count];}
}
};
 

 
 uiTreeObject.prototype._moveNodeTo=function(itemObject,targetObject,beforeNode){
 
 if(targetObject.mytype)
 var framesMove=(itemObject.treeNod.lWin!=targetObject.lWin);
 else
 var framesMove=(itemObject.treeNod.lWin!=targetObject.treeNod.lWin);

 if(this.dragFunc)if(!this.dragFunc(itemObject.id,targetObject.id,(beforeNode?beforeNode.id:null),itemObject.treeNod,targetObject.treeNod))return false;
 if((targetObject.XMLload==0)&&(this.XMLsource))
{
 targetObject.XMLload=1;this.loadXML(this.XMLsource+getUrlSymbol(this.XMLsource)+"id="+escape(targetObject.id));
}
 this.openItem(targetObject.id);
 
 var oldTree=itemObject.treeNod;
 var c=itemObject.parentObject.childsCount;
 var z=itemObject.parentObject;

 if((framesMove)||(oldTree.dpcpy))
 itemObject=this._recreateBranch(itemObject,targetObject,beforeNode);
 else
{

 var Count=targetObject.childsCount;var Nodes=targetObject.childNodes;
 Nodes[Count]=itemObject;
 itemObject.treeNod=targetObject.treeNod;
 targetObject.childsCount++;
 
 var tr=this._drawNewTr(Nodes[Count].htmlNode);
 
 if(!beforeNode)
{
 targetObject.htmlNode.childNodes[0].appendChild(tr);
 if(this.dadmode==1)this._fixNodesCollection(targetObject,beforeNode);
}
 else 
{
 targetObject.htmlNode.childNodes[0].insertBefore(tr,beforeNode.tr);
 this._fixNodesCollection(targetObject,beforeNode);
 Nodes=targetObject.childNodes;
}
 
 
}
 if(!oldTree.dpcpy){
 itemObject.parentObject.htmlNode.childNodes[0].removeChild(itemObject.tr);
 if((!beforeNode)||(targetObject!=itemObject.parentObject)){
 for(var i=0;i<z.childsCount;i++){
 if(z.childNodes[i].id==itemObject.id){
 z.childNodes[i]=0;
 break;}}}
 else z.childNodes[z.childsCount-1]=0;
 
 oldTree._compressChildList(z.childsCount,z.childNodes);
 z.childsCount--;
}

 
 if((!framesMove)&&(!oldTree.dpcpy)){
 itemObject.tr=tr;
 tr.nodem=itemObject;
 itemObject.parentObject=targetObject;
 
 if(oldTree!=targetObject.treeNod){if(itemObject.treeNod._registerBranch(itemObject,oldTree))return;this._clearStyles(itemObject);this._redrawFrom(this,itemObject.parentObject);};
 
 this._correctPlus(targetObject);
 this._correctLine(targetObject);
 this._correctLine(itemObject);
 this._correctPlus(itemObject);

 
 if(beforeNode)
{
 
 this._correctPlus(beforeNode);
 
}
 else 
 if(targetObject.childsCount>=2)
{
 
 this._correctPlus(Nodes[targetObject.childsCount-2]);
 this._correctLine(Nodes[targetObject.childsCount-2]);
}
 
 this._correctPlus(Nodes[targetObject.childsCount-1]);
 
 
 
 if(this.tscheck)this._correctCheckStates(targetObject);
 if(oldTree.tscheck)oldTree._correctCheckStates(z);
 
}
 
 
 
 if(c>1){oldTree._correctPlus(z.childNodes[c-2]);
 oldTree._correctLine(z.childNodes[c-2]);
}
 
 oldTree._correctPlus(z);
 
 
 
 
 if(this.dropFunc)this.dropFunc(itemObject.id,targetObject.id,(beforeNode?beforeNode.id:null),itemObject.treeNod,targetObject.treeNod);
 return itemObject.id;
};
 
 
uiTreeObject.prototype._checkParenNodes=function(itemId,htmlObject,shtmlObject){
 if(shtmlObject){if(shtmlObject.parentObject.id==htmlObject.id)return 1;}
 if(htmlObject.id==itemId)return 1;
 if(htmlObject.parentObject)return this._checkParenNodes(itemId,htmlObject.parentObject);else return 0;
};
 
 
 
 
 uiTreeObject.prototype._clearStyles=function(itemObject){
 var td1=itemObject.htmlNode.childNodes[0].childNodes[0].childNodes[1];
 var td3=td1.nextSibling.nextSibling;
 
 itemObject.span.innerHTML=itemObject.label;
 
 if(this.checkBoxOff){td1.childNodes[0].style.display="";td1.childNodes[0].onclick=this.onCheckBoxClick;}
 else td1.childNodes[0].style.display="none";
 td1.childNodes[0].treeNod=this;

 this.dragger.removeDraggableItem(td3);
 if(this.dragAndDropOff)this.dragger.addDraggableItem(td3,this);
 td3.childNodes[0].className="standartTreeRow";
 td3.onclick=this.onRowSelect;td3.ondblclick=this.onRowClick2;
 td1.previousSibling.onclick=this.onRowClick;

 this._correctLine(itemObject);
 this._correctPlus(itemObject);
 for(var i=0;i<itemObject.childsCount;i++)this._clearStyles(itemObject.childNodes[i]);

};
 
 uiTreeObject.prototype._registerBranch=function(itemObject,oldTree){
 
 itemObject.id=this._globalIdStorageAdd(itemObject.id,itemObject);
 itemObject.treeNod=this;
 if(oldTree)oldTree._globalIdStorageSub(itemObject.id);
 for(var i=0;i<itemObject.childsCount;i++)
 this._registerBranch(itemObject.childNodes[i],oldTree);
 return 0;
};
 
 
 
 uiTreeObject.prototype.enableThreeStateCheckboxes=function(mode){this.tscheck=convertStringToBoolean(mode);};
 




 
 uiTreeObject.prototype.enableTreeImages=function(mode){this.timgen=convertStringToBoolean(mode);};
 
 
 
 
 uiTreeObject.prototype.enableFixedMode=function(mode){this.hfMode=convertStringToBoolean(mode);};
 
 
 uiTreeObject.prototype.enableCheckBoxes=function(mode){this.checkBoxOff=convertStringToBoolean(mode);};
 
 uiTreeObject.prototype.setStdImages=function(image1,image2,image3){
 this.imageArray[0]=image1;this.imageArray[1]=image2;this.imageArray[2]=image3;};

 
 uiTreeObject.prototype.enableTreeLines=function(mode){
 this.treeLinesOn=convertStringToBoolean(mode);
}

 
 uiTreeObject.prototype.setImageArrays=function(arrayName,image1,image2,image3,image4,image5){
 switch(arrayName){
 case "plus": this.plusArray[0]=image1;this.plusArray[1]=image2;this.plusArray[2]=image3;this.plusArray[3]=image4;this.plusArray[4]=image5;break;
 case "minus": this.minusArray[0]=image1;this.minusArray[1]=image2;this.minusArray[2]=image3;this.minusArray[3]=image4;this.minusArray[4]=image5;break;
}
};

 
 uiTreeObject.prototype.openItem=function(itemId){
 var temp=this._globalIdStorageFind(itemId);
 if(!temp)return 0;
 else return this._openItem(temp);
};

 
 uiTreeObject.prototype._openItem=function(item){
 this._HideShow(item,2);
 if((item.parentObject)&&(this._getOpenState(item.parentObject)<0))
 this._openItem(item.parentObject);
};
 
 
 uiTreeObject.prototype.closeItem=function(itemId){
 if(this.rootId==itemId)return 0;
 var temp=this._globalIdStorageFind(itemId);
 if(!temp)return 0;
 if(temp.closeble)
 this._HideShow(temp,1);
};
 
 

 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 uiTreeObject.prototype.getLevel=function(itemId){
 var temp=this._globalIdStorageFind(itemId);
 if(!temp)return 0;
 return this._getNodeLevel(temp,0);
};
 
 

 
 uiTreeObject.prototype.setItemCloseable=function(itemId,flag)
{
 flag=convertStringToBoolean(flag);
 if((itemId)&&(itemId.span))
 var temp=itemId;
 else 
 var temp=this._globalIdStorageFind(itemId);
 if(!temp)return 0;
 temp.closeble=flag;
};
 
 
 uiTreeObject.prototype._getNodeLevel=function(itemObject,count){
 if(itemObject.parentObject)return this._getNodeLevel(itemObject.parentObject,count+1);
 return(count);
};
 
 
 uiTreeObject.prototype.hasChildren=function(itemId){
 var temp=this._globalIdStorageFind(itemId);
 if(!temp)return 0;
 else 
{
 if((this.XMLsource)&&(!temp.XMLload))return true;
 else 
 return temp.childsCount;
};
};
 


 
 
 uiTreeObject.prototype.setItemText=function(itemId,newLabel,newTooltip)
{
 var temp=this._globalIdStorageFind(itemId);
 if(!temp)return 0;
 temp.label=newLabel;
 temp.span.innerHTML=newLabel;
 temp.span.parentNode.title=newTooltip||"";
};
 
 uiTreeObject.prototype.refreshItem=function(itemId){
 if(!itemId)itemId=this.rootId;
 var temp=this._globalIdStorageFind(itemId);
 this.deleteChildItems(itemId);
 this.loadXML(this.XMLsource+getUrlSymbol(this.XMLsource)+"id="+escape(itemId));
};
 
 
 uiTreeObject.prototype.setItemImage2=function(itemId,image1,image2,image3){
 var temp=this._globalIdStorageFind(itemId);
 if(!temp)return 0;
 temp.images[1]=image2;
 temp.images[2]=image3;
 temp.images[0]=image1;
 this._correctPlus(temp);
};
 
 uiTreeObject.prototype.setItemImage=function(itemId,image1,image2)
{
 var temp=this._globalIdStorageFind(itemId);
 if(!temp)return 0;
 if(image2)
{
 temp.images[1]=image1;
 temp.images[2]=image2;
}
 else temp.images[0]=image1;
 this._correctPlus(temp);
};
 
 
 
 uiTreeObject.prototype.getSubItems =function(itemId)
{
 var temp=this._globalIdStorageFind(itemId);
 if(!temp)return 0;

 var z="";
 for(i=0;i<temp.childsCount;i++)
 if(!z)z=temp.childNodes[i].id;
 else z+=","+temp.childNodes[i].id;
 return z;
};
 
 uiTreeObject.prototype.getAllSubItems =function(itemId){
 return this._getAllSubItems(itemId);
}
 
 
 uiTreeObject.prototype._getAllSubItems =function(itemId,z,node)
{
 if(node)temp=node;
 else{
 var temp=this._globalIdStorageFind(itemId);
};
 if(!temp)return 0;
 
 z="";
 for(var i=0;i<temp.childsCount;i++)
{
 if(!z)z=temp.childNodes[i].id;
 else z+=","+temp.childNodes[i].id;
 var zb=this._getAllSubItems(0,z,temp.childNodes[i])
 if(zb)z+=","+zb;
}
 return z;
};
 

 
 
 uiTreeObject.prototype.selectItem=function(itemId,mode){
 mode=convertStringToBoolean(mode);
 var temp=this._globalIdStorageFind(itemId);
 if(!temp)return 0;
 if(this._getOpenState(temp.parentObject)==-1)
 this.openItem(itemId);
 
 if(mode)
 this.onRowSelect(0,temp.htmlNode.childNodes[0].childNodes[0].childNodes[3],false);
 else
 this.onRowSelect(0,temp.htmlNode.childNodes[0].childNodes[0].childNodes[3],true);
};
 
 
 uiTreeObject.prototype.getSelectedItemText=function()
{
 if(this.lastSelected)
 return this.lastSelected.parentObject.htmlNode.childNodes[0].childNodes[0].childNodes[3].childNodes[0].innerHTML;
 else return("");
};




 
 uiTreeObject.prototype._compressChildList=function(Count,Nodes)
{
 Count--;
 for(var i=0;i<Count;i++)
{
 if(Nodes[i]==0){Nodes[i]=Nodes[i+1];Nodes[i+1]=0;}
};
};
 
 uiTreeObject.prototype._deleteNode=function(itemId,htmlObject,skip){

 if(!skip){
 this._globalIdStorageRecSub(htmlObject);
}
 
 if((!htmlObject)||(!htmlObject.parentObject))return 0;
 var tempos=0;var tempos2=0;
 if(htmlObject.tr.nextSibling)tempos=htmlObject.tr.nextSibling.nodem;
 if(htmlObject.tr.previousSibling)tempos2=htmlObject.tr.previousSibling.nodem;
 
 var sN=htmlObject.parentObject;
 var Count=sN.childsCount;
 var Nodes=sN.childNodes;
 for(var i=0;i<Count;i++)
{
 if(Nodes[i].id==itemId){
 if(!skip)sN.htmlNode.childNodes[0].removeChild(Nodes[i].tr);
 Nodes[i]=0;
 break;
}
}
 this._compressChildList(Count,Nodes);
 if(!skip){
 sN.childsCount--;
}

 if(tempos){
 this._correctPlus(tempos);
 this._correctLine(tempos);
}
 if(tempos2){
 this._correctPlus(tempos2);
 this._correctLine(tempos2);
}
 if(this.tscheck)this._correctCheckStates(sN);
};
 
 uiTreeObject.prototype.setCheck=function(itemId,state){
 state=convertStringToBoolean(state);
 var sNode=this._globalIdStorageFind(itemId);
 if(!sNode)return;
 if((this.tscheck)&&(this.smcheck))this._setSubChecked(state,sNode);
 else this._setCheck(sNode,state);
 if(this.smcheck)
 this._correctCheckStates(sNode.parentObject);
};
 
 uiTreeObject.prototype._setCheck=function(sNode,state){
 var z=sNode.htmlNode.childNodes[0].childNodes[0].childNodes[1].childNodes[0];
 
 if(state=="notsure")sNode.checkstate=2;
 else if(state)sNode.checkstate=1;else sNode.checkstate=0;

 
 z.src=this.imPath+this.checkArray[sNode.checkstate];
};
 
 
uiTreeObject.prototype.setSubChecked=function(itemId,state){
 var sNode=this._globalIdStorageFind(itemId);
 this._setSubChecked(state,sNode);
 this._correctCheckStates(sNode.parentObject);
}

 
uiTreeObject.prototype._setSubCheckedXML=function(state,sNode){
 if(!sNode)return;
 for(var i=0;i<sNode.childNodes.length;i++){
 var tag=sNode.childNodes[i];
 if((tag)&&(tag.tagName=="item")){
 if(state)tag.setAttribute("checked",1);
 else tag.setAttribute("checked","");
 this._setSubCheckedXML(state,tag);
}
}
}


 
 uiTreeObject.prototype._setSubChecked=function(state,sNode){
 state=convertStringToBoolean(state);
 if(!sNode)return;
 if(sNode.unParsed)
 this._setSubCheckedXML(state,sNode.unParsed)
 for(var i=0;i<sNode.childsCount;i++)
{
 this._setSubChecked(state,sNode.childNodes[i]);
};
 var z=sNode.htmlNode.childNodes[0].childNodes[0].childNodes[1].childNodes[0];
 
 if(state)sNode.checkstate=1;
 else sNode.checkstate=0;

 z.src=this.imPath+this.checkArray[sNode.checkstate];
};

 
 uiTreeObject.prototype.isItemChecked=function(itemId){
 var sNode=this._globalIdStorageFind(itemId);
 if(!sNode)return;
 return sNode.checkstate;
};





 
 uiTreeObject.prototype.getAllChecked=function(){
 return this._getAllChecked("","",1);
}
 
 uiTreeObject.prototype.getAllCheckedBranches=function(){
 return this._getAllChecked("","",0);
}
 
 
 uiTreeObject.prototype._getAllChecked=function(htmlNode,list,mode){
 if(!htmlNode)htmlNode=this.htmlNode;
 if(((mode)&&(htmlNode.checkstate==1))||((!mode)&&(htmlNode.checkstate>0)))
 if(!htmlNode.nocheckbox){if(list)list+=","+htmlNode.id;else list=htmlNode.id;}
 var j=htmlNode.childsCount;
 for(var i=0;i<j;i++)
{
 list=this._getAllChecked(htmlNode.childNodes[i],list,mode);
};
 if(htmlNode.unParsed)
 list=this._getAllCheckedXML(htmlNode.unParsed,list,mode);

 if(list)return list;else return "";
};


 uiTreeObject.prototype._getAllCheckedXML=function(htmlNode,list,mode){
 var j=htmlNode.childNodes.length;
 for(var i=0;i<j;i++)
{
 var tNode=htmlNode.childNodes[i];
 if(tNode.tagName=="item")
{
 var z=tNode.getAttribute("checked");
 if((z!=null)&&(z!="")&&(z!="0"))
 if(((z=="-1")&&(!mode))||(z!="-1"))
 if(list)list+=","+tNode.getAttribute("id");
 else list=htmlNode.id;

 list=this._getAllChecked(tNode,list,mode);
}
};

 if(list)return list;else return "";
};


 
 uiTreeObject.prototype.deleteChildItems=function(itemId)
{
 var sNode=this._globalIdStorageFind(itemId);
 if(!sNode)return;
 var j=sNode.childsCount;
 for(var i=0;i<j;i++)
{
 this._deleteNode(sNode.childNodes[0].id,sNode.childNodes[0]);
};
};

 
uiTreeObject.prototype.deleteItem=function(itemId,selectParent){
 this._deleteItem(itemId,selectParent);
 
 this.allTree.childNodes[0].border = "1";
 this.allTree.childNodes[0].border = "0";
}
 
uiTreeObject.prototype._deleteItem=function(itemId,selectParent,skip){
 selectParent=convertStringToBoolean(selectParent);
 var sNode=this._globalIdStorageFind(itemId);
 if(!sNode)return;
 if(selectParent)this.selectItem(this.getParentId(this.getSelectedItemId()),1);
 else
 if(sNode==this.lastSelected.parentObject)
 this.lastSelected=null;
 if(!skip){
 this._globalIdStorageRecSub(sNode);
 
};
 var zTemp=sNode.parentObject;
 this._deleteNode(itemId,sNode,skip);
 this._correctPlus(zTemp);
 this._correctLine(zTemp);
 return zTemp;


};
 
 
 uiTreeObject.prototype._globalIdStorageRecSub=function(itemObject){
 for(var i=0;i<itemObject.childsCount;i++)
{
 this._globalIdStorageRecSub(itemObject.childNodes[i]);
 this._globalIdStorageSub(itemObject.childNodes[i].id);
};
 this._globalIdStorageSub(itemObject.id);
};
 
 
 uiTreeObject.prototype.insertNewNext=function(parentItemId,itemId,itemName,itemActionHandler,image1,image2,image3,optionStr,childs){
 var sNode=this._globalIdStorageFind(parentItemId);
 if((!sNode)||(!sNode.parentObject))return(0);

 this._attachChildNode(0,itemId,itemName,itemActionHandler,image1,image2,image3,optionStr,childs,sNode);

};


 
 
 uiTreeObject.prototype.getItemIdByIndex=function(itemId,index){
 var z=this._globalIdStorageFind(itemId);
 if((!z)||(index>z.childsCount))return null;
 return z.childNodes[index].id;
};

 
 uiTreeObject.prototype.getChildItemIdByIndex=function(itemId,index){
 var z=this._globalIdStorageFind(itemId);
 if((!z)||(index>z.childsCount))return null;
 return z.childNodes[index].id;
};


 
 

 
 uiTreeObject.prototype.setDragHandler=function(func){if(typeof(func)=="function")this.dragFunc=func;else this.dragFunc=eval(func);};

 
 uiTreeObject.prototype._clearMove=function(htmlNode){
 if((htmlNode.parentObject)&&(htmlNode.parentObject.span)){
 htmlNode.parentObject.span.className='standartTreeRow';
 if(htmlNode.parentObject.acolor)htmlNode.parentObject.span.style.color=htmlNode.parentObject.acolor;
}
 
 this.selectionBar.style.display="none";
 
 this.allTree.className="containerTableStyle";
};
 
 
 uiTreeObject.prototype.enableDragAndDrop=function(mode){
 this.dragAndDropOff=convertStringToBoolean(mode);
 if(this.dragAndDropOff)this.dragger.addDragLanding(this.allTree,this);
};


 
 uiTreeObject.prototype._setMove=function(htmlNode,x,y){
 if(htmlNode.parentObject.span){
 
 var a1=getAbsoluteTop(htmlNode);
 var a2=getAbsoluteTop(this.allTree);
 
 this.dadmodec=this.dadmode;
 this.dadmodefix=0;


 if(this.dadmodec==0)
{
 htmlNode.parentObject.span.className='selectedTreeRow';
 if(htmlNode.parentObject.scolor)htmlNode.parentObject.span.style.color=htmlNode.parentObject.scolor;
}
 else{
 htmlNode.parentObject.span.className='standartTreeRow';
 if(htmlNode.parentObject.acolor)htmlNode.parentObject.span.style.color=htmlNode.parentObject.acolor;
 this.selectionBar.style.top=a1-a2+16+this.dadmodefix+"px";
 this.selectionBar.style.left="5px";
 this.selectionBar.style.display="";
}

 
 if(this.autoScroll)
{
 
 if((a1-a2-parseInt(this.allTree.scrollTop))>(parseInt(this.allTree.offsetHeight)-50))
 this.allTree.scrollTop=parseInt(this.allTree.scrollTop)+20;
 
 if((a1-a2)<(parseInt(this.allTree.scrollTop)+30))
 this.allTree.scrollTop=parseInt(this.allTree.scrollTop)-20;
}
}
};



 
uiTreeObject.prototype._createDragNode=function(htmlObject){
 dhtmlObject=htmlObject.parentObject;
 if(this.lastSelected)this._clearMove(this.lastSelected);
 var dragSpan=document.createElement('div');
 dragSpan.innerHTML=dhtmlObject.label;
 dragSpan.style.position="absolute";
 dragSpan.className="dragSpanDiv";
 return dragSpan;
}

 

uiTreeObject.prototype._preventNsDrag=function(e){
 if((e)&&(e.preventDefault)){e.preventDefault();return false;}
 return false;
}

uiTreeObject.prototype._drag=function(sourceHtmlObject,dhtmlObject,targetHtmlObject){

 if(this._autoOpenTimer)clearTimeout(this._autoOpenTimer);

 if(!targetHtmlObject.parentObject){
 targetHtmlObject=this.htmlNode.htmlNode.childNodes[0].childNodes[0].childNodes[1].childNodes[0];
 this.dadmodec=0;
}

 this._clearMove(targetHtmlObject);
 var z=targetHtmlObject.parentObject.treeNod;
 z._clearMove("");
 
 if((!this.dragMove)||(this.dragMove()))
{
 var newID=this._moveNode(sourceHtmlObject.parentObject,targetHtmlObject.parentObject);
 z.selectItem(newID);
}

 try{}
 catch(e){
 return;
}
}

uiTreeObject.prototype._dragIn=function(htmlObject,shtmlObject,x,y){
 if(!htmlObject.parentObject)
{
 
 
 this.allTree.className="containerTableStyle selectionBox";
 
 return htmlObject;
 
}
 
 if((!this._checkParenNodes(shtmlObject.parentObject.id,htmlObject.parentObject,shtmlObject.parentObject))&&(htmlObject.parentObject.id!=shtmlObject.parentObject.id))
{
 htmlObject.parentObject.span.parentNode.appendChild(this.selectionBar);
 this._setMove(htmlObject,x,y);
 if(this._getOpenState(htmlObject.parentObject)<0)
 this._autoOpenTimer=window.setTimeout(new callerFunction(this._autoOpenItem,this),1000);
 this._autoOpenId=htmlObject.parentObject.id;
 return htmlObject;
}
 else return 0;
}
uiTreeObject.prototype._autoOpenItem=function(e,treeObject){
 treeObject.openItem(treeObject._autoOpenId);
};
uiTreeObject.prototype._dragOut=function(htmlObject){
this._clearMove(htmlObject);
if(this._autoOpenTimer)clearTimeout(this._autoOpenTimer);
}



 
uiTreeObject.prototype._getNextNode=function(item,mode){
 if((!mode)&&(item.childsCount))return item.childNodes[0];
 if(item==this.htmlNode)
 return -1;
 if((item.tr)&&(item.tr.nextSibling)&&(item.tr.nextSibling.nodem))
 return item.tr.nextSibling.nodem;

 return this._getNextNode(item.parentObject,true);
};

 
uiTreeObject.prototype._lastChild=function(item){
 if(item.childsCount)
 return this._lastChild(item.childNodes[item.childsCount-1]);
 else return item;
};

 
uiTreeObject.prototype._getPrevNode=function(node,mode){
 if((node.tr)&&(node.tr.previousSibling)&&(node.tr.previousSibling.nodem))
 return this._lastChild(node.tr.previousSibling.nodem);

 if(node.parentObject)
 return node.parentObject;
 else return -1;
};

uiTreeObject.prototype.isLocked = function(itemId){
	if(this._getOpenState(this._globalIdStorageFind(itemId)) == -1) return true;
	else return false;
}

uiTreeObject.prototype.deleteSelectedItem=function(selectParent){
	var itemId = this.getSelectedItemId();
	if(itemId != '') this.deleteItem(itemId, selectParent);
}

uiTreeObject.prototype.clearSelection=function(){
	this._unselectItem(this._globalIdStorageFind(this.getSelectedItemId()));
}