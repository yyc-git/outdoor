import { ModelLoader } from "meta3d-jiehuo-abstract"
import { getAbstractState, setAbstractState } from "../../../../../state/State"
import { state } from "../../../../../type/StateType"
import { getBaseMapResourceId, getColorMapResourceId, getHeightMapResourceId, getState, setState } from "../../ParkScene"
import { NullableUtils } from "meta3d-jiehuo-abstract"
import { map } from "../../type/StateType"
import { Scene } from "meta3d-jiehuo-abstract"
import { NewThreeInstance } from "meta3d-jiehuo-abstract"
import { Terrain } from "meta3d-jiehuo-abstract"
import { return_ } from "meta3d-jiehuo-abstract/src/utils/NullableUtils"
import { Octree2 } from "meta3d-jiehuo-abstract"
import { getCameraCollisionableOctrees, getPlayerCollisionableOctrees, setCameraCollisionableOctrees, setPlayerCollisionableOctrees } from "meta3d-jiehuo-abstract/src/collision/Collision"
// import { getPlayerCollisionableOctrees, setPlayerCollisionableOctrees } from "../../Collision"

let _getState = (state: state) => {
    return NullableUtils.getExn(getState(state).map)
}

let _setState = (state: state, flowerState: map) => {
    return setState(state, {
        ...getState(state),
        map: NullableUtils.return_(flowerState)
    })
}

export let buildName = () => "map_wall"

export let parseAndAddResources = (state: state) => {
    let octree = new Octree2.Octree(Terrain.getBoundingBox(NullableUtils.getExn(getState(state).terrain.terrainMesh)), 5, 0)


    let geometry = NewThreeInstance.createBoxGeometry(1, 1, 1)
    let material = NewThreeInstance.createMeshBasicMaterial({})

    let group = NewThreeInstance.createGroup()
    group.add(NewThreeInstance.createMesh(geometry, material))

    octree.details = [
        {
            group: group,
            level: "l0",
            distance: +Infinity,
        },
    ]

    return Promise.resolve(_setState(state, {
        ..._getState(state),
        wall: return_(octree)
    }))

}

export let initWhenImportScene = (state: state) => {
    let abstractState = getAbstractState(state)

    abstractState = setPlayerCollisionableOctrees(abstractState, getPlayerCollisionableOctrees(abstractState).concat([NullableUtils.getExn(_getState(state).wall)]))
    abstractState = setCameraCollisionableOctrees(abstractState, getCameraCollisionableOctrees(abstractState).concat([NullableUtils.getExn(_getState(state).wall)]))

    state = setAbstractState(state, abstractState)

    return Promise.resolve(state)
}