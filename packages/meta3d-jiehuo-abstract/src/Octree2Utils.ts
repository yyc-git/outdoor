import { Ray } from "three"
import { Octree } from "./Octree2"

export let queryNeareastByRay = (octrees: Array<Octree>, ray: Ray) => {
    return octrees.reduce(([distance, transform, box, name], octree) => {
        let data = octree.queryByRay(ray, distance, transform, box, name)

        if (data[0] < distance) {
            return data
        }

        return [distance, transform, box, name]
    }, [Infinity, null, null, null])
}