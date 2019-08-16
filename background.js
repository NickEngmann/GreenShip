const devmode = false;
var manifest = chrome.runtime.getManifest();
var appName = manifest.name;
var appVersion = manifest.version;

chrome.runtime.onInstalled.addListener(function () {
    console.log(appName + " " + appVersion + " is loaded.");
    if (devmode) {
        console.log("Nick Engmann sends his regards.");
        console.log("Source @ https://github.com/NickEngmann/GreenShip");
        console.log("Check out my stuff @ https://nickengmann.com");
    }
});


chrome.runtime.onMessage.addListener(function (message) {
    // Save emissions table in local storage for the icon window popup
    chrome.storage.local.set({'emissionsTable': message });
});

/* Request to toggle slider whenever browser icon clicked
 */
chrome.browserAction.onClicked.addListener(function () {
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
            todo: "toggle"
        });
    })
});
