function orbital (svgContainer, data) {
    "use strict";

    var svgns = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS (svgns, "svg");
    svg.style.display = "block";
    svgContainer.appendChild (svg);         
    svg.draggable = false;
    svg.ondragstart = function () {return false};

    var ratio = 0.7;//575;
    var minRadius = 0.5*8;
    var pixelPrecision = 1 / Math.pow (2, 20);
    var dragPrecision = Math.pow (2, 10);
    var fill1 = "rgb(255, 255, 150)";
    var stroke1 = "gray";
    var fill2 = stroke1;
    var stroke2 = fill1;

    function insertGroup () {
        var g;
        g = document.createElementNS(svgns, "g");
        g.setAttribute('id', 'group');
        g.setAttribute('shape-rendering', 'inherit');
        g.setAttribute('pointer-events', 'all');
        g.setAttributeNS(null, 'clip-path', 'url(#clip)');
        return g;
    }
    
    function insertCircle (x, y, r, fill, stroke) {
        var el = document.createElementNS(svgns, 'ellipse');
        el.setAttribute('cx', x * squashX);
        el.setAttribute('cy', y * squashY);
        el.setAttribute('rx', r * squashX - 0.5);
        el.setAttribute('ry', r * squashY - 0.5);
        el.setAttribute('fill', fill);
        el.setAttribute('stroke-width',  0);
        el.setAttribute('stroke', stroke);
        el.setAttributeNS(null, 'clip-path', 'url(#clip)');
        return el;
    }
    
    function setupCircle (el, x, y, r, fill, stroke) {
        el.setAttribute('cx', x * squashX);
        el.setAttribute('cy', y * squashY);
        el.setAttribute('rx', r * squashX - 0.5);
        el.setAttribute('ry', r * squashY - 0.5);
        el.setAttribute('fill', fill);
        el.setAttribute('stroke-width',  0);
        el.setAttribute('stroke', stroke);
        return el;
    }
    
    function insertRect (x, y, width, height, fill, stroke) {
        var rect = document.createElementNS(svgns, 'rect');
        rect.setAttributeNS(null, 'x', x);
        rect.setAttributeNS(null, 'y', y);
        rect.setAttributeNS(null, 'height', height);
        rect.setAttributeNS(null, 'width', width);
        rect.setAttributeNS(null, 'fill', fill);
        rect.setAttributeNS(null, 'stroke-width',  1);
        rect.setAttributeNS(null, 'stroke', stroke);
        el.setAttributeNS(null, 'clip-path', 'url(#clip)');
        return rect;
    }
    
    function node() {
        var render = function (minRadius, x1, y1, r1, angle, rec, mouse, data) {
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

            function analyze (c1, beta, x0, y0, r0, x1, y1, r1) {
                var da = Math.acos ((2 * r1 - pixelPrecision) / (2 * r1));
                var mul = 1;
                var c2 = c1;
                var history = [];
                do {
                    c1 = c2;
                    if (beta < c1.alpha) {
                        var alpha = c1.alpha / 2;
                        var dalpha = alpha;
                        history.push (0);
                    } else {
                        var alpha = (2 * Math.PI + c1.alpha) / 2;
                        var dalpha = -(2 * Math.PI - alpha);
                        history.push (1);
                    }

                    mul *= 2;
                    do {
                        c2 = getCircle (alpha, x0, y0, r0, x1, y1, r1);
                        dalpha /= 2;
                        var d = Math.sqrt (Math.pow ((c1.x - c2.x), 2) + Math.pow ((c1.y - c2.y), 2));
                        if ((c1.r / (mul / 2) - c2.r / mul) >= d) {
                            alpha -= dalpha;
                        } else {
                            alpha += dalpha;
                        }
                    } while (Math.abs(dalpha) > da);
                } while (mul <= dragPrecision);

                return history;
            }

            function synthesize (c1, history, x0, y0, r0, x1, y1, r1) {
                var da = Math.acos ((2 * r1 - pixelPrecision) / (2 * r1));
                var mul = Math.pow (2, history.length);
                var c2 = c1;
                var hp = history.length - 1;
                do {
                    c1 = c2;
                    if (history[hp]) {
                        var alpha = c1.alpha / 2;
                        var dalpha = alpha;
                    } else {
                        var alpha = (2 * Math.PI + c1.alpha) / 2;
                        var dalpha = -(2 * Math.PI - alpha);
                    }

                    do {
                        c2 = getCircle (alpha, x0, y0, r0, x1, y1, r1);
                        dalpha /= 2;
                        var d = Math.sqrt (Math.pow ((c1.x - c2.x), 2) + Math.pow ((c1.y - c2.y), 2));
                        if ((c2.r / (mul / 2) - c1.r / mul) >= d) {
                            alpha -= dalpha;
                        } else {
                            alpha += dalpha;
                        }
                    } while (Math.abs(dalpha) > da);
                    
                    mul /= 2;
                    hp--;
                } while (mul > 1);

                return c2;
            }
            
            var i;

            var r0 = r1 * ratio;
            var x0 = x1 + (r1 - r0) * Math.cos (angle - Math.PI / 2);
            var y0 = y1 + (r1 - r0) * Math.sin (angle - Math.PI / 2);
            
            if (
                0 <= x1 + r1 * squashX &&
                ww >= x1 - r1 * squashX &&
                0 <= y1 + r1 * squashY &&
                hh >= y1 - r1 * squashY
            ) {
                if ((r1 * squashY * squashX) > minRadius) {
                    var g = svg;
                    var colorFill;

                    if (select) {
                        if (select.data === data) {
                            colorFill = "white";
                        } else {
                            colorFill = fill1;
                        }
                    } else {
                        if (mouse && (Math.sqrt(Math.pow(mouse.x / squashX - x0, 2) + Math.pow(mouse.y / squashY - y0, 2)) < r0)) {
                            colorFill = "white";
                        } else {
                            colorFill = fill1;
                        }
                    }
                    
                    if (circles.length > circleIndex) {
                        setupCircle(circles[circleIndex], x0, y0, r0, colorFill, stroke1);
                    
                    } else {
                        circles.push (insertCircle (x0, y0, r0, colorFill, stroke1));
                        g.appendChild (circles[circles.length - 1]);
                    }
                    
                    circleIndex++;
                    
                    var ret, idx, alp
                    if (data.children.length > 0) {
                        var largest = getCircle (Math.PI, x0, y0, r0, x1, y1, r1);
                        if (largest.r * squashY * squashX > minRadius) {
                            var got;
                            var c0, c1;
                            var alpha = data.angle;
                
                            c0 = getCircle (alpha, x0, y0, r0, x1, y1, r1);
                            if (c0.r * squashX * squashY > minRadius) {
                                got = render (minRadius, x0 + c0.x, y0 + c0.y, c0.r, angle + alpha - Math.PI, rec, mouse, data.children[data.index]);
                                if (got) {
                                    idx = data.index;
                                    alp = alpha;
                                    ret = got;
                                }
                            }
                            
                            c1 = getNeighbor (c0, "+", x0, y0, r0, x1, y1, r1);
                            alpha = c1.alpha;
                            for (i = data.index + 1; i < data.children.length; i++) {
                                if (c1.r * squashX * squashY > minRadius) {
                                    got = render (minRadius, x0 + c1.x, y0 + c1.y, c1.r, angle + alpha - Math.PI, rec, mouse, data.children[i]);
                                    if (got) {
                                        idx = i;
                                        alp = alpha;
                                        ret = got;
                                    }
                                }
                                
                                c1 = getNeighbor (c1, "+", x0, y0, r0, x1, y1, r1);
                                alpha = c1.alpha;
                            }
                            

                            c1 = getNeighbor (c0, "-", x0, y0, r0, x1, y1, r1);
                            alpha = c1.alpha;
                            for (i = data.index - 1; i >= 0; i--) {
                                if (c1.r * squashX * squashY > minRadius) {
                                    got = render (minRadius, x0 + c1.x, y0 + c1.y, c1.r, angle + alpha - Math.PI, rec, mouse, data.children[i]);
                                    if (got) {
                                        idx = i;
                                        alp = alpha;
                                        ret = got;
                                    }
                                }
                                
                                c1 = getNeighbor (c1, "-", x0, y0, r0, x1, y1, r1);
                                alpha = c1.alpha;
                            }
                            
                            if (ret) {
                                data.index = idx;
                                data.angle = alp;
                            }
                        }
                    }
                    
                    if (ret || (mouse && Math.sqrt(Math.pow(mouse.x / squashX - x0, 2) + Math.pow(mouse.y / squashY - y0, 2)) < r0)) {
                        var pass = {
                            data: data,
                            child: ret,
                            smallX: x0,
                            smallY: y0,
                            smallR: r0,
                            bigX: x1,
                            bigY: y1,
                            bigR: r1,
                            getCircle (ang) {
                                return getCircle (ang, x0, y0, r0, x1, y1, r1);
                            },
                            setAngle: (function () {
                                var dangle = 3 * Math.PI / 2 + Math.atan2((y0 * squashY - mouse.y) / squashY, (x0 * squashX - mouse.x) / squashX);
                                while (dangle > 2 * Math.PI)
                                    dangle = dangle - 2 * Math.PI;
                                
                                var c = getCircle (angle + data.angle, x0, y0, r0, x1, y1, r1);
                                var history = analyze (c, dangle, x0, y0, r0, x1, y1, r1);
                                
                                return function (ang) {
                                    data.angle = synthesize (
                                        getCircle (ang, x0, y0, r0, x1, y1, r1),
                                        history,
                                        x0, y0, r0, x1, y1, r1
                                    ).alpha;
                                }
                            }) (),
                            getMetrics: function () {
                                var c, x;
                                var a = pass.getAbsoluteAngle();
                                if (pass.parent) {
                                    x = pass.parent.getMetrics ();
                                    //c = {x: x.x, y: x.y, r: x.r}
                                    
                                    var r0 = x.r * ratio;
                                    var x0 = x.x + (x.r - r0) * Math.cos (a - Math.PI / 2);
                                    var y0 = x.y + (x.r - r0) * Math.sin (a - Math.PI / 2);
                                    c = getCircle (pass.data.angle, x0, y0, r0, x.x, x.y, x.r);
                                    
                                    return {x: x0 + c.x, y: y0 + c.y, r: c.r};
                                } else {
                                    var r0 = r1 * ratio;
                                    var x0 = x1 + (r1 - r0) * Math.cos (a - Math.PI / 2);
                                    var y0 = y1 + (r1 - r0) * Math.sin (a - Math.PI / 2);
                                    c = getCircle (pass.data.angle, x0, y0, r0, x1, y1, r1);

                                    return {x: x0 + c.x, y: y0 + c.y, r: c.r};
                                }
                            },
                            getAbsoluteAngle: function () {
                                var phi = 0;
                                var c = pass.parent;
                                if (c) {
                                    while (c) {
                                        phi += c.data.angle - Math.PI;
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
        var i;
        for (i = circleIndex; i < circles.length; i++)
            svg.removeChild (circles[i]);
            
        circles.splice(circleIndex);
    }

    function recycleDraw (m) {
        circleIndex = 0;
        var ret = n.render (minRadius, x1, y1, r1, 0, 1, m, data);
        wasteCircles();
        
        return ret;
    }

    function resize(width, height) {
        ww = width;;
        hh = height;
        
        if (ww > hh) {
            rr = hh / 2;
            squashX = ww / hh;
            squashY = 1;
            
        } else {
            rr = ww / 2;
            squashX = 1;
            squashY = hh / ww;
            
        }

        r1 = rr;
        x1 = ww / squashX - rr;
        y1 = hh / squashY - rr;

        clip.setAttribute('cx', x1 * squashX);
        clip.setAttribute('cy', y1 * squashY);
        clip.setAttribute('rx', r1 * squashX);
        clip.setAttribute('ry', r1 * squashY);
        clip.setAttribute('stroke-width',  1);

        recycleDraw (null);
        
        svg.setAttributeNS (null, "width", ww);
        svg.setAttributeNS (null, "height", hh);
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
        mouse = getMouse (e);
        
        if (!animating) {            
            if (!dragging) {
                if (5 < Math.sqrt(Math.pow(mouse.x - dragX, 2) + Math.pow(mouse.y - dragY, 2))) {
                    if (select && select.parent) {
                        dragging = true;
                        selectDown = null;
                        selectUp = null;
                        inert = [];
                        inertIdx = 0;
                    }
                }
            }
            
            if (dragging) {
                var c = select.parent;
                var phi = c.getAbsoluteAngle();

                var ang = 
                    -phi + 
                    + 3 * Math.PI / 2 + 
                    Math.atan2 (
                        (c.smallY * squashY - mouse.y) / squashY,
                        (c.smallX * squashX - mouse.x) / squashX
                    );
                    
                while (ang > 2 * Math.PI) ang = ang - 2 * Math.PI;
                while (ang < 0) ang = ang + 2 * Math.PI;
                  
                c.setAngle (ang);

                if (c.data.angle < c.getAngMin())
                    c.data.angle = c.getAngMin();

                if (c.data.angle > c.getAngMax())
                    c.data.angle = c.getAngMax();
                
                var inertItem = {angle: ang, time: (new Date).getTime()};
                if (inert.length === 0) {
                    inert.push (inertItem);
                    
                } else {
                    if (inert.kength < 2 || inertItem.time - inert[inertIdx === inert.length? 0: inertIdx].time < 100) {
                        inert.splice(inertIdx, 0, inertItem);
                        
                    } else {
                        if (inertIdx === inert.length)
                            inertIdx = 0;
                            
                        inert[inertIdx] = inertItem;
                    }
                }
                
                inertIdx += 1;
            }
            
            if (select) {
                recycleDraw (null);
                
            } else {
                recycleDraw ({x: mouse.x, y: mouse.y});
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
                
                range = recycleDraw ({x: mouse.x, y: mouse.y, button: e.which});

                if (range) {
                    select = range;
                    while (select.child)
                        select = select.child;
                    
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
        }
    }

    function mouseup (e) {
        if (!animating) {
            if (dragging) {
                if (inert.length > 1) {
                    var t = (new Date).getTime();
                    var sum = 0;
                    var avgAng = 0;
                    var i = inertIdx - 1
                    var j = i - 1;
                    var k = inert.length - 1;
                    while (k > 0) {
                        if (i === 0) {
                            j = inert.length - 1;;

                        } else if (i < 0) {
                            i = inert.length - 1;
                            j = i - 1;
                        }

                        if (t - inert[i].time >= 100)
                            break;

                        t = inert[i].time;
                        var dang = (inert[i].angle - inert[j].angle) / (inert[i].time - inert[j].time)
                        
                        if (!avgAng)
                            avgAng = dang;
                        else
                            avgAng = (avgAng + dang) / 2
                        
                        i -= 1; j -= 1; k -= 1;
                    }
                    
                    var c = select.parent;
                    var ang0 = c.data.angle;
                    var t0 = (new Date()).getTime();
                    var i = 1;
                    function aInert () {
                        var dt = (new Date()).getTime() - t0;
                        t0 = (new Date()).getTime();
                        if (dt === 0) dt = 1;

                        i = i - dt / 500;
                        if (i > 0){
                            ang0 += avgAng * i * dt;
                            
                            c.data.angle = ang0;
                            
                            if (c.data.angle < c.getAngMin()) {
                                c.data.angle = c.getAngMin();
                                animating = false;
                                recycleDraw ({x: mouse.x, y: mouse.y});
                                return;
                            }

                            if (c.data.angle > c.getAngMax()) {
                                c.data.angle = c.getAngMax();
                                animating = false;
                                recycleDraw ({x: mouse.x, y: mouse.y});
                                return;
                            }

                            recycleDraw (null);
                            
                            setTimeout(aInert, 0);
                            
                        } else {
                            animating = false;
                            recycleDraw ({x: mouse.x, y: mouse.y});
                        }
                    }

                    animating = true;
                    aInert ();
                }
                
            }else if (5 > Math.sqrt(Math.pow(mouse.x - dragX, 2) + Math.pow(mouse.y - dragY, 2))) {
                var i, t0;
                if (selectDown) {
                    t0 = (new Date()).getTime();
                    i = 0;
                    var a0 = selectDown.data.angle; 
                    function aEnlarge () {
                        selectDown.data.angle = Math.PI + (a0 - Math.PI) * (1 - i);

                        var m = selectDown.getMetrics()
                        var x0 = m.x;
                        var y0 = m.y;
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

                        circleIndex = 0;
                        n.render (minRadius, x, y, r, 0, 1, null, data);
                        wasteCircles();

                        if (i < 1) {
                            var t1 = (new Date()).getTime();
                            i += (0.51 - Math.abs (i - 0.5)) * (t1 - t0) / 100;
                            if (i > 1) i = 1
                            t0 = t1;
                            
                            setTimeout(aEnlarge, 0);
                        } else {
                            path.push (data);
                            data = selectDown.child.data;
                            recycleDraw ({x: mouse.x, y: mouse.y});
                            animating = false;
                            selectDown = null;
                        }
                    }
                    
                    animating = true;
                    aEnlarge ();
                    
                } else if (selectUp && path.length > 0) {
                    var m = selectUp.getCircle(Math.PI);
                    var x0 = m.x;
                    var y0 = m.y;
                    var r0 = m.r;

                    i = 0;
                    t0 = (new Date()).getTime();
                    function aEnlittle () {
                        var ang = Math.PI / 2;
                        var mang = -Math.PI / 2;
                        
                        var xo = x1 + r1 * Math.cos(ang);
                        var yo = y1 + r1 * Math.sin(ang);
                        
                        var r2 = r1 * r1 / r0;
                        var x2 = xo + r2 * Math.cos(mang);
                        var y2 = yo + r2 * Math.sin(mang);

                        var x = x1 + (x2 - x1) * (1 - i);
                        var y = y1 + (y2 - y1) * (1 - i);
                        var r = r1 + (r2 - r1) * (1 - i);                    

                        circleIndex = 0;
                        n.render (minRadius, x, y, r, 0, 1, null, path[path.length - 1]);
                        wasteCircles();

                        if (i < 1) {
                            var t1 = (new Date()).getTime();
                            i += (0.51 - Math.abs (i - 0.5)) * (t1 - t0) / 100;
                            if (i > 1) i = 1
                            t0 = t1;
                            
                            setTimeout(aEnlittle, 0);
                        } else {
                            data = path.pop();
                            recycleDraw ({x: mouse.x, y: mouse.y});
                            animating = false;
                            selectUp = null;
                        }
                    }
                    
                    animating = true;
                    aEnlittle()
                }
            }
            mouseDown = 0;
            select = null;
            dragging = false;
            
            recycleDraw ({x: mouse.x, y: mouse.y});
        }
    }
    

    var mouse = {};
    var tt, ll, ww, hh, rr, squashX, squashY;
    var r1, x1, y1;
    var path = [], select, selectDown, selectUp, range, animating;
    
    var mouseDown = false;
    var dragX, dragY, dragging = false;
    var inert, inertIdx = 0;

    var n = node();
    var movingNode = null;
    
    var circles = [];
    var circleIndex = 0;

    var clipPath = document.createElementNS(svgns, 'clipPath');
    clipPath.setAttributeNS(null, 'id', 'clip');
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
