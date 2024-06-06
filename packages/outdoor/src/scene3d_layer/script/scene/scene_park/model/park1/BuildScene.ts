import { NewThreeInstance } from "meta3d-jiehuo-abstract"
import { state } from "../../../../../type/StateType"
import { setState, getState, getDynamicGroupName, getName, getStaticGroupName } from "../../ParkScene"
import { NullableUtils } from "meta3d-jiehuo-abstract"
import { getGirlState } from "../../Girl"
import { Matrix4, PCFSoftShadowMap, Vector3, Quaternion, Material, Box3, Box3Helper } from "three"
import { setControlsConfig } from "./Camera"
import { Scene } from "meta3d-jiehuo-abstract"
import { getAbstractState, setAbstractState } from "../../../../../state/State"
import { SceneUtils } from "meta3d-jiehuo-abstract"
import { addDirectionLight } from "../../Light"
import { ArrayUtils } from "meta3d-jiehuo-abstract"
// import * as Tree1 from "../../manage/park1/Tree1"
import * as MapWall from "../../manage/park1/MapWall"
import * as Trees from "../../manage/park1/Trees"
import * as Grass1 from "../../manage/park1/Grass1"
import * as Flower1 from "../../manage/park1/Flower1"
import * as Animated from "../../manage/park1/Animated"
import { Instance } from "meta3d-jiehuo-abstract"
import { Object3DUtils } from "meta3d-jiehuo-abstract"
import { Device } from "meta3d-jiehuo-abstract"
import { SkyBox } from "meta3d-jiehuo-abstract"
// import { Terrain } from "meta3d-jiehuo-abstract/src/terrain/Terrain"
import { CSM } from "meta3d-jiehuo-abstract"
import { getCurrentCamera } from "meta3d-jiehuo-abstract/src/scene/Camera"
import { InstancedLOD2 } from "meta3d-jiehuo-abstract"
import { add } from "meta3d-jiehuo-abstract/src/lod/InstancedLOD2"
import { Shadow } from "meta3d-jiehuo-abstract"
import { getIsDebug } from "../../../Scene"
import { Terrain } from "meta3d-jiehuo-abstract"
import { isInGroups } from "meta3d-jiehuo-abstract/src/terrain/Terrain"

let _addGroups = (scene, [staticGroup, dynamicGroup]) => {
    scene.add(staticGroup, dynamicGroup)

    return scene
}

let _insertRange = (state, scene, [octree, details, name], [xSize, zSize], count) => {
    let staticGroup = NullableUtils.getExn(Scene.findObjectByName(scene, getStaticGroupName()))

    // let [octree, details, name] = NullableUtils.getExn(getState(state).plant.purple_flower_patch)



    let camera = getCurrentCamera(getAbstractState(state))

    let instancedlod = new InstancedLOD2.InstancedLOD(staticGroup, camera, name)

    instancedlod.setOctree(octree);
    instancedlod.setLevels(details, getIsDebug(state));
    instancedlod.setPopulation();


    // let count = 50

    let terrainMesh = NullableUtils.getExn(getState(state).terrain.terrainMesh)
    // let size = 300
    staticGroup = Terrain.insertRange(octree, count, terrainMesh, xSize, zSize)

    let abstractState = add(getAbstractState(state), instancedlod)

    state = setAbstractState(state, abstractState)


    return [state, scene]
}


// let _buildGroupData = (): Record<string, [number, number, number, number, number]> => {
//     return {
//         echeveria: [20, -100, 100, -100, 100],
//         purple_flower_patch: [5, 200, 300, -100, 100],
//     }
// }

// let _isNotInGroups = ([x, z]) => {
//     // let expand = 10

//     // return Object.values(_buildGroupData()).reduce((result, [xSize, zSize]) => {
//     //     if (!result) {
//     //         return result
//     //     }

//     //     return !(x <= xMax + expand && x >= xMin - expand && z <= zMax + expand && z >= zMin - expand)
//     // }, true)
//     let [xSize, zSize] = _buildGroupData()

//     return !isInGroups([x, z], [-xSize / 2, xSize / 2, -zSize / 2, zSize / 2])
// }

