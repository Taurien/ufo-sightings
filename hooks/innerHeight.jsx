import { useState, useEffect } from "react"


export const useInnerHeight = () => {
    // if (typeof window !== 'undefined') {

        const [innerHeight, setInnerHeight] = useState(0)

        useEffect(() => {
            const handleResize = () => setInnerHeight(window.innerHeight)

            if (innerHeight == 0) handleResize()
            window.addEventListener('resize', handleResize)

            return () => window.removeEventListener('resize', handleResize)
        }, [])

        return innerHeight
    // }
}
