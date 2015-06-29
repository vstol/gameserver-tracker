<?php

			$timeStart = microtime(true);

	function connect_redis(&$error)
	{
		require 'Predis/autoload.php';
		//Predis\Autoloader::register();
		$single_server = array(
			'host'     => '127.0.0.1'
			,'port'     => 6379
			,'database' => 15
		);
		
		try {
			$redis = new Predis\Client($single_server);
			$redis->get("foo"); // FUCK THATT! if i say connect, CONNECT! BUT NO, YOU NEED FIRST TO CONNECT WHEN I FORCE A COMMAND! -.-
		} catch (Exception $e) { // looooool, that fucking fuck does never fail! i hate classes+exceptions... now i know why.. look above
			$error = $e->getMessage();
		}
		
		return $redis;
	}

	$redis = connect_redis($error);
	if ($error != "")
		die($error);
	
	header("Cache-Control: no-cache, must-revalidate");
	header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");
	header("Content-type: application/json");
	header("Access-Control-Allow-Origin: *");
	
	
	function get($name)
	{
		if (isset($_GET[$name]))
			return $_GET[$name];
		return "";
	}
	$json = json_decode(get("json"), true);
	//var_dump($json);
	function gimme($name)
	{
		global $json;
		if (!isset($json[$name]))
			return "";
		return trim($json[$name]);
	}
	
	$ip = gimme("ip");
	$port = gimme("port");
	
	$ret = $redis->get("{$ip}_{$port}_players_cache");
	
	$result = array();
	if (!$ret)
	{
		$result["success"] = false;
		$result["error"] = "no graph available";
		//var_dump($ret);
	} else {
		$result["success"] = true;
		$result["result"] = $ret;
	}
	
	$timeEnd = microtime(true);
	$timeUsed = (int)(($timeEnd - $timeStart) * 1000);
	//echo "ms used: $timeUsed\n";
		
	
	echo json_encode($result);
?>