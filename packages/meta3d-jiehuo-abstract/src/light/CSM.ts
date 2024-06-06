import { CSM, CSMParameters } from "three/examples/jsm/csm/CSM";
import { state } from "../type/StateType";
import { getLightState, setLightState } from "../state/State";
import { getExn, return_ } from "../utils/NullableUtils";
import { Material } from "three";

export let create = (state: state, data: CSMParameters) => {
    return setLightState(state, {
        ...getLightState(state),
        csm: return_(new CSM(data))
    })
}

export let setupMaterial = (state: state, terrainMaterial: Material) => {
    getExn(getLightState(state).csm).setupMaterial(terrainMaterial)
}

export let update = (state: state) => {
    getExn(getLightState(state).csm).update()

    return Promise.resolve(state)
}