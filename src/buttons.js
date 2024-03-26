var magnFactorBut, butsBorderWidth, envButtons;

function setSizeBut () {
    //if (document.body.clientWidth > document.body.clientHeight) {
    //    magnFactorBut = 1.25 * document.body.clientWidth / 1920;
    //}
    //else {
    //    magnFactorBut = 1.25 * document.body.clientHeight / 1080;
    //}
    
    //if (window.devicePixelRatio > 1) {
    //    magnFactorBut *= 0.8;
    //}
    
    magnFactorBut = document.body.clientHeight / 1080;

    //if (magnFactorBut > 1) {
    //    magnFactorBut = 1;
    //}
    
    if (magnFactorBut < 0.5) {
        magnFactorBut = 0.5;
    }
    
    rescaleLftBut ();
    rescaleRgtBut ();
}

function initButtons (env) {
    envButtons = env;
    document.getElementById("rgtbut").style.transform = document.getElementById("rgtbut").style.transform + " " + (env.orientation === "north" ? "rotate(" + Math.PI + "rad) " : "")
    
    if (envButtons.butVisibility === "false") {
        document.getElementById("lftbut").style.visibility = "hidden";
        document.getElementById("rgtbut").style.visibility = "hidden";
    } else {
        document.getElementById("lftbut").style.visibility = "visible";
        document.getElementById("rgtbut").style.visibility = "visible";
    }

    butsBorderWidth = 4;
    if (envButtons.butVisibility !== "false") {
        /*
        if (envButtons.butsBorderColor && envButtons.butsBorderColor !== envButtons.butsBackColor) {
            document.getElementById("lftbutsvg").style.stroke = envButtons.butsBorderColor;
            document.getElementById("lftbutsvg").style.strokeWidth = butsBorderWidth + "px";
            
            document.getElementById("rgtbutsvg").style.stroke = envButtons.butsBorderColor;
            document.getElementById("rgtbutsvg").style.strokeWidth = butsBorderWidth + "px";
        }
        */

        if (envButtons.butShadowRadius > 0) {
            document.getElementById("lftbut").style.filter += " drop-shadow(0px 0px " + envButtons.butShadowRadius + "px " + envButtons.butShadowColor + ")";
            document.getElementById("rgtbut").style.filter += " drop-shadow(0px 0px " + envButtons.butShadowRadius + "px " + envButtons.butShadowColor + ")";
        }
    }


    //document.getElementById("lb1").style.stroke = envButtons.butsColor;
    document.getElementById("lb1").style.fill = envButtons.butsColor;

    document.getElementById("rb1").style.fill = envButtons.butsColor;
    document.getElementById("rb2").style.fill = envButtons.butsColor;
    document.getElementById("rb3").style.stroke = envButtons.butsColor;
    document.getElementById("rb3").style.fill = envButtons.butsColor;
    document.getElementById("rb4").style.stroke = envButtons.butsColor;
    document.getElementById("rb4").style.fill = envButtons.butsColor;
    document.getElementById("rb5").style.stroke = envButtons.butsColor;
    document.getElementById("rb5").style.fill = envButtons.butsColor;
    document.getElementById("rb6").style.stroke = envButtons.butsColor;
    document.getElementById("rb6").style.fill = envButtons.butsColor;

    var ngonsides = 4 * Math.round (8 / (envButtons.quant / 100) * 0.7);
    if (ngonsides > 100) ngonsides = 100;
    round (72, 72, 72, 72, ngonsides, document.getElementById("rgtbutsvg"), envButtons.butsBackColor);
    round (72, 72, 72, 72, ngonsides, document.getElementById("lftbutsvg"), envButtons.butsBackColor);

    window.addEventListener('resize', function () {
        setSizeBut ();
    });

    setSizeBut ();
}

function round (x, y, r1, r2, s, svg, backcolor) {
/*
    if (envButtons.butsBorderColor && envButtons.butsBorderColor !== envButtons.butsBackColor) {
        r1 -= butsBorderWidth;
        r2 -= butsBorderWidth;
    }
*/    
    var polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    svg.appendChild(polygon);

    var p = [];
    for (var i = 0.5; i < s; i++) {
        p.push ([x + Math.cos (2 * Math.PI / s * i) * r1, y + Math.sin (2 * Math.PI / s * i) * r2]);
    }

    for (value of p) {
        var point = svg.createSVGPoint();
        point.x = value[0];
        point.y = value[1];
        polygon.points.appendItem(point);
    }

    polygon.style.fill = backcolor;
}

