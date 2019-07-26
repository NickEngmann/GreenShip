const devmode = true;
var manifest = chrome.runtime.getManifest();
var appName = manifest.name;
var appVersion = manifest.version;

//running on app reload
chrome.runtime.onInstalled.addListener(function () {
    if (devmode) {
        console.log(appName + " " + appVersion + " is reloaded.");
        console.log("Nick Engmann sends his regards.");
    }
});

chrome.runtime.onMessage.addListener(function (message) {
    console.log("runTime On Request");
    chrome.storage.local.set({'emissionsTable': message });
});

/* request to toggle slider whenever browser icon clicked
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
    console.log("browserAction on click");
});
