namespace lighttool
{
    //加载工具
    export class loadTool
    {
        static loadText(url: string, fun: (_txt: string, _err: Error) => void): void
        {
            var req = new XMLHttpRequest();//ness
            req.open("GET", url);
            req.onreadystatechange = () =>
            {
                if (req.readyState == 4)
                {
                    fun(req.responseText, null);
                }
            };
            req.onerror = () =>
            {
                fun(null, new Error("onerr in req:"));//ness
            };
            req.send();
        }


        static loadArrayBuffer(url: string, fun: (_bin: ArrayBuffer, _err: Error) => void): void
        {
            var req = new XMLHttpRequest();//ness

            req.open("GET", url);
            req.responseType = "arraybuffer";//ie 一定要在open之后修改responseType
            req.onreadystatechange = () =>
            {
                if (req.readyState == 4)
                {
                    //console.log("got bin:" + typeof (req.response) + req.responseType);
                    fun(req.response, null);
                }
            };
            req.onerror = () =>
            {
                fun(null, new Error("onerr in req:"));//ness
            };
            req.send();
        }

        static loadBlob(url: string, fun: (_blob: Blob, _err: Error) => void): void
        {
            var req = new XMLHttpRequest();//ness

            req.open("GET", url);
            req.responseType = "blob";//ie 一定要在open之后修改responseType
            req.onreadystatechange = () =>
            {
                if (req.readyState == 4)
                {
                    //console.log("got _blob:" + typeof (req.response) + req.responseType);
                    fun(req.response, null);
                }
            };
            req.onerror = () =>
            {
                fun(null, new Error("onerr in req:"));//ness
            };
            req.send();
        }


    }

    //shader
    export class shadercode
    {
        vscode: string;
        fscode: string;
        vs: WebGLShader;
        fs: WebGLShader;
        program: WebGLProgram;

        posPos: number = -1;
        posColor: number = -1;
        posColor2: number = -1;
        posUV: number = -1;
        uniMatrix: WebGLUniformLocation = null;
        uniTex0: WebGLUniformLocation = null;
        uniTex1: WebGLUniformLocation = null;
        compile(webgl: WebGLRenderingContext)
        {
            this.vs = webgl.createShader(WebGLRenderingContext.VERTEX_SHADER);
            this.fs = webgl.createShader(WebGLRenderingContext.FRAGMENT_SHADER);

            //分别编译shader
            webgl.shaderSource(this.vs, this.vscode);
            webgl.compileShader(this.vs);
            var r1 = webgl.getShaderParameter(this.vs, WebGLRenderingContext.COMPILE_STATUS);
            if (r1 == false)
            {
                alert(webgl.getShaderInfoLog(this.vs));
            }
            //
            webgl.shaderSource(this.fs, this.fscode);
            webgl.compileShader(this.fs);
            var r2 = webgl.getShaderParameter(this.fs, WebGLRenderingContext.COMPILE_STATUS);
            if (r2 == false)
            {
                alert(webgl.getShaderInfoLog(this.fs));
            }

            //program link
            this.program = webgl.createProgram();

            webgl.attachShader(this.program, this.vs);
            webgl.attachShader(this.program, this.fs);

            webgl.linkProgram(this.program);
            var r3 = webgl.getProgramParameter(this.program, WebGLRenderingContext.LINK_STATUS);
            if (r3 == false)
            {
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


        }
    }
    export class shaderParser
    {
        mapshader: { [id: string]: shadercode } = {};
        parser(txt: string): void
        {
            var s1 = txt.split("<--");
            for (var i in s1)
            {
                var s2 = s1[i].split("-->");
                var stag = s2[0].split(" ");//tags;
                var sshader = s2[1];//正文
                var lastname: string = "";
                var lasttag: number = 0;

                for (var j in stag)
                {
                    var t = stag[j];
                    if (t.length == 0) continue;
                    if (t == "vs")//vectexshader
                    {
                        lasttag = 1;
                    }
                    else if (t == "fs")//fragmentshader
                    {
                        lasttag = 2;
                    }
                    else
                    {
                        lastname = t.substring(1, t.length - 1);
                    }
                }
                if (lastname.length == 0) continue;
                if (this.mapshader[lastname] == undefined)
                    this.mapshader[lastname] = new shadercode();//ness
                if (lasttag == 1)
                    this.mapshader[lastname].vscode = sshader;
                else if (lasttag == 2)
                    this.mapshader[lastname].fscode = sshader;

            }
        }
        parseUrl(webgl: WebGLRenderingContext, url: string)
        {
            lighttool.loadTool.loadText(url, (txt, err) =>
            {
                this.parser(txt);
                this.compile(webgl);
                //spriteBatcher
            }
            );
        }
        dump(): void
        {
            for (var name in this.mapshader)
            {
                console.log("shadername:" + name);
                console.log("vs:" + this.mapshader[name].vscode);
                console.log("fs:" + this.mapshader[name].fscode);
            }

        }
        compile(webgl: WebGLRenderingContext)
        {
            for (var name in this.mapshader)
            {
                this.mapshader[name].compile(webgl);
            }
        }
    }

