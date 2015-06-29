<?php
	require_once("common.php");
	
	$json = json_decode(get("json"), true);
	//var_dump($json);
	function gimme($name)
	{
		global $json;
		if (!isset($json[$name]))
			return "";
		return trim($json[$name]);
	}
	

	
	
	$result = array();
	
	$list_id = (int)gimme("list_id");
	
	$userid = get_userid_by_session(gimme("session"));
	//echo $userid;
	if ($list_id == "")
	{
		$result["success"] = false;
		$result["error"] = "no list id";
	} else if ($userid === false) {
		$result["success"] = false;
		$result["error"] = "please login for getting the servers of a list";
	} else {
		$result["success"] = true;
		
		$sqlList = "
			SELECT server_ids
			FROM player_lists
			WHERE user_id = $userid AND id = $list_id
		";
		$queryList = mysql_query($sqlList);
		$rowList = mysql_fetch_assoc($queryList);
		$server_ids = $rowList["server_ids"];
		
		$parts = explode(",", $server_ids);
		$ids = array();
		for ($i=0; $i<count($parts); $i++)
			if (strlen($parts[$i]) && is_numeric($parts[$i]))
				$ids[] = $parts[$i];
		$sql_ids = implode(",", $ids);
		//var_dump($sql_ids);
		
		//echo $sql_ids;
		if ($sql_ids == "")
		{
			$result["success"] = false;
			$result["error"] = "no servers in this list";
		} else {
			$sql = "

				SELECT id, ip, port, game, map, hostname, gametype, fs_game, players, max_players, average_ping, version, password
				FROM servers
				WHERE
					last_actualize > UNIX_TIMESTAMP()-60*5 AND
					(
						protocol = 115 OR
						protocol = 117 OR
						protocol = 118
					)
					AND id IN ($sql_ids)
				ORDER BY players DESC, ip 
			";
			$query = mysql_query($sql);
			
			//echo $sql;
			if (mysql_num_rows($query) == 0)
			{
				$result["success"] = false;
				$result["error"] = "no servers in this list";
			} else {
			
				while ($row = mysql_fetch_assoc($query))
					$result["result"][] = $row;
			
				$result["success"] = true;
			}
		}
	}
	
	echo json_encode($result);
?>