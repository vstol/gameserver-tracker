function color_name($name) {
	// double color codes are just usefull ingame, so replace them with normal
	$name = str_replace("^^00", "^0", $name);
	$name = str_replace("^^11", "^1", $name);
	$name = str_replace("^^22", "^2", $name);
	$name = str_replace("^^33", "^3", $name);
	$name = str_replace("^^44", "^4", $name);
	$name = str_replace("^^55", "^5", $name);
	$name = str_replace("^^66", "^6", $name);
	$name = str_replace("^^77", "^7", $name);
	$name = str_replace("^^88", "^8", $name);
	$name = str_replace("^^99", "^9", $name);
	
	$name = '<font class="colorcode_7">' + $name; // white by default
	
	$name = str_replace('^0', '<\/font><font class="colorcode_0">', $name);
	$name = str_replace('^1', '<\/font><font class="colorcode_1">', $name);
	$name = str_replace('^2', '<\/font><font class="colorcode_2">', $name);
	$name = str_replace('^3', '<\/font><font class="colorcode_3">', $name);
	$name = str_replace('^4', '<\/font><font class="colorcode_4">', $name);
	$name = str_replace('^5', '<\/font><font class="colorcode_5">', $name);
	$name = str_replace('^6', '<\/font><font class="colorcode_6">', $name);
	$name = str_replace('^7', '<\/font><font class="colorcode_7">', $name);
	$name = str_replace('^8', '<\/font><font class="colorcode_8">', $name);
	$name = str_replace('^9', '<\/font><font class="colorcode_9">', $name);

	return $name;
}
		
function str_replace(search, replace, subject, count) {
var i = 0,
j = 0,
temp = '',
repl = '',
sl = 0,        fl = 0,
f = [].concat(search),
r = [].concat(replace),
s = subject,
ra = Object.prototype.toString.call(r) === '[object Array]',        sa = Object.prototype.toString.call(s) === '[object Array]';
s = [].concat(s);
if (count) {
this.window[count] = 0;
} 
for (i = 0, sl = s.length; i < sl; i++) {
if (s[i] === '') {
continue;
}        for (j = 0, fl = f.length; j < fl; j++) {
temp = s[i] + '';
repl = ra ? (r[j] !== undefined ? r[j] : '') : r[0];
s[i] = (temp).split(f[j]).join(repl);
if (count && s[i] !== temp) {                this.window[count] += (temp.length - s[i].length) / f[j].length;
}
}
}
return sa ? s : s[0];
}


function parse_query_variables() {
	var query = window.location.search.substring(1); // remove "?"
	var vars = query.split("&");
	var ret = {};
	for (var i=0; i<vars.length; i++) {
		if (vars[i].length == 0) // prevent ?&var=bla
			continue;
		var pair = vars[i].split("=");
		key = unescape(pair[0]);
		value = unescape(pair[1]);
		ret[key] = value;
	}
	return ret;
}
var $_GET = parse_query_variables();
function get(name) {
	if (typeof $_GET[name] == "undefined")
		return "";
	return $_GET[name];
}

function snapInteger(toRound, roundTo) {
	ret = toRound;
	mod = toRound % roundTo;
	if (mod == 0)
		return toRound; // already rounded
	if (mod < toRound/2)
		ret = toRound - mod; // round down
	else
		ret = (toRound - mod) + roundTo; // round up
	return ret;
}
