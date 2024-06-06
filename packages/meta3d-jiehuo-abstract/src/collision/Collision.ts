import { getCollisionState, setCollisionState } from "../state/State"
import { collision, state } from "../type/StateType"

export let getPlayerCollisionableOctrees = (state:state) => {
	return getCollisionState(state).playerCollisionOctrees
}

export let setPlayerCollisionableOctrees = (state:state, collisionOctrees) => {
	return setCollisionState(state, {
		...getCollisionState(state),
		playerCollisionOctrees: collisionOctrees
	})
}

export let getCameraCollisionableOctrees = (state:state) => {
	return getCollisionState(state).cameraCollisionOctrees
}

export let setCameraCollisionableOctrees = (state:state, collisionOctrees) => {
	return setCollisionState(state, {
		...getCollisionState(state),
		cameraCollisionOctrees: collisionOctrees
	})
}

export let queryCapsuleCollision = (state:state, capsule) => {
	return getPlayerCollisionableOctrees(state).reduce((data, octree) => {
		if (data[0] !== null) {
			return data
		}

		return octree.queryByCapsule(capsule)
	}, [null, null, null, null])
}

export let createState = (): collision => {
	return {
		playerCollisionOctrees: [],
		cameraCollisionOctrees: [],
	}
}