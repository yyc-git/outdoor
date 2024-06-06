import { Instance } from "meta3d-jiehuo-abstract"
import { getAbstractState, setAbstractState } from "../../../../../state/State"
import { cameraType, state } from "../../../../../type/StateType"
import * as Girl from "../../Girl"
import * as Terrain from "./Terrain"
import * as MapWall from "./MapWall"
import * as Plant from "./Plant"
import * as Trees2 from "./Trees2"
import * as Grass1 from "./Grass1"
import * as Grass2 from "./Grass2"
import * as Flower1 from "./Flower1"
import * as Flower2 from "./Flower2"
import * as Animated from "./Animated"
import { getScene, getState } from "../../ParkScene"
import { Scene } from "meta3d-jiehuo-abstract"
import { DisposeUtils } from "meta3d-jiehuo-abstract"
import { Object3DUtils } from "meta3d-jiehuo-abstract"
import { GrassInstance } from "meta3d-jiehuo-abstract"
import { Tree } from "antd"

let _parseAndAddResources = (state: state) => {
    return Girl.parseAndAddResources(state).then(Terrain.parseAndAddResources).then(MapWall.parseAndAddResources).then(Plant.parseAndAddResources).then(Trees2.parseAndAddResources).then(Grass1.parseAndAddResources).then(Grass2.parseAndAddResources).then(Flower1.parseAndAddResources).then(Flower2.parseAndAddResources).then(Animated.parseAndAddResources)
}

export let initWhenImportScene = (state: state) => {
    return Girl.initWhenImportScene(state).then(Trees2.initWhenImportScene).then(MapWall.initWhenImportScene)
}

export let init = (state: state) => {
    return _parseAndAddResources(state)
}

export let update = (state: state) => {

    // Animated.findAllAnimateds(getScene(state)).forEach((obj, i) => {
    //     if (i % 5 !== 0) {
    //         return
    //     }

    //     if (obj.position.x > 500) {
    //         // obj.position.copy(initialPosition)
    //         obj.position.setX((Math.random() * 2 - 1) * 300)
    //     }
    //     else {
    //         obj.position.setX(obj.position.x + 2)
    //     }

    //     Object3DUtils.markNeedsUpdate(obj)
    //     // let _ = Object3DUtils.markNeedsUpdate(clonedOne)
    // })


    state = GrassInstance.update(state, getAbstractState, Grass2.getLeavesMaterial(state))


    if (getState(state).cameraType == cameraType.ThirdPerson) {
        state = Girl.update(state)
    }

    state = setAbstractState(state, Instance.updateAllInstances(getAbstractState(state)))

    return Promise.resolve(state)
}

export let dispose = (state: state) => {
    let scene = getScene(state)

    return Girl.dispose(state).then(Trees2.dispose).then(state => {
        Scene.getScene(getAbstractState(state)).remove(scene)

        DisposeUtils.deepDispose(scene)

        return state
    })
}