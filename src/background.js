// Get platform specific interface object.
let platform = chrome ? chrome : browser;

// Per tab data.
const tabs = [];

// On runtime message received.
platform.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	// Setup empty object if not called previously.
	if (tabs[request.id] === undefined) {
		tabs[request.id] = {};
	}
	
	// If volume is default disable everything.
	if (request.volume == 100) {
		if (tabs[request.id].audioContext !== undefined) {
			tabs[request.id].audioContext.close();
		}
		if (tabs[request.id].mediaStream !== undefined) {
			tabs[request.id].mediaStream.getAudioTracks()[0].stop();
		}
		tabs[request.id] = {};
		
		return true;
	}
	
	// If volume given map it from 0-100 to 0-1 and scale it exponentially.
	if (request.volume) {
		request.volume = Math.pow((request.volume / 100), 2);
	}
	
	// Initialize API.
	if (tabs[request.id].audioContext === undefined) {
		// Get audio context.
		tabs[request.id].audioContext = new (window.AudioContext || window.webkitAudioContext)();
		// Start tab audio capture.
		platform.tabCapture.capture({ audio: true, video: false }, function(stream) {
			if (stream === null) {
				tabs[request.id].audioContext.close();
				tabs[request.id].audioContext = undefined;
				return;
			}
			// Get media source.
			tabs[request.id].mediaStream = stream;
			let source = tabs[request.id].audioContext.createMediaStreamSource(tabs[request.id].mediaStream);
			// Create gain filter.
			tabs[request.id].gainFilter = tabs[request.id].audioContext.createGain();
			// Connect gain filter to the source.
			source.connect(tabs[request.id].gainFilter);
			// Connect the gain filter to the output destination.
			tabs[request.id].gainFilter.connect(tabs[request.id].audioContext.destination);
			// Apply volume.
			if (request.volume) {
				tabs[request.id].gainFilter.gain.value = request.volume;
			}
		});
	}
	// If volume is given and stream already present.
	if (request.volume !== undefined && tabs[request.id].mediaStream !== undefined) {
		tabs[request.id].gainFilter.gain.value = request.volume;
	}
	
	return true;
});