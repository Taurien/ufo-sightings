import { createContext, useState, useEffect } from 'react'

const MyMapContext = createContext()

const MyMapContextProvider = ({ children }) => {

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
                // pan to location
            } else {
                setMovies(res)
                // show locations
            }
        }
    }, [selectedInSearch])

    const data = {
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
