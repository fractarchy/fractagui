// orbiteque UI Rotos Ovals Creatia

Crisp = (function () {
    function crispBitmap (cnvim) {
        "use strict";
        var ctxim = cnvim.getContext('2d');
        var imageDataim = ctxim.getImageData(0, 0, cnvim.width, cnvim.height);
        //var dataim = imgim.data;
        
        var cnvScaled = {width: cnvim.width, height: cnvim.height, step: 2, images: []};
        
        var iWidth = cnvim.width;
        var iHeight = cnvim.height;

        var dataH = {im: imageDataim, cnv: cnvim}//dataim;
        cnvScaled.images.push ({width: iWidth, height: iHeight, imageData: dataH.im, canvas: dataH.cnv});

        while (true) {
            var dataW = crispX (dataH.im, iWidth, iHeight, cnvScaled.step);
            iWidth = Math.ceil (iWidth / cnvScaled.step);

            dataH = crispY (dataW.im, iWidth, iHeight, cnvScaled.step);
            iHeight = Math.ceil (iHeight / cnvScaled.step);
            
            cnvScaled.images.push ({width: iWidth, height: iHeight, imageData: dataH.im, canvas: dataH.cnv});

            if (iWidth === 1 && iHeight == 1) break;
        }
        
        return cnvScaled;
    }

    function crispX (imageData1, width1, height1, step) {
        "use strict";
        var data1 = imageData1.data;
        var cnv1 = document.createElement ("canvas")
        cnv1.width = Math.ceil (width1 / step);
        cnv1.height = height1;

        var ctx1 = cnv1.getContext('2d');
        
        var imData = ctx1.createImageData(cnv1.width, cnv1.height);
        var data = imData.data;
        
        for (var cy = 0; cy < height1; cy += 1) {
            for (var cx = 0; cx < width1; cx += step) {
                var ci1 = (cy * width1 + cx) * 4;
                var ci = (cy * cnv1.width + Math.floor (cx / step)) * 4;
                if (cx + 1 > width1 - 1) {
                    var ci2 = (cy * width1 + cx - 1) * 4;
                } else {
                    var ci2 = (cy * width1 + cx + 1) * 4;
                }
                if (data1[ci1 + 3] === 255 && data1[ci2 + 3] === 255) {
                    data[ci + 0] = (data1[ci1 + 0] + data1[ci2 + 0]) / 2;
                    data[ci + 1] = (data1[ci1 + 1] + data1[ci2 + 1]) / 2;
                    data[ci + 2] = (data1[ci1 + 2] + data1[ci2 + 2]) / 2;
                    data[ci + 3] = (data1[ci1 + 3] + data1[ci2 + 3]) / 2;
                }
            }
        }

        ctx1.putImageData(imData, 0, 0);

        return {cnv: cnv1, im: imData};
    }
    
    function crispY (imageData1, width1, height1, step) {
        "use strict";
        var data1 = imageData1.data;
        var cnv1 = document.createElement ("canvas")
        cnv1.width = width1;
        cnv1.height = Math.ceil (height1 / step);

        var ctx1 = cnv1.getContext('2d');
        
        var imData = ctx1.createImageData(cnv1.width, cnv1.height);
        var data = imData.data;
        
        for (var cy = 0; cy < height1; cy += step) {
            for (var cx = 0; cx < width1; cx += 1) {
                var ci1 = (cy * width1 + cx) * 4;
                var ci = (Math.floor (cy / step) * cnv1.width + cx) * 4;
                if (cy + 1 > height1 - 1) {
                    var ci2 = ((cy - 1) * width1 + cx) * 4;
                } else {
                    var ci2 = ((cy + 1) * width1 + cx) * 4;
                }
                
                if (data1[ci1 + 3] === 255 && data1[ci2 + 3] === 255) {
                    data[ci + 0] = (data1[ci1 + 0] + data1[ci2 + 0]) / 2;
                    data[ci + 1] = (data1[ci1 + 1] + data1[ci2 + 1]) / 2;
                    data[ci + 2] = (data1[ci1 + 2] + data1[ci2 + 2]) / 2;
                    data[ci + 3] = (data1[ci1 + 3] + data1[ci2 + 3]) / 2;
                }
            }
        }
        
        ctx1.putImageData(imData, 0, 0);

        return {cnv: cnv1, im: imData};
    }

    function crispBitmapXY (cnvim) {
        "use strict";
        var ctxim = cnvim.getContext('2d');
        var imageDataim = ctxim.getImageData(0, 0, cnvim.width, cnvim.height);
        
        var cnvScaled1 = {width: cnvim.width, height: cnvim.height, step: 2, images: []};
        
        var iWidth = cnvim.width;
        var iHeight = cnvim.height;

        var dataW = {im: imageDataim, cnv: cnvim};
        cnvScaled1.images.push ([{width: iWidth, height: iHeight, imageData: dataW.im, canvas: dataW.cnv}]);
        var x = cnvScaled1.images.length - 1;
        
        while (true) {
            var dataH = dataW;
            while (iHeight / cnvScaled1.step > 1) {
                dataH = crispY (dataH.im, iWidth, iHeight, 2);
                iHeight = Math.ceil (iHeight / 2);
                cnvScaled1.images[x].push ({width: iWidth, height: iHeight, imageData: dataH.im, canvas: dataH.cnv});
            }
            
            iHeight = cnvim.height;
            if (iWidth / cnvScaled1.step > 1) {
                dataW = crispX (dataW.im, iWidth, iHeight, 2);
                iWidth = Math.ceil (iWidth / 2);
                cnvScaled1.images.push ([{width: iWidth, height: iHeight, imageData: dataW.im, canvas: dataW.cnv}]);
                x = cnvScaled1.images.length - 1;
            } else
                break;
        }
        
        return cnvScaled1;
    }

    return {
        crispBitmap: crispBitmap,
        crispBitmapXY: crispBitmapXY
    }
}) ();

