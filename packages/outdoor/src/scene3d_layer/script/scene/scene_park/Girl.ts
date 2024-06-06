import { Event, NullableUtils, Scene, Device, SkinAnimation, Loader, ModelLoader, Camera, Capsule, DisposeUtils, ThirdPersonControls, Layer } from "meta3d-jiehuo-abstract"
import { state } from "../../../type/StateType"
import { getAbstractState, setAbstractState } from "../../../state/State"
import { getName as getSceneName, getScene, getState, setState } from "./ParkScene"
import { girl } from "./type/StateType"
import { AnimationClip, Euler, Mesh, MeshPhongMaterial, Object3D, Vector3 } from "three"
// import { setTarget } from "./Camera"
import { getIsDebug } from "../Scene"
import { getOrbitControlsTarget } from "./Camera"
import { Octree } from "meta3d-jiehuo-abstract"
import { NewThreeInstance } from "meta3d-jiehuo-abstract"
import { Flow } from "meta3d-jiehuo-abstract"
import { Terrain } from "meta3d-jiehuo-abstract"
import { queryCapsuleCollision } from "meta3d-jiehuo-abstract/src/collision/Collision"

export let getName = () => "girl"

export let getResourceId = () => `${getSceneName()}_${getName()}`

export let getResourcePath = (name) => `./${name}/girl/${getName()}.fbx`

export let getIdleAnimationName = () => "idle"

export let getIdleAnimationResourceId = () => `${getSceneName()}_${getIdleAnimationName()}`

export let getIdleAnimationResourcePath = (name) => `./${name}/girl/${getIdleAnimationName()}.fbx`

export let getRunningAnimationName = () => "running"

export let getRunningAnimationResourceId = () => `${getSceneName()}_${getRunningAnimationName()}`

export let getRunningAnimationResourcePath = (name) => `./${name}/girl/${getRunningAnimationName()}.fbx`


export let getGirlState = (state: state) => {
    return NullableUtils.getExn(getState(state).girl)
}

export let setGirlState = (state: state, girlState: girl) => {
    return setState(state, {
        ...getState(state),
        girl: NullableUtils.return_(girlState)
    })
}

// export let findGirl = (scene) => {
//     return Scene.findObjectByName(scene, getName())
// }
export let getGirl = (state: state) => {
    return NullableUtils.getExn(getGirlState(state).girl)
}


let _getDefaultAnimationName = getIdleAnimationName

export let createState = (): girl => {
    return {
        currentAnimationName: _getDefaultAnimationName(),
        capsule: Capsule.create(),
        capsuleMesh: null,
        // lastVelocity: new Vector3(0, 0, 0),
        girl: null,
        idle: null,
        running: null,
        position: new Vector3(0, 0, 0)
        // isOnFloor: false
    }
}

let _parseResources = (state: state) => {
    return ModelLoader.parseFbx(getAbstractState(state), Loader.getResource(getAbstractState(state), getResourceId()), getResourcePath(getName())).then(girl => {
        return ModelLoader.parseFbx(getAbstractState(state), Loader.getResource(getAbstractState(state), getIdleAnimationResourceId()), getIdleAnimationResourcePath(getName())).then(idle => {
            return ModelLoader.parseFbx(getAbstractState(state), Loader.getResource(getAbstractState(state), getRunningAnimationResourceId()), getRunningAnimationResourcePath(getName())).then(running => {
                return [girl, [idle, running]]
            })
        })
    })
}


let _computeNewPosition = (state: state, translation: Vector3) => {
    let capsule = getGirlState(state).capsule.clone()

    capsule.translate(translation)

    let capsuleDiffToPlayer = new Vector3(0, capsule.radius, 0)
    let capsuleDiffToMesh = new Vector3(0, (capsule.end.y - capsule.start.y) / 2, 0)

    return [capsule.start.clone().add(capsuleDiffToMesh), capsule.start.clone().add(capsuleDiffToPlayer)]
}

let _translate = (state: state, translation: Vector3) => {
    let girl = getGirl(state)
    let capsule = getGirlState(state).capsule

    capsule.translate(translation)

    let [capsuleMeshNewPosition, girlNewPosition] = _computeNewPosition(state, translation)


    if (getIsDebug(state)) {
        let capsuleMesh = NullableUtils.getExn(getGirlState(state).capsuleMesh)

        capsuleMesh.position.copy(capsuleMeshNewPosition)
    }

    girl.position.copy(girlNewPosition)

    return state
}

let _getCapsuleConfig = () => {
    let capsuleRadius = 4
    let capsuleLengthBetweenStartAndEnd = 9

    return { capsuleRadius, capsuleLengthBetweenStartAndEnd }
}

