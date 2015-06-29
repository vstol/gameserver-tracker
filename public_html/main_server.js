function initVisible() {
    var hidden, change, vis = {
            hidden: "visibilitychange",
            mozHidden: "mozvisibilitychange",
            webkitHidden: "webkitvisibilitychange",
            msHidden: "msvisibilitychange",
            oHidden: "ovisibilitychange" /* not currently supported */
        };             
    for (var hidden in vis) {
        if (vis.hasOwnProperty(hidden) && hidden in document) {
            change = vis[hidden];
            break;
        }
    }
    if (change)
        document.addEventListener(change, onchange);
    else if (/*@cc_on!@*/false) // IE 9 and lower
        document.onfocusin = document.onfocusout = onchange
    else
        window.onfocus = window.onblur = onchange;

	document.body.className = "visible";
    function onchange (evt) {
		//console.log(evt);
        var body = document.body;
        evt = evt || window.event;

        if (evt.type == "focus" || evt.type == "focusin")
            body.className = "visible";
        else if (evt.type == "blur" || evt.type == "focusout")
            body.className = "hidden";
        else        
            body.className = this[hidden] ? "hidden" : "visible";
    }
};




var dropdown;

var main;
function fade()
{
	element = main;
	
	if (element.fadeCounter == null)
		element.fadeCounter = 0;
	
	time = 100;
	if (element.fadeCounter > 250)
		element.toAdd = -6;
	if (element.fadeCounter < 10)
		element.toAdd = 6;
	element.fadeCounter += element.toAdd;
	
	px = element.fadeCounter;
	px = 4;
	colorRed = (element.fadeCounter % 255).toString(16);
	if (colorRed.length == 1)
		colorRed = "0" + colorRed;
	
	//main.style.borderLeft = px + "px dashed #" + colorRed + "0000";
	//main.style.borderRight = px + "px dashed #" + colorRed + "0000";
	
	main.style.borderLeft = px + "px solid #" + colorRed + "0000";
	main.style.borderRight = px + "px solid #" + colorRed + "0000";
	//alert(px + "px dashed '#" + colorRed + "0000'");
	setTimeout("fade()", time);
}


var lastSortList = [[1, 1], [0,0]]; // score desc, name asc
var lastSortList_cvar = [[0, 1]]; // cvar key desc


function initFade()
{
	main = document.getElementById("main");
	main.style.borderLeft = "5px dashed red";
	main.style.borderRight = "5px dashed red";
	
	main.toAdd = 6;
	fade();
}


	
	function getRandomRows()
	{
		rows = [];
		abs = 0;
		for (var i=0; i<500; i++)
		{
			abs += parseInt(Math.random()*1000)%4;
			abs -= parseInt(Math.random()*1000)%4;
			abs = Math.abs(abs) % 60;
			rows.push([new Date(2222312313123+i*1004400), abs]);
		}
		return rows;
	}
	
	function getTestRows()
	{
		return [
			[new Date(2008, 1 ,1), 0],
			[new Date(2008, 1 ,3), 11],
			[new Date(2008, 1 ,4), 13],
			[new Date(2008, 1 ,5), 14],
			[new Date(2008, 1 ,6), 13],
			[new Date(2008, 1 ,7), 15]
		];
	}
	
	var ac; // inited in initGraph and used in drawVisualization
	function initGraph()
	{
		ac = new google.visualization./*Stepped*/AreaChart(document.getElementById('visualization'));
	}
	function drawVisualization(rows)
	{
		var data = new google.visualization.DataTable();
		data.addColumn('datetime', 'Date');
		data.addColumn('number', 'Players');
		data.addRows(rows);

		//ac = new google.visualization.AreaChart(document.getElementById('visualization'));
		ac.draw(
			data,
			{
				width: 800,
				height: 150,
				//legend: {position: "bottom"},
				legend: "none",
				//chartArea: {width: "85%", height: "70%", top: "10%"},
				chartArea: {top: "10", left: "30", height: "120", width: "760"},
				backgroundColor: "transparent",
				colorbar: "red",
				vAxis: {
					textStyle: {color: "white"}
				},
				hAxis: {
					textStyle: {color: "white"}
				},
				tooltip: {
					textStyle: {color: "blue"}
				}
			}
		);
	}
	
	//google.setOnLoadCallback(drawVisualization);

function main123()
{
	//dropdown = new TINY.dropdown.init("dropdown", {id:'menu', active:'menuhover'});

	document.isActive = true;
	
	initVisible();
	googleAnalytics();
	
	if ($("#players").length)
	{
		test1234(); // get table on page-refresh immediatly
		// THATS A FAILURE:
		// because with 5 Iframes, 5 querires TO THE SAME TIME does lag on client and huger load on server!
		// reinit setTimeout() WHEN ITS DONE
		//window.setInterval(test1234, 5000); // then all 5 seconds
		
		$("#players").tablesorter({sortList: lastSortList});
		
		$("#players").on("sortEnd", function(e){
			lastSortList = e.target.config.sortList;
		});
		

		$("#cvars").tablesorter({sortList: lastSortList_cvar});
		$("#cvars").on("sortEnd", function(e){
			lastSortList_cvar = e.target.config.sortList;
		});
	}
	
	if (get("graph") != "0")
	{
		initGraph();
		updateGraph();
		//window.setInterval(updateGraph, 5500); // players are 5000ms also, prevent both at same time
	}
}
//window.onload = main123;

