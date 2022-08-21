const { MongoClient } = require("mongodb")


export default async (req, res) => {
  const { query } = req
  const { limit, year, ...restQuery } = query
  const queryKeys = Object.keys(query)

  const client = new MongoClient(process.env.MONGO_URI)
  const db = client.db('ufo-sightings')
  const locations = db.collection('locations')

  if (queryKeys.length === 0) return res.status(400).json({ msg: `u need to pass at least one value. country||state||year||shape` })

  try {
    const mongoLimit = limit ? +limit : 10
    const mongoQuery = restQuery
    
    // locations.dropIndexes()
    // locations.createIndex({'date posted': 'text'})
    if (year) mongoQuery['$text'] = { '$search': year }
    
    const result = await locations.find(mongoQuery).limit(mongoLimit).toArray()
    await client.close()

    // RANDOMIZE RESULT
      
    if (result.length === 0) return res.status(404).json({ msg: `There are no UFOs with the given values.`, query })
    return res.status(200).json({ msg: `Success.`, query, qty: { request: mongoLimit, retured: result.length }, result })
  }
  catch (err) {
    return res.status(404).json({ msg: 'error', err })
  }
}
