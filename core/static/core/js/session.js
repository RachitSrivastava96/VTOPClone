window.addEventListener("beforeunload", function () {
    navigator.sendBeacon("/force-logout/");
});