/*
$(document).ready(function(){
	console.log("doc ready");
});
*/
$(window).load(function(){
	//console.log("win load");
	main123();
});

function isVisible()
{
	if (
		typeof document.body.className != "undefined" &&
		document.body.className == "visible"
	)
		return true;
	return false;
}

function updateGraph()
{
	if (!isVisible())
	{
		//console.log("ignore update for " + ip + ":" + port);
		window.setTimeout(updateGraph, 5500); // players are 5000ms also, prevent both at same time
		return;
	}
	console.log("graph update for " + ip + ":" + port);

	request = {
		//ip: "85.25.95.104",
		//port: 28933
		ip: ip,
		port: port
	}
	json_str = $.toJSON(request);
	//alert(json_str);
	$.ajax({
		url: reg = "graph.php?json=" + json_str,
		dataType: "json",
		success: function(data){
		
			if (data.success == false)
			{
				console.log(data.error);
				return;
			}
		
			//console.log(data);
			//return;
		
			firstSplit = data.result.split("|");
			newestTime = parseInt(firstSplit[0]);
			deltaTimes = firstSplit[1];
		
			toParse = deltaTimes.split(",");
		
			rows = [];
			for (var i=0; i<toParse.length; i++)
			{
				var tmp = toParse[i].split(":");
				x = new Date((newestTime - parseInt(tmp[0])) * 1000);
				y = parseInt(tmp[1]);
				
				
				rows.push([x, y]);
			}
			/*
			alert(data);
			return;
			if (data.success)
				alert("Thank you for registering!\nThe 4-letters-activation code has been sent to you email-address!\nHave much fun with online server lists. The easy way to track servers! :)")
			else
				alert(data.error);
			regbla = data;
			*/
			
			//rows = getRandomRows();
			//rows = getTestRows();
			drawVisualization(rows);
			window.setTimeout(updateGraph, 5500); // players are 5000ms also, prevent both at same time
		}
	});


}

function onFocus()
{
	//console.log("focus!");
	document.isActive = true;
	//document.liveUpdate.isActive.checked = true;
}
function onBlur()
{
	//console.log("blur!");
	document.isActive = false;
	//document.liveUpdate.isActive.checked = false;
}
window.onfocus = onFocus;
window.onblur = onBlur;
//top.window.onfocus = onFocus;
//top.window.onblur = onBlur;
//window.parent.onfocus = onFocus; // access denied -.-
//window.parent.onblur = onBlur; // access denied -.-
document.onfocusin = onFocus; // ie hack
document.onfocusout = onBlur; // ie hack

/*
	if i click in firebug, the tab is blurred, but the tab is still open
	if i click then in another tab, the blur-event isnt send again
	so the page is document.isActive=true, but really another tab is shown
	
	if i would force to document.isActive=true with the mouse-event, then its blurred but active
	so after swapping to another tab doesnt blurres the tab, it would still be active till its focused/blured
	
	to prevent that, i ignore the firebug-effect (but it even happens in the search-engine-tab -.-)
	ok, i tried to fake focus with window.focus(); window.scroll(0,0) but its not activating the focus
	now, i just do a on/off-button FOR THE USER ITSELF, so he isnt pissed, when its deactivating and he needs it
*/
/*
function onMouseMove()
{
	document.fooForm.fooInput.focus();
}
window.onmousemove = onMouseMove;
*/

