namespace lighttool
{
    export enum canvaspointevent
    {
        NONE,
        POINT_DOWN,
        POINT_UP,
        POINT_MOVE,
    }
    export interface canvasAction
    {
        //resize 事件
        onresize(c: spriteCanvas): void;
        ondraw(c: spriteCanvas): void;
        onpointevent(c: spriteCanvas, e: canvaspointevent, x: number, y: number): boolean;
    }
    export class spriteCanvas
    {
        webgl: WebGLRenderingContext;
        //panel size
        width: number;
        height: number;
        constructor(webgl: WebGLRenderingContext, width: number, height: number)
        {
            this.webgl = webgl;
            this.width = width;
            this.height = height;
            this.spriteBatcher = new spriteBatcher(webgl, lighttool.shaderMgr.parserInstance());//ness
        }
        spriteBatcher: spriteBatcher;

        //draw tools
        drawTexture(texture: spriteTexture, rect: spriteRect, uvrect: spriteRect = spriteRect.one, color: spriteColor = spriteColor.white)
        {
            texture.draw(this.spriteBatcher, uvrect, rect, color);
        }
        drawSprite(atlas: string, sprite: string, rect: spriteRect, color: spriteColor = spriteColor.white)
        {
            let a = atlasMgr.Instance().load(this.webgl, atlas);
            if (a == null) return;
            var r = a.sprites[sprite];
            if (r == undefined) return;
            if (a.texture == null) return;

            a.texture.draw(this.spriteBatcher, r, rect, color);
        }
        trect: spriteRect = new spriteRect();//ness

        //绘制字体，只画一行，字体沿着左上角对齐，如需其他，参考源码自制
        drawText(font: string, text: string, rect: spriteRect, color: spriteColor = spriteColor.white, color2: spriteColor = spriteColor.black)
        {
            let f = fontMgr.Instance().load(this.webgl, font);
            if (f == null) return;
            if (f.cmap == undefined) return;
            let xadd = 0;
            for (let i = 0; i < text.length; i++)
            {
                let c = text.charAt(i);
                let cinfo = f.cmap[c];
                if (cinfo == undefined)
                {
                    continue;
                }
                let s = rect.h / f.lineHeight;

                this.trect.x = rect.x + xadd - cinfo.xOffset * s;//xadd 横移，cinfo.xOffset * s 偏移

                this.trect.y = rect.y - cinfo.yOffset * s + f.baseline * s;
                //cinfo.yOffset * s 偏移
                //f.baseline * s字体基线，不管字体基线字体的零零点在字体左下角，现在需要左上脚，需要其他对齐方式另说


                this.trect.h = s * cinfo.ySize;
                this.trect.w = s * cinfo.xSize;

                xadd += cinfo.xAddvance * s;
                if (xadd >= rect.w)
                    break;//超出绘制限定框，不画了
                f.drawChar(this.spriteBatcher, c, this.trect,color,color2);
            }
        }
    }

}