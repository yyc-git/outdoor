import { Object3D, Vector3 } from "three";

export let getWorldPosition = (obj: Object3D, target: Vector3) => {
    return target.setFromMatrixPosition(obj.matrixWorld);
}