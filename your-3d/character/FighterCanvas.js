// Codrops article: https://tympanus.net/codrops/2019/10/14/how-to-create-an-interactive-3d-character-with-three-js/
// Originally by Kyle Wetton @KyleWetton
// Brought to React by https://github.com/RubLo
// https://spectrum.chat/react-three-fiber/general/skinned-mesh~de461f24-df23-43d0-8e08-dca7fe3b93f7

import React, { Suspense, useRef, useEffect, useMemo, useState } from "react"
import { Canvas, useFrame, useResource, useThree } from "react-three-fiber"
import * as THREE from 'three'
import { Swat } from "./Swat"
import { getFirstTouchPos, getMousePos } from "./utils"
import { useDrag } from 'react-use-gesture'
import EventEmitter from 'events'
import { BackSide } from "three"
// import { MiniEngine } from './MiniEngine'
// import "./styles.css"

function TouchLocker () {
  const three = useThree()
  three.gl.domElement.addEventListener('touchstart', (ev) => {
    ev.preventDefault()
  })
  three.gl.domElement.addEventListener('touchmove', (ev) => {
    ev.preventDefault()
  })

  return (
    <>
    </>
  )
}

function ShadowReceivePlane({ map, ...props }) {
  return (
    <group>
      <mesh {...props} receiveShadow renderOrder={2}>
        <planeBufferGeometry args={[500, 500, 1, 1]} />
        <shadowMaterial transparent opacity={0.5} />
      </mesh>

      <mesh rotation-x={Math.PI * -0.5} position-y={-10 - 0.1} renderOrder={1}>
        <planeBufferGeometry args={[500, 500, 1, 1]} />
        <meshBasicMaterial map={map} color="#bababa" transparent opacity={0.5} />
      </mesh>
    </group>
  )
}

// function Camera (props) {
//   const ref = useRef()
//   const { setDefaultCamera } = useThree()
//   // Make the camera known to the system
//   useEffect(() => {
//     setDefaultCamera(ref.current)
//   })
//   useEffect(() => {
//     ref.current.near = 0.01
//     ref.current.aspect = window.innerWidth / window.innerHeight
//     ref.current.updateProjectionMatrix()
//     window.addEventListener('resize', () => {
//       ref.current.aspect = window.innerWidth / window.innerHeight
//       ref.current.updateProjectionMatrix()
//     })
//   })
//   // Update it every frame
//   useFrame(() => {
//     ref.current.updateMatrix()
//     ref.current.updateMatrixWorld()
//     ref.current.updateWorldMatrix()
//   })

//   return <perspectiveCamera ref={ref} {...props} />
// }

