			bal = undefined;
			lastSort = [[7,1]];
			
			function now()
			{
				return new Date().valueOf();
			}
			
			function show_all_servers()
			{
				show_list_id = undefined;
				updateServers(true);
			}
			
			
			function add_server_to_list(server_id)
			{
				if (typeof add_to_list_id == "undefined")
				{
					alert("NOTICE!\nNOTICE!\nNOTICE!\nplease select first a list");
					return;
				}
				request = {
					session: get_cookie("session"),
					server_id: server_id,
					list_id: add_to_list_id
				}
				json_str = $.toJSON(request);
				//alert(json_str);
				$.ajax({
					url: reg = "add_server_to_list.php?json=" + json_str,
					dataType: "json",
					success: function(data){
					
						if (data.success == false)
						{
							alert("ERROR!\nERROR!\nERROR!\n" + data.error);
							return;
						}
						alert("SUCCESS!\nSUCCESS!\nSUCCESS!\nserver got added to list");
						refreshLists();
						
					}
				});
			}
			
			function delete_server_from_list(server_id, list_id)
			{
				request = {
					session: get_cookie("session"),
					server_id: server_id,
					list_id: list_id
				}
				json_str = $.toJSON(request);
				//alert(json_str);
				$.ajax({
					url: reg = "delete_server_from_list.php?json=" + json_str,
					dataType: "json",
					success: function(data){
					
						if (data.success == false)
						{
							alert("ERROR!\nERROR!\nERROR!\n" + data.error);
							return;
						}
						//alert("SUCCESS!\nSUCCESS!\nSUCCESS!\nserver got deleted from list");
						updateServers(true);
						refreshLists();
						
					}
				});
			}
			
			var lastCall = 0; // first time update in every case
			function updateServers(forceUpdate)
			{
				if (typeof forceUpdate == "undefined")
				{
					if (document.stop_update == true)
						return;
						
					// prevent clicking very often on stop/start-Update, with every pair is one update + setTimeout's after it
					if (lastCall + 4500 > now())
						return;
				} else {
					console.log("force update");
				}
				lastCall = now();			
			
			
				if (typeof show_list_id != "undefined")
				{
					html = "<tr><td colspan=\"6\">";
					html += "<input type=\"button\" value=\"Show All Servers\" onclick=\"show_all_servers()\">";
					html += " Current List: " + saved_lists[show_list_id].name;
					
					request = {
						session: get_cookie("session"),
						list_id: show_list_id
					}
					json_str = $.toJSON(request);
					//alert(json_str);
					$.ajax({
						url: reg = "get_servers_of_list.php?json=" + json_str,
						dataType: "json",
						success: function(data){
						
							if (data.success == false)
							{
								// just 0 servers... display nonetheless, NO just display all
								// the list may also be deleted! so just update
								//alert("ERROR!\nERROR!\nERROR!\n" + data.error);
								show_list_id = undefined;
								updateServers(true);
								return;
							}
							servers = data.result;
							if (typeof servers != "undefined")
							{
								for (i=0; i<servers.length; i++)
								{
									server = servers[i];
									html += "<tr>";
									//html += "<td>" + server.id;
									html += "<td><input type=\"button\" value=\"DELETE\" onclick=\"delete_server_from_list("+server.id+","+show_list_id+")\">";
									
									html += "<td>" + server.ip + ":" + server.port;
									if (server.password == "1")
										html += "<img src=\"pass.png\" alt=\"pass\">";
									html += "<td>" + server.version;
									
									
									html += "<td>" + server.gametype;
									//html += "<td>" + evt[i].fs_game;
									html += "<td>" + server.players + "/" + server.max_players;
									html += "<td>" + server.average_ping;
									
									html += "<td>" + server.map + " ";
									link = "server.php?ip=" + server.ip + "&port=" + server.port + "&resource=http://killtube.org/iframe-styles/frontpage"
									text = color_name(server.hostname);
									html += "<td><a href=\""+link+"\" target=\"_blank\">" + text + "</a>";
									
								}
							} else {
								html += "<tr> <td>No Servers Found!";
							}
							$("#servers tbody").html(html);							
						}
					});
					
					setTimeout(updateServers, 5000);
					return;
				}
				
				
				

					
				//console.log("update server " + Math.random());
					
				page = document.forms["control"].elements["page"].value;
				max_average_ping = document.forms["control"].elements["max-average-ping"].value;
				password = document.forms["control"].elements["password"].value;
				fullsearch = escape(form_element("control", "fullsearch").value);
				
				numberOfServers = parseInt((viewport_height()-75) / 25); // firefox showed 24px per row
				
				StaticJSONP.request(req = "ajax.php?page=" + page + "&max_average_ping=" + max_average_ping + "&password=" + password + "&numberOfServers="+numberOfServers + "&fullsearch="+fullsearch, "test", function(uid, evt){
					bla = evt;
					servers = evt.result;
					
					pages = Math.floor(evt.foundRows / numberOfServers) + 1;
					//console.log("Pages: " + pages);
					page_html = "";
					current_page = form_element("control", "page").value;
					form_element("control", "page").lastPage = pages - 1; // because it starts at 0
					for (i=0; i<pages; i++)
						if (i==current_page)
							page_html += "<option value=\""+i+"\" selected>Page "+(i+1)+" / "+(pages);
						else
							page_html += "<option value=\""+i+"\">Page "+(i+1)+" / "+(pages);
					$(form_element("control", "page")).html(page_html);
					
					html = "";
					if (typeof servers != "undefined")
					{
						for (i=0; i<servers.length; i++)
						{
							server = servers[i];
							html += "<tr>";
							//html += "<td>" + server.id;
							html += "<td><input type=\"button\" value=\"&crarr;\" onclick=\"add_server_to_list("+server.id+")\">";
							
							html += "<td>" + server.ip + ":" + server.port;
							if (server.password == "1")
								html += "<img src=\"pass.png\" alt=\"pass\">";
							html += "<td>" + server.version;
							
							
							html += "<td>" + server.gametype;
							//html += "<td>" + evt[i].fs_game;
							html += "<td>" + server.players + "/" + server.max_players;
							html += "<td>" + server.average_ping;
							
							html += "<td>" + server.map + " ";
							link = "server.php?ip=" + server.ip + "&port=" + server.port + "&resource=http://tracker.killtube.org/iframe-styles/frontpage"
							text = color_name(server.hostname);
							html += "<td><a href=\""+link+"\" target=\"_blank\">" + text + "</a>";
							
						}
					} else {
						html = "<tr> <td>No Servers Found!";
					}
					$("#servers tbody").html(html);
					$("#servers").trigger("update");
					$("#servers").trigger("sorton", [lastSort]);
					
				});
				
				setTimeout(updateServers, 5000);
			}
		
			
		
			function prepareForm()
			{
				document.forms["control"].elements["prev"].onclick = function(){
					current_page = parseInt(form_element("control", "page").value);
					if (current_page == 0)
						current_page = form_element("control", "page").lastPage; // rotate to end
					else
						current_page--;
					form_element("control", "page").value = current_page;
					updateServers(true);
				}
				document.forms["control"].elements["next"].onclick = function(){
					current_page = parseInt(form_element("control", "page").value);
					current_page++;
					if (current_page > form_element("control", "page").lastPage)
						current_page = 0;
					form_element("control", "page").value = current_page;
					updateServers(true);
				}
				
				document.forms["control"].elements["page"].onchange = function(){
					updateServers(true);
				}
				//document.forms["control"].elements["sort"].onchange = function(){
				//	updateServers(true);
				//}
				form_element("control", "fullsearch").onkeyup = function(){
					updateServers(true);
				}
				form_element("control", "new").onclick = function(){
					form_element("control", "fullsearch").value = "";
					updateServers(true);
				}
				document.forms["control"].elements["password"].onchange = function(){
					updateServers(true);
				}
				document.forms["control"].elements["max-average-ping"].onchange = function(){
					updateServers(true);
				}
				
				
				// color name preview
				var e = document.getElementById("register").elements["name_color"];
				e.onkeyup = function(){
					$("#colored_name").html(color_name(e.value.substr(0,32)));
				};
				// and do the stock-value first
				$("#colored_name").html(color_name(e.value.substr(0,32)));
				
			
			}
		
			function get_cookie(name)
			{
				all = document.cookie.split(";");
				for (i=0; i<all.length; i++)
				{
					kv = all[i].split("=");
					key = unescape(kv[0].substr(1)); // substr(1) to remove whitespace
					value = unescape(kv[1]);
					if (key == name)
						return value;
				}
				return "";
			}
			function set_cookie(name, value)
			{
				document.cookie = escape(name) + "=" + escape(value);
			}
		
			function form_element(form, element)
			{
				return document.forms[form].elements[element];
			}
		
			function handleRegister()
			{
				form_element("register", "do_submit").onclick = function(){
					request = {
						action: "register",
						name_color: form_element("register", "name_color").value,
						name_login: form_element("register", "name_login").value,
						pass: form_element("register", "pass").value,
						mail: form_element("register", "mail").value/*,
						hidden: form_element("register", "hidden").value*/
					}
					json_str = $.toJSON(request);
					//alert(json_str);
					
					$.ajax({
						url: reg = "lists.php?json=" + json_str,
						dataType: "json",
						success: function(data){
							//alert(data);
							if (data.success)
								alert("Thank you for registering!\nThe 4-letters-activation code has been sent to you email-address!\nHave much fun with online server lists. The easy way to track servers! :)")
							else
								alert(data.error);
							regbla = data;
						}
					});
					
					/*
					StaticJSONP.request(reg = "lists.php?json=" + json_str, "lists", function(uid, evt){
						if (evt.success)
							alert("Thank you for registering!\nThe 4-letters-activation code has been sent to you email-address!\nHave much fun with online server lists. The easy way to track servers! :)")
						else
							alert(evt.error);
						regbla = evt;
					});
					*/
				}
			}
		
			function handleActivationKey()
			{
				form_element("activation", "do_submit").onclick = function(){
					request = {
						name_login: form_element("activation", "name_login").value,
						activation_key: form_element("activation", "activation_key").value
					}
					json_str = $.toJSON(request);
					//alert(json_str);
					$.ajax({
						url: reg = "user_activate.php?json=" + json_str,
						dataType: "json",
						success: function(data){
							//alert(data);
							
							if (data.success)
								alert("Your account got activated! Enjoy our service! :)");
							else
								alert(data.error);
							regbla = data;
						}
					});
				}
			}
		
			// mind about xsrf:
			// its not possible, if i put the cookie-session in every _GET? thats not automatically
			function handleLogin()
			{
				form_element("login", "do_submit").onclick = function(){
					request = {
						name_login: form_element("login", "name_login").value,
						pass: form_element("login", "pass").value
					}
					json_str = $.toJSON(request);
					//alert(json_str);
					$.ajax({
						url: reg = "user_login.php?json=" + json_str,
						dataType: "json",
						success: function(data){
							//alert(data);
							//return;
							if (data.success)
							{
								//alert("Your are logged in now! :)");
								set_cookie("session", data.session);
								checkLogin(); // get all json-data of login... hmm, 2 requests for login
							}
							else
								alert(data.error);
							regbla = data;
						},
						error: function(){alert("error");}
					});
				}
			}
			
			function handleStopUpdate()
			{
				document.stop_update = false; // default = updating
				
				form_element("control", "stop_update").onclick = function(){
					if (document.stop_update) // then unstop it
					{
						//alert("start update");
						document.stop_update = false;
						form_element("control", "stop_update").value = "Stop Update!";
						updateServers();
					} else {
						//alert("stop update");
						document.stop_update = true;
						form_element("control", "stop_update").value = "##### Start Update! #####";
					}
				}
			}
			
			function handleOpener()
			{
				document.navi_visible = false; // default closed
				$("#navi").hide();
				form_element("opener", "opener").onclick = function(){
		
					if (document.navi_visible)
					{
						$("#navi").hide();
						document.navi_visible = false;
						form_element("opener", "opener").value = ">";
					} else {
						$("#navi").show();
						document.navi_visible = true;
						form_element("opener", "opener").value = "<";
					}
				}
			}
			
			function handleSpoiler(){
				$(".pre-spoiler").children("input").toggle(
					function(){
						$(this).parent().children(".spoiler").first().slideDown();
					}, function(){
						$(this).parent().children(".spoiler").first().slideUp();
					}
				);
			}
			
			function handleActivationKeyInURL()
			{
				name_login = get("name_login");
				activation_key = get("activation_key");
				
				if (name_login == "" || activation_key == "")
					return;
				
				request = {
					name_login: name_login,
					activation_key: activation_key
				}
				json_str = $.toJSON(request);
				//alert(json_str);
				$.ajax({
					url: reg = "user_activate.php?json=" + json_str,
					dataType: "json",
					success: function(data){
						//alert(data);
						
						if (data.success)
							alert("Your account got activated! Enjoy our service! :)");
						else
							alert(data.error);
						
						/*
						// even that doesnt work
						setTimeout(function(){
							url = document.URL
							document.location = url.substr(0, url.length-1); // delete auth key from URL
						}, 100);
						*/
							
						regbla = data;
					}
				});
			}
			
			/*
			var User = function(){
				this.loggedIn = false;
				this.init = function(id, name_color, name_login)
				{
					this.id = id;
					this.name_color = name_color;
					this.name_login = name_login;
					
					this.loggedIn = true;
				}
			}
			*/
			
			function checkLogin()
			{
				if (get_cookie("session") == "")
					return;
					
				request = {
					session: get_cookie("session")
				}
				json_str = $.toJSON(request);
				//alert(json_str);
				$.ajax({
					url: reg = "user_session.php?json=" + json_str,
					dataType: "json",
					success: function(data){
						//alert(data);
						//return;
						
						/*
						directives = {
							".name_color": "name_color"
						};
						*/
						
						directives = {
							".name_color": function(){ return color_name(this.name_color); }
						};
						
						if (data.success)
						{
							$("#user_greeting").render(data, directives);
							emitEvent("user.login");
						}
						
						/*
						if (data.success)
							alert("Your are now logged in! Enjoy our service! :)");
						else
							alert(data.error);
						*/
						
						/*
						// even that doesnt work
						setTimeout(function(){
							url = document.URL
							document.location = url.substr(0, url.length-1); // delete auth key from URL
						}, 100);
						*/
							
						regbla = data;
					}
				});
			}
			
			function show_only(parent, child_class)
			{
				$(parent).children().each(function(){
					if ($(this).attr("class") == child_class)
						$(this).show();
					else
						$(this).hide();
				});
			}
			
			
			function handleChat()
			{
				form_element("chat", "json_request").onclick = function(){
				
				
					show_only("#content", "chat"); // TODO: stop updating server
				
					request = {
						time: now()
					}
					json_str = $.toJSON(request);
					//alert(json_str);
					$.ajax({
						type: "POST",
						url: reg = "chat/rooms.php",
						data: json_str,
						contentType: "text/json",
						dataType: "json",
						success: function(allRoomsAsArray){
							//alert(data);
							//return;
							$(".chat .all_rooms").html("Rooms:<br><ul>");
							for (var i=0; i<allRoomsAsArray.length; i++)
							{
								name = allRoomsAsArray[i];
								$(".chat .all_rooms").append("<li>" + name);
							}
						}
					});
				}
			}
			
			function show_server(id)
			{
				show_list_id = id;
				
				if (saved_lists[id].num_servers == 0)
				{
					alert("this server list is empty");
					return;
				}
				
				$("#lists .visible_list").html(saved_lists[id].name);
				updateServers(true);
			}
			
			function user_delete_list(list_id)
			{
				//console.log("delete list " + list_id);
				
				if (!confirm("DO YOU REALLY WANT TO DELETE THE LIST?"))
					return;
				
				request = {
					session: get_cookie("session"),
					list_id: list_id
				}
				json_str = $.toJSON(request);
				$.ajax({
					url: reg = "user_list_delete.php?json=" + json_str,
					dataType: "json",
					success: function(data){
					
						if (!data.success)
							return;
					
						foo = data;
						//alert(data);
						//return;
						

						refreshLists();
						updateServers(true); // if the list was drawn, show all servers
					}
				});
				
			}
			
			var add_to_list_id = undefined;
			function add_to_list(id)
			{
				$("#lists .add_to_list").html(saved_lists[id].name);
				add_to_list_id = id;
			}
			
			var show_list_id = undefined; // if this is set, then dont show all, ips are read from database
			
			// to get the name of the id:
			var saved_lists = {}; // assoc by id
			function refreshLists()
			{
				request = {
					session: get_cookie("session")
				}
				json_str = $.toJSON(request);
				//alert(json_str);
				$.ajax({
					url: reg = "refresh_lists.php?json=" + json_str,
					dataType: "json",
					success: function(data){
					
						if (!data.success)
						{
							$("#lists .all_lists").html("No Lists");
							return;
						}
					
						foo = data;
						//alert(data);
						//return;
						var e = $("#lists .all_lists");
						
						
						html = "";
						for (var i=0; i<data.lists.length; i++)
						{
							list = data.lists[i];
							saved_lists[list.id] = list;
							
									
							html += "<tr>";
							html += "<td><input type=\"radio\" name=\"list_id\" value=\""+list.id+"\" onclick=\"add_to_list("+list.id+")\">";
							html += "<td>" + list.name;
							html += "<td>" + list.num_servers;
							html += "<td><input type=\"button\" value=\"Show\" onclick=\"show_server("+list.id+")\">";
							html += "<td><input type=\"button\" value=\"Delete\" onclick=\"user_delete_list("+list.id+")\">";
							//console.log(list.id);
						}
						//console.log(html);
						e.html(html);
					}
				});
			}

			function createList(name_of_list)
			{
				request = {
					session: get_cookie("session"),
					name_of_list: name_of_list
				}
				json_str = $.toJSON(request);
				//alert(json_str);
				$.ajax({
					url: reg = "create_list.php?json=" + json_str,
					dataType: "json",
					success: function(data){
					
						if (!data.success)
						{
							alert(data.error);
							return;
						}
					
						//alert(data.message);
						refreshLists();
					}
				});
			}
			
			function handleLists()
			{
			
				addEvent("user.login", function(){
					refreshLists();
				});
				
				form_element("lists", "all").onclick = function(){
				
					show_list_id = undefined;
					updateServers(true);
				};
				form_element("lists", "new").onclick = function(){
				
					name_of_list = prompt("Please enter the name of the new list:");
					
					createList(name_of_list);
				};
				form_element("lists", "refresh").onclick = function(){
					refreshLists();
				};
			}
			
			function checkFakeDomains()
			{
				// whatever you tried lol
				if (document.location.host == "awipi.com")
					document.location = "http://killtube.com";
			}
			
			function handleUser()
			{
				form_element("user", "logout").onclick = function()
				{
					request = {
						session: get_cookie("session")
					}
					json_str = $.toJSON(request);
					//alert(json_str);
					$.ajax({
						url: reg = "user_logout.php?json=" + json_str,
						dataType: "json",
						success: function(data){
						
							if (!data.success)
							{
								alert("Error while logging out");
								return;
							}
							emitEvent("user.logout");
						}
					});
				}
			}
			
			$(window).load(function(){
			
				checkFakeDomains();
			
				/*
				$("#servers").tablesorter({sortList:[[1,0]]});
				$("#servers").on("sortEnd", function(e){
					lastSort = e.target.config.sortList;
				});
				*/
				prepareForm();
				updateServers();
				handleRegister();
				handleActivationKey();
				handleLogin();
				handleStopUpdate();
				handleOpener();
				handleSpoiler();
				handleActivationKeyInURL();
				checkLogin();
				
				show_only("#content", "servers");
				
				show_only("#account_tabs", "is_guest");
				show_only("#lists", "is_guest");
				
				addEvent("user.login", function(){ // every "modul" shall do this alone
					console.log("user logged in!");
					show_only("#account_tabs", "is_user");
					show_only("#lists", "is_user");
				});
				addEvent("user.logout", function(){
					console.log("user logged out!");
					show_only("#account_tabs", "is_guest");
					show_only("#lists", "is_guest");
					$("#user_greeting .name_color").html("Guest");
					updateServers(true); // if a list was shown, with logout=not available
				});
				
				// handleChat(); // doesnt work as long the element is commented out
				handleLists();
				handleUser();
			})
			
			function viewport()
			{
				var e = window, a = 'inner';
				if ( !( 'innerWidth' in window ) )
				{
				a = 'client';
				e = document.documentElement || document.body;
				}
				return { width : e[ a+'Width' ] , height : e[ a+'Height' ] }
			}
			function viewport_height()
			{
				return viewport()["height"];
			}

			// highly complex event system xD KISS
			var events = new Object();
			function emitEvent(name)
			{
				if (events[name] == null)
				{
					console.log("no event: " + name);
					return;
				}
				callbacks = events[name];
				for (i=0; i<callbacks.length; i++)
					callbacks[i]();
			}
			function addEvent(name, callback)
			{
				if (events[name] == null)
					events[name] = new Array();
				events[name].push(callback);
			}