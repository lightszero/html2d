var statePlay = (function () {
    function statePlay() {
        this.mapx = 0;
        this.playerframe = 0;
        this.playery = 0.5;
        this.speedy = -1;
        this.startBtnRect = null;
        this.btndown = false;
    }
    statePlay.prototype.onInit = function (action) {
        this.action = action;
        this.canvas = action.canvas;
    };
    statePlay.prototype.onUpdate = function (delta) {
        this.mapx -= delta * 100;
        var xa = (this.canvas.height / 512 * 288) | 0;
        if (this.mapx < -xa * 2)
            this.mapx += xa;
        this.playerframe += delta * 10;
        if (this.playerframe > 100)
            this.playerframe = 0;
        this.speedy -= -9.8 * 0.5 * delta;
        this.playery += this.speedy * delta;
        if (this.playery < 0.2 || this.playery > 0.8) {
            this.action.changeState(new stateLogo());
        }
    };
    statePlay.prototype.drawback = function (c, xadd) {
        var x = xadd;
        var t = lighttool.textureMgr.Instance().load(c.webgl, "tex/bg_day.png");
        var xa = (c.height / 512 * 288) | 0;
        while (x < c.width) {
            c.drawTexture(t, new lighttool.spriteRect(x, 0, xa, c.height), new lighttool.spriteRect(0, 0, 288 / 512, 1));
            c.drawSprite("bird", "land", new lighttool.spriteRect(x, c.height / 512 * (512 - 112), xa, c.height / 512 * 112));
            c.drawSprite("bird", "land", new lighttool.spriteRect(x, c.height / 512 * 112, xa, -c.height / 512 * 112));
            x += xa;
        }
    };
    statePlay.prototype.drawex = function (atlas, sprite, percentx, percenty, poivtX, poivtY) {
        if (poivtX === void 0) { poivtX = 0.5; }
        if (poivtY === void 0) { poivtY = 0.5; }
        var c = this.canvas;
        var cscale = c.height / 512;
        var a = lighttool.atlasMgr.Instance().load(c.webgl, atlas);
        var s = a.sprites[sprite];
        if (s != undefined) {
            var myheight = s.h * a.textureheight * cscale;
            var mywidth = s.w * a.texturewidth * cscale;
            var target = new lighttool.spriteRect(c.width * percentx - mywidth * poivtX, c.height * percenty - myheight * poivtY, mywidth, myheight);
            c.drawSprite(atlas, sprite, target);
            return target;
        }
        return null;
    };
    statePlay.prototype.onDraw = function () {
        this.drawback(this.canvas, this.mapx);
        //draw player
        var i = (this.playerframe | 0) % 3;
        this.drawex("bird", "bird1_" + i, 0.5, this.playery);
    };
    statePlay.prototype.onExit = function () {
    };
    statePlay.prototype.checkRect = function (rect, x, y) {
        if (rect == null)
            return false;
        if (x >= rect.x && y >= rect.y && x < rect.w + rect.x && y < rect.h + rect.y)
            return true;
        return false;
    };
    statePlay.prototype.onpointevent = function (e, x, y) {
        if (e == lighttool.canvaspointevent.POINT_DOWN) {
            this.btndown = true;
        }
        if (e == lighttool.canvaspointevent.POINT_UP && this.btndown == true) {
            this.btndown = false;
            this.speedy = -1.5;
        }
    };
    return statePlay;
}());
//# sourceMappingURL=state_play.js.map