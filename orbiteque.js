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
    //const opts = { desynchronized: true };
    //const ctx = canvas.getContext('2d', opts);

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
            
            /*
            ctx.strokeStyle = "white";
            ctx.beginPath();
            ctx.moveTo(ac.smallX, ac.smallY);
            ctx.lineTo(ac.smallX + 100 * Math.cos(ang[i]), ac.smallY + 100 * Math.sin(ang[i]));
            ctx.stroke();
            */
            
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
        var render = function (minRadius, x1, y1, r1, angle, rec, mouse, data, index, cursor, selectedCursor) {
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
                    
                    if (selectedCursor?cursor === selectedCursor: mouse && (Math.sqrt(Math.pow(mouse.x / squashX - x0, 2) + Math.pow(mouse.y / squashY - y0, 2)) <= r0)) {
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
                        got = render (minRadius, x0 + c0.x, y0 + c0.y, c0.r, angle + alpha - Math.PI, rec + 1, mouse, null/*data.children[ci]*/, ci, (cursor?cursor.children[ci]:null), selectedCursor);
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
                            got = render (minRadius, x0 + c1.x, y0 + c1.y, c1.r, angle + alpha - Math.PI, rec + 1, mouse, null/*data.children[ci]*/, ci, (cursor?cursor.children[ci]:null), selectedCursor);
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
                            got = render (minRadius, x0 + c1.x, y0 + c1.y, c1.r, angle + alpha - Math.PI, rec + 1, mouse, null/*data.children[ci]*/, ci, (cursor?cursor.children[ci]:null), selectedCursor);
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
                    
                    var cond = selectedCursor? (cursor === selectedCursor) : (mouse && Math.sqrt(Math.pow(mouse.x / squashX - x0, 2) + Math.pow(mouse.y / squashY - y0, 2)) <= r0);
                    
                    if (ret || cond) {
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
                                return angle;
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
    
    function setupSelect (range) {
        select = range;
        if (range) {
            var sc = cursor;
            select.parent = null;
            select.cursor = sc;
            while (select.child) {
                select = select.child;
                
                if (!sc.children[select.index])
                    sc.children[select.index] = {parent: sc, index: 0, angle: Math.PI, children: []};
                
                sc = sc.children[select.index];
                select.cursor = sc;
            }
        }
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
        
        mouse = getMouse (e);
        {
            lastMouseEvent = e;
            
            if (!dragging && mouseDown === 1) {
                if (5 < Math.sqrt(Math.pow(mouse.x - dragX, 2) + Math.pow(mouse.y - dragY, 2))) {
                    dragging = true;
                    inert = [];
                    inertIdx = 0;
                    setupSelect(preSelect);
                }
            }
            
            if (dragging && select) {
                gettingLevel = select;
                
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
                    
                    //drawCircle (ac.smallX, ac.smallY, ac.smallR, "red", "white", "yxz"); 
                    
                    ac = ac.parent;
                    ip++;
                }
                
                var isOnParent = select.parent;
                while (isOnParent) {
                    if (isOnParent.smallR > Math.sqrt (Math.pow (isOnParent.smallX - mouse.x / squashX, 2) + Math.pow (isOnParent.smallY - mouse.y / squashY, 2)))
                        break;
                        
                    isOnParent = isOnParent.parent
                }
                
                var minR, maxR, mouseDistance;
                if (!isOnParent) {
                    if (select.parent) {
                        minR = select.parent.smallR;
                        maxR = select.parent.smallR + 2 * select.parent.getCircle(ang[1]).r * ratio;//select.smallR;
                        mouseDistance = Math.sqrt (Math.pow (select.parent.smallX - mouse.x / squashX, 2) + Math.pow(select.parent.smallY - mouse.y / squashY, 2));

                    } else {
                        minR = 0;
                        maxR = select.smallR;
                        mouseDistance = Math.sqrt (Math.pow (select.smallX - mouse.x / squashX, 2) + Math.pow(select.smallY - mouse.y / squashY, 2))
                    }
                }

                if (!animating && select.parent && !isOnParent && mouseDistance < maxR) {
                    //select.parent.setAngle (ang[1], dr);
                    select.parent.setAngle (ang[1], 0);
                    //if (select.parent.getCircle(select.parent.angle1).r * squashX * squashY > minRadius) {
                        //inert[inertIdx] = {angle: select.parent.angle1, rawAngle: ang[1], percentRawAngle: dr, time: (new Date()).getTime()};
                        inert[inertIdx] = {angle: select.parent.angle1, rawAngle: ang[1], percentRawAngle: 0, time: (new Date()).getTime()};
                        inertIdx++;
                        if (inertIdx === 100) inertIdx = 0;

                        clear ();                                
                        setupSelect (n.render (minRadius, x1, y1, r1, 0, 1, mouse, data, cursor.parent.index, cursor, select.cursor));

                    //} else {
                    //    select.parent.revertAngle ();
                    //}
                }
                
                if (!select) {
                    mouseup (lastMouseEvent);
                    
                } else {
                    if (!isOnParent) {
                        if (mouseDistance > maxR)
                            animateAng0 = ang[0];
                        
                        if (select.parent && select.parent.parent)
                            animateAng2 = ang[2];

                    } else {
                        if (isOnParent !== select.parent) {
                            if (select.parent.parent) {
                                if (animating) {
                                    animateAng2 = curAnimateAng2;
                                    animateAng2Start = curAnimateAng2;
                                } else {
                                    animateAng2 = select.parent.parent.angle1;
                                    animateAng2Start = select.parent.parent.angle1;
                                }
                            }
                            
                        } else {
                            animateAng2 = ang[2];
                            if (!animating && select.parent.parent)
                                animateAng2Start = select.parent.parent.angle1;
                        }
                    }

                    if (!animating) {
                        var topc = select;
                        while (topc.parent)
                            topc = topc.parent;

                        var i, t0;
                    
                        if (isOnParent) {
                            //alert ("level down");
                            if (level !== gettingLevel) {
                                t0 = (new Date()).getTime();
                                i = 0;
                                
                                var angles = [];
                                var cc = select.parent.cursor;
                                var cp = select.parent;
                                do {
                                    angles.push (cp.angle1);
                                    cc.index = cp.index1;
                                    cc = cc.parent;
                                    cp = cp.parent;
                                } while (cp);
                                
                                function aEnlarge () {
                                    angles[1] = animateAng2Start * (1 - i) + animateAng2 * i;
                                    curAnimateAng2 = angles[1]
                                    cc = select.parent.cursor;
                                    cp = select.parent;
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
                                    var atCur = n.render (minRadius, x, y, r, 0, 1, null, data, topc.index, cursor, select.cursor);

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
                                        data = topc.child.data;
                                        
                                        animating = false;

                                        if (atCur) {
                                            if (dragging) {
                                                setupSelect (atCur.child)
                                                mousemove (lastMouseEvent);
                                            } else {
                                                mouseup (lastMouseEvent);
                                            }
                                            //drawCircle (select.smallX,  select.smallY, select.smallR, "green", "white", "yxz");

                                        } else {
                                            mouseup (lastMouseEvent);
                                        }
                                    }
                                }
                                
                                animating = "level";
                                aEnlarge ();
                            }    
                        } else if (mouseDistance > maxR) {
                            //alert ("level up");
                            if (path.length > 0) {
                                if (level !== gettingLevel) {
                                    i = 0;
                                    t0 = (new Date()).getTime();
                                    
                                    var angles = [];
                                    
                                    var cc = select.cursor.parent;
                                    var cp = select.parent;

                                    while (cp) {
                                        angles.push (cp.angle1);
                                        cc.index = cp.index1;
                                        cc = cc.parent;
                                        cp = cp.parent;
                                    }
                                    angles.push (Math.PI);

                                    function aEnsmall () {
                                        cc = select.cursor.parent;
                                        cp = select.parent;
                                        var ap = 0;
                                        
                                        var lastAngle = Math.PI;
                                        while (ap < angles.length) {
                                            if (ap > 0) {
                                                cc.angle = angles[ap] * (1 - i) + angles[ap - 1] * (i);
                                            } else {
                                                cc.angle = angles[ap] * (1 - i) + animateAng0 * (i);//Math.PI + (animateAng0 - Math.PI) * (i);
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
                                        var atCur = n.render (minRadius, x, y, r, 0, 1, null, data, cursor.parent.parent.index, cursor.parent, select.cursor);

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
                                                if (dragging) {
                                                    setupSelect (atCur)
                                                    mousemove (lastMouseEvent);
                                                } else {
                                                    mouseup (lastMouseEvent);
                                                }
                                                //drawCircle (select.smallX,  select.smallY, select.smallR, "green", "white", "yxz");

                                            } else {
                                                mouseup (lastMouseEvent);
                                            }
                                            
                                            inertIdx = 0;
                                            inert = [];
                                        }
                                    }
                                    
                                    animating = "level";
                                    aEnsmall();
                                }
                            }
                        }
                    }                    
                }
            }
            
            if (!select && !animating && !dragging) {
                redraw ({x: mouse.x, y: mouse.y});
            }
            
        }
    }
    
    function mousedown (e) {
        mouse = getMouse (e);
        
        if (!animating) {
            if (e.which == 1) {
                mouseDown = 1;
                dragX = mouse.x;
                dragY = mouse.y;
                
                preSelect = redraw ({x: mouse.x, y: mouse.y, button: e.which});
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
    var path = [], cursor, select, preSelect, animating;
    cursor = {parent: null, index: 0, angle: Math.PI, children: []}
    cursor.parent = {parent: null, index: 0, angle: Math.PI, children: []}
    var level, gettingLevel, animateAng0, animateAng2, animateAng2Start, curAnimateAng2;
    var lastMouseEvent;

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