    //sprite 基本数据结构
    export class spriteRect
    {
        constructor(x: number = 0, y: number = 0, w: number = 0, h: number = 0)
        {
            this.x = x;
            this.y = y;
            this.w = w;
            this.h = h;
        }
        x: number;
        y: number;
        w: number;
        h: number;
        static one: spriteRect = new spriteRect(0, 0, 1, 1);//ness
        static zero: spriteRect = new spriteRect(0, 0, 0, 0);//ness
    }
    export class spriteColor
    {
        constructor(r: number = 1, g: number = 1, b: number = 1, a: number = 1)
        {
            this.r = r;
            this.g = g;
            this.b = b;
            this.a = a;
        }
        r: number;
        g: number;
        b: number;
        a: number;
        static white = new spriteColor(1, 1, 1, 1);//ness
        static black = new spriteColor(0, 0, 0, 1);//ness
        static gray = new spriteColor(0.5, 0.5, 0.5, 1);//ness
    }
    export class spritePoint
    {
        x: number;
        y: number;
        z: number;

        r: number;
        g: number;
        b: number;
        a: number;

        r2: number;
        g2: number;
        b2: number;
        a2: number;

        u: number;
        v: number;
    }

    //sprite材质
    export class spriteMat
    {
        shader: string;
        transparent: boolean;
        tex0: spriteTexture;
        tex1: spriteTexture;
        col0: spriteColor;
        col1: spriteColor;
    }
    export class stateRecorder
    {
        webgl: WebGLRenderingContext;
        constructor(webgl: WebGLRenderingContext)
        {
            this.webgl = webgl;
        }
        DEPTH_WRITEMASK: boolean;
        DEPTH_TEST: boolean;
        DEPTH_FUNC: number;
        BLEND: boolean;
        BLEND_EQUATION: number;
        BLEND_SRC_RGB: number;
        BLEND_SRC_ALPHA: number;
        BLEND_DST_RGB: number;
        BLEND_DST_ALPHA: number;
        CURRENT_PROGRAM: any;
        ARRAY_BUFFER: any;
        ACTIVE_TEXTURE: number;
        TEXTURE_BINDING_2D: any;
        record()
        {

