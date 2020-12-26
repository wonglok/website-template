import { useEffect, useMemo } from 'react'
import { useLoader } from "react-three-fiber"
import { Color, DoubleSide, MeshStandardMaterial } from 'three'


export default function Church ({ chroma }) {
  // const GLTFLoader = require("three/examples/jsm/loaders/GLTFLoader").GLTFLoader
  const FBXLoader = require('three/examples/jsm/loaders/FBXLoader').FBXLoader
  const scene = useLoader(FBXLoader, "/map-church/church.fbx")

  useMemo(() => {
    scene.traverse((item) => {
      if (item.isLight) {
        item.visible = false
      }

      if (item.isMesh) {
        item.material = new MeshStandardMaterial({ color: new Color('#ffffff'), map: chroma.out.texture, envMap: chroma.out.envMap })
        item.receiveShadow = true
        // item.material = marbelMat

        if (item.name.indexOf('Cube') === 0) {
          // if (chroma) {
          //   item.material.map = chroma.out.texture
          //   item.material.envMap = chroma.out.envMap
          // }
        }

        item.material.side = DoubleSide

        if (item.name === 'floor-1') {
          item.visible = false
        }

        if (item.name === 'floor-2') {
          item.visible = false
        }

        if (item.name.indexOf('Cube012') === 0) {
          // if (chroma) {
          //   item.material.envMap = chroma.out.envMap
          //   item.material.map = chroma.out.texture
          // }

        }
      }
    })
  })

  return (
    <group>
      <primitive object={scene}></primitive>
    </group>
  )
}