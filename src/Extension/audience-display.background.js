// Keeps track of which tabs are active.
var active = {};

var hasMessage = false;
var preparingMessage = false;

/**
 * Called when the browser action is clicked.  Runs selectitem.js if 
 * needed.
 */
function onBrowserActionClicked(tab) {
    if (active[tab.id] == false) {
        if (isInvalidUrl(tab.url)) {
            alert("Audience Display only works (for now) in the Live Chat from YouTube.");
            return;
        }

        setActive(tab.id, true);
        chrome.tabs.executeScript(tab.id, { code: "activateMessage();" });
    }
};

function isInvalidUrl(currentUrl) {
    return !currentUrl.startsWith("https://www.youtube.com/live_chat?");
}

/**
 * Puts the specified tab in "active" or "inactive" mode, depending on the
 * value of the supplied boolean.
 */
function setActive(tabid, val) {
    chrome.tabs.getSelected(null, function (currenttab) {
        active[tabid] = (typeof val == 'boolean') ? val : false;
        if (currenttab.id == tabid) {
            setMenu(active[tabid]);
            changeBrowserActionIcon(isInvalidUrl(currenttab.url));
        }
    });
};

function changeBrowserActionIcon(isInvalidUrl) {
    var imageUrl = "images/audience-display.default.png";
    if (isInvalidUrl)
        imageUrl = "images/audience-display.disable.png";
    else if (preparingMessage)
        imageUrl = "images/audience-display.sending.png";
    chrome.browserAction.setIcon({
        path: imageUrl
    });
    chrome.browserAction.setBadgeText({
        text: preparingMessage ? "!" : ""
    });
}


// Keeps track of which fonts already have menu items.
var menuitems = {};
var menuRemove = {};

/**
 * Adds or removes the context menu entries, depending on the value of
 * the supplied boolean argument.
 */
function setMenu(active) {
    chrome.contextMenus.removeAll();
    menuitems = {};
    menuRemove = {};
    if (active) {
        setMenuItem();
    }
    else if (hasMessage) {
        setMenuRemove();
    }
};

/**
 * Adds a single context menu item for the given font.
 */
function setMenuItem() {
    if (Object.keys(menuitems).length === 0) {
        preparingMessage = true;
        menuitems = chrome.contextMenus.create({
            "id": "audience-display-viewer",
            "title": "Send to Audience Display",
            "type": "normal",
            "contexts": ["all"],
            "onclick": wrapMenuClick()
        });
    }
};

function setMenuRemove() {
    if (Object.keys(menuitems).length === 0) {
        preparingMessage = false;
        menuitems = chrome.contextMenus.create({
            "id": "audience-display-viewer",
            "title": "Remove from Audience Display",
            "type": "normal",
            "contexts": ["all"],
            "onclick": wrapMenuRemoveClick()
        });
    }
};

/**
 * Returns a function that will handle a context menu item click.  Calls
 * setFont in selectitem.js.
 */
function wrapMenuClick() {
    return function (data, tab) {
        chrome.tabs.executeScript(tab.id, {
            code: "sendToAudienceDisplay(lastElem); "
        });
        hasMessage = true;
        setActive(tab.id, false);
    };
};

function wrapMenuRemoveClick() {
    return function (data, tab) {
        chrome.tabs.executeScript(tab.id, {
            code: "removeFromAudienceDisplay();"
        });
        hasMessage = false;
        setActive(tab.id, false);
    };
};

chrome.browserAction.onClicked.addListener(onBrowserActionClicked);
chrome.browserAction.setBadgeBackgroundColor({ color: "#F00" });

// Handle tabs being added / removed / updated.

chrome.tabs.onUpdated.addListener(function (tabid) {
    setActive(tabid, false);
});
chrome.tabs.onRemoved.addListener(function (tabid) {
    delete active[tabid];
});
chrome.tabs.onSelectionChanged.addListener(function (tabid) {
    setActive(tabid, active[tabid]);
});

chrome.runtime.onInstalled.addListener(function (details) {
    if (details.reason !== "install") {// && details.reason !== "update") {
        return;
    }
    chrome.tabs.create({ url: `chrome://extensions/?options=${chrome.runtime.id}` }, function (tab) {
        console.log("options page opened");
    });
});