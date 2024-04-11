function fractalOvals (ctx, ratio, xx, yy, ww, hh, rr, squashX, squashY, drawCircle, fill1, stroke1, str1, shadowr, shadowColor, circleSize, ngonsides, shiftY, uiscale) {
    var pixelPrecision = 1 / Math.pow (2, 1); /* set it to less and you are doomed */
    var qang = 0.025 * Math.PI;

    var hilight = fill1;
    //var stroke1 = str1;
    var fill2 = stroke1;
    var stroke2 = fill1;
    
    var shadow;

    var render = function (minRadius, x1, y1, r1, angle, rec, mouse, data, index, cursor, selectedCursor, renderHint, renderData, gclip, zoom) {
        return render1 (minRadius, x1, y1, r1, angle, rec, mouse, data, index, cursor, selectedCursor, renderHint, renderData, 0, gclip, zoom);
    }
    
    var render1 = function (minRadius, x1, y1, r1, angle, rec, mouse, data, index, cursor, selectedCursor, renderHint, renderData, parentR, gclip, zoom) {
        function getCircle (alpha, x0, y0, r0, x1, y1, r1) {
            var beta = angle + alpha - Math.PI / 2;
            
            var ra = 0;
            var xa = x0 + r0 * Math.cos (beta);
            var ya = y0 + r0 * Math.sin (beta);
            
            var rb = 2 * r1;
            var xb = x0 + (r0 + rb) * Math.cos (beta);
            var yb = y0 + (r0 + rb) * Math.sin (beta);

            var dr = (rb - ra) / 2;
            var dx = (xb - xa) / 2;
            var dy = (yb - ya) / 2;
            
            ra += dr;
            xa += dx;
            ya += dy;

            var j;
            var steps = 12;
            do {
                dx /= 2;
                dy /= 2;
                dr /= 2;
                var d = Math.sqrt (Math.pow ((xa - x1), 2) + Math.pow ((ya - y1), 2));
                if (Math.abs (ra - r1) <= d) {
                    xa -= dx;
                    ya -= dy;
                    ra -= dr;
                } else {
                    xa += dx;
                    ya += dy;
                    ra += dr;
                }
                steps--;
            } while (steps > 0 && dr > pixelPrecision);

            return {
                x: (r0 + ra) * Math.cos (beta),
                y: (r0 + ra) * Math.sin (beta),
                r: ra,
                alpha: alpha
            };
        }
        
        function getNeighbor (c1, direction, x0, y0, r0, x1, y1, r1) {
            if (direction == "+") {
                var alpha = c1.alpha / 2;
                var dalpha = alpha;
            } else {
                var alpha = (2 * Math.PI + c1.alpha) / 2;
                var dalpha = -(2 * Math.PI - alpha);
            }
            
            var steps = 12;
            do {
                var c2 = getCircle (alpha, x0, y0, r0, x1, y1, r1);
                dalpha /= 2;
                var d = Math.sqrt (Math.pow ((c1.x - c2.x), 2) + Math.pow ((c1.y - c2.y), 2));
                if ((c1.r + c2.r) >= d) {
                    alpha -= dalpha;
                } else {
                    alpha += dalpha;
                }
                steps--;
            } while (steps > 0 && Math.abs ((c1.r + c2.r) - d) > pixelPrecision);

            return c2;
        }
        
        function clear (fill) {
            if (!fill) fill = fill2
            ctx.fillStyle = fill2;
            ctx.clearRect(0, 0, ww, hh);
        }
        
        function ellipse(ctx, x, y, xDis, yDis) {
            var kappa = 0.5522848,  // 4 * ((√(2) - 1) / 3)
                ox = xDis * kappa,  // control point offset horizontal
                oy = yDis * kappa,  // control point offset vertical
                xe = x + xDis,      // x-end
                ye = y + yDis;      // y-end

            ctx.moveTo(x - xDis, y);
            ctx.bezierCurveTo(x - xDis, y - oy, x - ox, y - yDis, x, y - yDis);
            ctx.bezierCurveTo(x + ox, y - yDis, xe, y - oy, xe, y);
            ctx.bezierCurveTo(xe, y + oy, x + ox, ye, x, ye);
            ctx.bezierCurveTo(x - ox, ye, x - xDis, y + oy, x - xDis, y);
        }
        
        var i;
/*
    xx = (xx - xx * zoom) + xx * zoom;
    yy = yy * zoom;
    rr = rr * zoom;
*/
if (rec === 1) {
    x1 = (xx - xx * zoom) + x1 * zoom;
    if (angle === 0)
        y1 = y1 * zoom;
    
    else {
        if (renderHint === "0") {
            
        } else {
            var ma = rr;
            var mb = rr * shiftY;
            var mc = hh * (uiscale - 1) / 2;
            //y1 = hh / squashY + (mb - ma) * zoom /* + (-(hh / squashY + (mb - ma)) + y1) * 2*/;
            y1 = hh / squashY + (mc / squashY - mb - ma) * zoom;
        }
    }
    r1 = r1 * zoom;
}

        var r0 = r1 * ratio;
        var x0 = x1 + (r1 - r0) * Math.cos (angle - Math.PI / 2);
        var y0 = y1 + (r1 - r0) * Math.sin (angle - Math.PI / 2);
/*        
    x0 = (xx - xx * zoom) + x0 * zoom;
    y0 = y0 * zoom;
    r0= r0 * zoom;
*/    
//        if (shadow) {
//            if (rec === 1 && renderHint !== "1") {
            if (rec === 1) {
                clear();
                hideOvals(data);
                
//                ctx.save ();
                //gclip ();
            }
//            }
//        }
        
        var siblings
        var prevAngle, nextAngle
        if (
            (rec > 1 && zoom > 1) || !(Math.sqrt ((x1 - xx) * (x1 - xx) + (y1 - yy) * (y1 - yy)) < r1 + rr)
        ) {
            //if (data.ifr)
            //    data.ifr.style.visibility = "hidden";

        } else  {
            //if (rec === 1 && renderHint !== "0" && data.parent.ifr)
            //    data.parent.ifr.style.visibility = "hidden";

            if ((r1 * squashY * squashX) >= minRadius) {
                var colorFill = fill1;
                
                //if (!renderHint || (rec > 1 && renderHint === "1+") || renderHint === "1" || renderHint === "0") {
                    drawCircle (data, angle, parentR, x0, y0, r0, colorFill, stroke1, cursor, renderHint, rec, shadow);
                //}
                
                if (data.children.length > 0 /*&& renderHint !== "1"*/) {
                    var cursib;
                    siblings = [];
                    
                    var ret, idx, alp;
                    var got;
                    var c0, c1;
                    var alpha = (cursor?cursor.angle:Math.PI);
                    if (cursor && cursor.index === cursor.minIndex && alpha < Math.PI)
                        alpha = Math.PI;
                        
                    if (cursor && cursor.index === cursor.maxIndex && alpha > Math.PI)
                        alpha = Math.PI;
                        
                    if (alpha === -Infinity || alpha === Infinity)
                        alpha = Math.PI;
                    
                    var ci;
                    var oldr, delta;
        
                    c0 = getCircle (alpha, x0, y0, r0, x1, y1, r1);
                    ci = (cursor?cursor.index:0);
                    cursib = 0;
                    if (c0.r * squashX * squashY >= minRadius) {
                        got = render1 (minRadius, x0 + c0.x, y0 + c0.y, c0.r, angle + alpha - Math.PI, rec + 1, mouse, data.children[ci], ci, (cursor?cursor.children[ci]:null), selectedCursor, null, renderData, r1, gclip, zoom);
                        if (got && got.mouseIn) {
                            idx = ci;
                            alp = alpha;
                            ret = got;
                        }

                        siblings[cursib] = got
                    }
                    
                    oldr = c0.r;
                    c1 = getNeighbor (c0, "+", x0, y0, r0, x1, y1, r1);
                    alpha = c1.alpha;
                    ci = (cursor?cursor.index:0);
                    var cursib = 0;
                    while (ci < data.children.length - 1 /*true*/){
                        delta = c1.r > oldr;
                        ci++;
                        cursib++;
                        
                        if (c1.r * squashX * squashY >= minRadius) {
                            if (!prevAngle)
                                prevAngle = alpha;
                                
                            got = render1 (minRadius, x0 + c1.x, y0 + c1.y, c1.r, angle + alpha - Math.PI, rec + 1, mouse, data.children[ci], ci, (cursor?cursor.children[ci]:null), selectedCursor, null, renderData, r1, gclip, zoom);
                            if (!ret && got && got.mouseIn) {
                                idx = ci;
                                alp = alpha;
                                ret = got;
                            }
                        
                            siblings[cursib] = got
                        } else {
                            //if (data.children[ci].ifr)
                            //    data.children[ci].ifr.style.visibility = "hidden";                
                            if (!delta)
                                break;
                        }

                        oldr = c1.r;
                        c1 = getNeighbor (c1, "+", x0, y0, r0, x1, y1, r1);
                        alpha = c1.alpha;
                    }
                    

                    oldr = c0.r;
                    c1 = getNeighbor (c0, "-", x0, y0, r0, x1, y1, r1);
                    alpha = c1.alpha;
                    ci = (cursor?cursor.index:0);
                    var cursib = 0;
                    while (ci >= 1 /*true*/){
                        delta = c1.r > oldr;
                        ci--;
                        cursib--;

                        if (c1.r * squashX * squashY >= minRadius) {
                            if (!nextAngle)
                                nextAngle = alpha;
                                
                            got = render1 (minRadius, x0 + c1.x, y0 + c1.y, c1.r, angle + alpha - Math.PI, rec + 1, mouse, data.children[ci], ci, (cursor?cursor.children[ci]:null), selectedCursor, null, renderData, r1, gclip, zoom);
                            if (!ret && got && got.mouseIn) {
                                idx = ci;
                                alp = alpha;
                                ret = got;
                            }
                        
                            siblings[cursib] = got
                        } else {
                            //if (data.children[ci].ifr)
                            //    data.children[ci].ifr.style.visibility = "hidden";                
                            if (!delta)
                                break;
                        }

                        oldr = c1.r;
                        c1 = getNeighbor (c1, "-", x0, y0, r0, x1, y1, r1);
                        alpha = c1.alpha;
                    }
                }
                
                var ra = r0 * circleSize;
                var xa = x0 + (r0 - ra) * Math.cos (angle - Math.PI / 2)
                var ya = y0 + (r0 - ra) * Math.sin (angle - Math.PI / 2)
                //var cond = selectedCursor? (cursor === selectedCursor) : (mouse && Math.sqrt(Math.pow(mouse.x / squashX - x0, 2) + Math.pow(mouse.y / squashY - y0, 2)) <= r0);

                var cond1 = (rec === 2)? ((selectedCursor)? (cursor === selectedCursor) : (mouse && Math.sqrt(Math.pow(mouse.x / squashX - x1, 2) + Math.pow(mouse.y / squashY - y1, 2)) <= r1)) : false;
                //var cond2 = (rec === 1)? ((selectedCursor)? (cursor === selectedCursor) : (mouse && Math.sqrt(Math.pow(mouse.x / squashX - x0, 2) + Math.pow(mouse.y / squashY - y0, 2)) <= r0)) : false;
                var cond2 = (rec === 1)? ((selectedCursor)? (cursor === selectedCursor) : (mouse && Math.sqrt(Math.pow(mouse.x / squashX - xa, 2) + Math.pow(mouse.y / squashY - ya, 2)) <= ra)) : false;
                var cond = cond1 || cond2;
                
                if (cursor) {
                    cursor.data = data;
                    cursor.minIndex = 0;
                    cursor.maxIndex = data.children.length - 1;
                    cursor.nextAngle = nextAngle;
                    cursor.prevAngle = prevAngle;
                }
                
                if (ret || cond) {
                    var pass = {
                        mouseIn: cond || ret && ret.mouseIn,
                        rec: rec,
                        data: data,
                        index: index,
                        angle: angle,
                        index1: idx,
                        angle1: alp,
                        revertAng: alp,
                        cursor: null,
                        child: ret,
                        children: siblings,
                        smallX: x0,
                        smallY: y0,
                        smallR: r0,
                        largeX: x1,
                        largeY: y1,
                        largeR: r1,
                        getMetrics: function () {
                            var c, x;
                            var a = pass.getAbsoluteAngle();
                            if (pass.parent) {
                                x = pass.parent.getMetrics ();
                                
                                var rr1 = x.r;
                                var xx1 = x.x;
                                var yy1 = x.y;
                            } else {
                                var rr1 = r1;
                                var xx1 = x1;
                                var yy1 = y1;
                            }
                            
                            var r0 = rr1 * ratio;
                            var x0 = xx1 + (rr1 - r0) * Math.cos (a - Math.PI / 2);
                            var y0 = yy1 + (rr1 - r0) * Math.sin (a - Math.PI / 2);
                            c = getCircle (pass.cursor.angle, x0, y0, r0, xx1, yy1, rr1);
                            
                            return {x: x0 + c.x, y: y0 + c.y, r: c.r};
                        },
                        getAbsoluteAngle: function () {
                            return angle;
                        },
                        getAngMin: function () {
                            var m0, m1;
                            
                            m0 = getCircle (Math.PI, x0, y0, r0, x1, y1, r1);

                            m1 = m0;
                            for (i = 0; i < pass.data.index; i++)
                                m1 = getNeighbor (m1, "+", x0, y0, r0, x1, y1, r1);
                            
                            var a = m1.alpha;//+ 3 * Math.PI / 2;
                            while (a > 2 * Math.PI) a = a - 2 * Math.PI;
                            while (a < 0) a = a + 2 * Math.PI;
                            
                            return a;
                        },
                        getAngMax: function () {
                            var m0, m1;
                            
                            m0 = getCircle (Math.PI, x0, y0, r0, x1, y1, r1);

                            m1 = m0;
                            for (i = pass.data.index; i < pass.data.parent.children.length - 1; i++)
                                m1 = getNeighbor (m1, "-", x0, y0, r0, x1, y1, r1);
                            
                            var a = m1.alpha;//+ 3 * Math.PI / 2;
                            while (a > 2 * Math.PI) a = a - 2 * Math.PI;
                            while (a < 0) a = a + 2 * Math.PI;

                            return a;
                        },
                        getCustomAngMin: function (data) {
                            var m0, m1;
                            
                            m0 = getCircle (Math.PI, x0, y0, r0, x1, y1, r1);

                            m1 = m0;
                            for (i = 0; i < data.index; i++)
                                m1 = getNeighbor (m1, "+", x0, y0, r0, x1, y1, r1);
                            
                            var a = m1.alpha;
                            while (a > 2 * Math.PI) a = a - 2 * Math.PI;
                            while (a < 0) a = a + 2 * Math.PI;
                            
                            return a;
                        },
                        getCustomAngMax: function (data) {
                            var m0, m1;
                            
                            m0 = getCircle (Math.PI, x0, y0, r0, x1, y1, r1);

                            m1 = m0;
                            for (i = data.index; i < data.parent.children.length - 1; i++)
                                m1 = getNeighbor (m1, "-", x0, y0, r0, x1, y1, r1);
                            
                            var a = m1.alpha;
                            while (a > 2 * Math.PI) a = a - 2 * Math.PI;
                            while (a < 0) a = a + 2 * Math.PI;

                            return a;
                        },
                        getCircle: function (ang) {
                            return getCircle (ang, x0, y0, r0, x1, y1, r1);
                        },
                        setAngle: (function () {
                            if (mouse) {
                                var alp1 = - angle + 3 * Math.PI / 2 + Math.atan2((y0 * squashY - mouse.y) / squashY, (x0 * squashX - mouse.x) / squashX);
                                while (alp1 > 2 * Math.PI) alp1 = alp1 - 2 * Math.PI;
                                while (alp1 < 0) alp1 = alp1 + 2 * Math.PI;
                            } else {
                                var alp1 = alp;
                            }
                            
                            var dalp = alp1 - alp;
                            
                            var c = getCircle (alp, x0, y0, r0, x1, y1, r1);
                            
                            return function (ang, percent) {
                                if (percent === undefined) percent = 1;
                                var nc = getCircle (ang, x0, y0, r0, x1, y1, r1);
                                var sang = ang - dalp * (nc.r / c.r) * percent;

                                pass.calcCursor (sang);
                                pass.revertAng = alp;
                            }
                        }) (),
                        revertAngle: function () {
                            pass.calcCursor (pass.revertAng);
                        },
                        calcCursor: function (ang) {
                            var mi, m1, m2;
                            mi = idx;
                            m2 = getCircle (ang, x0, y0, r0, x1, y1, r1);
                            
                            if (ang > Math.PI) {
                                do {
                                    m1 = m2;
                                    m2 = getNeighbor (m1, "+", x0, y0, r0, x1, y1, r1);
                                    mi++;
                                } while (m1.r < m2.r);
                                
                                pass.cursor.index = mi - 1;
                                pass.cursor.angle = m1.alpha;
                               
                            } else {
                                do {
                                    m1 = m2;
                                    m2 = getNeighbor (m1, "-", x0, y0, r0, x1, y1, r1);
                                    mi--;
                                } while (m1.r < m2.r);
                                
                                pass.cursor.index = mi + 1;
                                pass.cursor.angle = m1.alpha;
                            }
                            
                            if (pass.cursor.index < pass.cursor.minIndex) {
                                pass.cursor.index = pass.cursor.minIndex;
                                pass.cursor.angle = Math.PI;
                                pass.angle1 = pass.cursor.angle;
                            
                            } else if (pass.cursor.index > pass.cursor.maxIndex) {
                                pass.cursor.index = pass.cursor.maxIndex;
                                pass.cursor.angle = Math.PI;
                                pass.angle1 = pass.cursor.angle;
                            
                            } else {
                                pass.angle1 = ang;
                            }
                        },
                    };
                    
                    if (ret) ret.parent = pass;

                    for (var si in siblings)
                        if (siblings[si]) siblings[si].parent = pass;
                    
                    if (rec === 1) {
//                        ctx.restore ();
                    }
                    
                    return pass;
                }
            }
        }
        if (rec === 1) {
//            ctx.restore ();
        }
    };
    
    return {
        render: render
    };
}

