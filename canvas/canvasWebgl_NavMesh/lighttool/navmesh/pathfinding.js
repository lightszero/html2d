///<reference path="meshinfo.ts" />
//v0.1
var lighttool;
(function (lighttool) {
    var NavMesh;
    (function (NavMesh) {
        var FindNode = /** @class */ (function () {
            function FindNode() {
                this.nodeid = 0;
                this.pathSessionId = 0;
                this.ParentID = -1;
                this.Open = false;
                this.HValue = 0;
                this.GValue = 0;
                this.ArrivalWall = 0;
            }
            FindNode.prototype.CalcHeuristic = function (info, endPos) {
                var center = info.nodes[this.nodeid].center;
                var num = Math.abs(center.x - endPos.x);
                var num2 = Math.abs(center.z - endPos.z);
                this.HValue = Math.sqrt(num * num + num2 * num2);
            };
            FindNode.prototype.GetCost = function (info, neighborID) {
                var bc = info.nodes[neighborID].center;
                var nc = info.nodes[this.nodeid].center;
                var xd = bc.x - nc.x;
                var yd = bc.y - nc.y;
                var zd = bc.z - nc.z;
                var d = Math.sqrt(xd * xd + yd * yd + zd * zd);
                return d;
            };
            return FindNode;
        }());
        var pathFinding = /** @class */ (function () {
            function pathFinding() {
            }
            pathFinding.calcAStarPolyPath = function (info, startPoly, endPoly, endPos, offset) {
                if (endPos === void 0) { endPos = null; }
                if (offset === void 0) { offset = 0.1; }
                var nodeFind = []; // new List<FindNode>();
                var nodes = info.nodes;
                for (var i = 0; i < nodes.length; i = i + 1) {
                    var navNode = nodes[i];
                    var findNode = new FindNode();
                    findNode.nodeid = navNode.nodeID;
                    nodeFind.push(findNode);
                }
                var flag = endPos === null;
                if (flag) {
                    endPos = info.nodes[endPoly].center.clone();
                }
                var findNode2 = nodeFind[startPoly];
                findNode2.nodeid = startPoly;
                var num = 1;
                var flag2 = false;
                var openList = []; //new List<number>();
                var list2 = []; //new List<number>();
                findNode2.pathSessionId = num;
                openList.push(startPoly);
                var sortfun = function (x, y) {
                    var xFvalue = nodeFind[x].HValue + nodeFind[x].GValue;
                    var yFvalue = nodeFind[y].HValue + nodeFind[y].GValue;
                    if (xFvalue < yFvalue - 0.001)
                        return 1;
                    if (xFvalue > yFvalue + 0.001)
                        return -1;
                    return 0;
                };
                while (openList.length > 0) {
                    var findNode3 = nodeFind[openList[openList.length - 1]];
                    openList.splice(openList.length - 1, 1);
                    list2.push(findNode3.nodeid);
                    var flag3 = findNode3.nodeid === endPoly;
                    if (flag3) {
                        flag2 = true;
                        break;
                    }
                    var linked = info.nodes[findNode3.nodeid].getLinked(info);
                    for (var j = 0; j < linked.length; j = j + 1) {
                        var num2 = linked[j];
                        var flag4 = num2 < 0;
                        if (!flag4) {
                            var findNode4 = nodeFind[num2];
                            var flag5 = findNode4 === null || findNode4.nodeid !== num2;
                            if (flag5) {
                                return null;
                            }
                            var flag6 = findNode4.pathSessionId !== num;
                            if (flag6) {
                                var text = info.nodes[findNode4.nodeid].isLinkTo(info, findNode3.nodeid);
                                var flag7 = text !== null && info.borders[text].length >= offset * 2;
                                if (flag7) {
                                    findNode4.pathSessionId = num;
                                    findNode4.ParentID = findNode3.nodeid;
                                    findNode4.Open = true;
                                    findNode4.CalcHeuristic(info, endPos);
                                    findNode4.GValue = findNode3.GValue + findNode3.GetCost(info, findNode4.nodeid);
                                    openList.push(findNode4.nodeid);
                                    openList.sort(sortfun);
                                    findNode4.ArrivalWall = findNode3.nodeid;
                                }
                            }
                            else {
                                var open = findNode4.Open;
                                if (open) {
                                    var flag8 = findNode4.GValue + findNode4.GetCost(info, findNode3.nodeid) < findNode3.GValue;
                                    if (flag8) {
                                        findNode3.GValue = findNode4.GValue + findNode4.GetCost(info, findNode3.nodeid);
                                        findNode3.ParentID = findNode4.nodeid;
                                        findNode3.ArrivalWall = findNode4.nodeid;
                                    }
                                }
                            }
                        }
                    }
                }
                var list3 = [];
                var flag9 = list2.length > 0;
                if (flag9) {
                    var findNode5 = nodeFind[list2[list2.length - 1]];
                    list3.push(findNode5.nodeid);
                    while (findNode5.ParentID !== -1) {
                        list3.push(findNode5.ParentID);
                        findNode5 = nodeFind[findNode5.ParentID];
                    }
                }
                var flag10 = !flag2;
                if (flag10) {
                    return null;
                }
                return list3;
            };
            pathFinding.NearAngle = function (a, b) {
                var num = a;
                var flag = a >= 180.0;
                if (flag) {
                    num = 360.0 - a;
                }
                var num2 = b;
                var flag2 = b >= 180.0;
                if (flag2) {
                    num2 = 360.0 - b;
                }
                var flag3 = num < num2;
                var result;
                if (flag3) {
                    result = a;
                }
                else {
                    result = b;
                }
                return result;
            };
            pathFinding.FindPath = function (info, startPos, endPos, offset) {
                if (offset === void 0) { offset = 0.1; }
                var startPoly = -1;
                var endPoly = -1;
                for (var i = 0; i < info.nodes.length; i = i + 1) {
                    var flag = info.inPoly(startPos, info.nodes[i].poly);
                    if (flag) {
                        startPoly = i;
                    }
                    var flag2 = info.inPoly(startPos, info.nodes[i].poly);
                    if (flag2) {
                        endPoly = i;
                    }
                }
                var polyPath = pathFinding.calcAStarPolyPath(info, startPoly, endPoly, endPos, offset);
                return pathFinding.calcWayPoints(info, startPos, endPos, polyPath, offset);
            };
            pathFinding.calcWayPoints = function (info, startPos, endPos, polyPath, offset) {
                if (offset === void 0) { offset = 0.1; }
                var wayPoints = []; // new List<navVec3>();
                if (polyPath.length == 0 || startPos == null || endPos == null) {
                    return null;
                }
                // 保证从起点到终点的顺序
                var triPathList = polyPath.reverse();
                wayPoints.push(startPos);
                var ipoly = 0; //从第0个poly 开始检查
                var dirLeft = null;
                var ipolyLeft = -1;
                var dirRight = null;
                var ipolyRight = -1;
                var breakDir = 0;
                var posLeft = null;
                var posRight = null;
                var posNow = startPos.clone();
                for (var c = 0; c < 100; c++) {
                    for (var i = ipoly; i < triPathList.length; i++) {
                        if (i === triPathList.length - 1) {
                            if (dirLeft == null || dirRight == null) {
                                breakDir = 0;
                                break;
                            }
                            else {
                                var dirFinal = lighttool.NavMesh.navVec3.NormalAZ(posNow, endPos);
                                var a1 = lighttool.NavMesh.navVec3.Angle(dirLeft, dirFinal);
                                var b1 = lighttool.NavMesh.navVec3.Angle(dirRight, dirFinal);
                                var flag4 = a1 * b1 > 0.0;
                                if (a1 * b1 > 0.0) {
                                    if (a1 > 0.0) {
                                        breakDir = 1;
                                    }
                                    else {
                                        breakDir = -1;
                                    }
                                }
                                else {
                                    breakDir = 0;
                                    break;
                                }
                            }
                        }
                        else {
                            //寻找边
                            var n1 = triPathList[i];
                            var n2 = triPathList[i + 1];
                            var bname = n1 + "-" + n2;
                            if (n2 < n1) {
                                bname = n2 + "-" + n1;
                            }
                            var border = info.borders[bname];
                            var pointA = lighttool.NavMesh.navVec3.Border(info.vecs[border.pointA], info.vecs[border.pointB], offset);
                            var pointB = lighttool.NavMesh.navVec3.Border(info.vecs[border.pointB], info.vecs[border.pointA], offset);
                            var dist1 = lighttool.NavMesh.navVec3.DistAZ(posNow, pointA);
                            var dist2 = lighttool.NavMesh.navVec3.DistAZ(posNow, pointB);
                            if (dist1 < 0.001 || dist2 < 0.001) {
                                continue;
                            }
                            if (dirLeft == null) {
                                dirLeft = lighttool.NavMesh.navVec3.NormalAZ(posNow, pointA);
                                posLeft = pointA.clone();
                                ipolyLeft = i;
                            }
                            if (dirRight == null) {
                                dirRight = lighttool.NavMesh.navVec3.NormalAZ(posNow, pointB);
                                posRight = pointB.clone();
                                ipolyRight = i;
                            }
                            var adir = lighttool.NavMesh.navVec3.Angle(dirLeft, dirRight);
                            if (adir < 0.0) {
                                var navVec7 = dirLeft;
                                var navVec8 = posLeft;
                                var num12 = ipolyLeft;
                                dirLeft = dirRight;
                                posLeft = posRight;
                                ipolyLeft = ipolyRight;
                                dirRight = navVec7;
                                posRight = navVec8;
                                ipolyRight = num12;
                            }
                            if (ipolyLeft != i || ipolyRight != i) {
                                var ndirLeft = lighttool.NavMesh.navVec3.NormalAZ(posNow, pointA);
                                var ndirRight = lighttool.NavMesh.navVec3.NormalAZ(posNow, pointB);
                                var nadir = lighttool.NavMesh.navVec3.Angle(ndirLeft, ndirRight);
                                if (nadir < 0.0) {
                                    var navVec11 = ndirLeft;
                                    var navVec12 = pointA;
                                    ndirLeft = ndirRight;
                                    pointA = pointB;
                                    ndirRight = navVec11;
                                    pointB = navVec12;
                                }
                                var aLL = lighttool.NavMesh.navVec3.Angle(dirLeft, ndirLeft); //>0 右侧，<0 左侧
                                var aRL = lighttool.NavMesh.navVec3.Angle(dirRight, ndirLeft);
                                var aLR = lighttool.NavMesh.navVec3.Angle(dirLeft, ndirRight);
                                var aRR = lighttool.NavMesh.navVec3.Angle(dirRight, ndirRight);
                                if ((aLL < 0 && aLR < 0)) {
                                    breakDir = -1;
                                    break;
                                }
                                if (aRL > 0.0 && aRR > 0.0) {
                                    breakDir = 1;
                                    break;
                                }
                                if (aLL > 0.0 && aRL < 0.0) {
                                    dirLeft = ndirLeft;
                                    posLeft = pointA;
                                    ipolyLeft = i;
                                }
                                if (aLR > 0.0 && aRR < 0.0) {
                                    dirRight = ndirRight;
                                    posRight = pointB;
                                    ipolyRight = i;
                                }
                            }
                        }
                    }
                    if (breakDir == 0) {
                        break;
                    }
                    else {
                        if (breakDir == -1) {
                            wayPoints.push(posLeft.clone());
                            posNow = posLeft;
                            ipoly = ipolyLeft;
                        }
                        else {
                            wayPoints.push(posRight.clone());
                            posNow = posRight;
                            ipoly = ipolyRight;
                        }
                        dirLeft = null;
                        dirRight = null;
                        ipolyLeft = -1;
                        ipolyRight = -1;
                    }
                }
                wayPoints.push(endPos);
                return wayPoints;
            };
            return pathFinding;
        }());
        NavMesh.pathFinding = pathFinding;
    })(NavMesh = lighttool.NavMesh || (lighttool.NavMesh = {}));
})(lighttool || (lighttool = {}));
//# sourceMappingURL=pathfinding.js.map