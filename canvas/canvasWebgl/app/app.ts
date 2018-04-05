///<reference path="../lighttool/canvas.ts" />
///<reference path="../lighttool/resmgr.ts" />
///<reference path="../lighttool/spritebatcher.ts" />
///<reference path="../lighttool/canvas/canvasAdapter_Native.ts" />

class MyCanvasAction implements lighttool.canvasAction
{
    constructor()
    {
        this.mat = new lighttool.spriteMat();
        this.mat.shader = "test";
        this.mat.transparent = true;


    }
    //画布改变尺寸事件，只有全屏画布会收到，3D画布不会受外界影响主动改变尺寸
    onresize(c: lighttool.spriteCanvas): void
    {
    }
    mat: lighttool.spriteMat;
    spritenames: string[] = [];
    white: lighttool.spriteColor = new lighttool.spriteColor();
    trect: lighttool.spriteRect = new lighttool.spriteRect();
    trectBtn: lighttool.spriteRect = new lighttool.spriteRect(50, 150, 200, 50);
    btndown: boolean = false;
    ts = "我爱祖国天安门,让我们荡起双桨?";
    showtxt = "";

    custMat: lighttool.spriteMat | null = null;
    cdDrawer: coolDownDrawer[] = [];
    //绘制事件，在这里调用 c.drawXXX 去折腾吧
    timer: number = 0;
    ondraw(c: lighttool.spriteCanvas): void
    {
        this.timer += 0.015;
        if (this.timer > 2.0)
            this.timer -= 2.0;
        //get all sprite in atlas who named "1"
        if (this.spritenames.length == 0)
        {
            let atlas = lighttool.atlasMgr.Instance().load(c.webgl, "1");
            if (atlas != null)
            {
                for (var iname in atlas.sprites)
                {
                    this.spritenames.push(iname);
                }

                //init for drawer
                for (var cc = 0; cc < 10; cc++)
                {
                    this.cdDrawer.push(new coolDownDrawer(atlas, this.spritenames[cc]));
                    this.cdDrawer[cc].setDestRect(new lighttool.spriteRect(50 * cc, 50, 50, 50));
                }
            }
        }

        var t = lighttool.textureMgr.Instance().load(c.webgl, "tex/1.jpg");
        if (t != null)
        {
            this.trect.x = 0;
            this.trect.y = 0;
            this.trect.w = c.width;
            this.trect.h = c.height;
            c.drawTexture(t, this.trect, lighttool.spriteRect.one, new lighttool.spriteColor(1, 1, 1, 0.1));
        }

        //原生态做法,需要指定材质
        c.spriteBatcher.setMat(this.mat);
        c.spriteBatcher.addTri([
            { x: 500, y: 125, z: 0, r: 0, g: 0, b: 1, a: 1, r2: 0, g2: 0, b2: 1, a2: 1, u: 0, v: 0 },
            { x: 750, y: 175, z: 0, r: 1, g: 1, b: 1, a: 1, r2: 0, g2: 0, b2: 1, a2: 1, u: 0, v: 0 },
            { x: 250, y: 175, z: 0, r: 0.5, g: 0, b: 0.5, a: 1, r2: 0, g2: 0, b2: 1, a2: 1, u: 0, v: 0 },
        ]);

        c.spriteBatcher.setRectClip(new lighttool.spriteRect(60, 60, 300, 300));

        //and so have a  addQuad
        //draw atlas
        if (this.spritenames.length > 0)
        {
            //this.spriteBatcher.begindraw(this.atlas.mat);
            for (let i = 0; i < 30; i++)
            {
                var x = Math.random() * 500;
                var y = Math.random() * 500;
                let si = Math.random() * this.spritenames.length | 0;
                this.trect.x = x;
                this.trect.y = y;
                this.trect.w = 100;
                this.trect.h = 100;
                //canvas 做法
                c.drawSprite("1", this.spritenames[si], this.trect); //等同于下面的两行
                //var atlas = lighttool.atlasMgr.Instance().load(c.webgl, "1");
                //atlas.draw(c.spriteBatcher, this.spritenames[si], this.trect, this.white);
            }
        }

        //画三角形（底层方法）
        c.spriteBatcher.setMat(this.mat);
        c.spriteBatcher.addTri([
            { x: 500, y: 365, z: 0, r: 0, g: 0, b: 1, a: 1, r2: 0, g2: 0, b2: 1, a2: 1, u: 0, v: 0 },
            { x: 750, y: 325, z: 0, r: 1, g: 1, b: 1, a: 0.25, r2: 0, g2: 0, b2: 1, a2: 1, u: 1, v: 0 },
            { x: 250, y: 325, z: 0, r: 0.5, g: 0, b: 0.5, a: 0.5, r2: 0, g2: 0, b2: 1, a2: 1, u: 1, v: 1 },
        ]);

        //draw font（底层方法）
        var font = lighttool.fontMgr.Instance().load(c.webgl, "f1");
        if (font != null && font.cmap != null)
        {
            this.trect.x = 50;
            this.trect.y = 50;
            this.trect.w = 50;
            this.trect.h = 50;
            font.drawChar(c.spriteBatcher, "古", this.trect, lighttool.spriteColor.white, lighttool.spriteColor.gray);
            this.trect.x = 100;
            this.trect.y = 50;
            font.drawChar(c.spriteBatcher, "老", this.trect, new lighttool.spriteColor(0.1, 0.8, 0.2, 0.8), new lighttool.spriteColor(1, 1, 1, 0));
        }
        //drawfont canvas 方法
        this.trect.x = 50;
        this.trect.y = 150;
        this.trect.w = 200;
        this.trect.h = 50;
        if (t != null)
            c.drawTexture(t, this.trectBtn, lighttool.spriteRect.one, this.btndown ? lighttool.spriteColor.white : new lighttool.spriteColor(1, 1, 1, 0.5));
        c.drawText("f1", "this is Btn", this.trectBtn, this.btndown ? new lighttool.spriteColor(1, 0, 0, 1) : lighttool.spriteColor.white);


        if (this.custMat == null)
        {
            this.custMat = new lighttool.spriteMat();
            this.custMat.shader = "spritegray";
            this.custMat.transparent = true;
            this.custMat.col0 = new lighttool.spriteColor(0.3, 0.4, 1, 1);//变色 ,,纯白
        }

        c.drawSprite9Custom("1", "card_role_9_face", this.custMat, new lighttool.spriteRect(100, 100, 400, 300), new lighttool.spriteBorder(10, 10, 10, 10));
        c.spriteBatcher.closeRectClip();
        c.drawText("f1", "雷森帝", this.trectBtn, this.btndown ? new lighttool.spriteColor(1, 0, 0, 1) : lighttool.spriteColor.white);

        this.trect.x = 0;
        this.trect.y = 0;
        this.trect.w = 500;
        this.trect.h = 25;
        c.drawText("f1", this.showtxt, this.trect);

        var t2 = lighttool.textureMgr.Instance().load(c.webgl, "dtex");
        if (t2 != null)
            c.drawTexture(t2, new lighttool.spriteRect(0, 0, 128, 128));
        for (var ic = 0; ic < this.cdDrawer.length; ic++)
        {
            var v = (this.timer + ic * 0.4) % 2.0;
            if (v > 1.0) v = 2.0 - v;
            this.cdDrawer[ic].setValue(v);
            this.cdDrawer[ic].draw(c.spriteBatcher);
        }
    }

