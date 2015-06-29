<?php
define("ACC_NAME", "piggedy123");
define("ACC_PASS", "6ha979byc95");
define("GROUP_ID", "103582791432190799"); // open steam group page and see "Enter chat room" link, which contains ID
define("MY_STEAM_ID", "STEAM_0:0:47403150"); // steam ID which can invite to join group
$invite_steam_id = $_GET['i'];

$ids = file('invited_ids.txt');
foreach($ids as $id) {
	$id = trim($id);
	if ( $id == $invite_steam_id )
		die($id .": Already invited!\n");
}

function GetFriendID( $steam_id ) {
	if ( !$steam_id )
		return 0;
	$auth = explode(':', $steam_id);
	if ( !$auth[2] )
		return 0;
	$fid = gmp_init($auth[2]);
	$fid = gmp_mul($fid, "2");
	$fid = gmp_add($fid, "76561197960265728");
	$fid = gmp_add($fid, $auth[1]);
	return gmp_strval($fid);
}


require_once "HTTP/Request.php";

$req = &new HTTP_Request('https://steamcommunity.com');
$req->setMethod(HTTP_REQUEST_METHOD_POST);

$req->addPostData("action", "doLogin");
$req->addPostData("goto", "");

$req->addPostData("steamAccountName", ACC_NAME);
$req->addPostData("steamPassword", ACC_PASS);

echo "Login: ";

$res = $req->sendRequest();
if (PEAR::isError($res))
	die($res->getMessage());

$cookies = $req->getResponseCookies();
if ( !$cookies )
	die("fail!\n");

echo "ok\n";

foreach($cookies as $cookie)
$req->addCookie($cookie['name'],$cookie['value']);

$mid = GetFriendID(MY_STEAM_ID);
$fid = GetFriendID($invite_steam_id);
$url = "http://steamcommunity.com/actions/GroupInvite?type=groupInvite&inviter=$mid&invitee=$fid&group=". GROUP_ID;

echo "Inviting $invite_steam_id ($fid): ";
$req->setMethod(HTTP_REQUEST_METHOD_GET);
$req->setUrl($url);

$res = $req->sendRequest();
if (PEAR::isError($res))
	die($res->getMessage());

$data = $req->getResponseBody();
preg_match("/CDATA\[([^\]]+)\]/", $data, $matches);
echo $matches[1] . "\n";
if ( $matches[1] == "OK" )
	file_put_contents('invited_ids.txt', $invite_steam_id . "\n", FILE_APPEND);
?>