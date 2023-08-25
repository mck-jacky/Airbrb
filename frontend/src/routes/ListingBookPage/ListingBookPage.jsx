import { List, Skeleton, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import PaidIcon from '@mui/icons-material/Paid';
import TodayIcon from '@mui/icons-material/Today';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import { useParams } from 'react-router-dom';
import { fetchURL, getYoutubeThumbnail, setupHistoryPoint } from '../../helper';
import UserChecking from '../../components/UserChecking';
import { Box } from '@mui/material';
import CustomLink from '../../components/CustomLink';
import PropTypes from 'prop-types';

function getNumOfDatesBetweenTwoDates (date1, date2) {
  const differenceInTime = date1.getTime() - date2.getTime();
  return Math.abs(Math.floor(differenceInTime / (1000 * 3600 * 24)));
}

const ListingBookPage = () => {
  // use state
  const { listingId } = useParams();
  const [user, setUser] = useState('')
  const [numOfBookedDate, setNumOfBookedDate] = useState(0)
  const [profit, setProfit] = useState(0)

  // in page functions

  function calNumOfBookedDatesAndProfit (bookings) {
    let bookedDates = 0
    let totalProfit = 0
    for (const booking of bookings) {
      if (booking.listingId === listingId && booking.status === 'accepted' && new Date().getFullYear() === new Date(booking.dateRange.start.slice(0, 4) + '/' + booking.dateRange.start.slice(4, 6) + '/' + booking.dateRange.start.slice(6)).getFullYear()) {
        const start = new Date(booking.dateRange.start.slice(0, 4) + '/' + booking.dateRange.start.slice(4, 6) + '/' + booking.dateRange.start.slice(6))
        const end = new Date(booking.dateRange.end.slice(0, 4) + '/' + booking.dateRange.end.slice(4, 6) + '/' + booking.dateRange.end.slice(6))

        bookedDates += getNumOfDatesBetweenTwoDates(start, end)
        totalProfit += booking.totalPrice
      }
    }
    setNumOfBookedDate(bookedDates)
    setProfit(totalProfit)
  }

  async function getListingData () {
    const res = await fetchURL(`listings/${listingId}`, 'GET', {
      listingid: listingId
    })
    return res.listing
  }

  async function loadListingData () {
    const res = await getListingData(listingId)
    setUser(res.owner)
  }

  useEffect(() => {
    setupHistoryPoint('/');
    loadListingData();
  }, [])

  return (
    <div>
      <UserChecking needLogin={true} specificUserId={user} />
      <ListingInfo listingId={listingId} numOfBookedDate={numOfBookedDate} setNumOfBookedDate={setNumOfBookedDate} profit={profit} setProfit={setProfit} calNumOfBookedDatesAndProfit={calNumOfBookedDatesAndProfit}/>
      <BookingRequestItem listingId={listingId} calNumOfBookedDatesAndProfit={calNumOfBookedDatesAndProfit}/>
    </div>
  );
};

const ListingInfo = ({ listingId, numOfBookedDate, profit, calNumOfBookedDatesAndProfit }) => {
  // use state
  const { Title } = Typography;
  const [imageRawData, setImageRawData] = useState(null)
  const [title, setTitle] = useState('')
  const [listedDate, setListedDate] = useState('')
  const [daysAgo, setDaysAgo] = useState('')
  const link = `/listings/${listingId}`

  // in page functions
  async function getListingData (listingId) {
    const res = await fetchURL(`listings/${listingId}`, 'GET', {
      listingid: listingId
    })
    return res.listing
  }

  async function getBookingData () {
    const res = await fetchURL('bookings', 'GET')
    return res.bookings
  }

  async function loadListingData () {
    const listing = await getListingData(listingId)
    const bookings = await getBookingData()
    getBookingData()
    if (listing.metadata.youtubeId) {
      setImageRawData(getYoutubeThumbnail(listing.metadata.youtubeId))
    } else if (listing.thumbnail && listing.thumbnail !== 'NULL') {
      setImageRawData(listing.thumbnail)
    }

    setTitle(listing.title)
    setListedDate(new Date(listing.postedOn).toISOString().substring(0, 10))
    setDaysAgo(getNumOfDatesBetweenTwoDates(new Date(), new Date(listing.postedOn)))

    calNumOfBookedDatesAndProfit(bookings)
  }

  useEffect(() => {
    loadListingData()
  }, [])

  return (
    <List
      itemLayout="vertical"
      size="large"
      dataSource={[{}]}
      footer={
        <Box sx={{ marginLeft: '10px' }}>
          <b>Booking Request</b>
        </Box>
      }
      renderItem={() => (
        <List.Item
          extra={
            <img
              width={235}
              height={200}
              alt={'image of ' + title }
              style={{ objectFit: 'cover' }}
              src={imageRawData}
            />
          }
        >
          <List.Item.Meta
            title={<Box><CustomLink to={link} >{title}</CustomLink></Box>}
          />
          <Title level={5}><EventAvailableIcon sx={{ position: 'relative', top: '4px', height: '20px' }}/> Has been booked for: {numOfBookedDate} day(s)</Title>
          <Title level={5}><PaidIcon sx={{ position: 'relative', top: '4px', height: '20px' }}/> Profit made: ${profit}</Title>
          <Title level={5}><TodayIcon sx={{ position: 'relative', top: '4px', height: '20px' }}/> Listed on: {listedDate}, {daysAgo} days ago</Title>
        </List.Item>
      )}
    />
  )
}

ListingInfo.propTypes = {
  listingId: PropTypes.string,
  numOfBookedDate: PropTypes.number,
  profit: PropTypes.number,
  calNumOfBookedDatesAndProfit: PropTypes.func
}

const BookingRequestItem = ({ listingId, calNumOfBookedDatesAndProfit }) => {
  async function getBookingData () {
    const res = await fetchURL('bookings', 'GET')
    return res.bookings
  }

  async function acceptBooking (bookingId) {
    await fetchURL(`bookings/accept/${bookingId}`, 'PUT', {
      bookingid: bookingId
    })
    loadBookingHistory()
    const bookings = await getBookingData()
    calNumOfBookedDatesAndProfit(bookings)
  }

  async function declineBooking (bookingId) {
    await fetchURL(`bookings/decline/${bookingId}`, 'PUT', {
      bookingid: bookingId
    })
    loadBookingHistory()
    const bookings = await getBookingData()
    calNumOfBookedDatesAndProfit(bookings)
  }

  const [initLoading, setInitLoading] = useState(true);
  const [list, setList] = useState([]);
  const { Text, Title } = Typography;

  useEffect(() => {
    loadBookingHistory()
  }, [])

  async function loadBookingHistory () {
    const bookings = await getBookingData()
    const filteredBooking = []
    for (const booking of bookings) {
      if (booking.listingId === listingId) {
        filteredBooking.push(booking)
      }
    }
    setList(filteredBooking)
    setInitLoading(false)
  }

  function getDate (date) {
    return date.slice(0, 4) + '/' + date.slice(4, 6) + '/' + date.slice(6)
  }

  return (
    <List
      className="demo-loadmore-list"
      style={{ marginLeft: 10 }}
      loading={initLoading}
      itemLayout="horizontal"
      // loadMore={loadMore}
      dataSource={list}
      renderItem={(item) => (
        <List.Item
          actions={item.status === 'pending'
            ? [<Text onClick={() => acceptBooking(item.id)} style={{ cursor: 'pointer' }} key="accept" type="success" name="accept-button">Accept</Text>,
              <Text onClick={() => declineBooking(item.id)} style={{ cursor: 'pointer' }} key="decline" type="danger" name="decline-button">Decline</Text>]
            : item.status === 'declined'
              ? [<Text key="decline" type="danger">Declined</Text>]
              : [<Text key="decline" type="success">Accepted</Text>]
                  }
        >
          <Skeleton avatar title={false} loading={item.loading} active>
            <List.Item.Meta
              // avatar={<Avatar src={item.picture.large} />}
              title={<Typography>{item.owner}</Typography>}
              description={<Title level={5}>From {getDate(item.dateRange.start)} to {getDate(item.dateRange.end)} | Total ${item.totalPrice}</Title>}
            />
          </Skeleton>
        </List.Item>
      )}
    />
  )
}

BookingRequestItem.propTypes = {
  listingId: PropTypes.any,
  calNumOfBookedDatesAndProfit: PropTypes.any
}

export default ListingBookPage;
