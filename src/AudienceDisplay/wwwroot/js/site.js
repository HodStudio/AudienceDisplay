// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your Javascript code.

"use strict";

let currentId = "";
var connection = new signalR.HubConnectionBuilder().withUrl("/listen").build();
var messageBox = $("#showMessage");
var template = $("#template").html();

connection.on("ReceiveMessage", function (newId, author, image, message) {
    console.log("message received");

    if (currentId === newId) {
        messageBox.fadeOut("slow");
        currentId = "";
        return;
    }

    var innerHtml = template;
    innerHtml = innerHtml.replace("{IMAGE_SRC}", image);
    innerHtml = innerHtml.replace(/{AUTHOR_NAME}/g, author);
    innerHtml = innerHtml.replace("{MESSAGE}", message);

    currentId = newId;

    if (!messageBox.is(":hidden")) {
        messageBox.fadeOut("slow", function () {
            showMessage(innerHtml);
        });
    }
    else {
        showMessage(innerHtml);
    }
});

connection.start().then(function () {
    console.log("connected");
}).catch(function (err) {
    return console.error(err.toString());
});

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function showMessage(innerHtml) {
    messageBox.html(innerHtml);
    await sleep(200);
    messageBox.fadeIn("slow");
}