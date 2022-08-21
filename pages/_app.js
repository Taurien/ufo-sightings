import { reduxWrapper } from '../redux/store'
import { MapContextProvider } from '../context/MapContext'
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  return (
    <MapContextProvider>
      <Component {...pageProps} />
    </MapContextProvider>
  )
}

export default reduxWrapper.withRedux(MyApp)
