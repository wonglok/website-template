import { useEffect, useMemo } from 'react'
import { useLoader } from "react-three-fiber"
import { Color, DoubleSide, MeshStandardMaterial } from 'three'

export default function Cross ({ chroma }) {
  const FBXLoader = require('three/examples/jsm/loaders/FBXLoader').FBXLoader
  const scene = useLoader(FBXLoader, '/map-church/holy-cross.fbx')
  useEffect(() => {
    scene.traverse((item) => {
      if (item.isMesh) {
        item.material = chroma.out.material
      }
    })

    scene.scale.set(1.0, 1.0, 1.0)
  })

  return (
    <group position-y={350} position-z={-3000} rotation-x={Math.PI * 0.5} rotation-y={Math.PI * -0.133333}>
      <primitive object={scene}></primitive>
    </group>
  )
}
