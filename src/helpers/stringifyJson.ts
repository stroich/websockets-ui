export function stringifyJson(data) {
  try {
    return JSON.stringify({ ...data, data: JSON.stringify(data.data) });
  } catch (error) {
    console.error('Error:', error);
    return;
  }
}
