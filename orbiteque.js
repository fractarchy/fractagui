// orbiteque UI

function orbital (svgContainer, data) {
    "use strict";

    var svgns = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS (svgns, "svg");
    svg.style.display = "block";
    svg.style.height = 0;
    svgContainer.appendChild (svg);
    svg.draggable = false;
    svg.ondragstart = function () {return false};

    var cnv = document.createElement ("canvas");
    cnv.style.display = "block";
    svgContainer.appendChild (cnv);
    cnv.draggable = false;
    cnv.ondragstart = function () {return false};
    var ctx = cnv.getContext('2d');
    //ctx.imageSmoothingEnabled = false;

    var ratio = 1 / 1.61803398875; //0.7;//575;
    //var minRadius = Length.toPx(svg, "1mm");

    var minRadius;
    var recCount = 4;

    var pixelPrecision = 1 / Math.pow (2, 16);
    var dragPrecision = Math.pow (2, 8);
    var fill1 = "rgb(255, 255, 150)";//"lightgray";
    var stroke1 = "gray";
    var fill2 = stroke1;
    var stroke2 = fill1;

    function drawCircle (x, y, r, fill, stroke, text) {
        if (r * squashX > 0.5 && r * squashY > 0.5) {
            ctx.beginPath();
            
            ctx.ellipse (
                x * squashX,
                y * squashY,
                r * squashX - 0.5,
                r * squashY - 0.5,
                0,
                0,
                2 * Math.PI,
                false
            );

            ctx.lineWidth = 0;

            ctx.fillStyle = fill;
            ctx.fill ();
            
            //ctx.strokeStyle = stroke;
            //ctx.stroke ();
            
            if (r > 5) {
                var correct
                if (squashY < 1)
                    correct = squashY;
                else
                    correct = 1;
                    
                ctx.font = "" + (r * correct).toString() + "px Monospace";
                ctx.fillStyle = stroke;
                ctx.fillText(text, x * squashX - ctx.measureText(text).width / 2, y * squashY + r * correct / 2.5);
            }
            
        }
    }

    function node() {
        var render = function (minRadius, x1, y1, r1, angle, rec, mouse, data, index, cursor) {
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
                } while (dr > pixelPrecision);

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
                
                var da = Math.acos ((2 * r1 - pixelPrecision) / (2 * r1));
                do {
                    var c2 = getCircle (alpha, x0, y0, r0, x1, y1, r1);
                    dalpha /= 2;
                    var d = Math.sqrt (Math.pow ((c1.x - c2.x), 2) + Math.pow ((c1.y - c2.y), 2));
                    if ((c1.r + c2.r) >= d) {
                        alpha -= dalpha;
                    } else {
                        alpha += dalpha;
                    }
                } while (Math.abs(dalpha) > da);

                return c2;
            }
            
            var i;
            
            var r0 = r1 * ratio;
            var x0 = x1 + (r1 - r0) * Math.cos (angle - Math.PI / 2);
            var y0 = y1 + (r1 - r0) * Math.sin (angle - Math.PI / 2);
            
            if (
                Math.sqrt ((x1 - xx) * (x1 - xx) + (y1 - yy) * (y1 - yy)) < r1 + rr
            ) {
                if ((r1 * squashY * squashX) >= minRadius) {
                    var colorFill = fill1;
                    
                    if (mouse && (Math.sqrt(Math.pow(mouse.x / squashX - x0, 2) + Math.pow(mouse.y / squashY - y0, 2)) <= r0)) {
                        colorFill = "white";
                    } else {
                        colorFill = fill1;
                    }
                    
                    drawCircle(x0, y0, r0, colorFill, stroke1, (index).toString());
                    
                    var ret, idx, alp;
                    var got;
                    var c0, c1;
                    var alpha = (cursor?cursor.angle:Math.PI);
                    var ci;
                    var oldr, delta;
        
                    c0 = getCircle (alpha, x0, y0, r0, x1, y1, r1);
                    ci = (cursor?cursor.index:0);
                    if (c0.r * squashX * squashY >= minRadius) {
                        got = render (minRadius, x0 + c0.x, y0 + c0.y, c0.r, angle + alpha - Math.PI, rec + 1, mouse, null/*data.children[ci]*/, ci, (cursor?cursor.children[ci]:null));
                        if (got) {
                            idx = ci;
                            alp = alpha;
                            ret = got;
                        }
                    }
                    
                    oldr = c0.r;
                    c1 = getNeighbor (c0, "+", x0, y0, r0, x1, y1, r1);
                    alpha = c1.alpha;
                    ci = (cursor?cursor.index:0);
                    while (true){
                        delta = c1.r > oldr;
                        ci++;
                        
                        if (c1.r * squashX * squashY >= minRadius) {
                            got = render (minRadius, x0 + c1.x, y0 + c1.y, c1.r, angle + alpha - Math.PI, rec + 1, mouse, null/*data.children[ci]*/, ci, (cursor?cursor.children[ci]:null));
                            if (!ret && got) {
                                idx = ci;
                                alp = alpha;
                                ret = got;
                            }
                        } else
                            if (!delta)
                                break;
                        
                        oldr = c1.r;
                        c1 = getNeighbor (c1, "+", x0, y0, r0, x1, y1, r1);
                        alpha = c1.alpha;
                    }
                    

                    oldr = c0.r;
                    c1 = getNeighbor (c0, "-", x0, y0, r0, x1, y1, r1);
                    alpha = c1.alpha;
                    ci = (cursor?cursor.index:0);
                    while (true){
                        delta = c1.r > oldr;
                        ci--;

                        if (c1.r * squashX * squashY >= minRadius) {
                            got = render (minRadius, x0 + c1.x, y0 + c1.y, c1.r, angle + alpha - Math.PI, rec + 1, mouse, null/*data.children[ci]*/, ci, (cursor?cursor.children[ci]:null));
                            if (!ret && got) {
                                idx = ci;
                                alp = alpha;
                                ret = got;
                            }
                        } else
                            if (!delta)
                                break;
                        
                        oldr = c1.r;
                        c1 = getNeighbor (c1, "-", x0, y0, r0, x1, y1, r1);
                        alpha = c1.alpha;
                    }
                    
                    if (ret || (mouse && cursor && mouse === cursor) || (mouse && Math.sqrt(Math.pow(mouse.x / squashX - x0, 2) + Math.pow(mouse.y / squashY - y0, 2)) <= r0)) {
                        var pass = {
                            data: data,
                            index: index,
                            angle: angle,
                            index1: idx,
                            angle1: alp,
                            revertAng: alp,
                            cursor: null,
                            child: ret,
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
                                var phi = 0;
                                var c = pass.parent;
                                if (c) {
                                    while (c) {
                                        phi += c.angle + c.angle1 - Math.PI;
                                        c = c.parent;
                                    }
                                }
                                
                                while (phi > 2 * Math.PI) phi = phi - 2 * Math.PI;
                                while (phi < 0) phi = phi + 2 * Math.PI;
                                
                                return phi;
                            },
                            getAngMin: function () {
                                var m0, m1;
                                
                                m0 = getCircle (Math.PI, x0, y0, r0, x1, y1, r1);

                                m1 = m0;
                                for (i = 0; i < data.index; i++)
                                    m1 = getNeighbor (m1, "+", x0, y0, r0, x1, y1, r1);
                                
                                return m1.alpha;
                            },
                            getAngMax: function () {
                                var m0, m1;
                                
                                m0 = getCircle (Math.PI, x0, y0, r0, x1, y1, r1);

                                m1 = m0;
                                for (i = data.index; i < data.children.length - 1; i++)
                                    m1 = getNeighbor (m1, "-", x0, y0, r0, x1, y1, r1);
                                
                                return m1.alpha;
                            },
                            getCircle: function (ang) {
                                return getCircle (ang, x0, y0, r0, x1, y1, r1);
                            },
                            setAngle: (function () {                                
                                var alp1 = - angle + 3 * Math.PI / 2 + Math.atan2((y0 * squashY - mouse.y) / squashY, (x0 * squashX - mouse.x) / squashX);
                                while (alp1 > 2 * Math.PI) alp1 = alp1 - 2 * Math.PI;
                                while (alp1 < 0) alp1 = alp1 + 2 * Math.PI;
                                
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
                                pass.calcCursor (revertAng);
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
                                    } while (m1.r <= m2.r);
                                    
                                    pass.cursor.index = mi - 1;
                                    pass.cursor.angle = m1.alpha;
                                   
                                } else {
                                    do {
                                        m1 = m2;
                                        m2 = getNeighbor (m1, "-", x0, y0, r0, x1, y1, r1);
                                        mi--;
                                    } while (m1.r <= m2.r);
                                    
                                    pass.cursor.index = mi + 1;
                                    pass.cursor.angle = m1.alpha;
                                }
                                pass.angle1 = ang;
                            }
                        };
                        
                        if (ret) ret.parent = pass;
                        
                        return pass;
                    }
                }
            }
        };
        
        return {
            render: render
        };
    }
    
    function wasteCircles () {
    }
    
    function clear () {
        ctx.fillStyle = fill2;
        ctx.fillRect(0, 0, ww, hh);
    }

    function redraw (m) {
        clear ();
        return n.render (minRadius, x1, y1, r1, 0, 1, m, data, cursor.parent.index, cursor);
    }
    
    function setDimensions(width, height) {
        ww = width;
        hh = height;
        
        if (ww > hh / ratio) {
            rr = hh / 2;
            squashX = 1 / ratio;
            squashY = 1;
            
        } else {
            rr = ww / 2;
            squashX = 1;
            squashY = ratio;
            
        }

        r1 = rr;
        x1 = ww / squashX / 2;
        y1 = hh / squashY / 2;
        
        xx = x1;
        yy = y1;
        
        
    }

    function resize(width, height) {
        setDimensions (width, height);
        minRadius = rr * squashX * squashY * Math.pow((1 - ratio), recCount) * ratio;

        clip.setAttribute('cx', x1 * squashX);
        clip.setAttribute('cy', y1 * squashY);
        clip.setAttribute('rx', r1 * squashX);
        clip.setAttribute('ry', r1 * squashY);
        clip.setAttribute('stroke-width',  1);

        cnv.setAttribute ("width", ww);
        cnv.setAttribute ("height", hh);
        cnv.style.clipPath = "url(#clip128)";

        redraw (null);
    }
    
    function getMouse(mouseEvent)
    {
      var obj = svgContainer;
      var obj_left = 0;
      var obj_top = 0;
      var xpos;
      var ypos;
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
      }
      else
      {
        //IE
        xpos = window.event.x + document.body.scrollLeft - 2;
        ypos = window.event.y + document.body.scrollTop - 2;
      }
      
      xpos -= obj_left;
      ypos -= obj_top;
      
      return {x: xpos, y: ypos};
    }

    function mousemove (e) {
        "use strict";
        
        var original_c;
        mouse = getMouse (e);
        

        if (animating === "level" && dragging) {
            var c = select;
            var cpr1
            
            if (c.smallR < Math.sqrt ((c.smallX - mouse.x / squashX) * (c.smallX - mouse.x / squashX) + (c.smallY - mouse.y / squashY) * (c.smallY - mouse.y / squashY))) {
                var ac, phi;
                if (select.parent) {
                    ac = select.parent;
                    phi = ac.getAbsoluteAngle() + ac.angle1 + Math.PI;
                    var tmpc = ac.getCircle(ac.angle1);
                    
                    if (tmpc.r * squashX * squashY > minRadius) {
                        var tmpr0 = tmpc.r * ratio;
                        var tmpx0 = tmpc.x + (tmpc.r - tmpr0) * Math.cos (phi - Math.PI / 2);
                        var tmpy0 = tmpc.y + (tmpc.r - tmpr0) * Math.sin (phi - Math.PI / 2);
                        
                        var ang =
                            - phi + 
                            3 * Math.PI / 2 +
                            Math.atan2 (
                                ((ac.smallY + tmpy0) * squashY - mouse.y) / squashY,
                                ((ac.smallX + tmpx0) * squashX - mouse.x) / squashX
                            );
                            
                        //drawCircle (ac.smallX + tmpx0, ac.smallY + tmpy0, tmpr0, "red", "blue", "yxz"); 

                        while (ang > 2 * Math.PI) ang = ang - 2 * Math.PI;
                        while (ang < 0) ang = ang + 2 * Math.PI;
                        
                        animateAng = ang;
                    }
                    
                    if (select.parent.parent) {
                        animateAng1 = select.parent.parent.angle1;
                        cpr1 = select.parent;
                        while (cpr1) {
                            if (cpr1.smallR > Math.sqrt ((cpr1.smallX - mouse.x / squashX) * (cpr1.smallX - mouse.x / squashX) + (cpr1.smallY - mouse.y / squashY) * (cpr1.smallY - mouse.y / squashY)))
                                break;
                                
                            cpr1 = cpr1.parent
                        }
                        
                        if (!cpr1) {
                            ac = select.parent.parent;
                            phi = ac.angle;
                            
                            var ang1 =
                                - phi + 
                                3 * Math.PI / 2 +
                                Math.atan2 (
                                    ((ac.smallY) * squashY - mouse.y) / squashY,
                                    ((ac.smallX) * squashX - mouse.x) / squashX
                                );
                            
                            //drawCircle (ac.smallX, ac.smallY, ac.smallR, "blue", "blue", "yxz");

                            while (ang1 > 2 * Math.PI) ang1 = ang1 - 2 * Math.PI;
                            while (ang1 < 0) ang1 = ang1 + 2 * Math.PI;
                            
                            animateAng1 = ang1;
                        }
                    }

                } else {
                    ac = select;
                    phi = 0;
                    var tmpr0 = rr * ratio;
                    var tmpx0 = xx + (rr - tmpr0) * Math.cos (phi - Math.PI / 2);
                    var tmpy0 = yy + (rr - tmpr0) * Math.sin (phi - Math.PI / 2);
                    
                    if (ac.getCircle(ac.angle1).r * squashX * squashY > minRadius) {
                        var ang =
                            - phi + 
                            3 * Math.PI / 2 +
                            Math.atan2 (
                                ((tmpy0) * squashY - mouse.y) / squashY,
                                ((tmpx0) * squashX - mouse.x) / squashX
                            );
                            
                        //drawCircle (tmpx0, tmpy0, tmpr0, "red", "blue", "yxz"); //ovaj je pravi
                        
                        while (ang > 2 * Math.PI) ang = ang - 2 * Math.PI;
                        while (ang < 0) ang = ang + 2 * Math.PI;
                        
                        animateAng = ang;
                    }
                }
            }
            lastEvent = e;
            
        } else if (!animating) {
            lastMouse = e;
            lastEvent = e;
            original_c = select;
            
            if (!dragging && mouseDown === 1) {
                if (5 < Math.sqrt(Math.pow(mouse.x - dragX, 2) + Math.pow(mouse.y - dragY, 2))) {
                    dragging = true;
                    selectDown = null;
                    selectUp = null;
                    inert = [];
                    inertIdx = 0;
                }
            }
            
            if (dragging) {
                var c = select;
                var dr;
                var noUpdate;
                if (!c.parent) {
                    gettingLevel = select;

                    var ang =
                        3 * Math.PI / 2 +
                        Math.atan2 (
                            (c.smallY * squashY - mouse.y) / squashY,
                            (c.smallX * squashX - mouse.x) / squashX
                        );
                        
                    while (ang > 2 * Math.PI) ang = ang - 2 * Math.PI;
                    while (ang < 0) ang = ang + 2 * Math.PI;

                    var rr0 = c.smallR;
                    var xx0 = c.smallX;
                    var yy0 = c.smallY;
                    var xx1 = xx0 - mouse.x / squashX;
                    var yy1 = yy0 - mouse.y / squashY;
                    var rr1 = Math.sqrt (xx1 * xx1 + yy1 * yy1);
                    dr = 1 - rr1 / rr0;
                    
                } else {
                    gettingLevel = select;
                    var ac = select.parent;
                    var phi = ac.angle;
                    var ang =
                        - phi +
                        3 * Math.PI / 2 +
                        Math.atan2 (
                            (ac.smallY * squashY - mouse.y) / squashY,
                            (ac.smallX * squashX - mouse.x) / squashX
                        );

                    while (ang > 2 * Math.PI) ang = ang - 2 * Math.PI;
                    while (ang < 0) ang = ang + 2 * Math.PI;
                    
                    var crc = ac.getCircle (ang);

                    var rr0 = crc.r * ratio;
                    var xx0 = ac.smallX + crc.x + (crc.r * (1 - ratio)) * Math.cos (ang + phi + Math.PI / 2);
                    var yy0 = ac.smallY + crc.y + (crc.r * (1 - ratio)) * Math.sin (ang + phi + Math.PI / 2);
                    var xx1 = xx0 - mouse.x / squashX;
                    var yy1 = yy0 - mouse.y / squashY;
                    var rr1 = Math.sqrt (xx1 * xx1 + yy1 * yy1);
                    dr = 1 - rr1 / rr0;
                    
                    c = ac;
                    
                    ///////////////
                    if (select.parent.parent) {
                        cpr1 = select;
                        while (cpr1) {
                            if (cpr1.smallR > Math.sqrt ((cpr1.smallX - mouse.x / squashX) * (cpr1.smallX - mouse.x / squashX) + (cpr1.smallY - mouse.y / squashY) * (cpr1.smallY - mouse.y / squashY)))
                                break;
                                
                            cpr1 = cpr1.parent
                        }
                        if (!cpr1) {
                            ang1 = select.parent.parent.angle1;
                        } else {
                            ac = select.parent.parent;
                            phi = ac.angle;
                            var ang1 =
                                - phi +
                                3 * Math.PI / 2 +
                                Math.atan2 (
                                    (ac.smallY * squashY - mouse.y) / squashY,
                                    (ac.smallX * squashX - mouse.x) / squashX
                                );

                            while (ang1 > 2 * Math.PI) ang1 = ang1 - 2 * Math.PI;
                            while (ang1 < 0) ang1 = ang1 + 2 * Math.PI;
                            
                            //drawCircle (ac.smallX, ac.smallY, ac.smallR, "green", "blue", "yxz");
                        }
                    }
                    ///////////////
                }
                
                var topc = c;
                while (topc.parent)
                    topc = topc.parent;
                
                if (dr <= 0) {
                    dr = 0;
                    var i, t0;
                    var cparent = c;
                    while (cparent) {
                        if (cparent.smallR > Math.sqrt ((cparent.smallX - mouse.x / squashX) * (cparent.smallX - mouse.x / squashX) + (cparent.smallY - mouse.y / squashY) * (cparent.smallY - mouse.y / squashY)))
                            break;
                            
                        cparent = cparent.parent
                    }
                    
                    if (!cparent && c.smallR < Math.sqrt ((c.smallX - mouse.x / squashX) * (c.smallX - mouse.x / squashX) + (c.smallY - mouse.y / squashY) * (c.smallY - mouse.y / squashY))) {
                        //alert ("level up");
                        if (path.length > 0) {
                            selectUp = c;
                            if (level !== gettingLevel) {
                                animateAng = ang;

                                i = 0;
                                t0 = (new Date()).getTime();
                                
                                var angles = [];
                                
                                var cc = original_c.cursor.parent;
                                var cp = original_c.parent;

                                while (cp) {
                                    angles.push (cp.angle1);
                                    cc.index = cp.index1;
                                    cc = cc.parent;
                                    cp = cp.parent;
                                }
                                angles.push (Math.PI);

                                function aEnsmall () {
                                    cc = original_c.cursor.parent;
                                    cp = original_c.parent;
                                    var ap = 0;
                                    
                                    var lastAngle = Math.PI;
                                    while (ap < angles.length) {
                                        if (ap > 0) {
                                            cc.angle = angles[ap] * (1 - i) + angles[ap - 1] * (i);
                                        } else {
                                            cc.angle = angles[ap] * (1 - i) + animateAng * (i);//Math.PI + (animateAng - Math.PI) * (i);
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

                                    var x = x1 + (x2 - x1) * (1 - i);
                                    var y = y1 + (y2 - y1) * (1 - i);
                                    var r = r1 + (r2 - r1) * (1 - i);

                                    clear ();
                                    var atCur = n.render (minRadius, x, y, r, 0, 1, original_c.cursor, data, cursor.parent.parent.index, cursor.parent);

                                    if (i < 1) {
                                        var t1 = (new Date()).getTime();
                                        i += (0.51 - Math.abs (i - 0.5)) * (t1 - t0) / 100;
                                        if (i > 1) i = 1
                                        t0 = t1;
                                        
                                        setTimeout(aEnsmall, 0);
                                    } else {
                                        level = gettingLevel;

                                        cursor = cursor.parent;
                                        data = path.pop();
                                        animating = false;
                                        
                                        if (atCur) {
                                            while (atCur.child) atCur = atCur.child;
                                            if (dragging) {
                                                setupSelect ({x: squashX * atCur.smallX, y: squashY * atCur.smallY})
                                                mousemove (lastEvent);
                                            }
                                            //drawCircle (atCur.smallX,  atCur.smallY, atCur.smallR, "red", "blue", "yxz");
                                        } else {
                                            mouseup (lastEvent);
                                        }
                                        
                                        inertIdx = 0;
                                        inert = [];
                                    }
                                }
                                
                                animating = "level";
                                aEnsmall();
                            }
                        }

                    } else {
                        //alert ("level down");
                        selectDown = c;
                        animateAng1 = ang1;
                        if (level !== gettingLevel) {
                            t0 = (new Date()).getTime();
                            i = 0;
                            
                            var angles = [];
                            var cc = c.cursor;
                            var cp = c;
                            do {
                                angles.push (cp.angle1);
                                cc.index = cp.index1;
                                cc = cc.parent;
                                cp = cp.parent;
                            } while (cp);
                            
                            function aEnlarge () {
                                angles[1] = animateAng1;
                                cc = c.cursor;
                                cp = c;
                                var ap = 0;
                                while (cp.parent) {
                                    cc.angle = angles[ap] * (1 - i) + angles[ap + 1] * i;
                                    cc = cc.parent;
                                    cp = cp.parent;
                                    ap++
                                };
                                cc.angle = angles[ap] * (1 - i) + Math.PI * i;
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

                                var x = x1 + (x2 - x1) * i;
                                var y = y1 + (y2 - y1) * i;
                                var r = r1 + (r2 - r1) * i;

                                clear ();
                                var atCur = n.render (minRadius, x, y, r, 0, 1, original_c.cursor, data, topc.index, cursor);

                                if (i < 1) {
                                    var t1 = (new Date()).getTime();
                                    i += (0.51 - Math.abs (i - 0.5)) * (t1 - t0) / 100;
                                    if (i > 1) i = 1
                                    t0 = t1;
                                    
                                    setTimeout(aEnlarge, 0);
                                } else {
                                    level = gettingLevel;
                                    inertIdx = 0;
                                    inert = [];

                                    if (!cursor.children[cursor.index])
                                        cursor.children[cursor.index] = {parent: cursor, index: 0, angle: Math.PI, children: []};
                                    cursor = cursor.children[cursor.index];
                                    
                                    path.push (data);
                                    data = selectDown.child.data;
                                    
                                    animating = false;

                                    if (atCur) {
                                        while (atCur.child) atCur = atCur.child;
                                        if (dragging) {
                                            setupSelect ({x: squashX * atCur.smallX, y: squashY * atCur.smallY})
                                            mousemove (lastEvent);
                                        }
                                        //drawCircle (atCur.smallX,  atCur.smallY, atCur.smallR, "red", "blue", "yxz");
                                    } else {
                                        mouseup (lastEvent);
                                    }
                                }
                            }
                            
                            animating = "level";
                            aEnlarge ();
                        }    
                    }
                    
                } else if (c !== select) {
                    c.setAngle (ang, dr);
                    if (c.getCircle(c.angle1).r * squashX * squashY > minRadius) {
                        inert[inertIdx] = {angle: c.angle1, rawAngle: ang, percentRawAngle: dr, time: (new Date()).getTime()};
                        inertIdx++;
                        if (inertIdx === 100) inertIdx = 0;

                    } else {
                        c.revertAngle ();
                    }
                }
            }
            
            if (mouseDown === 1) {
                redraw (null);
                
            } else {
                redraw ({x: mouse.x, y: mouse.y});
            }
        }
    }
    
    function setupSelect (e) {
        mouse = e;//getMouse (e);

        range = redraw ({x: mouse.x, y: mouse.y, button: e.which});

        if (range) {
            select = range;
            var sc = cursor;
            select.cursor = sc;
            while (select.child) {
                select = select.child;
                
                if (!sc.children[select.index])
                    sc.children[select.index] = {parent: sc, index: 0, angle: Math.PI, children: []};
                
                sc = sc.children[select.index];
                select.cursor = sc;
            }
            
            if (select.parent) {
                selectDown = range;
                selectUp = null;
                
            } else {
                selectUp = range;
                selectDown = null;
            }
        } else {
            select = null;
            selectDown = null;
            selectUp = null;
        }
    }
    
    function mousedown (e) {
        mouse = getMouse (e);
        
        if (!animating) {
            if (e.which == 1) {
                mouseDown = 1;
                dragX = mouse.x;
                dragY = mouse.y;
                
                setupSelect(getMouse (e));
            }
        }
    }

    function mouseup (e) {
        mouse = getMouse (e);
        mouseDown = 0;
        if (animating === "level") dragging = false;

        if (!animating) {
            if (dragging) {
                dragging = false;
                if (inert.length > 1) {
                    var sum = 0;
                    var avgAng = 0;
                    var i = inertIdx - 1
                    var j = i - 1;
                    var k = 100;
                    if ((new Date()).getTime() - inert[i].time < 100) {
                        while (i !== inertIdx && k > 0) {
                            if (i === 0)
                                j = inert.length - 1;
                            else
                                j = i - 1

                            if (!inert[i] || !inert[j])
                                break;
                                
                            if (inert[i].time - inert[j].time > 100)
                                break;

                            var dang = (inert[i].angle - inert[j].angle) / (inert[i].time - inert[j].time)
                            
                            if (!avgAng)
                                avgAng = dang;
                            else
                                avgAng = (avgAng + dang) / 2
                            
                            i -= 1; j -= 1; k -= 1;
                        }
                    }
                    
                    if (Math.abs(avgAng) > 0.0001) {
                        var c = select.parent;
                        var ang0 = inert[inertIdx - 1].angle;
                        var dang0 = inert[inertIdx - 1].angle - inert[inertIdx - 1].rawAngle;
                        var t0 = (new Date()).getTime();
                        var i = 1;
                        function aInert () {
                            var dt = (new Date()).getTime() - t0;
                            t0 = (new Date()).getTime();
                            if (dt === 0) dt = 1;

                            i = i - dt / 500;
                            if (i > 0){
                                ang0 += avgAng * i * dt;
                                if (ang0 > 0 && ang0 < 2 * Math.PI && c.getCircle(ang0).r * squashX * squashY > minRadius) {
                                    c.setAngle (ang0 - dang0, inert[inertIdx - 1].percentRawAngle);

                                    redraw (null);
                                    
                                    setTimeout(aInert, 0);
                                    
                                } else {
                                    animating = false;
                                    redraw ({x: mouse.x, y: mouse.y});
                                }
                            } else {
                                animating = false;
                                redraw ({x: mouse.x, y: mouse.y});
                            }
                        }

                        animating = true;
                        aInert ();
                    }
                }

            }

            if (!animating) redraw ({x: mouse.x, y: mouse.y});
            select = null;
            mouseDown = 0;

        }
    }
    

    var mouse = {};
    var tt, ll, ww, hh, rr, xx, yy, squashX, squashY;
    var r1, x1, y1;
    var path = [], cursor, select, selectDown, selectUp, range, animating;
    cursor = {parent: null, index: 0, angle: Math.PI, children: []}
    cursor.parent = {parent: null, index: 0, angle: Math.PI, children: []}
    var level, gettingLevel, animateAng, animateAng1;
    var lastMouse, lastEvent;

    var mouseDown = false;
    var dragX, dragY, dragging = false;
    var inert, inertIdx = 0;

    var n = node();
    var movingNode = null;

    var clipPath = document.createElementNS(svgns, 'clipPath');
    clipPath.setAttributeNS(null, 'id', 'clip128');
    svg.appendChild(clipPath);

    var clip = document.createElementNS(svgns, 'ellipse');
    clipPath.appendChild(clip);

window.addEventListener('mousemove', mousemove, false);
window.addEventListener('mousedown', mousedown, false);
window.addEventListener('mouseup', mouseup, false);
    
    resize(svgContainer.clientWidth, svgContainer.clientHeight);

    return {
        resize: resize
    }
}

(function(window, document, undefined){
"use strict";
 
var testElem,
    docElement = document.documentElement,
    defaultView = document.defaultView,
    getComputedStyle = defaultView && defaultView.getComputedStyle,
    computedValueBug,
    runit = /^(-?[\d+\.\-]+)([a-z]+|%)$/i;
 
// test for the WebKit getComputedStyle bug
// @see http://bugs.jquery.com/ticket/10639
if (getComputedStyle) {
    // create a test element
    testElem = document.createElement('test');
 
    // add the test element to the dom
    docElement.appendChild(testElem);
 
    // add a percentage margin and measure it
    testElem.style.marginTop = '1%';
    computedValueBug = getComputedStyle(testElem).marginTop === '1%';
 
    // remove the test element from the DOM and delete it
    docElement.removeChild(testElem);
    testElem = undefined;
}
 
// convert a value to pixels
function toPx(elem, value, prop) {
    // use width as the default property, or specify your own
    prop = prop || 'width';
 
    // begin "the awesome hack by Dean Edwards"
    // @see http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291
 
    // remember the current style
    var style = elem.style,
        inlineValue = style[prop],
        ret;
 
    // set the style on the target element
    try {
        style[prop] = value;
    } catch(e) {
        // IE 8 and below throw an exception when setting unsupported units
        return 0;
    }
 
    // read the computed value
    // if style is nothing we probably set an unsupported unit
    ret = !style[prop] ? 0 : curCSS(elem, prop);
 
    // reset the style back to what it was or blank it out
    style[prop] = inlineValue !== undefined ? inlineValue : null;
 
    // remove the unit and return a number
    return parseFloat(ret);
}
 
// return the computed value of a CSS property
function curCSS(elem, prop) {
    var value,
        pixel,
        unit,
        rvpos = /^top|bottom/,
        outerProp = ["paddingTop", "paddingBottom", "borderTop", "borderBottom"],
        innerHeight,
        parent,
        i = 4; // outerProp.length
 
    if (getComputedStyle) {
        // FireFox, Chrome/Safari, Opera and IE9+
        value = getComputedStyle(elem)[prop];
    } else if (pixel = elem.style['pixel' + prop.charAt(0).toUpperCase() + prop.slice(1)]) {
        // IE and Opera support pixel shortcuts for top, bottom, left, right, height, width
        // WebKit supports pixel shortcuts only when an absolute unit is used
        value = pixel + 'px';
    } else if (prop === 'fontSize') {
        // correct IE issues with font-size
        // @see http://bugs.jquery.com/ticket/760
        value = toPx(elem, '1em', 'left') + 'px';
    } else {
        // IE 8 and below return the specified style
        value = elem.currentStyle[prop];
    }
 
    // check the unit
    unit = (value.match(runit)||[])[2];
    if (unit === '%' && computedValueBug) {
        // WebKit won't convert percentages for top, bottom, left, right, margin and text-indent
        if (rvpos.test(prop)) {
            // Top and bottom require measuring the innerHeight of the parent.
            innerHeight = (parent = elem.parentNode || elem).offsetHeight;
            while (i--) {
              innerHeight -= parseFloat(curCSS(parent, outerProp[i]));
            }
            value = parseFloat(value) / 100 * innerHeight + 'px';
        } else {
            // This fixes margin, left, right and text-indent
            // @see https://bugs.webkit.org/show_bug.cgi?id=29084
            // @see http://bugs.jquery.com/ticket/10639
            value = toPx(elem, value);
        }
    } else if ((value === 'auto' || (unit && unit !== 'px')) && getComputedStyle) {
        // WebKit and Opera will return auto in some cases
        // Firefox will pass back an unaltered value when it can't be set, like top on a static element
        value = 0;
    } else if (unit && unit !== 'px' && !getComputedStyle) {
        // IE 8 and below won't convert units for us
        // try to convert using a prop that will return pixels
        // this will be accurate for everything (except font-size and some percentages)
        value = toPx(elem, value) + 'px';
    }
    return value;
}
 
// expose the conversion function to the window object
window.Length = {
    toPx: toPx
};
}(this, this.document));

