import React, { Suspense, useRef, useEffect, useMemo } from "react"
import { useCallback } from "react"
import { Canvas, useFrame, useResource, useThree } from "react-three-fiber"
import { sRGBEncoding, ACESFilmicToneMapping, Vector3 } from 'three'
import Church from "./Church"
import Cross from './Cross'
import Floor from "./Floor"
function MyScene () {
  const DeviceOrientationControls = require('three/examples/jsm/controls/DeviceOrientationControls').DeviceOrientationControls
  const ShaderCubeChrome = require('../shaders/ShaderCubeChrome').ShaderCubeChrome
  const MapControls = require("three/examples/jsm/controls/OrbitControls").MapControls
  const controls = useRef()
  const gyro = useRef()
  const chroma = useResource()
  const mapTarget = useRef()
  const { gl, camera, scene } = useThree()


  useMemo(() => {
    let myChroma = chroma.current = new ShaderCubeChrome({ renderer: gl })
    chroma.current.compute({ time: 1 })

    scene.background = myChroma.out.envMap
  }, [gl])
  useFrame(() => {
    if (chroma.current) {
      chroma.current.compute({ time: window.performance.now() / 1000 })
    }
  })

  useEffect(() => {
    let panSpeed = 5
    camera.position.x = 0
    camera.position.y = 200
    camera.position.z = 140

    gyro.current = new DeviceOrientationControls(camera, gl.domElement)

    controls.current = new MapControls(camera, gl.domElement)
    controls.current.maxDistance = 300
    controls.current.minDistance = 30
    controls.current.enabled = true
    controls.current.enablePan = true
    controls.current.enableRotate = false

    controls.current.panSpeed = 1024 / window.innerHeight * panSpeed
    controls.current.enableDamping = true
    controls.current.enableZoom = false
    controls.current.screenSpacePanning = false

    controls.current.target.y = camera.position.y * 1.0
    controls.current.target.z = camera.position.z * 0.1

    mapTarget.current = {
      latest: new Vector3(),
      last: new Vector3(),
      delta: new Vector3()
    }

    camera.near = 0.1
    camera.far = 10000
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()

    let onResize = () => {
      controls.current.panSpeed = 1024 / window.innerHeight * panSpeed

      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
    }
    window.addEventListener('resize', onResize)

    let onWheel = (evt) => {
      let rate = 0.74
      evt.preventDefault();
      if (evt.ctrlKey) {
        controls.current.target.y += -evt.deltaY * rate;
        controls.current.target.z += evt.deltaY * rate;
        camera.position.z += evt.deltaY * rate
      }
      camera.position.z += evt.deltaY * rate
      controls.current.target.z += evt.deltaY * rate

      camera.position.x += evt.deltaX * rate
      controls.current.target.x += evt.deltaX * rate
    }
    window.addEventListener('wheel', onWheel, { passive: false })

    return () => {
      controls.current.dispose()
      window.removeEventListener('resize', onResize)
      window.removeEventListener('wheel', onWheel)
    }
  })

  useFrame(() => {
    gyro.current.update()
    controls.current.update()
  })

  let onClickFloor = (e) => {
    mapTarget.current.latest.copy(e.point)
    mapTarget.current.delta.copy(mapTarget.current.latest).sub(mapTarget.current.last)
    mapTarget.current.last.copy(mapTarget.current.latest)
  }

  return (
    <scene>
      <hemisphereLight skyColor={'#000000'} groundColor={'#ffffff'} intensity={0.35} position={[0, 50, 0]} />
      <directionalLight
        intensity={0.35}
        position={[-10, 20, 18]}
      />

      <Suspense fallback={null}>
        <Cross chroma={chroma.current}></Cross>
      </Suspense>
      <Suspense fallback={null}>
        <Church chroma={chroma.current}></Church>
        <Floor onClickFloor={onClickFloor}></Floor>
      </Suspense>
    </scene>
  )
}

export function ChurchCanvas () {
  const mouse = useRef({ x: 0, y: 0 })

  useEffect(() => {
    mouse.current.x = window.innerWidth / 2
    mouse.current.y = window.innerHeight / 2
  })

  return (
    <Canvas
      shadowMap
      pixelRatio={[1.2, 2.0]}
      // onPointerMove={(e) => ( mouse.current = getMousePos(e)) }}
      // onTouchMove={(e) => { mouse.current = getFirstTouchPos(e); }}
      // onTouchStart={(e) => { mouse.current = getFirstTouchPos(e); }}

      onCreated={({ gl }) => {
        gl.toneMapping = ACESFilmicToneMapping
        gl.outputEncoding = sRGBEncoding
      }}
    >

      <MyScene dispose={null} mouse={mouse}></MyScene>

    </Canvas>
  )
}
