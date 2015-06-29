<?php
	require_once("config.php");
	
	// not used in /index.php anymore, its directly done in db
	// but good for others things
	function escapeJavaScriptText($str) 
	{		
		$new = "";
		for ($i=0; $i<strlen($str); $i++)
		{
			$char = $str[$i];
			$ord = ord($char);
			
			if (
				($ord >= 0 && $ord <= 31) ||
				($ord >= 127 && $ord <= 255)
			)
			{
				$new .= "\\x" . str_pad(dechex($ord), 2, "0", STR_PAD_LEFT);
				continue;
			}
			if ($ord == 34) // the char: "
			{
				$new .= '\"';
				continue;
			}
			if ($ord == 92) // the char: \
			{
				$new .= '\\\\';
				continue;
			}
			
			$new .= $char;
		}
		return $new;
	}
	
	function get($name)
	{
		if (isset($_GET[$name]))
			return $_GET[$name];
		return "";
	}
	
	function get_userid_by_session($session)
	{
		$session = mysql_real_escape_string($session);
		$sql = "
			SELECT users.id
			FROM users
			LEFT JOIN user_sessions ON users.id = user_sessions.user_id
			WHERE `key` = '$session'
		";
		$query = mysql_query($sql);
		if (mysql_num_rows($query) == 0)
			return false;
		$row = mysql_fetch_assoc($query);
		return $row["id"];
	}
	
	function header_for_json()
	{
		header("Cache-Control: no-cache, must-revalidate");
		header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");
		header("Content-type: application/json");
	}
?>