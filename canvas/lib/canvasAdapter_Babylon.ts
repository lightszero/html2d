namespace lighttool.Babylon
{
    export class canvasAdapter
    {
        static CreateScreenCanvas(scene: BABYLON.Scene, useraction: canvasAction): spriteCanvas
        {
            var webgl = scene.getEngine()._gl;
            var c = new spriteCanvas(webgl, webgl.drawingBufferWidth, webgl.drawingBufferHeight);
            var range = scene.getEngine().getRenderingCanvasClientRect();
            //var asp = range.width / range.height;
            c.spriteBatcher.matrix = new Float32Array([
                1.0 * 2 / range.width, 0, 0, 0,//去掉asp的影响
                0, 1 * -1 * 2 / range.height, 0, 0,
                0, 0, 1, 0,
                -1, 1, 0, 1
            ]);
            c.spriteBatcher.ztest = false;//最前不需要ztest

            var ua = useraction;

            scene.onAfterRenderObservable.add(() =>
            {
                c.spriteBatcher.begindraw();

                ua.ondraw(c);

                c.spriteBatcher.enddraw();
            });
            window.addEventListener("resize", () =>
            {
                var range = scene.getEngine().getRenderingCanvasClientRect();
                c.width = range.width;
                c.height = range.height;
                c.spriteBatcher.matrix = new Float32Array([
                    1.0 * 2 / range.width, 0, 0, 0,//去掉asp的影响
                    0, 1 * -1 * 2 / range.height, 0, 0,
                    0, 0, 1, 0,
                    -1, 1, 0, 1
                ]);
                //do resize func
                ua.onresize(c);
            });
            scene.onPointerObservable.add((pinfo: BABYLON.PointerInfo, state: BABYLON.EventState) =>
            {
                var range = scene.getEngine().getRenderingCanvasClientRect();
                //输入
                var e: lighttool.canvaspointevent = lighttool.canvaspointevent.NONE;
                if (pinfo.type == BABYLON.PointerEventTypes.POINTERDOWN)
                    e = lighttool.canvaspointevent.POINT_DOWN;
                if (pinfo.type == BABYLON.PointerEventTypes.POINTERMOVE)
                    e = lighttool.canvaspointevent.POINT_MOVE;
                if (pinfo.type == BABYLON.PointerEventTypes.POINTERUP)
                    e = lighttool.canvaspointevent.POINT_UP;

                //缩放到canvas size
                var x = pinfo.event.offsetX / range.width * c.width;
                var y = pinfo.event.offsetY / range.height * c.height;

                var skip: boolean = ua.onpointevent(c, e, x, y);
                //对 babylon，来说 2d在这里输入，3d 要 pick 以后咯

                state.skipNextObservers = skip;//是否中断事件
            }
            );

            return c;
        }


        static Create3DCanvas(scene: BABYLON.Scene, canvasWidth: number, canvasHeight: number, useraction: canvasAction): BABYLON.Mesh
        {
            var webgl = scene.getEngine()._gl;

            var c = new spriteCanvas(webgl, canvasWidth, canvasHeight);
            c.spriteBatcher.ztest = true;
            let asp = c.width / c.height;

            var node = BABYLON.Mesh.CreatePlane("canvas3d", 1, scene);
            node.material = new BABYLON.StandardMaterial("canvas3d", scene);
            node.material.alpha = 0;
            node.isPickable = true;


            node.scaling.x = node.scaling.y * asp;
            var ua = useraction;

            //the temp way
           
            node.onAfterRenderObservable.add(() =>
            {
                {//calc 3DMatrix
                    var camera = scene.activeCamera;
                    var vp = camera.getViewMatrix().multiply(camera._projectionMatrix);
                    var m = node._worldMatrix.clone();

                    var cl = new BABYLON.Matrix();
                    let asp = c.width / c.height;

                    cl.m = new Float32Array([
                        1.0 * 1 / c.width, 0, 0, 0,//去掉asp的影响
                        0, 1 * -1 * 1 / c.height, 0, 0,
                        0, 0, 1, 0,
                        -0.5, 0.5, 0, 1
                    ]);
                    m = cl.multiply(m); //加上我们的canvas调整

                    var mvp = m.multiply(vp);
                    //calc matrix here.
                    c.spriteBatcher.matrix = mvp.asArray();

                    //自动缩放
                    node.scaling.x = node.scaling.y * asp;

                }

                c.spriteBatcher.begindraw();

                ua.ondraw(c);

                c.spriteBatcher.enddraw();
            });

            //noresize event for3D

            //3Dpoint event is waiting.
            let px: number = -10000;
            let py: number = -10000;
            scene.onPointerObservable.add((pinfo: BABYLON.PointerInfo, state: BABYLON.EventState) =>
            {
                var range = scene.getEngine().getRenderingCanvasClientRect();
                //输入
                var e: lighttool.canvaspointevent = lighttool.canvaspointevent.NONE;
                if (pinfo.type == BABYLON.PointerEventTypes.POINTERDOWN)
                    e = lighttool.canvaspointevent.POINT_DOWN;
                if (pinfo.type == BABYLON.PointerEventTypes.POINTERMOVE)
                    e = lighttool.canvaspointevent.POINT_MOVE;
                if (pinfo.type == BABYLON.PointerEventTypes.POINTERUP)
                    e = lighttool.canvaspointevent.POINT_UP;

                var skip: boolean = false;

                if (pinfo.pickInfo.pickedMesh == node)//pick 到咱了
                {
                    px = pinfo.pickInfo.bu  * c.width;
                    py = (1 - pinfo.pickInfo.bv) * c.height;
                    skip = ua.onpointevent(c, e, px, py);
                    console.log("pick:" + pinfo.pickInfo.bu + "," + pinfo.pickInfo.bv);
                }
                else if (px > -1000 && py > -1000 && e == lighttool.canvaspointevent.POINT_UP)
                {
                    skip = ua.onpointevent(c, e, px, py);
                }


                state.skipNextObservers = skip;//是否中断事件
            }
            );
            return node;
        }
    }

}