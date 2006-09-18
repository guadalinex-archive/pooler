<html>
	<head>
		<link rel="stylesheet" type="text/css" href="../css/toolbar.css">
		<script type="text/javascript" src="../js/prototype.js"></script>
		<script type="text/javascript" src="../js/poolerToolBar.class.js"></script>
	</head>
	<body>
		<div id="toolbar_content"></div>
		<script type="text/javascript">
			var myToolbarContent = new poolerToolBar('toolbar_content', '400px', '30px');
			myToolbarContent.setOnClickHandler(function(id){alert(id)});
			myToolbarContent.setOnShowHandler(function(){});
			myToolbarContent.loadXML('toolbar_content_log.xml.php', true);
		</script>
		<span onclick="myToolbarContent.setText('yo mismo')">Yo mismo</span>
	</body>
</html>