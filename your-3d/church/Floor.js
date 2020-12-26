export default function Floor ({ onClickFloor }) {
  return (
    <mesh position-z={-4000} onClick={onClickFloor}>
      <boxBufferGeometry args={[6000, 1, 12000, 2, 2, 2]}></boxBufferGeometry>
      <meshStandardMaterial transparent opacity={1} color={'#bababa'}></meshStandardMaterial>
    </mesh>
  )
}