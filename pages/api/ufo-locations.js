const { MongoClient } = require("mongodb")


export default async function handler(req, res) {
  const { query } = req
  const { limit, year, ...restQuery } = query
  const queryKeys = Object.keys(query)

  // const client = new MongoClient(process.env.MONGO_URI)MONGODB_URI
  const client = new MongoClient(process.env.MONGODB_URI)
  const db = client.db('ufo-sightings')
  const locations = db.collection('locations')

  if (queryKeys.length === 0) return res.status(400).json({ msg: `u need to pass at least one value. country||state||year||shape` })

  try {
    const mongoLimit = +limit || 10

    // [
    //   { $search: { index: 'ufo-query-idx', text: { query: year, path: 'datetime' } } },
    //   { $match: restQuery },
    //   { $sample: {size: mongoLimit} }
    // ]
    const mongoPipeline = []
    
    if (Object.keys(restQuery).length !== 0) mongoPipeline.unshift({ $match: restQuery })
    if (year) mongoPipeline.unshift({ $search: { index: 'ufo-query-idx', text: { query: year, path: 'datetime' } } })
    mongoPipeline.push({ $sample: {size: mongoLimit} })
    
    const mongoResult = await locations.aggregate(mongoPipeline).toArray()
    await client.close()

    if (mongoResult.length === 0) return res.status(404).send({ success: false, msg: `There are no UFO's with the given values.`, query })
    return res.status(200).send({ success: true, msg: `Success.`, qty: { request: mongoLimit, retured: mongoResult.length }, data: mongoResult })
  }
  catch (err) {
    return res.status(404).send({ success: false, msg: 'Error', err })
  }
}

