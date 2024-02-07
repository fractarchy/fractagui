var loadedOvals = [];
var loadedOvalsIndex = 0;
async function loadOval(node) {
    return new Promise(async function(resolve, reject) {
        if (node.ifr)
            resolve();
        
        var idiv = document.createElement ('div');
        var ifr = document.createElement ('iframe');
        ifr.addEventListener('load', function () {
            if (!ifr.firstOnLoad) {
                ifr.firstOnLoad = true;
                allOvals.push (node);
            }
            resolve ();
        });
        
        ifr.addEventListener('error', function () {
            reject ();
        });

        loadNode (node.xml, node).then ((loaded) => {
            node.children = loaded.children;

            idiv.style.position = "absolute";
            idiv.style.visibility = "hidden";
            idiv.style.border = "none";
            idiv.style.overflow = "hidden";
            idiv.scrolling = "no";
            idiv.disabled = true;
            idiv.tabIndex = -1;
            //idiv.width = objOrbit.getOvalWidth ();//objOrbit.getRadius () * 1.2;
            
            ifr.style.border = "none";
            ifr.style.overflow = "hidden";
            ifr.scrolling = "no";
            ifr.disabled = true;
            ifr.tabIndex = -1;
            //ifr.width = objOrbit.getOvalWidth ();//objOrbit.getRadius () * 1.2;

            idiv.appendChild (ifr);
            node.ifr = idiv;
            node.wrappedifr = ifr;
            //document.body.appendChild (idiv);
            //divContainer.appendChild (idiv);
            
            var xhr = new XMLHttpRequest();

            xhr.onload = function() {
                if (this.readyState == 4 && this.status == 200) {
                    
                    var parser = new DOMParser();
                    var xmlDoc = parser.parseFromString(xhr.responseText, "application/xml");                                
                    if (xmlDoc) {
                        var base = document.createElement('base');
                        base.href = xhr.responseURL;
                        
                        var head = xmlDoc.documentElement.getElementsByTagName('head')[0];
                        if (!head) {
                            head = document.createElement('head');
                            xmlDoc.documentElement.insertBefore (head, xhr.responseXML.documentElement.childNodes[0]);
                        }
                        head.insertBefore(base, head.childNodes[0]);

                        var body = xmlDoc.documentElement.getElementsByTagName('body')[0];
                        if (!body) {
                            body = document.createElement('body');
                            xmlDoc.documentElement.insertAfter (body, head.childNodes[0]);
                        }
                        loadedOvals[loadedOvalsIndex] = node;

                        var html = `
                            window.addEventListener("unload", function (event) {
                                window.parent.postMessage({msg: "unload", index: ${loadedOvalsIndex}}, "*");
                            });
                            
                            function extractLinks_fract_123 (node) {
                                var hyperlinks;
                                var links = node.getElementsByTagName("a");
                                //for (var i = 0; i < links.length; i++) {
                                for (var i in links) {
try {
                                    //alert (i);
                                    var tg = links[i].getAttribute('target');
                                    var hr = links[i].href;
                                    if (hr.baseVal) hr = hr.baseVal;

                                    if (!hr)
                                        hr = links[i].getAttributeNS('http://www.w3.org/1999/xlink', 'href');
                                  
                                    if (hr) {
                                        if (!hyperlinks)
                                            hyperlinks = [];
                                        
                                        if (links[i].children)
                                        if (links[i].children.length !== 0) {
                                            (function traverseChildren(link, node) {
                                                if (link.children)
                                                if (link.children.length !== 0) {
                                                    //for (var j = 0; j < link.children.length; j++) {
                                                    for (var j in link.children) {
                                                        traverseChildren(link.children[j], node);
                                                    }
                                                }
                                                
                                                var rects = link.getClientRects();
                                                for (var j in rects) {
try {
                                                    if (rects[j].right)
                                                        hyperlinks.push (
                                                            {
                                                                "type": "rect",
                                                                "target": tg,
                                                                "href": hr,
                                                                "left": rects[j].left,
                                                                "top": rects[j].top,
                                                                "right": rects[j].right,
                                                                "bottom": rects[j].bottom
                                                            }
                                                        );
} catch (e) {}
                                                }
                                            }) (links[i], node);
                                        } else {
                                            var rects = links[i].getClientRects();
                                            for (var j in rects) {
try {
                                                hyperlinks.push (
                                                    {
                                                        "type": "rect",
                                                        "target": tg,
                                                        "href": hr,
                                                        "left": rects[j].left,
                                                        "top": rects[j].top,
                                                        "right": rects[j].right,
                                                        "bottom": rects[j].bottom
                                                    }
                                                );
} catch (e) {}
                                            }
                                        }
                                    }
} catch (e) {}
                                }
                                
                                if (hyperlinks)
                                    window.parent.postMessage({msg: "relink", index: ${loadedOvalsIndex}, hyperlinks: hyperlinks}, "*");
                            }
                            
                            
                            extractLinks_fract_123 (document);
                            
                            setInterval (function () {
                                extractLinks_fract_123 (document);
                            }, 500);

var ro_fract_123 = new ResizeObserver(function (entries) {
for (let entry of entries) {
const cr = entry.contentRect;
window.parent.postMessage({msg: "resize", index: ${loadedOvalsIndex}, width: cr.width, height: cr.height}, "*");
}
})
ro_fract_123.observe(document.body);

                        `;
                        loadedOvalsIndex++;
                        
                        var script= document.createElement("script");
                        script.type = "text/javascript";
                        script.innerHTML = ` ${html} `;
                        body.appendChild( script );
                        ifr.srcdoc = xmlDoc.documentElement.innerHTML;
                        node.ifr = idiv;

                        divContainer.appendChild (idiv);

                        //resolve (getNode (xhr.responseXML));

                    } else {
                        alert (`Error processing '${loaded.src}'`);
                        reject ();
                    }
                }
            }

            xhr.onerror = function() {
                alert (`Error while getting '${loaded.src}'`);
                reject ();
            }

            xhr.open("GET", loaded.src /*+ "?" + Date.now()*/, true);
            xhr.send();
            dispatchDraw();
        });
    });
}