// --- home button --- //
    function rescaleLftBut () {
        var lb = document.getElementById("lftbut");


        if (envButtons["orientation"] === "south") {
            lb.style.transform = "translateX(" +  Math.floor (-144 / 2 + 144 * magnFactorBut / 2) + "px)" + " translateY(" +  Math.floor (144 / 2 - 144 * magnFactorBut / 2) + "px)" + " scale(" + magnFactorBut + ") ";
            lb.style.right = "";
            lb.style.top = "";
            lb.style.left = 0.5 * magnFactorBut + "em";
            lb.style.bottom = 0.5 * magnFactorBut + "em";
        } else {
            lb.style.transform = "translateX(" +  Math.floor (144 / 2 - 144 * magnFactorBut / 2) + "px)" + " translateY(" +  Math.floor (-144 / 2 + 144 * magnFactorBut / 2) + "px)" + " scale(" + magnFactorBut + ") ";
            lb.style.left = "";
            lb.style.bottom = "";
            lb.style.right = 0.5 * magnFactorBut + "em";
            lb.style.top = 0.5 * magnFactorBut + "em";
        }
    }
    
    document.getElementById("lftbuta").addEventListener("click", function (evt) {
        document.getElementById ("body").contentWindow.postMessage({msg: "lftbutaClick"}, "*");
    }, false);
    
    document.getElementById("lftbuta").onmousedown = function (evt) {
        document.getElementById ("body").contentWindow.postMessage({msg: "lftbutaMouseDown"}, "*");
    };

    document.getElementById("lftbuta").addEventListener("touchstart", function (evt) {
        document.getElementById("lftbuta").dispatchEvent(new CustomEvent('click'));
        evt.preventDefault ();
    }, false);
    
    document.getElementById("lftbuta").ondragstart = function (evt) {
        evt.preventDefault ();
    };

    /*
    document.getElementById("lftbuta").addEventListener("click", function (evt) {
        reload (envButtons["topNode"]);
    }, false);
    
    document.getElementById("lftbuta").onmousedown = function (evt) {
        objOrbit.setMouseOff ();
    };

    document.getElementById("lftbuta").addEventListener("touchstart", function (evt) {
        objOrbit.setMouseOff ();
        document.getElementById("lftbuta").dispatchEvent(new CustomEvent('click'));
        evt.preventDefault ();
    }, false);
    
    document.getElementById("lftbut").ondragstart = function (evt) {
        evt.preventDefault ();
    };
    */

// --- home button end --- //