/*
	// to debug:
	document.title = "";
	setInterval(function(){
		if (!document.isActive)
			document.title += ".";
	}, 1000);

*/


	//var mirror = "http://modmaker.io/killtube/";
	//var mirror = "http://sun.killtube.org/killtube/";
	var mirror = "killtube/";
	var resource = get("resource");
	var ip = get("ip");
	var port = get("port");
	
	{
		tmp = window.location.pathname.substr(1).split(":");
		if (tmp.length == 2)
		{
			ip = tmp[0];
			port = tmp[1];
		}
		if (resource == "")
			resource = "http://tracker.killtube.org/iframe-styles/frontpage";
	}
	
	var identifier = ip + ":" + port;
	//var uri = mirror + identifier + ".js?";
	var uri = mirror + "?ip=" + ip + "&port=" + port;
	//console.log("using uri: " + uri);
	
	var failedImages = new Object(); // prevent polling of pics, save failed src's
	
	function useStylesheet(url)
	{
		e = document.createElement("link");
		e.setAttribute("rel", "stylesheet");
		e.setAttribute("type", "text/css");
		e.setAttribute("href", url);
		document.getElementsByTagName("head")[0].appendChild(e);
	}
	useStylesheet(resource + "/style.css");
		
		
		

		
		

		
		function parse_cvars_2(str)
		{
			cvars = new Object(); // to use as assoc array
			
			split = str.split("\\");
			
			for (var i=1; i<split.length; i+=2)
			{
				key = split[i];
				value = split[i+1];
			
				cvars[key] = value;
			}
			return cvars;
		}
		
		function cod2_parse_status($status)
		{
			// $parts[0] = \xFF\xFF\xFF\xFFstatusResponse
			// $parts[1] = \fs_game\bots\g_antilag\1\g_gametype\tdm
			// $parts[...] = 0 37 "^^00S^^33uicide^^00C^^33ommando"
			// so atleast 2 elements, else something failed
			$parts = $status.split("\n");
			
			// figure out some possible errors
			if ($parts.length < 2)
				return false;
			if ($parts[0] != "\xFF\xFF\xFF\xFFstatusResponse")
				return false;
			
			
			
		// parse the players
		$players = new Array();
		$len = $parts.length - 1; // -1 for the \n behind every player
		for ($i=2; $i<$len; $i++)
		{
			$line = $parts[$i];
			
			/*
			$tmp = explode("\x20", $parts[$i]);
			$score = $tmp[0];
			$ping = $tmp[1];
			$name = substr($tmp[2], 1, -1); // remove the quotation marks like: "<name>"
			*/
			
			$tmp = $line.split("\"");
			$before = $tmp[0];
			$tmp2 = $before.split(" ");
			$score = $tmp2[0];
			$ping = parseInt($tmp2[1]);
			$name = $tmp[1];
			
			$players.push({
				"score": $score,
				"ping": $ping,
				"name": $name
			});
		}
			
			
			
			return {
				"cvars": parse_cvars_2($parts[1]),
				"players": $players
			}
		}
		
		var bla;
		var foo;
		function test1234()
		{
			if (!isVisible())
			{
				//console.log("ignore players update for " + ip + ":" + port);
				window.setTimeout(test1234, 5000); // then all 5 seconds
				return;
			}
		
		
			console.log("players update for " + ip + ":" + port);
		
			if (!document.isActive)
			{
				/*
					bullshit: its not possible to get it to work within iframes
					solution would be a .js in the top-page, but thats a security-risk
				*/
				//console.log("ignore update");
				//return;
			}
			
			//console.log("JSON-script: ", uri);
			
			random = Math.random().toString().substr(2);
			random = "&" + snapInteger(new Date().valueOf(), 5000);
			StaticJSONP.request(uri + random, identifier, function (uid, evt) {
				bla = evt;
				
				$parsed = cod2_parse_status(evt.status);
				foo = $parsed;
				
				time = evt.time;
				

				$players = $parsed["players"];
				html = "";
				for (var $i=0; $i<$players.length; $i++)
				{
					$player = $players[$i];
					name = $player["name"];
					score = $player["score"];
					ping = $player["ping"];
					html += "<tr><td>"+color_name(name)+"<\/td><td>"+score+"<\/td><td>"+ping+"<\/td><\/tr>";
				}
				if (html == "")
					html = "<tr><td><td><td>"; // else everything after this doesnt work also: so, it need to be filled
				$("#players tbody").html(html); 
				$("#players").trigger("update");
				$("#players").trigger("sorton", [lastSortList]);
				
		

				cvars = $parsed["cvars"];
				html = "";
				for (var i in cvars)
				{
					key = i;
					value = cvars[i];
					value = color_name(value);
					//value = new Array(10).join(value + " "); // huge cvars-values design test
					
					html += "<tr><td>" + key + "<td>" + value;
				}
				$("#cvars tbody").html(html);
				
				$("#cvars").trigger("update");
				$("#cvars").trigger("sorton", [lastSortList_cvar]);
				
				$(".cvar-sv_hostname").html(color_name(cvars.sv_hostname));
				
				$(".server-info-connect").html("/connect " + ip + ":" + port);
				$(".server-info-slots").html($players.length + "/" + cvars.sv_maxclients + " ("+cvars.sv_privateClients+" private)");
				$(".server-info-gametype").html(color_name(cvars.g_gametype));
				$(".server-info-map").html(color_name(cvars.mapname));
				$(".server-info-version").html(color_name(cvars.shortversion));
				
				newImage = new Image();
				newImage.onerror = function(){
					$("#map-image").attr("src", resource + "/no_screen.jpg"); // default no map image
					//console.log("img not found:" + this.src);
					failedImages[src] = true;
				}
				newImage.onload = function(){
					$("#map-image").attr("src", this.src); // default no map image
					//console.log("img loaded");
				}
				src = resource + "/maps/" + cvars.mapname + ".jpg";
				
				if (typeof failedImages[src] == "undefined")
				{
					//console.log("TRY loading image: " + src);
					newImage.src = src;
				} else {
					//console.log("PREVENT loading image: " + src);
				}
				
				
				window.setTimeout(test1234, 5000); // then all 5 seconds
			});
		}
		
		var _gaq = _gaq || []; // need to be global
		function googleAnalytics()
		{
			_gaq.push(['_setAccount', 'UA-32417837-1']);
			_gaq.push(['_setDomainName', 'killtube.org']);
			_gaq.push(['_trackPageview']);

			(function() {
			var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
			ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
			var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
			})();
		}
		