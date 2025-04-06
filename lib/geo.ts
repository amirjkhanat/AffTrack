export async function getGeoData(ip: string) {
  try {

    // Fetch geolocation data using the IP address
    const geoResponse = await fetch(`http://ip-api.com/json/${ip}`);
    const geoData = await geoResponse.json();

    if (geoData.status === 'success') {
      return {
        country: geoData.country,
        region: geoData.regionName,
        city: geoData.city,
      };
    } else {
      return {
        country: null,
        region: null,
        city: null,
      };
    }
  } catch (error) {
    console.error('Error fetching geolocation data:', error);
    return {
      country: null,
      region: null,
      city: null,
    };
  }
}
