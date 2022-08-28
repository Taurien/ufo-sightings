# UFO Sightings 🛸

According to the dataset of UFO reports that [NUFORC](https://nuforc.org/) has on [Kaggle](https://www.kaggle.com/datasets/NUFORC/ufo-sightings) (last updated on 2019). I wanted to build a place where these sightings can be searched, filtered and highlighted on the Google map.

This dataset contains sightings that can be filtered by country:

| Country                | Sightings |
| ---------------------- | --------- |
| United States (**us**) | 65.114    |
| Canada (**ca**)        | 3.000     |
| Great Britain (**gb**) | 1.905     |
| Australia (**au**)     | 538       |
| Deutschland (**de**)   | 105       |

In order to build the project I downloaded the csv file and hosted it in MongoDB to allow me to make requests.
## API Reference

### Get UFO's
```http
  GET /api/ufo-locations?country=<value>&state=<value>&year=<value>&shape=<value>&limit=<value>
```

* All parameters are optional, but it is **required** to pass **at least one value** to make a request and get the ufo sightings. ( **country** || **state** || **year** || **shape** )

```http
  GET /api/ufo-locations?shape=<value>
```

* Limit by default is 10.

* Each request returns random ufo sightings

### Demo

https://ufo-sightings-taurien.vercel.app/api/ufo-locations?country=us&state=wi&year=2004&shape=light&limit=30


Request that returns 14 items because these were all the reported sightings in the **US** in **2004** with the shape of a **light**, even though I requested 30.

```
{
  "success": true,
  "msg": "Success.",
  "qty": {
    "request": 30,
    "retured": 14
  },
  "data": [
    {
      "_id": "62fdddcf66707a96a2377c1e",
      "datetime": "3/19/2004 01:00",
      "city": "laona",
      "state": "wi",
      "country": "us",
      "shape": "light",
      "duration (seconds)": 900,
      "duration (hours/min)": "15 minutes",
      "comments": "Round&#44 bright&#44 white light that followed us for approx 10 miles(NOT THE MOON)",
      "date posted": "6/4/2004",
      "latitude": 45.5647222,
      "longitude": -88.6738889
    },
    ...
  ]
}
```

## Screenshots

![Desktop Screenshot](https://firebasestorage.googleapis.com/v0/b/portfolio-mc.appspot.com/o/project-imgs%2Fufo-sightings-3.jpg?alt=media&token=0f30c5e7-2f4f-43ed-b7ce-70a0ad59e6f2)
<img src="https://firebasestorage.googleapis.com/v0/b/portfolio-mc.appspot.com/o/project-imgs%2Fufo-sightings-6.jpg?alt=media&token=eec1f70c-a766-4507-b89b-3a3434fffd21" alt="Mobile Screenshot" width="200"/>


## Tech Stack

React - 
NextJS -
Redux -
TailwindCSS -
MUI -
react-google-maps -
overlapping-marker-spiderfier -
Node -
MongoDB

