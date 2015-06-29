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
	$userid = get_userid_by_session(gimme("session"));
	do {
	if ($session == "")
	{
		$result["success"] = false;
		$result["error"] = "no session got submitted";
	} else if ($userid == "") {
		
		$result["success"] = false;
		$result["error"] = "session doesnt belongs to a user";
	} else {
		$result["success"] = true;
		//break;
		
		/*
		$sql = "
			DELETE FROM user_sessions WHERE `key` = '$session'
		";
		*/
		$sql = "
			DELETE FROM user_sessions WHERE user_id = '$userid'
		";
		$query = mysql_query($sql);
		

		if (mysql_affected_rows() == 0)
		{
			$result["success"] = false;
			$result["error"] = "the session wasnt found";
		} else {
		
		
			$result["success"] = true;
		}
	}
	} while (0);
	
	echo json_encode($result);
?>