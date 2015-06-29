<?php
	require_once("common.php");
	
	function fail()
	{
		die("fail");
	}
	
	// for json
	$result = array();
	
	$page = 0;
	if (isset($_GET["page"]) /*&& $_GET["page"] >= 0*/)
		$page = (int)$_GET["page"];
	
	
	
	
	$perSite = 20;
	if (isset($_GET["numberOfServers"]))
		$perSite = (int) $_GET["numberOfServers"];
	if ($perSite > 40)
		$perSite = 40;
	$limit_start = $page * $perSite;
	$limit_end = $perSite;
	
	
	$max_average_ping = 999;
	if (isset($_GET["max_average_ping"]))
		$max_average_ping = (int)$_GET["max_average_ping"];
	
	$password = 0;
	if (isset($_GET["password"]))
		$password = (int)$_GET["password"];
	
	$sqlFullsearch = "";
	if (isset($_GET["fullsearch"]) && trim($_GET["fullsearch"]) != "")
	{
		$fullsearch = $_GET["fullsearch"];
		$searchs = explode(" ", $fullsearch);
		
		for ($i=0; $i<count($searchs) && $i<10; $i++)
		{
			$tmp = $searchs[$i];
			//echo $tmp;
			if (strlen($tmp) >= 2)
			{
				//$sqlFullsearch .= " AND (status LIKE '%$tmp%' OR hostname_nocolor LIKE '%$tmp%') ";
				$sqlFullsearch .= " AND (status LIKE '%$tmp%' OR hostname_nocolor LIKE '%$tmp%') ";
			}
		}
	}
	//echo "#####" . $sqlFullsearch . "#####";
	
	$sql = "
		SELECT SQL_CALC_FOUND_ROWS id, ip, port, game, map, hostname, gametype, fs_game, players, max_players, average_ping, version, password
		FROM servers
		WHERE
			average_ping <= $max_average_ping AND
			password!=$password AND
			last_actualize > UNIX_TIMESTAMP()-60*5 AND
			(
				protocol = 115 OR
				protocol = 117 OR
				protocol = 118
			)
		$sqlFullsearch
		ORDER BY players DESC, ip 
		LIMIT $limit_start, $limit_end
	";
	$query = mysql_query($sql);
	//$result["sql"] = $sql;
	$query2 = mysql_query("SELECT FOUND_ROWS()");
	
	//echo mysql_error();
	//echo mysql_affected_rows();
	
	$tmp = mysql_fetch_row($query2);
	$result["foundRows"] = $tmp[0];
	$result["bla"] = 2;
	
	if ($query)
	{
		while ($row = mysql_fetch_assoc($query))
			$result["result"][] = $row;
	}
	
	// shorter and faster, and even chrome/opera keeps the order with assoc-arrays!
	// dunno if this would work crossbrowser, i dont want to try yet
	// basic idea is: first all keys, then just the value.... to reduce the double key-metadata
	/*
	$onlyMetaData = array();

	$onlyMetaData["k"] = array();
	foreach ($result[0] as $key=>$value)
		$onlyMetaData[] = $key;
	
	foreach ($result as $row)
	{
		//foreach ($row as $value)
			$onlyMetaData["v"][] = $row;
	}
	*/
	
	
	/*while ($row = mysql_fetch_assoc($query))
	{
		$id = $row["id"];
		$ip = $row["ip"];
		$port = $row["port"];
		
		$game = $row["game"];
		$map = $row["map"];
		$hostname = $row["hostname"];
		$gametype = $row["gametype"];
		$fs_game = $row["fs_game"];
		$players = $row["players"];
		$max_players = $row["max_players"];
		$average_ping = $row["average_ping"];
		$version = $row["version"];
		
		echo "<tr> <td class=\"id\">$id <td class=\"ip\">$ip <td class=\"port\">$port <td class=\"game\">$game <td class=\"map\">$map <td class=\"hostname\">$hostname <td class=\"gametype\">$gametype <td class=\"fs_game\">$fs_game <td class=\"players\">$players <td class=\"slash\">/ <td class=\"max_players\">$max_players <td class=\"average_ping\">$average_ping <td class=\"version\">$version";
	}
	*/
	header_for_json();
?>
StaticJSONP.notify("test", <?=json_encode($result)?>);