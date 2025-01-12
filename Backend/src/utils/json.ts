
const convertToJSON = (jsonString: string) => {
  try {
    const jsonObject = JSON.parse(jsonString);  // Convert string to JSON
    return jsonObject;  // Send the parsed JSON back to the client
  } catch (error) {
    return { error: 'Invalid JSON string' };
  }
}