function FishEye (radius, squashX, squashY, superSampling) {
    var curvature = 0.25;
    var curvatureFrontier = Math.pow (1, curvature);
    //var superSampling = 1;

    var fishEye;
    //var ratio = 1 / 1.61803398875; //0.7;//575;

    //var cnvScaled;
    var renderMap;
    var tmpRenderMap;

    var log2 = [1];
    for (var i = 1; i < 65535; i++) {
        log2.push (Math.ceil (Math.log2(i)));
    }

    function initFishEye(magn) {
        "use strict";
        var feWidth = Math.round(radius * squashX * magn);
        var feHeight = Math.round(radius * squashY * magn);
        
	    var feArray = new Float32Array (feWidth * feHeight * 4 * 4);
	    
	    //var maxR = radius * ratio;
        var maxR = radius / squashX / squashY;

        for (var y = -feHeight; y < feHeight; y++) {
            for (var x = -feWidth; x < feWidth; x++) {
                var i = ((feHeight + y) * feWidth * 2 + feWidth + x) * 4;

                var a = Math.atan2(y / squashY, x / squashX);
                
                var d = 1;
                //x -= d / 2;
                //y -= d / 2;
                
                if (x < 0 && y < 0) {
                    var xh = x - d;
                    var yh = y;
                    var xv = x;
                    var yv = y - d;

                    var x0 = x - d;
                    var y0 = y - d;
                    
                } else if (x >= 0 && y < 0) {
                    var xh = x + d;
                    var yh = y;
                    var xv = x;
                    var yv = y - d;
                    
                    var x0 = x + d;
                    var y0 = y - d;
                    
                } else if (x >= 0 && y >= 0) {
                    var xh = x + d;
                    var yh = y;
                    var xv = x;
                    var yv = y + d;
                    
                    var x0 = x + d;
                    var y0 = y + d;
                    
                } else if (x < 0 && y >= 0) {
                    var xh = x - d;
                    var yh = y;
                    var xv = x;
                    var yv = y + d;

                    var x0 = x - d;
                    var y0 = y + d;
                }
                
                
                var r = Math.sqrt (x * x / squashX / squashX + y * y / squashY / squashY) / magn;
                var rm = Math.pow (maxR / (maxR - r), curvature);

                var rh = Math.sqrt (xh * xh / squashX / squashX + yh * yh / squashY / squashY) / magn + 1;
                var rmh = Math.pow (maxR / (maxR - rh), curvature);

                var rv = Math.sqrt (xv * xv / squashX / squashX + yv * yv / squashY / squashY) / magn + 1;
                var rmv = Math.pow (maxR / (maxR - rv), curvature);

                var r0 = Math.sqrt (x0 * x0 / squashX / squashX + y0 * y0 / squashY / squashY) / magn + 1;
                var rm0 = Math.pow (maxR / (maxR - r0), curvature);

                //x += d / 2;
                //y += d / 2;

                if (r >= Math.floor (maxR)) {
                    feArray [i + 2] = 0;
                    feArray [i + 3] = 0;

                } else {
                    if (/*rm < curvatureFrontier ||*/ curvature === 0) {
                        feArray[i]     = (x / superSampling + feWidth);
                        feArray[i + 1] = (y / superSampling + feHeight);
                        feArray[i + 2] = superSampling;
                        feArray[i + 3] = superSampling;

                    } else {
                        var newr = r * rm;
                        var newrh = rh * rmh;
                        var newrv = rv * rmv;
                        var newr0 = r0 * rm0;
                        
                        feArray[i]     = ((feWidth * curvatureFrontier + newr * Math.cos(a) * squashX) / curvatureFrontier);
                        feArray[i + 1] = ((feHeight * curvatureFrontier + newr * Math.sin(a) * squashY) / curvatureFrontier);

                        if (curvature > 0) {
                            var dx = Math.abs (Math.cos (a) * (newr0 - newr) * squashX) / magn / curvatureFrontier;
                            var dy = Math.abs (Math.sin (a) * (newr0 - newr) * squashY) / magn / curvatureFrontier;
                        } else {
                            var dx = Math.abs (Math.cos (a) * (newrh - newr) * squashX) / magn / curvatureFrontier;
                            var dy = Math.abs (Math.sin (a) * (newrv - newr) * squashY) / magn / curvatureFrontier;
                        }

                        feArray[i + 2] = dx;
                        feArray[i + 3] = dy;
                    }                    
                }
            }
        }

        return {width: feWidth, height: feHeight, array: feArray};
    }

    function prepareFishEyeMap (width, height, magn, centerX, centerY, cnvScaled) {
        "use strict";
        var magn = 1;

        var mdx = ((fishEye.width - width / 2) / magn);
        var mdy = ((fishEye.height - height / 2) / magn);
        var ddx = (cnvScaled.images[0][0].width / 2 - fishEye.width) + centerX;
        var ddy = (cnvScaled.images[0][0].height / 2 - fishEye.height) + centerY;
        
        var x1 = 0, y1 = 0;

        var DX = 0;
        var DbmpscaleX = 1;
        var DbmpscalefactorX = 2;
        var DfinalX = 3;
        
        var DY = 4;
        var DbmpscaleY = 5;
        var DbmpscalefactorY = 6;
        var DfinalY = 7;        
        
        var Dout = 8;
        
        
        var renderMap = new Int32Array (width * height * 10);
        
        for (var y1 = 0; y1 < Math.ceil (height); y1++) {
            for (var x1 = 0; x1 < Math.ceil (width); x1++) {
                var fe = (
                    Math.round(fishEye.height - (fishEye.height - y1) / magn + mdy) * fishEye.width * 2 + 
                    Math.round(fishEye.width - (fishEye.width - x1) / magn + mdx)
                ) * 4;
                var X = fishEye.array[fe] + ddx;
                var Y = fishEye.array[fe + 1] + ddy;
                var mX = fishEye.array[fe + 2];// / MAX_INT32;
                var mY = fishEye.array[fe + 3];// / MAX_INT32;

                var delta = (y1 * width + x1) * 10

                var rad = Math.sqrt ((x1 - Math.ceil (width) / 2) * (x1 - Math.ceil (width) / 2) / squashX / squashX + (y1 - Math.ceil (height) / 2) * (y1 - Math.ceil (height) / 2) / squashY / squashY) / superSampling;
                renderMap[delta + Dout] = 1;
                //if ((mX == 0 && mY == 0) || radius * ratio - 4 < radius)
                if ((mX == 0 && mY == 0) || radius / squashX / squashY - 4 < rad)
                    renderMap[delta + Dout] = 0;
                
                else {
                    
                    // X
                    var tmpX = Math.floor (mX / magn);
                        
                    if (tmpX >= log2.length) {
                        var bmpscaleX = log2[log2.length - 1];
                    } else {
                        var bmpscaleX = log2[tmpX];// + 1;
                    }
                    
                    if (bmpscaleX < 1)
                        bmpscaleX = 1;
                        
                    if (bmpscaleX > cnvScaled.images.length - 1)
                        bmpscaleX = cnvScaled.images.length - 1;
                        
                    var bmpscalefactorX = cnvScaled.step << (bmpscaleX - 1);
                    //var bmpscalefactorX = tmpX;
                    var finalX = Math.round (X / bmpscalefactorX);
                    
                    renderMap[delta + DX] = X;
                    renderMap[delta + DbmpscaleX] = bmpscaleX;
                    renderMap[delta + DbmpscalefactorX] = bmpscalefactorX;
                    renderMap[delta + DfinalX] = finalX;

                    // Y
                    var tmpY = Math.floor (mY / magn);
                    if (tmpY >= log2.length) {
                        var bmpscaleY = log2[log2.length - 1];
                    } else {
                        var bmpscaleY = log2[tmpY];// + 1;
                    }
                    
                    if (bmpscaleY < 1)
                        bmpscaleY = 1;
                        
                    if (bmpscaleY > cnvScaled.images.length - 1)
                        bmpscaleY = cnvScaled.images.length - 1;
                        
                    var bmpscalefactorY = cnvScaled.step << (bmpscaleY - 1);
                    //var bmpscalefactorY = tmpY;
                    var finalY = Math.round (Y / bmpscalefactorY);

                    renderMap[delta + DY] = Y;
                    renderMap[delta + DbmpscaleY] = bmpscaleY;
                    renderMap[delta + DbmpscalefactorY] = bmpscalefactorY;
                    renderMap[delta + DfinalY] = finalY;
                }
            }
        }

        tmpRenderMap = new Int32Array (width * height * 2);

        return renderMap;
    }
    
    function renderFishEye (data, width, height, magn, centerX, centerY, cnvScaled) {
        "use strict";

        if (!renderMap)
            renderMap = prepareFishEyeMap (width, height, magn, 0, 0, cnvScaled);

        var x1 = 0, y1 = 0;

        var DX = 0;
        var DbmpscaleX = 1;
        var DbmpscalefactorX = 2;
        var DfinalX = 3;
        
        var DY = 4;
        var DbmpscaleY = 5;
        var DbmpscalefactorY = 6;
        var DfinalY = 7;

        var Dout = 8;
        
        var TDfinalX = 0;
        var TDfinalY = 1;

        var i = 0;
        for (var y1 = 1; y1 < height; y1++) {
            i += 4;
            for (var x1 = 1; x1 < width; x1++) {
                var delta1 = (y1 * width + x1) * 2;
                var delta2 = delta1 * 5;

                if (/*renderMap[delta2 + Dout] == 0 ||*/ renderMap[delta2 + Dout - 10] == 0 || renderMap[delta2 + Dout - width * 10] == 0) {
                    data[i + 3] = 0;                            // alpha

                } else {
                    var fx = delta1 + TDfinalX;
                    var fy = delta1 + TDfinalY;

                    tmpRenderMap[fx] = (renderMap[delta2 + DX] + centerX) >> renderMap[delta2 + DbmpscaleX];
                    tmpRenderMap[fy] = (renderMap[delta2 + DY] + centerY) >> renderMap[delta2 + DbmpscaleY];
                    
                    var finalX = tmpRenderMap[fx - 2];
                    var finalY = tmpRenderMap[fy - width * 2];

                    var bmpscaleX = renderMap[delta2 + DbmpscaleX - 10];
                    var bmpscaleY = renderMap[delta2 + DbmpscaleY - width * 10];

                    if (finalX === tmpRenderMap[fx - 4] || finalX === tmpRenderMap[fx]) {
                        bmpscaleX = Math.max (bmpscaleX - 1, 0);
                        finalX = (renderMap[delta2 + DX - 10] + centerX) >> bmpscaleX;
                    }
                    
                    if (finalY === tmpRenderMap[fy - width * 4] || finalY === tmpRenderMap[fy]) {
                        bmpscaleY = Math.max (bmpscaleY - 1, 0);
                        finalY = (renderMap[delta2 + DY - width * 10] + centerY) >> bmpscaleY;
                    }

                    var scaled = cnvScaled.images[bmpscaleX][bmpscaleY];
                    var scaledData = scaled.imageData.data;
                    if (finalX >= 0 && finalX < scaled.width && finalY >= 0 && finalY < scaled.height) {
                        var iim = (finalY * scaled.width + finalX) * 4
                        data[i]     = scaledData[iim];                // red
                        data[i + 1] = scaledData[iim + 1];            // green
                        data[i + 2] = scaledData[iim + 2];            // blue
                        data[i + 3] = 255;                            // alpha
                    } else
                        data[i + 3] = 0;                            // alpha
                    
                }
                
                i += 4;
            }
        }
    }
    
    function clearRenderMap () {
        renderMap = null;
    }
    
    var fishEye = initFishEye (superSampling);
    
    return {
        superSampling: superSampling,
        data: fishEye,
        initFishEye: initFishEye,
        renderFishEye: renderFishEye,
        clearRenderMap: clearRenderMap
    }
}

