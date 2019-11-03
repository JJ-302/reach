import Moment from 'moment'

export default class Utils {
  static buildRequestUrl(apiEndpoint) {
    const baseUrl = 'http://localhost:3001'
    return baseUrl + apiEndpoint
  }

  static dateRangeStart() {
    return Moment(new Date()).subtract(2, 'weeks')
  }

  static dateRangeEnd() {
    return Moment('2020/4/1', 'YYYY/MM/DD')
  }
}
