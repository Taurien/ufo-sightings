https://ufo-sightings-taurien.vercel.app/

# UFO Sightings 🛸

Based on a dataset of UFO reports originally compiled by the [National UFO Reporting Center (NUFORC)](https://nuforc.org/) and later made publicly accessible by a third party on [Kaggle](https://www.kaggle.com/datasets/NUFORC/ufo-sightings) (last updated in 2019), I set out to build an interactive platform where these sightings can be **searched, filtered, and visualized** on Google Maps.

This dataset contains sightings that can be filtered by country:

| Country                | Sightings |
| ---------------------- | --------- |
| United States (**us**) | 65.114    |
| Canada (**ca**)        | 3.000     |
| Great Britain (**gb**) | 1.905     |
| Australia (**au**)     | 538       |
| Deutschland (**de**)   | 105       |

To power this project, I downloaded the CSV file and hosted it in **MongoDB** to allow dynamic queries and efficient retrieval of data through an API.

## API Reference

### Get UFO's
```http
  GET /api/ufo-locations?country=<value>&state=<value>&year=<value>&shape=<value>&limit=<value>
```

* All parameters are optional, but it is **required** to pass **at least one filter** to make a request and retrieve sightings.
Accepted filters: **country** || **state** || **year || **shape**

```http
  GET /api/ufo-locations?shape=<value>
```

* `limit` defaults to **10** if not provided.
* Each request returns **random UFO sightings** based on the applied filters.

### Demo

https://ufo-sightings-taurien.vercel.app/api/ufo-locations?country=us&state=wi&year=2004&shape=light&limit=30

This request asks for **30 UFO sightings** in the **US (Wisconsin)** during **2004** with a **light** shape. However, only **14 sightings** were actually recorded, so that’s all the API returns.


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

- **Frontend:** React, Next.js, Redux, TailwindCSS, MUI  
- **Maps & Visualization:** react-google-maps, overlapping-marker-spiderfier  
- **Backend & Database:** Node.js, MongoDB  

---

## Disclaimer ⚠️

- This project was built **for fun, learning, and experimentation**.  
- The UFO sighting dataset does **not** belong to me.  
- Reports were originally compiled by the [National UFO Reporting Center (NUFORC)](https://nuforc.org/).  
- The dataset was later made **publicly accessible by a third party** on [Kaggle](https://www.kaggle.com/datasets/NUFORC/ufo-sightings).  

---


