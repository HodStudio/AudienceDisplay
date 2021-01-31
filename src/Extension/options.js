// Saves options to chrome.storage
function save_options() {
    var status = document.getElementById('status');
    var statusError = document.getElementById('statusError');
    var serverAddress = document.getElementById('serverAddress').value.replace(new RegExp("[/]+$"), "");
    if (!serverAddress) {
        status.style.display = "none";
        statusError.style.display = "block";
        statusError.textContent = "Please, inform the Audience Display Server address.";
        return;
    }

    chrome.storage.sync.set({
        serverAddress: serverAddress
    }, function () {
        restore_options();
        var status = document.getElementById('status');
        // Update status to let user know options were saved.
        statusError.style.display = "none";
        status.style.display = "block";
        status.textContent = 'Options saved.';
        setTimeout(function () {
            status.style.display = "none";
            restore_options();
        }, 3000);
    });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
    chrome.storage.sync.get({
        serverAddress: 'http://localhost:40000'
    }, function (items) {
        document.getElementById('serverAddress').value = items.serverAddress;
    });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);