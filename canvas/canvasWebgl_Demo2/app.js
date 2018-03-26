var MyCanvasAction = (function () {
    function MyCanvasAction() {
        this.state = null;
    }
    //画布改变尺寸事件，只有全屏画布会收到，3D画布不会受外界影响主动改变尺寸
    MyCanvasAction.prototype.onresize = function (c) {
    };
    MyCanvasAction.prototype.changeState = function (state) {
        if (this.state != null)
            this.state.onExit();
        this.state = state;
        if (this.state != null)
            this.state.onInit(this);
    };
    //绘制事件，在这里调用 c.drawXXX 去折腾吧
    MyCanvasAction.prototype.ondraw = function (c) {
        if (this.state == null) {
            this.canvas = c;
            this.changeState(new stateLogo());
        }
        if (this.state != null) {
            this.state.onUpdate(20 / 1000);
            this.state.onDraw();
        }
    };
    //指针事件，还没检验这里
    MyCanvasAction.prototype.onpointevent = function (c, e, x, y) {
        if (this.state != null) {
            this.state.onpointevent(e, x, y);
        }
        return false;
    };
    return MyCanvasAction;
}());
window.onload = function () {
    var canvas = document.getElementById('renderCanvas');
    var webgl = canvas.getContext("experimental-webgl");
    //webglCanvas 使用流程
    //01.初始化材质，这个文件里配置了所有现阶段使用的shader，也可以放在不同的文件中，多执行几次parseUrl就行了
    //初始化材质
    lighttool.shaderMgr.parserInstance().parseUrl(webgl, "shader/test.shader.txt?" + Math.random());
    //02.初始化资源，这里只注册一个关系，到用到的时候才会真的去加载
    //注册贴图
    //贴图用 url 作为名字，提供一个 urladd，如果你想要价格random 啥的
    lighttool.textureMgr.Instance().reg("tex/1.jpg", "", lighttool.textureformat.RGBA, true, true);
    lighttool.textureMgr.Instance().reg("tex/btn.png", "", lighttool.textureformat.RGBA, true, true);
    lighttool.textureMgr.Instance().reg("tex/btn_mask.png", "", lighttool.textureformat.RGBA, false, false);
    //lighttool.textureMgr.Instance().reg("tex/1.jpg", "?" + Math.random(), lighttool.textureformat.RGBA, true, true);
    lighttool.textureMgr.Instance().reg("tex/bg_day.png", "", lighttool.textureformat.RGBA, false, false);
    lighttool.textureMgr.Instance().reg("tex/bg_night.png", "", lighttool.textureformat.RGBA, false, false);
    //注册图集(对应的贴图会自动注册到textureMgr),图集使用一个指定的名字，你注册给他啥名字，后面就用这个名字去使用
    lighttool.atlasMgr.Instance().reg("1", "atlas/1.json.txt?" + Math.random(), "tex/1.png", "?" + Math.random());
    lighttool.atlasMgr.Instance().reg("bird", "atlas/bird.json.txt?" + Math.random(), "tex/bird.png", "?" + Math.random());
    //注册字体(对应的贴图会自动注册到textureMgr),字体使用一个指定的名字，你注册给他啥名字，后面就用这个名字去使用
    lighttool.fontMgr.Instance().reg("f1", "font/STXINGKA.font.json.txt", "tex/STXINGKA.font.png", "");
    lighttool.Native.canvasAdapter.CreateScreenCanvas(webgl, new MyCanvasAction());
};
//# sourceMappingURL=app.js.map