// Setup extension.
document.addEventListener('DOMContentLoaded', function() {
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		// Get domain.
		let domain = tabs[0].url.match(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n]+)/im)[1];
		// Get input fields.
		let input = document.getElementById('interface').children;
		
		// Get volume level from storage.
		chrome.storage.sync.get(domain, function(items) {
			// Apply volume level.
			let volume = items[domain];
			if (volume) {
				chrome.runtime.sendMessage({ id: tabs[0].id, volume: volume });
			}
			// If no volume level given set default of 100.
			else {
				volume = 100;
			}
			
			// Apply volume to interface.
			for (let i = 0; i < input.length; i++) {
				input[i].value = volume;
			}
		});
		
		// Add input change event.
		for (let j = 0; j < input.length; j++) {
			input[j].addEventListener('change', function() {
				// Set value to other input field.
				for (let k = 0; k < input.length; k++) {
					if (input[k] === this) {
						continue;
					}
					input[k].value = this.value;
				}
				
				// Set volume level of tab.
				chrome.runtime.sendMessage({ id: tabs[0].id, volume: this.value });
				// Store value level.
				let items = {};
				items[domain] = this.value;
				chrome.storage.sync.set(items);
			});
		}
	});
});