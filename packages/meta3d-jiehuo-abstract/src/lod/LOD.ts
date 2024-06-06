import { Map, List } from "immutable"
import { lod, state } from "../type/StateType"
import { setLODState } from "../state/State"

export let createState = (): lod => {
    return {
        instancedMesh2LevelsMap: Map(),
        lod2s: List()
    }
}

export let dispose = (state: state) => {
    return setLODState(state, createState())
}