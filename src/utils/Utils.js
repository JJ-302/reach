export default class Utils {
  static buildRequestUrl(apiEndpoint) {
    // const baseUrl = 'https://reach-260801.appspot.com'
    const baseUrl = 'http://localhost:3001';
    return baseUrl + apiEndpoint;
  }
}
