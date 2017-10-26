# Tab Volume
Tab volume allows you to set different volume levels per tab in chrome. The volume levels are mapped exponentially this means 50 is a gain of 0.25, 100 is a gain of 1, and 200 is a gain of 4. It remembers preveously selected volume levels for each domain and use those when loading up the page again.

![Screenshot](images/screenshot.png)

The extension works by using the capture tab functionality. It records and returns the audio of the tab whilst passing it through a gain filter that is controlled by the pop-up.

Due to security limitations placed upon the tab capture function the extension will run as soon as the button for it is clicked as the active tab permission needs to be invoked.

## Known issues
* Returns the error seen below in the background page when opening the pop-up using the 'Inspect pop-up' option. This is caused by the fact that another page will open up and is seen as the current active page, which conflicts with the one that we opened the pop-up opend up for. No solution is being worked on now as it is only seen by me the developer.
```
Unchecked runtime.lastError while running tabCapture.capture: Extension has not been invoked for the current page (see activeTab permission). Chrome pages cannot be captured.
```
