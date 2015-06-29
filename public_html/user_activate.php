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
	
	$name_login = mysql_real_escape_string(gimme("name_login"));
	$activation_key = mysql_real_escape_string(gimme("activation_key"));
	
	if ($name_login == "" || $activation_key == "")
	{
		$result["success"] = false;
		$result["error"] = "Parameters missing.";
	} else {
		$result["success"] = true;
		
		$time = time();
		$sql = "
			UPDATE users
			SET is_activated = 1, time_of_activation = $time
			WHERE
				name_login = '$name_login' AND
				activation_code = '$activation_key' AND
				is_activated = 0
		";
		$query = mysql_query($sql);
		
		
		if (mysql_affected_rows() == 0)
		{
			$result["success"] = false;
			$result["error"] = "The sent activation key is invalid or already used!";
		} else {
			$result["success"] = true;
		}
	}
	
	echo json_encode($result);
?>