function Orbital (divContainer, data, quant, scale, ovalFillColor, ovalBorder, backColor, shadowRadius, shadowColor, uiscale, onIdle, onBusy, ovalSpacing, orient, shiftY, cZoomedIn, cZoomedOut, cZoomingOut) {
    "use strict";
    
    function prepareData (canvasScape, parent, index) {
        if (!index) index = 0;
        var fst;
        if (!parent) {
            fst = true;
            parent = {index: 0}; 
        }
        
        var data = {
            xml: canvasScape.xml,
            nodeRawData: canvasScape.nodeRawData,
            img: canvasScape.img,
            src: canvasScape.src,
            type: canvasScape.type,
            parent: parent,
            index: index,
            scaledBitmap: null,
            children: [],
            hLock: canvasScape.hLock,
            vLock: canvasScape.vLock,
            hAlign: canvasScape.hAlign,
            vAlign: canvasScape.vAlign,
            backColor: canvasScape.backColor,
        };
        
        if (fst)
            parent.children = [data];
        
        if (canvasScape.children)
            for (var i = 0; i < canvasScape.children.length; i++)
                data.children.push (prepareData (canvasScape.children[i], data, i));
        
        return data;
    } 

    function gclip () {
        var n = ngonsides;
        ctx.beginPath ();
        ctx.moveTo(xx * squashX + (rr * squashX * zoom) * Math.cos (2 * Math.PI / n * -0.5), yy * squashY + (rr * squashY * zoom) * Math.sin (2 * Math.PI / n * -0.5));
        for (var i = 0.5; i < n + 1.5; i++){
            ctx.lineTo(xx * squashX + (rr * squashX * zoom) * Math.cos (2 * Math.PI / n * i), yy * squashY + (rr * squashY * zoom) * Math.sin (2 * Math.PI / n * i));
        }
        ctx.closePath ();
        ctx.clip ();
    }

    data = prepareData (data);
    
    var fill1 = ovalFillColor;
    var stroke1 = ovalBorder;
    var back1 = backColor;
    var orientation = orient;
    var borderSize = 0.5;
    var curvature = 1 / 8;
    
    var qang = quant * 0.0192 * Math.PI;              
    var qpan = quant * 12;// * window.devicePixelRatio;  
    var qlevel = 8 / quant;                           
    var ngonsides = 4 * Math.round (8 / quant * 0.7);
    if (ngonsides > 100) ngonsides = 100;
    
    if (!shiftY) shiftY = 0;
    
    var svgns = "http://www.w3.org/2000/svg";
    
    divContainer.innerHTML = "";

    // clip path
    var svg = document.createElementNS (svgns, "svg");
    svg.style.position = "absolute";
    svg.style.display = "block";
    svg.style.height = 0;
    divContainer.appendChild (svg);
    svg.draggable = false;
    svg.ondragstart = function () {return false};

    // main screen
    var cnv = document.createElement ("canvas");
    cnv.style.display = "block";
    divContainer.appendChild (cnv);
    cnv.draggable = false;
    cnv.ondragstart = function () {return false};
    var ctx = cnv.getContext('2d');
    //const dpr = Math.ceil(window.devicePixelRatio);
    //ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    //ctx.scale(1, 1);
    
    // event overlay
    var div = document.getElementById ("divEventOverlay");
    /*
    var div = document.createElement ("DIV");
    div.style.position = "absolute";
    div.style.backgroundColor = "rgb(255, 0, 0, 0)";
    div.style.left = "0px";
    div.style.top = "0px";
    div.style.bottom = "0px";
    div.style.right = "0px";
    div.draggable = false;
    div.ondragstart = function () {return false};
    //document.body.appendChild (div);
    //document.getElementById ("topsect").appendChild (div); // for zIndex
    divContainer.appendChild (div); // for zIndex
    */

    var onHyperlink;
    var tooltip = window.top.document.createElement("DIV");
    tooltip.id = "tooltip";
    tooltip.style.position = "absolute";
    tooltip.style.bottom = "0px";
    tooltip.style.left = "0px";
    tooltip.style.backgroundColor = "rgb(208, 208, 208)";
    tooltip.style.color = "rgb(48, 48, 48)";
    tooltip.style.visibility = "hidden";
    tooltip.style.fontFamily = "Arial, Helvetica, sans-serif";
    tooltip.style.fontSize = "1em";
    tooltip.style.padding = "0px";
    tooltip.style.display = "none";
    tooltip.innerText = "";
    document.body.appendChild(tooltip);
    
    /*
    ctx.webkitImageSmoothingEnabled = true
    ctx.msImageSmoothingEnabled     = true
    ctx.imageSmoothingEnabled       = true
    ctx.imageSmoothingQuality       = "high"
    */
    
    ctx.webkitImageSmoothingEnabled = false
    ctx.msImageSmoothingEnabled     = false
    ctx.imageSmoothingEnabled       = false
    ctx.imageSmoothingQuality       = "low"
    
    
    var superSampling = 1;


    var ratio = 1 / 1.61803398875;
    var circleSize = 1 - ovalSpacing;
    var lineWidth = 18;

    var minRadius;
    var shadowr = 0;// shadowRadius;
    var recCount = 3.75;

    var dragPrecision = Math.pow (2, 8);

    var MAX_INT32 = Math.pow (2, 31) - 1;

    function dc (x, y, r, fill) {
        ctx.beginPath ();
        ctx.ellipse (
            x * squashX,
            y * squashY,
            r * squashX,
            r * squashY,
            0,
            0,
            2 * Math.PI,
            false
        );
        ctx.closePath ();
        ctx.lineWidth = 0;
        ctx.fillStyle = fill;
        ctx.fill ();
    }

    function Polygon() {
        var pointList = [];

        this.node = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');

        function build(arg) {
            var res = [];
            for (var i = 0, l = arg.length; i < l; i++) {
                res.push(arg[i].join(','));
            }
            return res.join(' ');
        }

        this.attribute = function (key, val) {
            if (val === undefined) return this.node.getAttribute(key);
            this.node.setAttribute(key, val);
        };

        this.getPoint = function (i) {
            return pointList[i]
        };

        this.setPoint = function (i, x, y) {
            pointList[i] = [x, y];
            this.attribute('points', build(pointList));
        };

        this.points = function (arg) {
            for (var i = 0, l = arg.length; i < l; i += 2) {
                pointList.push([arg[i], arg[i + 1]]);
            }
            this.attribute('points', build(pointList));
        };

        this.points.apply(this, arguments);
    }

    function round (x, y, r1, r2, s) {
        var polygon = new Polygon (0, 0, 0, 0);

        var p = [];
        for (var i = 0.5; i < s; i++) {
            p.push (x + Math.cos (2 * Math.PI / s * i) * r1);
            p.push (y + Math.sin (2 * Math.PI / s * i) * r2);
        }
        polygon.points (p);
        polygon.attribute('style', 'fill:red');
        
        return polygon;
    }
    //////////////////////
    var clipIndex = 0;
    function drawCircle (data, angle, parentR, x, y, r, fill, stroke, cursor, renderHint, level, shadow) {
    var diff;
    if (renderHint === "1") diff = 1; else diff = 1;

    /*
    clip.setAttribute('cx', x1 * squashX);
    clip.setAttribute('cy', y1 * squashY);
    clip.setAttribute('rx', (r1) * squashX + shadowr);
    clip.setAttribute('ry', (r1) * squashY + shadowr);
    */
    if (r * squashX - diff <= 0 || r * squashY - diff <= 0) return;
    //////////////////////
        if (r * squashX > 0.5 && r * squashY > 0.5) {

            ctx.globalAlpha = 1;
            
            if (data.backColor)
                fill = data.backcolor;

            //var magn = r / (rr * ratio);
            var magn = r / rr;
            
            //var lw = lineWidth * rr / 2048 * magn * zoom;
            var lw = lineWidth * magn * uiscale * screen.height / 1080 * borderSize;
            if (ovalBorder === "false") //fill === stroke)
                lw = 0;
            
            var ra = r * circleSize;
            var xa = x + (r - ra) * Math.cos (angle - Math.PI / 2)
            var ya = y + (r - ra) * Math.sin (angle - Math.PI / 2)
            
            data.currXA = xa;
            data.currYA = ya;
            data.currRA = ra;
            data.currMagn = magn;
            //data.lineWidth = lineWidth * rr / 2048 * magn;
            data.lineWidth = lineWidth * magn * uiscale * screen.height / 1080 * borderSize;
            if (!data.parent.currXA) {
                data.parent.currXA = xx;
                data.parent.currYA = yy * ratio;
                data.parent.currRA = rr * ratio;
                data.parent.currAngleA = Math.PI / 2;
                //data.parent.lineWidth = lineWidth * rr / 2048 * magn * ratio * 2;
                data.parent.lineWidth = lineWidth * uiscale * screen.height / 1080 * borderSize;
            }

            var anglea = Math.atan2(ya - data.parent.currYA, xa - data.parent.currXA);
            data.currAnglea = anglea;

            ctx.save ();
            ctx.scale(squashX, squashY)
/*
            ctx.beginPath ();
            ctx.ellipse (
                xa,
                ya,
                ra - lw / 2,
                ra - lw / 2,
                0,
                0,
                2 * Math.PI,
                false
            );
            ctx.closePath ();
            ctx.lineWidth = lw;
            if (data.backColor)
                ctx.fillStyle = data.backColor;
            else
                ctx.fillStyle = fill;

            ctx.fill ();

            if (fill !== stroke) {
                ctx.beginPath ();
                ctx.ellipse (
                    xa,
                    ya,
                    ra - lw / 2,
                    ra - lw / 2,
                    0,
                    0,
                    2 * Math.PI,
                    false
                );
                ctx.closePath ();

                ctx.lineWidth = lw;
                ctx.strokeStyle = stroke;//fill;
                ctx.stroke ();
            }
*/
            var n = ngonsides;

            ctx.beginPath ();
            ctx.moveTo(xa + (ra - lw / 2) * Math.cos (2 * Math.PI / n * -0.5), ya + (ra - lw / 2) * Math.sin (2 * Math.PI / n * -0.5));
            for (var i = 0.5; i < n + 1.5; i++){
                ctx.lineTo(xa + (ra - lw / 2) * Math.cos (2 * Math.PI / n * i), ya + (ra - lw / 2) * Math.sin (2 * Math.PI / n * i));
            }
            ctx.lineWidth = lw;
            ctx.fillStyle = "rgb(208,208,208)"
            if (data.backColor)
                ctx.fillStyle = data.backColor;
            else
                ctx.fillStyle = fill;
                
            ctx.fill ();
            ctx.closePath ();

            if (ovalBorder !== "false") { //fill !== stroke) {
                ctx.beginPath ();
                ctx.moveTo(xa + (ra - lw / 2) * Math.cos (2 * Math.PI / n * -0.5), ya + (ra - lw / 2) * Math.sin (2 * Math.PI / n * -0.5));
                for (var i = 0.5; i < n + 1.5; i++){
                    ctx.lineTo(xa + (ra - lw / 2) * Math.cos (2 * Math.PI / n * i), ya + (ra - lw / 2) * Math.sin (2 * Math.PI / n * i));
                }
                ctx.lineWidth = lw;
                ctx.strokeStyle = "rgb(48,48,48)";
                ctx.strokeStyle = stroke;
                ctx.stroke ();
                ctx.closePath ();
            }
            
            ctx.restore ();

            // line
            //var lw = lineWidth * rr / 1024 * magn * zoom;
            var lw = lineWidth * magn * uiscale * screen.height / 1080 * borderSize;
            if (ovalBorder !== "false" && data.parent.parent) {//circleSize < 1 && level !== 1 && data.parent.parent){
                ctx.globalCompositeOperation = "source-over";
                ctx.lineWidth = lw;//lineWidth * rr / 500 * magn;
                //ctx.lineCap = "round"
                var x1 = xa + (-data.lineWidth * ratio + ra) * Math.cos (anglea - Math.PI);
                var y1 = ya + (-data.lineWidth * ratio + ra) * Math.sin (anglea - Math.PI);
                var x2 = data.parent.currXA + (-data.parent.lineWidth + data.parent.currRA) * Math.cos (anglea);
                var y2 = data.parent.currYA + (-data.parent.lineWidth + data.parent.currRA) * Math.sin (anglea);
                
                //var x1 = xa;// + (-1 + ra) * Math.cos (anglea - Math.PI);
                //var y1 = ya;// + (-1 + ra) * Math.sin (anglea - Math.PI);
                //var x2 = data.parent.currXA;// + (-1 + data.parent.currRA) * Math.cos (anglea);
                //var y2 = data.parent.currYA;// + (-1 + data.parent.currRA) * Math.sin (anglea);
                ctx.save ();
                ctx.scale(squashX, squashY)
                ctx.beginPath ();
                //ctx.moveTo(x1 * squashX, y1 * squashY);
                //ctx.lineTo(x2 * squashX, y2 * squashY);
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                //ctx.closePath ();

                //ctx.globalCompositeOperation = "destination-over";
                //if (data.backColor)
                //  ctx.strokeStyle = data.backColor;
                //else
                    ctx.strokeStyle = "rgb(48,48,48)";
                    ctx.strokeStyle = stroke//fill;

                ctx.stroke();
                ctx.restore ();

                ctx.globalCompositeOperation = "source-over";
            }

            /*
            ctx.beginPath ();
            ctx.moveTo(r * squashX * Math.cos (0), r * squashX * Math.sin (0));
            for (var i = 0.5; i < n + 1.5; i++){
                ctx.lineTo(x * squashX + r * squashX * Math.cos (2 * Math.PI / n * i), y * squashY + r * squashY * Math.sin (2 * Math.PI / n * i));
            }
            ctx.closePath ();
            ctx.lineWidth = 0;
            if (data.backColor)
                ctx.fillStyle = data.backColor;
            else
                ctx.fillStyle = fill;
            ctx.fill ();
            */

            //var lw = lineWidth * rr / 2048 * magn;
            var lw = lineWidth * magn * uiscale * screen.height / 1080 * borderSize;
            if (ovalBorder === "false")//fill === stroke)
                lw = 0;

            if (data.ifr && data.ifr.width > 0 && data.ifr.height > 0) {
                var cx, cy;
                if (cursor) {
                    if (level > 1)  alignOval (data, cursor);
                    cx = cursor.centerX;
                    cy = cursor.centerY;
                } else {
                    cx = data.centerX;
                    cy = data.centerY;
                }

                var magn = ~~(scale * r / (rr * ratio) * 100) / 100 //* window.devicePixelRatio;
                data.ifr.magn = magn;
                //data.ifr.style.willChange = "transform";
                
                //var l2 = ~~((data.ifr.width / 2 + cx));
                //var t2 = ~~((data.ifr.height / 2 + cy));
                //var tr = "scale(" + magn + ") " + (level === 1?"": "translate(" + l2 + "px, " + t2 + "px) " + "scale("+ squashX + ", " + squashY + ") " + " rotate(" + (anglea - Math.PI / 2) + "rad) " + "scale(" + 1 / squashX + ", " + 1 / squashY + ") " + "translate(" + (-l2) + "px, " + (-t2) + "px) ");

                if (data.ifr.style.transformOrigin !== "0px 0px 0px") data.ifr.style.transformOrigin = "0px 0px 0px";
//                data.ifr.style.display = "inline-table"
                var tr = "scale(" + magn.toFixed(2) + ")";
                //if (data.ifr.style.transform !== tr) data.ifr.style.transform = tr;
                
                var l = ~~((xa * squashX - magn * (data.ifr.width / 2 + cx)));
                var t = ~~((ya * squashY - magn * (data.ifr.height / 2 + cy)));

                if (data.ifr.style.left === ~~(cnv.parentNode.clientLeft + l) + "px" && data.ifr.style.top === ~~(cnv.parentNode.clientLeft + t) + "px" && data.ifr.style.transform === tr) { // it was scaling bug
                    //alert ("skip the same position");
                } else {
                    data.ifr.style.left = ~~(cnv.parentNode.clientLeft + l) + "px";
                    data.ifr.style.top = ~~(cnv.parentNode.clientTop + t) + "px";
                    data.ifr.style.willChange = "transform"; // fixing chrome bug
                    data.ifr.style.transform = tr;
                    
                    if (data.clip1) data.clip1.remove();
                    if (data.clip2) data.clip2.remove();
                    if (data.clip3) data.clip3.remove();
                    
                    // local
                    var rand1 = clipIndex++;//(Math.random() + "").substring(2);
                    var clipPath1 = document.createElementNS(svgns, 'clipPath');
                    clipPath1.setAttributeNS(null, 'id', "cl1" + rand1);
                    svg.appendChild(clipPath1);
                    var clip1 = round ((xa * squashX - l) / magn, (ya * squashY - t) / magn, (ra * squashX - 2 * magn - lw * squashX) / magn - 1 / magn, (ra * squashY - 2 * magn - lw * squashY) / magn - 1 / magn, n).node;
                    clipPath1.appendChild(clip1);
                    /*
                    // global
                    var rand2 = (Math.random() + "").substring(2);
                    var clipPath2 = document.createElementNS(svgns, 'clipPath');
                    clipPath2.setAttributeNS(null, 'id', "cl2" + rand2);
                    svg.appendChild(clipPath2);
                    var clip2 = round ((xx * squashX - l) / magn, (yy * squashY - t - Math.sin (orientation + Math.PI / 2) * rr * shiftY * squashY) / magn, (rr * squashX * zoom + shadowr) / magn, (rr * squashY * zoom + shadowr) / magn, n).node;
                    clipPath2.appendChild(clip2);

                    // global
                    var rand3 = (Math.random() + "").substring(2);
                    var clipPath3 = document.createElementNS(svgns, 'clipPath');
                    clipPath3.setAttributeNS(null, 'id', "cl3" + rand3);
                    svg.appendChild(clipPath3);
                    var newRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
                    newRect.setAttribute("x", (cnv.clientLeft - l) / magn);
                    newRect.setAttribute("y", (cnv.clientTop - t) / magn);
                    newRect.setAttribute("width", cnv.clientWidth / magn);
                    newRect.setAttribute("height", cnv.clientHeight / magn);
                    clipPath3.appendChild(newRect);
                    */
                    
                    // intersect
                    //clip2.style.clipPath = "url(#cl3" + rand3 + ")"; // commented for webkit
                    //clip1.style.clipPath = "url(#cl2" + rand2 + ")"; // commented for webkit
                    data.ifr.style.clipPath = "url(#cl1" + rand1 + ")";
                    
                    /*
                    // intersect
                    //clip2.style.clipPath = "url(#cl3" + rand3 + ")";
                    //clip1.style.clipPath = "url(#cl2" + rand2 + ")";
                    data.ifr.style.clipPath = "url(#cl1" + rand1 + ")";
                    */

                    data.clip1 = clipPath1;
                    //data.clip2 = clipPath2;
                    //data.clip3 = clipPath3;
                }

                data.ifr.style.visibility = "visible";

                //if (level === 1)
                //    data.ifr.style.pointerEvents = "auto"
                //else
                //    data.ifr.style.pointerEvents = "none"
            }
            
            renderData.push({radius: r, data: data});
        }
    }
    
    function setupSelect (range) {
        select = range;
        if (range) {
            var sc = cursor;
            select.parent = null;
            select.cursor = sc;
            while (select.child) {
                select = select.child;
                
                if (!sc.children[select.index]) {
                    sc.children[select.index] = {parent: sc, index: 0, centerX: 0, centerY: 0, angle: Math.PI, children: []};
                    //var cx = 0, cy = 0;
                    if (select.data.ifr) {
                        alignOval (select.data, sc.children[select.index])
                    }
                        
                }
                
                sc = sc.children[select.index];
                select.cursor = sc;
            }
        }
    }

    function clear (fill) {
        if (!fill) fill = fill2
        ctx.fillStyle = fill2;
        ctx.clearRect(0, 0, ww, hh);
        hideOvals(data);
    }

    function redraw (m, renderHint, selectedCursor) {
        //clear ();
        hideOvals(data);
                    
        //div.style.zIndex = 2000000;//Math.pow(2, 31);
        
        renderData = [];
        var ret = n.render (minRadius, x1, y1, r1, orientation, 1, m, data, cursor?cursor.parent.index:null, cursor, selectedCursor, renderHint, renderData, gclip, zoom);
        return ret;
    }

    function getMouse(mouseEvent)
    {
      var obj = divContainer;
      var obj_left = 0;
      var obj_top = 0;
      var xpos = 0;
      var ypos = 0;
      while (obj.offsetParent)
      {
        obj_left += obj.offsetLeft;
        obj_top += obj.offsetTop;
        obj = obj.offsetParent;
      }
      if (mouseEvent)
      {
        //FireFox
        xpos = mouseEvent.pageX;
        ypos = mouseEvent.pageY;
      xpos -= obj_left;
      ypos -= obj_top;
      }
      /*
      else
      {
        //IE
        xpos = window.event.x + document.body.scrollLeft - 2;
        ypos = window.event.y + document.body.scrollTop - 2;
      xpos -= obj_left;
      ypos -= obj_top;
      }
      */

      var cw2 = divContainer.clientWidth / 2;
      var ch2 = divContainer.clientHeight / 2;
      
      return {x: Math.floor (xpos), y: Math.floor (ypos)};
    }
    
    function setCenter (select, x, y) {
        if (select.cursor && select.cursor.data && select.cursor.data.ifr) {
            
            var o = select.cursor.data;
            var c = select.cursor;
            /*
            var minmaxW, minmaxH
            
            if (select.cursor.data.hAlign === "left")
                minmaxW = ~~Math.max (o.ifr.width / 2 + alignX, o.ifr.width / 2);
                
            else if (select.cursor.data.hAlign === "right")
                minmaxW = ~~Math.min (o.ifr.width / 2 - alignX, o.ifr.width / 2);
                
            else
                minmaxW = 0;
                
            if (select.cursor.data.vAlign === "bottom")
                minmaxH = ~~Math.max (o.ifr.height / 2 - alignY, o.ifr.height / 2);

            else if (select.cursor.data.vAlign === "middle")
                minmaxH =  0;

            else
                minmaxH = ~~Math.min (o.ifr.height / 2 + alignY, o.ifr.height / 2);
            */

            if (select.cursor.data.hLock !== "true") {
                var minmaxW = (o.ifr.width / 2);
                select.cursor.centerX = x;
                
                if (select.cursor.data.hAlign === "middle") {
                    if (select.cursor.centerX > ~~(minmaxW))
                        select.cursor.centerX = ~~(minmaxW);
                    if (select.cursor.centerX < ~~(-minmaxW))
                        select.cursor.centerX = ~~(-minmaxW);
                        
                } else {
                    
                    if (select.cursor.centerX > ~~(minmaxW - alignX))
                        select.cursor.centerX = ~~(minmaxW - alignX);
                    if (select.cursor.centerX < ~~(-minmaxW + alignX))
                        select.cursor.centerX = ~~(-minmaxW + alignX);
                    
                    /*
                    if (select.cursor.centerX > ~~Math.min ((minmaxW - alignX), o.ifr.width / 2))
                        select.cursor.centerX = ~~Math.min ((minmaxW - alignX), o.ifr.width / 2);
                    if (select.cursor.centerX < ~~Math.min ((-minmaxW + alignX), o.ifrWidth / 2))
                        select.cursor.centerX = ~~Math.min ((-minmaxW + alignX), o.ifrWidth / 2);
                    */
                }
                
                select.cursor.centerX = Math.floor (select.cursor.centerX)
            }
            
            if (select.cursor.data.vLock !== "true") {
                var minmaxH = (o.ifr.height / 2);
                select.cursor.centerY = y;
                
                if (select.cursor.data.vAlign === "middle") {
                    if (select.cursor.centerY > ~~(minmaxH))
                        select.cursor.centerY = ~~(minmaxH);
                    if (select.cursor.centerY < ~~(-minmaxH))
                        select.cursor.centerY = ~~(-minmaxH);
                } else {
                    
                    if (select.cursor.centerY > ~~(minmaxH - alignY))
                        select.cursor.centerY = ~~(minmaxH - alignY);
                    if (select.cursor.centerY < ~~(-minmaxH + alignY))
                        select.cursor.centerY = ~~(-minmaxH + alignY);
                    
                    /*
                    if (select.cursor.centerY > ~~Math.min ((minmaxH - alignY), o.ifr.height / 2))
                        select.cursor.centerY = ~~Math.min ((minmaxH - alignY), o.ifr.height / 2);
                    if (select.cursor.centerY < ~~Math.min ((-minmaxH + alignY), o.ifr.height / 2))
                        select.cursor.centerY = ~~Math.min ((-minmaxH + alignY), o.ifr.height / 2);
                    */
                }
                
                select.cursor.centerY = Math.floor (select.cursor.centerY)
            }
        }
    }
    
    var qpx1, qpy1;
    function mousemovePan(x, y) {
        if (select.mouseIn && !animating) {
            if (noPan) {
                setCenter (select, oldCenterX, oldCenterY);

            } else {
                //var r0 = r1 * ratio;
                if (zoom === 1) {
                    var r0 = r1 * ratio * circleSize;

                    var x0 = Math.floor ((x1 + Math.sin (orientation) * (r1 - r0)) * squashX);
                    var y0 = Math.floor ((y1 - Math.cos (orientation) * (r1 - r0)) * squashY);
                    
                } else {
                    var r0 = r1 * ratio * circleSize * zoom;

                    var x0 = ww / 2;
                    var y0 = hh / 2;
                }

                if (Math.ceil (Math.sqrt((x - x0) / squashX * (x - x0) / squashX + (y - y0) / squashY * (y - y0) / squashY)) < Math.floor (r0)) {
                    setCenter (select, oldCenterX + ((dragX - x0) - (x - x0)) / scale / zoom/* window.devicePixelRatio*/, oldCenterY + ((dragY - y0) - (y - y0)) / scale / zoom/* window.devicePixelRatio*/);

                } else {
                    if (select.cursor.data && select.cursor.data.ifr) {
                        alignOval (select.cursor.data, select.cursor)
                    }

                }
                
                globalt0 = (new Date()).getTime();
                window.requestAnimationFrame(function () {
                    var qpx = Math.round (select.cursor.centerX / qpan) * qpan;
                    var qpy = Math.round (select.cursor.centerY / qpan) * qpan;
                    if (qpx !== qpx1 || qpy !== qpy1) {
                        redraw ({x: mouse.x, y: mouse.y}, "1");
                        qpx1 = qpx;
                        qpy1 = qpy;
                    }
                });
            }
        }
    }
    
    function setMouseHyperlink (x, y) {
        var found = false;
        if (cursor && cursor.data.ifr) {
            if (!dragging && !panning && !animating) {
                if (zoom === 1) {
                    var r0 = r1 * ratio * circleSize;

                    var x0 = Math.floor ((x1 + Math.sin (orientation) * (r1 - r0)) * squashX);
                    var y0 = Math.floor ((y1 - Math.cos (orientation) * (r1 - r0)) * squashY);
                    
                } else {
                    var r0 = r1 * ratio * circleSize * zoom;

                    var x0 = ww / 2;
                    var y0 = hh / 2;
                }

                if (Math.ceil (Math.sqrt((x - x0) / squashX * (x - x0) / squashX + (y - y0) / squashY * (y - y0) / squashY)) < Math.floor (r0)) {
                    var hx = cursor.centerX + cursor.data.ifr.width / 2 + (x - x0) / scale / zoom;// / window.devicePixelRatio;
                    var hy = cursor.centerY + cursor.data.ifr.height / 2 + (y - y0) / scale / zoom;// / window.devicePixelRatio;

                    if (cursor.data.hyperlinks) {
                        for (var i = 0; i < cursor.data.hyperlinks.length; i++) {
                            var hl = cursor.data.hyperlinks[i];
                            if (hl.top < hy && hl.bottom > hy && hl.left < hx && hl.right > hx) {
                                found = true;
                                div.style.cursor = "pointer";
                                tooltip.style.visibility = "visible";
                                tooltip.innerText = " " + hl.href + " ";
                                tooltip.myHref = hl.href;
                                tooltip.myTarget = hl.target;
                            }
                        }
                    }
                }
            }
        }
        if (!found) {
            div.style.cursor = "";
            tooltip.style.visibility = "hidden";
            tooltip.style.zIndex = 8000000;
            tooltip.innerText = "";
        }
    }
    
    var qang2;
    function mousemove (e) {
        "use strict";
        
        if (e.pageX > 0 && e.pageY > 0 && e.pageX < window.innerWidth && e.pageY < window.innerHeight) {
            globalt0 = (new Date()).getTime();
            
            var r0 = r1 * ratio * zoom;
            
            var x0 = Math.floor ((x1 + Math.sin (orientation) * (r1 - r0)) * squashX);
            var y0 = Math.floor ((y1 - Math.cos (orientation) * (r1 - r0)) * squashY);

            mouse = getMouse (e);
            //x = (xx - xx * zoom) + x * zoom;
            //y = y * zoom;
            lastMouseEvent = e;        

            if (!panning && !dragging) {
                if (mouseDown === 1) {
                    if (3 < Math.sqrt(Math.pow(mouse.x - dragX, 2) + Math.pow(mouse.y - dragY, 2))) {
                        setupSelect(preSelect);
            
                        var angle = Math.PI;
                        var ra = r0 * circleSize;
                        var xa = x0 + (r0 - ra) * Math.cos (angle - Math.PI / 2);
                        var ya = y0 + (r0 - ra) * Math.sin (angle - Math.PI / 2);
                        /*
                        xa = (xx - xx * zoom) + xa * zoom;
                        ya = ya * zoom;
                        ra = ra * zoom;
                        */
                        //if (!animating && select && Math.sqrt((mouse.x - x0) / squashX * (mouse.x - x0) / squashX + (mouse.y - y0) / squashY * (mouse.y - y0) / squashY) < r0) {
                        if (!animating && select && Math.sqrt((mouse.x - xa) / squashX * (mouse.x - xa) / squashX + (mouse.y - ya) / squashY * (mouse.y - ya) / squashY) < ra) {
                            panning = true;
                            
                            oldCenterX = select.cursor.centerX;
                            oldCenterY = select.cursor.centerY;

                            oldPan = null;
                            
                        } else {
                            dragging = true;

                            oldAng = null;
                        }
                    }
                } else if (mouseDown === 0)
                    setMouseHyperlink (mouse.x, mouse.y);
            }

            var angMin, angMax;
            if ((dragging || panning) && select) {
                gettingLevel = select;

                var ang1;
                if (select.parent) {
                    ang1 =
                        - select.parent.angle +
                        3 * Math.PI / 2 +
                        Math.atan2 (
                            (select.parent.smallY * squashY - mouse.y) / squashY,
                            (select.parent.smallX * squashX - mouse.x) / squashX
                        );
                        
                    while (ang1 > 2 * Math.PI) ang1 = ang1 - 2 * Math.PI;
                    while (ang1 < 0) ang1 = ang1 + 2 * Math.PI;
                    
                    ang1 = Math.min (select.getAngMax (), ang1);
                    ang1 = Math.max (select.getAngMin (), ang1);
                }

                var isOnParent = select.parent;
                while (isOnParent) {
                    if (isOnParent.data.currRA - 1 > Math.sqrt (Math.pow (isOnParent.data.currXA - mouse.x / squashX, 2) + Math.pow (isOnParent.data.currYA - mouse.y / squashY, 2)))
                        break;
                        
                    isOnParent = isOnParent.parent
                }
                
                //var isOnParent = select.parent;
                //while (isOnParent) {
                //    if (isOnParent.smallR - 1 > Math.sqrt (Math.pow (isOnParent.smallX - mouse.x / squashX, 2) + Math.pow (isOnParent.smallY - mouse.y / squashY, 2)))
                //        break;
                //        
                //    isOnParent = isOnParent.parent
                //}
                
                var minR, maxR, mouseDistance;
                
                if (!isOnParent) {
                    if (select.parent) {
                        minR = 0;//select.parent.largeR;
                        maxR = Infinity;//select.parent.smallR + 2 * select.parent.getCircle(ang1).r * ratio;//select.smallR;
                        //mouseDistance = Math.sqrt (Math.pow (select.parent.smallX - mouse.x / squashX, 2) + Math.pow(select.parent.smallY - mouse.y / squashY, 2));
                        mouseDistance = Math.sqrt (Math.pow (select.parent.smallX - mouse.x / squashX, 2) + Math.pow(select.parent.smallY - mouse.y / squashY, 2));

                    } else {
                        minR = 0;
                        var ra = select.smallR * circleSize;
                        var xa = select.smallX + (select.smallR - ra) * Math.cos (orient - Math.PI / 2);
                        var ya = select.smallY + (select.smallR - ra) * Math.sin (orient - Math.PI / 2);

                        maxR = ra;
                        mouseDistance = Math.sqrt (Math.pow (xa - mouse.x / squashX, 2) + Math.pow(ya - mouse.y / squashY, 2))
    //dc (xa, ya, ra, "red");
    //dc (mouse.x / squashX, mouse.y / squashY, 20, "blue");
                    }
                }
                
                /*
                if (!isOnParent) {
                    if (select.parent) {
                        minR = select.parent.smallR;
                        maxR = select.parent.smallR + 2 * select.parent.getCircle(ang1).r * ratio;//select.smallR;
                        mouseDistance = Math.sqrt (Math.pow (select.parent.smallX - mouse.x / squashX, 2) + Math.pow(select.parent.smallY - mouse.y / squashY, 2));

                    } else {
                        minR = 0;
                        maxR = select.smallR;
                        mouseDistance = Math.sqrt (Math.pow (select.smallX - mouse.x / squashX, 2) + Math.pow(select.smallY - mouse.y / squashY, 2))
                    }
                }
                */
                
                //maxR = maxR;

                if (!animating && dragging && select.parent && !isOnParent && mouseDistance < maxR) {
                    //select.parent.setAngle (ang[1], dr);
                    var myang = 0;
                    var myangadd = 0;
                    
                    while (Math.abs (myang) < Math.abs (ang1 - Math.PI)) {
                        myangadd = qang * Math.sign(ang1 - Math.PI) * select.parent.getCircle(myang + Math.PI).r / (select.parent.largeR * (1 - ratio));
                        myang += myangadd;
                    }
                    myang -= myangadd;
                    //if (ang1 < select.getAngMin () || ang1 > select.getAngMax ())
                    //    myang += myangadd;
                    
                    var qang1 = Math.PI + myang;
                    select.parent.setAngle (qang1, 0);
                    //if (select.parent.getCircle(select.parent.angle1).r * squashX * squashY > minRadius) {
                        oldAng = newAng;
                        newAng = {angle: select.parent.angle1, rawAngle: ang1, percentRawAngle: 0, centerX: select.cursor.centerX, centerY: select.cursor.centerY, time: (new Date()).getTime()};

                        //clear ();
                        var sel = select;
                        window.requestAnimationFrame(function () {
                        //setTimeout (function () {
                            if (!panning) {
                                renderData = [];
                                if (qang1 !== qang2) {
                                    setupSelect (n.render (minRadius, x1, y1, r1, orientation, 1, mouse, data, cursor.parent.index, cursor, sel.cursor, "1+", renderData, gclip, zoom));
                                    qang2 = qang1;
                                }
                                if (!select.mouseIn)
                                    mouseup (lastMouseEvent);
                            }
                        //}, 0);
                        });
                        
                    //} else {
                    //    select.parent.revertAngle ();
                    //}
                }
                
                if (!select.mouseIn) {
                    mouseup (lastMouseEvent);
                    
                } else {
                    angMin = select.getAngMin ();
                    angMax = select.getAngMax ();
                    
                    var ip = 0;
                    var ang = [];
                    var ac = select;
                    while (ac && ip < 3) {
                        var phi =  ac.angle;
                            
                        ang[ip] =
                            - phi +
                            3 * Math.PI / 2 +
                            Math.atan2 (
                                (ac.smallY * squashY - mouse.y) / squashY,
                                (ac.smallX * squashX - mouse.x) / squashX
                            );
                                
                        while (ang[ip] > 2 * Math.PI) ang[ip] = ang[ip] - 2 * Math.PI;
                        while (ang[ip] < 0) ang[ip] = ang[ip] + 2 * Math.PI;
                        
                        ac = ac.parent;
                        ip++;
                    }

                    
                    // mouse animation during zooming
                    if (!isOnParent) {
                        if (mouseDistance > maxR) {
                            animateAng0 = ang[0];

                            if (!select.parent) {
                                animateAng0Start = Math.PI;

                            } else {
                                animateAng0Start = ang[1];

                            }
                        }
                            
                    } else {
                        if (isOnParent !== select.parent) {
                            if (select.parent.parent) {
                                animateAng2 = select.parent.parent.angle1;
                                animateAng2Start = select.parent.parent.angle1;
                            }
                            
                        } else {
                            animateAng2 = ang[2];
                            
                            if (!animating && select.parent.parent)
                                animateAng2Start = select.parent.parent.angle1;
                                
                        }

                        if (!animateAng2)
                            animateAng2 = Math.PI;
                            
                        if (!animateAng2Start)
                            animateAng2Start = Math.PI;
                    }
                    
                    var aa0 = animateAng0;

                    animateAng0 = Math.min (animateAng0, angMax);
                    animateAng0 = Math.max (animateAng0, angMin);
                    animateAng2 = Math.min (animateAng2, angMax);
                    animateAng2 = Math.max (animateAng2, angMin);

                    if (zoom === 1 && !animating) {
                        
                        var topc = select;
                        while (topc.parent)
                            topc = topc.parent;

                        var i, t0, tmpi;
                        
                    
                        if (isOnParent) {
                            levelDown (animateAng2Start, animateAng2);
                            /*
                            //alert ("level down");
                            if (level !== gettingLevel) {
                                t0 = (new Date()).getTime();
                                i = 0;
                                tmpi = 0;
                                
                                var angles = [];
                                var cc = select.parent.cursor;
                                var cp = select.parent;
                                do {
                                    var angle = cp.angle1;
                                    angle = Math.min (cp.getCustomAngMax (cp.data), angle);
                                    angle = Math.max (cp.getCustomAngMin (cp.data), angle);
                                    angles.push ([cp.angle1, angle]);
                                    cc.index = cp.index1;
                                    cc = cc.parent;
                                    cp = cp.parent;
                                } while (cp);
                                
                                function aEnlarge () {
                                    if (angles[1]) 
                                        angles[1] = [angles[1][0] * (1 - i) + angles[1][1] * (i), animateAng2Start * (1 - i) + animateAng2 * i];
                                        
                                    else
                                        angles[1] = [Math.PI, animateAng2Start * (1 - i) + animateAng2 * i];
                                        
                                    curAnimateAng2 = angles[1]
                                    cc = select.parent.cursor;
                                    cp = select.parent;
                                    var ap = 0;
                                    while (cp.parent) {
                                        cc.angle = (angles[ap][0] * (1 - i) + angles[ap][1] * (i)) * (1 - i) + (angles[ap + 1][0] * (1 - i) + angles[ap + 1][1] * (i)) * (i);
                                        cc = cc.parent;
                                        cp = cp.parent;
                                        ap++
                                    };
                                    cc.angle = (angles[ap][0] * (1 - i) + angles[ap][1] * (i)) * (1 - i) + Math.PI * i;
                                    var m = topc.getCircle (topc.cursor.angle);
                                    
                                    var x0 = topc.smallX + m.x;
                                    var y0 = topc.smallY + m.y;
                                    var r0 = m.r;
                                    
                                    var ang = Math.atan2(y0 - y1, x0 - x1);
                                    var mang = Math.atan2(y1 - y0, x1 - x0);
                                    
                                    var xo = x1 + r1 * Math.cos(ang);
                                    var yo = y1 + r1 * Math.sin(ang);
                                    
                                    var r2 = r1 * r1 / r0;
                                    var x2 = xo + r2 * Math.cos(mang);
                                    var y2 = yo + r2 * Math.sin(mang);

                                    var i1 = Math.round (i * qlevel) / qlevel;
                                    if (i1 > 1) i1 = 1;
                                    
                                    var x = x1 + (x2 - x1) * i1;
                                    var y = y1 + (y2 - y1) * i1;
                                    var r = r1 + (r2 - r1) * i1;
                                    
                                    levelrr = r;

                                    renderData = [];
                                    if (tmpi !== i1 || i === 1)
                                        var atCur = n.render (minRadius, x, y, r, orientation, 1, null, cursor.data, topc.index, cursor, select.cursor, "0", renderData);

                                    tmpi = i1;

                                    if (i < 1) {
                                        var t1 = (new Date()).getTime();
                                        i += (t1 - t0) / 384;
                                        if (t1 - t0 === 0) i += 1 / 384;
                                        if (i > 1) i = 1;
                                        t0 = t1;
                                        
                                        window.requestAnimationFrame(aEnlarge)
                                    } else {
                                        level = gettingLevel;
                                        oldAng = null;

                                        if (!cursor.children[cursor.index]) {
                                            cursor.children[cursor.index] = {parent: cursor, centerX: 0, centerY: 0, index: 0, angle: Math.PI, children: []};
                                            if (topc.child.data.ifr) {
                                                alignOval (topc.child.data, cursor.children[cursor.index])
                                            }
                                                
                                        }
                                            
                                        cursor = cursor.children[cursor.index];

                                        path.push (data);
                                        data = topc.child.data;
                                        
                                        panning = false;
                                        animating = false;

                                        if (atCur) {
                                            if (dragging) {
                                                setupSelect (atCur.child)
                                                setupSelect (redraw (null, "1+", select.cursor));
                                                mousemove (lastMouseEvent);
                                            } else {
                                                redraw ({x: mouse.x, y: mouse.y}, "1");
                                                mouseup (lastMouseEvent);
                                            }
                                            //drawCircle (select.smallX,  select.smallY, select.smallR, "green", "white", "yxz");

                                        } else {
                                            redraw ({x: mouse.x, y: mouse.y}, "1");
                                            mouseup (lastMouseEvent);
                                        }
                                        
                                        if (!dragging)
                                            idle ();
                                    }
                                }
                                
                                animating = "level";
                                window.requestAnimationFrame (aEnlarge);
                            }    
                            */
                        } else if (mouseDistance > maxR + 1) {
                            levelUp (animateAng0Start, animateAng0, aa0);
                            /*
                            //alert ("level up");
                            if (path.length > 0) {
                                if (level !== gettingLevel) {
                                    i = 0;
                                    t0 = (new Date()).getTime();
                                    tmpi = 0;
    // reset children position                                
    select.cursor.children = [];
    select.cursor.index = 0;
    select.cursor.angle = Math.PI;
    // end reset
                                    var angles = [];
                                    var cc = select.cursor.parent;
                                    var cp = select.parent;
                                    while (cp) {
                                        var angle = cp.angle1;
                                        angle = Math.min (cp.getCustomAngMax (cp.data), angle);
                                        angle = Math.max (cp.getCustomAngMin (cp.data), angle);
                                        angles.push ([cp.angle1, angle]);
                                        cc.index = cp.index1;
                                        cc = cc.parent;
                                        cp = cp.parent;
                                    }
                                    angles.push ([Math.PI, Math.PI]);
                                    
                                    function aEnsmall () {
                                        cc = select.cursor.parent;
                                        cp = select.parent;
                                        var ap = 0;
                                        
                                        var lastAngle = Math.PI;
                                        while (ap < angles.length) {
                                            if (ap > 0) {
                                                cc.angle = (angles[ap][0] * (1 - i) + angles[ap][1] * (i)) * (1 - i) + (angles[ap - 1][0] * (1 - i) + angles[ap - 1][1] * (i)) * (i);
                                            } else {
                                                cc.angle = (angles[ap][0] * (1 - i) + angles[ap][1] * (i)) * (1 - i) + (animateAng0Start * (1 - i) + animateAng0 * i) * (i);
                                            }
                                            lastAngle = cc.angle;
                                            cc = cc.parent;
                                            ap++
                                        };

                                        var m = topc.getCircle (lastAngle);
                                        
                                        var x0 = topc.smallX + m.x;
                                        var y0 = topc.smallY + m.y;
                                        var r0 = m.r;

                                        var ang = Math.atan2(y0 - y1, x0 - x1);
                                        var mang = Math.atan2(y1 - y0, x1 - x0);
                                        
                                        var xo = x1 + r1 * Math.cos(ang);
                                        var yo = y1 + r1 * Math.sin(ang);
                                        
                                        var r2 = r1 * r1 / r0;
                                        var x2 = xo + r2 * Math.cos(mang);
                                        var y2 = yo + r2 * Math.sin(mang);

                                        var i1 = Math.round (i * qlevel) / qlevel;
                                        if (i1 > 1) i1 = 1;

                                        var x = x1 + (x2 - x1) * (1 - i1);
                                        var y = y1 + (y2 - y1) * (1 - i1);
                                        var r = r1 + (r2 - r1) * (1 - i1);

                                        levelrr = r;

                                        renderData = [];
                                        if (tmpi !== i1 || i === 1)
                                            var atCur = n.render (minRadius, x, y, r, orientation, 1, null, cursor.parent.data, cursor.parent.parent.index, cursor.parent, select.cursor, "0", renderData);

                                        tmpi = i1;

                                        if (i < 1) {
                                            var t1 = (new Date()).getTime();
                                            i += (t1 - t0) / 384;
                                            if (t1 - t0 === 0) i += 1 / 384;
                                            if (i > 1) i = 1
                                            t0 = t1;
                                            
                                            window.requestAnimationFrame(aEnsmall);
                                        } else {
                                            level = gettingLevel;

                                            oldAng = null;

                                            cursor = cursor.parent;
                                            data = path.pop();
                                            
                                            animating = false;
                                            
                                            if (atCur) {
                                                if (dragging) {
                                                    setupSelect (atCur);
                                                    setupSelect (redraw (null, "1+", select.cursor));
                                                    mousemove (lastMouseEvent);
                                                } else {
                                                    redraw ({x: mouse.x, y: mouse.y}, "1");
                                                    mouseup (lastMouseEvent);
                                                }
                                                //drawCircle (select.smallX,  select.smallY, select.smallR, "green", "white", "yxz");


                                            } else {
                                                redraw ({x: mouse.x, y: mouse.y}, "1");
                                                mouseup (lastMouseEvent);
                                            }                                            
                                            
                                            if (!dragging)
                                                idle ();
                                        }
                                    }
                                    
                                    if (aa0 < 3 * Math.PI / 2 && aa0 > Math.PI / 2) {
                                        panning = false;
                                        animating = "level";
                                        if (cursor.data.ifr) {
                                            alignOval (cursor.data, cursor)
                                        }

                                        window.requestAnimationFrame (aEnsmall);
                                    }
                                }
                            }
                            */
                        }
                    }                    
                }
            }        
            if (!animating && panning) {
                mousemovePan(mouse.x, mouse.y);
                oldPan = newPan;
                newPan = {centerX: cursor.centerX, centerY: cursor.centerY, time: (new Date()).getTime()};
            }

            /*
            setTimeout(function () {
                if (!mouseDown && !animating && !dragging && !panning)
                    redraw ({x: mouse.x, y: mouse.y});
                    
            }, 0);
            */
        }
    }

    function mousedown (e) {
        if (animating !== "level" && animating !== "zoom") {
            mouse = getMouse (e);
                    
            globalt0 = (new Date()).getTime();

            if (e.which === 1) {
                preSelect = redraw ({x: mouse.x, y: mouse.y, button: e.which});
                
                if (animating) {
                    animating = false;
                }

                mouseDown = 1;
                
                dragX = mouse.x;
                dragY = mouse.y;
                
                oldCenterX = cursor.centerX;
                oldCenterY = cursor.centerY;

                var r0 = r1 * ratio;
                var x0 = Math.floor (x1 * squashX);
                var y0 = Math.floor ((y1 - (r1 - r0)) * squashY);
                
                var angle = Math.PI;
                var ra = r0 * circleSize;
                var xa = x0 + (r0 - ra) * Math.cos (angle - Math.PI / 2)
                var ya = y0 + (r0 - ra) * Math.sin (angle - Math.PI / 2)
                //if (!noPan && Math.sqrt ((dragX - x0) / squashX * (dragX - x0) / squashX + (dragY - y0) / squashY * (dragY - y0) / squashY) >= r0) {
                if (!noPan && Math.sqrt ((dragX - xa) / squashX * (dragX - xa) / squashX + (dragY - ya) / squashY * (dragY - ya) / squashY) >= ra) {
                    if (panning) {
                        panning = false;
                    }
                }
                
                setMouseHyperlink (mouse.x, mouse.y);
                onHyperlink = tooltip.innerText;
                
                if (preSelect && preSelect.mouseIn) {
                    div.style.cursor = "grabbing";
                    busy ();
                }
            }
        }
    }

    function mouseup (e) {
        mouse = getMouse (e);
        mouseDown = 0;

        if (animating === "level") dragging = false;

        if (!animating && !dragging && !panning && onHyperlink !== "" && onHyperlink === tooltip.innerText) {
            window.open(tooltip.myHref, tooltip.myTarget); 
        }

        if (!animating) {
            if (dragging && oldAng) {
                dragging = false;
                var avgt = newAng.time - oldAng.time;
                var avgAng = newAng.angle - oldAng.angle
                if (select.mouseIn && avgt < 250) {
                    var c = select.parent;
                    var ang0 = oldAng.angle;
                    var c1 = c.getCircle(ang0).r;
                    var dang0 = oldAng.angle - oldAng.rawAngle;
                    var t0 = globalt0;
                    var i = 1;
                    var di = 1;
                    var tmpa0 = 0;
                    function aInert () {
                        if (animating === true) {
                            var dt = (new Date()).getTime() - t0;
                            t0 = (new Date()).getTime();
                            if (dt === 0) dt = 1;

                            di = di - dt / 384;
                            var sindi = Math.pow(di, 2);
                            if (di > 0){
                                ang0 += avgAng * sindi * (c.getCircle(ang0).r / c1);
                                var a0 = ang0 - dang0;
                                a0 = Math.max (a0, select.getAngMin());
                                a0 = Math.min (a0, select.getAngMax());

                                var myang = 0;
                                var myangadd = 0;
                                while (Math.abs (myang) < Math.abs (a0 - Math.PI)) {
                                    myangadd = qang * Math.sign(a0 - Math.PI) * select.parent.getCircle(myang + Math.PI).r / (select.parent.largeR * (1 - ratio));
                                    myang += myangadd;
                                }
                                myang -= myangadd;
                                //if (a0 < select.getAngMin () || a0 > select.getAngMax ())
                                //    myang += myangadd;
                                
                                var qang1 = Math.PI + myang;
                                if (tmpa0 !== qang1) {
                                    tmpa0 = qang1;
                                    c.setAngle (qang1, 0);
                                    redraw (null, "1+", (select)?select.cursor:null);
                                }

                                window.requestAnimationFrame(aInert);
                                
                            } else {
                                animating = false;
                                redraw ({x: mouse.x, y: mouse.y});
                                
                                idle ();
                            }
                        } else if (mouseDown === 1) {
                            animating = false;
                            preSelect = redraw ({x: mouse.x, y: mouse.y});

                            //idle ();
                        }
                    }

                    animating = true;
                    window.requestAnimationFrame(aInert);
                }
            
                if (!animating) {
                    dragging = false;
                    redraw ({x: mouse.x, y: mouse.y});
                    
                    idle ();
                }

            } else if (!noPan && panning && oldPan) {
                var r0 = r1 * ratio;

                var x0 = Math.floor ((x1 + Math.sin (orientation) * (r1 - r0)) * squashX);
                var y0 = Math.floor ((y1 - Math.cos (orientation) * (r1 - r0)) * squashY);

                if (Math.ceil (Math.sqrt((mouse.x - x0) / squashX * (mouse.x - x0) / squashX + (mouse.y - y0) / squashY * (mouse.y - y0) / squashY)) < Math.floor (r0)) {
                    if ((new Date()).getTime() - newPan.time < 250) {
                        pan (newPan.centerX - oldPan.centerX, newPan.centerY - oldPan.centerY, newPan.time - oldPan.time);
                    }
                }
                    
                if (!animating){
                    panning = false;
                    redraw ({x: mouse.x, y: mouse.y});
                    
                    idle ();
                }
                
            } else {
                dragging = false;
                panning = false;
                if (!animating) {
                    redraw ({x: mouse.x, y: mouse.y});
                    
                    idle ();
                }
            }
        }
        
        setMouseHyperlink (mouse.x, mouse.y);
    }
    
    function setDimensions(width, height) {
        ww = width;
        hh = height;
        /*
        if (ww > hh / ratio) {
            squashX = 1 / ratio;
            squashY = 1;
            rr = hh / 2 - shadowr;
            ferr = rr * uiscale;
            
        } else if (hh > ww / ratio){
            squashX = 1;
            squashY = 1 / ratio;
            rr = ww / 2 - shadowr;
            ferr = rr * uiscale;
        */
        if (ww > hh / ratio) {
            squashX = 1 / ratio;
            squashY = 1;
            rr = (hh / 2 - shadowr);
            ferr = rr * uiscale;
            
        } else if (hh > ww / ratio){
            squashX = 1;
            squashY = 1 / ratio;
            rr = (hh / 2 - shadowr) * ratio;
            ferr = rr * uiscale;
        } else {
            if (ww > hh) {
                squashX = 1 / ratio;
                squashY = (hh - shadowr * 2) / (ww - shadowr * 2) / ratio;
                rr = (ww / 2 - shadowr) * ratio;
                ferr = rr * squashY * uiscale;
            } else {
                squashX = (ww - shadowr * 2) / (hh - shadowr * 2) / ratio;
                squashY = 1 / ratio;
                rr = (hh / 2 - shadowr) * ratio;
                ferr = rr * squashX * uiscale;
            }
        }
        
        rr = rr * uiscale;
        
        x1 = Math.cos(orient + Math.PI / 2) * rr * shiftY + (ww) / squashX / 2;
        y1 = Math.sin(orient + Math.PI / 2) * rr * shiftY + (hh) / squashY / 2 /* + rr * (uiscale - 1) / 4*/; // touch it and you're doomed
        
        //rr = rr * uiscale;
        r1 = rr;

        xx = x1;
        yy = y1;
        
        
    }

    function resize(width, height) {
        setDimensions (width, height);
        svg.style.width = width + "px";
        svg.style.height = height + "px";
        alignX = squashX * rr * circleSize * 1 / 2.4 / scale;// / window.devicePixelRatio;
        alignY = squashY * rr * circleSize * 1 / 2.4 / scale;// / window.devicePixelRatio;
    
        n = fractalOvals (ctx, ratio, xx, yy, ww, hh, rr, squashX, squashY, drawCircle, fill1, stroke1, back1, shadowRadius, shadowColor, circleSize, ngonsides, shiftY, uiscale);
        
        //minRadius = rr * squashX * squashY * Math.pow((1 - ratio), recCount) * ratio * window.devicePixelRatio;
        minRadius = Math.floor(rr / ratio * Math.pow ((1 - ratio), recCount)) + 1;

        const dpr = Math.ceil(window.devicePixelRatio);
        cnv.width = Math.ceil (ww * dpr);
        cnv.height = Math.ceil (hh * dpr);
        cnv.style.width = Math.ceil (ww) + "px";
        cnv.style.height = Math.ceil (hh) + "px";
        //cnv.setAttribute ("width", Math.ceil (ww));
        //cnv.setAttribute ("height", Math.ceil (hh));
        cnv.getContext('2d').setTransform(dpr, 0, 0, dpr, 0, 0);
        
        if (clip) clipPath.removeChild(clip);
        //var magn1 = r1 / (rr * ratio);
        var magn1 = r1 / rr;
        //var lw = shiftY > 0? 2 * lineWidth * rr / 2048 * uiscale: 1;
        var lw = shiftY > 0? lineWidth * uiscale * screen.height / 1080: 1;
        clip = round (xx * squashX, yy * squashY - Math.sin (orientation + Math.PI / 2) * rr * shiftY * squashY, (rr + lw) * squashX, (rr + lw) * squashY, ngonsides).node;
        clipPath.appendChild(clip);

        /*
        -----
        clip.setAttribute('cx', ww/2);
        clip.setAttribute('cy', hh/2);
        clip.setAttribute('rx', (getMagnMax () * rr * ratio * circleSize) * squashX);
        clip.setAttribute('ry', (getMagnMax () * rr * ratio * circleSize) * squashY);
        clip.setAttribute('stroke-width',  1);
        */
        //cnv.style.clipPath = "url(#clip128)"; // not for safari - wrap it inside div        
        divContainer.style.clipPath = "url(#clip128)";
        
        function updateCursor (c) {
            if (c) {
                if (c.data && c.data.ifr) {
                    alignOval (c.data, c)
                }
                                
                for (var i = 0; i < c.children.length; i++)
                    updateCursor (c.children[i]);
                    
            }
        }
        
        function updateData (d) {
            if (d.ifr) {
                alignOval (d, d)
                //d.ifr.remove();
                //d.ifr = null;
                
            }
                            
            for (var i = 0; i < d.children.length; i++)
                updateData (d.children[i]);
        }
        
        var c = cursor;
        while (c && c.parent)
            c = c.parent;
            
        updateCursor (c);

        var d = data;
        while (d.parent)
            d = d.parent;

        updateData (d);

        rescale (magn);
        redraw ();
        idle ();
    }
    
    function alignOval (o, c) {
        if (o.ifr) {
            if (o.hAlign === "left")
                //c.centerX = ~~Math.min (/*center*/ -o.ifr.width / 2 + alignX, o.ifr.width / 2);
                c.centerX = ~~(/*center*/ -o.ifr.width / 2 + alignX);
                
            else if (o.hAlign === "right")
                //c.centerX = ~~Math.min (/*center*/ +o.ifr.width / 2 - alignX, o.ifr.width / 2);
                c.centerX = ~~(/*center*/ +o.ifr.width / 2 - alignX);
                
            else
                c.centerX = 0;
                
            if (o.vAlign === "bottom")
                //c.centerY = ~~Math.min (/*center*/ +o.ifr.height / 2 - alignY, o.ifr.height / 2);
                c.centerY = ~~(/*center*/ +o.ifr.height / 2 - alignY);

            else if (o.vAlign === "middle")
                c.centerY =  0;

            else
                //c.centerY = ~~Math.min (/*center*/ -o.ifr.height / 2 + alignY, o.ifr.height / 2);
                c.centerY = ~~(/*center*/ -o.ifr.height / 2 + alignY);
                
        } else {
            c.centerX = 0;
            c.centerY = 0;
        }
    }
    
    function rescale (m) {
        magn = m;
        zoom = m;
        /*
        if (m === 1) {
            document.body.style.transform = "";

        } else {
             document.body.style.transform = "scale(" + magn + ") translateY(" + transformY() + "px)";
        }
        */
    }
    
    function busy () {
        if (onBusy)
            onBusy ();
    }
    
    function idle () {
        if (onIdle)
            onIdle (renderData);
    }
    
    function zoomIn () {
        if (!animating) {
            busy ();
            
            var i, t0, tmpi;
        
            t0 = (new Date()).getTime();
            i = 0;
            tmpi = 0;
            
            var magnmax = getMagnMax ();
            
            function aZoomIn () {
                var i1 = Math.round (i * qlevel) / qlevel;
                if (i1 > 1) i1 = 1;
                
                //var magn = 1 + (magnmax - 1) * (Math.sin (i1 * Math.PI - Math.PI / 2) + 1) / 2; // * i1
                var magn = 1 + (magnmax - 1) * (Math.cos ((1 - i1) * Math.PI / 2)); // * i1
                magn = Math.round (magn * 100) / 100;

                if (tmpi !== i1 || i === 1) {
                    rescale (magn);
                    redraw ();
                }

                tmpi = i1;

                if (i < 1) {
                    var t1 = (new Date()).getTime();
                    i += (t1 - t0) / 384;
                    if (t1 - t0 === 0) i += 1 / 384;
                    if (i > 1) i = 1;
                    t0 = t1;
                    
                    window.requestAnimationFrame(aZoomIn)
                } else {
                    if (cZoomedIn)
                        cZoomedIn ();
                        
                    idle ();

                    setTimeout (() => {
                        animating = false;
                        setMouseHyperlink (mouse.x, mouse.y);
                    }, 0);
                }
            }
            
            div.style.cursor = "";
            tooltip.style.visibility = "hidden";
            tooltip.innerText = "";
            animating = "zoom";
            window.requestAnimationFrame(aZoomIn)
        }
    }

    function zoomOut () {
        if (!animating) {
            if (cZoomingOut)
                cZoomingOut ();

            busy ();

            var i, t0, tmpi;
        
            t0 = (new Date()).getTime();
            i = 0;
            tmpi = 0;
            
            var magnmax = getMagnMax ();
            
            function aZoomOut () {
                var i1 = Math.round (i * qlevel) / qlevel;
                if (i1 > 1) i1 = 1;
                
                //var magn = 1 + (magnmax - 1) * (Math.sin ((1 - i1) * Math.PI - Math.PI / 2) + 1) / 2;// * (1 - i1);
                var magn = 1 + (magnmax - 1) * (1 - (Math.cos ((1 - i1) * Math.PI / 2)));// * (1 - i1);
                magn = Math.round (magn * 100) / 100;

                if (tmpi !== i1 || i === 1) {
                    rescale (magn);
                    redraw ();
                }

                tmpi = i1;

                if (i < 1) {
                    var t1 = (new Date()).getTime();
                    i += (t1 - t0) / 384;
                    if (t1 - t0 === 0) i += 1 / 384;
                    if (i > 1) i = 1;
                    t0 = t1;
                    
                    window.requestAnimationFrame(aZoomOut)
                } else {
                    if (cZoomedOut)
                        cZoomedOut ();
                        
                    idle ();

                    setTimeout (() => {
                        animating = false;
                        setMouseHyperlink (mouse.x, mouse.y);
                    }, 0);
                }
            }
            
            div.style.cursor = "";
            tooltip.style.visibility = "hidden";
            tooltip.innerText = "";
            animating = "zoom";
            window.requestAnimationFrame(aZoomOut)
        }
    }

    function levelUp (animateAng0Start, animateAng0, aa0) {
        if (!animating) {
            if (!animateAng0Start) animateAng0Start= Math.PI;
            if (!animateAng0) animateAng0 = Math.PI;
            if (!aa0) aa0 = Math.PI;
            
            if (!(dragging || panning)) {
                setupSelect (redraw (null, null, cursor));
                //gettingLevel = select.parent;
            }
            

            var topc = select;
            while (topc.parent)
                topc = topc.parent;

            var i, t0, tmpi;
            //alert ("level up");
            if (!(path.length > 0)) {
                alignOval (cursor.data, cursor);
                setupSelect (redraw (null, null, cursor));
                idle ();
                
            } else {
                if (true || level !== gettingLevel) {
                    i = 0;
                    t0 = (new Date()).getTime();
                    tmpi = 0;
    // reset children position                                
    select.cursor.children = [];
    select.cursor.index = 0;
    select.cursor.angle = Math.PI;
    // end reset
                    var angles = [];
                    var cc = select.cursor.parent;
                    var cp = select.parent;
                    while (cp) {
                        var angle = cp.angle1;
                        angle = Math.min (cp.getCustomAngMax (cp.data), angle);
                        angle = Math.max (cp.getCustomAngMin (cp.data), angle);
                        angles.push ([cp.angle1, angle]);
                        cc.index = cp.index1;
                        cc = cc.parent;
                        cp = cp.parent;
                    }
                    angles.push ([Math.PI, Math.PI]);
                    
                    function aEnsmall () {
                        cc = select.cursor.parent;
                        cp = select.parent;
                        var ap = 0;
                        
                        var lastAngle = Math.PI;
                        while (ap < angles.length) {
                            if (ap > 0) {
                                cc.angle = (angles[ap][0] * (1 - i) + angles[ap][1] * (i)) * (1 - i) + (angles[ap - 1][0] * (1 - i) + angles[ap - 1][1] * (i)) * (i);
                            } else {
                                cc.angle = (angles[ap][0] * (1 - i) + angles[ap][1] * (i)) * (1 - i) + (animateAng0Start * (1 - i) + animateAng0 * i) * (i);
                            }
                            lastAngle = cc.angle;
                            cc = cc.parent;
                            ap++
                        };

                        var m = topc.getCircle (lastAngle);
                        
                        var x0 = topc.smallX + m.x;
                        var y0 = topc.smallY + m.y;
                        var r0 = m.r;

                        var ang = Math.atan2(y0 - y1, x0 - x1);
                        var mang = Math.atan2(y1 - y0, x1 - x0);
                        
                        var xo = x1 + r1 * Math.cos(ang);
                        var yo = y1 + r1 * Math.sin(ang);
                        
                        var r2 = r1 * r1 / r0 * zoom;
                        var x2 = xo + r2 * Math.cos(mang);
                        var y2 = yo + r2 * Math.sin(mang);

                        var i1 = Math.round (i * qlevel) / qlevel;
                        if (i1 > 1) i1 = 1;

                        var x = x1 + (x2 - x1) * (1 - (Math.cos ((1 - i1) * Math.PI / 2)));// * (1 - i1);
                        var y = y1 + (y2 - y1) * (1 - (Math.cos ((1 - i1) * Math.PI / 2)));// * (1 - i1);
                        var r = r1 + (r2 - r1) * (1 - (Math.cos ((1 - i1) * Math.PI / 2)));// * (1 - i1);

                        levelrr = r;

                        renderData = [];
                        if (tmpi !== i1 || i === 1)
                            var atCur = n.render (minRadius, x, y, r, orientation, 1, null, cursor.parent.data, cursor.parent.parent.index, cursor.parent, select.cursor, "0", renderData, gclip, zoom);

                        tmpi = i1;

                        if (i < 1) {
                            var t1 = (new Date()).getTime();
                            i += (t1 - t0) / 384;
                            if (t1 - t0 === 0) i += 1 / 384;
                            if (i > 1) i = 1
                            t0 = t1;
                            
                            window.requestAnimationFrame(aEnsmall);
                        } else {
                            //level = gettingLevel;

                            oldAng = null;

                            cursor = cursor.parent;
                            data = path.pop();
                            
                            animating = false;
                            
                            if (atCur) {
                                if (dragging) {
                                    setupSelect (atCur);
                                    setupSelect (redraw (null, "1+", select.cursor));
                                    mousemove (lastMouseEvent);
                                } else {
                                    redraw ({x: mouse.x, y: mouse.y}, "1");
                                    mouseup (lastMouseEvent);
                                }
                                //drawCircle (select.smallX,  select.smallY, select.smallR, "green", "white", "yxz");

                            } else {
                                redraw ({x: mouse.x, y: mouse.y}, "1");
                                mouseup (lastMouseEvent);
                            }                                            
                            
                            if (!dragging)
                                idle ();
                        }
                    }
                    
                    if (aa0 < 3 * Math.PI / 2 && aa0 > Math.PI / 2) {
                        panning = false;
                        animating = "level";
                        if (cursor.data.ifr) {
                            alignOval (cursor.data, cursor);
                        }

                        window.requestAnimationFrame (aEnsmall);
                    }
                }
            }
        }
    }
    
    function levelDown (animateAng2Start, animateAng2) {
        if (!animating) {
            if (!animateAng2Start) animateAng2Start= Math.PI;
            if (!animateAng2) animateAng2 = Math.PI;

            if (!(dragging || panning)) {
                if (!cursor.children[cursor.index]) {
                    cursor.children[cursor.index] = {parent: cursor, index: 0, centerX: 0, centerY: 0, angle: Math.PI, children: []};
                }

                setupSelect (redraw (null, null, cursor.children[cursor.index]));
                gettingLevel = select;
            }
            
            if (!select) {
                idle ();
                
            } else {
                var topc = select;
                while (topc.parent)
                    topc = topc.parent;

                var i, t0, tmpi;
                //alert ("level down");
                if (level !== gettingLevel) {
                    //select = noSelect;
                    t0 = (new Date()).getTime();
                    i = 0;
                    tmpi = 0;
                    
                    var angles = [];
                    var cc = select.parent.cursor;
                    var cp = select.parent;
                    do {
                        var angle = cp.angle1;
                        angle = Math.min (cp.getCustomAngMax (cp.data), angle);
                        angle = Math.max (cp.getCustomAngMin (cp.data), angle);
                        angles.push ([cp.angle1, angle]);
                        cc.index = cp.index1;
                        cc = cc.parent;
                        cp = cp.parent;
                    } while (cp);
                    
                    function aEnlarge () {
                        if (angles[1]) 
                            angles[1] = [angles[1][0] * (1 - i) + angles[1][1] * (i), animateAng2Start * (1 - i) + animateAng2 * i];
                            
                        else
                            angles[1] = [Math.PI, animateAng2Start * (1 - i) + animateAng2 * i];
                            
                        //curAnimateAng2 = angles[1]
                        cc = select.parent.cursor;
                        cp = select.parent;
                        var ap = 0;
                        while (cp.parent) {
                            cc.angle = (angles[ap][0] * (1 - i) + angles[ap][1] * (i)) * (1 - i) + (angles[ap + 1][0] * (1 - i) + angles[ap + 1][1] * (i)) * (i);
                            cc = cc.parent;
                            cp = cp.parent;
                            ap++
                        };
                        cc.angle = (angles[ap][0] * (1 - i) + angles[ap][1] * (i)) * (1 - i) + Math.PI * i;
                        var m = topc.getCircle (topc.cursor.angle);
                        
                        var x0 = topc.smallX + m.x;
                        var y0 = topc.smallY + m.y;
                        var r0 = m.r;
                        
                        var ang = Math.atan2(y0 - y1, x0 - x1);
                        var mang = Math.atan2(y1 - y0, x1 - x0);
                        
                        var xo = x1 + r1 * Math.cos(ang);
                        var yo = y1 + r1 * Math.sin(ang);

                        var r2 = r1 * r1 / r0 * zoom;
                        var x2 = xo + r2 * Math.cos(mang);
                        var y2 = yo + r2 * Math.sin(mang);

                        var i1 = Math.round (i * qlevel) / qlevel;
                        if (i1 > 1) i1 = 1;
                        
                        var x = x1 + (x2 - x1) * (Math.cos ((1 - i1) * Math.PI / 2)); // * i1;
                        var y = y1 + (y2 - y1) * (Math.cos ((1 - i1) * Math.PI / 2)); // * i1;
                        var r = r1 + (r2 - r1) * (Math.cos ((1 - i1) * Math.PI / 2)); // * i1;
                        
                        levelrr = r;

                        renderData = [];
                        if (tmpi !== i1 || i === 1)
                            var atCur = n.render (minRadius, x, y, r, orientation, 1, null, cursor.data, topc.index, cursor, select.cursor, "0", renderData, gclip, zoom);

                        tmpi = i1;

                        if (i < 1) {
                            var t1 = (new Date()).getTime();
                            i += (t1 - t0) / 384;
                            if (t1 - t0 === 0) i += 1 / 384;
                            if (i > 1) i = 1;
                            t0 = t1;
                            
                            window.requestAnimationFrame(aEnlarge)
                        } else {
                            level = gettingLevel;
                            oldAng = null;

                            if (!cursor.children[cursor.index]) {
                                cursor.children[cursor.index] = {parent: cursor, centerX: 0, centerY: 0, index: 0, angle: Math.PI, children: []};
                                if (topc.child.data.ifr) {
                                    alignOval (topc.child.data, cursor.children[cursor.index])
                                }
                                    
                            }
                                
                            cursor = cursor.children[cursor.index];

                            path.push (data);
                            data = topc.child.data;
                            
                            panning = false;
                            animating = false;

                            if (atCur) {
                                if (dragging) {
                                    setupSelect (atCur.child)
                                    setupSelect (redraw (null, "1+", select.cursor));
                                    mousemove (lastMouseEvent);
                                } else {
                                    redraw ({x: mouse.x, y: mouse.y}, "1");
                                    mouseup (lastMouseEvent);
                                }
                                //drawCircle (select.smallX,  select.smallY, select.smallR, "green", "white", "yxz");

                            } else {
                                redraw ({x: mouse.x, y: mouse.y}, "1");
                                mouseup (lastMouseEvent);
                            }
                            
                            if (!dragging)
                                idle ();
                        }
                    }
                    
                    animating = "level";
                    window.requestAnimationFrame (aEnlarge);
                }    
            }
        }
    }
    
    function clockwise () {
        if (!animating) {
            busy ();

            var startAng
            if (cursor.angle - Math.PI < 0.05)
                if (cursor.index > 0) {
                    cursor.index--;
                    startAng = cursor.nextAngle;
                } else {
                    startAng = cursor.angle;
                }
                
            else
                startAng = cursor.angle;
                
            var endAng = Math.PI;
            var i = 0;
            var tmpi;
            var t0 = (new Date()).getTime();
            function aCw () {
                var i1 = Math.round (i * qlevel) / qlevel;
                if (i1 > 1) i1 = 1;
                
                var i0 = (Math.cos ((1 - i1) * Math.PI / 2));
                var ang = startAng * (1 - i0) + endAng * i0;
                ang = Math.round (ang * 100) / 100;

                if (tmpi !== i1 || i === 1) {
                    cursor.angle = ang;
                    redraw();
                }

                tmpi = i1;

                if (i < 1) {
                    var t1 = (new Date()).getTime();
                    i += (t1 - t0) / 384;
                    if (t1 - t0 === 0) i += 1 / 384;
                    if (i > 1) i = 1;
                    t0 = t1;
                    
                    window.requestAnimationFrame(aCw)
                } else {
                    idle ();
                    animating = false;
                }
            }
            
            div.style.cursor = "";
            tooltip.style.visibility = "hidden";
            tooltip.innerText = "";
            animating = "cw";
            window.requestAnimationFrame(aCw)
        }
    }
    
    function counterClockwise () {
        if (!animating) {
            busy ();
            
            var startAng
            if (cursor.angle - Math.PI > -0.05)
                if (cursor.index < cursor.maxIndex) {
                    cursor.index++;
                    startAng = cursor.prevAngle;
                } else {
                    startAng = cursor.angle;
                }
                
            else
                startAng = cursor.angle;
                
            var endAng = Math.PI;
            var i = 0;
            var tmpi;
            var t0 = (new Date()).getTime();
            function aCcw () {
                var i1 = Math.round (i * qlevel) / qlevel;
                if (i1 > 1) i1 = 1;
                
                var i0 = (Math.cos ((1 - i1) * Math.PI / 2));
                var ang = startAng * (1 - i0) + endAng * i0;
                ang = Math.round (ang * 100) / 100;

                if (tmpi !== i1 || i === 1) {
                    cursor.angle = ang;
                    redraw();
                }

                tmpi = i1;

                if (i < 1) {
                    var t1 = (new Date()).getTime();
                    i += (t1 - t0) / 384;
                    if (t1 - t0 === 0) i += 1 / 384;
                    if (i > 1) i = 1;
                    t0 = t1;
                    
                    window.requestAnimationFrame(aCcw)
                } else {
                    idle ();
                    animating = false;
                }
            }
            
            div.style.cursor = "";
            tooltip.style.visibility = "hidden";
            tooltip.innerText = "";
            animating = "ccw";
            window.requestAnimationFrame(aCcw)
        }
    }
    
    function pan (avgX, avgY, avgt) {
        /*
        var avgX = newPan.centerX - oldPan.centerX;
        var avgY = newPan.centerY - oldPan.centerY;
        var avgt = newPan.time - oldPan.time;
        */
        globalPan++;
        if (globalPan > 1000000)
            globalPan = 0;
            
        var curPan = globalPan;
        if (avgt < 250) {
            setupSelect (redraw (null, null, cursor));                
            var globalSel = select;

            globalt0 = (new Date()).getTime();
            var t0 = globalt0;
            var di = 1;
            function dInert () {
                if (animating === true) {
                    var dt = (new Date()).getTime() - t0;
                    t0 = (new Date()).getTime();
                    if (dt === 0) dt = 1;

                    di = di - dt / 384;
                    var sindi = Math.pow(di, 2) * zoom * 2;
                    if (di > 0 && globalPan === curPan){
                        var oldx = cursor.centerX;
                        var oldy = cursor.centerY;
                        var px = Math.round (cursor.centerX / qpan) * qpan;
                        var py = Math.round (cursor.centerY / qpan) * qpan;
                        setCenter (globalSel, cursor.centerX + avgX * sindi, cursor.centerY + avgY * sindi);
                        if (oldx != cursor.centerX || oldy != cursor.centerY) {
                            if (px !== globalSel.px || py !== globalSel.py) {
                                redraw (null, "1", globalSel.cursor);
                                globalSel.px = px;
                                globalSel.py = py;
                            }
                                
                            window.requestAnimationFrame(dInert);
                            
                        } else {
                            panning = false;
                            animating = false;
                            redraw ({x: mouse.x, y: mouse.y});
                            if (div.style.cursor !== "grabbing")
                                setMouseHyperlink (mouse.x, mouse.y);
                                
                            idle ();
                        }

                    } else {
                        if (globalPan === curPan) {
                            panning = false;
                            animating = false;
                            redraw ({x: mouse.x, y: mouse.y});
                            if (div.style.cursor !== "grabbing")
                                setMouseHyperlink (mouse.x, mouse.y);

                            idle ();
                        }
                    }
                } else if (mouseDown === 1) {
                    var r0 = r1 * ratio;
                    var x0 = Math.floor (x1 * squashX);
                    var y0 = Math.floor ((y1 - (r1 - r0)) * squashY);
                    
                    if (!(Math.sqrt((dragX - x0) / squashX * (dragX - x0) / squashX + (dragY - y0) / squashY * (dragY - y0) / squashY) < r0)) {
                        panning = false;
                        animating = false;
                        cursor.cachedCnv = false;
                        preSelect = redraw ({x: mouse.x, y: mouse.y});
                        
                        idle ();
                    }
                    if (div.style.cursor !== "grabbing")
                        setMouseHyperlink (mouse.x, mouse.y);
                }
            }
            animating = true;
            window.requestAnimationFrame(dInert);
        }
    }
    
    var receiveMouseEvents = true;
    var magn = 1, zoom = 1;
    var oldAng, newAng, oldPan, newPan;
    var renderData;
    var mouse = {};
    var tt, ll, ww, hh, rr, ferr, xx, yy, w0, h0, squashX, squashY;
    var r1, x1, y1;
    var alignX, alignY
    var path = [], cursor, select, preSelect, noSelect, animating, panning;

    cursor = {parent: null, index: 0, data: data, centerX: 0, centerY: 0, angle: Math.PI, children: []}
    cursor.parent = {index: 0, children: [cursor]};

    var level, levelrr, gettingLevel, animateAng0, animateAng0Start, animateAng2, animateAng2Start, curAnimateAng2;
    var lastMouseEvent, globalt0, globalSel, globalPan = 0;
    var lastRedraw;

    var mouseDown = 0;
    var dragX, dragY, dragging = false, oldCenterX, oldCenterY;
    
    var device = "mouse";

    var n = fractalOvals (ctx, ratio, xx, yy, ww, hh, rr, squashX, squashY, drawCircle, fill1, stroke1, back1, shadowRadius, shadowColor, circleSize, ngonsides, shiftY, uiscale);
    var movingNode = null;

    var clipPath = document.createElementNS(svgns, 'clipPath');
    clipPath.setAttributeNS(null, 'id', 'clip128');
    svg.appendChild(clipPath);
    var clip;

    //var clip = document.createElementNS(svgns, 'ellipse');
    //clipPath.appendChild(clip);   
    
    var noPan;
    
    function transformY () {
        var ret = Math.floor ((hh / 2 - shadowr) * (1 - 1 / magn));
        if (orient !== 0) {
            ret = - ret;
        }
        
        return ret;
    }

    function setupMouseEvents () {
        window.addEventListener('mousemove', function (evt) {
            if (receiveMouseEvents) {
                device = "mouse";
                if (evt.detail.W !== undefined) {
                    evt.pageX = evt.detail.X;
                    evt.pageY = evt.detail.Y;
                    evt.which = evt.detail.W;
                    noPan = true;
                } else {
                    noPan = false;
                }
                mousemove (evt)
            }
        }, false);

        window.addEventListener('mousedown',  function (evt) {
            if (receiveMouseEvents) {
                device = "mouse";
                if (evt.detail.W !== undefined) {
                    evt.pageX = evt.detail.X / zoom;
                    evt.pageY = evt.detail.Y / zoom;
                    evt.which = evt.detail.W;
                    noPan = true;
                } else {
                    noPan = false;
                }
                mousedown (evt)
            }
        }, false);

        window.addEventListener('mouseup',  function (evt) {
            if (receiveMouseEvents) {
                device = "mouse";
                if (evt.detail.W !== undefined) {
                    evt.pageX = evt.detail.X;
                    evt.pageY = evt.detail.Y;
                    evt.which = evt.detail.W;
                    noPan = true;
                } else {
                    noPan = false;
                }
                mouseup (evt)
            }
        }, false);

        /*
        function getIfrMouse(e) {
            return {
                pageX: e.detail.evt.pageX * e.detail.ifr.magn + e.detail.ifr.offsetLeft,
                pageY: e.detail.evt.pageY * e.detail.ifr.magn + e.detail.ifr.offsetTop,
                which: e.detail.evt.which
            };
        }
        
        divContainer.addEventListener('mmove', function (e) {
            mousemove (getIfrMouse(e));
        });
        
        divContainer.addEventListener('mdown', function (e) {
            mousedown (getIfrMouse(e));
        });
        
        divContainer.addEventListener('mup', function (e) {
            mouseup (getIfrMouse(e));
        });
        */
    }

    function setupTouchEvents () {
        var ongoingTouches = [];
 
        function copyTouch(touch) {
          return {identifier: touch.identifier, pageX: touch.pageX, pageY: touch.pageY, which: 1};
        }

        function ongoingTouchIndexById(idToFind) {
          for (var i = 0; i < ongoingTouches.length; i++) {
            var id = ongoingTouches[i].identifier;
            
            if (id == idToFind) {
              return i;
            }
          }
          return -1;    // not found
        }

        window.addEventListener("touchstart", function (evt) {
            if (receiveMouseEvents) {
                device = "touch";

                if (evt.detail.CT !== undefined) {
                    var touches = evt.detail.CT;
                    noPan = true;
                    
                } else {
                    var touches = evt.changedTouches;
                    noPan = false;
                }
                
                for (var i = 0; i < touches.length; i++) {
                    ongoingTouches.push(copyTouch(touches[i]));
                    var idx = ongoingTouchIndexById(touches[i].identifier);
                    
                    if (idx >= 0) {
                        mousedown (ongoingTouches[idx]);
                    }
                }
            }

            evt.preventDefault ();
        }, false);
        
        var scaleD0 = 0;
        var curMagn = 1;
        window.addEventListener("touchmove", function (evt) {
            if (receiveMouseEvents) {
                device = "touch";

                if (evt.detail.CT !== undefined) {
                    var touches = evt.detail.CT;
                    noPan = true;
                    
                } else {
                    var touches = evt.changedTouches;
                    noPan = false;
                }
                
                for (var i = 0; i < touches.length; i++) {
                    var idx = ongoingTouchIndexById(touches[i].identifier);

                    if (idx >= 0) {
                        ongoingTouches[idx].pageX = touches[i].pageX;
                        ongoingTouches[idx].pageY = touches[i].pageY;
                    }
                }

                var tchs = ongoingTouches;

                if (tchs.length === 1) {
                    mousemove (ongoingTouches[idx]);
                
                } else if (tchs.length === 2) {
                    if (scaleD0 === 0) {
                        var tx = tchs[0].pageX - tchs[1].pageX;
                        var ty = tchs[0].pageY - tchs[1].pageY;
                        scaleD0 = Math.sqrt(tx * tx + ty * ty);

                    } else {
                        var tx = tchs[0].pageX - tchs[1].pageX;
                        var ty = tchs[0].pageY - tchs[1].pageY;
                        var scaleD1 = Math.sqrt(tx * tx + ty * ty);

                        var dy = scaleD1 - scaleD0;

                        if (magn === 1 && dy * Math.sign (Math.sin(orient + Math.PI / 2)) > 0) {
                            zoomIn ();
                            
                        } else if (magn !== 1 && dy * Math.sign (Math.sin(orient + Math.PI / 2)) < 0) {
                            zoomOut ();
                        }
                    }
                }
            }

            evt.preventDefault ();
        }, false);

        window.addEventListener("touchcancel", function (evt) {
            if (receiveMouseEvents) {
                device = "touch";

                if (evt.detail.CT !== undefined) {
                    var touches = evt.detail.CT;
                    noPan = true;
                    
                } else {
                    var touches = evt.changedTouches;
                    noPan = false;
                }

                for (var i = 0; i < touches.length; i++) {
                    var idx = ongoingTouchIndexById(touches[i].identifier);

                    if (idx >= 0) {
                        ongoingTouches[idx].pageX = touches[i].pageX;
                        ongoingTouches[idx].pageY = touches[i].pageY;

                        mouseup (ongoingTouches[idx]);

                        ongoingTouches.splice(idx, 1);
                    }
                }

                scaleD0 = 0;
                curMagn = magn;
            }
        }, false);

        window.addEventListener("touchend", function (evt) {
            device = "touch";

            if (evt.detail.CT !== undefined) {
                var touches = evt.detail.CT;
                noPan = true;
                
            } else {
                var touches = evt.changedTouches;
                noPan = false;
            }

            for (var i = 0; i < touches.length; i++) {
                var idx = ongoingTouchIndexById(touches[i].identifier);

                if (idx >= 0) {
                    ongoingTouches[idx].pageX = touches[i].pageX;
                    ongoingTouches[idx].pageY = touches[i].pageY;
                    
                    mouseup (ongoingTouches[idx]);

                    ongoingTouches.splice(idx, 1);
                }
            }

            scaleD0 = 0;
            curMagn = magn;

            evt.preventDefault ();
        }, false);
    }

    function setupWheelEvent () {
        window.addEventListener('wheel', function (evt) {
            if (evt.detail.DY !== undefined) {
                evt.deltaY = evt.detail.DY;
                noPan = true;
            } else {
                noPan = false;
            }
            
            if (evt.buttons === 0 && magn !== 1 && evt.deltaY * Math.sign (Math.sin(orient + Math.PI / 2))> 0) {
                zoomOut ();
                
            } else if (evt.buttons === 0 && magn === 1 && evt.deltaY * Math.sign (Math.sin(orient + Math.PI / 2))< 0) {
                zoomIn ();
            }

        }, { passive: false });
    }
    
    function getMagnMax () {
        var ma = rr * ratio * circleSize * squashY
        var mb = rr * shiftY * squashY;
        var mc = hh * (uiscale - 1) / 2;
        return hh / (2 * ma - 2 * (mc - mb));
    }

    setupMouseEvents ();
    setupTouchEvents ();
    setupWheelEvent ();

    /*    
    divContainer.addEventListener('zoomIn', function (e) {
        zoomIn ();
    });
    */

    var initDone = false;
    divContainer.addEventListener('resize1', function (e) {
        resize (divContainer.clientWidth, divContainer.clientHeight);
        if (!initDone) {
            idle();
            initDone = true;
        }
    });
    
    divContainer.addEventListener('redraw1', function (e) {
        redraw ();
        idle ();
    });

    divContainer.addEventListener('redraw', function (e) {
        if (!animating && !dragging && !panning) {
            redraw ();
        }
    });

    divContainer.addEventListener('updateOvalAlign', function (e) {
        alignOval(e.detail, e.detail);
        if (cursor.data === e.detail) {
            alignOval(e.detail, cursor);
        }
    });

    divContainer.addEventListener('redefineData', function (e) {
        data = prepareData (e.detail);
        cursor = {parent: null, index: 0, data: data, centerX: 0, centerY: 0, angle: Math.PI, children: []}
        cursor.parent = {index: 0, children: [cursor]};
        path = [];
        resize (divContainer.clientWidth, divContainer.clientHeight);
        setupSelect (redraw (null, null, cursor));
    });

    divContainer.addEventListener('redefineCursor', function (e) {
        function setCursorAndPath (c1, c2, idx) {
            while (data.parent)
                data = data.parent;
            
            data = data.children[0];

            var topc1 = c1;
            while (topc1.parent)
                topc1 = topc1.parent;
            
            topc1 = topc1.children[0];
            
            var topc2 = c2;
            while (topc2.parent)
                topc2 = topc2.parent;
            
            topc2 = topc2.children[0];
            
            if (topc2) {
                var parent = {index: 0, children: []};
                //cursor = {parent: parent, index: topc2.index, data: data, centerX: 0, centerY: 0, angle: topc2.angle, children: []};
                //parent.children = [cursor];
                //parent = cursor;
                for (var i = 0; i <= idx; i++) {
                    var olddata = data;
                    if (topc2) {
                        if (!data.children[topc2.index])
                            topc2.index = 0;
                            
                        cursor = {parent: parent, index: topc2.index, data: data, centerX: topc1?topc1.centerX: 0, centerY: topc1?topc1.centerY: 0, angle: topc2.angle, prevAngle: topc2.prevAngle, nextAngle: topc2.nextAngle, children: []};
                        if (!topc1)
                            alignOval (data, cursor)
                    
                    } else
                        break;//cursor = {parent: parent, index: 0, data: data, centerX: 0, centerY: 0, angle: Math.PI, children: []};
                        
                    parent.children[parent.index] = cursor;
                    parent = cursor;

                    if (i === idx)
                        break;
                    
                    else {
                        path.push (data);
                        if (topc2) {
                            data = data.children[topc2.index];
                            topc2 = topc2.children[topc2.index];
         
                        } else {
                            break;//data = data.children[0];
                        }
                        if (topc1) {
                            topc1 = topc1.children[topc1.index];
                        }
                    }
                }
            }
        }
    
        path = [];
        setCursorAndPath (cursor, e.detail.cursor, e.detail.pathLength);
        if (e.detail.magn) rescale (e.detail.magn);
        redraw ();
        idle ();
        //resize (divContainer.clientWidth, divContainer.clientHeight);
    });
    
    return {
        getCnv: function () {
            return cnv;
        },
        getData: function () {
            return data;
        },
        setData: function (d) {
            data = d;
        },
        getCursor: function () {
            return cursor;
        },
        getPathLength: function () {
            return path.length;
        },
        getRadius: function () {
            return rr;
        },
        zoomIn: function () {
            zoomIn ();
        },
        zoomOut: function () {
            zoomOut ();
        },
        levelUp: function () {
            busy ();
            levelUp ();
        },
        levelDown: function () {
            busy ();
            levelDown ();
        },
        rotClockwise: function () {
            clockwise ();
        },
        rotCounterClockwise: function () {
            counterClockwise ();
        },
        slideUp: function () {
            if (orientation === Math.PI)
                pan (0, rr / 800 * 20 * squashY, 50);
            else
                pan (0, rr / 800 * -20 * squashY, 50);
        },
        slideDown: function () {
            if (orientation === Math.PI)
                pan (0, rr / 800 * -20 * squashY, 50);
            else
                pan (0, rr / 800 * 20 * squashY, 50);
        },
        slideLeft: function () {
            if (orientation === Math.PI)
                pan (rr / 800 * 20 * squashX, 0, 50);
            else
                pan (rr / 800 * -20 * squashX, 0, 50);
        },
        slideRight: function () {
            if (orientation === Math.PI)
                pan (rr / 800 * -20 * squashX, 0, 50);
            else
                pan (rr / 800 * 20 * squashX, 0, 50);
        },
        setMagn: function (magn) {
            rescale (magn);
        },
        getMagn: function () {
            return magn;
        },
        getMagnMax: function () {
            return getMagnMax ();
        },
        setMouseOn: function () {
            receiveMouseEvents = true;
        },
        setMouseOff: function () {
            receiveMouseEvents = false;
        },
        getOvalWidth: function () {
            return 2 * rr * squashX * ratio;
        },
        redraw: redraw,
        mousedown: mousedown,
        mouseup: mouseup
    }
}
