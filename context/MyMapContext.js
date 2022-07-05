import { createContext, useState, useEffect } from 'react'

const MyMapContext = createContext()

const MyMapContextProvider = ({ children }) => {

    const center = { lat: 37.7562, lng: -122.4412 }
    const [ map, setMap ] = useState(null)
    const [ movies, setMovies ] = useState(null)
    const [ holdMovies, setHoldMovies ] = useState(null)
    const [ selectedInSearch, setSelectedInSearch ] = useState(null)
    const [ filteredMovies, setFilteredMovies ] = useState(false)

    useEffect(() => {
        // query here
        if (selectedInSearch) {
            // console.log(selectedInSearch)
            const { param, value } = selectedInSearch
            const res = holdMovies.filter(movie => movie[param] === value)
            console.log(res)
            setFilteredMovies(true)
            if (res.length === 1) {
                setMovies(res)
                map.panTo({
                    lat: res[0].latitude,
                    lng: res[0].longitude
                })
                map.setZoom(17)
            } else {
                setMovies(res)
                map.panTo(center)
                map.setZoom(11)
            }
        }
    }, [selectedInSearch])

    const data = {
        center,
        map,
        setMap,
        movies,
        setMovies,
        holdMovies,
        setHoldMovies,
        setSelectedInSearch,
        filteredMovies,
    }

    return (
        <MyMapContext.Provider value={ data }>
            {children}
        </MyMapContext.Provider>
    )
}

export { MyMapContextProvider }
export default MyMapContext