async function loadNode (fileName, node) {
    return new Promise(async function(resolve, reject) {
        function getNode (topNode) {
            
            var xmlNode = topNode.children[0].children[0];
            
            var url = new URL(xmlNode.attributes.getNamedItem("src").nodeValue, xhr.responseURL).href
            var att = xmlNode.attributes.getNamedItem("type");
            if (att)
                var type = att.nodeValue;
            else
                var type = "html";

            node.type = type;
            node.src = url;

            att = xmlNode.attributes.getNamedItem("vlock");
            if (att)
                node.vLock = att.nodeValue;

            att = xmlNode.attributes.getNamedItem("hlock");
            if (att)
                node.hLock = att.nodeValue;

            att = xmlNode.attributes.getNamedItem("valign");
            if (att)
                node.vAlign = att.nodeValue;

            att = xmlNode.attributes.getNamedItem("halign");
            if (att)
                node.hAlign = att.nodeValue;

            att = xmlNode.attributes.getNamedItem("backcolor");
            if (att)
                node.backColor = att.nodeValue;
            
            node.children = [];
            xmlNode = topNode.children[0].children[1];
            if (xmlNode)
                for (var i = 0; i < xmlNode.children.length; i++) {
                    var fn = new URL (xmlNode.children[i].attributes.getNamedItem("src").nodeValue, xhr.responseURL).href;
                    node.children.push ({parent: node, children: [], index: i, xml: fn});
                }

            return node;
        }
        
        var xhr = new XMLHttpRequest();

        xhr.onload = function() {
            if (this.readyState == 4 && this.status == 200) {
                
                if (xhr.responseXML) {
                    resolve (getNode (xhr.responseXML));

                } else {
                    alert (`Error processing '${fileName}'`);
                    reject ();
                }
            }
        }

        xhr.onerror = function() {
            alert (`Error while getting '${fileName}'`);
            reject ();
        }

        xhr.open("GET", fileName /*+ "?" + Date.now()*/, true);
        xhr.responseType = "document";
        xhr.overrideMimeType('text/xml');
        xhr.send();
    });
}
            

