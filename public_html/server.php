<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
        "http://www.w3.org/TR/html4/loose.dtd">

<html>
	<head>
		<meta http-equiv="Content-type" content="text/html;charset=UTF-8">
		
		<title>Server Overview</title>
	
		<link href="/favicon.ico" type="image/ico" rel="shortcut icon">
		<link href="/favicon.ico" type="image/ico" rel="icon">
	
		<!--<link rel="stylesheet" type="text/css" href="/css/style.css">-->
		
		<!--<script type="text/javascript" src="/js/tinydropdown2/tinydropdown.js"></script>-->
		
		<script type="text/javascript" src="jquery/jquery.min.js"></script>
		<!--<script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>-->
		
		<script type="text/javascript" src="jquery/tablesorter/jquery.tablesorter.js"></script>
		<script type="text/javascript" src="js/StaticJSONP.js"></script>
		<script type="text/javascript" src="jquery/jquery.json-2.3.min.js"></script>
		
		<script type="text/javascript" src="utils.js"></script>
		<script type="text/javascript" src="main_server.js"></script>

<!-- 304 Not Modified is to hard heh?

<script type="text/javascript" src="http://www.google.com/jsapi"></script>
<script type="text/javascript">
	google.load('visualization', '1', {packages: ['corechart']});
</script>
-->
		<script type="text/javascript" src="js/google_jsapi.js"></script>
		<script type="text/javascript" src="js/google_format%2ben%2cdefault%2ccorechart.I.js"></script>
	</head>
	<body>
		<center>
			<table id="content">
				<tr>
					<td id="server-hostname" colspan="2">
						<p class="cvar-sv_hostname">sv_hostname

				<tr>
					<td id="server-map" align="center">
						<img id="map-image" width="320" height="240" src="" alt="mp_beer">
					<td id="server-info" align="center">
						<table>
							<tr> <td>Connect  <td class="server-info-connect"> /connect 1.2.3.4:1337
							<tr> <td>Slots    <td class="server-info-slots">   0/16 (4 private)
							<tr> <td>Gametype <td class="server-info-gametype">B33r
							<tr> <td>Map      <td class="server-info-map">     mp_beer
							<tr> <td>Version  <td class="server-info-version"> 0.1337
						</table>
				
				<tr>
					<td colspan="2" align="center">
							<div id="visualization"></div>
			
				<tr>
					<td id="server-players">
						<table id="players" class="tablesorter">
							<thead>
								<tr> <th>Name <th>Score <th>Ping
							<tbody>
								<tr> <td>1  <td>2  <td>3
								<tr> <td>11 <td>22 <td>33
						</table>
					<td id="server-settings">
						<table id="cvars" class="tablesorter">
							<thead>
								<tr> <th>Key <th>Value
							<tbody>
								<tr> <td>first key  <td>first value
								<tr> <td>second key <td>second value
						</table>

			</table>
		</center>
	</body>
</html>