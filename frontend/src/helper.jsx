import moment from 'moment';

const __IS_DEBUG__ = true;

// Misc
export function extractYoutubeId (url) {
  // Ref: https://stackoverflow.com/questions/60120026/how-do-i-parse-youtube-urls-to-get-the-video-id-from-a-url-using-dart
  const regExpr = '.*(?:(?:youtu.be/|v/|vi/|u/w/|embed/)|(?:(?:watch)??v(?:i)?=|&v(?:i)?=))([^#&?]*).*'

  const id = url.match(regExpr)
  if (id) {
    return id[1];
  } else {
    return '';
  }
}

export const getYoutubeThumbnail = (id) => {
  return id ? 'https://i.ytimg.com/vi/' + id + '/hq720.jpg' : ''
}

// image
export function fileToDataUrl (file) {
  const reader = new FileReader();
  const dataUrlPromise = new Promise((resolve, reject) => {
    reader.onerror = reject;
    reader.onload = () => resolve(reader.result);
  });
  reader.readAsDataURL(file);
  return dataUrlPromise;
}

export async function parseJsonFile (file) {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader()
    fileReader.onload = event => resolve(JSON.parse(event.target.result))
    fileReader.onerror = error => reject(error)
    fileReader.readAsText(file)
  })
}

export function getDefaultThumbnail () {
  return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAARMAAAC3CAMAAAAGjUrGAAAAM1BMVEXp7vG6vsHs8fS3u77Fycy+wsXc4eTX3N/h5unT2NrHzM7N0tW1ubzu8/W7v8LBxcjl6uwx8f6JAAADy0lEQVR4nO2c23aDIBBFCQheUf//a6vRpEZuJgXj0LNXH7oaK3WXwXEQGAMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAwGnw9Hz7Et+Ds1ElpxoJaeGsHHqRHlkoKlJ0JbvbKQhRjCSs8FKcY+RuRVKQwqsTlUxShm9f8BGGU53cuvryHeXUyLnTj9++5hC8WJ2kv+2sTkR79Y4y9uuf2papKVYnxcWd8GpV0uj0aaxcnFx9lH04ESeMfLpZ2pLJW/obZzrhcGK2BSdmW3BitkXdyfxYz7mO2hZtJ7yqCznIoVUsXv8h7YSPzZJ2CtENZTQplJ1Mj0CbZ6CuiFUdI+yEt69PhUJGih+6Tni5L7qJJlJbZJ2MZu1A1FHuP2Sd7CPnTh+nLapOKtNIrIyOqhNe28puYvjXThp7KfKAE16FDqDqxF6x7sI1VK26wFCcmRMR6gOTEhG6P+XmJNRPtJrruqL0SSHrxD6ehJxwtZS6vVLIOrFP9wTuO1o95XnCh6qTj/ITrsSRQ8k6Ydbg8YYOV9tDhbO4QNaJbUrd301elXikkHUyZbLGc7F34m4bOI9z2ccUuk6Ybl+liMFXP9GGEme/IuxkfubZXKcofL+vVW8ocYUPZSfThRbdYkUIWftKj3YljjyFtBPGtWplL259UzJfZmoLHPeYQtvJMr0zjsxfnnYrsY4p1J0c+l1H4DzOaByfv5N9XhLsKfk7MfOSkJTsnYSVGANt7k50IHBsZ83ciSsv8faUjJxw821w303YLSUfJ7q+VbvPjit5eRs2Gyfzw0//usTkaODsz5yLk6mXTPTbnhLKS5xSMnGyKJnnMn4j4I3AWeie9e8cnGxmSh/h876S55CShZNtEX8Nn3eG1xyd6Nf59FnKsVQtXyf7qR5R6U96SU5OLG9dVB8pyceJbUJQvpOX5OdElx9dfs5OdMxVgnk4ibtwMgsnvI5oJA8nMceSTJxEHUvycBJ/ETZ5JwnWpZN3Yn1n+H874RJODr4LCidwAic74MQETkzgxAROTODEBE5MzDy2i763VEfcCVOlmr+UMr8J/8DxybpIjKyTlG3BidkWnJhtwYnZFpyYbcGJ2VZBwwkb18SqV6lb4usUyeX3NmTrJozzvy81j7S2Sd8l/4a27XeSFHH5jbqfG4OexvVDx7HjSTqu300Y+91p+BS6NuregKnQjn1gEiBCe6RcBl7K6AUCO0VFRMm89EK1RXKatoq4e+QJJN+N+r4jNQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAzuIHpk8/wVCHmdcAAAAASUVORK5CYII='
}

// debug log
export function doNothing (...args) {

}

export function showDebugLog (msg) {
  if (__IS_DEBUG__) {
    console.log(msg);
  }
}

export function showAlert (msg) {
  alert(msg);
}

// Server
const serverURL = 'http://localhost:5005/'
export async function fetchURL (API, method, body = {}) {
  const token = obtainUserToken() === undefined ? '' : 'Bearer ' + obtainUserToken();
  const options = {
    method,
    headers: {
      'Content-type': 'application/json',
      Authorization: token
    }
  };

  if (method !== 'GET') {
    options.body = JSON.stringify(body);
  }

  let res = await fetch(serverURL + API, options);
  res = await res.json();
  return res;
}

export async function getBookings () {
  const res = await fetchURL('bookings', 'GET')
  return res.bookings
}

export async function getListings () {
  const res = await fetchURL('listings', 'GET')
  return res.listings
}