let _initGirlTransform = (state: state) => {
    let scale = 0.11
    let { capsuleRadius, capsuleLengthBetweenStartAndEnd } = _getCapsuleConfig()
    let capsuleParams: [Vector3, Vector3, number] = [
        new Vector3(0, capsuleRadius, 0),
        new Vector3(0, capsuleRadius + capsuleLengthBetweenStartAndEnd, 0),
        capsuleRadius
    ]

    let { capsule, position } = getGirlState(state)
    capsule.set(...capsuleParams)


    let girl = getGirl(state)

    girl.scale.set(scale, scale, scale)
    girl.position.set(0, 0, 0)


    if (getIsDebug(state)) {
        let capsuleMesh = NullableUtils.getExn(getGirlState(state).capsuleMesh)

        capsuleMesh.position.set(0, 0, 0)
    }


    // let initialPosition = new Vector3(5, 0.0, 5)

    state = _translate(state, position)

    return state
}


export let hideGirl = (state: state) => {
    let girl = getGirl(state)

    girl.visible = false
    // Layer.setAllToNotVisibleLayer(girl)

    if (getIsDebug(state)) {
        let capsuleMesh = getGirlState(state).capsuleMesh
        capsuleMesh.visible = false
        // Layer.setAllToNotVisibleLayer(capsuleMesh)
    }

    return setAbstractState(state, SkinAnimation.stopTargetAllSkinAnimations(getAbstractState(state), girl.name))
}

let _showGirl = (state: state, deferLoopCount: number) => {
    let girl = getGirl(state)

    if (getIsDebug(state)) {
        let capsuleMesh = getGirlState(state).capsuleMesh
        capsuleMesh.visible = true
        // Layer.setAllToVisibleLayer(capsuleMesh)
    }


    state = _initGirlTransform(state)


    state = setGirlState(state, {
        ...getGirlState(state),
        currentAnimationName: _getDefaultAnimationName()
    })

    // setTimeout(() => {
    //     girl.visible = true
    // }, deferLoopCount)
    // Layer.setAllToVisibleLayer(girl)

    return setAbstractState(state, Flow.addDeferExecFuncData(getAbstractState(state), (state) => {
        girl.visible = true

        return Promise.resolve(setAbstractState(state, SkinAnimation.playSkinAnimation(getAbstractState(state), getGirlState(state).currentAnimationName, getName(), true)))
    }, deferLoopCount))


    // return setAbstractState(state, SkinAnimation.playSkinAnimation(getAbstractState(state), getGirlState(state).currentAnimationName, getName(), true))
}

export let immediatelyShowGirl = (state: state) => {
    return _showGirl(state, 0)
}

export let deferShowGirl = _showGirl

let _changeMaterial = (girl) => {
    let mesh = girl.children[0] as Mesh

    let material = mesh.material as MeshPhongMaterial
    let newMaterial = NewThreeInstance.createMeshPhysicalMaterial({
        map: material.map,
        normalMap: material.normalMap,
    })

    if (Device.isIOS()) {
        /*!too big for ios! so remove them!*/
        newMaterial.map = null
        newMaterial.normalMap = null
    }

    mesh.material = newMaterial

    return girl
}

export let parseAndAddResources = (state: state) => {
    return _parseResources(state).then(([girl, [idle, running]]: any) => {
        girl.name = getName()

        girl = _changeMaterial(girl)

        state = setGirlState(state, {
            ...getGirlState(state),
            girl: NullableUtils.return_(girl),
            idle: NullableUtils.return_(idle),
            running: NullableUtils.return_(running)
        })


        if (getIsDebug(state)) {
            let { capsuleRadius, capsuleLengthBetweenStartAndEnd } = _getCapsuleConfig()

            let capsuleMesh = Capsule.createCapsuleMesh({
                radius: capsuleRadius,
                length: capsuleLengthBetweenStartAndEnd
            }, "red")

            // scene.add(capsuleMesh)

            state = setGirlState(state, {
                ...getGirlState(state),
                capsuleMesh: NullableUtils.return_(capsuleMesh)
            })
        }

        // state = _initGirlTransform(state)


        // let abstractState = SkinAnimation.addSkinAnimationMixer(getAbstractState(state), girl, getName())

        // abstractState = SkinAnimation.addSkinAnimation(abstractState, getName(), getIdleAnimationName(),
        //     idle.animations[0]
        // )
        // abstractState = SkinAnimation.addSkinAnimation(abstractState, getName(), getRunningAnimationName(),
        //     running.animations[0]
        // )


        // scene.add(girl)


        // state = setAbstractState(state, abstractState)


        return state
    })
}

