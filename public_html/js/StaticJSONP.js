// on the server: StaticJSONP.notify("unique_request_id", {the:response_data});

var StaticJSONP = ( // (C) WebReflection - Mit Style License
	function (window)
	{
		var document = window.document;
		var documentElement = document.documentElement;
		var results = {}; // notifications container
		var i;
		var script;

		// whenever the server replies or not: try to keep the DOM as clear as possible
		function removeScript()
		{
			script = this;
			script.parentNode === documentElement && documentElement.removeChild(script);
		}

		return {
			// when StaticJSONP.notify(uid, data) is invoked
			notify: function notify(uid, data)
			{
				script = results[uid];
				
				// undefined-error if uid is not requested
				//if (typeof script == "undefined")
				//	alert("undefined!");
				for (i=0; i<script.length; i++) // loop over all registered callbacks
				{
					// be sure other listeners are not
					// affected by a single listener failure
					// (for whatever external reason)
					try {
						script[i](uid, data);
					} catch(_) {
						// none of this script business
						// just keep notifying
					}
				}
				// delete this uid so that next call
				// will be performed in any case
				delete results[uid];
			},

			// a request may take time
			// this method prevent multiple requestes for same uid
			// until the request has not been evaluated
			request: function request(uri, uid, callback)
			{
				// if nobody asked for this uid
				if (!(uid in results))
				{
					// create the notification stack
					results[uid] = [];
					// append and load the script
					script = documentElement.insertBefore(
						document.createElement("script"),
						documentElement.lastChild
					);
					script.onload = script.onerror = removeScript;
					script.src = uri;
				}
				// add notification callback
				results[uid].push(callback);
			}
		};

	}(this) // call this anonym function with "this" as "window"
);