let _isNotInMountain = (y: number) => {
    return y <= 20
}

let _generateXYZ = (terrainMesh) => {
    let [x, z] = Terrain.generateRandomXZ(terrainMesh)

    let y = Terrain.getTerrainGeometry(terrainMesh).getHeightAtCoordinates(x, z)

    if (_isNotInMountain(y)) {
        return [x, y, z]
    }

    return _generateXYZ(terrainMesh)
}

let _addTrees = (state: state, scene) => {
    let staticGroup = NullableUtils.getExn(Scene.findObjectByName(scene, getStaticGroupName()))

    let trees = getState(state).tree.trees



    let count
    if (Device.isMobile()) {
        // count = 3000
        count = 2000
    }
    else {
        // count = 6000
        // count = 3000
        // count = 3000
        count = 4000
        // count = 10
        // count = 3
    }


    // let l = terrainVertices.array.length / 3;
    let terrainMesh = NullableUtils.getExn(getState(state).terrain.terrainMesh)

    let camera = getCurrentCamera(getAbstractState(state))


    let position = new Vector3();
    let quaterion = new Quaternion();
    let scale = new Vector3(1, 1, 1);
    const y_axis = new Vector3(0, 1, 0);

    let abstractState = trees.reduce((abstractState, [octree, details, name]) => {
        let instancedlod = new InstancedLOD2.InstancedLOD(staticGroup, camera, name)

        instancedlod.setOctree(octree);
        instancedlod.setLevels(details, getIsDebug(state));
        instancedlod.setPopulation();

        let box: Box3 = octree.computeBox()

        ArrayUtils.range(1, count).forEach(i => {
            let [x, y, z] = _generateXYZ(terrainMesh)
            // let x = (i * 50)
            // let z = 0
            // let y = Terrain.getTerrainGeometry(terrainMesh).getHeightAtCoordinates(x, z)

            let size = Math.random() + 0.5;
            scale.set(size, size, size);

            position.set(x, y, z);
            quaterion.setFromAxisAngle(y_axis, Math.random() * Math.PI * 2);

            let newTransform = new Matrix4().compose(position, quaterion, scale)
            let newName = `${name}_${i}`
            let newBox = box.clone().applyMatrix4(newTransform).expandByScalar(-5)
            // let newBox = box.clone().applyMatrix4(newTransform)

            octree.insert(newTransform, newBox, newName)
        })


        if (getIsDebug(state)) {
            // octree.display(scene)
        }


        return add(abstractState, instancedlod)
    }, getAbstractState(state))
    state = setAbstractState(state, abstractState)

    return [state, scene]
}

let _addMapWalls = (scene, state: state) => {
    let octree = NullableUtils.getExn(getState(state).map.wall)

    let position = new Vector3();
    let quaterion = new Quaternion();
    let scale = new Vector3(1, 1, 1);
    const y_axis = new Vector3(0, 1, 0);

    let name = MapWall.buildName()

    let box: Box3 = octree.computeBox()

    // let size = 50
    let size = 100
    scale.set(size, size, size);


    let terrainMesh = NullableUtils.getExn(getState(state).terrain.terrainMesh)
    let x = 200
    let z = 0
    // let y = Terrain.getTerrainGeometry(terrainMesh).getHeightAtCoordinates(x, z)
    let y = 0

    let boxHalfHeight = size / 2

    y += boxHalfHeight

    position.set(x, y, z);
    // quaterion.setFromAxisAngle(y_axis, Math.random() * Math.PI * 2);

    let newTransform = new Matrix4().compose(position, quaterion, scale)
    let newName = `${name}_0`
    let newBox = box.clone().applyMatrix4(newTransform)

    octree.insert(newTransform, newBox, newName)


    if (getIsDebug(state)) {
        let newBoxCube = new Box3Helper(newBox, 0x1fff00)
        scene.add(newBoxCube)
    }

    return scene
}

