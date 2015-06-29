<?php
	function handle_mysql_error()
	{
		die(mysql_error());
	}
	mysql_connect("127.0.0.1:3306", "some username", "some password") OR handle_mysql_error();
	mysql_select_db("tracker") OR handle_mysql_error();
?>