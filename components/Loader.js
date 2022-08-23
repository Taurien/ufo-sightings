import { SuperBalls } from '@uiball/loaders'


const Loader = () => {
  return (
    <div className='grid grid-flow-row justify-items-center gap-2'>
      <SuperBalls 
        size={45}
        speed={1.4} 
        color='black'
        // color="#8BC34A"
      />
      <p className='w-max'>Fetching locations</p>
    </div>
  )
}

export default Loader
