import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

const zeroStart = { lat: 0, lng: 0 }

const initialState = {
  origin: zeroStart,
  center: zeroStart,
  countries: {
    ca: {flag: '/assets/flags/ca.svg', name: 'Canada', code: 'CA', coords: {lat: 61.6754281, lng: -100.4194553}, zoom: 4},
    us: {flag: '/assets/flags/us.svg', name: 'United States', code: 'US', coords: {lat: 38.3260721, lng: -96.8142871}, zoom: 5},
    gb: {flag: '/assets/flags/gb.svg', name: 'Great Britain', code: 'GB', coords: {lat: 54.166956, lng: -1.743242}, zoom: 6},
    de: {flag: '/assets/flags/de.svg', name: 'Deutschland', code: 'DE', coords: {lat: 51.101557, lng: 10.411623}, zoom: 6},
    au: {flag: '/assets/flags/au.svg', name: 'Australia', code: 'AU', coords: {lat: -25.545303, lng: 135.251798}, zoom: 5},
  },
  years: [ '1906', '1910', '1916', '1920', '1925', '1929', '1930', '1931', '1933', '1934', '1936', '1937', '1939', '1941', '1942', '1943', '1944', '1945', '1946', '1947', '1948', '1949', '1950', '1951', '1952', '1953', '1954', '1955', '1956', '1957', '1958', '1959', '1960', '1961', '1962', '1963', '1964', '1965', '1966', '1967', '1968', '1969', '1970', '1971', '1972', '1973', '1974', '1975', '1976', '1977', '1978', '1979', '1980', '1981', '1982', '1983', '1984', '1985', '1986', '1987', '1988', '1989', '1990', '1991', '1992', '1993', '1994', '1995', '1996', '1997', '1998', '1999', '2000', '2001', '2002', '2003', '2004', '2005', '2006', '2007', '2008', '2009', '2010', '2011', '2012', '2013', '2014' ],
  shapes: [ "changed", "changing", "chevron", "cigar", "circle", "cone", "crescent", "cross", "cylinder", "delta", "diamond", "disk", "dome", "egg", "fireball", "flare", "flash", "formation", "hexagon", "light", "other", "oval", "pyramid", "rectangle", "round", "sphere", "teardrop", "triangle", "unknown" ],
  states: { "AL": "Alabama", "AK": "Alaska", "AS": "American Samoa", "AZ": "Arizona", "AR": "Arkansas", "CA": "California", "CO": "Colorado", "CT": "Connecticut", "DE": "Delaware", "DC": "District Of Columbia", "FM": "Federated States Of Micronesia", "FL": "Florida", "GA": "Georgia", "GU": "Guam", "HI": "Hawaii", "ID": "Idaho", "IL": "Illinois", "IN": "Indiana", "IA": "Iowa", "KS": "Kansas", "KY": "Kentucky", "LA": "Louisiana", "ME": "Maine", "MH": "Marshall Islands", "MD": "Maryland", "MA": "Massachusetts", "MI": "Michigan", "MN": "Minnesota", "MS": "Mississippi", "MO": "Missouri", "MT": "Montana", "NE": "Nebraska", "NV": "Nevada", "NH": "New Hampshire", "NJ": "New Jersey", "NM": "New Mexico", "NY": "New York", "NC": "North Carolina", "ND": "North Dakota", "MP": "Northern Mariana Islands", "OH": "Ohio", "OK": "Oklahoma", "OR": "Oregon", "PW": "Palau", "PA": "Pennsylvania", "PR": "Puerto Rico", "RI": "Rhode Island", "SC": "South Carolina", "SD": "South Dakota", "TN": "Tennessee", "TX": "Texas", "UT": "Utah", "VT": "Vermont", "VI": "Virgin Islands", "VA": "Virginia", "WA": "Washington", "WV": "West Virginia", "WI": "Wisconsin", "WY": "Wyoming" },
  provinces: { "AB": "Alberta", "BC": "British Columbia", "MB": "Manitoba", "NB": "New Brunswick", "NL": "Newfoundland and Labrador", "NT": "Northwest Territories", "NS": "Nova Scotia", "NU": "Nunavut", "ON": "Ontario", "PE": "Prince Edward Island", "QC": "Quebec", "SK": "Saskatchewan", "YT": "Yukon Territory" },
  status: { fetching: false},
  selectedCountry: null,
  ufoLocations: { active: null, hold: null},
}

export const fetchLocations = createAsyncThunk(
  'map/fetchLocations',
  async (query) => {
    let url = `api/ufo-locations?`
    const queryStrArray = (obj) => url + Object.keys(obj).map(uniqueKey => `${uniqueKey}=${obj[uniqueKey]}`).join('&')
    const response = await fetch(queryStrArray(query))
    const data = await response.json()
    if (!response.ok) throw new Error(`${data.msg}`)
    return data
  }
)

export const mapSlice = createSlice({
  name: 'map',
  initialState,
  reducers: {
    setSelectedCountry: (state, action) => {
      state.selectedCountry = action.payload.code.toLowerCase()
      state.center = action.payload.coords
    },
    resetSlice: (state, action) => {
      state.center = zeroStart
      state.selectedCountry = null
      state.ufoLocations.hold = { ...state.ufoLocations.active}
      state.ufoLocations.active = null
    },
  },
  extraReducers(builder) {
    builder
    .addCase(fetchLocations.pending, (state, action) => {
      state.status = { fetching: true }
    })
    .addCase(fetchLocations.fulfilled, (state, action) => {
      state.status.response = action.payload.msg
      state.ufoLocations.active = action.payload.data
      state.status.fetching = false
    })
    .addCase(fetchLocations.rejected, (state, action) => {
      state.status.response = action.error.message
      state.status.fetching = false
    })
  }
})

export const {
  setSelectedCountry,
  resetSlice,
} = mapSlice.actions

export default mapSlice.reducer
