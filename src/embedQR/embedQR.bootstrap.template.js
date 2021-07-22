
// Insert this into your top level module or use it as the top level module
document.addEventListener('DOMContentLoaded', function(e) {
	// Add element getter
	function _el(id) { return document.getElementById(id); }
	// Import embedQR main module
	import('./embedQR.js').then((_eQR) => {
		window.eQR = _eQR.default;	// Integrate into window
		eQR.engine = './embedQR.engine.js'; // Configure engine path
		// eQR.lang = [ '%s', '%s', '%s', '%s', '%s', '%s', '%s' ];	// Configure status message array
		eQR.status = (s) => { // Add status handler
			const el = _el('qrl'); // Get status element (like the label of file input) from DOM
			el.innerText = eQR.lang[s]; // Respond with message from array
			if (s < 3) { el.style.color='#d43535' } else if (s == 6) {  el.style.color='#47c266' } // Respond with colours
		};
		eQR.readwifi = function (valid, ssid, password) => { // Add WiFi-URI parser handler (access to eQR prohibits arrow shorthand)
			if (!valid) { eQR.status(0); return; } // Fail whole scan if WiFi-URI failed to parse
			_el('ssid').value = ssid;
			_el('pass').value = password;
		};	
		eQR.readraw = (u) => { // Add raw output handler for debugging purposes
			console.log('readraw: ' + u);
		};
		eQR.read = (u) => { // Add handler for all remaining URIs after WiFi-URI parsing (do not attach handler to keep)
			console.log('readlen: ' + u.length + ' - ' + u.join('-'));
		};
		const _cmd = _el('qri'); // Retrieve file input element from DOM
		_cmd.addEventListener('click', event => { eQR.exec(); }); // Attach click handler to trigger dynamic loading
		_cmd.addEventListener('change', event => { eQR.exec(_cmd.files[0]); }); // Attach file handler to trigger scan
		_el('qrl').innerText = eQR.lang[3]; // Signalise readiness (required if label starts blank)
	})
});
