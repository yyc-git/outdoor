import { ModelLoader } from "meta3d-jiehuo-abstract"
import { getAbstractState, setAbstractState } from "../../../../../state/State"
import { state } from "../../../../../type/StateType"
import { Octree2 } from "meta3d-jiehuo-abstract"
import { getState, setState } from "../../ParkScene"
import { Render } from "meta3d-jiehuo-abstract"
import { Box3, DoubleSide, Object3D, TextureLoader, Vector3 } from "three"
import { InstanceSourceLOD } from "meta3d-jiehuo-abstract"
import { getIsDebug } from "../../../Scene"
import { NullableUtils } from "meta3d-jiehuo-abstract"
import { tree } from "../../type/StateType"
import { Scene } from "meta3d-jiehuo-abstract"
import { CustomizeTree } from "meta3d-jiehuo-abstract"
import { TreeBuilder } from "meta3d-jiehuo-abstract"
import { LeafGeometry } from "meta3d-jiehuo-abstract"
import { NewThreeInstance } from "meta3d-jiehuo-abstract"
import { push } from "meta3d-jiehuo-abstract/src/utils/ArrayUtils"
import { InstancedLOD2 } from "meta3d-jiehuo-abstract"
import { Terrain } from "meta3d-jiehuo-abstract"
import { Event } from "meta3d-jiehuo-abstract"
import { Pick } from "meta3d-jiehuo-abstract"
import { setBoxCube } from "../../Pick"
import { getPlayerCollisionableOctrees, setPlayerCollisionableOctrees } from "meta3d-jiehuo-abstract/src/collision/Collision"

let _getState = (state: state) => {
    return NullableUtils.getExn(getState(state).tree)
}

let _setState = (state: state, treeState: tree) => {
    return setState(state, {
        ...getState(state),
        tree: NullableUtils.return_(treeState)
    })
}

let _getNamePrefix = () => "tree"

// export let buildName = () => "tree"
export let buildName = (index) => `${_getNamePrefix()}_${index}`

export let findAllTrees = (state, scene) => {
    return _getState(state).trees.reduce((result, tree, index) => {
        return push(
            result,
            Scene.findObjects(scene, ({ name }) => name == buildName(index))
        )
    }, [])
}

// let = () => {
//     //TODO implement
//     return {} as any
// }

// let _buildLODData = ([trees, customizeTree, treebuilder, textureLoader], state, name, index) => {
//     let treeObj = customizeTree.getTree(name)
//     // let details = 原神启动(treebuilder, treeObj, 400, 2000)


//     treebuilder.clearMesh()
//     treebuilder.init(treeObj)


//     let high = treebuilder.buildTree(treebuilder.buildSkeleton())

//     let texture = textureLoader.load(`${treeObj.path}texture.png`)
//     let box = new Box3().setFromObject(high)
//     let boxSize = box.getSize(new Vector3())
//     let size = Math.max(...boxSize.toArray())

//     let geometry = new LeafGeometry.LeafGeometry("cross", 1, 1)
//         .generate()
//         .scale(size, size, size)
//     let material = NewThreeInstance.createMeshBasicMaterial({
//         map: texture,
//         side: DoubleSide,
//         color: 0xb3b3b3,
//         // transparent: true,
//         alphaTest: 0.9,
//     })

//     let low = NewThreeInstance.createGroup()
//     low.add(NewThreeInstance.createMesh(geometry, material))

//     low.matrixAutoUpdate = false
//     // middle.matrixAutoUpdate = false
//     high.matrixAutoUpdate = false


//     let tree = new InstanceSourceLOD.InstanceSourceLOD()

//     tree.addLevel(high, 100, 0, getIsDebug(state))
//     // tree.addLevel(high, 400, 0, getIsDebug(state))
//     // tree.addLevel(middle, 250, 0, getIsDebug(state))
//     tree.addLevel(low, +Infinity, 0, getIsDebug(state))


//     // tree.scale.multiply(new Vector3(0.5, 0.5, 0.5))


//     // if (index != 0 && index != 2) size = Math.random() + 2
//     // else {
//     // size = Math.random() + 0.5
//     // }
//     // tree.scale.set(size, size, size)

//     // tree.name = buildName(index)

