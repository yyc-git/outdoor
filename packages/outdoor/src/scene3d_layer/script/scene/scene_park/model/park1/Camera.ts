import { NullableUtils } from "meta3d-jiehuo-abstract";
import { state } from "../../../../../type/StateType";
import { getState, setState } from "../../ParkScene";
import { Vector3 } from "three";

export let setControlsConfig = (state: state) => {
    return setState(state, {
        ...getState(state),
        orbitControlsConfig: NullableUtils.return_({
            // position: new Vector3(0, 50, 40),
            // target: new Vector3(0, 0, 0)
            position: new Vector3(30, 30, 150),
            target: new Vector3(30, 0, -100)
        }),
        thirdPersonControlsConfig: NullableUtils.return_({
            position: new Vector3(0, 25, 40),
        })
    })
}