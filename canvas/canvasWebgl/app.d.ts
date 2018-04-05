declare namespace lighttool {
    enum canvaspointevent {
        NONE = 0,
        POINT_DOWN = 1,
        POINT_UP = 2,
        POINT_MOVE = 3,
    }
    interface canvasAction {
        onresize(c: spriteCanvas): void;
        ondraw(c: spriteCanvas): void;
        onpointevent(c: spriteCanvas, e: canvaspointevent, x: number, y: number): boolean;
    }
    class spriteCanvas {
        webgl: WebGLRenderingContext;
        width: number;
        height: number;
        constructor(webgl: WebGLRenderingContext, width: number, height: number);
        spriteBatcher: spriteBatcher;
        drawTexture(texture: ITexture2D, rect: spriteRect, uvrect?: spriteRect, color?: spriteColor): void;
        drawTextureCustom(texture: ITexture2D, _mat: spriteMat, rect: spriteRect, uvrect?: spriteRect, color?: spriteColor, color2?: spriteColor): void;
        drawSprite(atlas: string, sprite: string, rect: spriteRect, color?: spriteColor): void;
        drawSpriteCustom(atlas: string, sprite: string, _mat: spriteMat, rect: spriteRect, color?: spriteColor, color2?: spriteColor): void;
        drawSprite9(atlas: string, sprite: string, rect: spriteRect, border: spriteBorder, color?: spriteColor): void;
        drawSprite9Custom(atlas: string, sprite: string, _mat: spriteMat, rect: spriteRect, border: spriteBorder, color?: spriteColor, color2?: spriteColor): void;
        uvrect: spriteRect;
        trect: spriteRect;
        drawText(font: string, text: string, rect: spriteRect, color?: spriteColor, color2?: spriteColor): void;
    }
}
declare namespace lighttool {
    class texutreMgrItem {
        tex: ITexture2D | null;
        url: string;
        urladd: string;
        format: textureformat;
        mipmap: boolean;
        linear: boolean;
    }
    class textureMgr {
        private static g_this;
        static Instance(): textureMgr;
        mapInfo: {
            [id: string]: texutreMgrItem;
        };
        reg(url: string, urladd: string, format: textureformat, mipmap: boolean, linear: boolean): void;
        regDirect(url: string, tex: ITexture2D): void;
        unreg(url: string): void;
        unload(url: string): void;
        load(webgl: WebGLRenderingContext, url: string): ITexture2D | null;
    }
    class atlasMgrItem {
        atals: spriteAtlas | null;
        url: string;
        urlatalstex: string;
        urlatalstex_add: string;
    }
    class atlasMgr {
        private static g_this;
        static Instance(): atlasMgr;
        mapInfo: {
            [id: string]: atlasMgrItem;
        };
        reg(name: string, urlatlas: string, urlatalstex: string, urlatalstex_add: string): void;
        unreg(name: string, disposetex: boolean): void;
        regDirect(name: string, atlas: spriteAtlas): void;
        unload(name: string, disposetex: boolean): void;
        load(webgl: WebGLRenderingContext, name: string): spriteAtlas | null;
    }
    class fontMgrItem {
        font: spriteFont | null;
        url: string;
        urlatalstex: string;
        urlatalstex_add: string;
    }
    class fontMgr {
        private static g_this;
        static Instance(): fontMgr;
        mapInfo: {
            [id: string]: fontMgrItem;
        };
        reg(name: string, urlfont: string, urlatalstex: string, urlatalstex_add: string): void;
        regDirect(name: string, font: spriteFont): void;
        unreg(name: string, disposetex: boolean): void;
        unload(name: string, disposetex: boolean): void;
        load(webgl: WebGLRenderingContext, name: string): spriteFont | null;
    }
    class shaderMgr {
        private static g_shaderParser;
        static parserInstance(): lighttool.shaderParser;
    }
}
declare namespace lighttool {
    class loadTool {
        static loadText(url: string, fun: (_txt: string | null, _err: Error | null) => void): void;
        static loadArrayBuffer(url: string, fun: (_bin: ArrayBuffer | null, _err: Error | null) => void): void;
        static loadBlob(url: string, fun: (_blob: Blob | null, _err: Error | null) => void): void;
    }
    class shadercode {
        vscode: string;
        fscode: string;
        vs: WebGLShader | null;
        fs: WebGLShader | null;
        program: WebGLProgram | null;
        posPos: number;
        posColor: number;
        posColor2: number;
        posUV: number;
        uniMatrix: WebGLUniformLocation | null;
        uniTex0: WebGLUniformLocation | null;
        uniTex1: WebGLUniformLocation | null;
        uniCol0: WebGLUniformLocation | null;
        uniCol1: WebGLUniformLocation | null;
        compile(webgl: WebGLRenderingContext): void;
    }
    class shaderParser {
        mapshader: {
            [id: string]: shadercode;
        };
        private _parser(txt);
        parseUrl(webgl: WebGLRenderingContext, url: string): void;
        parseDirect(webgl: WebGLRenderingContext, txt: string): void;
        dump(): void;
        compile(webgl: WebGLRenderingContext): void;
    }
    class spriteRect {
        constructor(x?: number, y?: number, w?: number, h?: number);
        x: number;
        y: number;
        w: number;
        h: number;
        static one: spriteRect;
        static zero: spriteRect;
    }
    class spriteBorder {
        constructor(l?: number, t?: number, r?: number, b?: number);
        l: number;
        t: number;
        r: number;
        b: number;
        static zero: spriteBorder;
    }
    class spriteColor {
        constructor(r?: number, g?: number, b?: number, a?: number);
        r: number;
        g: number;
        b: number;
        a: number;
        static white: spriteColor;
        static black: spriteColor;
        static gray: spriteColor;
    }
    class spritePoint {
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
    class spriteMat {
        shader: string;
        transparent: boolean;
        tex0: ITexture2D | null;
        tex1: ITexture2D | null;
        col0: spriteColor;
        col1: spriteColor;
    }
    class stateRecorder {
        webgl: WebGLRenderingContext;
        constructor(webgl: WebGLRenderingContext);
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
        record(): void;
        restore(): void;
    }
    class spriteBatcher {
        webgl: WebGLRenderingContext;
        shaderparser: shaderParser;
        vbo: WebGLBuffer | null;
        matrix: Float32Array;
        ztest: boolean;
        recorder: stateRecorder;
        constructor(webgl: WebGLRenderingContext, shaderparser: shaderParser);
        begindraw(): void;
        enddraw(): void;
        shadercode: shadercode;
        mat: spriteMat | null;
        setMat(mat: spriteMat): void;
        array: Float32Array;
        dataseek: number;
        endbatch(): void;
        addQuad(ps: spritePoint[]): void;
        addTri(ps: spritePoint[]): void;
        addRect(ps: spritePoint[]): void;
        rectClip: spriteRect | null;
        setRectClip(rect: spriteRect): void;
        closeRectClip(): void;
    }
    enum textureformat {
        RGBA = 1,
        RGB = 2,
        GRAY = 3,
    }
    class texReader {
        constructor(webgl: WebGLRenderingContext, texRGBA: WebGLTexture, width: number, height: number, gray?: boolean);
        width: number;
        height: number;
        data: Uint8Array;
        gray: boolean;
        getPixel(u: number, v: number): any;
    }
    interface ITexture2D {
        texture: WebGLTexture | null;
        mat: spriteMat | null;
        getReader(redOnly: boolean): texReader | null;
        dispose(): void;
        draw(spriteBatcher: spriteBatcher, uv: spriteRect, rect: spriteRect, c: spriteColor): void;
        drawCustom(spriteBatcher: spriteBatcher, _mat: spriteMat, uv: spriteRect, rect: spriteRect, c: spriteColor, c2: spriteColor): void;
    }
    class dynTexture implements ITexture2D {
        constructor(webgl: WebGLRenderingContext, width: number, height: number, format?: textureformat, mipmap?: boolean, linear?: boolean);
        private _loadData(mipmap, linear);
        updateData(): void;
        data: Uint8Array;
        webgl: WebGLRenderingContext;
        mat: spriteMat | null;
        texture: WebGLTexture | null;
        format: textureformat;
        mipmap: boolean;
        linear: boolean;
        width: number;
        height: number;
        reader: texReader;
        getReader(redOnly: boolean): texReader | null;
        disposeit: boolean;
        dispose(): void;
        pointbuf: spritePoint[];
        draw(spriteBatcher: spriteBatcher, uv: spriteRect, rect: spriteRect, c: spriteColor): void;
        drawCustom(spriteBatcher: spriteBatcher, _mat: spriteMat, uv: spriteRect, rect: spriteRect, c: spriteColor, c2: spriteColor): void;
    }
    class spriteTexture implements ITexture2D {
        constructor(webgl: WebGLRenderingContext, url?: string | null, format?: textureformat, mipmap?: boolean, linear?: boolean);
        private _loadimg(mipmap, linear);
        webgl: WebGLRenderingContext;
        img: HTMLImageElement | null;
        loaded: boolean;
        texture: WebGLTexture | null;
        format: textureformat;
        width: number;
        height: number;
        static fromRaw(webgl: WebGLRenderingContext, img: HTMLImageElement, format?: textureformat, mipmap?: boolean, linear?: boolean): spriteTexture;
        mat: spriteMat | null;
        reader: texReader;
        getReader(redOnly: boolean): texReader | null;
        disposeit: boolean;
        dispose(): void;
        pointbuf: spritePoint[];
        draw(spriteBatcher: spriteBatcher, uv: spriteRect, rect: spriteRect, c: spriteColor): void;
        drawCustom(spriteBatcher: spriteBatcher, _mat: spriteMat, uv: spriteRect, rect: spriteRect, c: spriteColor, c2: spriteColor): void;
    }
    class sprite {
        x: number;
        y: number;
        w: number;
        h: number;
        xsize: number;
        ysize: number;
    }
    class spriteAtlas {
        webgl: WebGLRenderingContext;
        constructor(webgl: WebGLRenderingContext, atlasurl?: string | null, texture?: ITexture2D | null);
        static fromRaw(webgl: WebGLRenderingContext, txt: string, texture?: spriteTexture | null): spriteAtlas;
        textureurl: string;
        texturewidth: number;
        textureheight: number;
        texture: ITexture2D | null;
        sprites: {
            [id: string]: sprite;
        };
        private _parse(txt);
        drawByTexture(sb: spriteBatcher, sname: string, rect: spriteRect, c: spriteColor): void;
    }
    class charinfo {
        x: number;
        y: number;
        w: number;
        h: number;
        xSize: number;
        ySize: number;
        xOffset: number;
        yOffset: number;
        xAddvance: number;
    }
    class spriteFont {
        webgl: WebGLRenderingContext;
        texture: ITexture2D | null;
        mat: spriteMat;
        cmap: {
            [id: string]: charinfo;
        };
        fontname: string;
        pointSize: number;
        padding: number;
        lineHeight: number;
        baseline: number;
        atlasWidth: number;
        atlasHeight: number;
        constructor(webgl: WebGLRenderingContext, urlconfig: string | null, texture: ITexture2D | null);
        static fromRaw(webgl: WebGLRenderingContext, txt: string, texture?: spriteTexture | null): spriteFont;
        _parse(txt: string): void;
        pointbuf: spritePoint[];
        draw(sb: spriteBatcher, r: charinfo, rect: spriteRect, c?: spriteColor, colorBorder?: spriteColor): void;
        drawChar(sb: spriteBatcher, cname: string, rect: spriteRect, c?: spriteColor, colorBorder?: spriteColor): void;
    }
}
declare namespace lighttool.Native {
    class canvasAdapter {
        static CreateScreenCanvas(webgl: WebGLRenderingContext, useraction: canvasAction): spriteCanvas;
    }
}
declare class MyCanvasAction implements lighttool.canvasAction {
    constructor();
    onresize(c: lighttool.spriteCanvas): void;
    mat: lighttool.spriteMat;
    spritenames: string[];
    white: lighttool.spriteColor;
    trect: lighttool.spriteRect;
    trectBtn: lighttool.spriteRect;
    btndown: boolean;
    ts: string;
    showtxt: string;
    custMat: lighttool.spriteMat;
    cdDrawer: coolDownDrawer[];
    timer: number;
    ondraw(c: lighttool.spriteCanvas): void;
    onpointevent(c: lighttool.spriteCanvas, e: lighttool.canvaspointevent, x: number, y: number): boolean;
}
declare class triForDeath {
    tri: lighttool.spritePoint[];
    beginX: number;
    beginY: number;
    endX: number;
    endY: number;
    show: boolean;
}
declare class coolDownDrawer {
    constructor(_atlas: lighttool.spriteAtlas, _sprite: string);
    private _initValue();
    private atlas;
    private sprite;
    private arrayvec;
    value: number;
    destRect: lighttool.spriteRect;
    private needChange;
    updateTris(): void;
    setValue(v: number): void;
    setDestRect(rect: lighttool.spriteRect): void;
    draw(sb: lighttool.spriteBatcher): void;
}