//     return [
//         push(trees, tree),
//         customizeTree,
//         treebuilder,
//         textureLoader
//     ]
// }
let _buildLODData = ([trees, customizeTree, treebuilder, textureLoader], state, name, index) => {
    let treeObj = customizeTree.getTree(name)
    // let details = 原神启动(treebuilder, treeObj, 400, 2000)


    treebuilder.clearMesh()
    treebuilder.init(treeObj)


    let high = treebuilder.buildTree(treebuilder.buildSkeleton())

    high.castShadow = true
    high.receiveShadow = false


    let texture = textureLoader.load(`${treeObj.path}texture.png`)
    let box = new Box3().setFromObject(high)
    let boxSize = box.getSize(new Vector3())
    let size = Math.max(...boxSize.toArray())

    let geometry = new LeafGeometry.LeafGeometry("cross", 1, 1)
        .generate()
        .scale(size, size, size)
    let material = NewThreeInstance.createMeshBasicMaterial({
        map: texture,
        side: DoubleSide,
        color: 0xb3b3b3,
        // transparent: true,
        alphaTest: 0.9,
    })

    let low = NewThreeInstance.createGroup()
    low.add(NewThreeInstance.createMesh(geometry, material))

    low.castShadow = true
    low.receiveShadow = false


    let details = [
        {
            group: high,
            level: "l0",
            // distance: 400,
            distance: 150,
        },
        {
            group: low,
            level: "l1",
            distance: 2000,
        },
    ]


    // let instancedlod = new InstancedLOD2.InstancedLOD(scene, camera, treeObj.name);

    let octree = new Octree2.Octree(Terrain.getBoundingBox(NullableUtils.getExn(getState(state).terrain.terrainMesh)), 5, 0)

    octree.details = details

    // instancedlod.setOctree(octree);

    // low.matrixAutoUpdate = false
    // // middle.matrixAutoUpdate = false
    // high.matrixAutoUpdate = false


    // let tree = new InstanceSourceLOD.InstanceSourceLOD()

    // tree.addLevel(high, 100, 0, getIsDebug(state))
    // // tree.addLevel(high, 400, 0, getIsDebug(state))
    // // tree.addLevel(middle, 250, 0, getIsDebug(state))
    // tree.addLevel(low, +Infinity, 0, getIsDebug(state))

    return [
        push(trees, [
            octree,
            details,
            buildName(index)
        ]),
        customizeTree,
        treebuilder,
        textureLoader
    ]
}

export let parseAndAddResources = (state: state) => {
    // let abstractState = getAbstractState(state)

    // let tree = new InstanceSourceLOD.InstanceSourceLOD()

    // cabinetDrawer.receiveShadow = true
    // cabinetDrawer.castShadow = false


    // return ModelLoader.parseGlb(abstractState, Loader.getResource(abstractState, getTree1LowResourceId()), Render.getRenderer(abstractState)).then((low: Object3D) => {
    //     return ModelLoader.parseGlb(abstractState, Loader.getResource(abstractState, getTree1MiddleResourceId()), Render.getRenderer(abstractState)).then((middle: Object3D) => {
    //         return ModelLoader.parseGlb(abstractState, Loader.getResource(abstractState, getTree1HighResourceId()), Render.getRenderer(abstractState)).then((high: Object3D) => {
    //         })
    //     })
    // })

    const customizeTree = new CustomizeTree.CustomizeTree()

    const species = Array.from(customizeTree.indices.keys())



    let data = species.reduce((result, name, index) => {
        return _buildLODData(result as any, state, name, index)
    }, [[], customizeTree, new TreeBuilder.TreeBuilder(), new TextureLoader()])
    let trees = data[0]

    return Promise.resolve(_setState(state, {
        ..._getState(state),
        trees
    }))
}

export let createState = (): tree => {
    return {
        trees: null
    }
}

let _pickEventHandler = (state: state, { userData }) => {
    let targets = NullableUtils.getExn(userData).targets

    if (targets.count() == 0) {
        if (getIsDebug(state)) {
            state = setBoxCube(state, NullableUtils.getEmpty())
        }

        return Promise.resolve(state)

    }

    console.log(
        targets.get(0)
    )

    let [distance, transform, box, name] = targets.get(0)

    if (getIsDebug(state)) {
        state = setBoxCube(state, NullableUtils.return_(box))
    }

    return Promise.resolve(state)
}

export let initWhenImportScene = (state: state) => {
    let abstractState = getAbstractState(state)

    abstractState = Event.on(abstractState, Pick.getPickEventName(), _pickEventHandler)

    abstractState = Scene.setPickableOctrees(abstractState,
        Scene.getPickableOctrees(abstractState).concat(_getState(state).trees.map(data => data[0]))
    )

    abstractState = setPlayerCollisionableOctrees(abstractState, getPlayerCollisionableOctrees(abstractState).concat(_getState(state).trees.map(data => data[0])))

    state = setAbstractState(state, abstractState)

    return Promise.resolve(state)
}

export let dispose = (state: state) => {
    state = setAbstractState(state, Event.off(getAbstractState(state), Pick.getPickEventName(), _pickEventHandler))

    return Promise.resolve(state)
}