let _addGrass1s = (state: state, scene) => {
    let staticGroup = NullableUtils.getExn(Scene.findObjectByName(scene, getStaticGroupName()))

    let [octree, details, name] = NullableUtils.getExn(getState(state).grass.grass1)



    let count
    if (Device.isMobile()) {
        count = 3000
    }
    else {
        count = 6000
    }


    let terrainMesh = NullableUtils.getExn(getState(state).terrain.terrainMesh)

    let camera = getCurrentCamera(getAbstractState(state))


    let position = new Vector3();
    let quaterion = new Quaternion();
    let scale = new Vector3(1, 1, 1);
    const y_axis = new Vector3(0, 1, 0);

    // let abstractState = trees.reduce((abstractState, [octree, details, name]) => {
    // }, getAbstractState(state))

    let instancedlod = new InstancedLOD2.InstancedLOD(staticGroup, camera, name)

    instancedlod.setOctree(octree);
    instancedlod.setLevels(details, getIsDebug(state));
    instancedlod.setPopulation();

    let box: Box3 = octree.computeBox()

    ArrayUtils.range(1, count).forEach(i => {
        let [x, y, z] = _generateXYZ(terrainMesh)
        // let y = Terrain.getTerrainGeometry(terrainMesh).getHeightAtCoordinates(x, z)

        // let size = Math.random() + 0.5;
        // scale.set(size, size, size);

        position.set(x, y, z);
        quaterion.setFromAxisAngle(y_axis, Math.random() * Math.PI * 2);

        let newTransform = new Matrix4().compose(position, quaterion, scale)
        let newName = `${name}_${i}`
        let newBox = box.clone().applyMatrix4(newTransform)

        octree.insert(newTransform, newBox, newName)
    })


    if (getIsDebug(state)) {
        // octree.display(scene)
    }


    state = setAbstractState(state, add(getAbstractState(state), instancedlod))


    return [state, scene]
}

// let _addGrass2s = (state: state, scene) => {
//     let staticGroup = NullableUtils.getExn(Scene.findObjectByName(scene, getStaticGroupName()))

//     let grass = NullableUtils.getExn(getState(state).grass.grass2)

//     let terrainMesh = NullableUtils.getExn(getState(state).terrain.terrainMesh)
//     staticGroup = Terrain.addInstancedMeshRange(staticGroup, grass, terrainMesh, _buildGroupData().grass2)

//     return [state, scene]
// }

let _addFlower1s = (state: state, scene) => {
    let data = _insertRange(state, scene, NullableUtils.getExn(getState(state).flower.flower1_1), _buildGroupData(), 500)
    state = data[0]
    scene = data[1]


    data = _insertRange(state, scene, NullableUtils.getExn(getState(state).flower.flower1_2), _buildGroupData(), 500)
    state = data[0]
    scene = data[1]


    // data = _insertRange(state, scene, NullableUtils.getExn(getState(state).flower.flower1_3), _buildGroupData().flower1_3)
    // state = data[0]
    // scene = data[1]



    // data = _insertRange(state, scene, NullableUtils.getExn(getState(state).flower.flower1_4), _buildGroupData().flower1_4)
    // state = data[0]
    // scene = data[1]



    // data = _insertRange(state, scene, NullableUtils.getExn(getState(state).flower.flower1_5), _buildGroupData().flower1_5)
    // state = data[0]
    // scene = data[1]



    // data = _insertRange(state, scene, NullableUtils.getExn(getState(state).flower.flower1_6), _buildGroupData().flower1_6)
    // state = data[0]
    // scene = data[1]


    return [state, scene]
}


let _addFlower2s = (state: state, scene) => {
    return _insertRange(state, scene, NullableUtils.getExn(getState(state).flower.flower2), _buildGroupData(), 100)
}


let _addPlantGlb = (state: state, scene) => {
    let data = _insertRange(state, scene, NullableUtils.getExn(getState(state).plant.purple_flower_patch), _buildGroupData(), 300)
    state = data[0]
    scene = data[1]

    return _insertRange(state, scene, NullableUtils.getExn(getState(state).plant.echeveria), _buildGroupData(), 500)
}


