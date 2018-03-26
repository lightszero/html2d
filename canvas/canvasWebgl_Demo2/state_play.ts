class statePlay implements IState
{
    action: MyCanvasAction;
    canvas: lighttool.spriteCanvas;
    onInit(action: MyCanvasAction): void
    {
        this.action = action;
        this.canvas = action.canvas;
    }
    onUpdate(delta: number): void
    {
        this.mapx -= delta * 100;
        var xa = (this.canvas.height / 512 * 288) | 0;

        if (this.mapx < -xa * 2)
            this.mapx += xa;

        this.playerframe += delta * 10;

        if (this.playerframe > 100)
            this.playerframe = 0;

        this.speedy -= -9.8 * 0.5 * delta;
        this.playery += this.speedy * delta;
        if (this.playery < 0.2 || this.playery > 0.8)
        {
            this.action.changeState(new stateLogo());
        }
    }
    mapx: number = 0;
    playerframe: number = 0;
    playery = 0.5;
    speedy = -1;

    drawback(c: lighttool.spriteCanvas, xadd: number)
    {
        var x: number = xadd;
        var t = lighttool.textureMgr.Instance().load(c.webgl, "tex/bg_day.png");
        var xa = (c.height / 512 * 288) | 0;
        while (x < c.width)
        {
            c.drawTexture(t, new lighttool.spriteRect(x, 0, xa, c.height), new lighttool.spriteRect(0, 0, 288 / 512, 1));
            c.drawSprite("bird", "land", new lighttool.spriteRect(x, c.height / 512 * (512 - 112), xa, c.height / 512 * 112));
            c.drawSprite("bird", "land", new lighttool.spriteRect(x, c.height / 512 * 112, xa, -c.height / 512 * 112));
            x += xa;
        }
    }
    drawex(atlas: string, sprite: string, percentx: number, percenty: number, poivtX: number = 0.5, poivtY: number = 0.5): lighttool.spriteRect
    {
        var c = this.canvas;
        var cscale = c.height / 512;
        let a = lighttool.atlasMgr.Instance().load(c.webgl, atlas);
        let s = a.sprites[sprite];
        if (s != undefined)
        {
            var myheight = s.h * a.textureheight * cscale;
            var mywidth = s.w * a.texturewidth * cscale;
            var target = new lighttool.spriteRect(c.width * percentx - mywidth * poivtX, c.height * percenty - myheight * poivtY, mywidth, myheight);
            c.drawSprite(atlas, sprite, target);
            return target;
        }
        return null;
    }
    startBtnRect: lighttool.spriteRect = null;
    onDraw(): void
    {

        this.drawback(this.canvas, this.mapx);

        //draw player
        var i = (this.playerframe | 0) % 3;
        this.drawex("bird", "bird1_" + i, 0.5, this.playery);
    }
    onExit(): void
    {
    }
    btndown: boolean = false;
    checkRect(rect: lighttool.spriteRect, x: number, y: number): boolean
    {
        if (rect == null) return false;

        if (x >= rect.x && y >= rect.y && x < rect.w + rect.x && y < rect.h + rect.y)
            return true;
        return false;
    }
    onpointevent(e: lighttool.canvaspointevent, x: number, y: number)
    {
        if (e == lighttool.canvaspointevent.POINT_DOWN)
        {
            this.btndown = true;
        }
        if (e == lighttool.canvaspointevent.POINT_UP && this.btndown == true)
        {
            this.btndown = false;
            this.speedy = -1.5;
        }

    }

}
