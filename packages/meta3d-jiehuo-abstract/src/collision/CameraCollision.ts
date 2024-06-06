import { Ray, Vector3 } from "three"
import { state } from "../type/StateType"
import { queryNeareastByRay } from "../Octree2Utils"
import { getCameraCollisionableOctrees } from "./Collision"
import { getExn, isStrictNullable } from "../utils/NullableUtils"

export let handleCameraCollision = (state: state, defaultDistance: number, targetWorldPosition: Vector3, cameraCurrentWorldPosition: Vector3, velocity: Vector3) => {
    let targetToCameraDirection = cameraCurrentWorldPosition.clone().sub(targetWorldPosition).normalize()

    let ray = new Ray(targetWorldPosition, targetToCameraDirection)


    let result = queryNeareastByRay(getCameraCollisionableOctrees(state), ray)

    let cameraToTargetDistance = cameraCurrentWorldPosition.clone().distanceTo(targetWorldPosition)

    let currentDistance = cameraToTargetDistance

    if (currentDistance < defaultDistance
        && (
            // intersects.length == 0
            // || intersects[0].distance > currentDistance
            isStrictNullable(result[1])
            || result[0] > currentDistance
        )
    ) {
        let speed
        if (
            // intersects.length == 0 || intersects[0].distance > defaultDistance
            isStrictNullable(result[1])
            || result[0] > defaultDistance
        ) {
            speed = defaultDistance / currentDistance
        }
        else {
            speed = result[0] / currentDistance

            if (result[0] + speed > currentDistance) {
                speed = 0
            }
        }


        return targetToCameraDirection.clone().multiplyScalar(speed)
    }

    if (
        // intersects.length == 0 || intersects[0].distance >= cameraToTargetDistance
        isStrictNullable(result[1])
        || result[0] >= cameraToTargetDistance

    ) {
        return velocity
    }

    let cameraToTargetDirection = targetWorldPosition.clone().sub(cameraCurrentWorldPosition).normalize()
    let speed = cameraToTargetDistance / result[0]

    return velocity.add(cameraToTargetDirection.multiplyScalar(speed))
}