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
//# sourceMappingURL=canvasAdapter_Native.js.map