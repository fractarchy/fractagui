/**
 * 
 * @returns {ForeignHtmlRenderer} 
 */
const renderHtml = (function() {
    'use strict'
    
    /**
     * 
     * @param {String} contentHtml 
     * @param {StyleSheetList} styleSheets 
     * @param {BaseUrlObject} baseUrl 
     * @param {Number} width
     * @param {Number} height
     * 
     * @returns {Promise<String>}
     */
    const ForeignHtmlRenderer = function(iframe, baseUrl, width, height, removeIframe) {
            
        const self = this;

        /**
         * 
         * @param {String} binStr 
         */
        const binaryStringToBase64 = function(binStr) {
            return new Promise(function(resolve) {
                const reader = new FileReader();
                reader.readAsDataURL(binStr); 
                reader.onloadend = function() {
                    resolve(reader.result);
                }  
            });     
        };

        /**
         * 
         * @param {String} url 
         * @returns {Promise}
         */
        const getResourceAsBase64 = function(url) {
            return new Promise(function(resolve, reject) {
                const xhr = new XMLHttpRequest();
                xhr.open("GET", new URL(url, baseUrl))
                xhr.responseType = 'blob';

                xhr.onreadystatechange = async function() {
                    if(xhr.readyState === 4 && xhr.status === 200) {
                        const resBase64 = await binaryStringToBase64(xhr.response);
                        resolve(
                            {
                                "resourceUrl": url,
                                "resourceBase64": resBase64
                            }
                        );
                    }
                };

                xhr.send(null);
            });
        };

        /**
         * 
         * @param {String[]} urls 
         * @returns {Promise}
         */
        const getMultipleResourcesAsBase64 = function(urls) {
            const promises = [];
            for(let i=0; i<urls.length; i++) {
                promises.push( getResourceAsBase64(urls[i]) );
            }
            return Promise.all(promises);
        };

        /**
         * 
         * @param {String} str 
         * @param {Number} startIndex 
         * @param {String} prefixToken 
         * @param {String[]} suffixTokens
         * 
         * @returns {String|null} 
         */
        const parseValue = function(str, startIndex, prefixToken, suffixTokens) {
            const idx = str.toLowerCase().indexOf(prefixToken, startIndex);
            if(idx === -1) {
                return null;
            }

            let val = '';
            for(let i=idx+prefixToken.length; i<str.length; i++) {
                if(suffixTokens.indexOf(str[i].toLowerCase()) !== -1) {
                    break;
                }

                val += str[i];
            }

            return {
                "foundAtIndex": idx,
                "value": val
            }
        };

        /**
         * 
         * @param {String} cssRuleStr 
         * @returns {String[]}
         */
        const getUrlsFromCssString = function(cssRuleStr) {
            const urlsFound = [];
            let searchStartIndex = 0;

            while(true) {
                const url = parseValue(cssRuleStr, searchStartIndex, "url(", [')']);
                if(url === null) {
                    break;
                }

                searchStartIndex = url.foundAtIndex + url.value.length;
                urlsFound.push(removeQuotes(url.value));
            }

            return urlsFound;
        };    


        /**
         * 
         * @param {String} str
         * @returns {String}
         */
        const removeQuotes = function(str) {
            return str.replace(/["']/g, "");
        };

        const escapeRegExp = function(string) {
            return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
        };

        /**
         * 
         * @param {String} cssText
         * @returns {Promise<String>}
         */
        const inlineCssText = async function(cssText) {
            return new Promise(async function(resolve, reject) {
                let urlsFoundInStyle = getUrlsFromCssString(cssText);
                const fetchedResources = await getMultipleResourcesAsBase64(urlsFoundInStyle);
                for(let j=0; j<fetchedResources.length; j++) {
                    const r = fetchedResources[j];
                    cssText = cssText.replace(new RegExp(escapeRegExp(r.resourceUrl),"g"), r.resourceBase64);
                }
                
                resolve(cssText);
            });
        }

        /**
         * 
         * @param {StyleSheet} styleSheet
         * @returns {String|urlList}
         */
        const outlineStylesheet = async function(styleSheet) {
            return new Promise(async function(resolve, reject) {
                let cssStyles = "";
                for(let i=0; i<styleSheet.cssRules.length; i++) {
                    const rule = styleSheet.cssRules[i];
                    if (!rule.conditionText) {
                        cssStyles += await inlineCssText(rule.cssText) + " \n";

                    } else if (window.matchMedia(rule.conditionText).matches) {
                        cssStyles += await outlineStylesheet(rule);
                    }

                    cssStyles=cssStyles;
                }

                resolve(cssStyles);
            });
        }
        
        /**
         * 
         * @param {HTMLElement} node
         */
        const inlineAttributes = async function(node) {
            var attrs = node.attributes;
            if (attrs) {
                var output = "";
                for(let i = attrs.length - 1; i >= 0; i--) {
                    if (attrs[i].name === "src") {
                        const fetchedResources = await getMultipleResourcesAsBase64([attrs[i].value]);
                        attrs[i].value = fetchedResources[0].resourceBase64;
                        
                    } else if (attrs[i].name === "style") {
                        attrs[i].value = await inlineCssText(attrs[i].value);
                    }
                }
            }
        }

        /**
         * 
         * @returns {Promise<String>}
         */
        this.toSvg = async function() {
            return new Promise(async function(resolve, reject) {
                
                const docElem = iframe.contentDocument.cloneNode(true);

                // outline styles
                var cssStyles = "";
                let styleSheets = iframe.contentDocument.styleSheets;
                for (let i=0; i<styleSheets.length; i++)
                    cssStyles += await outlineStylesheet(styleSheets[i]);
                
                // create DOM element string that encapsulates style
                const styleElem = document.createElement("style");
                styleElem.innerHTML = cssStyles;
                
                // inline body attributes
                const bodyElem = docElem.body;
                inlineAttributes(bodyElem);
                let elements = bodyElem.getElementsByTagName("*");
                for(let i=0; i < elements.length; i++)
                    await inlineAttributes(elements[i]);

                const styleElemString = new XMLSerializer().serializeToString(styleElem);
                const bodyElemString = new XMLSerializer().serializeToString(bodyElem);
                
                const svg = `
                    <svg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}'>
                        <g transform='translate(0, 0) rotate(0)'>
                            <foreignObject x='0' y='0' width='${width}' height='${height}'>
                                <html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
                                    <head>
                                        ${styleElemString}
                                    </head>
                                    ${bodyElemString}
                                </html>
                            </foreignObject>
                        </g>
                    </svg>
                `;

                const unescapedSvg = unescape(encodeURIComponent(svg));
                const dataUri = `data:image/svg+xml;base64,${window.btoa(unescapedSvg)}`;

                
                if (removeIframe)
                    removeIframe.remove();

                resolve(dataUri);                    
            });
        };

        /**
         * 
         * @return {Promise<Image>}
         */
        this.toImage = async function() {
            return new Promise(async function(resolve, reject) {
                const img = new Image();
                img.src = await self.toSvg();
        
                img.onload = function() {
                    resolve(img);
                };
            });
        };

        /**
         * 
         * @return {Promise<Image>}
         */
        this.toCanvas = async function() {
            return new Promise(async function(resolve, reject) {
                const img = await self.toImage();

                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;

                const canvasCtx = canvas.getContext('2d');
                canvasCtx.drawImage(img, 0, 0, img.width, img.height);

                resolve(canvas);
            });
        };    

        /**
         * 
         * @return {Promise<String>}
         */
        this.toBase64Png = async function() {
            return new Promise(async function(resolve, reject) {
                const canvas = await self.toCanvas();
                resolve(canvas.toDataURL('image/png'));
            });
        };

    };

    let setSource = {
        fromIframe: async function(iframe, removeIframe) {
            return new Promise(async function(resolve, reject) {
                var baseUrl;
                if (iframe.src)
                    baseUrl = iframe.src;
                
                else
                    baseUrl = "";

                const base = document.createElement('base');
                base.href = baseUrl;//iframe.src;
                const head = document.getElementsByTagName('head')[0];
                head.insertBefore(base, head.childNodes[0]);
                baseUrl = base.baseURI.substring(0, base.baseURI.lastIndexOf("/") + 1);
                base.remove();

                const body = iframe.contentDocument.body;
                const width = body.scrollLeft + body.scrollWidth;
                const height = body.scrollTop + body.scrollHeight;
                
                resolve(new ForeignHtmlRenderer(iframe, baseUrl, width, height, removeIframe));
            });
        },
        
        fromString: async function(strHtml) {
            return new Promise(async function(resolve, reject) {
                const iframe1 = document.createElement(`iframe`);
                iframe1.style.visibility = "hidden";
                document.body.appendChild(iframe1);
                
                iframe1.onload = async function () {
                    resolve(await setSource["fromIframe"](iframe1, iframe1));
                };
                
                iframe1.srcdoc = strHtml;
            });
        },
        
        fromFile: async function(urlHtml) {
            return new Promise(async function(resolve, reject) {
                const iframe1 = document.createElement(`iframe`);
                iframe1.style.visibility = "hidden";
                document.body.appendChild(iframe1);
                
                iframe1.onload = async function () {
                    resolve(await setSource["fromIframe"](iframe1, iframe1));
                };
                
                iframe1.src = urlHtml;
            });
        }
    };

    function getRenderer (constructor, param) {
        this.toBase64Svg = async function() {
            return new Promise(async function(resolve, reject) {
                let foreignHtmlRenderer = await setSource[constructor](param);
                resolve(foreignHtmlRenderer.toSvg());
            });
        };
        
        this.toImage = async function() {
            return new Promise(async function(resolve, reject) {
                let foreignHtmlRenderer = await setSource[constructor](param);
                resolve(foreignHtmlRenderer.toImage());
            });
        };
        
        this.toCanvas = async function() {
            return new Promise(async function(resolve, reject) {
                let foreignHtmlRenderer = await setSource[constructor](param);
                resolve(foreignHtmlRenderer.toCanvas());
            });
        };
        
        this.toBase64Png = async function() {
            return new Promise(async function(resolve, reject) {
                let foreignHtmlRenderer = await setSource[constructor](param);
                resolve(foreignHtmlRenderer.toBase64Png());
            });
        }
    }

    return {
        foreignHtmlRenderer: ForeignHtmlRenderer,
        fromIframe: function(iframe) {
            return new getRenderer("fromIframe", iframe);
        },
        fromString: function(strHtml) {
            return new getRenderer("fromString", strHtml);
        },
        fromFile: function(fileName) {
            return new getRenderer("fromFile", fileName);
        }
    };
})();

