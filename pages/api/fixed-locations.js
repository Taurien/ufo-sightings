import { geoPromisesTEST, moviesTest } from "../../fixedData.js/locationsData"

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const result = []

    // iterate pAll
    geoPromisesTEST.forEach((fullfilledPromise, index) => {
      const { formattedAddress, latitude, longitude, extra, city, country, countryCode } = fullfilledPromise[0]

      if (city === 'San Francisco') {
        const data = {
          ...moviesTest[index],
          year: moviesTest[index].release_year,
          production: moviesTest[index].production_company,
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
    
    return res.status(200).json({
      status: 'Success',
      result
    })
  }
    return res.status(404).json({ err: 'Method Not Allowed' })
}