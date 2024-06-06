import { ModelLoader } from "meta3d-jiehuo-abstract"
import { getAbstractState } from "../../../../../state/State"
import { state } from "../../../../../type/StateType"
import { Octree2 } from "meta3d-jiehuo-abstract"
import { Loader } from "meta3d-jiehuo-abstract"
import { getState, setState } from "../../ParkScene"
import { Render } from "meta3d-jiehuo-abstract"
import { Box3, DoubleSide, Object3D, TextureLoader, Vector3 } from "three"
import { InstanceSourceLOD } from "meta3d-jiehuo-abstract"
import { getIsDebug } from "../../../Scene"
import { NullableUtils } from "meta3d-jiehuo-abstract"
import { flower } from "../../type/StateType"
import { Scene } from "meta3d-jiehuo-abstract"
import { NewThreeInstance } from "meta3d-jiehuo-abstract"
import { Flower2 } from "meta3d-jiehuo-abstract"
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

export let buildName = () => "flower2"

export let findAllFlower2s = (state, scene) => {
    return Scene.findObjects(scene, ({ name }) => name == buildName())
}

export let parseAndAddResources = (state: state) => {
    let high = Flower2.create()

    high.castShadow = false
    high.receiveShadow = false

    let details = [
        {
            group: high,
            level: "l0",
            distance: 400,
        },
    ]

    let octree = new Octree2.Octree(Terrain.getBoundingBox(NullableUtils.getExn(getState(state).terrain.terrainMesh)), 5, 0)


    return Promise.resolve(_setState(state, {
        ..._getState(state),
        flower2: NullableUtils.return_(
            [
                octree,
                details,
                buildName()
            ]
        )
    }))
}