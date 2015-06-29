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
	
	$session = mysql_real_escape_string(gimme("session"));
	
	if ($session == "")
	{
		$result["success"] = false;
		$result["error"] = "Parameters missing.";
	} else {
		$result["success"] = true;
		
		$time = time();
		$sql = "
			SELECT users.id, users.name_color, users.name_login
			FROM users
			LEFT JOIN user_sessions ON users.id = user_sessions.user_id
			WHERE `key` = '$session'
		";
		$query = mysql_query($sql);
		
		
		if (mysql_num_rows($query) == 0)
		{
			$result["success"] = false;
			$result["error"] = "The session is expired, please login again! :)";
		} else {
			$row = mysql_fetch_assoc($query);
			$result["id"] = $row["id"];
			$result["name_color"] = $row["name_color"];
			$result["name_login"] = $row["name_login"];
			$result["success"] = true;
		}
	}
	
	echo json_encode($result);
?>