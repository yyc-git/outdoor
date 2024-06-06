import { warehouseScene } from "../script/scene/scene_warehouse/type/StateType"
import { parkScene } from "../script/scene/scene_park/type/StateType"
import { state as abstractState } from "meta3d-jiehuo-abstract/src/type/StateType"
import { Camera } from "three"

export type config = {
    // isDebug: boolean,
    // isProduction: boolean
}

export enum cameraType {
    Orbit,
    ThirdPerson
}

export type state = {
    abstract: abstractState,
    config: config,
    camera: Camera,
    parkScene: parkScene,
    warehouseScene: warehouseScene

}