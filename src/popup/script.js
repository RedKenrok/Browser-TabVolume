// Get platform specific interface object.
let platform = chrome ? chrome : browser;

// Setup extension.
document.addEventListener('DOMContentLoaded', function() {
	platform.tabs.query({active: true, currentWindow: true}, function(tabs) {
		// Get domain.
		let domain = tabs[0].url.match(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n]+)/im)[1];
		
		// Get input fields.
		let input = document.getElementById('interface').children;
		// Add input change event.
		for (let i = 0; i < input.length; i++) {
			input[i].addEventListener('change', function() {
				// Set value to other input field.
				for (let j = 0; j < input.length; j++) {
					if (input[j] === this) {
						continue;
					}
					input[j].value = this.value;
				}
				
				// Set volume level of tab.
				platform.runtime.sendMessage({ id: tabs[0].id, volume: this.value });
				// Store value level.
				let items = {};
				items[domain] = this.value;
				platform.storage.sync.set(items);
			});
		}
		// Add button click event.
		document.getElementById('stop').addEventListener('click', function() {
			// Set volume to default 100 to disable the system.
			platform.runtime.sendMessage( {id: tabs[0].id, volume: 100 });
			// Exit the window.
			window.close();
		});
		
		// Get volume level from storage.
		platform.storage.sync.get(domain, function(items) {
			// Apply volume level.
			let volume = items[domain];
			if (volume) {
				platform.runtime.sendMessage({ id: tabs[0].id, volume: volume });
			}
			// If no volume level given set default of 100.
			else {
				volume = 100;
			}
			
			// Apply volume to interface.
			for (let k = 0; k < input.length; k++) {
				input[k].value = volume;
			}
		});
	});
});