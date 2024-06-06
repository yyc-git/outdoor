import { Object3D } from "three";

export let setShadow = <T extends Object3D>(object: T, castShadow, receiveShadow): T => {
    object.traverse(child => {
        child.castShadow = castShadow
        child.receiveShadow = receiveShadow
    })

    return object
}