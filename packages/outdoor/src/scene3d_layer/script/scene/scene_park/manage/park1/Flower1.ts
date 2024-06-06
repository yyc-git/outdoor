import { ModelLoader } from "meta3d-jiehuo-abstract"
import { getAbstractState } from "../../../../../state/State"
import { state } from "../../../../../type/StateType"
import { Octree2 } from "meta3d-jiehuo-abstract"
import { Loader } from "meta3d-jiehuo-abstract"
import { getState, setState } from "../../ParkScene"
import { Render } from "meta3d-jiehuo-abstract"
import { Box3, Color, DoubleSide, Object3D, TextureLoader, Vector3 } from "three"
import { InstanceSourceLOD } from "meta3d-jiehuo-abstract"
import { getIsDebug } from "../../../Scene"
import { NullableUtils } from "meta3d-jiehuo-abstract"
import { flower } from "../../type/StateType"
import { Scene } from "meta3d-jiehuo-abstract"
import { NewThreeInstance } from "meta3d-jiehuo-abstract"
import { Flower1 } from "meta3d-jiehuo-abstract"
import { Terrain } from "meta3d-jiehuo-abstract"

let _getState = (state: state) => {
    return NullableUtils.getExn(getState(state).flower)
}

let _setState = (state: state, flowerState: flower) => {
    return setState(state, {
        ...getState(state),
        flower: NullableUtils.return_(flowerState)
    })
}

export let buildName = () => "flower1"

export let findAllFlower1s = (state, scene) => {
    return Scene.findObjects(scene, ({ name }) => name == buildName())
}

let _createFlower = (config) => {
    let flower = Flower1.create(config)
    flower.castShadow = false
    flower.receiveShadow = false

    return flower
}

export let parseAndAddResources = (state: state) => {
    return Promise.resolve(_setState(state, {
        ..._getState(state),
        flower1_1: NullableUtils.return_(
            [
                new Octree2.Octree(Terrain.getBoundingBox(NullableUtils.getExn(getState(state).terrain.terrainMesh)), 5, 0),
                [
                    {
                        group: _createFlower({
                            start: new Vector3(0, 0, 0),
                            end: new Vector3(0, 2, 0.1),
                            p1: new Vector3(-0.6, 2, 0.3),
                            p2: new Vector3(0.6, 2, 0.3),
                            p3: new Vector3(0, 2, -0.1),
                            color1: new Color(0xf5c800),
                            color2: new Color(0xe7b603),
                            color3: new Color(0x128c2d),
                            color4: new Color(0xa7a015),
                            petalNum: 13
                        }),
                        level: "l0",
                        distance: 400,
                    },
                ],
                buildName()
            ]
        ),
        flower1_2: NullableUtils.return_(
            [
                new Octree2.Octree(Terrain.getBoundingBox(NullableUtils.getExn(getState(state).terrain.terrainMesh)), 5, 0),
                [
                    {
                        group: _createFlower({
                            start: new Vector3(0, 0, 0),
                            end: new Vector3(0, 2, 0.4),
                            p1: new Vector3(-0.2, 2.2, 0.1),
                            p2: new Vector3(0.2, 2.2, 0.1),
                            p3: new Vector3(0, 1.5, -0.1),
                            color1: new Color(0x7c75e2),
                            color2: new Color(0xa4b1ff),
                            color3: new Color(0xfdf100),
                            color4: new Color(0xf0be01),
                            petalNum: 21
                        }),
                        level: "l0",
                        distance: 400,
                    },
                ],
                buildName()
            ]
        ),
        flower1_3: NullableUtils.return_(
            [
                new Octree2.Octree(Terrain.getBoundingBox(NullableUtils.getExn(getState(state).terrain.terrainMesh)), 5, 0),
                [
                    {
                        group: _createFlower({
                            start: new Vector3(0, 0, 0),
                            end: new Vector3(0, 2, 0.8),
                            p1: new Vector3(-1.6, 2.2, 0.6),
                            p2: new Vector3(1.6, 2.2, 0.6),
                            p3: new Vector3(0, 2, 0.2),
                            color1: new Color(0x81367c),
                            color2: new Color(0xc38aca),
                            color3: new Color(0x9e1154),
                            color4: new Color(0xf0be01),
                            petalNum: 5
                        }),
                        level: "l0",
                        distance: 400,
                    },
                ],
                buildName()
            ]
        ),
        flower1_4: NullableUtils.return_(
            [
                new Octree2.Octree(Terrain.getBoundingBox(NullableUtils.getExn(getState(state).terrain.terrainMesh)), 5, 0),
                [
                    {
                        group: _createFlower({
                            start: new Vector3(0, 0, 0),
                            end: new Vector3(0, 2, 0.8),
                            p1: new Vector3(-1.2, 1.6, 0.2),
                            p2: new Vector3(1.2, 1.6, 0.2),
                            p3: new Vector3(0, 2, -0.2),
                            color1: new Color(0xb3b3a8),
                            color2: new Color(0xe7e7f2),
                            color3: new Color(0xdabe18),
                            color4: new Color(0x9e9001),
                            petalNum: 5
                        }),
                        level: "l0",
                        distance: 400,
                    },
                ],
                buildName()
            ]
        ),
        flower1_5: NullableUtils.return_(
            [
                new Octree2.Octree(Terrain.getBoundingBox(NullableUtils.getExn(getState(state).terrain.terrainMesh)), 5, 0),
                [
                    {
                        group: _createFlower({
                            start: new Vector3(0, 0, 0),
                            end: new Vector3(0, 2, 0.2),
                            p1: new Vector3(-1.3, 2.2, 0.3),
                            p2: new Vector3(1.3, 2.2, 0.3),
                            p3: new Vector3(0, 1.5, -0.2),
                            color1: new Color(0x81367c),
                            color2: new Color(0xc38aca),
                            color3: new Color(0x9e1154),
                            color4: new Color(0xf0be01),
                            petalNum: 8
                        }),
                        level: "l0",
                        distance: 400,
                    },
                ],
                buildName()
            ]
        ),
        flower1_6: NullableUtils.return_(
            [
                new Octree2.Octree(Terrain.getBoundingBox(NullableUtils.getExn(getState(state).terrain.terrainMesh)), 5, 0),
                [
                    {
                        group: _createFlower({
                            start: new Vector3(0, 0, 0),
                            end: new Vector3(0, 2, 0.8),
                            p1: new Vector3(-1.2, 0.2, 0.2),
                            p2: new Vector3(1.2, 0.2, 0.2),
                            p3: new Vector3(0, 2, 0.2),
                            color1: new Color(0xb3b3a8),
                            color2: new Color(0xe7e7f2),
                            color3: new Color(0xdabe18),
                            color4: new Color(0x9e9001),
                            petalNum: 8
                        }),
                        level: "l0",
                        distance: 400,
                    },
                ],
                buildName()
            ]
        ),
    }))
}