            //记录状态
            this.DEPTH_WRITEMASK = this.webgl.getParameter(WebGLRenderingContext.DEPTH_WRITEMASK);
            this.DEPTH_TEST = this.webgl.getParameter(WebGLRenderingContext.DEPTH_TEST);
            this.DEPTH_FUNC = this.webgl.getParameter(WebGLRenderingContext.DEPTH_FUNC);
            //alphablend ，跟着mat走
            this.BLEND = this.webgl.getParameter(WebGLRenderingContext.BLEND);
            this.BLEND_EQUATION = this.webgl.getParameter(WebGLRenderingContext.BLEND_EQUATION);
            this.BLEND_SRC_RGB = this.webgl.getParameter(WebGLRenderingContext.BLEND_SRC_RGB);
            this.BLEND_SRC_ALPHA = this.webgl.getParameter(WebGLRenderingContext.BLEND_SRC_ALPHA);
            this.BLEND_DST_RGB = this.webgl.getParameter(WebGLRenderingContext.BLEND_DST_RGB);
            this.BLEND_DST_ALPHA = this.webgl.getParameter(WebGLRenderingContext.BLEND_DST_ALPHA);
            //    this.webgl.blendFuncSeparate(WebGLRenderingContext.ONE, WebGLRenderingContext.ONE_MINUS_SRC_ALPHA,
            //        WebGLRenderingContext.SRC_ALPHA, WebGLRenderingContext.ONE);
            this.CURRENT_PROGRAM = this.webgl.getParameter(WebGLRenderingContext.CURRENT_PROGRAM);
            this.ARRAY_BUFFER = this.webgl.getParameter(WebGLRenderingContext.ARRAY_BUFFER_BINDING);

