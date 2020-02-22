export default class Utils {
  static buildRequestUrl(apiEndpoint) {
    const baseUrl = 'https://api-reach.herokuapp.com';
    // const baseUrl = 'http://localhost:3001';
    return baseUrl + apiEndpoint;
  }
}