    //指针事件，还没检验这里
    onpointevent(c: lighttool.spriteCanvas, e: lighttool.canvaspointevent, x: number, y: number): boolean
    {
        var skipevent: boolean = false;
        this.showtxt = "point=   " + x + " |,| " + y;
        if (x > this.trectBtn.x && y > this.trectBtn.y && x < (this.trectBtn.x + this.trectBtn.w)
            && y < (this.trectBtn.y + this.trectBtn.h))
        {
            this.btndown = true;
        }
        else
        {
            this.btndown = false;
        }

        return skipevent;
    }

}
class triForDeath
{
    tri: lighttool.spritePoint[] = [];
    //开始向量，八边，长度0.5 开方
    beginX: number = 0;
    beginY: number = 0;
    //偏移向量，拉出三角形，长度0.5
    endX: number = 0;
    endY: number = 0;
    show: boolean = false;
}
class coolDownDrawer
{
    constructor(_atlas: lighttool.spriteAtlas, _sprite: string)
    {
        this.atlas = _atlas;
        this.sprite = _sprite;
        this._initValue();

        this.value = 1.0;
        this.destRect = new lighttool.spriteRect(0, 0, 100, 100);
        this.needChange = true;
    }
    private _initValue()
    {
        this.arrayvec = [];
        for (var i = 0; i < 8; i++)
        {
            var td: triForDeath = new triForDeath();
            td.tri = [
                { x: 0, y: 0, z: 0, r: 1, g: 1, b: 1, a: 1, r2: 0, g2: 0, b2: 0, a2: 0, u: 0, v: 0 },
                { x: 0, y: 0, z: 0, r: 1, g: 1, b: 1, a: 1, r2: 0, g2: 0, b2: 0, a2: 0, u: 0, v: 0 },
                { x: 0, y: 0, z: 0, r: 1, g: 1, b: 1, a: 1, r2: 0, g2: 0, b2: 0, a2: 0, u: 0, v: 0 },
            ];
            //收尾相接的配置每个三角形的构成边
            if (i == 0)
            {
                td.beginX = 0;
                td.beginY = -0.5;
                td.endX = -0.5;
                td.endY = -0.5;
            }
            if (i == 1)
            {
                td.beginX = -0.5;
                td.beginY = -0.5;
                td.endX = -0.5;
                td.endY = -0;
            }
            if (i == 2)
            {
                td.beginX = -0.5;
                td.beginY = 0;
                td.endX = -0.5;
                td.endY = 0.5;
            }
            if (i == 3)
            {
                td.beginX = -0.5;
                td.beginY = 0.5;
                td.endX = 0;
                td.endY = 0.5;
            }
            if (i == 4)
            {
                td.beginX = 0;
                td.beginY = 0.5;
                td.endX = 0.5;
                td.endY = 0.5;
            }
            if (i == 5)
            {
                td.beginX = 0.5;
                td.beginY = 0.5;
                td.endX = 0.5;
                td.endY = 0;
            }
            if (i == 6)
            {
                td.beginX = 0.5;
                td.beginY = 0;
                td.endX = 0.5;
                td.endY = -0.5;
            }
            if (i == 7)
            {
                td.beginX = 0.5;
                td.beginY = -0.5;
                td.endX = 0;
                td.endY = -0.5;
            }
            this.arrayvec.push(td);
        }
    }
    private atlas: lighttool.spriteAtlas;
    private sprite: string;
    private arrayvec: triForDeath[] = [];
    value: number;
    destRect: lighttool.spriteRect;
    private needChange: boolean;
    updateTris()
    {
        if (this.needChange == false) return;
        if (this.atlas.texture == null || this.atlas.texture.texture == null) return;
        var s = this.atlas.sprites[this.sprite];
        if (s == undefined) return;

        var cx = this.destRect.x + this.destRect.w * 0.5;
        var cy = this.destRect.y + this.destRect.h * 0.5;

        var ucx = s.x + s.w * 0.5;
        var ucy = s.y + s.h * 0.5;

        for (var i = 0; i < 8; i++)
        {
            var showlen = this.value * 8 - i;

            if (showlen < 0)//完全退化
            {
                this.arrayvec[i].show = false;
            }
            else
            {
                if (showlen > 1.0)
                    showlen = 1.0;

                var deathtri = this.arrayvec[i];
                deathtri.show = true;

                var endx = deathtri.endX * showlen + deathtri.beginX * (1 - showlen);
                var endy = deathtri.endY * showlen + deathtri.beginY * (1 - showlen);
                deathtri.tri[0].u = ucx;
                deathtri.tri[0].v = ucy;
                deathtri.tri[0].x = cx;
                deathtri.tri[0].y = cy;

                deathtri.tri[1].u = ucx + deathtri.beginX * s.w;
                deathtri.tri[1].v = ucy + deathtri.beginY * s.h;
                deathtri.tri[1].x = cx + deathtri.beginX * this.destRect.w;
                deathtri.tri[1].y = cy + deathtri.beginY * this.destRect.h;

                deathtri.tri[2].u = ucx + endx * s.w;
                deathtri.tri[2].v = ucy + endy * s.h;
                deathtri.tri[2].x = cx + endx * this.destRect.w;
                deathtri.tri[2].y = cy + endy * this.destRect.h;
            }
        }
        this.needChange = false;
    }
    setValue(v: number)
    {
        this.value = v;
        this.needChange = true;
    }
    setDestRect(rect: lighttool.spriteRect)
    {
        this.destRect.x = rect.x;
        this.destRect.y = rect.y;
        this.destRect.w = rect.w;
        this.destRect.h = rect.h;
        this.needChange = true;
    }
    draw(sb: lighttool.spriteBatcher)
    {
        this.updateTris();
        if (this.needChange == true)
            return;
        if (this.atlas && this.atlas.texture && this.atlas.texture.mat)
            sb.setMat(this.atlas.texture.mat);
        for (var i = 0; i < 8; i++)
        {
            if (this.arrayvec[i].show)
                sb.addTri(this.arrayvec[i].tri);
        }

    }
}
window.onload = () =>
{
    //var can2d_ = document.getElementById('renderCanvas') as HTMLCanvasElement;
    //可以用这个方法
    var can2d = document.createElement("canvas");
    var r2d = can2d.getContext("2d");
    if (r2d == null)
        return;

    r2d.fillStyle = "#000000";
    r2d.fillRect(0, 0, 24, 24);

    //r2d.te
    r2d.font = "22px MS Sans Serif,Arial,aa";
    r2d.fillStyle = "#ffffff";
    var info = r2d.measureText("hi");
    r2d.strokeStyle = "#000";
    r2d.textBaseline = "bottom";
    let fwidth = 24;
    let fheight = 24;
    r2d.fillText("李", 1, fheight - 1);
    //r2d.strokeText("py李", 0, 16);


    var id = r2d.getImageData(0, 0, fwidth, fheight);
    console.log(id.width + "," + id.height + "=" + id.data.length);
    var dat: Uint8ClampedArray = id.data;
    for (var ii = 0; ii < dat.length; ii++)
    {
        console.log(dat[ii]);
    }



    var canvas = document.getElementById('renderCanvas') as HTMLCanvasElement;
    var webgl = <WebGLRenderingContext>canvas.getContext('webgl') || <WebGLRenderingContext>canvas.getContext("experimental-webgl");
    //webglCanvas 使用流程
    //01.初始化材质，这个文件里配置了所有现阶段使用的shader，也可以放在不同的文件中，多执行几次parseUrl就行了
    //初始化材质
    //lighttool.shaderMgr.parserInstance().parseUrl(webgl, "shader/test.shader.txt?" + Math.random());


    var dtex = new lighttool.dynTexture(webgl, 64, 64, lighttool.textureformat.GRAY, false, false);
    lighttool.textureMgr.Instance().regDirect("dtex", dtex);
    for (var y = 0; y < fheight; y++)
    {
        for (var x = 0; x < fwidth; x++)
        {
            var i = (y * fwidth + x) * 4;
            var i2 = y * dtex.width + x;
            dtex.data[i2] = dat[i];
        }
    }
    dtex.updateData();

    //手动加载接口
    lighttool.loadTool.loadText("shader/test.shader.txt?" + Math.random(), (txt, err) =>
    {
        if (txt != null)

            lighttool.shaderMgr.parserInstance().parseDirect(webgl, txt);
    }
    );

    //02.初始化资源，这里只注册一个关系，到用到的时候才会真的去加载
    //注册贴图
    //贴图用 url 作为名字，提供一个 urladd，如果你想要价格random 啥的
    //lighttool.textureMgr.Instance().reg("tex/1.jpg", "?" + Math.random(), lighttool.textureformat.RGBA, true, true);

    //lighttool.textureMgr.Instance().reg("tex/1.jpg", "", lighttool.textureformat.RGBA, true, true);

    var img = new Image();
    img.src = "tex/1.jpg";
    img.onload = () =>
    {
        var _spimg = lighttool.spriteTexture.fromRaw(webgl, img, lighttool.textureformat.RGBA, true, true);
        lighttool.textureMgr.Instance().regDirect("tex/1.jpg", _spimg);
    };

    //注册图集(对应的贴图会自动注册到textureMgr),图集使用一个指定的名字，你注册给他啥名字，后面就用这个名字去使用
    lighttool.atlasMgr.Instance().reg("2", "atlas/2.json.txt?" + Math.random(), "tex/2.png", "?" + Math.random());


    var img2 = new Image();
    img2.src = "tex/1.png?" + Math.random();
    img2.onload = () =>
    {
        var _spimg2 = lighttool.spriteTexture.fromRaw(webgl, img2, lighttool.textureformat.RGBA, true, true);
        lighttool.textureMgr.Instance().regDirect("tex/1.png", _spimg2);

        lighttool.loadTool.loadText("atlas/1.json.txt?" + Math.random(), (txt, err) =>
        {
            if (txt != null)
            {
                var _atlas = lighttool.spriteAtlas.fromRaw(webgl, txt, _spimg2);
                lighttool.atlasMgr.Instance().regDirect("1", _atlas);
            }
        }
        );
    };

    //注册字体(对应的贴图会自动注册到textureMgr),字体使用一个指定的名字，你注册给他啥名字，后面就用这个名字去使用
    //lighttool.fontMgr.Instance().reg("f1", "font/STXINGKA.font.json.txt", "tex/STXINGKA.font.png", "");
    var img3 = new Image();
    img3.src = "tex/STXINGKA.font.png?" + Math.random();
    img3.onload = () =>
    {
        var _spimg3 = lighttool.spriteTexture.fromRaw(webgl, img3, lighttool.textureformat.RGBA, true, true);
        lighttool.textureMgr.Instance().regDirect("tex/STXINGKA.font.png", _spimg3);
        lighttool.loadTool.loadText("font/STXINGKA.font.json.txt", (txt, err) =>
        {
            if (txt != null)
            {
                var _font = lighttool.spriteFont.fromRaw(webgl, txt, _spimg3);
                lighttool.fontMgr.Instance().regDirect("f1", _font);
            }
        }
        );
    }
        ;

    lighttool.Native.canvasAdapter.CreateScreenCanvas(webgl, new MyCanvasAction());
};