let _addAnimateds = (state: state, scene) => {
    let staticGroup = NullableUtils.getExn(Scene.findObjectByName(scene, getStaticGroupName()))

    let box = NullableUtils.getExn(getState(state).animated.box)

    let count
    if (Device.isMobile()) {
        count = 2000
    }
    else {
        count = 4000
    }

    staticGroup = ArrayUtils.range(1, count).reduce((staticGroup, number) => {
        // Layer.enableAllPickableLayer(cabinet)

        number = number % 300

        let clonedOne = box.clone(true)
        clonedOne.name = Animated.buildName()

        let initialPosition = new Vector3(
            // (Math.random() * 2 - 1) * 12 * number, 5, (Math.random() * 2 - 1) * 12 * number
            (Math.random() * 2 - 1) * 12 * number, 30, (Math.random() * 2 - 1) * 12 * number
        )

        // clonedOne.position.set((Math.random() * 2 - 1) * 12 * number, 10, (Math.random() * 2 - 1) * 12 * number)
        clonedOne.position.copy(initialPosition)

        clonedOne = Shadow.setShadow(clonedOne, true, false)

        // setInterval(() => {
        //     if (clonedOne.position.x > 500) {
        //         clonedOne.position.copy(initialPosition)
        //     }
        //     else {
        //         clonedOne.position.setX(clonedOne.position.x + 2)
        //     }


        //     let _ = Object3DUtils.markNeedsUpdate(clonedOne)
        // }, Math.random() * 100 + 16)

        staticGroup.add(clonedOne)

        return staticGroup
    }, staticGroup)

    return scene
}

// let _addGround = (scene, state: state) => {
//     let ground = NewThreeInstance.createMesh(
//         NewThreeInstance.createPlaneGeometry(1000, 1000, 1, 1),
//         NewThreeInstance.createMeshPhysicalMaterial({
//             color: new Color(0xffffff),
//             metalness: 0.1,
//             roughness: 0.9
//         })
//     )


//     ground.rotateX(-Math.PI / 2)
//     // ground = Object3DUtils.markNeedsUpdate(ground)
//     // ground.position.setY(-1000 / 2)

//     // ground.receiveShadow = true

//     let staticGroup = NullableUtils.getExn(Scene.findObjectByName(scene, getStaticGroupName()))

//     staticGroup.add(ground)

//     return scene
// }


let _addTerrain = (scene, state: state) => {
    let staticGroup = NullableUtils.getExn(Scene.findObjectByName(scene, getStaticGroupName()))

    let terrainMesh = NullableUtils.getExn(getState(state).terrain.terrainMesh)

    staticGroup.add(terrainMesh)

    CSM.setupMaterial(getAbstractState(state), terrainMesh.material as Material);

    return scene
}

// let _addInstances = (state: state, scene, staticGroup) => {
//     let data

//     // let data = ArrayUtils.pushArrs(Trees.findAllTrees(state, staticGroup),
//     //     [
//     //         Grass1.findAllGrass1s(state, staticGroup),
//     //         // Flower1.findAllFlower1s(state, staticGroup),
//     //     ]
//     // ).reduce(([abstractState, scene], lods) => {
//     //     return Instance.convertLODToInstanceMeshLOD(abstractState, scene, lods)
//     // }, [getAbstractState(state), scene])
//     // state = setAbstractState(state, data[0])
//     // scene = data[1]
//     // let data = [Grass1.findAllGrass1s(state, staticGroup)].reduce(([abstractState, scene], lods) => {
//     //     return Instance.convertLODToInstanceMeshLOD(abstractState, scene, lods)
//     // }, [getAbstractState(state), scene])
//     // state = setAbstractState(state, data[0])
//     // scene = data[1]




//     // data = Instance.convertNotLODToInstanceMesh(getAbstractState(state), scene,
//     //     Animated.findAllAnimateds(staticGroup)
//     // )
//     // state = setAbstractState(state, data[0])
//     // scene = data[1]

//     // data = Instance.convertNotLODToInstanceMesh(getAbstractState(state), scene,
//     //     Flower1.findAllFlower1s(state, staticGroup)
//     // )
//     // state = setAbstractState(state, data[0])
//     // scene = data[1]

