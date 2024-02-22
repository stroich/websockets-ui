export function parseJson(data: string) {
  try {
    const result = JSON.parse(data);
    result.data = JSON.parse(result.data);
    return result;
  } catch (error) {
    return JSON.parse(data);
  }
}
