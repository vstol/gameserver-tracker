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
	
	function getIP()
	{
		if (isset($_SERVER["HTTP_X_FORWARDED_FOR"]))
			return $_SERVER["HTTP_X_FORWARDED_FOR"];
		return $_SERVER["REMOTE_ADDR"];
	}
	
	$result = array();
	
	switch (gimme("action"))
	{
		// MAYBE INVENT SOME CAPTCHA WITH RSA
		case "register":
			$name_color = mysql_real_escape_string(gimme("name_color"));
			$name_login = mysql_real_escape_string(gimme("name_login"));
			if ($name_login == "")
			{
				$result["error"] = "No Name";
				break;
			}
			$mail = mysql_real_escape_string(gimme("mail"));
			if ($mail == "")
			{
				$result["error"] = "No Mail";
				break;
			}
			$pass = md5(gimme("pass"));
			if (gimme("pass") == "")
			{
				$result["error"] = "No Pass";
				break;
			}
			$time = time();
			$ip = getIP();
			
			$query_ip = mysql_query("SELECT count(*) AS tries FROM users WHERE ip = '$ip'");
			$row = mysql_fetch_assoc($query_ip);
			if ($row["tries"] > 5)
			{
				$result["success"] = false;
				$result["error"] = "Dont Spam, Mate!";
				break;
			}
			
			$activation_code = md5($time . "secret salt lulz" . mt_rand());
			$activation_code = substr($activation_code, 0, 4); // haha, we arent paranoid
			mysql_query("
				INSERT INTO users (name_color, name_login, mail, pass, time_of_register, activation_code, ip, is_activated)
				VALUES ('$name_color', '$name_login', '$mail', '$pass', $time, '$activation_code', '$ip', 0)");
			if (mysql_error())
			{
				$result["success"] = false;
				$result["error"] = "Name already exists";
				break;
			}
			
			$header = "";
			$header .= 'MIME-Version: 1.0' . "\r\n";
			$header .= 'Content-type: text/html; charset=iso-8859-1' . "\r\n";
			
			$mailFrom = "lama12345@googlemail.com";
			$mailTo = gimme("mail");
			$header .= "From: killtube.org <$mailFrom>" . "\r\n";
			$link = "http://killtube.org/?name_login=".rawurlencode($name_login)."&activation_key=$activation_code";
			mail($mailTo, "Welcome To killtube.org! Activation Key Here!", "<html><body>Hello $name_login, <p>welcome to killtube.org! <p>This is your Activation Key: $activation_code <p>Either you Copy/Paste this Key into the Activation-Form, or just visit this link: $link <p>Have fun with our Call of Duty 2 Game Server Tracker! <p>Regards, <p>your killtube.org-Team</body></html>", $header);
			
			$result["success"] = true;
			break;
		case "activation":
		
			/*
			$name_login = mysql_real_escape_string(gimme("name_login"));
			$activation_key = mysql_real_escape_string(gimme("activation_key"));
			
			$query = mysql_query("SELECT ");
			if ()
			
			$result["action"] = "activation";
			$result["success"] = false;
			$result["error"] = "Wrong Key";
			*/
			break;
			
		case "login":
			$name_login = mysql_real_escape_string(gimme("name_login"));
			$pass = md5(gimme("pass"));
			
			$query = mysql_query("SELECT id FROM users WHERE name_login='$name_login' AND pass='$pass' AND is_activated=1");
			if (mysql_num_rows($query) > 0)
			{
				$result["success"] = true;
				$result["session"] = "blablubb";
			} else {
				$result["success"] = false;
				$result["error"] = "Wrong User/Pass Combination or Account not activated!";
			}
			
			break;
			
		case "init":
			$result["action"] = "init";
			
			$form = array();
			$time = time();
			$form["time"] = $time;
			$form["secret"] = md5("ip= " . $_SERVER["REMOTE_ADDR"] . " time=" . $time);
			
			$result["form"] = $form;
			break;
			
		case "addlist":
			$result["action"] = "addlist";
			
			$result["success"] = true;
			$result["success"] = false;
			$result["reason"] = true;
			
		default:
			$result["action"] = "unknown";
	}
	// StaticJSONP.notify("lists", <=json_encode($result)>);
?>
<?=json_encode($result)?>