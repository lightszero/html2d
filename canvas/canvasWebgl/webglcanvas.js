"use strict";
//v0.6
var lighttool;
//v0.6
(function (lighttool) {
    var canvaspointevent;
    (function (canvaspointevent) {
        canvaspointevent[canvaspointevent["NONE"] = 0] = "NONE";
        canvaspointevent[canvaspointevent["POINT_DOWN"] = 1] = "POINT_DOWN";
        canvaspointevent[canvaspointevent["POINT_UP"] = 2] = "POINT_UP";
        canvaspointevent[canvaspointevent["POINT_MOVE"] = 3] = "POINT_MOVE";
    })(canvaspointevent = lighttool.canvaspointevent || (lighttool.canvaspointevent = {}));
    var spriteCanvas = /** @class */ (function () {
        function spriteCanvas(webgl, width, height) {
            this.uvrect = new lighttool.spriteRect();
            this.trect = new lighttool.spriteRect(); //ness
            this.webgl = webgl;
            this.width = width;
            this.height = height;
            this.spriteBatcher = new lighttool.spriteBatcher(webgl, lighttool.shaderMgr.parserInstance()); //ness
        }
        //draw tools
        spriteCanvas.prototype.drawTexture = function (texture, rect, uvrect, color) {
            if (uvrect === void 0) { uvrect = lighttool.spriteRect.one; }
            if (color === void 0) { color = lighttool.spriteColor.white; }
            texture.draw(this.spriteBatcher, uvrect, rect, color);
        };
        spriteCanvas.prototype.drawTextureCustom = function (texture, _mat, rect, uvrect, color, color2) {
            if (uvrect === void 0) { uvrect = lighttool.spriteRect.one; }
            if (color === void 0) { color = lighttool.spriteColor.white; }
            if (color2 === void 0) { color2 = lighttool.spriteColor.white; }
            texture.drawCustom(this.spriteBatcher, _mat, uvrect, rect, color, color2);
        };
        spriteCanvas.prototype.drawSprite = function (atlas, sprite, rect, color) {
            if (color === void 0) { color = lighttool.spriteColor.white; }
            var a = lighttool.atlasMgr.Instance().load(this.webgl, atlas);
            if (a == null)
                return;
            var r = a.sprites[sprite];
            if (r == undefined)
                return;
            if (a.texture == null)
                return;
            a.texture.draw(this.spriteBatcher, r, rect, color);
        };
        spriteCanvas.prototype.drawSpriteCustom = function (atlas, sprite, _mat, rect, color, color2) {
            if (color === void 0) { color = lighttool.spriteColor.white; }
            if (color2 === void 0) { color2 = lighttool.spriteColor.white; }
            var a = lighttool.atlasMgr.Instance().load(this.webgl, atlas);
            if (a == null)
                return;
            var r = a.sprites[sprite];
            if (r == undefined)
                return;
            if (a.texture == null)
                return;
            a.texture.drawCustom(this.spriteBatcher, _mat, r, rect, color, color2);
        };
        spriteCanvas.prototype.drawSprite9 = function (atlas, sprite, rect, border, color) {
            if (color === void 0) { color = lighttool.spriteColor.white; }
            var a = lighttool.atlasMgr.Instance().load(this.webgl, atlas);
            if (a == null)
                return;
            var _r = a.sprites[sprite];
            if (_r == undefined)
                return;
            if (a.texture == null)
                return;
            var l = (border.l - 1) / a.texturewidth;
            var r = (border.r - 1) / a.texturewidth;
            var t = (border.t - 1) / a.textureheight;
            var b = (border.b - 1) / a.textureheight;
            //left top
            this.uvrect.x = _r.x;
            this.uvrect.y = _r.y;
            this.uvrect.w = l;
            this.uvrect.h = t;
            this.trect.x = rect.x;
            this.trect.y = rect.y;
            this.trect.w = border.l;
            this.trect.h = border.t;
            a.texture.draw(this.spriteBatcher, this.uvrect, this.trect, color);
            //top
            this.uvrect.x = _r.x + l;
            this.uvrect.y = _r.y;
            this.uvrect.w = _r.w - r - l;
            this.uvrect.h = t;
            this.trect.x = rect.x + border.l;
            this.trect.y = rect.y;
            this.trect.w = rect.w - border.r - border.l;
            this.trect.h = border.t;
            a.texture.draw(this.spriteBatcher, this.uvrect, this.trect, color);
            //right top
            this.uvrect.x = _r.x + _r.w - r;
            this.uvrect.y = _r.y;
            this.uvrect.w = r;
            this.uvrect.h = t;
            this.trect.x = rect.x + rect.w - border.r;
            this.trect.y = rect.y;
            this.trect.w = border.r;
            this.trect.h = border.t;
            a.texture.draw(this.spriteBatcher, this.uvrect, this.trect, color);
            //left
            this.uvrect.x = _r.x;
            this.uvrect.y = _r.y + t;
            this.uvrect.w = l;
            this.uvrect.h = _r.h - t - b;
            this.trect.x = rect.x;
            this.trect.y = rect.y + border.t;
            this.trect.w = border.l;
            this.trect.h = rect.h - border.t - border.b;
            a.texture.draw(this.spriteBatcher, this.uvrect, this.trect, color);
            //center
            this.uvrect.x = _r.x + l;
            this.uvrect.y = _r.y + t;
            this.uvrect.w = _r.w - r - l;
            this.uvrect.h = _r.h - t - b;
            this.trect.x = rect.x + border.l;
            this.trect.y = rect.y + border.t;
            this.trect.w = rect.w - border.r - border.l;
            this.trect.h = rect.h - border.t - border.b;
            a.texture.draw(this.spriteBatcher, this.uvrect, this.trect, color);
            //right
            this.uvrect.x = _r.x + _r.w - r;
            this.uvrect.y = _r.y + t;
            this.uvrect.w = r;
            this.uvrect.h = _r.h - t - b;
            this.trect.x = rect.x + rect.w - border.r;
            this.trect.y = rect.y + border.t;
            this.trect.w = border.r;
            this.trect.h = rect.h - border.t - border.b;
            a.texture.draw(this.spriteBatcher, this.uvrect, this.trect, color);
            //left bottom
            this.uvrect.x = _r.x;
            this.uvrect.y = _r.h + _r.y - b;
            this.uvrect.w = l;
            this.uvrect.h = b;
            this.trect.x = rect.x;
            this.trect.y = rect.y + rect.h - border.b;
            this.trect.w = border.l;
            this.trect.h = border.b;
            a.texture.draw(this.spriteBatcher, this.uvrect, this.trect, color);
            //bottom
            this.uvrect.x = _r.x + l;
            this.uvrect.y = _r.h + _r.y - b;
            this.uvrect.w = _r.w - r - l;
            this.uvrect.h = b;
            this.trect.x = rect.x + border.l;
            this.trect.y = rect.y + rect.h - border.b;
            this.trect.w = rect.w - border.r - border.l;
            this.trect.h = border.b;
            a.texture.draw(this.spriteBatcher, this.uvrect, this.trect, color);
            //right bottom
            this.uvrect.x = _r.x + _r.w - r;
            this.uvrect.y = _r.h + _r.y - b;
            this.uvrect.w = r;
            this.uvrect.h = b;
            this.trect.x = rect.x + rect.w - border.r;
            this.trect.y = rect.y + rect.h - border.b;
            this.trect.w = border.r;
            this.trect.h = border.b;
            a.texture.draw(this.spriteBatcher, this.uvrect, this.trect, color);
        };
        spriteCanvas.prototype.drawSprite9Custom = function (atlas, sprite, _mat, rect, border, color, color2) {
            if (color === void 0) { color = lighttool.spriteColor.white; }
            if (color2 === void 0) { color2 = lighttool.spriteColor.white; }
            var a = lighttool.atlasMgr.Instance().load(this.webgl, atlas);
            if (a == null)
                return;
            var _r = a.sprites[sprite];
            if (_r == undefined)
                return;
            if (a.texture == null)
                return;
            var l = (border.l - 1) / a.texturewidth;
            var r = (border.r - 1) / a.texturewidth;
            var t = (border.t - 1) / a.textureheight;
            var b = (border.b - 1) / a.textureheight;
            //left top
            this.uvrect.x = _r.x;
            this.uvrect.y = _r.y;
            this.uvrect.w = l;
            this.uvrect.h = t;
            this.trect.x = rect.x;
            this.trect.y = rect.y;
            this.trect.w = border.l;
            this.trect.h = border.t;
            a.texture.drawCustom(this.spriteBatcher, _mat, this.uvrect, this.trect, color, color2);
            //top
            this.uvrect.x = _r.x + l;
            this.uvrect.y = _r.y;
            this.uvrect.w = _r.w - r - l;
            this.uvrect.h = t;
            this.trect.x = rect.x + border.l;
            this.trect.y = rect.y;
            this.trect.w = rect.w - border.r - border.l;
            this.trect.h = border.t;
            a.texture.drawCustom(this.spriteBatcher, _mat, this.uvrect, this.trect, color, color2);
            //right top
            this.uvrect.x = _r.x + _r.w - r;
            this.uvrect.y = _r.y;
            this.uvrect.w = r;
            this.uvrect.h = t;
            this.trect.x = rect.x + rect.w - border.r;
            this.trect.y = rect.y;
            this.trect.w = border.r;
            this.trect.h = border.t;
            a.texture.drawCustom(this.spriteBatcher, _mat, this.uvrect, this.trect, color, color2);
            //left
            this.uvrect.x = _r.x;
            this.uvrect.y = _r.y + t;
            this.uvrect.w = l;
            this.uvrect.h = _r.h - t - b;
            this.trect.x = rect.x;
            this.trect.y = rect.y + border.t;
            this.trect.w = border.l;
            this.trect.h = rect.h - border.t - border.b;
            a.texture.drawCustom(this.spriteBatcher, _mat, this.uvrect, this.trect, color, color2);
            //center
            this.uvrect.x = _r.x + l;
            this.uvrect.y = _r.y + t;
            this.uvrect.w = _r.w - r - l;
            this.uvrect.h = _r.h - t - b;
            this.trect.x = rect.x + border.l;
            this.trect.y = rect.y + border.t;
            this.trect.w = rect.w - border.r - border.l;
            this.trect.h = rect.h - border.t - border.b;
            a.texture.drawCustom(this.spriteBatcher, _mat, this.uvrect, this.trect, color, color2);
            //right
            this.uvrect.x = _r.x + _r.w - r;
            this.uvrect.y = _r.y + t;
            this.uvrect.w = r;
            this.uvrect.h = _r.h - t - b;
            this.trect.x = rect.x + rect.w - border.r;
            this.trect.y = rect.y + border.t;
            this.trect.w = border.r;
            this.trect.h = rect.h - border.t - border.b;
            a.texture.drawCustom(this.spriteBatcher, _mat, this.uvrect, this.trect, color, color2);
            //left bottom
            this.uvrect.x = _r.x;
            this.uvrect.y = _r.h + _r.y - b;
            this.uvrect.w = l;
            this.uvrect.h = b;
            this.trect.x = rect.x;
            this.trect.y = rect.y + rect.h - border.b;
            this.trect.w = border.l;
            this.trect.h = border.b;
            a.texture.drawCustom(this.spriteBatcher, _mat, this.uvrect, this.trect, color, color2);
            //bottom
            this.uvrect.x = _r.x + l;
            this.uvrect.y = _r.h + _r.y - b;
            this.uvrect.w = _r.w - r - l;
            this.uvrect.h = b;
            this.trect.x = rect.x + border.l;
            this.trect.y = rect.y + rect.h - border.b;
            this.trect.w = rect.w - border.r - border.l;
            this.trect.h = border.b;
            a.texture.drawCustom(this.spriteBatcher, _mat, this.uvrect, this.trect, color, color2);
            //right bottom
            this.uvrect.x = _r.x + _r.w - r;
            this.uvrect.y = _r.h + _r.y - b;
            this.uvrect.w = r;
            this.uvrect.h = b;
            this.trect.x = rect.x + rect.w - border.r;
            this.trect.y = rect.y + rect.h - border.b;
            this.trect.w = border.r;
            this.trect.h = border.b;
            a.texture.drawCustom(this.spriteBatcher, _mat, this.uvrect, this.trect, color, color2);
        };
        //绘制字体，只画一行，字体沿着左上角对齐，如需其他，参考源码自制
        spriteCanvas.prototype.drawText = function (font, text, rect, color, color2) {
            if (color === void 0) { color = lighttool.spriteColor.white; }
            if (color2 === void 0) { color2 = lighttool.spriteColor.black; }
            var f = lighttool.fontMgr.Instance().load(this.webgl, font);
            if (f == null)
                return;
            if (f.cmap == undefined)
                return;
            var xadd = 0;
            for (var i = 0; i < text.length; i++) {
                var c = text.charAt(i);
                var cinfo = f.cmap[c];
                if (cinfo == undefined) {
                    continue;
                }
                var s = rect.h / f.lineHeight;
                this.trect.x = rect.x + xadd + cinfo.xOffset * s; //xadd 横移，cinfo.xOffset * s 偏移
                this.trect.y = rect.y - cinfo.yOffset * s + f.baseline * s;
                //cinfo.yOffset * s 偏移
                //f.baseline * s字体基线，不管字体基线字体的零零点在字体左下角，现在需要左上脚，需要其他对齐方式另说
                this.trect.h = s * cinfo.ySize;
                this.trect.w = s * cinfo.xSize;
                xadd += cinfo.xAddvance * s;
                if (xadd >= rect.w)
                    break; //超出绘制限定框，不画了
                f.draw(this.spriteBatcher, cinfo, this.trect, color, color2);
            }
        };
        return spriteCanvas;
    }());
    lighttool.spriteCanvas = spriteCanvas;
})(lighttool || (lighttool = {}));
//v0.4
var lighttool;
//v0.4
(function (lighttool) {
    var texutreMgrItem = /** @class */ (function () {
        function texutreMgrItem() {
            this.tex = null;
            this.url = "";
            this.urladd = "";
            this.format = lighttool.textureformat.RGB;
            this.mipmap = false;
            this.linear = false;
        }
        return texutreMgrItem;
    }());
    lighttool.texutreMgrItem = texutreMgrItem;
    var textureMgr = /** @class */ (function () {
        function textureMgr() {
            this.mapInfo = {};
        }
        textureMgr.Instance = function () {
            if (textureMgr.g_this == null)
                textureMgr.g_this = new textureMgr(); //ness
            return textureMgr.g_this;
        };
        textureMgr.prototype.reg = function (url, urladd, format, mipmap, linear) {
            //重复注册处理
            var item = this.mapInfo[url];
            if (item != undefined) {
                throw new Error("you can't reg the same name"); //ness
            }
            item = new texutreMgrItem(); //ness
            this.mapInfo[url] = item;
            item.url = url;
            item.urladd = urladd;
            item.format = format;
            item.mipmap = mipmap;
            item.linear = linear;
        };
        textureMgr.prototype.regDirect = function (url, tex) {
            var item = this.mapInfo[url];
            if (item != undefined) {
                throw new Error("you can't reg the same name"); //ness
            }
            item = new texutreMgrItem(); //ness
            this.mapInfo[url] = item;
            item.url = url;
            item.tex = tex;
        };
        textureMgr.prototype.unreg = function (url) {
            var item = this.mapInfo[url];
            if (item == undefined)
                return;
            this.unload(url);
            delete this.mapInfo[url]; // = undefined;
        };
        textureMgr.prototype.unload = function (url) {
            var item = this.mapInfo[url];
            if (item == undefined)
                return;
            item.tex.dispose();
            item.tex = null;
        };
        textureMgr.prototype.load = function (webgl, url) {
            var item = this.mapInfo[url];
            if (item == undefined)
                return null;
            if (item.tex == null) {
                item.tex = new lighttool.spriteTexture(webgl, item.url + item.urladd, item.format, item.mipmap, item.linear); //ness
            }
            return item.tex;
        };
        return textureMgr;
    }());
    lighttool.textureMgr = textureMgr;
    var atlasMgrItem = /** @class */ (function () {
        function atlasMgrItem() {
            this.atals = null;
            this.url = "";
            this.urlatalstex = "";
            this.urlatalstex_add = "";
        }
        return atlasMgrItem;
    }());
    lighttool.atlasMgrItem = atlasMgrItem;
    var atlasMgr = /** @class */ (function () {
        function atlasMgr() {
            this.mapInfo = {};
        }
        atlasMgr.Instance = function () {
            if (atlasMgr.g_this == null)
                atlasMgr.g_this = new atlasMgr(); //ness
            return atlasMgr.g_this;
        };
        atlasMgr.prototype.reg = function (name, urlatlas, urlatalstex, urlatalstex_add) {
            //重复注册处理
            var item = this.mapInfo[name];
            if (item != undefined) {
                throw new Error("you can't reg the same name"); //ness
            }
            item = new atlasMgrItem(); //ness
            this.mapInfo[name] = item;
            item.url = urlatlas;
            item.urlatalstex = urlatalstex;
            item.urlatalstex_add = urlatalstex_add;
        };
        atlasMgr.prototype.unreg = function (name, disposetex) {
            var item = this.mapInfo[name];
            if (item == undefined)
                return;
            this.unload(name, disposetex);
            delete this.mapInfo[name];
        };
        atlasMgr.prototype.regDirect = function (name, atlas) {
            var item = this.mapInfo[name];
            if (item != undefined) {
                throw new Error("you can't reg the same name"); //ness
            }
            item = new atlasMgrItem(); //ness
            this.mapInfo[name] = item;
            item.atals = atlas;
        };
        atlasMgr.prototype.unload = function (name, disposetex) {
            var item = this.mapInfo[name];
            if (item == undefined)
                return;
            if (disposetex) {
                if (item.atals && item.atals.texture) {
                    item.atals.texture.dispose();
                    item.atals.texture = null;
                }
            }
            item.atals = null;
        };
        atlasMgr.prototype.load = function (webgl, name) {
            var item = this.mapInfo[name];
            if (item == undefined)
                return null;
            if (item.atals == null) {
                var tex = textureMgr.Instance().load(webgl, item.urlatalstex);
                if (tex == undefined) {
                    textureMgr.Instance().reg(item.urlatalstex, item.urlatalstex_add, lighttool.textureformat.RGBA, false, true);
                    tex = textureMgr.Instance().load(webgl, item.urlatalstex);
                }
                item.atals = new lighttool.spriteAtlas(webgl, item.url, tex); //ness
            }
            return item.atals;
        };
        return atlasMgr;
    }());
    lighttool.atlasMgr = atlasMgr;
    var fontMgrItem = /** @class */ (function () {
        function fontMgrItem() {
            this.font = null;
            this.url = "";
            this.urlatalstex = "";
            this.urlatalstex_add = "";
        }
        return fontMgrItem;
    }());
    lighttool.fontMgrItem = fontMgrItem;
    var fontMgr = /** @class */ (function () {
        function fontMgr() {
            this.mapInfo = {};
        }
        fontMgr.Instance = function () {
            if (fontMgr.g_this == null)
                fontMgr.g_this = new fontMgr(); //ness
            return fontMgr.g_this;
        };
        fontMgr.prototype.reg = function (name, urlfont, urlatalstex, urlatalstex_add) {
            //重复注册处理
            var item = this.mapInfo[name];
            if (item != undefined) {
                throw new Error("you can't reg the same name"); //ness
            }
            item = new fontMgrItem(); //ness
            this.mapInfo[name] = item;
            item.url = urlfont;
            item.urlatalstex = urlatalstex;
            item.urlatalstex_add = urlatalstex_add;
        };
        fontMgr.prototype.regDirect = function (name, font) {
            var item = this.mapInfo[name];
            if (item != undefined) {
                throw new Error("you can't reg the same name"); //ness
            }
            item = new fontMgrItem(); //ness
            this.mapInfo[name] = item;
            item.font = font;
        };
        fontMgr.prototype.unreg = function (name, disposetex) {
            var item = this.mapInfo[name];
            if (item == undefined)
                return;
            this.unload(name, disposetex);
            delete this.mapInfo[name];
        };
        fontMgr.prototype.unload = function (name, disposetex) {
            var item = this.mapInfo[name];
            if (item == undefined)
                return;
            if (disposetex && item.font && item.font.texture) {
                item.font.texture.dispose();
                item.font.texture = null;
            }
            item.font = null;
        };
        fontMgr.prototype.load = function (webgl, name) {
            var item = this.mapInfo[name];
            if (item == undefined)
                return null;
            if (item.font == null) {
                var tex = textureMgr.Instance().load(webgl, item.urlatalstex);
                if (tex == null) {
                    textureMgr.Instance().reg(item.urlatalstex, item.urlatalstex_add, lighttool.textureformat.GRAY, false, true);
                    tex = textureMgr.Instance().load(webgl, item.urlatalstex);
                }
                if (tex != null) {
                    item.font = new lighttool.spriteFont(webgl, item.url, tex); //ness
                }
            }
            return item.font;
        };
        return fontMgr;
    }());
    lighttool.fontMgr = fontMgr;
    var shaderMgr = /** @class */ (function () {
        function shaderMgr() {
        }
        shaderMgr.parserInstance = function () {
            if (shaderMgr.g_shaderParser == null)
                shaderMgr.g_shaderParser = new lighttool.shaderParser(); //ness
            return shaderMgr.g_shaderParser;
        };
        return shaderMgr;
    }());
    lighttool.shaderMgr = shaderMgr;
})(lighttool || (lighttool = {}));
//v0.75
var lighttool;
//v0.75
(function (lighttool) {
    //加载工具
    var loadTool = /** @class */ (function () {
        function loadTool() {
        }
        loadTool.loadText = function (url, fun) {
            var req = new XMLHttpRequest(); //ness
            req.open("GET", url);
            req.onreadystatechange = function () {
                if (req.readyState == 4) {
                    fun(req.responseText, null);
                }
            };
            req.onerror = function () {
                fun(null, new Error("onerr in req:")); //ness
            };
            req.send();
        };
        loadTool.loadArrayBuffer = function (url, fun) {
            var req = new XMLHttpRequest(); //ness
            req.open("GET", url);
            req.responseType = "arraybuffer"; //ie 一定要在open之后修改responseType
            req.onreadystatechange = function () {
                if (req.readyState == 4) {
                    //console.log("got bin:" + typeof (req.response) + req.responseType);
                    fun(req.response, null);
                }
            };
            req.onerror = function () {
                fun(null, new Error("onerr in req:")); //ness
            };
            req.send();
        };
        loadTool.loadBlob = function (url, fun) {
            var req = new XMLHttpRequest(); //ness
            req.open("GET", url);
            req.responseType = "blob"; //ie 一定要在open之后修改responseType
            req.onreadystatechange = function () {
                if (req.readyState == 4) {
                    //console.log("got _blob:" + typeof (req.response) + req.responseType);
                    fun(req.response, null);
                }
            };
            req.onerror = function () {
                fun(null, new Error("onerr in req:")); //ness
            };
            req.send();
        };
        return loadTool;
    }());
    lighttool.loadTool = loadTool;
    //shader
    var shadercode = /** @class */ (function () {
        function shadercode() {
            this.vscode = "";
            this.fscode = "";
            this.vs = null;
            this.fs = null;
            this.program = null;
            this.posPos = -1;
            this.posColor = -1;
            this.posColor2 = -1;
            this.posUV = -1;
            this.uniMatrix = null;
            this.uniTex0 = null;
            this.uniTex1 = null;
            this.uniCol0 = null;
            this.uniCol1 = null;
        }
        shadercode.prototype.compile = function (webgl) {
            this.vs = webgl.createShader(webgl.VERTEX_SHADER);
            this.fs = webgl.createShader(webgl.FRAGMENT_SHADER);
            //分别编译shader
            webgl.shaderSource(this.vs, this.vscode);
            webgl.compileShader(this.vs);
            var r1 = webgl.getShaderParameter(this.vs, webgl.COMPILE_STATUS);
            if (r1 == false) {
                alert(webgl.getShaderInfoLog(this.vs));
            }
            //
            webgl.shaderSource(this.fs, this.fscode);
            webgl.compileShader(this.fs);
            var r2 = webgl.getShaderParameter(this.fs, webgl.COMPILE_STATUS);
            if (r2 == false) {
                alert(webgl.getShaderInfoLog(this.fs));
            }
            //program link
            this.program = webgl.createProgram();
            webgl.attachShader(this.program, this.vs);
            webgl.attachShader(this.program, this.fs);
            webgl.linkProgram(this.program);
            var r3 = webgl.getProgramParameter(this.program, webgl.LINK_STATUS);
            if (r3 == false) {
                alert(webgl.getProgramInfoLog(this.program));
            }
            //绑定vbo和shader顶点格式，这部分应该要区分材质改变与参数改变，可以少切换一些状态
            this.posPos = webgl.getAttribLocation(this.program, "position");
            this.posColor = webgl.getAttribLocation(this.program, "color");
            this.posColor2 = webgl.getAttribLocation(this.program, "color2");
            this.posUV = webgl.getAttribLocation(this.program, "uv");
            this.uniMatrix = webgl.getUniformLocation(this.program, "matrix");
            this.uniTex0 = webgl.getUniformLocation(this.program, "tex0");
            this.uniTex1 = webgl.getUniformLocation(this.program, "tex1");
            this.uniCol0 = webgl.getUniformLocation(this.program, "col0");
            this.uniCol1 = webgl.getUniformLocation(this.program, "col1");
        };
        return shadercode;
    }());
    lighttool.shadercode = shadercode;
    var shaderParser = /** @class */ (function () {
        function shaderParser() {
            this.mapshader = {};
        }
        shaderParser.prototype._parser = function (txt) {
            var s1 = txt.split("<--");
            for (var i in s1) {
                var s2 = s1[i].split("-->");
                var stag = s2[0].split(" "); //tags;
                var sshader = s2[1]; //正文
                var lastname = "";
                var lasttag = 0;
                for (var j in stag) {
                    var t = stag[j];
                    if (t.length == 0)
                        continue;
                    if (t == "vs") //vectexshader
                     {
                        lasttag = 1;
                    }
                    else if (t == "fs") //fragmentshader
                     {
                        lasttag = 2;
                    }
                    else {
                        lastname = t.substring(1, t.length - 1);
                    }
                }
                if (lastname.length == 0)
                    continue;
                if (this.mapshader[lastname] == undefined)
                    this.mapshader[lastname] = new shadercode(); //ness
                if (lasttag == 1)
                    this.mapshader[lastname].vscode = sshader;
                else if (lasttag == 2)
                    this.mapshader[lastname].fscode = sshader;
            }
        };
        shaderParser.prototype.parseUrl = function (webgl, url) {
            var _this = this;
            lighttool.loadTool.loadText(url, function (txt, err) {
                if (txt != null) {
                    _this._parser(txt);
                    _this.compile(webgl);
                }
                //spriteBatcher
            });
        };
        shaderParser.prototype.parseDirect = function (webgl, txt) {
            this._parser(txt);
            this.compile(webgl);
        };
        shaderParser.prototype.dump = function () {
            for (var name in this.mapshader) {
                console.log("shadername:" + name);
                console.log("vs:" + this.mapshader[name].vscode);
                console.log("fs:" + this.mapshader[name].fscode);
            }
        };
        shaderParser.prototype.compile = function (webgl) {
            for (var name in this.mapshader) {
                this.mapshader[name].compile(webgl);
            }
        };
        return shaderParser;
    }());
    lighttool.shaderParser = shaderParser;
    //sprite 基本数据结构
    var spriteRect = /** @class */ (function () {
        function spriteRect(x, y, w, h) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            if (w === void 0) { w = 0; }
            if (h === void 0) { h = 0; }
            this.x = x;
            this.y = y;
            this.w = w;
            this.h = h;
        }
        spriteRect.one = new spriteRect(0, 0, 1, 1); //ness
        spriteRect.zero = new spriteRect(0, 0, 0, 0); //ness
        return spriteRect;
    }());
    lighttool.spriteRect = spriteRect;
    var spriteBorder = /** @class */ (function () {
        function spriteBorder(l, t, r, b) {
            if (l === void 0) { l = 0; }
            if (t === void 0) { t = 0; }
            if (r === void 0) { r = 0; }
            if (b === void 0) { b = 0; }
            this.l = l;
            this.t = t;
            this.r = r;
            this.b = b;
        }
        spriteBorder.zero = new spriteBorder(0, 0, 0, 0); //ness
        return spriteBorder;
    }());
    lighttool.spriteBorder = spriteBorder;
    var spriteColor = /** @class */ (function () {
        function spriteColor(r, g, b, a) {
            if (r === void 0) { r = 1; }
            if (g === void 0) { g = 1; }
            if (b === void 0) { b = 1; }
            if (a === void 0) { a = 1; }
            this.r = r;
            this.g = g;
            this.b = b;
            this.a = a;
        }
        spriteColor.white = new spriteColor(1, 1, 1, 1); //ness
        spriteColor.black = new spriteColor(0, 0, 0, 1); //ness
        spriteColor.gray = new spriteColor(0.5, 0.5, 0.5, 1); //ness
        return spriteColor;
    }());
    lighttool.spriteColor = spriteColor;
    var spritePoint = /** @class */ (function () {
        function spritePoint() {
            this.x = 0;
            this.y = 0;
            this.z = 0;
            this.r = 0;
            this.g = 0;
            this.b = 0;
            this.a = 0;
            this.r2 = 0;
            this.g2 = 0;
            this.b2 = 0;
            this.a2 = 0;
            this.u = 0;
            this.v = 0;
        }
        return spritePoint;
    }());
    lighttool.spritePoint = spritePoint;
    //sprite材质
    var spriteMat = /** @class */ (function () {
        function spriteMat() {
            this.shader = "";
            this.transparent = false;
            this.tex0 = null;
            this.tex1 = null;
            this.col0 = new spriteColor();
            this.col1 = new spriteColor();
        }
        return spriteMat;
    }());
    lighttool.spriteMat = spriteMat;
    var stateRecorder = /** @class */ (function () {
        function stateRecorder(webgl) {
            this.DEPTH_WRITEMASK = false;
            this.DEPTH_TEST = false;
            this.DEPTH_FUNC = 0;
            this.BLEND = false;
            this.BLEND_EQUATION = 0;
            this.BLEND_SRC_RGB = 0;
            this.BLEND_SRC_ALPHA = 0;
            this.BLEND_DST_RGB = 0;
            this.BLEND_DST_ALPHA = 0;
            this.ACTIVE_TEXTURE = 0;
            this.webgl = webgl;
        }
        stateRecorder.prototype.record = function () {
            //记录状态
            this.DEPTH_WRITEMASK = this.webgl.getParameter(this.webgl.DEPTH_WRITEMASK);
            this.DEPTH_TEST = this.webgl.getParameter(this.webgl.DEPTH_TEST);
            this.DEPTH_FUNC = this.webgl.getParameter(this.webgl.DEPTH_FUNC);
            //alphablend ，跟着mat走
            this.BLEND = this.webgl.getParameter(this.webgl.BLEND);
            this.BLEND_EQUATION = this.webgl.getParameter(this.webgl.BLEND_EQUATION);
            this.BLEND_SRC_RGB = this.webgl.getParameter(this.webgl.BLEND_SRC_RGB);
            this.BLEND_SRC_ALPHA = this.webgl.getParameter(this.webgl.BLEND_SRC_ALPHA);
            this.BLEND_DST_RGB = this.webgl.getParameter(this.webgl.BLEND_DST_RGB);
            this.BLEND_DST_ALPHA = this.webgl.getParameter(this.webgl.BLEND_DST_ALPHA);
            //    this.webgl.blendFuncSeparate(this.webgl.ONE, this.webgl.ONE_MINUS_SRC_ALPHA,
            //        this.webgl.SRC_ALPHA, this.webgl.ONE);
            this.CURRENT_PROGRAM = this.webgl.getParameter(this.webgl.CURRENT_PROGRAM);
            this.ARRAY_BUFFER = this.webgl.getParameter(this.webgl.ARRAY_BUFFER_BINDING);
            this.ACTIVE_TEXTURE = this.webgl.getParameter(this.webgl.ACTIVE_TEXTURE);
            this.TEXTURE_BINDING_2D = this.webgl.getParameter(this.webgl.TEXTURE_BINDING_2D);
        };
        stateRecorder.prototype.restore = function () {
            //恢复状态
            this.webgl.depthMask(this.DEPTH_WRITEMASK);
            if (this.DEPTH_TEST)
                this.webgl.enable(this.webgl.DEPTH_TEST); //这是ztest
            else
                this.webgl.disable(this.webgl.DEPTH_TEST); //这是ztest
            this.webgl.depthFunc(this.DEPTH_FUNC); //这是ztest方法
            if (this.BLEND) {
                this.webgl.enable(this.webgl.BLEND);
            }
            else {
                this.webgl.disable(this.webgl.BLEND);
            }
            this.webgl.blendEquation(this.BLEND_EQUATION);
            this.webgl.blendFuncSeparate(this.BLEND_SRC_RGB, this.BLEND_DST_RGB, this.BLEND_SRC_ALPHA, this.BLEND_DST_ALPHA);
            this.webgl.useProgram(this.CURRENT_PROGRAM);
            this.webgl.bindBuffer(this.webgl.ARRAY_BUFFER, this.ARRAY_BUFFER);
            this.webgl.activeTexture(this.ACTIVE_TEXTURE);
            this.webgl.bindTexture(this.webgl.TEXTURE_2D, this.TEXTURE_BINDING_2D);
        };
        return stateRecorder;
    }());
    lighttool.stateRecorder = stateRecorder;
    var spriteBatcher = /** @class */ (function () {
        function spriteBatcher(webgl, shaderparser) {
            this.ztest = true;
            this.shadercode = null;
            //begindraw 和 setmat 到底要不要分开，这是需要再思考一下的
            this.mat = null;
            this.array = new Float32Array(1024 * 13); //ness
            this.dataseek = 0;
            this.rectClip = null;
            this.webgl = webgl;
            this.shaderparser = shaderparser;
            this.vbo = webgl.createBuffer();
            var asp = (this.webgl.drawingBufferWidth / this.webgl.drawingBufferHeight);
            this.matrix = new Float32Array([
                1.0 / asp, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1
            ]); //ness
            this.recorder = new stateRecorder(webgl); //ness
        }
        spriteBatcher.prototype.begindraw = function () {
            this.recorder.record();
        };
        spriteBatcher.prototype.enddraw = function () {
            this.endbatch();
            this.recorder.restore();
        };
        spriteBatcher.prototype.setMat = function (mat) {
            if (mat == this.mat)
                return;
            this.endbatch();
            this.webgl.disable(this.webgl.CULL_FACE);
            this.mat = mat;
            this.shadercode = this.shaderparser.mapshader[this.mat.shader];
            if (this.shadercode == undefined)
                return;
            //指定shader和vbo
            //关于深度 ，跟着spritebatcher走
            this.webgl.depthMask(false); //这是zwrite
            if (this.ztest) {
                this.webgl.enable(this.webgl.DEPTH_TEST); //这是ztest
                this.webgl.depthFunc(this.webgl.LEQUAL); //这是ztest方法
            }
            else {
                this.webgl.disable(this.webgl.DEPTH_TEST); //这是ztest
            }
            if (this.mat.transparent) {
                //alphablend ，跟着mat走
                this.webgl.enable(this.webgl.BLEND);
                this.webgl.blendEquation(this.webgl.FUNC_ADD);
                //this.webgl.blendFunc(this.webgl.ONE, this.webgl.ONE_MINUS_SRC_ALPHA);
                this.webgl.blendFuncSeparate(this.webgl.ONE, this.webgl.ONE_MINUS_SRC_ALPHA, this.webgl.SRC_ALPHA, this.webgl.ONE);
            }
            else {
                this.webgl.disable(this.webgl.BLEND);
            }
            this.webgl.useProgram(this.shadercode.program);
            this.webgl.bindBuffer(this.webgl.ARRAY_BUFFER, this.vbo);
            //指定固定的数据结构，然后根据存在program的数据去绑定咯。
            //绑定vbo和shader顶点格式，这部分应该要区分材质改变与参数改变，可以少切换一些状态
            if (this.shadercode.posPos >= 0) {
                this.webgl.enableVertexAttribArray(this.shadercode.posPos);
                //28 是数据步长(字节)，就是数据结构的长度
                //12 是数据偏移（字节）
                this.webgl.vertexAttribPointer(this.shadercode.posPos, 3, this.webgl.FLOAT, false, 52, 0);
            }
            if (this.shadercode.posColor >= 0) {
                this.webgl.enableVertexAttribArray(this.shadercode.posColor);
                this.webgl.vertexAttribPointer(this.shadercode.posColor, 4, this.webgl.FLOAT, false, 52, 12);
            }
            if (this.shadercode.posColor2 >= 0) {
                this.webgl.enableVertexAttribArray(this.shadercode.posColor2);
                this.webgl.vertexAttribPointer(this.shadercode.posColor2, 4, this.webgl.FLOAT, false, 52, 28);
            }
            if (this.shadercode.posUV >= 0) {
                this.webgl.enableVertexAttribArray(this.shadercode.posUV);
                this.webgl.vertexAttribPointer(this.shadercode.posUV, 2, this.webgl.FLOAT, false, 52, 44);
            }
            if (this.shadercode.uniMatrix != null) {
                this.webgl.uniformMatrix4fv(this.shadercode.uniMatrix, false, this.matrix);
            }
            if (this.shadercode.uniTex0 != null) {
                this.webgl.activeTexture(this.webgl.TEXTURE0);
                var tex = this.mat.tex0;
                this.webgl.bindTexture(this.webgl.TEXTURE_2D, tex == null ? null : tex.texture);
                this.webgl.uniform1i(this.shadercode.uniTex0, 0);
                //console.log("settex");
            }
            if (this.shadercode.uniTex1 != null) {
                this.webgl.activeTexture(this.webgl.TEXTURE1);
                var tex = this.mat.tex1;
                this.webgl.bindTexture(this.webgl.TEXTURE_2D, tex == null ? null : tex.texture);
                this.webgl.uniform1i(this.shadercode.uniTex1, 1);
                //console.log("settex");
            }
            if (this.shadercode.uniCol0 != null) {
                this.webgl.uniform4f(this.shadercode.uniCol0, mat.col0.r, mat.col0.g, mat.col0.b, mat.col0.a);
                //console.log("settex");
            }
            if (this.shadercode.uniCol1 != null) {
                this.webgl.uniform4f(this.shadercode.uniCol1, mat.col1.r, mat.col1.g, mat.col1.b, mat.col1.a);
                //console.log("settex");
            }
        };
        spriteBatcher.prototype.endbatch = function () {
            this.mat = null;
            if (this.dataseek == 0)
                return;
            //填充vbo
            this.webgl.bufferData(this.webgl.ARRAY_BUFFER, this.array, this.webgl.DYNAMIC_DRAW);
            //绘制
            this.webgl.drawArrays(this.webgl.TRIANGLES, 0, this.dataseek);
            //清理状态，可以不干
            //this.webgl.bindBuffer(this.webgl.ARRAY_BUFFER, null);
            //this.data.length = 0;
            this.dataseek = 0;
        };
        spriteBatcher.prototype.addQuad = function (ps) {
            if (this.shadercode == undefined)
                return;
            for (var jc = 0; jc < 6; jc++) {
                var j = jc < 3 ? jc : 6 - jc; // 0->0 1->1 2->2
                // if (j > 2) j = 6 - jc; // 3->3 4->2 5->1
                var i = this.dataseek * 13;
                this.array[i++] = ps[j].x;
                this.array[i++] = ps[j].y;
                this.array[i++] = ps[j].z;
                this.array[i++] = ps[j].r;
                this.array[i++] = ps[j].g;
                this.array[i++] = ps[j].b;
                this.array[i++] = ps[j].a;
                this.array[i++] = ps[j].r2;
                this.array[i++] = ps[j].g2;
                this.array[i++] = ps[j].b2;
                this.array[i++] = ps[j].a2;
                this.array[i++] = ps[j].u;
                this.array[i++] = ps[j].v;
                this.dataseek++;
            }
            if (this.dataseek >= 1000) {
                this.endbatch();
            }
        };
        spriteBatcher.prototype.addTri = function (ps) {
            if (this.shadercode == undefined)
                return;
            {
                for (var j = 0; j < 3; j++) {
                    var i = this.dataseek * 13;
                    //for (var e in ps[j])
                    //{
                    //    this.array[i++] = ps[j][e];
                    //}
                    this.array[i++] = ps[j].x;
                    this.array[i++] = ps[j].y;
                    this.array[i++] = ps[j].z;
                    this.array[i++] = ps[j].r;
                    this.array[i++] = ps[j].g;
                    this.array[i++] = ps[j].b;
                    this.array[i++] = ps[j].a;
                    this.array[i++] = ps[j].r2;
                    this.array[i++] = ps[j].g2;
                    this.array[i++] = ps[j].b2;
                    this.array[i++] = ps[j].a2;
                    this.array[i++] = ps[j].u;
                    this.array[i++] = ps[j].v;
                    this.dataseek++;
                    //this.data.push(ps[j].x);
                    //this.data.push(ps[j].y);
                    //this.data.push(ps[j].z);
                    //this.data.push(ps[j].r);
                    //this.data.push(ps[j].g);
                    //this.data.push(ps[j].b);
                    //this.data.push(ps[j].a);
                    //this.data.push(ps[j].r);
                    //this.data.push(ps[j].g);
                    //this.data.push(ps[j].b);
                    //this.data.push(ps[j].a);
                    //this.data.push(ps[j].u);
                    //this.data.push(ps[j].v);
                }
            }
            if (this.dataseek >= 1000) {
                this.endbatch();
            }
        };
        //这个接口接受裁剪
        spriteBatcher.prototype.addRect = function (ps) {
            if (this.shadercode == undefined)
                return;
            if (this.rectClip != null) //使用裁剪
             {
                var xmin = ps[0].x;
                var xmax = ps[3].x;
                var ymin = ps[0].y;
                var ymax = ps[3].y;
                var umin = ps[0].u;
                var umax = ps[3].u;
                var vmin = ps[0].v;
                var vmax = ps[3].v;
                var wsize = xmax - xmin;
                var hsize = ymax - ymin;
                var usize = umax - umin;
                var vsize = vmax - vmin;
                var xl = Math.max(xmin, this.rectClip.x);
                var xr = Math.min(xmax, this.rectClip.x + this.rectClip.w);
                var yt = Math.max(ymin, this.rectClip.y);
                var yb = Math.min(ymax, this.rectClip.y + this.rectClip.h);
                var lf = (xl - xmin) / wsize;
                var tf = (yt - ymin) / hsize;
                var rf = (xr - xmax) / wsize;
                var bf = (yb - ymax) / hsize;
                umin = umin + lf * usize;
                vmin = vmin + tf * vsize;
                umax = umax + rf * usize;
                vmax = vmax + bf * vsize;
                for (var jc = 0; jc < 6; jc++) {
                    var j = jc < 3 ? jc : 6 - jc; // 0->0 1->1 2->2
                    // if (j > 2) j = 6 - jc; // 3->3 4->2 5->1
                    var i = this.dataseek * 13;
                    var x = ps[j].x;
                    if (x < xl)
                        x = xl;
                    if (x > xr)
                        x = xr;
                    var y = ps[j].y;
                    if (y < yt)
                        y = yt;
                    if (y > yb)
                        y = yb;
                    var u = ps[j].u;
                    if (u < umin)
                        u = umin;
                    if (u > umax)
                        u = umax;
                    var v = ps[j].v;
                    if (v < vmin)
                        v = vmin;
                    if (v > vmax)
                        v = vmax;
                    this.array[i++] = x;
                    this.array[i++] = y;
                    this.array[i++] = ps[j].z;
                    this.array[i++] = ps[j].r;
                    this.array[i++] = ps[j].g;
                    this.array[i++] = ps[j].b;
                    this.array[i++] = ps[j].a;
                    this.array[i++] = ps[j].r2;
                    this.array[i++] = ps[j].g2;
                    this.array[i++] = ps[j].b2;
                    this.array[i++] = ps[j].a2;
                    this.array[i++] = u;
                    this.array[i++] = v;
                    this.dataseek++;
                }
            }
            else {
                for (var jc = 0; jc < 6; jc++) {
                    var j = jc < 3 ? jc : 6 - jc; // 0->0 1->1 2->2
                    // if (j > 2) j = 6 - jc; // 3->3 4->2 5->1
                    var i = this.dataseek * 13;
                    this.array[i++] = ps[j].x;
                    this.array[i++] = ps[j].y;
                    this.array[i++] = ps[j].z;
                    this.array[i++] = ps[j].r;
                    this.array[i++] = ps[j].g;
                    this.array[i++] = ps[j].b;
                    this.array[i++] = ps[j].a;
                    this.array[i++] = ps[j].r2;
                    this.array[i++] = ps[j].g2;
                    this.array[i++] = ps[j].b2;
                    this.array[i++] = ps[j].a2;
                    this.array[i++] = ps[j].u;
                    this.array[i++] = ps[j].v;
                    this.dataseek++;
                }
            }
            if (this.dataseek >= 1000) {
                this.endbatch();
            }
        };
        spriteBatcher.prototype.setRectClip = function (rect) {
            this.rectClip = rect;
        };
        spriteBatcher.prototype.closeRectClip = function () {
            this.rectClip = null;
        };
        return spriteBatcher;
    }());
    lighttool.spriteBatcher = spriteBatcher;
    //texture
    var textureformat;
    (function (textureformat) {
        textureformat[textureformat["RGBA"] = 1] = "RGBA";
        textureformat[textureformat["RGB"] = 2] = "RGB";
        textureformat[textureformat["GRAY"] = 3] = "GRAY";
        //ALPHA = this.webgl.ALPHA,
    })(textureformat = lighttool.textureformat || (lighttool.textureformat = {}));
    var texReader = /** @class */ (function () {
        function texReader(webgl, texRGBA, width, height, gray) {
            if (gray === void 0) { gray = true; }
            this.gray = gray;
            this.width = width;
            this.height = height;
            var fbo = webgl.createFramebuffer();
            var fbold = webgl.getParameter(webgl.FRAMEBUFFER_BINDING);
            webgl.bindFramebuffer(webgl.FRAMEBUFFER, fbo);
            webgl.framebufferTexture2D(webgl.FRAMEBUFFER, webgl.COLOR_ATTACHMENT0, webgl.TEXTURE_2D, texRGBA, 0);
            var readData = new Uint8Array(this.width * this.height * 4);
            readData[0] = 2;
            webgl.readPixels(0, 0, this.width, this.height, webgl.RGBA, webgl.UNSIGNED_BYTE, readData);
            webgl.deleteFramebuffer(fbo);
            webgl.bindFramebuffer(webgl.FRAMEBUFFER, fbold);
            if (gray) {
                this.data = new Uint8Array(this.width * this.height);
                for (var i = 0; i < width * height; i++) {
                    this.data[i] = readData[i * 4];
                }
            }
            else {
                this.data = readData;
            }
        }
        texReader.prototype.getPixel = function (u, v) {
            var x = (u * this.width) | 0;
            var y = (v * this.height) | 0;
            if (x < 0 || x >= this.width || y < 0 || y >= this.height)
                return 0;
            if (this.gray) {
                return this.data[y * this.width + x];
            }
            else {
                var i = (y * this.width + x) * 4;
                return new spriteColor(this.data[i], this.data[i + 1], this.data[i + 2], this.data[i + 3]);
            }
        };
        return texReader;
    }());
    lighttool.texReader = texReader;
    var dynTexture = /** @class */ (function () {
        function dynTexture(webgl, width, height, format, mipmap, linear) {
            if (format === void 0) { format = textureformat.RGBA; }
            if (mipmap === void 0) { mipmap = false; }
            if (linear === void 0) { linear = true; }
            this.mat = null;
            this.mipmap = false;
            this.linear = false;
            this.width = 0;
            this.height = 0;
            //创建读取器，有可能失败
            this.reader = null;
            this.disposeit = false;
            this.pointbuf = [
                { x: 0, y: 0, z: 0, r: 0, g: 0, b: 0, a: 0, r2: 0, g2: 0, b2: 0, a2: 0, u: 0, v: 0 },
                { x: 0, y: 0, z: 0, r: 0, g: 0, b: 0, a: 0, r2: 0, g2: 0, b2: 0, a2: 0, u: 0, v: 0 },
                { x: 0, y: 0, z: 0, r: 0, g: 0, b: 0, a: 0, r2: 0, g2: 0, b2: 0, a2: 0, u: 0, v: 0 },
                { x: 0, y: 0, z: 0, r: 0, g: 0, b: 0, a: 0, r2: 0, g2: 0, b2: 0, a2: 0, u: 0, v: 0 },
            ];
            this.webgl = webgl;
            this.format = format;
            this.width = width;
            this.height = height;
            this.mipmap = mipmap;
            this.linear = linear;
            if (format == textureformat.GRAY) {
                this.data = new Uint8Array(this.width * this.height);
            }
            else {
                this.data = new Uint8Array(this.width * this.height * 4);
            }
            this.mat = new spriteMat(); //ness
            this.mat.tex0 = this;
            this.mat.transparent = true;
            this.mat.shader = "spritedefault";
            this.texture = webgl.createTexture();
        }
        dynTexture.prototype._loadData = function (mipmap, linear) {
            this.webgl.pixelStorei(this.webgl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 0);
            this.webgl.pixelStorei(this.webgl.UNPACK_FLIP_Y_WEBGL, 0);
            this.webgl.bindTexture(this.webgl.TEXTURE_2D, this.texture);
            var formatGL = this.webgl.RGBA;
            if (this.format == textureformat.RGB)
                formatGL = this.webgl.RGB;
            else if (this.format == textureformat.GRAY)
                formatGL = this.webgl.LUMINANCE;
            this.webgl.texImage2D(this.webgl.TEXTURE_2D, 0, formatGL, this.width, this.height, 0, formatGL, 
            //最后这个type，可以管格式
            this.webgl.UNSIGNED_BYTE, this.data);
            if (mipmap) {
                //生成mipmap
                this.webgl.generateMipmap(this.webgl.TEXTURE_2D);
                if (linear) {
                    this.webgl.texParameteri(this.webgl.TEXTURE_2D, this.webgl.TEXTURE_MAG_FILTER, this.webgl.LINEAR);
                    this.webgl.texParameteri(this.webgl.TEXTURE_2D, this.webgl.TEXTURE_MIN_FILTER, this.webgl.LINEAR_MIPMAP_LINEAR);
                }
                else {
                    this.webgl.texParameteri(this.webgl.TEXTURE_2D, this.webgl.TEXTURE_MAG_FILTER, this.webgl.NEAREST);
                    this.webgl.texParameteri(this.webgl.TEXTURE_2D, this.webgl.TEXTURE_MIN_FILTER, this.webgl.NEAREST_MIPMAP_NEAREST);
                }
            }
            else {
                if (linear) {
                    this.webgl.texParameteri(this.webgl.TEXTURE_2D, this.webgl.TEXTURE_MAG_FILTER, this.webgl.LINEAR);
                    this.webgl.texParameteri(this.webgl.TEXTURE_2D, this.webgl.TEXTURE_MIN_FILTER, this.webgl.LINEAR);
                }
                else {
                    this.webgl.texParameteri(this.webgl.TEXTURE_2D, this.webgl.TEXTURE_MAG_FILTER, this.webgl.NEAREST);
                    this.webgl.texParameteri(this.webgl.TEXTURE_2D, this.webgl.TEXTURE_MIN_FILTER, this.webgl.NEAREST);
                }
            }
        };
        dynTexture.prototype.updateData = function () {
            this._loadData(this.mipmap, this.linear);
        };
        dynTexture.prototype.getReader = function (redOnly) {
            if (this.reader != null) {
                if (this.reader.gray != redOnly)
                    throw new Error("get param diff with this.reader");
                return this.reader;
            }
            if (this.format != textureformat.RGBA)
                throw new Error("only rgba texture can read");
            if (this.texture == null)
                return null;
            this.reader = new texReader(this.webgl, this.texture, this.width, this.height, redOnly);
            return this.reader;
        };
        dynTexture.prototype.dispose = function () {
            if (this.texture == null)
                this.disposeit = true;
            if (this.texture != null) {
                this.webgl.deleteTexture(this.texture);
            }
        };
        dynTexture.prototype.draw = function (spriteBatcher, uv, rect, c) {
            {
                var p = this.pointbuf[0];
                p.x = rect.x;
                p.y = rect.y;
                p.z = 0;
                p.u = uv.x;
                p.v = uv.y;
                p.r = c.r;
                p.g = c.g;
                p.b = c.b;
                p.a = c.a;
                p = this.pointbuf[1];
                p.x = rect.x + rect.w;
                p.y = rect.y;
                p.z = 0;
                p.u = uv.x + uv.w;
                p.v = uv.y;
                p.r = c.r;
                p.g = c.g;
                p.b = c.b;
                p.a = c.a;
                p = this.pointbuf[2];
                p.x = rect.x;
                p.y = rect.y + rect.h;
                p.z = 0;
                p.u = uv.x;
                p.v = uv.y + uv.h;
                p.r = c.r;
                p.g = c.g;
                p.b = c.b;
                p.a = c.a;
                p = this.pointbuf[3];
                p.x = rect.x + rect.w;
                p.y = rect.y + rect.h;
                p.z = 0;
                p.u = uv.x + uv.w;
                p.v = uv.y + uv.h;
                p.r = c.r;
                p.g = c.g;
                p.b = c.b;
                p.a = c.a;
            }
            if (this.mat != null) {
                spriteBatcher.setMat(this.mat);
            }
            spriteBatcher.addRect(this.pointbuf);
        };
        dynTexture.prototype.drawCustom = function (spriteBatcher, _mat, uv, rect, c, c2) {
            _mat.tex0 = this;
            {
                var p = this.pointbuf[0];
                p.x = rect.x;
                p.y = rect.y;
                p.z = 0;
                p.u = uv.x;
                p.v = uv.y;
                p.r = c.r;
                p.g = c.g;
                p.b = c.b;
                p.a = c.a;
                p = this.pointbuf[1];
                p.x = rect.x + rect.w;
                p.y = rect.y;
                p.z = 0;
                p.u = uv.x + uv.w;
                p.v = uv.y;
                p.r = c.r;
                p.g = c.g;
                p.b = c.b;
                p.a = c.a;
                p = this.pointbuf[2];
                p.x = rect.x;
                p.y = rect.y + rect.h;
                p.z = 0;
                p.u = uv.x;
                p.v = uv.y + uv.h;
                p.r = c.r;
                p.g = c.g;
                p.b = c.b;
                p.a = c.a;
                p = this.pointbuf[3];
                p.x = rect.x + rect.w;
                p.y = rect.y + rect.h;
                p.z = 0;
                p.u = uv.x + uv.w;
                p.v = uv.y + uv.h;
                p.r = c.r;
                p.g = c.g;
                p.b = c.b;
                p.a = c.a;
            }
            spriteBatcher.setMat(_mat);
            spriteBatcher.addRect(this.pointbuf);
        };
        return dynTexture;
    }());
    lighttool.dynTexture = dynTexture;
    var spriteTexture = /** @class */ (function () {
        function spriteTexture(webgl, url, format, mipmap, linear) {
            if (url === void 0) { url = null; }
            if (format === void 0) { format = textureformat.RGBA; }
            if (mipmap === void 0) { mipmap = false; }
            if (linear === void 0) { linear = true; }
            var _this = this;
            this.img = null;
            this.loaded = false;
            this.texture = null;
            this.width = 0;
            this.height = 0;
            this.mat = null;
            //创建读取器，有可能失败
            this.reader = null;
            this.disposeit = false;
            this.pointbuf = [
                { x: 0, y: 0, z: 0, r: 0, g: 0, b: 0, a: 0, r2: 0, g2: 0, b2: 0, a2: 0, u: 0, v: 0 },
                { x: 0, y: 0, z: 0, r: 0, g: 0, b: 0, a: 0, r2: 0, g2: 0, b2: 0, a2: 0, u: 0, v: 0 },
                { x: 0, y: 0, z: 0, r: 0, g: 0, b: 0, a: 0, r2: 0, g2: 0, b2: 0, a2: 0, u: 0, v: 0 },
                { x: 0, y: 0, z: 0, r: 0, g: 0, b: 0, a: 0, r2: 0, g2: 0, b2: 0, a2: 0, u: 0, v: 0 },
            ];
            this.webgl = webgl;
            this.format = format;
            this.mat = new spriteMat(); //ness
            this.mat.tex0 = this;
            this.mat.transparent = true;
            this.mat.shader = "spritedefault";
            if (url == null) //不给定url 则 texture 不加载
                return;
            this.texture = webgl.createTexture();
            this.img = new Image(); // HTMLImageElement(); //ness
            this.img.src = url;
            this.img.onload = function () {
                if (_this.disposeit) {
                    _this.img = null;
                    return;
                }
                _this._loadimg(mipmap, linear);
            };
        }
        spriteTexture.prototype._loadimg = function (mipmap, linear) {
            if (this.img == null)
                return;
            this.width = this.img.width;
            this.height = this.img.height;
            this.loaded = true;
            this.webgl.pixelStorei(this.webgl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 1);
            this.webgl.pixelStorei(this.webgl.UNPACK_FLIP_Y_WEBGL, 0);
            this.webgl.bindTexture(this.webgl.TEXTURE_2D, this.texture);
            var formatGL = this.webgl.RGBA;
            if (this.format == textureformat.RGB)
                formatGL = this.webgl.RGB;
            else if (this.format == textureformat.GRAY)
                formatGL = this.webgl.LUMINANCE;
            if (this.img != null) {
                this.webgl.texImage2D(this.webgl.TEXTURE_2D, 0, formatGL, formatGL, 
                //最后这个type，可以管格式
                this.webgl.UNSIGNED_BYTE, this.img);
            }
            if (mipmap) {
                //生成mipmap
                this.webgl.generateMipmap(this.webgl.TEXTURE_2D);
                if (linear) {
                    this.webgl.texParameteri(this.webgl.TEXTURE_2D, this.webgl.TEXTURE_MAG_FILTER, this.webgl.LINEAR);
                    this.webgl.texParameteri(this.webgl.TEXTURE_2D, this.webgl.TEXTURE_MIN_FILTER, this.webgl.LINEAR_MIPMAP_LINEAR);
                }
                else {
                    this.webgl.texParameteri(this.webgl.TEXTURE_2D, this.webgl.TEXTURE_MAG_FILTER, this.webgl.NEAREST);
                    this.webgl.texParameteri(this.webgl.TEXTURE_2D, this.webgl.TEXTURE_MIN_FILTER, this.webgl.NEAREST_MIPMAP_NEAREST);
                }
            }
            else {
                if (linear) {
                    this.webgl.texParameteri(this.webgl.TEXTURE_2D, this.webgl.TEXTURE_MAG_FILTER, this.webgl.LINEAR);
                    this.webgl.texParameteri(this.webgl.TEXTURE_2D, this.webgl.TEXTURE_MIN_FILTER, this.webgl.LINEAR);
                }
                else {
                    this.webgl.texParameteri(this.webgl.TEXTURE_2D, this.webgl.TEXTURE_MAG_FILTER, this.webgl.NEAREST);
                    this.webgl.texParameteri(this.webgl.TEXTURE_2D, this.webgl.TEXTURE_MIN_FILTER, this.webgl.NEAREST);
                }
            }
            this.img = null;
        };
        spriteTexture.fromRaw = function (webgl, img, format, mipmap, linear) {
            if (format === void 0) { format = textureformat.RGBA; }
            if (mipmap === void 0) { mipmap = false; }
            if (linear === void 0) { linear = true; }
            var st = new spriteTexture(webgl, null, format, mipmap, linear);
            st.texture = webgl.createTexture();
            st.img = img;
            st._loadimg(mipmap, linear);
            return st;
        };
        spriteTexture.prototype.getReader = function (redOnly) {
            if (this.reader != null) {
                if (this.reader.gray != redOnly)
                    throw new Error("get param diff with this.reader");
                return this.reader;
            }
            if (this.format != textureformat.RGBA)
                throw new Error("only rgba texture can read");
            if (this.texture == null)
                return null;
            this.reader = new texReader(this.webgl, this.texture, this.width, this.height, redOnly);
            return this.reader;
        };
        spriteTexture.prototype.dispose = function () {
            if (this.texture == null && this.img != null)
                this.disposeit = true;
            if (this.texture != null) {
                this.webgl.deleteTexture(this.texture);
            }
        };
        spriteTexture.prototype.draw = function (spriteBatcher, uv, rect, c) {
            {
                var p = this.pointbuf[0];
                p.x = rect.x;
                p.y = rect.y;
                p.z = 0;
                p.u = uv.x;
                p.v = uv.y;
                p.r = c.r;
                p.g = c.g;
                p.b = c.b;
                p.a = c.a;
                p = this.pointbuf[1];
                p.x = rect.x + rect.w;
                p.y = rect.y;
                p.z = 0;
                p.u = uv.x + uv.w;
                p.v = uv.y;
                p.r = c.r;
                p.g = c.g;
                p.b = c.b;
                p.a = c.a;
                p = this.pointbuf[2];
                p.x = rect.x;
                p.y = rect.y + rect.h;
                p.z = 0;
                p.u = uv.x;
                p.v = uv.y + uv.h;
                p.r = c.r;
                p.g = c.g;
                p.b = c.b;
                p.a = c.a;
                p = this.pointbuf[3];
                p.x = rect.x + rect.w;
                p.y = rect.y + rect.h;
                p.z = 0;
                p.u = uv.x + uv.w;
                p.v = uv.y + uv.h;
                p.r = c.r;
                p.g = c.g;
                p.b = c.b;
                p.a = c.a;
            }
            if (this.mat != null) {
                spriteBatcher.setMat(this.mat);
            }
            spriteBatcher.addRect(this.pointbuf);
        };
        spriteTexture.prototype.drawCustom = function (spriteBatcher, _mat, uv, rect, c, c2) {
            _mat.tex0 = this;
            {
                var p = this.pointbuf[0];
                p.x = rect.x;
                p.y = rect.y;
                p.z = 0;
                p.u = uv.x;
                p.v = uv.y;
                p.r = c.r;
                p.g = c.g;
                p.b = c.b;
                p.a = c.a;
                p = this.pointbuf[1];
                p.x = rect.x + rect.w;
                p.y = rect.y;
                p.z = 0;
                p.u = uv.x + uv.w;
                p.v = uv.y;
                p.r = c.r;
                p.g = c.g;
                p.b = c.b;
                p.a = c.a;
                p = this.pointbuf[2];
                p.x = rect.x;
                p.y = rect.y + rect.h;
                p.z = 0;
                p.u = uv.x;
                p.v = uv.y + uv.h;
                p.r = c.r;
                p.g = c.g;
                p.b = c.b;
                p.a = c.a;
                p = this.pointbuf[3];
                p.x = rect.x + rect.w;
                p.y = rect.y + rect.h;
                p.z = 0;
                p.u = uv.x + uv.w;
                p.v = uv.y + uv.h;
                p.r = c.r;
                p.g = c.g;
                p.b = c.b;
                p.a = c.a;
            }
            spriteBatcher.setMat(_mat);
            spriteBatcher.addRect(this.pointbuf);
        };
        return spriteTexture;
    }());
    lighttool.spriteTexture = spriteTexture;
    var sprite = /** @class */ (function () {
        function sprite() {
            this.x = 0;
            this.y = 0;
            this.w = 0;
            this.h = 0;
            this.xsize = 0;
            this.ysize = 0;
        }
        return sprite;
    }());
    lighttool.sprite = sprite;
    //atlas
    var spriteAtlas = /** @class */ (function () {
        function spriteAtlas(webgl, atlasurl, texture) {
            if (atlasurl === void 0) { atlasurl = null; }
            if (texture === void 0) { texture = null; }
            var _this = this;
            this.textureurl = "";
            this.texturewidth = 0;
            this.textureheight = 0;
            this.sprites = {};
            this.webgl = webgl;
            if (atlasurl == null) {
            }
            else {
                lighttool.loadTool.loadText(atlasurl, function (txt, err) {
                    if (txt != null)
                        _this._parse(txt);
                });
            }
            this.texture = texture;
        }
        spriteAtlas.fromRaw = function (webgl, txt, texture) {
            if (texture === void 0) { texture = null; }
            var sa = new spriteAtlas(webgl, null, texture);
            sa._parse(txt);
            return sa;
        };
        spriteAtlas.prototype._parse = function (txt) {
            var json = JSON.parse(txt);
            this.textureurl = json["t"];
            this.texturewidth = json["w"];
            this.textureheight = json["h"];
            var s = json["s"];
            for (var i in s) {
                var ss = s[i];
                var r = new sprite(); //ness
                r.x = (ss[1] + 0.5) / this.texturewidth;
                r.y = (ss[2] + 0.5) / this.textureheight;
                r.w = (ss[3] - 1) / this.texturewidth;
                r.h = (ss[4] - 1) / this.textureheight;
                r.xsize = ss[3];
                r.ysize = ss[4];
                this.sprites[ss[0]] = r;
            }
        };
        spriteAtlas.prototype.drawByTexture = function (sb, sname, rect, c) {
            if (this.texture == null)
                return;
            var r = this.sprites[sname];
            if (r == undefined)
                return;
            this.texture.draw(sb, r, rect, c);
        };
        return spriteAtlas;
    }());
    lighttool.spriteAtlas = spriteAtlas;
    //font
    var charinfo = /** @class */ (function () {
        function charinfo() {
            this.x = 0; //uv
            this.y = 0;
            this.w = 0;
            this.h = 0;
            this.xSize = 0;
            this.ySize = 0;
            this.xOffset = 0; //偏移
            this.yOffset = 0;
            this.xAddvance = 0; //字符宽度
        }
        return charinfo;
    }());
    lighttool.charinfo = charinfo;
    var spriteFont = /** @class */ (function () {
        function spriteFont(webgl, urlconfig, texture) {
            var _this = this;
            this.cmap = {};
            this.fontname = "";
            this.pointSize = 0; //像素尺寸
            this.padding = 0; //间隔
            this.lineHeight = 0; //行高
            this.baseline = 0; //基线
            this.atlasWidth = 0;
            this.atlasHeight = 0;
            this.pointbuf = [
                { x: 0, y: 0, z: 0, r: 0, g: 0, b: 0, a: 0, r2: 0, g2: 0, b2: 0, a2: 0, u: 0, v: 0 },
                { x: 0, y: 0, z: 0, r: 0, g: 0, b: 0, a: 0, r2: 0, g2: 0, b2: 0, a2: 0, u: 0, v: 0 },
                { x: 0, y: 0, z: 0, r: 0, g: 0, b: 0, a: 0, r2: 0, g2: 0, b2: 0, a2: 0, u: 0, v: 0 },
                { x: 0, y: 0, z: 0, r: 0, g: 0, b: 0, a: 0, r2: 0, g2: 0, b2: 0, a2: 0, u: 0, v: 0 },
            ];
            this.webgl = webgl;
            if (urlconfig != null) {
                lighttool.loadTool.loadText(urlconfig, function (txt, err) {
                    if (txt != null) {
                        _this._parse(txt);
                    }
                });
            }
            this.texture = texture;
            this.mat = new spriteMat(); //ness
            this.mat.shader = "spritefont";
            this.mat.tex0 = this.texture;
            this.mat.transparent = true;
        }
        spriteFont.fromRaw = function (webgl, txt, texture) {
            if (texture === void 0) { texture = null; }
            var sf = new spriteFont(webgl, null, texture);
            sf._parse(txt);
            return sf;
        };
        spriteFont.prototype._parse = function (txt) {
            var d1 = new Date().valueOf();
            var json = JSON.parse(txt);
            //parse fontinfo
            var font = json["font"];
            this.fontname = font[0];
            this.pointSize = font[1];
            this.padding = font[2];
            this.lineHeight = font[3];
            this.baseline = font[4];
            this.atlasWidth = font[5];
            this.atlasHeight = font[6];
            //parse char map
            this.cmap = {};
            var map = json["map"];
            for (var c in map) {
                var finfo = new charinfo(); //ness
                this.cmap[c] = finfo;
                finfo.x = map[c][0] / this.atlasWidth;
                finfo.y = map[c][1] / this.atlasHeight;
                finfo.w = map[c][2] / this.atlasWidth;
                finfo.h = map[c][3] / this.atlasHeight;
                finfo.xSize = map[c][2];
                finfo.ySize = map[c][3];
                finfo.xOffset = map[c][4];
                finfo.yOffset = map[c][5];
                finfo.xAddvance = map[c][6];
            }
            map = null;
            json = null;
            var d2 = new Date().valueOf();
            var n = d2 - d1;
            console.log("json time=" + n);
        };
        spriteFont.prototype.draw = function (sb, r, rect, c, colorBorder) {
            if (c === void 0) { c = spriteColor.white; }
            if (colorBorder === void 0) { colorBorder = new spriteColor(0, 0, 0, 0.5); }
            {
                var p = this.pointbuf[0];
                p.x = rect.x;
                p.y = rect.y + rect.h;
                p.z = 0;
                p.u = r.x;
                p.v = r.y + r.h;
                p.r = c.r;
                p.g = c.g;
                p.b = c.b;
                p.a = c.a;
                p.r2 = colorBorder.r;
                p.g2 = colorBorder.g;
                p.b2 = colorBorder.b;
                p.a2 = colorBorder.a;
                p = this.pointbuf[1];
                p.x = rect.x + rect.w;
                p.y = rect.y + rect.h;
                p.z = 0;
                p.u = r.x + r.w;
                p.v = r.y + r.h;
                p.r = c.r;
                p.g = c.g;
                p.b = c.b;
                p.a = c.a;
                p.r2 = colorBorder.r;
                p.g2 = colorBorder.g;
                p.b2 = colorBorder.b;
                p.a2 = colorBorder.a;
                p = this.pointbuf[2];
                p.x = rect.x;
                p.y = rect.y;
                p.z = 0;
                p.u = r.x;
                p.v = r.y;
                p.r = c.r;
                p.g = c.g;
                p.b = c.b;
                p.a = c.a;
                p.r2 = colorBorder.r;
                p.g2 = colorBorder.g;
                p.b2 = colorBorder.b;
                p.a2 = colorBorder.a;
                p = this.pointbuf[3];
                p.x = rect.x + rect.w;
                p.y = rect.y;
                p.z = 0;
                p.u = r.x + r.w;
                p.v = r.y;
                p.r = c.r;
                p.g = c.g;
                p.b = c.b;
                p.a = c.a;
                p.r2 = colorBorder.r;
                p.g2 = colorBorder.g;
                p.b2 = colorBorder.b;
                p.a2 = colorBorder.a;
            }
            sb.setMat(this.mat);
            sb.addRect(this.pointbuf);
        };
        spriteFont.prototype.drawChar = function (sb, cname, rect, c, colorBorder) {
            if (c === void 0) { c = spriteColor.white; }
            if (colorBorder === void 0) { colorBorder = new spriteColor(0, 0, 0, 0.5); }
            var r = this.cmap[cname];
            if (r == undefined)
                return;
            {
                var p = this.pointbuf[0];
                p.x = rect.x;
                p.y = rect.y;
                p.z = 0;
                p.u = r.x;
                p.v = r.y;
                p.r = c.r;
                p.g = c.g;
                p.b = c.b;
                p.a = c.a;
                p.r2 = colorBorder.r;
                p.g2 = colorBorder.g;
                p.b2 = colorBorder.b;
                p.a2 = colorBorder.a;
                p = this.pointbuf[1];
                p.x = rect.x + rect.w;
                p.y = rect.y;
                p.z = 0;
                p.u = r.x + r.w;
                p.v = r.y;
                p.r = c.r;
                p.g = c.g;
                p.b = c.b;
                p.a = c.a;
                p.r2 = colorBorder.r;
                p.g2 = colorBorder.g;
                p.b2 = colorBorder.b;
                p.a2 = colorBorder.a;
                p = this.pointbuf[2];
                p.x = rect.x;
                p.y = rect.y + rect.h;
                p.z = 0;
                p.u = r.x;
                p.v = r.y + r.h;
                p.r = c.r;
                p.g = c.g;
                p.b = c.b;
                p.a = c.a;
                p.r2 = colorBorder.r;
                p.g2 = colorBorder.g;
                p.b2 = colorBorder.b;
                p.a2 = colorBorder.a;
                p = this.pointbuf[3];
                p.x = rect.x + rect.w;
                p.y = rect.y + rect.h;
                p.z = 0;
                p.u = r.x + r.w;
                p.v = r.y + r.h;
                p.r = c.r;
                p.g = c.g;
                p.b = c.b;
                p.a = c.a;
                p.r2 = colorBorder.r;
                p.g2 = colorBorder.g;
                p.b2 = colorBorder.b;
                p.a2 = colorBorder.a;
            }
            sb.setMat(this.mat);
            sb.addRect(this.pointbuf);
        };
        return spriteFont;
    }());
    lighttool.spriteFont = spriteFont;
})(lighttool || (lighttool = {}));
var lighttool;
(function (lighttool) {
    var Native;
    (function (Native) {
        var canvasAdapter = /** @class */ (function () {
            function canvasAdapter() {
            }
            canvasAdapter.CreateScreenCanvas = function (webgl, useraction) {
                var el = webgl.canvas;
                el.width = el.clientWidth;
                el.height = el.clientHeight;
                var c = new lighttool.spriteCanvas(webgl, webgl.drawingBufferWidth, webgl.drawingBufferHeight);
                //var asp = range.width / range.height;
                c.spriteBatcher.matrix = new Float32Array([
                    1.0 * 2 / c.width, 0, 0, 0,
                    0, 1 * -1 * 2 / c.height, 0, 0,
                    0, 0, 1, 0,
                    -1, 1, 0, 1
                ]);
                c.spriteBatcher.ztest = false; //最前不需要ztest
                var ua = useraction;
                setInterval(function () {
                    webgl.viewport(0, 0, webgl.drawingBufferWidth, webgl.drawingBufferHeight);
                    webgl.clear(webgl.COLOR_BUFFER_BIT | webgl.DEPTH_BUFFER_BIT);
                    webgl.clearColor(1.0, 0.0, 1.0, 1.0);
                    c.spriteBatcher.begindraw();
                    ua.ondraw(c);
                    c.spriteBatcher.enddraw();
                    webgl.flush();
                }, 20);
                window.addEventListener("resize", function () {
                    var el = webgl.canvas;
                    el.width = el.clientWidth;
                    el.height = el.clientHeight;
                    el.width = el.clientWidth;
                    el.height = el.clientHeight;
                    c.width = el.width;
                    c.height = el.height;
                    c.spriteBatcher.matrix = new Float32Array([
                        1.0 * 2 / c.width, 0, 0, 0,
                        0, 1 * -1 * 2 / c.height, 0, 0,
                        0, 0, 1, 0,
                        -1, 1, 0, 1
                    ]);
                    ////do resize func
                    ua.onresize(c);
                });
                el.onmousemove = function (ev) {
                    ua.onpointevent(c, lighttool.canvaspointevent.POINT_MOVE, ev.offsetX, ev.offsetY);
                };
                el.onmouseup = function (ev) {
                    ua.onpointevent(c, lighttool.canvaspointevent.POINT_UP, ev.offsetX, ev.offsetY);
                };
                el.onmousedown = function (ev) {
                    ua.onpointevent(c, lighttool.canvaspointevent.POINT_DOWN, ev.offsetX, ev.offsetY);
                };
                //scene.onPointerObservable.add((pinfo: BABYLON.PointerInfo, state: BABYLON.EventState) =>
                //{
                //    var range = scene.getEngine().getRenderingCanvasClientRect();
                //    //输入
                //    var e: lighttool.canvaspointevent = lighttool.canvaspointevent.NONE;
                //    if (pinfo.type == BABYLON.PointerEventTypes.POINTERDOWN)
                //        e = lighttool.canvaspointevent.POINT_DOWN;
                //    if (pinfo.type == BABYLON.PointerEventTypes.POINTERMOVE)
                //        e = lighttool.canvaspointevent.POINT_MOVE;
                //    if (pinfo.type == BABYLON.PointerEventTypes.POINTERUP)
                //        e = lighttool.canvaspointevent.POINT_UP;
                //    //缩放到canvas size
                //    var x = pinfo.event.offsetX / range.width * c.width;
                //    var y = pinfo.event.offsetY / range.height * c.height;
                //    var skip: boolean = ua.onpointevent(c, e, x, y);
                //    //对 babylon，来说 2d在这里输入，3d 要 pick 以后咯
                //    state.skipNextObservers = skip;//是否中断事件
                //}
                //);
                return c;
            };
            return canvasAdapter;
        }());
        Native.canvasAdapter = canvasAdapter;
    })(Native = lighttool.Native || (lighttool.Native = {}));
})(lighttool || (lighttool = {}));
//# sourceMappingURL=webglcanvas.js.map