
// Insert this into your top level module or use it as the top level module
document.addEventListener('DOMContentLoaded', function(e) {
	// Add element getter
	function _el(id) { return document.getElementById(id); }
	// Import embedQR main module
	import('./embedQR.js').then((_eQR) => {
		window.eQR = _eQR.default;	// Integrate into window
		eQR.engine = './embedQR.engine.js'; // Configure engine path
		// eQR.lang = [ '%s', '%s', '%s', '%s', '%s', '%s', '%s' ];	// Configure status message array
		eQR.lang = [ 'Invalid contents.', 'Failed to parse.', 'Failed to load Reader.', 'Scan Code', 'Loading Reader...', 'Parsing...', 'Success!' ];
		eQR.status = (s) => { // Add status handler
			const el = _el('qrl'); // Get status element (like the label of file input) from DOM
			el.innerText = eQR.lang[s]; // Respond with message from array
			if (s < 3) { el.style.color='#d43535' } else if (s == 6) {  el.style.color='#47c266' } // Respond with colours
		};
		eQR.readwifi = function (wi) { // Enable WiFi-URI parser through adding result handler
			if (!wi) { eQR.status(0); return; } // Signalise error
			_el('ssid').value = wi.S; // Set ssid input element
			_el('pass').value = (wi.P) : wi.P ? ''; // Set password input element
			_el('wifisave').click(); // Simulate click on save
		};	
		eQR.read = (u) => { // Add handler for all further URIs
			console.log('readlen: ' + u.length + ' - readcontent: ' + u.join(' - '));
		};
		eQR.readraw = (u) => { // Add raw output handler for debugging purposes
			console.log('readraw: ' + u);
		};
		const _cmd = _el('qri'); // Retrieve file input element from DOM
		_cmd.addEventListener('click', event => { eQR.exec(); }); // Attach click handler to trigger dynamic loading
		_cmd.addEventListener('change', event => { eQR.exec(_cmd.files[0]); }); // Attach file handler to trigger scan
		_el('qrl').innerText = eQR.lang[3]; // Signalise readiness (required if label starts blank)
	})
});
