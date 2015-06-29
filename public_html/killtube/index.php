<?php
	require_once("../common.php");
	
	function handle_call_error()
	{
		die("Please Add ip:port Like ?ip=1.2.3.4&port=1234");
	}

	if (!isset($_GET["ip"]) || !isset($_GET["port"]))
		handle_call_error();

	function is_ip($str)
	{
		return true;
		
		$parts = explode(".", $str);
		
		//for ($i=0; $i<4; $i++)
		//	if (!is_numeric($parts[0]) || int($parts[0]))
		
		echo var_dump($parts);
		return true;
	}
	function is_port($port)
	{
		if (is_numeric($port) == false)
			return false;
		$port = (int) $port;
		if ($port <= 0 || $port > 65535) // 0 is reserved
			return false;
		return true;
	}
	
	$ip = mysql_real_escape_string($_GET["ip"]);
	$port = (int)$_GET["port"];
	
	if (!is_ip($ip) || !is_port($port))
		handle_call_error();
	
	$sql = "SELECT last_actualize, status FROM servers WHERE ip='$ip' and port=$port";
	//echo "<pre>$sql</pre>";
	$query = mysql_query($sql) OR handle_mysql_error();
	
	$row = mysql_fetch_assoc($query);
	
	$output = "";
	
	//$age = time() - $row["last_actualize"];
	$time = $row["last_actualize"];
	$status = escapeJavaScriptText($row["status"]);
	//$time = time();
	
	if (isset($_GET["debug"]))
		$outputStatus = $row["status"];
	else
		$outputStatus = escapeJavaScriptText($row["status"]);
	
	if (!$row)
	{
		$sql = "
			INSERT INTO
				servers (ip, port)
			VALUES ('$ip', $port)
		";
		mysql_query($sql) OR handle_mysql_error();
		$output .= "StaticJSONP.notify(\n";
		$output .= "\t\"$ip:$port\",\n";
		$output .= "\t{\n";
		$output .= "\t\tstatus: \"NO RESULT\"\n";
		$output .= "\t}\n";
		$output .= ");";
	} elseif (is_null($time) || is_null($status)) {
		$output .= "StaticJSONP.notify(\n";
		$output .= "\t\"$ip:$port\",\n";
		$output .= "\t{\n";
		$output .= "\t\tstatus: \"WAIT FOR INIT\"\n";
		$output .= "\t}\n";
		$output .= ");";
	} else {
	
		/*
		if (!isset($_GET["debug"]))
			$status = escapeJavaScriptText($row["status"]);
		else
		*/
			$status = $row["status"];
		$output .= "StaticJSONP.notify(\n";
		$output .= "\t\"$ip:$port\",\n";
		$output .= "\t{\n";
		$output .= "\t\ttime: $time,\n";
		$output .= "\t\tstatus: \"$status\"\n";
		$output .= "\t}\n";
		$output .= ");";
	}
	
	//$output .= strlen($output);
	$len = strlen($output);
	
	if (strstr($_SERVER["HTTP_USER_AGENT"], "MSIE"))
	{
		header("Content-type: application/force-download");
		header("Content-Disposition: attachment; filename=\"test.js\"");
		header("Content-Length: $len");
	} else {
		header("Content-type: text/javascript");
		header("Content-Length: $len");
	}
	
	echo $output;

?>