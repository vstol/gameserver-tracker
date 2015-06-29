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
		$result["error"] = "please login for deleting a list";
	} else {
		$result["success"] = true;
		
		$sql = "
			DELETE
			FROM player_lists
			WHERE id = $list_id
		";
		$query = mysql_query($sql);
		
			
		if (mysql_affected_rows() == 0)
		{
			$result["success"] = false;
			$result["error"] = "no list got deleted";
		} else {
		
			$result["success"] = true;
		}
	}
	
	echo json_encode($result);
?>