const NodeGeocoder = require('node-geocoder')

const options = {
  provider: 'google',
  apiKey: process.env.GOOGLE_API_KEY, // for Mapquest, OpenCage, Google Premier
}

const geocoder = NodeGeocoder(options)

export default async function handler(req, res) {
  if (req.method === 'GET' && process.env.PASS) {
    try {
      const result = []

      // geoReverse promises
      const geoPromises = []

      // fetch movies from SF DB 
      // https://data.sfgov.org/resource/yitu-d5am.json?$$app_token=${}&$where=locations=locations&$limit=10
      const fetchMovies = await fetch(`https://data.sfgov.org/resource/yitu-d5am.json?$where=locations=locations&$limit=${4}`)
      const moviesResponse = await fetchMovies.json()
      
      // for each movie request its coords
      moviesResponse.forEach(movie => {
        const location = movie.locations

        const geoRes = geocoder.geocode({
          address: location,
          country: 'United States',
          countryCode: 'US',
          city: 'San Francisco',
        })

        geoPromises.push(geoRes)
      })

      // promise all
      const pAll = await Promise.all(geoPromises)

      // iterate pAll
      pAll.forEach((fullfilledPromise, index) => {
        // console.log('---------------', index)
        // console.log(fullfilledPromise[0])
        // console.log(moviesTest[index])
        // console.log('---------------')
        const { formattedAddress, latitude, longitude, extra, city, country, countryCode } = fullfilledPromise[0]

        if (city === 'San Francisco') {
          const data = {
            ...moviesTest[index],
            formattedAddress,
            latitude,
            longitude,
            extra,
            city,
            country,
            countryCode
          }
    
          result.push(data)
        } else return
      })

      // console.log(result)
      return res.status(200).json({
        status: 'Success',
        result,
      })

    } catch (error) {
      return res.status(404).json({ err: 'Something went wrong :C', error })        
    }
  }
    return res.status(404).json({ err: 'Method Not Allowed' })
}