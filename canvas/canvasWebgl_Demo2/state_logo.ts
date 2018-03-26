class stateLogo implements IState
{
    action: MyCanvasAction;
    canvas: lighttool.spriteCanvas;
    tex: lighttool.spriteTexture;
    texmask: lighttool.spriteTexture;

    pick: boolean = false;//是否pick标记
    onInit(action: MyCanvasAction): void
    {
        this.action = action;
        this.canvas = action.canvas;
        this.tex = lighttool.textureMgr.Instance().load(this.canvas.webgl, "tex/btn.png");
        this.texmask = lighttool.textureMgr.Instance().load(this.canvas.webgl, "tex/btn_mask.png");

    }
    onUpdate(delta: number): void
    {

        this.mapx -= delta * 100;
        var xa = (this.canvas.height / 512 * 288) | 0;
        if (this.mapx > 0)
            this.mapx -= xa;
        if (this.mapx < -xa * 2)
            this.mapx += xa;

    }
    mapx: number = 0;

    drawback(c: lighttool.spriteCanvas, xadd: number)
    {
        var x: number = xadd;
        var t = lighttool.textureMgr.Instance().load(c.webgl, "tex/bg_day.png");
        var xa = (c.height / 512 * 288) | 0;
        while (x < c.width)
        {
            c.drawTexture(t, new lighttool.spriteRect(x, 0, xa, c.height), new lighttool.spriteRect(0, 0, 288 / 512, 1));
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

        this.drawex("bird", "title", 0.5, 0.3);
        if (this.btndown)
        {
            this.drawex("bird", "button_play", 0.5, 0.61);
        }
        else
        {
            this.startBtnRect = this.drawex("bird", "button_play", 0.5, 0.6);
        }


        this.tex.draw(this.canvas.spriteBatcher, lighttool.spriteRect.one, new lighttool.spriteRect(0, 0, 256, 256),
            this.pick ?new lighttool.spriteColor(1,0,0,1): lighttool.spriteColor.white);
        //绘制按钮,pick 红色
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
        //像素检查
        this.pick = false;
        var reader = this.texmask.getReader(true);
        if (reader != null)
        {//将鼠标位置换算回uv单位
            this.texmask.dispose(); //由于这张图片我们只做像素检查，不用来绘制
                                    //所以getReader 成功之后可以将它dispose掉

            var c = reader.getPixel(x / this.tex.width, y / this.tex.height);
            if (c != null)
            {
                if (c > 128)
                    this.pick = true;
            }
        }


        if (e == lighttool.canvaspointevent.POINT_DOWN && this.checkRect(this.startBtnRect, x, y))
        {
            this.btndown = true;
        }
        if (e == lighttool.canvaspointevent.POINT_UP && this.btndown == true)
        {
            this.btndown = false;
            if (this.checkRect(this.startBtnRect, x, y))
            {
                this.action.changeState(new statePlay());
            }
        }

    }

}
