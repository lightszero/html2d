class stateNavMesh implements IState
{
    action: MyCanvasAction;
    canvas: lighttool.spriteCanvas;
    navinfo: lighttool.NavMesh.navMeshInfo;
    mat: lighttool.spriteMat;
    onInit(action: MyCanvasAction): void
    {
        this.action = action;
        this.canvas = action.canvas;
        lighttool.loadTool.loadText("navinfo/navinfo03.json.txt", (txt, err) =>
        {
            this.navinfo = lighttool.NavMesh.navMeshInfo.LoadMeshInfo(txt);
        });
        this.mat = new lighttool.spriteMat();
        this.mat.shader = "testC";
        this.mat.transparent = false;

    }
    xAdd: number;
    yAdd: number;
    xScale: number;
    yScale: number;

    onUpdate(delta: number): void
    {
        if (this.navinfo != null)
        {
            this.xAdd = this.navinfo.min.x;
            this.yAdd = this.navinfo.min.z;
            this.xScale = (this.navinfo.max.x - this.navinfo.min.x) / this.canvas.width;
            this.yScale = (this.navinfo.max.z - this.navinfo.min.z) / this.canvas.height;
        }
    }
    mapx: number = 0;
    ps: lighttool.spritePoint[] = [
        { x: 0, y: 0, z: 0, r: 0, g: 0, b: 1, a: 1, r2: 0, g2: 0, b2: 0, a2: 0, u: 0, v: 0 },
        { x: 0, y: 0, z: 0, r: 0, g: 0, b: 1, a: 1, r2: 0, g2: 0, b2: 0, a2: 0, u: 0, v: 0 },
        { x: 0, y: 0, z: 0, r: 0, g: 0, b: 1, a: 1, r2: 0, g2: 0, b2: 0, a2: 0, u: 0, v: 0 },
        { x: 0, y: 0, z: 0, r: 0, g: 0, b: 1, a: 1, r2: 0, g2: 0, b2: 0, a2: 0, u: 0, v: 0 }

    ];
    _drawLine(v1: lighttool.NavMesh.navVec3, v2: lighttool.NavMesh.navVec3, border: number, r: number, g: number, b: number)
    {
        var up = new lighttool.NavMesh.navVec3();
        up.x = 0;
        up.y = 1;
        up.z = 0;

        var dir = lighttool.NavMesh.navVec3.NormalAZ(v1, v2);
        var right = lighttool.NavMesh.navVec3.Cross(dir, up);
        var v1l = v1.clone();
        var v1r = v1.clone();
        var v2l = v2.clone();
        var v2r = v2.clone();
        v1l.x += right.x * border;
        v1l.z += right.z * border;
        v1r.x -= right.x * border;
        v1r.z -= right.z * border;
        v2l.x += right.x * border;
        v2l.z += right.z * border;
        v2r.x -= right.x * border;
        v2r.z -= right.z * border;
        this.ps[0].x = (v1l.x - this.xAdd) / this.xScale;
        this.ps[0].y = (v1l.z - this.yAdd) / this.yScale;
        this.ps[0].r = r;
        this.ps[0].g = g;
        this.ps[0].b = b;
        this.ps[1].x = (v1r.x - this.xAdd) / this.xScale;
        this.ps[1].y = (v1r.z - this.yAdd) / this.yScale;
        this.ps[1].r = r;
        this.ps[1].g = g;
        this.ps[1].b = b;
        this.ps[2].x = (v2l.x - this.xAdd) / this.xScale;
        this.ps[2].y = (v2l.z - this.yAdd) / this.yScale;
        this.ps[2].r = r;
        this.ps[2].g = g;
        this.ps[2].b = b;
        this.ps[3].x = (v2r.x - this.xAdd) / this.xScale;
        this.ps[3].y = (v2r.z - this.yAdd) / this.yScale;
        this.ps[3].r = r;
        this.ps[3].g = g;
        this.ps[3].b = b;
        this.canvas.spriteBatcher.addQuad(this.ps);

    }
    _drawPoly(poly: number[], border: number, r: number, g: number, b: number)
    {


        //draw tri
        var v0 = this.navinfo.vecs[poly[0]];
        this.ps[0].x = (v0.x - this.xAdd) / this.xScale;
        this.ps[0].y = (v0.z - this.yAdd) / this.yScale;
        this.ps[0].r = r;
        this.ps[0].g = g;
        this.ps[0].b = b;

        for (var i = 0; i < poly.length - 2; i++)
        {
            var v1 = this.navinfo.vecs[poly[i + 1]];
            var v2 = this.navinfo.vecs[poly[i + 2]];
            this.ps[1].x = (v1.x - this.xAdd) / this.xScale;
            this.ps[1].y = (v1.z - this.yAdd) / this.yScale;
            this.ps[1].r = r;
            this.ps[1].g = g;
            this.ps[1].b = b;
            this.ps[2].x = (v2.x - this.xAdd) / this.xScale;
            this.ps[2].y = (v2.z - this.yAdd) / this.yScale;
            this.ps[2].r = r;
            this.ps[2].g = g;
            this.ps[2].b = b;
            this.canvas.spriteBatcher.addTri(this.ps);

        }

        //draw border
        for (var i = 0; i < poly.length; i++)
        {
            var i2 = i - 1;
            if (i2 < 0) i2 = poly.length - 1;
            var v1 = this.navinfo.vecs[poly[i]];
            var v2 = this.navinfo.vecs[poly[i2]];
            this._drawLine(v1, v2, border, 1, 1, 1);
        }
    }
    onDraw(): void
    {
        if (this.navinfo != null)
        {
            this.canvas.spriteBatcher.setMat(this.mat);



            for (var polyindex = 0; polyindex < this.navinfo.nodes.length; polyindex++)
            {
                var poly = this.navinfo.nodes[polyindex].poly;
                var r = 0;
                var g = 0;
                var b = 1;


                if (this.runway != null)
                {
                    if (this.runway.indexOf(polyindex) >= 0)
                    {
                        r = g = b = 0.5;
                    }
                }
                if (this.selectPoly == polyindex)
                {
                    r = 1;
                    g = 1;
                    b = 0;
                }
                if (this.selectPoly2 == polyindex)
                {
                    r = 0.5;
                    g = 1;
                    b = 0;
                }
                this._drawPoly(poly, 0.015, r, g, b);
            }

            if (this.waypoints != null)
            {
                for (var i = 0; i < this.waypoints.length - 1; i++)
                {
                    this._drawLine(this.waypoints[i], this.waypoints[i + 1], 0.015, 1, 0, 0);
                }
            }
        }

    }
    onExit(): void
    {
    }
    selectPoly: number = -1;
    selectVec: lighttool.NavMesh.navVec3;
    selectPoly2: number = -1;
    selectVec2: lighttool.NavMesh.navVec3;
    runway: number[];
    waypoints: lighttool.NavMesh.navVec3[];
    findpath()
    {
        if (this.selectPoly < 0 || this.selectPoly2 < 0)
            return;
        this.runway = lighttool.NavMesh.pathFinding.calcAStarPolyPath(this.navinfo, this.selectPoly, this.selectPoly2, this.selectVec2);
        if (this.runway == null)
        {
            this.waypoints = null;
        }
        else
        {
            //this.waypoints = [];
            //this.waypoints.push(this.selectVec);
            //this.waypoints.push(this.selectVec2);

            this.waypoints = lighttool.NavMesh.pathFinding.calcWayPoints(this.navinfo, this.selectVec, this.selectVec2, this.runway);
        }
    }
    onpointevent(e: lighttool.canvaspointevent, x: number, y: number)
    {
        var rx = x * this.xScale + this.xAdd;
        var ry = y * this.yScale + this.yAdd;
        var vec = new lighttool.NavMesh.navVec3();
        vec.x = rx;
        vec.y = 0;
        vec.z = ry;
        if (e == lighttool.canvaspointevent.POINT_DOWN || e == lighttool.canvaspointevent.POINT_UP)
        {

            if (e == lighttool.canvaspointevent.POINT_DOWN)
            {
                this.selectPoly = -1;
            }
            else
            {
                this.selectPoly2 = -1;
            }
            for (var p = 0; p < this.navinfo.nodes.length; p++)
            {
                if (this.navinfo.inPoly(vec, this.navinfo.nodes[p].poly))
                {
                    if (e == lighttool.canvaspointevent.POINT_DOWN)
                    {
                        this.selectPoly = p;
                        this.selectVec = vec.clone();
                    }
                    else
                    {
                        this.selectPoly2 = p;
                        this.selectVec2 = vec.clone();

                        if (this.selectPoly2 >= 0)
                            this.findpath();
                    }
                    break;
                }
            }

        }
    }
}
