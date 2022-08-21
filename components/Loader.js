import { SuperBalls } from '@uiball/loaders'


const Loader = () => {
  return (
    <div className='aspect-square absolute z-10 top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center p-6 bg-white rounded'>
      <div className='grid grid-flow-row justify-items-center gap-2'>
        <SuperBalls 
          size={45}
          speed={1.4} 
          color='black'
          // color="#8BC34A"
        />
        <p className='w-max'>Something creative</p>
      </div>
    </div>
  )
}

export default Loader