//     return [state, scene]
// }

let _addLight = (state: state, scene, renderer, camera) => {
    scene = SceneUtils.addAmbientLight(scene)

    // let data = addDirectionLight(state, scene, renderer)
    // state = data[0]
    // scene = data[1]

    state = setAbstractState(state, CSM.create(getAbstractState(state), {
        maxFar: 1000,
        cascades: 3,
        mode: "practical",
        parent: scene,
        shadowMapSize: 512,
        lightDirection: new Vector3(-1, -1, -1).normalize(),
        // lightColor: new Color(0x000020),
        // lightIntensity: 0.5,
        lightIntensity: 1,
        camera: camera,
    }))


    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = PCFSoftShadowMap;

    return [state, scene]
}


let _addSkyBox = (scene) => {
    return SkyBox.addToScene(scene, SkyBox.create([
        "meta3d-jiehuo-abstract/images/sky box/right.jpg",
        "meta3d-jiehuo-abstract/images/sky box/left.jpg",
        "meta3d-jiehuo-abstract/images/sky box/top.jpg",
        "meta3d-jiehuo-abstract/images/sky box/bottom.jpg",
        "meta3d-jiehuo-abstract/images/sky box/front.jpg",
        "meta3d-jiehuo-abstract/images/sky box/back.jpg",
    ]))
}

// let _buildGroupData = (): Record<string, [number, number, number, number, number]> => {
//     return {
//         // flower1_1: [20, -100, 100, -100, 100],
//         // flower1_2: [5, 200, 300, -100, 100],
//         flower1_1: [5, 0, 50, 0, 50],
//         flower1_2: [5, 100, 150, 0, 50],
//         // flower1_3: [5, 200, 250, 0, 50],
//         // flower1_4: [5, -100, -50, 0, 50],
//         // flower1_5: [5, -200, -150, 0, 50],

//         // flower1_6: [5, 100, 150, 100, 150],

//         flower2: [10, -100, -50, 100, 150],
//         grass2: [0.5, 0, 50, 100, 150],
//         echeveria: [5, 200, 250, 100, 150],
//         purple_flower_patch: [10, -200, -150, 100, 150],
//     }
// }
let _buildGroupData = (): [number, number] => {
    // return [-200, 200, -200, 200]
    return [300, 300]
}


export let build = (state: state, renderer) => {
    let staticGroup = Scene.createGroup(getStaticGroupName())
    let dynamicGroup = Scene.createGroup(getDynamicGroupName())

    let scene = Scene.createScene(getName())

    state = setState(state, {
        ...getState(state),
        staticGroup: NullableUtils.return_(staticGroup),
        dynamicGroup: NullableUtils.return_(dynamicGroup),
        scene: NullableUtils.return_(scene),
        girl: {
            ...getGirlState(state),
            position: new Vector3(0, 0, 5)
        }
    })

    state = setControlsConfig(state)

    let data

    scene = _addGroups(scene, [staticGroup, dynamicGroup])


    data = _addLight(state, scene, renderer, getCurrentCamera(getAbstractState(state)))
    state = data[0]
    scene = data[1]

    scene = _addTerrain(scene, state)

    scene = _addMapWalls(scene, state)

    data = _addTrees(state, scene)
    state = data[0]
    scene = data[1]

    data = _addGrass1s(state, scene)
    state = data[0]
    scene = data[1]

    // // data = _addGrass2s(state, scene)
    // // state = data[0]
    // // scene = data[1]

    // data = _addFlower1s(state, scene)
    // state = data[0]
    // scene = data[1]

    // data = _addFlower2s(state, scene)
    // state = data[0]
    // scene = data[1]

    // data = _addPlantGlb(state, scene)
    // state = data[0]
    // scene = data[1]


    // scene = _addAnimateds(state, scene)



    scene = _addSkyBox(scene)


    // data = _addInstances(state, scene, staticGroup)
    // state = data[0]
    // scene = data[1]


    Scene.getScene(getAbstractState(state)).add(scene)

    return state
}