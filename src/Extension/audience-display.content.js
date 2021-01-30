"use strict";

var lastElem = null;
var lastElemStyle = null;
var currentId = null;
var connection = null;
var port = null; //56839;

/**
 * Given and element and an array of CSS style names, returns a dictionary
 * of the element's current style for each of the requested names.
 */
function getStyleList(elem, names) {
    var styles = {};
    var computedStyle = document.defaultView.getComputedStyle(elem);
    for (var i = 0; i < names.length; i++) {
        styles[names[i]] = computedStyle.getPropertyValue(names[i]);
    }
    return styles;
};

/**
 * Called every time the mouse is moved.  If the mouse has moved to a new 
 * element, restore the original styling for the previous element and 
 * add the highlighted styles for the new element.
 */
function onMouseMove(evt) {
    var elem = document.elementFromPoint(evt.clientX, evt.clientY);
    if (elem != lastElem) {
        window.setTimeout(function () {
            resetOldStyles();
            saveElementStyles(elem, ['-webkit-box-shadow', 'cursor', 'border']);
            setStyleList(elem, {
                '-webkit-box-shadow': '0 2px 6px #f66',
                'cursor': 'pointer',
                'border': '2px solid #f00'
            });
        }, 100);
    }
};

/**
 * Return the original styles to the element that's currently highlighted.
 */
function resetOldStyles() {
    if (lastElem) {
        setStyleList(lastElem, lastElemStyle);
        lastElem = null;
        lastElemStyle = null;
    }
};

/**
 * Given an element and a list of style names, saves the current values of 
 * each style, along with a reference to the element.
 */
function saveElementStyles(elem, styles) {
    lastElem = elem;
    lastElemStyle = getStyleList(elem, styles);
};

/**
 * Given an element and a dictionary of css/value pairs, sets the element's 
 * style to the values in the dictionary.
 */
function setStyleListInner(elem, styles) {
    for (var name in styles) {
        if (styles.hasOwnProperty(name)) {
            elem.style.setProperty(name, styles[name]);
        }
    }
};

var setStyleList = function () { }

function activateMessage() {
    setStyleList = function (elem, styles) { setStyleListInner(elem, styles); };
    window.addEventListener('mousemove', onMouseMove, true);
}

/**
 * Sets the font on the currently selected element.
 */
function sendToAudienceDisplay(elem) {
    window.removeEventListener('mousemove', onMouseMove, true);
    resetOldStyles();
    setStyleList = function () { }

    var youtubeElement = $(elem);
    while (!youtubeElement.is("yt-live-chat-text-message-renderer")) {
        if (youtubeElement.is("body")) {
            alert("Select a valid comment to send to Audience Display.");
            return;
        }
        youtubeElement = youtubeElement.parent();
    }

    var newId = youtubeElement.attr("id");

    currentId = newId;

    var image = youtubeElement.find("#author-photo > #img").attr("src");
    image = image.replace("s32-c-k-", "s200-c-k-");

    var author = youtubeElement.find("#content > yt-live-chat-author-chip > #author-name").text();

    var message = youtubeElement.find("#content > #message").html();

    sendMessage(newId, author, image, message);
};

function sendMessage(newId, author, image, message) {
    if (connection == null) {
        if (port == null) {
            port = prompt("Specify the port that Audience Display Server is running");
        }
        connection = new signalR.HubConnectionBuilder().withUrl(`http://localhost:${port}/listen`).build();
    }

    if (connection.connectionState === "Disconnected") {
        connection.start().then(function () {
            connection.invoke("SendMessage", newId, author, image, message).catch(function (err) {
                return console.error(err.toString());
            });
        }).catch(function (err) {
            alert("Failed to connect to Audience Display Server.");
            return console.error(err.toString());
        });
    }
    else {
        connection.invoke("SendMessage", newId, author, image, message).catch(function (err) {
            alert("Failed to connect to Audience Display Server.");
            return console.error(err.toString());
        });
    }
}

function removeFromAudienceDisplay() {
    if (currentId != null) {
        sendMessage(currentId);
    }
    currentId = null;
}