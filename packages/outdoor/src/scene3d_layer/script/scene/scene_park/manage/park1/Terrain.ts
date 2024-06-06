import { ModelLoader } from "meta3d-jiehuo-abstract"
import { getAbstractState } from "../../../../../state/State"
import { state } from "../../../../../type/StateType"
import { Loader } from "meta3d-jiehuo-abstract"
import { getBaseMapResourceId, getColorMapResourceId, getHeightMapResourceId, getState, setState } from "../../ParkScene"
import { Render } from "meta3d-jiehuo-abstract"
import { Box3, DoubleSide, Object3D, TextureLoader, Vector3 } from "three"
import { InstanceSourceLOD } from "meta3d-jiehuo-abstract"
import { getIsDebug } from "../../../Scene"
import { NullableUtils } from "meta3d-jiehuo-abstract"
import { terrain } from "../../type/StateType"
import { Scene } from "meta3d-jiehuo-abstract"
import { NewThreeInstance } from "meta3d-jiehuo-abstract"
import { Terrain } from "meta3d-jiehuo-abstract"
import { CSM } from "meta3d-jiehuo-abstract"
import { Shadow } from "meta3d-jiehuo-abstract"
import { return_ } from "meta3d-jiehuo-abstract/src/utils/NullableUtils"

let _getState = (state: state) => {
	return NullableUtils.getExn(getState(state).terrain)
}

let _setState = (state: state, flowerState: terrain) => {
	return setState(state, {
		...getState(state),
		terrain: NullableUtils.return_(flowerState)
	})
}

// export let buildName = () => "terrain"

export let parseAndAddResources = (state: state) => {
	let abstractState = getAbstractState(state)

	let terrainMesh = Terrain.create({
		heightMap: Loader.getResource(abstractState, getHeightMapResourceId()),
		colorMap: Loader.getResource(abstractState, getColorMapResourceId()),
		baseMap: Loader.getResource(abstractState, getBaseMapResourceId()),
	})

	terrainMesh = Shadow.setShadow(terrainMesh, false, true)

	return Promise.resolve(_setState(state, {
		..._getState(state),
		terrainMesh: return_(terrainMesh)
	}))

}

export let createState = (): terrain => {
	return {
		// terrain: null,
		// terrainVertices: null,
		terrainMesh: null
	}
}