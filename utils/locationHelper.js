require('dotenv').config();
const axios = require('axios');

const apiKey = process.env.GEOCODING_API;

async function getCityNameFromLatLong(lat, lng) {
  // console.log(
  //   `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}&language=en&region=in`
  // );

  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}&language=en&region=in`;

  try {
    const response = await axios.get(url);
    const results = response.data.results;

    if (results.length > 0) {
      for (const component of results[0].address_components) {
        if (
          component.types.includes('locality') ||
          component.types.includes('administrative_area_level_2') ||
          component.types.includes('administrative_area_level_3')
        ) {
          return component.long_name;
        }
      }
    }
    return null;
  } catch (error) {
    console.error('getCityNameFromLatLong error:', error);
    return null;
  }
}

async function convertCityToEnglish(cityName) {
  const url = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(
    cityName
  )}&inputtype=textquery&fields=name&key=${apiKey}&language=en`;

  try {
    const response = await axios.get(url);
    const candidates = response.data.candidates;
    //
    if (candidates.length > 0 && candidates[0].name) {
      return candidates[0].name;
    }

    return cityName;
  } catch (error) {
    console.error('convertCityToEnglish error:', error);
    return cityName;
  }
}

module.exports = {
  getCityNameFromLatLong,
  convertCityToEnglish,
};