export function MyScene ({ mouse, ...props }) {
  let ShaderCubeChrome = require('../shaders/ShaderCubeChrome').ShaderCubeChrome
  const OrbitControls = require("three/examples/jsm/controls/OrbitControls").OrbitControls
  const controls = useRef()
  const { camera, gl } = useThree()
  const scene = useRef()
  const bus = useMemo(() => new EventEmitter())
  const d = 15

  const [charPos] = useState([0 * 6.4, -10, 0])

  useEffect(() => {
    camera.position.x = 0
    camera.position.y = 5
    camera.position.z = 30
    camera.near = 0.01
    camera.far = 10000
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()

    controls.current = new OrbitControls(camera, gl.domElement)
    controls.current.maxDistance = 300
    controls.current.minDistance = 5
    controls.current.enabled = true
    // controls.current.enablePan = true
    // controls.current.enableRotate = false

    // controls.current.panSpeed = 1024 / window.innerHeight * panSpeed
    controls.current.enableDamping = true
    // controls.current.enableZoom = false
    // controls.current.screenSpacePanning = false

    let onHeadPositionUpdate = ({ position }) => {
      controls.current.target.lerp(position, 0.05)
    }
    bus.on('swat-head', onHeadPositionUpdate)

    return () => {
      bus.off('swat-head', onHeadPositionUpdate)
      controls.current.dispose()
    }
  })

  useFrame(() => {
    controls.current.update()
  })

  //

  // let onReadySwat = useMemo(() => {
  //   return () => {
  //     let lookAt = new THREE.Vector3()
  //
  // item.getWorldPosition(lookAt)
  //     controls.current.target.copy(lookAt)
  //     controls.current.update()
  //   }
  // })

  // const engine = useMemo(() => {
  //   return new MiniEngine({ name: 'Small' })
  // })

  const chroma = useResource()

  useMemo(() => {
    chroma.current = new ShaderCubeChrome({ renderer: gl })
    chroma.current.compute({ time: Math.PI * 0.4 })
  }, [gl])

  return (
    <scene ref={scene}>
      {/* <Camera position={[0, 0, 35]} /> */}

      <hemisphereLight skyColor={'#ffffff'} groundColor={'#000000'} intensity={0.2} position={[0, 50, 0]} />

      <directionalLight
        castShadow
        intensity={0.2}
        position={[-10, 20, 18]}

        shadow-camera-left={d * -1}
        shadow-camera-bottom={d * -1}
        shadow-camera-right={d}
        shadow-camera-top={d}
        shadow-camera-near={0.1}
        shadow-camera-far={1500}
      />

      <ShadowReceivePlane map={chroma.current.out.texture} rotation={[-0.5 * Math.PI, 0, 0]} position={[0, -10, 0]} />

      {/* <mesh position={[0, 0, -500]}>
        <planeBufferGeometry args={[500, 500]} />
        <meshBasicMaterial color={'#ffffff'} transparent opacity={1.0} map={chroma.current.out.texture} />
      </mesh> */}

      {/* <mesh position={[0, 3, -21]}>
        <circleBufferGeometry args={[16, 64]} />
        <meshBasicMaterial envMap={chroma.current.out.envMap} color={'#106131'} transparent opacity={1.0} />
      </mesh>

      <mesh position={[0, 3, -20]}>
        <circleBufferGeometry args={[10, 64]} />
        <meshBasicMaterial envMap={chroma.current.out.envMap} color={'#bb1c1c'} transparent opacity={1.0} />
      </mesh> */}

      {/* <mesh position={[0, 0, -21]}>
        <circleBufferGeometry args={[20, 64]} />
        <meshBasicMaterial color={"#ffffff"} />
      </mesh> */}

      <mesh position={[0, 0, 0]}>
        <sphereBufferGeometry args={[250, 64]} />
        <meshBasicMaterial side={BackSide} envMap={chroma.current.out.envMap}  />
      </mesh>

      <TouchLocker></TouchLocker>

      <Suspense fallback={null}>
        <Swat envMap={chroma.current.out.envMap} bus={bus} mouse={mouse} position={charPos} scale={[0.1, 0.1, 0.1]} />
      </Suspense>

      {/* <Suspense fallback={null}>
        <Swat envMap={chroma.current.out.envMap} bus={bus} mouse={mouse} position={[0 * 6.4, -10, -6 + 2]} scale={[0.075, 0.075, 0.075]} />
      </Suspense>

      <Suspense fallback={null}>
        <Swat envMap={chroma.current.out.envMap} bus={bus} mouse={mouse} position={[1 * 6.4, -10, -6 + -2]} scale={[0.075, 0.075, 0.075]} />
      </Suspense> */}
    </scene>
  )
}
let css = v => v[0]

export function FighterCanvas () {
  const mouse = useRef({ x: 0, y: 0 })

  useEffect(() => {
    mouse.current.x = window.innerWidth / 2
    mouse.current.y = window.innerHeight / 2
  })

  return (
    <>
    <style>
      {css`
      #__next {
        height: 100%;
      }
      .mounter, html, body{
        height: 100%;
      }
      `}
    </style>
    <Canvas
      shadowMap
      pixelRatio={[1.25, 2.5]}

      onPointerMove={(e) => (mouse.current = getMousePos(e))}
      onTouchMove={(e) => { mouse.current = getFirstTouchPos(e); }}
      onTouchStart={(e) => { mouse.current = getFirstTouchPos(e); }}

      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping
        gl.outputEncoding = THREE.sRGBEncoding
      }}

    >
      <MyScene dispose={null} mouse={mouse}></MyScene>

      {/*

      <mesh position-x={-20 / 2} position-y={0} position-z={10} onPointerDown={() => { bus.emit('attack', 'taunt') }}>
        <planeBufferGeometry args={[20, 20]}></planeBufferGeometry>
        <meshBasicMaterial color={'red'}  transparent={true} opacity={0.0}></meshBasicMaterial>
      </mesh>

      <mesh position-x={20 / 2} position-y={0} position-z={10} onPointerDown={() => { bus.emit('attack', 'kick4') }}>
        <planeBufferGeometry args={[20, 20]}></planeBufferGeometry>
        <meshBasicMaterial color={'blue'}  transparent={true} opacity={0.0}></meshBasicMaterial>
      </mesh>

      */}

    </Canvas>
  </>)
}
