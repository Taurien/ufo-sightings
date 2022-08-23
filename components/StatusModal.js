import Loader from "./Loader"

const StatusModal = ({fetching, msg}) => {
  return (
    <div className='aspect-square w-52 absolute z-10 top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center p-6 bg-white rounded'>
      { fetching && <Loader /> }
      {
        msg && <p className=" text-center "> {msg}</p>
      }
    </div>
  )
}

export default StatusModal