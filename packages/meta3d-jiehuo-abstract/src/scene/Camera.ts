import { Object3D, OrthographicCamera, PerspectiveCamera, Vector3 } from "three"
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
// import { OrbitControls } from './three/OrbitControls'
import { camera, state } from "../type/StateType"
import { getRenderState, getSceneState, setSceneState } from "../state/State"
import { getExn, return_ } from "../utils/NullableUtils"
import { getHeight, getWidth } from "../View"
import { init as initThirdPersonControls, createState as createThirdPersonControlsState } from "./ThirdPersonControls"
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls"
import { getCurrentScene } from "./Scene"
import { findTerrainGeometry } from "../terrain/Terrain"

// let _createOrbitControls = (state: state, renderer) => {
//     // let camera = new PerspectiveCamera(60, getWidth() / getHeight(), 0.1, 10000)
//     // camera.position.set(0, 10, 10)

//     let controls = new OrbitControls(null, renderer.domElement)
//     // controls.listenToKeyEvents(window) // optional

//     //controls.addEventListener( 'change', render ) // call this only in static scenes (i.e., if there is no articluatedAnimation loop)

//     // controls.enableDamping = true // an articluatedAnimation loop is required when either damping or auto-rotation are enabled
//     // controls.dampingFactor = 0.05

//     // controls.screenSpacePanning = false

//     // controls.minDistance = 1
//     // controls.maxDistance = 100

//     // controls.maxPolarAngle = Math.PI / 2

//     return controls
// }

export let getOrbitControls = (state: state) => {
    return getSceneState(state).camera?.orbitControls
}

export let setOrbitControls = (state: state, controls: any) => {
    return setSceneState(state, {
        ...getSceneState(state),
        camera: {
            ...getSceneState(state).camera,
            orbitControls: controls
        }
    })
}

export let getTrackballControls = (state: state) => {
    return getSceneState(state).camera?.trackballControls
}

export let setTrackballControls = (state: state, controls: any) => {
    return setSceneState(state, {
        ...getSceneState(state),
        camera: {
            ...getSceneState(state).camera,
            trackballControls: controls
        }
    })
}

export let getCurrentCamera = (state: state) => {
    return getExn(getSceneState(state).camera.currentCamera)
}

export let setCurrentCamera = (state: state, camera) => {
    return setSceneState(state, {
        ...getSceneState(state),
        camera: {
            ...getSceneState(state).camera,
            currentCamera: return_(camera)
        }
    })
}

export let getCurrentControls = (state: state) => {
    return getExn(getSceneState(state).camera.currentControls)
}

export let setCurrentControls = (state: state, controls) => {
    return setSceneState(state, {
        ...getSceneState(state),
        camera: {
            ...getSceneState(state).camera,
            currentControls: return_(controls)
        }
    })
}

export let createState = (): camera => {
    return {
        currentCamera: null,
        currentControls: null,
        orbitControls: null,
        thirdPersonControls: createThirdPersonControlsState(),
        trackballControls: null
    }
}

let _bindResizeEvent = (trackballControls) => {
    window.addEventListener("resize", _ => {
        _handleResize(trackballControls)
    })
}

export let init = (state: state, [getAbstractStateFunc, setAbstractStateFunc, readSpecificStateFunc, writeSpecificStateFunc]) => {
    let renderer = getRenderState(state).renderer

    state = setSceneState(state, {
        ...getSceneState(state),
        camera: {
            ...getSceneState(state).camera,
            orbitControls: return_(new OrbitControls(new PerspectiveCamera(), renderer.domElement)),
            trackballControls: return_(new TrackballControls(new OrthographicCamera(), renderer.domElement)),
        }
    })

    _bindResizeEvent(getTrackballControls(state))

    return initThirdPersonControls(state, [getAbstractStateFunc, setAbstractStateFunc, readSpecificStateFunc, writeSpecificStateFunc])
}

let _updateCurrentControls = (state: state) => {
    let controls = getCurrentControls(state)

    controls.update()

    return setCurrentControls(state, controls)
}

let _updateCurrentCamera = (state: state) => {
    let camera = getCurrentCamera(state)

    if ((camera as PerspectiveCamera).isPerspectiveCamera) {
        let perspectiveCamera = (camera as PerspectiveCamera)

        perspectiveCamera.aspect = getWidth() / getHeight()
        perspectiveCamera.updateProjectionMatrix()
    }
    else if ((camera as OrthographicCamera).isOrthographicCamera) {
        let orthographicCamera = (camera as OrthographicCamera)

        orthographicCamera.updateProjectionMatrix()
    }
    else {
        throw new Error("unknown camera type")
    }

    camera.updateMatrixWorld()

    return setCurrentCamera(state, camera)
}

let _getCurrentCameraVelocity = (state: state) => {
    let controls = getCurrentControls(state)

    if (!(controls instanceof OrbitControls)) {
        throw new Error("err")
    }

    let controlRotationAngle = controls.getAzimuthalAngle()

    let velocity = new Vector3(0, 0, 0)

    velocity.applyAxisAngle(Object3D.DEFAULT_UP, controlRotationAngle)

    return velocity
}

let _handleCurrentCameraCollision = (state: state) => {
    let velocity = _getCurrentCameraVelocity(state)

    let scene = getCurrentScene(state)

    let terrainGeometry = getExn(findTerrainGeometry(scene))


    let newPosition = getCurrentCamera(state).position.clone().add(velocity)

    let height = terrainGeometry.getHeightAtCoordinates(newPosition.x, newPosition.z)

    const heightScale = 1.05

    if (newPosition.y <= height) {
        newPosition.setY(height * heightScale)
    }

    getCurrentCamera(state).position.copy(newPosition)

    return state

    // let scene = getCurrentScene(state)

    // let terrainGeometry = getExn(findTerrainGeometry(scene))


    // let position = getCurrentCamera(state).position

    // let height = terrainGeometry.getHeightAtCoordinates(position.x, position.z)

    // if (position.y <= height) {
    //     position.setY(height * 1.1)
    // }

    // // getCurrentCamera(state).position.copy(newPosition)

    // return state

}

export let update = (state: state) => {
    state = _updateCurrentControls(state)

    // state = _handleCurrentCameraCollision(state)

    state = _updateCurrentCamera(state)

    return Promise.resolve(state)
}

export let dispose = (cameraState: camera) => {
    return {
        ...cameraState,
        currentCamera: null,
        currentControls: null
    }
}


let _handleResize = (trackballControls: TrackballControls) => {
    trackballControls.handleResize()
}