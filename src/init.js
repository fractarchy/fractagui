function initProps (callback) {
    var xhttp = new XMLHttpRequest ();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            try {
                fileJSON = JSON.parse (this.responseText);
            } catch (e) {
                alert ('Error:\n' + e.message);
                throw e;
            }
            callback (fileJSON, new URL(fileJSON["home"], xhttp.responseURL).href);
        }
    };
    xhttp.open("GET", "init.json"/* + "?" + Date.now()*/, true);
    xhttp.overrideMimeType("text/plain");
    xhttp.send();
}