export let initWhenImportScene = (state: state) => {
    state = hideGirl(state)

    let scene = getScene(state)

    if (getIsDebug(state)) {
        scene.add(
            NullableUtils.getExn(getGirlState(state).capsuleMesh)
        )
    }

    let girl = getGirl(state)

    let { idle, running } = getGirlState(state)

    let abstractState = SkinAnimation.addSkinAnimationMixer(getAbstractState(state), girl, getName())

    abstractState = SkinAnimation.addSkinAnimation(abstractState, getName(), getIdleAnimationName(),
        NullableUtils.getExn(idle).animations[0]
    )
    abstractState = SkinAnimation.addSkinAnimation(abstractState, getName(), getRunningAnimationName(),
        NullableUtils.getExn(running).animations[0]
    )

    state = setAbstractState(state, abstractState)

    scene.add(getGirl(state))

    return Promise.resolve(state)
}

// 处理人物下落 start
// 简单来说就说模仿重力，一直有一个向下的向量
// let _addGravity = (velocity: Vector3, isOnFloor, delta) => {
//     let gravity = 2.5
//     let damping = Math.exp(-4 * delta) - 1 // 模拟阻尼

//     if (!isOnFloor) {
//         velocity.y -= gravity * delta
//         damping *= 0.1
//     }
//     velocity.addScaledVector(velocity, damping)

//     return velocity
// }


export let _updateAnimation = (state: state) => {
    let { currentAnimationName } = getGirlState(state)

    let nextAnimationName
    if (
        ThirdPersonControls.isMoveFront(getAbstractState(state)) ||
        ThirdPersonControls.isMoveBack(getAbstractState(state)) ||
        ThirdPersonControls.isMoveLeft(getAbstractState(state)) ||
        ThirdPersonControls.isMoveRight(getAbstractState(state))
    ) {
        nextAnimationName = getRunningAnimationName()
    } else {
        nextAnimationName = getIdleAnimationName()
    }

    if (currentAnimationName !== nextAnimationName) {
        state = setAbstractState(state, SkinAnimation.stopSkinAnimation(getAbstractState(state), currentAnimationName, getName()))
        state = setAbstractState(state, SkinAnimation.playSkinAnimation(getAbstractState(state), nextAnimationName, getName(), true))

        state = setGirlState(state, {
            ...getGirlState(state),
            currentAnimationName: nextAnimationName
        })
    }


    state = setAbstractState(state, SkinAnimation.updateSkinAnimation(getAbstractState(state), getName(), Device.getDelta(getAbstractState(state))))

    return state
}

let _setCapsuleHeight = (state, height) => {
    let capsule = getGirlState(state).capsule

    capsule.translate(new Vector3(0, height - (capsule.start.y - capsule.radius), 0))

    return capsule
}

let _setCapsuleMeshHeight = (state, height) => {
    let capsuleMesh = NullableUtils.getExn(getGirlState(state).capsuleMesh)

    capsuleMesh.position.setY(height)

    return capsuleMesh
}

let _setGirlHeight = (state, height) => {
    let girl = getGirl(state)

    girl.position.setY(height)

    return girl
}

// let _considerTerrainHeight = (velocity: Vector3, state: state) => {
//     let abstractState = getAbstractState(state)

//     let scene = Scene.getCurrentScene(abstractState)

//     let terrainGeometry = NullableUtils.getExn(Terrain.findTerrainGeometry(scene))


//     let [_, girlNewPosition] = _computeNewPosition(state, velocity)

//     let height = terrainGeometry.getHeightAtCoordinates(girlNewPosition.x, girlNewPosition.z)

//     // const heightScale = 1

//     // if ((girlNewPosition.y + velocity.y) <= height) {
//     // if (girlNewPosition.y <= height) {
//     //     return velocity.setY(height * heightScale - girlNewPosition.y)
//     // }

//     // return velocity


//     // return velocity.setY(height)




//     let girl = getGirl(state)
//     let capsule = getGirlState(state).capsule

//     // capsule.translate(new Vector3(0, height - (capsule.start.y - capsule.radius), 0))
//     let _ = _setCapsuleHeight(capsule, height)

//     if (getIsDebug(state)) {
//         let _ = _setCapsuleMeshHeight(state, height)
//     }

//     let _ = _setGirlHeight(state, height)

//     return state

// }

let _considerTerrainHeight = (state: state) => {
    let abstractState = getAbstractState(state)

    let scene = Scene.getCurrentScene(abstractState)

    let terrainGeometry = NullableUtils.getExn(Terrain.findTerrainGeometry(scene))


    let girl = getGirl(state)

    let height = terrainGeometry.getHeightAtCoordinates(girl.position.x, girl.position.z)


    // let capsule = getGirlState(state).capsule

    _setCapsuleHeight(state, height)

    if (getIsDebug(state)) {
        _setCapsuleMeshHeight(state, height)
    }

    _setGirlHeight(state, height)

    return state
}