function Orbital (svgContainer, data) {
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
    /*
    ctx.mozImageSmoothingEnabled    = true
    ctx.imageSmoothingQuality       = "high"
    ctx.webkitImageSmoothingEnabled = true
    ctx.msImageSmoothingEnabled     = true
    ctx.imageSmoothingEnabled       = true
    */
    
    var superSampling = 2;


    //const opts = { desynchronized: true };
    //const ctx = canvas.getContext('2d', opts);

    var ratio = 1 / 1.61803398875; //0.7;//575;
    //var minRadius = Length.toPx(svg, "1mm");

    var minRadius;
    var recCount = 4;

    var pixelPrecision = 1 / Math.pow (2, 16);
    var dragPrecision = Math.pow (2, 8);
    var hilight = "white"
    var fill1 = "rgb(255, 255, 255)";//"lightgray";
    //var fill1r = 255;
    //var fill1g = 255;
    //var fill1b = 150;
    var fill1r = 225;
    var fill1g = 225;
    var fill1b = 225;
    var stroke1 = "gray";
    var fill2 = stroke1;
    var stroke2 = fill1;

    var MAX_INT32 = Math.pow (2, 31) - 1;// 4294967296 / 2 - 1;

    var cnvCache;
    var cache, isCache;
    
    var log2 = [1];
    for (var i = 1; i < 65535; i++) {
        log2.push (Math.ceil (Math.log2(i)));
    }


    function invalidateCache () {
        isCache = false;
        fishEye.clearRenderMap();
        //renderMap = null;
    }
    
    function ellipse(ctx, x, y, xDis, yDis) {
        var kappa = 0.5522848, // 4 * ((√(2) - 1) / 3)
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

/*	
	var a32 = new Uint32Array (250 * 250 * 2);
	var fe = InitFishEye ({Math:Math,Uint32Array:Uint32Array}, {}, a32.buffer)
	
	function FishEye(stdlib, foreign, heap) {
	    'use asm';
	    
		var externfunc = foreign.externFunc;
	    var arr = new stdlib.UInt8Array(heap);

        var a = 0;    // a has type int
        var b = 0.0;  // b has type double

	    function exec() {
            var x = x|0;   // x has type int
            var y = +y;    // y has type double
            return +(x * y);   // function returns a double
		    arr[0] = 1;
	    }

	    return {
		    init: init
	    };
	}
*/

    function generateGrid (mode, width, height, nlines, lineWidth) {
        nlines = 4 * 16;
        var cnvim = document.createElement ("canvas");
        cnvim.width = width;
        cnvim.height = height;
        var ctxim = cnvim.getContext('2d');
        
        ctxim.fillStyle = fill1;//"rgb(255, 255, 150)";
        ctxim.fillRect(0, 0, cnvim.width, cnvim.height);
        ctxim.lineWidth = lineWidth;
        ctxim.strokeStyle = "gray";
        var nlines = nlines;
        var lw = cnvim.width / nlines;
        var lh = cnvim.height / nlines;

        if (mode === "grid") {
            for (var x = 0; x < nlines; x++) {
                ctxim.beginPath();
                ctxim.moveTo(Math.floor(x * lw) + 0.5, 0);
                ctxim.lineTo(Math.floor(x * lw) + 0.5, cnvim.height);
                ctxim.stroke(); 
            }
            
            
            for (var y = 0; y < nlines; y++) {
                ctxim.beginPath();
                ctxim.moveTo(0, Math.floor(y * lh) + 0.5);
                ctxim.lineTo(cnvim.width, Math.floor(y * lh) + 0.5);
                ctxim.stroke(); 
            }

            //ctxim.strokeStyle = "rgb(0,0,0)";
            //ctxim.lineWidth = lineWidth * 2;
            ctxim.strokeRect(0.5, 0.5, cnvim.width - 1, cnvim.height - 1);
            
            var text = "Quicky-flicky brown fox jumps over the lazy-daisy dog."
            
            ctxim.font = "12pt sans-serif";
            ctxim.fillStyle = "black";
            ctxim.fillText(text, width / 2 - ctxim.measureText(text).width / 2, height /2);
        
        } else if (mode === "polar") {
            ctxim.lineWidth = 1;
            for (var x = 0; x < nlines / 2; x++) {
                ctxim.beginPath();
                ctxim.ellipse (
                    width / 2,
                    height / 2,
                    x * lw,
                    x * lh,
                    0,
                    0,
                    2 * Math.PI,
                    false
                );
                ctxim.stroke(); 

            }
            
            for (var a = 0; a < 2 * Math.PI; a += Math.PI / 8) {
                ctxim.beginPath();
                ctxim.moveTo(Math.floor (width / 2) + 0.5, Math.floor (height / 2) + 0.5);
                ctxim.lineTo(Math.floor (width / 2) + 0.5 + Math.cos (a) * width / 2, Math.floor (height / 2) + 0.5 + Math.sin(a) * height / 2);
                ctxim.stroke(); 
            }

            ctxim.strokeRect(0.5, 0.5, cnvim.width - 1, cnvim.height - 1);
            
            var text = "Quicky-flicky brown fox jumps over the lazy-daisy dog."
            
            ctxim.font = "12pt sans-serif";
            ctxim.fillStyle = "black";
            ctxim.fillText(text, width / 2 - ctxim.measureText(text).width / 2, height /2);

        } else if (mode !== "grid") {
            for (var y = 0; y < nlines - 1; y+=4) {
                if ((y / 4) % 2 == 0 ) {
                    ctxim.fillStyle = "rgb(230,230,230)";
                    ctxim.fillRect(0.5, Math.floor(y * lh) + 11, cnvim.width - 0.5, lh * 4);
                }
            }

            for (var y = 1; y < nlines + 1; y++) {
                    //var text = "ཡིག་མགོ་ སྦྲུལ་ཤད བསྐུར་ཡིག་མགོ ཙེག་ ཚིག་གྲུབ་ དོན་ཚན་ བསྡུས་རྟགས་ གུག་རྟགས་གཡོན་ གུག་རྟགས་གཡས་ ཨང་ཁང་གཡོན་ ཨང་ཁང་གཡས་";
                    var text = "Quicky-flicky brown fox jumps over the lazy-daisy dog."
                    ctxim.font = "18pt sans-serif";
                    ctxim.fillStyle = "rgb(0,0,0)";
                    ctxim.fillText(text, width / 2 - ctxim.measureText(text).width / 2, y * lh);
            }
        }

        /*
        ctxim.strokeStyle = "black";
        ctxim.beginPath();
        ctxim.moveTo(0, Math.floor(cnvim.height / 2) + 0.5);
        ctxim.lineTo(cnvim.width, Math.floor(cnvim.height / 2) + 0.5);
        ctxim.stroke(); 
        ctxim.beginPath();
        ctxim.moveTo(Math.floor(cnvim.width / 2) + 0.5, 0);
        ctxim.lineTo(Math.floor(cnvim.width / 2) + 0.5, cnvim.height);
        ctxim.stroke(); 
        */
        /*
        */
        //ctxim.strokeStyle = "rgb(255, 0, 0)";

        
        return cnvim
    }

    function downsample(dest, source1, destWidth, destHeight, magn) {
        function round(val) {
          return (val + 0.49) << 0
        }

        //var dest = new ImageData(destWidth, destHeight)
  
        var tmp = Math.floor (1 / magn);
        if (tmp >= log2.length) {
            var bmpscale = log2[log2.length - 1];
        } else {
            var bmpscale = log2[tmp] - 1;
        }

        if (bmpscale < 0) 
            bmpscale = 0;

        if (bmpscale > source1.images.length - 1) 
            bmpscale = source1.images.length - 1;

        var bmpscalefactor = source1.step << (bmpscale - 1);

        var tmpmagn = 1 / magn / bmpscalefactor;

        var sourceWidth = source1.images[bmpscale].width;
        var sourceHeight = source1.images[bmpscale].height;      
        var source = source1.images[bmpscale].imageData;
        var sourceX = 0;
        var sourceY = 0;

      var SOURCE_DATA  = new Int32Array(source.data.buffer)
      var SOURCE_WIDTH = source.width

      var DEST_DATA  = new Int32Array(dest.data.buffer)
      var DEST_WIDTH = dest.width

      var SCALE_FACTOR_X  = destWidth  / sourceWidth
      var SCALE_FACTOR_Y  = destHeight / sourceHeight
      var SCALE_RANGE_X   = round(1 / SCALE_FACTOR_X)
      var SCALE_RANGE_Y   = round(1 / SCALE_FACTOR_Y)
      var SCALE_RANGE_SQR = SCALE_RANGE_X * SCALE_RANGE_Y

      for (var destRow = 0; destRow < dest.height; destRow++) {
        for (var destCol = 0; destCol < DEST_WIDTH; destCol++) {

          var sourceInd = sourceX + round(destCol / SCALE_FACTOR_X) +
            (sourceY + round(destRow / SCALE_FACTOR_Y)) * SOURCE_WIDTH

          var destRed   = 0
          var destGreen = 0
          var destBlue  = 0
          var destAlpha = 0

          for (var sourceRow = 0; sourceRow < SCALE_RANGE_Y; sourceRow++)
            for (var sourceCol = 0; sourceCol < SCALE_RANGE_X; sourceCol++) {
              var sourcePx = SOURCE_DATA[sourceInd + sourceCol + sourceRow * SOURCE_WIDTH]
              destRed   += sourcePx <<  24 >>> 24
              destGreen += sourcePx <<  16 >>> 24
              destBlue  += sourcePx <<  8  >>> 24
              destAlpha += sourcePx >>> 24
            }

          destRed   = round(destRed   / SCALE_RANGE_SQR)
          destGreen = round(destGreen / SCALE_RANGE_SQR)
          destBlue  = round(destBlue  / SCALE_RANGE_SQR)
          destAlpha = round(destAlpha / SCALE_RANGE_SQR)

          if (destAlpha === 255)
              DEST_DATA[destCol + destRow * DEST_WIDTH] =
                (destAlpha << 24) |
                (destBlue  << 16) |
                (destGreen << 8)  |
                (destRed)
        }
      }
    }

    function renderScaledCnv (data, crisped, width, height, magn) {
        var renderMap = new Int32Array (width * height * 2);
        var DX = 0;
        var DY = 1;

        var tmp = Math.floor (1 / magn);
        if (tmp >= log2.length) {
            var bmpscale = log2[log2.length - 1];
        } else {
            var bmpscale = log2[tmp] + 1;
        }
        
        if (bmpscale > cache.images.length - 1) 
            bmpscale = cache.images.length - 1;
        
        var bmpscalefactor = cnvScaled.step << (bmpscale - 1);
        
        var tmpmagn = 1 / magn / bmpscalefactor;

                    
        for (var y = 0; y < height; y++) {
            for (var x = 0; x < width; x++) {
                var delta =  (y * width + x) * 2;
                renderMap[delta + DX] = Math.floor(x * tmpmagn);
                renderMap[delta + DY] = Math.floor(y * tmpmagn);
            }
        }
        
        var x = 0, y = 0;
        for (var i = 0; i < data.length; i += 4) {
            var delta =  (y * width + x) * 2;
            var dx = renderMap[delta + DX];
            var dy = renderMap[delta + DY];
            
            if ((dx === renderMap[delta + DX - 2] || dx === renderMap[delta + DX + 2])) {
                var tmx = tmpmagn * 2;
                var bmx = bmpscale - 1;
            } else {
                var tmx = tmpmagn;
                var bmx = bmpscale;
            }

            if ((dy === renderMap[delta + DY - 2 * width] || dy === renderMap[delta + DY + 2 * width])) {
                var tmy = tmpmagn * 2;
                var bmy = bmpscale - 1;
            } else {
                var tmy = tmpmagn;
                var bmy = bmpscale;
            }

            var iim = (Math.floor(y * tmy) * crisped.images[bmx][bmy].width + Math.floor(x * tmx)) * 4;
            var dataim = crisped.images[bmx][bmy].imageData.data;
            
            if (dataim[iim + 3] === 255) {
                data[i]     = dataim[iim];                // red
                data[i + 1] = dataim[iim + 1];            // green
                data[i + 2] = dataim[iim + 2];            // blue
                data[i + 3] = 255;//dataim[iim + 3];      // alpha
            }
            
            x++;
            if (x === width) {
                x = 0;
                y++;
            }
        }
    }
    
    function drawCircle (x, y, r, fill, stroke, cursor, renderHint, level) {

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
            ctx.closePath ();

            ctx.lineWidth = 0;

            ctx.fillStyle = fill;
            ctx.fill ();
            
            //ctx.strokeStyle = fill;
            //ctx.stroke ();
            
            
            /*
            ctx.strokeStyle = "white";
            ctx.beginPath();
            ctx.moveTo(ac.smallX, ac.smallY);
            ctx.lineTo(ac.smallX + 100 * Math.cos(ang[i]), ac.smallY + 100 * Math.sin(ang[i]));
            ctx.stroke();
            */
            
            if (r > 5) {
                var magn = r / (rr * ratio);
                var xo = Math.ceil (x * squashX - r * squashX);
                var yo = Math.ceil (y * squashY - r * squashY);
                var xi = Math.floor (x * squashX + r * squashX);
                var yi = Math.floor (y * squashY + r * squashY);
                var w = xi - xo;
                var h = yi - yo;

                if (!isCache) {
                    cnvCache = document.createElement ("canvas");
                    var cacheW = Math.floor (2 * rr * ratio * squashX) * fishEye.superSampling;
                    var cacheH = Math.floor (2 * rr * ratio * squashY) * fishEye.superSampling;
                    cnvCache.width = cacheW;
                    cnvCache.height = cacheH;
                    var ctxCache = cnvCache.getContext('2d');
                    var imgCache = ctxCache.createImageData(cacheW, cacheH);
                    fishEye.renderFishEye (imgCache.data, cacheW, cacheH, 1, 0, 0, cnvScaled);
                    ctxCache.putImageData(imgCache, 0, 0);
                    
                    //cache = crispBitmapXY (cnvCache);
                    cache = Crisp.crispBitmap (cnvCache);
                    
                    isCache = true;
                }
                
                if (!cursor || cursor.cachedCnv === true) {
                    var cachedCnv = cnvCache;
                    var cachedData = cache;
                    
                } else if (level === 1 && panning) {
                    var cnvCache1 = document.createElement ("canvas");
                    var cacheW1 = Math.floor (2 * rr * ratio * squashX) * fishEye.superSampling;
                    var cacheH1 = Math.floor (2 * rr * ratio * squashY) * fishEye.superSampling;
                    cnvCache1.width = cacheW1;
                    cnvCache1.height = cacheH1;
                    var ctxCache1 = cnvCache1.getContext('2d');
                    var imgCache1 = ctxCache1.createImageData(cacheW1, cacheH1);
                    fishEye.renderFishEye (imgCache1.data, cacheW1, cacheH1, 1, cursor.centerX, cursor.centerY, cnvScaled);
                    ctxCache1.putImageData(imgCache1, 0, 0);

                    /*
                    var cnvIm = document.createElement ("canvas");
                    cnvIm.width = w/2;
                    cnvIm.height = h/2;
                    var ctxIm = cnvIm.getContext('2d');
                    var imData = ctxIm.createImageData(w, h);
                    renderScaledCnv (imData.data, crispBitmapXY (cnvCache1), w, h, magn);
                    ctxIm.putImageData(imData, 0, 0);
                    //ctx.drawImage(cnvIm, xo, yo, w, h);

                    cursor.cachedCnv = cnvIm;
                    */
                    cursor.cachedCnv = cnvCache1;

                    var cachedCnv = cursor.cachedCnv;

                } else if (!cursor.cachedCnv || !cursor.cachedData) {
                    var cnvCache1 = document.createElement ("canvas");
                    var cacheW1 = Math.floor (2 * rr * ratio * squashX) * fishEye.superSampling;
                    var cacheH1 = Math.floor (2 * rr * ratio * squashY) * fishEye.superSampling;
                    cnvCache1.width = cacheW1;
                    cnvCache1.height = cacheH1;
                    var ctxCache1 = cnvCache1.getContext('2d');
                    var imgCache1 = ctxCache1.createImageData(cacheW1, cacheH1);
                    fishEye.renderFishEye (imgCache1.data, cacheW1, cacheH1, 1, cursor.centerX, cursor.centerY, cnvScaled);
                    ctxCache1.putImageData(imgCache1, 0, 0);
                    
                    cursor.cachedCnv = cnvCache1;
                    //cursor.cachedData = crispBitmapXY (cnvCache1);
                    cursor.cachedData = Crisp.crispBitmap (cnvCache1);

                    var cachedCnv = cursor.cachedCnv;
                    var cachedData = cursor.cachedData;

                } else {
                    var cachedCnv = cursor.cachedCnv;
                    var cachedData = cursor.cachedData;

                }
                
                if (renderHint === "0") {
                    ctx.drawImage(cachedCnv, xo, yo, w, h);
                    
                } else if (level === 1) {// || (level === 1 && panning) || (renderHint === "0") || (cachedCnv.width === w && cachedCnv.height === h)) {
                    w = cachedCnv.width / fishEye.superSampling;
                    h = cachedCnv.height / fishEye.superSampling;
                    ctx.drawImage(cachedCnv, xo, yo, w, h);
                
                } else if (true || (animating || dragging)) {
                    /*
                    //brzo, smudged
                    var cnvIm = document.createElement ("canvas");
                    cnvIm.width = Math.floor (w / 2);
                    cnvIm.height = Math.floor (h / 2);
                    var ctxIm = cnvIm.getContext('2d');
                    //var imData = ctxIm.getImageData(0, 0, cnvIm.width, cnvIm.height);
                    var imData = ctxIm.createImageData(cnvIm.width, cnvIm.height);
                    renderScaledCnv (imData.data, cachedData, cnvIm.width, cnvIm.height, magn * 0.5);
                    ctxIm.putImageData(imData, 0, 0);
                    ctx.drawImage(cnvIm, xo, yo, w, h);
                    */
                    
                    //brzo                    
                    var tmp = Math.ceil (cachedCnv.width / w);
                    if (tmp >= log2.length) {
                        var bmpscale = log2[log2.length - 1];
                    } else {
                        var bmpscale = log2[tmp] - 1;//(fishEye.superSampling - 1);
                    }
                    
                    //if (level === 1) bmpscale--;
                    
                    if (bmpscale < 0) 
                        bmpscale = 0;
                        
                    if (bmpscale > cache.images.length - 1) 
                        bmpscale = cache.images.length - 1;

                    //ctx.drawImage(cachedData.images[bmpscale][bmpscale].canvas, xo, yo, w, h);
                    
                    ctx.drawImage(cachedData.images[bmpscale].canvas, xo, yo, w, h);
                    
                    /*
                    var cnvIm = document.createElement ("canvas");
                    cnvIm.width = w / 2;
                    cnvIm.height = h / 2;
                    var ctxIm = cnvIm.getContext('2d');
                    var imData = ctxIm.createImageData(cnvIm.width, cnvIm.height);
                    
                    //renderScaledCnv (imData.data, cachedData, w, h, magn);
                    downsample(imData, cachedData, cnvIm.width, cnvIm.height, magn / 2);
                    
                    ctxIm.putImageData(imData, 0, 0);
                    ctx.drawImage(cnvIm, xo, yo, w, h);
                    */
                } else {
                    var cnvIm = document.createElement ("canvas");
                    cnvIm.width = w;
                    cnvIm.height = h;
                    var ctxIm = cnvIm.getContext('2d');
                    var imData = ctxIm.createImageData(w, h);
                    
                    //renderScaledCnv (imData.data, cachedData, w, h, magn);
                    downsample(imData, cachedData, w, h, magn);
                    
                    ctxIm.putImageData(imData, 0, 0);
                    ctx.drawImage(cnvIm, xo, yo, w, h);
                }
            }
        }
    }

    function node() {
        var render = function (minRadius, x1, y1, r1, angle, rec, mouse, data, index, cursor, selectedCursor, renderHint) {
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
            
            if (rec === 1) {
                if (renderHint === "1") {
                    ctx.save ();
                    ctx.beginPath();
                    ctx.ellipse (
                        x0 * squashX,
                        y0 * squashY,
                        r0 * squashX,
                        r0 * squashY,
                        0,
                        0,
                        2 * Math.PI,
                        false
                    );
                    ctx.closePath ();
                    ctx.clip ();
                    
                } else if (renderHint === "1+") {                   
                    
                    ctx.save ();
                    ctx.beginPath ();
                    
                    ctx.moveTo ((x1     ) * squashX, (y1 - r1) * squashY);
                    ctx.lineTo ((x1 - r1) * squashX, (y1 - r1) * squashY);
                    ctx.lineTo ((x1 - r1) * squashX, (y1 + r1) * squashY);
                    ctx.lineTo ((x1 + r1) * squashX, (y1 + r1) * squashY);
                    ctx.lineTo ((x1 + r1) * squashX, (y1 - r1) * squashY);
                    ctx.lineTo ((x1     ) * squashX, (y1 - r1) * squashY);
                    
                    ellipse(ctx, x0 * squashX, y0 * squashY, r0 * squashX, r0 * squashY);
                    ctx.closePath();
                    ctx.clip (); //"evenodd"
                }
                
                clear ();
                
                if (renderHint === "1" || renderHint === "1+") {
                    ctx.restore ();
                }
            }
                
            if (
                Math.sqrt ((x1 - xx) * (x1 - xx) + (y1 - yy) * (y1 - yy)) < r1 + rr
            ) {
                if ((r1 * squashY * squashX) >= minRadius) {
                    var colorFill = fill1;
                    
                    if (
                        (animating || dragging || panning || device === "mouse") &&
                        (selectedCursor?cursor === selectedCursor: mouse) &&
                        (mouse?(Math.sqrt(Math.pow(mouse.x / squashX - x0, 2) + Math.pow(mouse.y / squashY - y0, 2)) < r0): true)
                    ) {
                        colorFill = hilight;
                    } else {
                        colorFill = fill1;
                    }
                    
                    if (!renderHint || (rec > 1 && renderHint === "1+") || renderHint === "1" || renderHint === "0") {
                        //var ttt1 = (new Date()).getTime();
                        //for (var abc = 1; abc < 100; abc++)
                            drawCircle(x0, y0, r0, colorFill, stroke1, cursor, renderHint, rec);
                            
                        //alert ((new Date()).getTime() - ttt1);
                        //return;
                    }
                    
                    if (renderHint !== "1") {                   
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
                    }
                    
                    var cond = selectedCursor? (cursor === selectedCursor) : (mouse && Math.sqrt(Math.pow(mouse.x / squashX - x0, 2) + Math.pow(mouse.y / squashY - y0, 2)) <= r0);
                    
                    if (ret || cond) {
                        var pass = {
                            rec: rec,
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
    
    function setupSelect (range) {
        select = range;
        if (range) {
            var sc = cursor;
            select.parent = null;
            select.cursor = sc;
            while (select.child) {
                select = select.child;
                
                if (!sc.children[select.index])
                    sc.children[select.index] = {parent: sc, index: 0, centerX: 0, centerY: 0, cachedCnv:true, cachedData: null, angle: Math.PI, children: []};
                
                sc = sc.children[select.index];
                select.cursor = sc;
            }
        }
    }
        
    function clear (fill) {
        if (!fill) fill = fill2
        ctx.fillStyle = fill2;
        ctx.fillRect(0, 0, ww, hh);
    }

    function redraw (m, renderHint, selectedCursor) {
        //clear ();
        var ret = n.render (minRadius, x1, y1, r1, 0, 1, m, data, cursor.parent.index, cursor, selectedCursor, renderHint);
        return ret;
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
      
      return {x: Math.floor (xpos), y: Math.floor (ypos)};
    }
    
    function setCenter (select, x, y) {
        select.cursor.centerX = x;
        var minmaxW = Math.floor (cnvScaled.width / 2);
        if (select.cursor.centerX > minmaxW)
            select.cursor.centerX = minmaxW;
        if (select.cursor.centerX < -minmaxW)
            select.cursor.centerX = -minmaxW;

        select.cursor.centerX = Math.floor (select.cursor.centerX)

        select.cursor.centerY = y;
        var minmaxH = Math.floor (cnvScaled.height / 2);
        if (select.cursor.centerY > minmaxH)
            select.cursor.centerY = minmaxH;
        if (select.cursor.centerY < -minmaxH)
            select.cursor.centerY = -minmaxH;

        select.cursor.centerY = Math.floor (select.cursor.centerY)
    }
    
    function mousemovePan(x, y) {
        if (select && !animating) {
            var r0 = r1 * ratio;
            var x0 = Math.floor (x1 * squashX);
            var y0 = Math.floor ((y1 - (r1 - r0)) * squashY);
            
            if (Math.ceil (Math.sqrt((x - x0) / squashX * (x - x0) / squashX + (y - y0) / squashY * (y - y0) / squashY)) < Math.floor (r0)) {
                var tmp0 = (2 * fishEye.data.width * (fishEye.data.height + (dragY - y0) * fishEye.superSampling) + fishEye.data.width + (dragX - x0) * fishEye.superSampling) * 4;
                var tmp1 = (2 * fishEye.data.width * (fishEye.data.height + (y - y0) * fishEye.superSampling) + fishEye.data.width + (x - x0) * fishEye.superSampling) * 4;
                
                setCenter (select, oldCenterX + fishEye.data.array[tmp0] - fishEye.data.array[tmp1], oldCenterY + fishEye.data.array[tmp0 + 1] - fishEye.data.array[tmp1 + 1]);
                select.cursor.cachedCnv = false;
                select.cursor.cachedData = null;
            } else {
                select.cursor.centerX = 0;
                select.cursor.centerY = 0;
                select.cursor.cachedCnv = true;
                select.cursor.cachedData = null;
            }
            
            window.requestAnimationFrame(function () {
                redraw ({x: mouse.x, y: mouse.y}, "1");
            });
        }
    }
    
    function mousemove (e) {
        "use strict";
        
        globalt0 = (new Date()).getTime();
        
        var r0 = r1 * ratio;
        var x0 = Math.floor (x1 * squashX);
        var y0 = Math.floor ((y1 - (r1 - r0)) * squashY);

        mouse = getMouse (e);
        lastMouseEvent = e;
        
        if (!panning && !dragging && mouseDown === 1) {
            if (3 < Math.sqrt(Math.pow(mouse.x - dragX, 2) + Math.pow(mouse.y - dragY, 2))) {
                setupSelect(preSelect);
                
                if (!animating && select && Math.sqrt((mouse.x - x0) / squashX * (mouse.x - x0) / squashX + (mouse.y - y0) / squashY * (mouse.y - y0) / squashY) < r0) {
                    panning = true;
                    
                    oldCenterX = select.cursor.centerX;
                    oldCenterY = select.cursor.centerY;
                    
                    inertPan = [];
                    inertIdxPan = 0;
                } else {
                    dragging = true;
                    
                    inert = [];
                    inertIdx = 0;
                }
            }
        }
        
        if ((dragging || panning) && select) {
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

            if (!animating && dragging && select.parent && !isOnParent && mouseDistance < maxR) {
                //select.parent.setAngle (ang[1], dr);
                select.parent.setAngle (ang[1], 0);
                //if (select.parent.getCircle(select.parent.angle1).r * squashX * squashY > minRadius) {
                    //inert[inertIdx] = {angle: select.parent.angle1, rawAngle: ang[1], percentRawAngle: dr, time: (new Date()).getTime()};
                    inert[inertIdx] = {angle: select.parent.angle1, rawAngle: ang[1], percentRawAngle: 0, centerX: select.cursor.centerX, centerY: select.cursor.centerY, time: (new Date()).getTime()};
                    inertIdx++;
                    if (inertIdx === 20) inertIdx = 0;

                    //clear ();
                    var sel = select;                                
                    window.requestAnimationFrame(function () {
                        if (!panning)
                            setupSelect (n.render (minRadius, x1, y1, r1, 0, 1, mouse, data, cursor.parent.index, cursor, sel.cursor, "1+"));
                    });

                //} else {
                //    select.parent.revertAngle ();
                //}
            }
            
            if (!select) {
                mouseup (lastMouseEvent);
                
            } else {
                if (!isOnParent) {
                    if (Math.floor (mouseDistance) >= Math.floor (maxR))
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

                                var atCur = n.render (minRadius, x, y, r, 0, 1, null, data, topc.index, cursor, select.cursor, "0");

                                if (i < 1) {
                                    var t1 = (new Date()).getTime();
                                    i += (0.51 - Math.abs (i - 0.5)) * (t1 - t0) / 100;
                                    if (i > 1) i = 1
                                    t0 = t1;
                                    
                                    window.requestAnimationFrame(aEnlarge);
                                } else {
                                    level = gettingLevel;
                                    inertIdx = 0;
                                    inert = [];

                                    if (!cursor.children[cursor.index])
                                        cursor.children[cursor.index] = {parent: cursor, centerX: 0, centerY: 0, index: 0, cachedCnv: true, cachedData: null, angle: Math.PI, children: []};
                                    cursor = cursor.children[cursor.index];

                                    path.push (data);
                                    data = topc.child.data;
                                    
                                    panning = false;
                                    animating = false;

                                    if (atCur) {
                                        if (dragging) {
                                            setupSelect (atCur.child)
                                            redraw (null, "1", select.cursor);
                                            window.requestAnimationFrame(function () {
                                                mousemove (lastMouseEvent);
                                            });
                                        } else {
                                            redraw ({x: mouse.x, y: mouse.y}, "1");
                                            window.requestAnimationFrame(function () {
                                                mouseup (lastMouseEvent);
                                            });
                                        }
                                        //drawCircle (select.smallX,  select.smallY, select.smallR, "green", "white", "yxz");

                                    } else {
                                        redraw ({x: mouse.x, y: mouse.y}, "1");
                                        window.requestAnimationFrame(function () {
                                            mouseup (lastMouseEvent);
                                        });
                                    }
                                }
                            }
                            
                            animating = "level";
                            aEnlarge();
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

                                    var atCur = n.render (minRadius, x, y, r, 0, 1, null, data, cursor.parent.parent.index, cursor.parent, select.cursor, "0");

                                    if (i < 1) {
                                        var t1 = (new Date()).getTime();
                                        i += (0.51 - Math.abs (i - 0.5)) * (t1 - t0) / 100;
                                        if (i > 1) i = 1
                                        t0 = t1;
                                        
                                        window.requestAnimationFrame(aEnsmall);
                                    } else {
                                        level = gettingLevel;
                                        inertIdx = 0;
                                        inert = [];

                                        cursor = cursor.parent;
                                        data = path.pop();
                                        
                                        animating = false;
                                        
                                        if (atCur) {
                                            if (dragging) {
                                                setupSelect (atCur);
                                                redraw (null, "1", select.cursor);
                                                window.requestAnimationFrame(function () {
                                                    mousemove (lastMouseEvent);
                                                });
                                            } else {
                                                redraw ({x: mouse.x, y: mouse.y}, "1");
                                                window.requestAnimationFrame(function () {
                                                    mouseup (lastMouseEvent);
                                                });
                                            }
                                            //drawCircle (select.smallX,  select.smallY, select.smallR, "green", "white", "yxz");

                                        } else {
                                            redraw ({x: mouse.x, y: mouse.y}, "1");
                                            window.requestAnimationFrame(function () {
                                                mouseup (lastMouseEvent);
                                            });
                                        }                                            
                                    }
                                }
                                
                                panning = false;
                                animating = "level";
                                cursor.cachedCnv = true;
                                cursor.cachedData = null;
                                cursor.centerX = 0;
                                cursor.centerY = 0;
                                aEnsmall();
                            }
                        }
                    }
                }                    
            }
        }
        
        if (!animating && panning) {
            mousemovePan(mouse.x, mouse.y);
            inertPan[inertIdxPan] = {centerX: cursor.centerX, centerY: cursor.centerY, time: (new Date()).getTime()};
            inertIdxPan++;
            if (inertIdxPan === 20) inertIdxPan = 0;
        }

        window.requestAnimationFrame(function () {                
            if (!mouseDown && !animating && !dragging && !panning)
                redraw ({x: mouse.x, y: mouse.y});
        });
    }
    

    function mousedown (e) {
        mouse = getMouse (e);
        
        globalt0 = (new Date()).getTime();

        if (e.which === 1) {
            if (!animating) {
                preSelect = redraw ({x: mouse.x, y: mouse.y, button: e.which});
            } else if (animating === true) {
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
            
            if (Math.sqrt((dragX - x0) / squashX * (dragX - x0) / squashX + (dragY - y0) / squashY * (dragY - y0) / squashY) >= r0) {
                if (panning) {
                    panning = false;
                    cursor.cachedCnv = false;
                }
            }
        }
    }

    function mouseup (e) {
        mouse = getMouse (e);
        mouseDown = 0;

        if (animating === "level") dragging = false;

        if (!animating) {
            if (dragging && inert.length > 1) {
                dragging = false;
                //if (!panning && inert.length > 1) {
                    var sum = 0;
                    var avgt = 0;
                    var avgAng = 0;
                    var i = inertIdx - 1
                    var j = i - 1;
                    var k = 2;
                    if ((new Date()).getTime() - (inertIdx === 0? inert[inert.length - 1].time: inert[inertIdx - 1].time) < 250) {
                        while (i !== inertIdx && k > 0) {
                            if (i === 0)
                                j = inert.length - 1;
                            else
                                j = i - 1

                            if (!inert[i] || !inert[j])
                                break;
                                
                            if (inert[i].time - inert[j].time > 250)
                                break;
                                
                            if (inert[i].time < inert[j].time)
                                break;

                            var dt = inert[i].time - inert[j].time;
                            if (!avgt) {
                                avgt = dt;
                            } else {
                                avgt = (avgt + dt) / 2;
                            }

                            var dang = (inert[i].angle - inert[j].angle) / (inert[i].time - inert[j].time)
                            
                            if (!avgAng)
                                avgAng = dang;
                            else
                                avgAng = (avgAng + dang) / 2
                            
                            i -= 1; j -= 1; k -= 1;
                        }
                    }
                    
                    if (avgt < 250) {
                        var c = select.parent;
                        var ang0 = inert[inertIdx - 1].angle;
                        var c1 = c.getCircle(ang0).r;
                        var dang0 = inert[inertIdx - 1].angle - inert[inertIdx - 1].rawAngle;
                        var t0 = globalt0;//(new Date()).getTime();
                        var i = 1;
                        var di = 1;
                        function aInert () {
                            if (animating) {
                                var dt = (new Date()).getTime() - t0;
                                t0 = (new Date()).getTime();
                                if (dt === 0) dt = 1;

                                //var dd = Math.sqrt (avgX * avgX + avgY * avgY);
                                di = di - Math.pow (dt / Math.abs (avgAng) / Math.pow(250, 4), 0.25);
                                //di = di - dt / 500;
                                var sindi = Math.sin (di * Math.PI / 2);
                                if (di > 0){
                                    ang0 += avgAng * sindi * 20 * (c.getCircle(ang0).r / c1/*(rr * (1 - ratio))*/);
                                    c.setAngle (ang0 - dang0, inert[inertIdx - 1].percentRawAngle);

                                    redraw (null, "1+", select.cursor);
                                    
                                    window.requestAnimationFrame(aInert);
                                } else {
                                    animating = false;
                                    redraw ({x: mouse.x, y: mouse.y});
                                }
                            } else if (mouseDown === 1) {
                                animating = false;
                                preSelect = redraw ({x: mouse.x, y: mouse.y});
                            }
                        }

                        animating = true;
                        aInert();
                    }
                //}
                if (!animating) {
                    //window.requestAnimationFrame(function () {
                        redraw ({x: mouse.x, y: mouse.y});
                    //});
                }

            } else if (panning && inertPan.length > 1) {
                var avgX = 0;
                var avgY = 0;
                var avgt = 0;
                var i = inertIdxPan - 1
                var j = i - 1;
                var k = 2;
                if ((new Date()).getTime() - (inertIdxPan === 0? inertPan[inertPan.length - 1].time: inertPan[inertIdxPan - 1].time) < 250) {
                    while (i !== inertIdxPan && k > 0) {
                        if (i === 0)
                            j = inertPan.length - 1;
                        else
                            j = i - 1

                        if (!inertPan[i] || !inertPan[j])
                            break;
                            
                        if (inertPan[i].time - inertPan[j].time > 250) {
                            break;
                        }

                        if (inertPan[i].time < inertPan[j].time)
                            break;

                        var dt = inertPan[i].time - inertPan[j].time;
                        if (!avgt) {
                            avgt = dt;
                        } else {
                            avgt = (avgt + dt) / 2;
                        }

                        var dx = (inertPan[i].centerX - inertPan[j].centerX) / (inertPan[i].time - inertPan[j].time);
                        if (!avgX) {
                            avgX = dx;
                        } else {
                            avgX = (avgX + dx) / 2
                        }

                        var dy = (inertPan[i].centerY - inertPan[j].centerY) / (inertPan[i].time - inertPan[j].time);
                        if (!avgY) {
                            avgY = dy;
                        } else {
                            avgY = (avgY + dy) / 2
                        }

                        i -= 1; j -= 1; k -= 1;
                    }
                    
                    if (avgt < 250) {
                        var t0 = globalt0;//(new Date()).getTime();
                        var di = 1;
                        function dInert (select) {
                            if (animating) {
                                var dt = (new Date()).getTime() - t0;
                                t0 = (new Date()).getTime();
                                if (dt === 0) dt = 1;

                                var dd = Math.sqrt (avgX * avgX + avgY * avgY);
                                di = di - Math.pow (dt / dd / Math.pow(2000, 2), 0.25);
                                if (di > 0){
                                    var oldx = cursor.centerX;
                                    var oldy = cursor.centerY;
                                    setCenter (select, cursor.centerX + avgX * di * 25, cursor.centerY + avgY * di * 25);
                                    if (oldx != cursor.centerX || oldy != cursor.centerY) {
                                        redraw (null, "1", select.cursor);
                                        var sel = select;
                                        window.requestAnimationFrame(function () {
                                            //select = sel;
                                            dInert (sel);
                                        });
                                    } else {
                                        panning = false;
                                        animating = false;
                                        cursor.cachedCnv = false;
                                        redraw ({x: mouse.x, y: mouse.y});
                                    }

                                } else {
                                    panning = false;
                                    animating = false;
                                    cursor.cachedCnv = false;
                                    redraw ({x: mouse.x, y: mouse.y});
                                }
                            } else if (mouseDown === 1) {
                                var r0 = r1 * ratio;
                                var x0 = Math.floor (x1 * squashX);
                                var y0 = Math.floor ((y1 - (r1 - r0)) * squashY);
                                
                                if (Math.sqrt((dragX - x0) / squashX * (dragX - x0) / squashX + (dragY - y0) / squashY * (dragY - y0) / squashY) < r0) {
                                    //panning = false;
                                    //cursor.cachedCnv = false;

                                    //dragX = mouse.x;
                                    //dragY = mouse.y;
                                } else {
                                    panning = false;
                                    animating = false;
                                    cursor.cachedCnv = false;
                                    preSelect = redraw ({x: mouse.x, y: mouse.y});
                                }
                            }
                        }
                        animating = true;
                        dInert(select);
                    }
                }// else {
                
                if (!animating){
                    panning = false;
                    cursor.cachedCnv = false;
                    //window.requestAnimationFrame(function () {
                        redraw ({x: mouse.x, y: mouse.y});
                    //});
                }
                
            } else {
                dragging = false;
                panning = false;
                if (!animating) {
                    redraw ({x: mouse.x, y: mouse.y});
                }
            }
            
            //select = null;
        }
    }
    
    function setDimensions(width, height) {
        ww = width;
        hh = height;
        
        if (ww > hh / ratio) {
            rr = hh / 2;
            squashX = 1 / ratio;
            squashY = 1;
            
        } else if (hh > ww / ratio){
            rr = ww / 2;
            squashX = 1;
            squashY = 1 / ratio;
        } else {
            if (ww > hh) {
                rr = ww / 2 * ratio;
                squashX = 1 / ratio;
                squashY = 1;
            } else {
                rr = hh / 2 * ratio;
                squashX = 1;
                squashY = 1 / ratio;
            }
        }

        r1 = rr;
        x1 = ww / squashX / 2;
        y1 = hh / squashY / 2;
        
        xx = x1;
        yy = y1;
        
        
    }

    function resize(width, height) {
        setDimensions (width, height);
    
        fishEye = FishEye (rr, squashX, squashY, superSampling);

        function rec1 (c) {
            if (c.cachedCnv) {
                c.cachedCnv = false;
                c.cachedData = null;
            }
                
            for (var tmp in c.children)
                rec1 (c.children[tmp]);
                
        }
        
        var c = cursor;
        while (c.parent)
            c = c.parent;
        rec1 (c.children[0]);
        
        
        minRadius = rr * squashX * squashY * Math.pow((1 - ratio), recCount) * ratio;

        clip.setAttribute('cx', x1 * squashX);
        clip.setAttribute('cy', y1 * squashY);
        clip.setAttribute('rx', r1 * squashX);
        clip.setAttribute('ry', r1 * squashY);
        clip.setAttribute('stroke-width',  1);
        
        cnv.width = ww;
        cnv.height = hh;
        cnv.setAttribute ("width", ww);
        cnv.setAttribute ("height", hh);
        cnv.style.clipPath = "url(#clip128)";
        
        invalidateCache ();
        redraw ();
    }
    
    
    var mouse = {};
    var tt, ll, ww, hh, rr, xx, yy, w0, h0, squashX, squashY;
    var r1, x1, y1;
    var path = [], cursor, select, preSelect, animating, panning;
    var cnvScaled, fishEye;
    cursor = {parent: null, index: 0, centerX: 0, centerY: 0, cachedCnv:true, cachedData: null, angle: Math.PI, children: []}
    cursor.parent = {index: 0, children: [cursor]};

    var level, gettingLevel, animateAng0, animateAng2, animateAng2Start, curAnimateAng2;
    var lastMouseEvent, globalt0;

    var mouseDown = false;
    var dragX, dragY, dragging = false, oldCenterX, oldCenterY;
    var inert, inertIdx = 0;
    var inertPan, inertIdxPan = 0;
    
    var device = "mouse";

    var n = node();
    var movingNode = null;

    var clipPath = document.createElementNS(svgns, 'clipPath');
    clipPath.setAttributeNS(null, 'id', 'clip128');
    svg.appendChild(clipPath);

    var clip = document.createElementNS(svgns, 'ellipse');
    clipPath.appendChild(clip);

    function setupMouseEvents () {
        window.addEventListener('mousemove', function (evt) {
            device = "mouse";
            mousemove (evt)
        }, false);
        window.addEventListener('mousedown',  function (evt) {
            device = "mouse";
            mousedown (evt)
        }, false);
        window.addEventListener('mouseup',  function (evt) {
            device = "mouse";
            mouseup (evt)
        }, false);
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
            evt.preventDefault ();
            device = "touch";
            var touches = evt.changedTouches;
            
            for (var i = 0; i < touches.length; i++) {
                if (ongoingTouches.length === 0) {
                    ongoingTouches.push(copyTouch(touches[i]));
                    var idx = ongoingTouchIndexById(touches[i].identifier);
                    
                    if (idx >= 0) {
                        mousedown (ongoingTouches[idx]);
                    }
                }
            }
            /*
            if (evt.changedTouches.length == 1) {
                evt.changedTouches[0].which = 1;
                mousedown (evt.changedTouches[0]);
            }
            */
        }, false);

        window.addEventListener("touchmove", function (evt) {
            evt.preventDefault ();
            device = "touch";
            var touches = evt.changedTouches;

            for (var i = 0; i < touches.length; i++) {
                var idx = ongoingTouchIndexById(touches[i].identifier);

                if (idx >= 0) {
                    ongoingTouches[idx].pageX = touches[i].pageX;
                    ongoingTouches[idx].pageY = touches[i].pageY;
                    mousemove (ongoingTouches[idx]);
                }
            }
            /*
            if (evt.changedTouches.length == 1) {
                mousemove (evt.changedTouches[0]);
            }
            */
        }, false);

        window.addEventListener("touchcancel", function (evt) {
            device = "touch";
            var touches = evt.changedTouches;

            for (var i = 0; i < touches.length; i++) {
                var idx = ongoingTouchIndexById(touches[i].identifier);

                if (idx >= 0) {
                    ongoingTouches[idx].pageX = touches[i].pageX;
                    ongoingTouches[idx].pageY = touches[i].pageY;

                    mouseup (ongoingTouches[idx]);

                    ongoingTouches.splice(idx, 1);
                }
            }
        }, false);

        window.addEventListener("touchend", function (evt) {
            evt.preventDefault ();
            device = "touch";
            var touches = evt.changedTouches;

            for (var i = 0; i < touches.length; i++) {
                var idx = ongoingTouchIndexById(touches[i].identifier);

                if (idx >= 0) {
                    ongoingTouches[idx].pageX = touches[i].pageX;
                    ongoingTouches[idx].pageY = touches[i].pageY;
                    
                    mouseup (ongoingTouches[idx]);

                    ongoingTouches.splice(idx, 1);
                }
            }
            /*
            if (evt.changedTouches.length == 1) {
                mouseup (evt.changedTouches[0]);
            }
            */
        }, false);
    }
    
    setupMouseEvents ();
    setupTouchEvents ();

    /*
    var tmpim2 = document.getElementById("im");  
    var cnvim2 = document.createElement ("canvas");
    cnvim2.width = tmpim2.width;
    cnvim2.height = tmpim2.height;
    var ctxim2 = cnvim2.getContext('2d');
    ctxim2.drawImage(tmpim2, 0, 0);
    var cnvScaled = crispBitmapXY(cnvim2);
    */
    
    cnvScaled = Crisp.crispBitmapXY(generateGrid ("polar", 2500, 2500, 50, 1));

    //initFishEye();
    //var img = new Image();
    //img.crossOrigin = "Anonymous";
    //img.src = "https://e-teoria.github.io/Orbiteque/grid_20_20_md.gif";//"lorem.png";
    //img.onload = function (e) {
    //    cnvim.width = img.width;
    //    cnvim.height = img.height;
    //    ctxim.drawImage(img, 0, 0);
    
//        resize(svgContainer.clientWidth, svgContainer.clientHeight);
    //}

    
    //var fishEye; //init in resize ... = initFishEye ();
    /*
    // offscreen
    var cnvos = document.createElement ("canvas");
    cnvos.width = rr * squashX;
    cnvos.height = rr * squashY;
    var ctxos = cnvos.getContext('2d');
    var imgos = ctxos.getImageData(0, 0, cnvos.width, cnvos.height);
    */
    
    return {
        resize: resize
    }
}