            this.ACTIVE_TEXTURE = this.webgl.getParameter(WebGLRenderingContext.ACTIVE_TEXTURE);
            this.TEXTURE_BINDING_2D = this.webgl.getParameter(WebGLRenderingContext.TEXTURE_BINDING_2D);

        }
        restore()
        {
            //恢复状态
            this.webgl.depthMask(this.DEPTH_WRITEMASK);
            if (this.DEPTH_TEST)
                this.webgl.enable(WebGLRenderingContext.DEPTH_TEST);//这是ztest
            else
                this.webgl.disable(WebGLRenderingContext.DEPTH_TEST);//这是ztest
            this.webgl.depthFunc(this.DEPTH_FUNC);//这是ztest方法

            if (this.BLEND)
            {
                this.webgl.enable(WebGLRenderingContext.BLEND);
            }
            else
            {
                this.webgl.disable(WebGLRenderingContext.BLEND);
            }
            this.webgl.blendEquation(this.BLEND_EQUATION);

            this.webgl.blendFuncSeparate(this.BLEND_SRC_RGB, this.BLEND_DST_RGB,
                this.BLEND_SRC_ALPHA, this.BLEND_DST_ALPHA);

            this.webgl.useProgram(this.CURRENT_PROGRAM);
            this.webgl.bindBuffer(WebGLRenderingContext.ARRAY_BUFFER, this.ARRAY_BUFFER);

            this.webgl.activeTexture(this.ACTIVE_TEXTURE);
            this.webgl.bindTexture(WebGLRenderingContext.TEXTURE_2D, this.TEXTURE_BINDING_2D);

        }
    }
    export class spriteBatcher
    {
        webgl: WebGLRenderingContext;
        shaderparser: shaderParser;
        vbo: WebGLBuffer;
        //data: number[] = [];
        matrix: Float32Array;
        ztest: boolean = true;
        recorder: stateRecorder;
        constructor(webgl: WebGLRenderingContext, shaderparser: shaderParser)
        {
            this.webgl = webgl;
            this.shaderparser = shaderparser;
            this.vbo = webgl.createBuffer();
            var asp = (this.webgl.drawingBufferWidth / this.webgl.drawingBufferHeight);
            this.matrix = new Float32Array([
                1.0 / asp, 0, 0, 0,//去掉asp的影响
                0, 1, 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1
            ]);//ness
            this.recorder = new stateRecorder(webgl);//ness
        }
        begindraw()
        {
            this.recorder.record();
        }
        enddraw()
        {
            this.endbatch();

            this.recorder.restore();
        }
        shadercode: shadercode;
        //begindraw 和 setmat 到底要不要分开，这是需要再思考一下的
        mat: spriteMat;
        setMat(mat: spriteMat): void
        {
            if (mat == this.mat) return;
            this.endbatch();

            this.webgl.disable(WebGLRenderingContext.CULL_FACE);

            this.mat = mat;
            this.shadercode = this.shaderparser.mapshader[this.mat.shader];
            if (this.shadercode == undefined) return;
            //指定shader和vbo

            //关于深度 ，跟着spritebatcher走
            this.webgl.depthMask(false);//这是zwrite

            if (this.ztest)
            {
                this.webgl.enable(WebGLRenderingContext.DEPTH_TEST);//这是ztest
                this.webgl.depthFunc(WebGLRenderingContext.LEQUAL);//这是ztest方法
            }
            else
            {
                this.webgl.disable(WebGLRenderingContext.DEPTH_TEST);//这是ztest
            }

            if (this.mat.transparent)
            {
                //alphablend ，跟着mat走
                this.webgl.enable(WebGLRenderingContext.BLEND);
                this.webgl.blendEquation(WebGLRenderingContext.FUNC_ADD);
                //this.webgl.blendFunc(WebGLRenderingContext.ONE, WebGLRenderingContext.ONE_MINUS_SRC_ALPHA);
                this.webgl.blendFuncSeparate(WebGLRenderingContext.ONE, WebGLRenderingContext.ONE_MINUS_SRC_ALPHA,
                    WebGLRenderingContext.SRC_ALPHA, WebGLRenderingContext.ONE);
            }
            else
            {
                this.webgl.disable(WebGLRenderingContext.BLEND);
            }

            this.webgl.useProgram(this.shadercode.program);
            this.webgl.bindBuffer(WebGLRenderingContext.ARRAY_BUFFER, this.vbo);


            //指定固定的数据结构，然后根据存在program的数据去绑定咯。

            //绑定vbo和shader顶点格式，这部分应该要区分材质改变与参数改变，可以少切换一些状态
            if (this.shadercode.posPos >= 0)
            {
                this.webgl.enableVertexAttribArray(this.shadercode.posPos);
                //28 是数据步长(字节)，就是数据结构的长度
                //12 是数据偏移（字节）
                this.webgl.vertexAttribPointer(this.shadercode.posPos, 3, WebGLRenderingContext.FLOAT, false, 52, 0);
            }
            if (this.shadercode.posColor >= 0)
            {
                this.webgl.enableVertexAttribArray(this.shadercode.posColor);
                this.webgl.vertexAttribPointer(this.shadercode.posColor, 4, WebGLRenderingContext.FLOAT, false, 52, 12);
            }
            if (this.shadercode.posColor2 >= 0)
            {
                this.webgl.enableVertexAttribArray(this.shadercode.posColor2);
                this.webgl.vertexAttribPointer(this.shadercode.posColor2, 4, WebGLRenderingContext.FLOAT, false, 52, 28);
            }
            if (this.shadercode.posUV >= 0)
            {
                this.webgl.enableVertexAttribArray(this.shadercode.posUV);
                this.webgl.vertexAttribPointer(this.shadercode.posUV, 2, WebGLRenderingContext.FLOAT, false, 52, 44);
            }

            if (this.shadercode.uniMatrix != null)
            {
                this.webgl.uniformMatrix4fv(this.shadercode.uniMatrix, false, this.matrix);
            }
            if (this.shadercode.uniTex0 != null)
            {
                this.webgl.activeTexture(WebGLRenderingContext.TEXTURE0);
                var tex = <spriteTexture>this.mat.tex0;
                this.webgl.bindTexture(WebGLRenderingContext.TEXTURE_2D, tex == null ? null : tex.texture);
                this.webgl.uniform1i(this.shadercode.uniTex0, 0);
                //console.log("settex");
            }
            if (this.shadercode.uniTex1 != null)
            {
                this.webgl.activeTexture(WebGLRenderingContext.TEXTURE1);
                var tex = <spriteTexture>this.mat.tex1;
                this.webgl.bindTexture(WebGLRenderingContext.TEXTURE_2D, tex == null ? null : tex.texture);
                this.webgl.uniform1i(this.shadercode.uniTex1, 1);
                //console.log("settex");
            }
        }
        array: Float32Array = new Float32Array(1024 * 13);//ness
        dataseek: number = 0;
        endbatch(): void
        {
            this.mat = null;
            if (this.dataseek == 0)
                return;
            //填充vbo
            this.webgl.bufferData(WebGLRenderingContext.ARRAY_BUFFER, this.array, WebGLRenderingContext.DYNAMIC_DRAW);
            //绘制
            this.webgl.drawArrays(WebGLRenderingContext.TRIANGLES, 0, this.dataseek);
            //清理状态，可以不干
            //this.webgl.bindBuffer(WebGLRenderingContext.ARRAY_BUFFER, null);

            //this.data.length = 0;
            this.dataseek = 0;
        }
        addQuad(ps: spritePoint[]): void//添加四边形，必须是四的倍数
        {
            if (this.shadercode == undefined) return;
            {
                for (var j = 0; j < 3; j++)
                {
                    let i = this.dataseek * 13;
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
                }
                for (var j = 3; j > 0; j--)
                {
                    let i = this.dataseek * 13;
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

                }
            }
            if (this.dataseek >= 1000)
            {
                this.endbatch();
            }
        }
        addTri(ps: spritePoint[]): void//添加三角形，必须是三的倍数
        {
            if (this.shadercode == undefined) return;

            {
                for (var j = 0; j < 3; j++)
                {
                    let i = this.dataseek * 13;
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
            if (this.dataseek >= 1000)
            {
                this.endbatch();
            }

        }
    }

    //texture
    export enum textureformat
    {
        RGBA = WebGLRenderingContext.RGBA,
        RGB = WebGLRenderingContext.RGB,
        GRAY = WebGLRenderingContext.LUMINANCE,
        //ALPHA = WebGLRenderingContext.ALPHA,
    }
    export class spriteTexture
    {
        constructor(webgl: WebGLRenderingContext, url: string = null, format: textureformat = textureformat.RGBA, mipmap: boolean = false, linear: boolean = true)
        {
            this.webgl = webgl;
            if (url == null)//不给定url 则 texture 不加载
                return;
            this.texture = this.webgl.createTexture();
            this.img = new Image();// HTMLImageElement(); //ness
            this.img.src = url;
            this.img.onload = () =>
            {
                if (this.disposeit)
                {
                    this.img = null;
                    return;
                }
                this.loaded = true;
                this.webgl.pixelStorei(WebGLRenderingContext.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 1);
                this.webgl.pixelStorei(WebGLRenderingContext.UNPACK_FLIP_Y_WEBGL, 0);


                this.webgl.bindTexture(WebGLRenderingContext.TEXTURE_2D, this.texture);
                this.webgl.texImage2D(WebGLRenderingContext.TEXTURE_2D,
                    0,
                    format,
                    format,
                    //最后这个type，可以管格式
                    WebGLRenderingContext.UNSIGNED_BYTE
                    , this.img);

                if (mipmap)
                {
                    //生成mipmap
                    this.webgl.generateMipmap(WebGLRenderingContext.TEXTURE_2D);

                    if (linear)
                    {
                        this.webgl.texParameteri(WebGLRenderingContext.TEXTURE_2D, WebGLRenderingContext.TEXTURE_MAG_FILTER, WebGLRenderingContext.LINEAR);
                        this.webgl.texParameteri(WebGLRenderingContext.TEXTURE_2D, WebGLRenderingContext.TEXTURE_MIN_FILTER, WebGLRenderingContext.LINEAR_MIPMAP_LINEAR);
                    }
                    else
                    {
                        this.webgl.texParameteri(WebGLRenderingContext.TEXTURE_2D, WebGLRenderingContext.TEXTURE_MAG_FILTER, WebGLRenderingContext.NEAREST);
                        this.webgl.texParameteri(WebGLRenderingContext.TEXTURE_2D, WebGLRenderingContext.TEXTURE_MIN_FILTER, WebGLRenderingContext.NEAREST_MIPMAP_NEAREST);

                    }
                }
                else
                {
                    if (linear)
                    {
                        this.webgl.texParameteri(WebGLRenderingContext.TEXTURE_2D, WebGLRenderingContext.TEXTURE_MAG_FILTER, WebGLRenderingContext.LINEAR);
                        this.webgl.texParameteri(WebGLRenderingContext.TEXTURE_2D, WebGLRenderingContext.TEXTURE_MIN_FILTER, WebGLRenderingContext.LINEAR);
                    }
                    else
                    {
                        this.webgl.texParameteri(WebGLRenderingContext.TEXTURE_2D, WebGLRenderingContext.TEXTURE_MAG_FILTER, WebGLRenderingContext.NEAREST);
                        this.webgl.texParameteri(WebGLRenderingContext.TEXTURE_2D, WebGLRenderingContext.TEXTURE_MIN_FILTER, WebGLRenderingContext.NEAREST);

                    }
                }
                this.img = null;
            }

            this.mat = new spriteMat();//ness
            this.mat.tex0 = this;
            this.mat.transparent = true;
            this.mat.shader = "spritedefault";
        }
        webgl: WebGLRenderingContext;
        img: HTMLImageElement = null;
        loaded: boolean = false;
        texture: WebGLTexture;

        mat: spriteMat = null;

        disposeit: boolean = false;
        dispose()
        {
            if (this.texture == null && this.img != null)
                this.disposeit = true;

            if (this.texture != null)
            {
                this.webgl.deleteTexture(this.texture);
            }
        }
        pointbuf: spritePoint[] = [
            { x: 0, y: 0, z: 0, r: 0, g: 0, b: 0, a: 0, r2: 0, g2: 0, b2: 0, a2: 0, u: 0, v: 0 },
            { x: 0, y: 0, z: 0, r: 0, g: 0, b: 0, a: 0, r2: 0, g2: 0, b2: 0, a2: 0, u: 0, v: 0 },
            { x: 0, y: 0, z: 0, r: 0, g: 0, b: 0, a: 0, r2: 0, g2: 0, b2: 0, a2: 0, u: 0, v: 0 },
            { x: 0, y: 0, z: 0, r: 0, g: 0, b: 0, a: 0, r2: 0, g2: 0, b2: 0, a2: 0, u: 0, v: 0 },
        ];

        draw(spriteBatcher: spriteBatcher, uv: spriteRect, rect: spriteRect, c: spriteColor)
        {

            {
                let p = this.pointbuf[0];
                p.x = rect.x; p.y = rect.y + rect.h; p.z = 0;
                p.u = uv.x; p.v = uv.y + uv.h;
                p.r = c.r; p.g = c.g; p.b = c.b; p.a = c.a;

                p = this.pointbuf[1];
                p.x = rect.x + rect.w; p.y = rect.y + rect.h; p.z = 0;
                p.u = uv.x + uv.w; p.v = uv.y + uv.h;
                p.r = c.r; p.g = c.g; p.b = c.b; p.a = c.a;

                p = this.pointbuf[2];
                p.x = rect.x; p.y = rect.y; p.z = 0;
                p.u = uv.x; p.v = uv.y;
                p.r = c.r; p.g = c.g; p.b = c.b; p.a = c.a;

                p = this.pointbuf[3];
                p.x = rect.x + rect.w; p.y = rect.y; p.z = 0;
                p.u = uv.x + uv.w; p.v = uv.y;
                p.r = c.r; p.g = c.g; p.b = c.b; p.a = c.a;
            }
            spriteBatcher.setMat(this.mat);
            spriteBatcher.addQuad(this.pointbuf);

        }

        drawCustom(spriteBatcher: spriteBatcher, mat: spriteMat, uv: spriteRect, rect: spriteRect, c: spriteColor, c2: spriteColor)
        {
            {
                let p = this.pointbuf[0];
                p.x = rect.x; p.y = rect.y + rect.h; p.z = 0;
                p.u = uv.x; p.v = uv.y + uv.h;
                p.r = c.r; p.g = c.g; p.b = c.b; p.a = c.a;
                p.r2 = c2.r; p.g2 = c2.g; p.b2 = c2.b; p.a2 = c2.a;

                p = this.pointbuf[1];
                p.x = rect.x + rect.w; p.y = rect.y + rect.h; p.z = 0;
                p.u = uv.x + uv.w; p.v = uv.y + uv.h;
                p.r = c.r; p.g = c.g; p.b = c.b; p.a = c.a;
                p.r2 = c2.r; p.g2 = c2.g; p.b2 = c2.b; p.a2 = c2.a;

                p = this.pointbuf[2];
                p.x = rect.x; p.y = rect.y; p.z = 0;
                p.u = uv.x; p.v = uv.y;
                p.r = c.r; p.g = c.g; p.b = c.b; p.a = c.a;
                p.r2 = c2.r; p.g2 = c2.g; p.b2 = c2.b; p.a2 = c2.a;

                p = this.pointbuf[3];
                p.x = rect.x + rect.w; p.y = rect.y; p.z = 0;
                p.u = uv.x + uv.w; p.v = uv.y;
                p.r = c.r; p.g = c.g; p.b = c.b; p.a = c.a;
                p.r2 = c2.r; p.g2 = c2.g; p.b2 = c2.b; p.a2 = c2.a;
            }
            spriteBatcher.setMat(this.mat);
            spriteBatcher.addQuad(this.pointbuf);

        }
    }

    //atlas
    export class spriteAtlas
    {
        webgl: WebGLRenderingContext;
        constructor(webgl: WebGLRenderingContext, atlasurl: string, texture: spriteTexture)
        {
            this.webgl = webgl;
            lighttool.loadTool.loadText(atlasurl, (txt, err) =>
            {
                this.parse(this.webgl, txt);
            }
            );
            this.texture = texture;
        }
        textureurl: string;
        texturewidth: number;
        textureheight: number;
        texture: spriteTexture;
        sprites: { [id: string]: spriteRect } = {};
        parse(webgl: WebGLRenderingContext, txt: string): void
        {
            var json = JSON.parse(txt);
            this.textureurl = json["t"];
            this.texturewidth = json["w"];
            this.textureheight = json["h"];
            var s = <[]>json["s"];

            for (var i in s)
            {
                var ss = <[]>s[i];
                var r: spriteRect = new spriteRect();//ness
                r.x = (<number>ss[1] + 0.5) / this.texturewidth;
                r.y = (<number>ss[2] + 0.5) / this.textureheight;
                r.w = (<number>ss[3] - 1) / this.texturewidth;
                r.h = (<number>ss[4] - 1) / this.textureheight;
                this.sprites[<string>ss[0]] = r;
            }

        }
        drawByTexture(sb: spriteBatcher, sname: string, rect: spriteRect, c: spriteColor)
        {
            if (this.texture == null) return;
            let r = this.sprites[sname];
            if (r == undefined) return;

            this.texture.draw(sb, r, rect, c);
        }

    }

    //font
    export class charinfo
    {
        x: number;//uv
        y: number;
        w: number;
        h: number;
        xSize: number;
        ySize: number;
        xOffset: number;//偏移
        yOffset: number;
        xAddvance: number;//字符宽度
    }
    export class spriteFont
    {
        webgl: WebGLRenderingContext;
        texture: spriteTexture;
        mat: spriteMat;

        cmap: { [id: string]: charinfo };
        fontname: string;
        pointSize: number;//像素尺寸
        padding: number;//间隔
        lineHeight: number;//行高
        baseline: number;//基线
        atlasWidth: number;
        atlasHeight: number;
        constructor(webgl: WebGLRenderingContext, urlconfig: string, texture: spriteTexture)
        {
            this.webgl = webgl;
            lighttool.loadTool.loadText(urlconfig, (txt, err) =>
            {
                let d1 = new Date().valueOf();
                let json = JSON.parse(txt);

                //parse fontinfo
                var font = <[]>json["font"];
                this.fontname = <string>font[0];
                this.pointSize = <number>font[1];
                this.padding = <number>font[2];
                this.lineHeight = <number>font[3];
                this.baseline = <number>font[4];
                this.atlasWidth = <number>font[5];
                this.atlasHeight = <number>font[6];

                //parse char map
                this.cmap = {};
                let map = json["map"];
                for (var c in map)
                {
                    let finfo = new charinfo();//ness
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


                let d2 = new Date().valueOf();
                let n = d2 - d1;
                console.log("json time=" + n);
            }
            );

            this.texture = texture;
            this.mat = new spriteMat();//ness
            this.mat.shader = "spritefont";
            this.mat.tex0 = this.texture;
            this.mat.transparent = true;
        }

        pointbuf: spritePoint[] = [
            { x: 0, y: 0, z: 0, r: 0, g: 0, b: 0, a: 0, r2: 0, g2: 0, b2: 0, a2: 0, u: 0, v: 0 },
            { x: 0, y: 0, z: 0, r: 0, g: 0, b: 0, a: 0, r2: 0, g2: 0, b2: 0, a2: 0, u: 0, v: 0 },
            { x: 0, y: 0, z: 0, r: 0, g: 0, b: 0, a: 0, r2: 0, g2: 0, b2: 0, a2: 0, u: 0, v: 0 },
            { x: 0, y: 0, z: 0, r: 0, g: 0, b: 0, a: 0, r2: 0, g2: 0, b2: 0, a2: 0, u: 0, v: 0 },
        ];

        drawChar(sb: spriteBatcher, cname: string, rect: spriteRect, c: spriteColor = spriteColor.white, colorBorder: spriteColor = new spriteColor(0, 0, 0, 0.5))
        {
            var r = this.cmap[cname];
            if (r == undefined) return;

            {
                let p = this.pointbuf[0];
                p.x = rect.x; p.y = rect.y + rect.h; p.z = 0;
                p.u = r.x; p.v = r.y + r.h;
                p.r = c.r; p.g = c.g; p.b = c.b; p.a = c.a;
                p.r2 = colorBorder.r; p.g2 = colorBorder.g; p.b2 = colorBorder.b; p.a2 = colorBorder.a;

                p = this.pointbuf[1];
                p.x = rect.x + rect.w; p.y = rect.y + rect.h; p.z = 0;
                p.u = r.x + r.w; p.v = r.y + r.h;
                p.r = c.r; p.g = c.g; p.b = c.b; p.a = c.a;
                p.r2 = colorBorder.r; p.g2 = colorBorder.g; p.b2 = colorBorder.b; p.a2 = colorBorder.a;

                p = this.pointbuf[2];
                p.x = rect.x; p.y = rect.y; p.z = 0;
                p.u = r.x; p.v = r.y;
                p.r = c.r; p.g = c.g; p.b = c.b; p.a = c.a;
                p.r2 = colorBorder.r; p.g2 = colorBorder.g; p.b2 = colorBorder.b; p.a2 = colorBorder.a;

                p = this.pointbuf[3];
                p.x = rect.x + rect.w; p.y = rect.y; p.z = 0;
                p.u = r.x + r.w; p.v = r.y;
                p.r = c.r; p.g = c.g; p.b = c.b; p.a = c.a;
                p.r2 = colorBorder.r; p.g2 = colorBorder.g; p.b2 = colorBorder.b; p.a2 = colorBorder.a;
            }
            sb.setMat(this.mat);
            sb.addQuad(this.pointbuf);
        }
    }

}