// let _updateCollision = (velocity: Vector3, state: state) => {
//     // let result = Octree.capsuleIntersect(getOctree(state), getGirlState(state).capsule)

//     // if (result) {
//     //     velocity.add(result.normal.multiplyScalar(result.depth))
//     // }

//     // return velocity

//     let data = queryCapsuleCollision(state, getGirlState(state).capsule)
//     let result = data[0]

//     // if (data[0] !== null) {
//     //     return new Vector3(0, 0, 0)
//     // }

//     // return velocity

//     if (result !== null) {
//         velocity.add(result.normal.multiplyScalar(result.depth / 10))
//     }

//     return velocity

// }

let _isEnterBox = (box, oldPosition, newPosition) => {
    // let boxCenter = box.getCenter(new Vector3())

    // return box.distanceToPoint(oldPosition) > box.distanceToPoint(newPosition)
    return box.getCenter(new Vector3()).sub(oldPosition).length() > box.getCenter(new Vector3()).sub(newPosition).length()
}

let _updateCollision = (velocity: Vector3, state: state) => {
    // let result = Octree.capsuleIntersect(getOctree(state), getGirlState(state).capsule)

    // if (result) {
    //     velocity.add(result.normal.multiplyScalar(result.depth))
    // }

    // return velocity


    let capsule = getGirlState(state).capsule.clone()
    let oldCenter = capsule.getCenter(new Vector3())
    capsule.translate(velocity)
    let newCenter = capsule.getCenter(new Vector3())

    let data = queryCapsuleCollision(getAbstractState(state), capsule)
    let result = data[0]
    let box = data[2]

    //     TODO update collision corresponding:
    //     refer to:
    // http://www.cad.zju.edu.cn/home/jin/3danimationcourse/collision.pdf
    // https://www.gamedev.net/forums/topic/599303-capsule-box-collision-detection/

    if (result !== null && _isEnterBox(box, oldCenter, newCenter)) {
        return new Vector3(0, 0, 0)
    }

    // if (result !== null) {
    //     // velocity.add(result.normal.multiplyScalar(result.depth / 10))
    //     // velocity.add(result.normal.multiplyScalar(result.depth / 10).setY(0))

    //     let boxSize = box.getSize(new Vector3())
    //     let scalar = Math.max(boxSize.x, boxSize.y, boxSize.z) / 30

    //     let delta  = result.normal.setY(0).normalize().multiplyScalar(scalar)

    //     // velocity.add(result.normal.multiplyScalar(result.depth / scalar).setY(0))
    //     velocity.add(delta)

    //     // TODO consider speed

    //     console.log(boxSize,scalar, delta);

    // }


    return velocity
}

export let update = (state: state) => {
    let girl = NullableUtils.getExn(getGirl(state))

    let delta = Device.getDelta(getAbstractState(state))

    let [localRotation, velocity] = ThirdPersonControls.computeTransformForCamera(getAbstractState(state), girl, Camera.getOrbitControls(getAbstractState(state)), delta)


    // velocity = _addGravity(velocity, getGirlState(state).isOnFloor, delta)
    girl.rotation.copy(localRotation)
    // girl.position.add(velocity)



    // let data = _updateCollision(velocity, state)
    // velocity = data[0]
    // let isSetLastVelocityToZero = data[1]
    velocity = _updateCollision(velocity, state)


    //TODO continue to fix:"girl move still towards cabinet mayby lift and go by!" bug
    velocity.setY(0)


    // velocity = _considerTerrainHeight(velocity, state)


    state = _translate(state, velocity)

    state = _considerTerrainHeight(state)

    // ThirdPersonControls.updateCamera(getAbstractState(state), girl.getWorldPosition(new Vector3()), velocity, getOrbitControlsTarget(girl))
    ThirdPersonControls.updateCamera(getAbstractState(state), velocity, getOrbitControlsTarget(girl))


    // state = setGirlState(state, {
    //     ...getGirlState(state),
    //     lastVelocity: isSetLastVelocityToZero ? new Vector3(0, 0, 0) : velocity
    // })



    state = _updateAnimation(state)

    return state
}

export let dispose = (state: state) => {
    let girl = NullableUtils.getExn(getGirl(state))

    let abstractState = getAbstractState(state)


    abstractState = SkinAnimation.disposeSkinAnimation(abstractState, girl, getName())

    state = setAbstractState(state, abstractState)

    // state = setGirlState(state, createState())

    return Promise.resolve(state)
}