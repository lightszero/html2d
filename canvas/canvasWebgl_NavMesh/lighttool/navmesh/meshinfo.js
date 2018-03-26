var lighttool;
(function (lighttool) {
    var NavMesh;
    (function (NavMesh) {
        var navVec3 = (function () {
            function navVec3() {
                this.x = 0;
                this.y = 0;
                this.z = 0;
            }
            navVec3.prototype.clone = function () {
                var navVec = new navVec3();
                navVec.x = this.x;
                navVec.y = this.y;
                navVec.z = this.z;
                return navVec;
            };
            navVec3.DistAZ = function (start, end) {
                var num = end.x - start.x;
                var num2 = end.z - start.z;
                return Math.sqrt(num * num + num2 * num2);
            };
            navVec3.NormalAZ = function (start, end) {
                var num = end.x - start.x;
                var num2 = end.z - start.z;
                var num3 = Math.sqrt(num * num + num2 * num2);
                var navVec = new navVec3();
                navVec.x = num / num3;
                navVec.y = 0.0;
                navVec.z = num2 / num3;
                return navVec;
            };
            navVec3.Cross = function (start, end) {
                var navVec = new navVec3();
                navVec.x = start.y * end.z - start.z * end.y;
                navVec.y = start.z * end.x - start.x * end.z;
                navVec.z = start.x * end.y - start.y * end.x;
                return navVec;
            };
            navVec3.DotAZ = function (start, end) {
                return start.x * end.x + start.z * end.z;
            };
            navVec3.Angle = function (start, end) {
                var d = start.x * end.x + start.z * end.z;
                var navVec = navVec3.Cross(start, end);
                var num = Math.acos(d);
                var flag = navVec.y < 0.0;
                if (flag) {
                    num = -num;
                }
                return num;
            };
            navVec3.Border = function (start, end, dist) {
                var navVec = navVec3.NormalAZ(start, end);
                var navVec2 = new navVec3();
                navVec2.x = start.x + navVec.x * dist;
                navVec2.y = start.y + navVec.y * dist;
                navVec2.z = start.z + navVec.z * dist;
                return navVec2;
            };
            return navVec3;
        }());
        NavMesh.navVec3 = navVec3;
        var navNode = (function () {
            function navNode() {
                this.nodeID = 0;
                this.poly = null;
                this.borderByPoly = null;
                this.borderByPoint = null;
                this.center = null;
            }
            navNode.prototype.genBorder = function () {
                var list = [];
                for (var i = 0; i < this.poly.length; i = i + 1) {
                    var num = i;
                    var num2 = i + 1;
                    var flag = num2 >= this.poly.length;
                    if (flag) {
                        num2 = 0;
                    }
                    var num3 = this.poly[num];
                    var num4 = this.poly[num2];
                    var flag2 = num3 < num4;
                    if (flag2) {
                        list.push(num3 + "-" + num4);
                    }
                    else {
                        list.push(num4 + "-" + num3);
                    }
                }
                this.borderByPoint = list;
            };
            navNode.prototype.isLinkTo = function (info, nid) {
                var flag = this.nodeID === nid;
                var result;
                if (flag) {
                    result = null;
                }
                else {
                    var flag2 = nid < 0;
                    if (flag2) {
                        result = null;
                    }
                    else {
                        var array = this.borderByPoly;
                        for (var i = 0; i < array.length; i = i + 1) {
                            var text = array[i];
                            var flag3 = (info.borders[text] == undefined);
                            if (!flag3) {
                                var flag4 = info.borders[text].nodeA === nid || info.borders[text].nodeB === nid;
                                if (flag4) {
                                    result = text;
                                    return result;
                                }
                            }
                        }
                        result = null;
                    }
                }
                return result;
            };
            navNode.prototype.getLinked = function (info) {
                var list = [];
                var array = this.borderByPoly;
                for (var i = 0; i < array.length; i = i + 1) {
                    var key = array[i];
                    var flag = (info.borders[key] == undefined);
                    if (!flag) {
                        var flag2 = info.borders[key].nodeA === this.nodeID;
                        var num;
                        if (flag2) {
                            num = info.borders[key].nodeB;
                        }
                        else {
                            num = info.borders[key].nodeA;
                        }
                        var flag3 = num >= 0;
                        if (flag3) {
                            list.push(num);
                        }
                    }
                }
                return list;
            };
            navNode.prototype.genCenter = function (info) {
                this.center = new navVec3();
                this.center.x = 0.0;
                this.center.y = 0.0;
                this.center.z = 0.0;
                var array = this.poly;
                for (var i = 0; i < array.length; i = i + 1) {
                    var num = array[i];
                    this.center.x += info.vecs[num].x;
                    this.center.y += info.vecs[num].y;
                    this.center.z += info.vecs[num].z;
                }
                this.center.x /= this.poly.length;
                this.center.y /= this.poly.length;
                this.center.z /= this.poly.length;
            };
            return navNode;
        }());
        NavMesh.navNode = navNode;
        var navBorder = (function () {
            function navBorder() {
                this.borderName = null;
                this.nodeA = 0;
                this.nodeB = 0;
                this.pointA = 0;
                this.pointB = 0;
                this.length = 0;
                this.center = null;
            }
            return navBorder;
        }());
        NavMesh.navBorder = navBorder;
        var navMeshInfo = (function () {
            function navMeshInfo() {
                this.vecs = null;
                this.nodes = null;
                this.borders = null;
                this.min = null;
                this.max = null;
            }
            navMeshInfo.prototype.calcBound = function () {
                this.min = new navVec3();
                this.max = new navVec3();
                this.min.x = 1.7976931348623157E+308;
                this.min.y = 1.7976931348623157E+308;
                this.min.z = 1.7976931348623157E+308;
                this.max.x = -1.7976931348623157E+308;
                this.max.y = -1.7976931348623157E+308;
                this.max.z = -1.7976931348623157E+308;
                for (var i = 0; i < this.vecs.length; i = i + 1) {
                    var flag = this.vecs[i].x < this.min.x;
                    if (flag) {
                        this.min.x = this.vecs[i].x;
                    }
                    var flag2 = this.vecs[i].y < this.min.y;
                    if (flag2) {
                        this.min.y = this.vecs[i].y;
                    }
                    var flag3 = this.vecs[i].z < this.min.z;
                    if (flag3) {
                        this.min.z = this.vecs[i].z;
                    }
                    var flag4 = this.vecs[i].x > this.max.x;
                    if (flag4) {
                        this.max.x = this.vecs[i].x;
                    }
                    var flag5 = this.vecs[i].y > this.max.y;
                    if (flag5) {
                        this.max.y = this.vecs[i].y;
                    }
                    var flag6 = this.vecs[i].z > this.max.z;
                    if (flag6) {
                        this.max.z = this.vecs[i].z;
                    }
                }
            };
            navMeshInfo.cross = function (p0, p1, p2) {
                return (p1.x - p0.x) * (p2.z - p0.z) - (p2.x - p0.x) * (p1.z - p0.z);
            };
            navMeshInfo.prototype.inPoly = function (p, poly) {
                var num = 0;
                var flag = poly.length < 3;
                var result;
                if (flag) {
                    result = false;
                }
                else {
                    var flag2 = navMeshInfo.cross(this.vecs[poly[0]], p, this.vecs[poly[1]]) < (-num);
                    if (flag2) {
                        result = false;
                    }
                    else {
                        var flag3 = navMeshInfo.cross(this.vecs[poly[0]], p, this.vecs[poly[poly.length - 1]]) > num;
                        if (flag3) {
                            result = false;
                        }
                        else {
                            var i = 2;
                            var num2 = poly.length - 1;
                            var num3 = -1;
                            while (i <= num2) {
                                var num4 = i + num2 >> 1;
                                var flag4 = navMeshInfo.cross(this.vecs[poly[0]], p, this.vecs[poly[num4]]) < (-num);
                                if (flag4) {
                                    num3 = num4;
                                    num2 = num4 - 1;
                                }
                                else {
                                    i = num4 + 1;
                                }
                            }
                            var num5 = navMeshInfo.cross(this.vecs[poly[num3 - 1]], p, this.vecs[poly[num3]]);
                            result = (num5 > num);
                        }
                    }
                }
                return result;
            };
            navMeshInfo.prototype.genBorder = function () {
                var __border = {};
                for (var i0 = 0; i0 < this.nodes.length; i0 = i0 + 1) {
                    var n = this.nodes[i0];
                    for (var i1 = 0; i1 < n.borderByPoint.length; i1 = i1 + 1) {
                        var b = n.borderByPoint[i1];
                        if (__border[b] == undefined) {
                            __border[b] = new navBorder();
                            __border[b].borderName = b;
                            __border[b].nodeA = n.nodeID;
                            __border[b].nodeB = -1;
                            __border[b].pointA = -1;
                        }
                        else {
                            __border[b].nodeB = n.nodeID;
                            if (__border[b].nodeA > __border[b].nodeB) {
                                __border[b].nodeB = __border[b].nodeA;
                                __border[b].nodeB = n.nodeID;
                            }
                            var na = this.nodes[__border[b].nodeA];
                            var nb = this.nodes[__border[b].nodeB];
                            for (var i2 = 0; i2 < na.poly.length; i2 = i2 + 1) {
                                var i = na.poly[i2];
                                if (nb.poly.indexOf(i) >= 0) {
                                    if (__border[b].pointA == -1)
                                        __border[b].pointA = i;
                                    else
                                        __border[b].pointB = i;
                                }
                            }
                            var left = __border[b].pointA;
                            var right = __border[b].pointB;
                            var xd = this.vecs[left].x - this.vecs[right].x;
                            var yd = this.vecs[left].y - this.vecs[right].y;
                            var zd = this.vecs[left].z - this.vecs[right].z;
                            __border[b].length = Math.sqrt(xd * xd + yd * yd + zd * zd);
                            __border[b].center = new navVec3();
                            __border[b].center.x = this.vecs[left].x * 0.5 + this.vecs[right].x * 0.5;
                            __border[b].center.y = this.vecs[left].y * 0.5 + this.vecs[right].y * 0.5;
                            __border[b].center.z = this.vecs[left].z * 0.5 + this.vecs[right].z * 0.5;
                            __border[b].borderName = __border[b].nodeA + "-" + __border[b].nodeB;
                        }
                    }
                }
                var namechange = {}; // Dictionary< string, string> = new Dictionary<string, string>();
                for (var key in __border) {
                    if (__border[key].nodeB < 0) {
                    }
                    else {
                        namechange[key] = __border[key].borderName;
                    }
                }
                this.borders = {}; // new Dictionary<string, navBorder>();
                for (var key in __border) {
                    if (namechange[key] != undefined) {
                        this.borders[namechange[key]] = __border[key];
                    }
                }
                for (var m = 0; m < this.nodes.length; m = m + 1) {
                    var v = this.nodes[m];
                    var newborder = [];
                    for (var nnn = 0; nnn < v.borderByPoint.length; nnn = nnn + 1) {
                        var b = v.borderByPoint[nnn];
                        if (namechange[b] != undefined) {
                            newborder.push(namechange[b]);
                        }
                    }
                    v.borderByPoly = newborder;
                }
            };
            navMeshInfo.LoadMeshInfo = function (s) {
                var j = JSON.parse(s);
                var info = new navMeshInfo();
                var listVec = []; //new List<navVec3>();
                for (var jsonid in j["v"]) {
                    var v3 = new navVec3();
                    v3.x = j["v"][jsonid][0];
                    v3.y = j["v"][jsonid][1];
                    v3.z = j["v"][jsonid][2];
                    listVec.push(v3);
                }
                info.vecs = listVec;
                var polys = [];
                var list = j["p"];
                for (var i = 0; i < list.length; i++) 
                //foreach (var json in j.asDict()["p"].AsList())
                {
                    var json = list[i];
                    var node = new navNode();
                    node.nodeID = i;
                    var poly = []; //new List<int>();
                    for (var tt in json) {
                        poly.push(json[tt]);
                    }
                    node.poly = poly;
                    node.genBorder(); //这里生成的border 是顶点border
                    node.genCenter(info);
                    polys.push(node);
                }
                info.nodes = polys;
                info.calcBound();
                info.genBorder(); //这里会修改为 polyborder，这是个偷懒的修改
                return info;
            };
            return navMeshInfo;
        }());
        NavMesh.navMeshInfo = navMeshInfo;
    })(NavMesh = lighttool.NavMesh || (lighttool.NavMesh = {}));
})(lighttool || (lighttool = {}));
//# sourceMappingURL=meshinfo.js.map