export async function getListingData (listingId) {
  const res = await fetchURL(`listings/${listingId}`, 'GET', {
    listingid: listingId
  })
  return res.listing
}

// Database
const obtainUserToken = () => localStorage.token;
export const isLogin = (userObj) => {
  if (userObj && userObj.user) {
    return Object.keys(userObj.user).length > 0
  }
  return false
}
export const isOwner = (userObj, userId) => {
  if (userObj && userObj.user && userObj.user.email) {
    return userId === userObj.user.email
  }
  return false
}

export const setupHistoryPoint = (location) => {
  if (location) {
    localStorage.historyPoint = location
  } else {
    localStorage.historyPoint = '/'
  }
}

export const getHistoryPoint = () => localStorage.historyPoint ? localStorage.historyPoint : '/'

// Sort Listing with Status
export async function sortListingWithStatus (list) {
  async function getBookings () {
    const res = await fetchURL('bookings', 'GET')
    return res.bookings
  }

  const bookings = await getBookings()
  const listingWithStatus = []

  for (const booking of bookings) {
    if (booking.owner === localStorage.email) {
      for (const [i, listing] of list.entries()) {
        if (parseInt(booking.listingId) === parseInt(listing.id)) {
          if (booking.status === 'accepted') {
            listing.accepted = true
            listingWithStatus.unshift(listing)
          }
          if (booking.status === 'pending') {
            listing.pending = true
            listingWithStatus.push(listing)
          }
          list.splice(i, 1)
        }
      }
    }
  }

  for (const listing of listingWithStatus) {
    list.unshift(listing)
  }
}

// helper - data manipulation
export const obtainFormattedNumber = (value) => !value ? '-' : value.toString()
export const obtainSvgRatingString = (reviews) => {
  let total = 0;

  reviews.forEach((review) => (total += review.rating.overall))

  const avgRating = (total / reviews.length).toFixed(2)

  if (isNaN(avgRating)) {
    return 'No review';
  } else {
    return avgRating
  }
}

export const obtainSvgRating = (reviews) => {
  let total = 0.0;

  reviews.forEach((review) => (total += review.rating.overall))

  const avgRating = (total / reviews.length).toFixed(2)

  if (isNaN(avgRating)) {
    return 0;
  } else {
    return avgRating
  }
}

export const obtainRatingStats = (reviews) => {
  const overallRating = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  let cleanlinessTotal = 0
  let accuracyTotal = 0
  let communicationTotal = 0
  let locationTotal = 0
  let checkinTotal = 0
  let valueTotal = 0
  const category = {
    cleanliness: 0,
    accuracy: 0,
    communication: 0,
    location: 0,
    checkin: 0,
    value: 0,
  }

  reviews.forEach((review) => {
    overallRating[review.rating.overall] += 1
    cleanlinessTotal += review.rating.cleanliness;
    accuracyTotal += review.rating.accuracy;
    communicationTotal += review.rating.communication;
    locationTotal += review.rating.location;
    checkinTotal += review.rating.checkin;
    valueTotal += review.rating.value;
  })

  category.cleanliness = (cleanlinessTotal / reviews.length).toFixed(1);
  category.accuracy = (accuracyTotal / reviews.length).toFixed(1);
  category.communication = (communicationTotal / reviews.length).toFixed(1);
  category.location = (locationTotal / reviews.length).toFixed(1);
  category.checkin = (checkinTotal / reviews.length).toFixed(1);
  category.value = (valueTotal / reviews.length).toFixed(1);

  return {
    total: reviews.length,
    overallRating,
    category
  }
}

export const obtainSortedBedrooms = (bedrooms) => {
  const sortedBedrooms = []
  for (const rooms of bedrooms) {
    const roomObject = {}
    for (const room of rooms) {
      if (!roomObject[room]) {
        roomObject[room] = 1
      } else {
        roomObject[room] += 1
      }
    }
    roomObject.total = rooms.length
    sortedBedrooms.push(roomObject)
  }
  return sortedBedrooms
}

export const obtainTotalBeds = (sortedBedrooms) => {
  let count = 0
  if (sortedBedrooms) {
    for (const bedroom of sortedBedrooms) {
      count += bedroom.total
    }
  }
  return count;
}

export function obtainEarliestAvailability (list) {
  if (!list || list.length === 0) {
    return [null, null]
  }

  let earliest = null
  let listIndex = -1
  const today = moment()

  list.map((dateRange, index) => {
    const startDate = moment(dateRange.start, 'YYYYMMDD')
    const endDate = moment(dateRange.end, 'YYYYMMDD')

    if (startDate.isBefore(today, 'day') && endDate.isSameOrBefore(today, 'day')) {
      return {}
    }
    if (startDate.isSameOrAfter(today, 'day')) {
      if (!earliest || startDate.isBefore(earliest, 'day')) {
        earliest = startDate
        listIndex = index
      }
    } else if (endDate.isSameOrAfter(today, 'day')) {
      if (!earliest || endDate.isBefore(earliest, 'day')) {
        earliest = today
        listIndex = index
      }
    }
    return {}
  })

  return listIndex !== -1 ? [earliest, moment(list[listIndex].end, 'YYYYMMDD')] : [null, null]
}

export function dateIsWithinRange (inputStart, inputEnd, start, end) {
  let loop = new Date(inputStart)

  while (loop <= inputEnd) {
    if (!(loop >= start && loop <= end)) {
      return false
    }
    loop = new Date(loop.setDate(loop.getDate() + 1));
  }

  return true
}
