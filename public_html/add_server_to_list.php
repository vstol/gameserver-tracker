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
	
	$server_id = (int)gimme("server_id");
	$list_id = (int)gimme("list_id");
	
	$userid = get_userid_by_session(gimme("session"));
	//echo $userid;
	if ($server_id == "" || $list_id == "")
	{
		$result["success"] = false;
		$result["error"] = "Please Enter A Name For A List";
	} else if ($userid === false) {
		$result["success"] = false;
		$result["error"] = "please login for adding a server to a list!";
	} else {
		$result["success"] = true;
		
		$time = time();
		$sql = "
			UPDATE player_lists SET server_ids = CONCAT(server_ids, ',$server_id,') WHERE user_id = $userid AND id = $list_id AND POSITION(',$server_id,' IN server_ids)=0
		";
		$query = mysql_query($sql);
		
		
		if (mysql_affected_rows() == 0)
		{
			$result["success"] = false;
			$result["error"] = "server is already in the list";
		} else {
		
		
			$result["success"] = true;
		}
	}
	
	echo json_encode($result);
?>