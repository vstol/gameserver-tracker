<?php

	$data = "\xFF\xFF\xFF\xFFgetinfo xxx";
	$fp = stream_socket_client("udp://cod2master.activision.com:20710");
	stream_set_timeout($fp, 1);
	fwrite($fp, $data);
	echo fread($fp, 1500);
	
?>

<h1>update info</h1>
<?php
	$data = "\xFF\xFF\xFF\xFFgetUpdateInfo2 \"CoD2 MP\" \"1.2\" \"win-x86\"";
	$data = "\xFF\xFF\xFF\xFFgetservers 117 full empty";
	
	// old ip was: 63.146.124.11
	//     new is: 63.146.124.40
	$fp = stream_socket_client("udp://cod2master.activision.com:20710", $errno, $errstr, 30);
	echo "fp $fp errno=$errno errstr=$errstr<br>";
	
	$ret = fwrite($fp, $data);
	echo "write $ret<br>";

	//stream_set_timeout($fp, 4);
	$ret = fread($fp, 100);
	echo "read $ret<br>";
	$ret = fread($fp, 100);
	echo "read $ret<br>";
?>
asd