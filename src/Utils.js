import Moment from 'moment'

export default class Utils {
  static buildRequestUrl(apiEndpoint) {
    const baseUrl = 'http://localhost:3001'
    return baseUrl + apiEndpoint
  }

  static preparingRequest(action, id, resource) {
    switch (action) {
      case 'new':
        return { uriPattern: `/${resource}`, method: 'POST' }
      case 'edit':
        return { uriPattern: `/${resource}/${id}`, method: 'PATCH' }
      default:
        return null
    }
  }

  static dateRangeStart() {
    return Moment(new Date()).subtract(2, 'weeks').startOf('days')
  }

  static dateRangeEnd() {
    return Moment('2020/4/1', 'YYYY/MM/DD')
  }
}
