import { MyMapContextProvider } from '../context/MyMapContext'
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  return (
    <MyMapContextProvider>
      <Component {...pageProps} />
    </MyMapContextProvider>
  )
}

export default MyApp
