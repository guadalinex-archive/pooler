//App
var myTabbar = null;
var typeFile = '' //rls, pkg or src
var exitApp = false;

function init_app(){
	myTabbar = new dhtmlXTabBar("tabbar","top");
	myTabbar.setImagePath("../img/");
	myTabbar.setOnSelectHandler(function(id){
		closePopup(); //cerramos cualquier popup abierto
		return true;
	});
	myTabbar.loadXML('../php/tabs.xml.php');
}
/*******************************************************************************/

//Pkg
var myGridPkg = null;
var myToolbarContent = null;
var myToolbarDists = null;
var myTreeDists = null;

function init_pck(){
	//cargamos la barra de herramientas
	myToolbarDists = new dhtmlXToolbarObject('toolbar_dists','100%','20');
	myToolbarDists.setOnClickHandler(toolbarDistsClick);
	myToolbarDists.loadXML("../php/toolbar_dists.xml.php");
	myToolbarDists.showBar();
	
	loadTreeDists();
	
	emptyContentPkg();
}
/*******************************************************************************/

//User
var myToolbarUsers = null;
var myTreeUsers = null;
var myGridDistsUser = null;

function init_user(){
	//cargamos la barra de herramientas
	myToolbarUsers = new dhtmlXToolbarObject('toolbar_users','100%','20');
	myToolbarUsers.setOnClickHandler(toolbarUsersClick);
	myToolbarUsers.loadXML("../php/toolbar_users.xml.php");
	myToolbarUsers.showBar();
	
	loadTreeUsers();
	
	emptyContentUser();
}
/*******************************************************************************/

//log
var myCalendar = null
var myToolbarCalendar = null;
var myGridLog = null;
var myToolbarContentLog = null;

function init_log(){
	//configuramos calendario
	myCalendar = Zapatec.Calendar.setup({
		//align			  : 'cc',
		firstDay          : 1,
		weekNumbers       : false,
		step              : 1,
		flat              : "calendar",
		flatCallback      : flatCalendarCallback
	});
	
	//cargamos la barra de herramientas
	myToolbarCalendar = new dhtmlXToolbarObject('toolbar_calendar','100%','20');
	myToolbarCalendar.setOnClickHandler(toolbarCalendarClick);
	myToolbarCalendar.loadXML("../php/toolbar_calendar.xml.php");
	myToolbarCalendar.showBar();
	
	if(myGridLog == null){
		$('content').innerHTML = '<div id="gridcontrol" style="width:100%; height:100%"></div>';
 		myGridLog = new dhtmlXGridObject('gridcontrol');
		configureGridLog();
		myGridLog.init();
	}
	
	//cargamos la barra de herramientas y el grid
	createToolBarContentLog();
	myToolbarContentLog.loadXML("../php/toolbar_content_log.xml.php");
	myToolbarContentLog.showBar();
	myToolbarContentLog.setOnShowHandler(setTimeout('loadGridLog("' + myCalendar.date.print("%Y%m%d") + '")', 500));
}