import type { WebGLRenderer, Object3D, Camera, Vector2, Raycaster, InstancedMesh, Scene, Group, Vector3, Mesh, PerspectiveCamera, OrthographicCamera, Texture, Box3, Box3Helper } from "three"
import { nullable } from "meta3d-jiehuo-abstract/src/utils/nullable"
import type { Map } from "immutable"
import type { Capsule } from "three/examples/jsm/math/Capsule"
// import type { Octree } from "meta3d-jiehuo-abstract/src/three/Octree"
import type { OctreeHelper } from "three/examples/jsm/helpers/OctreeHelper.js";
import { cameraType } from "../../../../type/StateType"
// import { Terrain } from "meta3d-jiehuo-abstract/src/terrain/Terrain"
import { Octree2 } from "meta3d-jiehuo-abstract"
import { details } from "meta3d-jiehuo-abstract/src/type/StateType"
import { Octree } from "meta3d-jiehuo-abstract/src/Octree2";

export type girl = {
    currentAnimationName: string
    capsule: Capsule,
    capsuleMesh: nullable<Mesh>,
    // lastVelocity: Vector3,
    girl: nullable<Object3D>,
    idle: nullable<Object3D>,
    running: nullable<Object3D>,
    position: Vector3
    // isOnFloor: boolean
}

type lodData = [
    // typeof Octree2.Octree,
    // any,
    Octree,
    details,
    string
]

export type tree = {
    trees: Array<lodData>
}

export type terrain = {
    // terrain: nullable<Terrain>,
    // terrainVertices: nullable<{
    //     length: number,
    //     width: number,
    //     array: Array<number>
    // }>,
    terrainMesh: nullable<Mesh>
}

export type map = {
    wall: nullable<Octree>
}



export type grass = {
    // grasses: Array<Object3D>
    grass1: nullable<lodData>,
    // grass2: nullable<lodData>
    grass2: nullable<Mesh>
}

export type flower = {
    flower1_1: nullable<lodData>,
    flower1_2: nullable<lodData>,
    flower1_3: nullable<lodData>,
    flower1_4: nullable<lodData>,
    flower1_5: nullable<lodData>,
    flower1_6: nullable<lodData>,
    flower2: nullable<lodData>
}

export type plant = {
    echeveria: nullable<lodData>,
    purple_flower_patch: nullable<lodData>,
}

export type animated = {
    box: nullable<Object3D>
}


export type orbitControlsConfig = {
    position: Vector3,
    target: Vector3,
    // minDistance:number,
    // maxDistance: number,
}

export type thirdPersonControlsConfig = {
    position: Vector3,
}

export type pick = {
    boxCube: nullable<Box3Helper>
}

export type parkScene = {
    isFirstEnter: boolean,
    scene: nullable<Object3D>,
    sceneNumber: number,
    staticGroup: nullable<Group>,
    dynamicGroup: nullable<Group>,
    cameraType: cameraType,
    orbitControlsConfig: nullable<orbitControlsConfig>,
    thirdPersonControlsConfig: nullable<thirdPersonControlsConfig>,
    // octree: Octree,
    // octreeHelper: nullable<OctreeHelper>,

    girl: girl,
    grass: grass,
    flower: flower,
    plant: plant,
    tree: tree,
    terrain: terrain,
    animated: animated,
    pick: pick,

    map: map,
}
