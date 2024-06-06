import { ModelLoader } from "meta3d-jiehuo-abstract"
import { getAbstractState } from "../../../../../state/State"
import { state } from "../../../../../type/StateType"
import { Octree2 } from "meta3d-jiehuo-abstract"
import { Loader } from "meta3d-jiehuo-abstract"
import { getState, setState } from "../../ParkScene"
import { Render } from "meta3d-jiehuo-abstract"
import { Box3, DoubleSide, Mesh, Object3D, TextureLoader, Vector3 } from "three"
import { InstanceSourceLOD } from "meta3d-jiehuo-abstract"
import { getIsDebug } from "../../../Scene"
import { NullableUtils } from "meta3d-jiehuo-abstract"
import { grass } from "../../type/StateType"
import { Scene } from "meta3d-jiehuo-abstract"
import { NewThreeInstance } from "meta3d-jiehuo-abstract"
import { push } from "meta3d-jiehuo-abstract/src/utils/ArrayUtils"
import { GrassInstance } from "meta3d-jiehuo-abstract"
import { Terrain } from "meta3d-jiehuo-abstract"

let _getState = (state: state) => {
    return NullableUtils.getExn(getState(state).grass)
}

let _setState = (state: state, grassState: grass) => {
    return setState(state, {
        ...getState(state),
        grass: NullableUtils.return_(grassState)
    })
}

export let buildName = () => "grass2"

export let findAllGrass2s = (state, scene) => {
    return Scene.findObjects(scene, ({ name }) => name == buildName())
}

// export let getLeavesMaterial = (state) => (NullableUtils.getExn(_getState(state).grass2)[1][0].group.children[0] as Mesh).material
export let getLeavesMaterial = (state) => (NullableUtils.getExn(_getState(state).grass2).material)

export let parseAndAddResources = (state: state) => {
    // let high = NewThreeInstance.createGroup()
    // high.add(GrassInstance.create())

    // high.castShadow = false
    // high.receiveShadow = false

    // // high.matrixAutoUpdate = false


    // let details = [
    //     {
    //         group: high,
    //         level: "l0",
    //         distance: 800,
    //     },
    // ]

    // let octree = new Octree2.Octree(Terrain.getBoundingBox(NullableUtils.getExn(getState(state).terrain.terrainMesh)), 5, 0)



    return Promise.resolve(_setState(state, {
        ..._getState(state),
        grass2: NullableUtils.return_(
            // [
            //     octree,
            //     details,
            //     buildName()
            // ]
            GrassInstance.create()
        )
    }))
}