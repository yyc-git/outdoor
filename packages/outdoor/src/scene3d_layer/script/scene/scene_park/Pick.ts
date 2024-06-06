import { Box3, Box3Helper } from "three";
import { state } from "../../../type/StateType";
import { pick } from "./type/StateType";
import { getAbstractState } from "../../../state/State";
// import { getState, setState } from "../ParkScene"
import { NullableUtils } from "meta3d-jiehuo-abstract";
import { getCurrentScene } from "meta3d-jiehuo-abstract/src/scene/Scene";
import { getState, setState } from "./ParkScene";
import { nullable } from "meta3d-jiehuo-abstract/src/utils/nullable";

let _getState = (state: state) => {
	return getState(state).pick
}

let _setState = (state: state, pickState: pick) => {
	return setState(state, {
		...getState(state),
		pick: NullableUtils.return_(pickState)
	})
}

export let setBoxCube = (state: state, box3: nullable<Box3>) => {
	let scene = getCurrentScene(getAbstractState(state))

	if (!NullableUtils.isNullable(_getState(state).boxCube)) {
		scene.remove(NullableUtils.getExn(_getState(state).boxCube))
	}

	if (NullableUtils.isNullable(box3)) {
		return _setState(state, {
			..._getState(state),
			boxCube: NullableUtils.getEmpty()
		})
	}

	box3 = NullableUtils.getExn(box3)

	let newBoxCube = new Box3Helper(box3, 0xffff00)

	scene.add(newBoxCube)

	return _setState(state, {
		..._getState(state),
		boxCube: NullableUtils.return_(newBoxCube)
	})
}

export let createState = (): pick => {
	return { boxCube: null }
}