// --- navigator --- //

    function rescaleRgtBut () {
        var rb = document.getElementById("rgtbut");

        if (envButtons["orientation"] === "south") {
            rb.style.transform = "translateX(" +  Math.floor (144 / 2 - 144 * magnFactorBut / 2) + "px)" + " translateY(" +  Math.floor (144 / 2 - 144 * magnFactorBut / 2) + "px)" + " scale(" + magnFactorBut + ") " + (envButtons["orientation"] === "north" ? " rotate(180deg)" : "");

            rb.style.left = "";
            rb.style.top = "";
            rb.style.right = 0.5 * magnFactorBut + "em";
            rb.style.bottom = 0.5 * magnFactorBut + "em";
        } else {
            rb.style.transform = "translateX(" +  Math.floor (-144 / 2 + 144 * magnFactorBut / 2) + "px)" + " translateY(" +  Math.floor (-144 / 2 + 144 * magnFactorBut / 2) + "px)" + " scale(" + magnFactorBut + ") " + (envButtons["orientation"] === "north" ? " rotate(180deg)" : "");

            rb.style.right = "";
            rb.style.bottom = "";
            rb.style.left = 0.5 * magnFactorBut + "em";
            rb.style.top = 0.5 * magnFactorBut + "em";
        }
    }
    
    // --- zooming start --- //
        /*
        document.getElementById("zoominr").addEventListener("touchstart", function (evt) {
            document.getElementById("zoominr").dispatchEvent(new CustomEvent('click'));
            evt.preventDefault ();
        }, false);

        document.getElementById("zoomoutr").addEventListener("touchstart", function (evt) {
            document.getElementById("zoomoutr").dispatchEvent(new CustomEvent('click'));
            evt.preventDefault ();
        }, false);

        document.getElementById("zoominr").addEventListener('click', () => {
            objOrbit.zoomIn ();
        }, false);

        document.getElementById("zoomoutr").addEventListener('click', () => {
            objOrbit.zoomOut ();
        }, false);
        */
        
        document.getElementById("zoominr").addEventListener("touchstart", function (evt) {
            document.getElementById("zoominr").dispatchEvent(new CustomEvent('click'));
            evt.preventDefault ();
        }, false);

        document.getElementById("zoomoutr").addEventListener("touchstart", function (evt) {
            document.getElementById("zoomoutr").dispatchEvent(new CustomEvent('click'));
            evt.preventDefault ();
        }, false);

        document.getElementById("zoominr").addEventListener('click', () => {
            document.getElementById ("body").contentWindow.postMessage({msg: "zoominrClick"}, "*");
        }, false);

        document.getElementById("zoomoutr").addEventListener('click', () => {
            document.getElementById ("body").contentWindow.postMessage({msg: "zoomoutrClick"}, "*");
        }, false);

        function zoomedInR () {
            document.getElementById("zoominr").style.display = "none";
            document.getElementById("zoomoutr").style.display = "block";
        }
        
        function zoomedOutR () {
            document.getElementById("zoomoutr").style.display = "none";
            document.getElementById("zoominr").style.display = "block";
        }
        
        function zoomingOutR () {
        }
        
        function zoomingInR () {
        }
        
    // --- zooming end --- //
    
    // --- movement --- //
        /*
        document.getElementById("northr").addEventListener("touchstart", function (evt) {
            document.getElementById("northr").dispatchEvent(new CustomEvent('click'));
            evt.preventDefault ();
        }, false);

        document.getElementById("southr").addEventListener("touchstart", function (evt) {
            document.getElementById("southr").dispatchEvent(new CustomEvent('click'));
            evt.preventDefault ();
        }, false);

        document.getElementById("eastr").addEventListener("touchstart", function (evt) {
            document.getElementById("eastr").dispatchEvent(new CustomEvent('click'));
            evt.preventDefault ();
        }, false);

        document.getElementById("westr").addEventListener("touchstart", function (evt) {
            document.getElementById("westr").dispatchEvent(new CustomEvent('click'));
            evt.preventDefault ();
        }, false);

        document.getElementById("northr").addEventListener('click', () => {
            if (objOrbit.getMagn() === 1)
                objOrbit.levelUp ();
            else
                objOrbit.slideUp ();
        }, false);
        
        document.getElementById("southr").addEventListener('click', () => {
            if (objOrbit.getMagn() === 1)
                objOrbit.levelDown ();
            else
                objOrbit.slideDown ()
        }, false);

        document.getElementById("eastr").addEventListener('click', () => {
            if (objOrbit.getMagn() === 1)
                objOrbit.rotCounterClockwise ();
            else
                objOrbit.slideRight ();
        }, false);
        
        document.getElementById("westr").addEventListener('click', () => {
            if (objOrbit.getMagn() === 1)
                objOrbit.rotClockwise ();
            else
                objOrbit.slideLeft ();
        }, false);
        */

        document.getElementById("northr").addEventListener("touchstart", function (evt) {
            document.getElementById("northr").dispatchEvent(new CustomEvent('click'));
            evt.preventDefault ();
        }, false);

        document.getElementById("southr").addEventListener("touchstart", function (evt) {
            document.getElementById("southr").dispatchEvent(new CustomEvent('click'));
            evt.preventDefault ();
        }, false);

        document.getElementById("eastr").addEventListener("touchstart", function (evt) {
            document.getElementById("eastr").dispatchEvent(new CustomEvent('click'));
            evt.preventDefault ();
        }, false);

        document.getElementById("westr").addEventListener("touchstart", function (evt) {
            document.getElementById("westr").dispatchEvent(new CustomEvent('click'));
            evt.preventDefault ();
        }, false);

        document.getElementById("northr").addEventListener('click', () => {
            document.getElementById ("body").contentWindow.postMessage({msg: "northrClick"}, "*");
        }, false);
        
        document.getElementById("southr").addEventListener('click', () => {
            document.getElementById ("body").contentWindow.postMessage({msg: "southrClick"}, "*");
        }, false);

        document.getElementById("eastr").addEventListener('click', () => {
            document.getElementById ("body").contentWindow.postMessage({msg: "eastrClick"}, "*");
        }, false);
        
        document.getElementById("westr").addEventListener('click', () => {
            document.getElementById ("body").contentWindow.postMessage({msg: "westrClick"}, "*");
        }, false);
    // --- movement end --- //
    /*
    document.getElementById("rgtbut").onmousedown = function (evt) {
        objOrbit.setMouseOff ();
    };
    
    document.getElementById("rgtbut").addEventListener("touchstart", function (evt) {
        objOrbit.setMouseOff ();
    }, false);
    */
    document.getElementById("rgtbut").onmousedown = function (evt) {
        document.getElementById ("body").contentWindow.postMessage({msg: "rgtbutMouseDown"}, "*");
    };

    document.getElementById("rgtbut").addEventListener("touchstart", function (evt) {
        document.getElementById ("body").contentWindow.postMessage({msg: "rgtbutTouchstart"}, "*");
    }, false);
// --- navigator end --- //

window.addEventListener("touchend", function (evt) {
    document.getElementById ("body").contentWindow.postMessage({msg: "windowTouchend"}, "*");
}, false);

window.addEventListener("mouseup", function (evt) {
    document.getElementById ("body").contentWindow.postMessage({msg: "windowMouseup"}, "*");
}, false);

