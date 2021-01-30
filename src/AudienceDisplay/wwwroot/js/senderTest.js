"use strict";

console.log("starting connection");
var connection = new signalR.HubConnectionBuilder().withUrl("/listen").build();
connection.start().then(function () {
    console.log("connected")
}).catch(function (err) {
    alert(err)
    return console.error(err.toString());
});

$(".sendToHeimdall").click(async function () {
    var button = $(this);
    var youtubeElement = $(button.parent()[0]);
    var newId = youtubeElement.attr("id");
    var messageBox = $(".showMessage");

    var image = youtubeElement.find("#author-photo > #img").attr("src");
    image = image.replace("s32-c-k-", "s200-c-k-");

    var author = youtubeElement.find("#content > yt-live-chat-author-chip > #author-name").text();

    var message = youtubeElement.find("#content > #message").html();

    sendMessage(newId, author, image, message);
});

function sendMessage(newId, author, image, message) {
    console.log(connection);
    if (connection.connectionState === "Disconnected") {
        connection.start().then(function () {
            connection.invoke("SendMessage", newId, author, image, message).catch(function (err) {
                return console.error(err.toString());
            });
        }).catch(function (err) {
            alert(err)
            return console.error(err.toString());
        });
    }
    else {
        connection.invoke("SendMessage", newId, author, image, message).catch(function (err) {
            return console.error(err.toString());
        });
    }
    console.log(connection);
}