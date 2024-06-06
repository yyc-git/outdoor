import { ModelLoader } from "meta3d-jiehuo-abstract"
import { getAbstractState } from "../../../../../state/State"
import { state } from "../../../../../type/StateType"
import { Octree2 } from "meta3d-jiehuo-abstract"
import { Loader } from "meta3d-jiehuo-abstract"
// import { getEcheveriaResourceId, getPurpleFlowerPatchResourceId, getState, setState } from "../../ParkScene"
import {  getState, setState } from "../../ParkScene"
import { Render } from "meta3d-jiehuo-abstract"
import { Box3, DoubleSide, Mesh, Object3D, TextureLoader, Vector3 } from "three"
import { InstanceSourceLOD } from "meta3d-jiehuo-abstract"
import { getIsDebug } from "../../../Scene"
import { NullableUtils } from "meta3d-jiehuo-abstract"
import { Scene } from "meta3d-jiehuo-abstract"
import { NewThreeInstance } from "meta3d-jiehuo-abstract"
import { push } from "meta3d-jiehuo-abstract/src/utils/ArrayUtils"
import { Terrain } from "meta3d-jiehuo-abstract"
import { plant } from "../../type/StateType"

let _getState = (state: state) => {
	return NullableUtils.getExn(getState(state).plant)
}

let _setState = (state: state, plantState: plant) => {
	return setState(state, {
		...getState(state),
		plant: NullableUtils.return_(plantState)
	})
}

export let buildName = () => "plant2"

export let findAllplant2s = (state, scene) => {
	return Scene.findObjects(scene, ({ name }) => name == buildName())
}

let _findMeshParent = (obj: any, parent) => {
	if (obj.isMesh) {
		return parent
	}

	if (obj.isObject3D) {
		return _findMeshParent(obj.children[0], obj)
	}
}

let _handleAllGeometriesTransform = (obj: Object3D, handleFunc) => {
	obj.children.forEach((child: Mesh) => {
		handleFunc(child)
	})

	return obj
}

export let parseAndAddResources = (state: state) => {
	// let abstractState = getAbstractState(state)


	// return ModelLoader.parseGlb(abstractState, Loader.getResource(abstractState, getEcheveriaResourceId()), Render.getRenderer(abstractState)).then((echeveria: Object3D) => {
	// 	let high = _findMeshParent(echeveria, null)

	// 	_handleAllGeometriesTransform(high, (mesh) => {
	// 		mesh.geometry.rotateX(- Math.PI / 2)
	// 		mesh.geometry.scale(0.05, 0.05, 0.05)
	// 	})


	// 	high.castShadow = false

	// 	let details = [
	// 		{
	// 			group: high,
	// 			level: "l0",
	// 			distance: 800,
	// 		},
	// 	]

	// 	let octree = new Octree2.Octree(Terrain.getBoundingBox(NullableUtils.getExn(getState(state).terrain.terrainMesh)), 5, 0)


	// 	state = _setState(state, {
	// 		..._getState(state),
	// 		echeveria: NullableUtils.return_(
	// 			[
	// 				octree,
	// 				details,
	// 				buildName()
	// 			]
	// 		)
	// 	})


	// 	return ModelLoader.parseGlb(abstractState, Loader.getResource(abstractState, getPurpleFlowerPatchResourceId()), Render.getRenderer(abstractState)).then((purple_flower_patch: Object3D) => {
	// 		let high = _findMeshParent(purple_flower_patch, null)

	// 		_handleAllGeometriesTransform(high, (mesh) => {
	// 			// mesh.geometry.rotateX(- Math.PI / 2)
	// 			mesh.geometry.scale(0.5, 0.5, 0.5)
	// 			// mesh.geometry.translate(0, -2, 0)
	// 		})



	// 		high.castShadow = false

	// 		let details = [
	// 			{
	// 				group: high,
	// 				level: "l0",
	// 				distance: 800,
	// 			},
	// 		]

	// 		let octree = new Octree2.Octree(Terrain.getBoundingBox(NullableUtils.getExn(getState(state).terrain.terrainMesh)), 5, 0)


	// 		state = _setState(state, {
	// 			..._getState(state),
	// 			purple_flower_patch: NullableUtils.return_(
	// 				[
	// 					octree,
	// 					details,
	// 					buildName()
	// 				]
	// 			)
	// 		})


	// 		return state
	// 	})
	// })

	return Promise.resolve(state)
}

export let createState = (): plant => {
	return {
		echeveria: null,
		purple_flower_patch: null
	}
}