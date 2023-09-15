

export default defineEventHandler(async (event) => {
  console.log("REVERSE GEOCODE GET ROUTE");

  const query = getQuery(event);

  if (!query) return false;

  const db = openDatabase();


  console.log("geocode function");
  console.log(query.point);

  try {
    const result = await geocoder.reverse(query.point.split(","));
    if (result.length > 0) {
      console.log(result);
      return result;
    } else {
      return null;
    }
  } catch (err) {
    return console.error(err.message);
  }
});
