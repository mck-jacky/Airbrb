import React, { useState, useContext } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { useNavigate, useParams } from 'react-router-dom';
import { UserContext } from '../../userContext';

// Component
import { Modal, DatePicker, Rate, Form, Input, Typography as AntdTypography } from 'antd';
import { Button, Grid, Typography, Alert, Snackbar, Skeleton, Link as MuiLink } from '@mui/material';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import { Box } from '@mui/system';
import { DataGrid } from '@mui/x-data-grid';

// Custom component
import Location from '../../components/Location';
import RatingSlider from '../../components/RatingSlider';
import ReviewsBoard from '../../components/ReviewsBoard';
import ReviewItem from '../../components/ReviewItem';
import YoutubeEmbed from '../../components/YoutubeEmbed';
import BedIconGroup from '../../components/BedIconGroup';
import BedDescription from '../../components/BedDescription';
import AmenityItem from '../../components/AmenityItem';
import CustomLink from '../../components/CustomLink';
import CustomCarousel from '../../components/CustomCarousel';
import { SlickArrowLeft, SlickArrowRight } from '../../components/CarouselButton/CarouselButton';

// Icon
import AssignmentLateOutlinedIcon from '@mui/icons-material/AssignmentLateOutlined';
import BathtubOutlinedIcon from '@mui/icons-material/BathtubOutlined';
import HouseOutlinedIcon from '@mui/icons-material/HouseOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import SingleBedIcon from '@mui/icons-material/SingleBed';
import StarRateIcon from '@mui/icons-material/StarRate';

// Theme
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { AirBrBTheme } from '../../components/Theme';
import useMediaQuery from '@mui/material/useMediaQuery';

// Helper functions
import { fetchURL, showAlert, obtainSvgRatingString, obtainFormattedNumber, obtainTotalBeds, obtainSortedBedrooms, getBookings, obtainRatingStats, isOwner, isLogin, setupHistoryPoint } from '../../helper';

function ListingPage () {
  const { listingId } = useParams();
  const userObj = useContext(UserContext);
  const navigate = useNavigate();

  // listing state
  const [title, setTitle] = useState('')
  const [owner, setOwner] = useState('')
  const [propertyType, setPropertyType] = useState('')
  const [streetAddress, setStreetAddress] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [price, setPrice] = useState(0)
  const [bathrooms, setBathrooms] = useState(0)
  const [bedrooms, setBedrooms] = useState([])
  const [amenityList, setAmenityList] = useState([])
  const [propertyFileList, setPropertyFileList] = useState([]);
  const [reviews, setReviews] = useState([])
  const [reviewRatings, setReviewRatings] = useState({})
  const [published, setPublished] = useState(false)
  const [bookings, setBookings] = useState([])
  const [availability, setAvailability] = useState([])
  const [youtubeId, setYoutubeId] = useState('')

  // controls
  const [bookingDates, setBookingDates] = useState(null)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [errorMsg, seterrorMsg] = useState('')
  const [canReview, setCanReview] = useState(false)
  const [ratingFilterValue, setRatingFilterValue] = useState(0) // 0: all, 1 - 5: star 1 - 5

  // modal
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  // in page functions
  const fetchListing = async () => {
    const res = await fetchURL('listings/' + listingId, 'GET');
    if (res.error) {
      showAlert(res.error);
    } else {
      // if not published or emtpy response {}
      // navigate back to landing page
      if (Object.keys(res.listing).length === 0 ||
         (!isOwner(userObj, res.listing.owner) && !res.listing.published)) {
        navigate('/')
        return
      }

      // setup controls
      setupControls(res.listing);
    }
  }

  const fetchBookings = async () => {
    if (!isLogin(userObj)) {
      setBookings([])
      setCanReview(false)
      return
    }

    const bookings = await getBookings()
    const listingWithStatus = []

    if (bookings) {
      for (const booking of bookings) {
        if (booking.owner === localStorage.email) {
          if (booking.listingId === listingId) {
            const date1 = moment(booking.dateRange.start, 'YYYYMMDD')
            const date2 = moment(booking.dateRange.end, 'YYYYMMDD')

            listingWithStatus.push({
              id: booking.id,
              startDate: date1.format('YYYY/MM/DD'),
              endDate: date2.format('YYYY/MM/DD'),
              status: booking.status
            })
          }
        }
      }
      setBookings([...listingWithStatus])
    }

    if (await getReviewableBookingId()) {
      setCanReview(true)
    }
  }

  const revokeBookings = async (bookingId) => {
    const res = await fetchURL('bookings/' + bookingId, 'DELETE');

    if (res.error) {
      seterrorMsg(res.error)
    } else {
      setSuccessMsg('Booking request revoked')
    }
    setBookingDates(null)
    setSnackbarOpen(true)
    fetchBookings()
  }

  const setupControls = (listing) => {
    setTitle(listing.title)
    setOwner(listing.owner)
    setPrice(listing.price)
    setStreetAddress(listing.address.streetAddress)
    setCity(listing.address.city)
    setState(listing.address.state)
    setReviews(listing.reviews.reverse())
    setReviewRatings(obtainRatingStats(listing.reviews))
    setBathrooms(listing.metadata.bathrooms)
    setPropertyType(listing.metadata.propertyType)
    setAmenityList(listing.metadata.amenityList)
    setPublished(listing.published)
    setYoutubeId(listing.metadata.youtubeId)
    const avaList = []
    for (const ava of listing.availability) {
      const date1 = moment(ava.start, 'YYYYMMDD')
      const date2 = moment(ava.end, 'YYYYMMDD')
      avaList.push({ start: date1, end: date2 })
    }
    setAvailability(avaList)
    // bedrooms
    const sortedBedrooms = obtainSortedBedrooms(listing.metadata.bedrooms)
    setBedrooms([...sortedBedrooms])
    // image property list
    if (Object.prototype.hasOwnProperty.call(listing, 'metadata')) {
      const propertyImageList = listing.metadata.propertyImageList ? [...listing.metadata.propertyImageList] : [];
      if (listing.thumbnail && listing.thumbnail !== 'NULL') {
        propertyImageList.unshift(listing.thumbnail);
      }
      setPropertyFileList(propertyImageList)
    }
    // booking dates
    if (userObj.searchDate.length > 0) {
      const date1 = moment(userObj.searchDate[0], 'YYYY/MM/DD')
      const date2 = moment(userObj.searchDate[1], 'YYYY/MM/DD')
      setBookingDates([date1, date2])
    }
    userObj.setListingIsReady(true)
  }

  const obtainPriceValue = () => {
    if (userObj.searchDate.length === 0) {
      return price
    } else {
      const date1 = moment(userObj.searchDate[0], 'YYYY/MM/DD')
      const date2 = moment(userObj.searchDate[1], 'YYYY/MM/DD')
      return price * (date2.diff(date1, 'day'))
    }
  }

  const obtainPriceTag = () => userObj.searchDate.length === 0 ? 'Per night' : 'Per stay'

  React.useEffect(() => {
    userObj.setListingIsReady(false)
    fetchListing();
    fetchBookings();
  }, [userObj.user]);

  React.useEffect(() => {
    setupHistoryPoint('/listings/' + listingId);
  }, []);

  // one time component
  const CustomDivider = () => <Divider sx={{ marginTop: '15px', marginBottom: '15px' }} />
  const CustomSectionHeader = ({ children }) => <Typography variant='h7' mr={2} sx={{ fontWeight: 'bold' }} >{children}</Typography>
  CustomSectionHeader.propTypes = {
    children: PropTypes.any
  }

  // data grid
  const columns = [
    { field: 'id', headerName: 'ID', width: 120 },
    {
      field: 'startDate',
      headerName: 'Start Date',
      width: 150,
      editable: false,
    },
    {
      field: 'endDate',
      headerName: 'End Date',
      width: 150,
      editable: false,
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 150,
      editable: false,
    },
    {
      field: 'action',
      headerName: 'Action',
      sortable: false,
      renderCell: (params) => {
        const onClick = (e) => {
          e.stopPropagation(); // don't select this row after clicking
          revokeBookings(params.getValue(params.id, 'id'))
        };

        return <Button onClick={onClick}>{params.getValue(params.id, 'status') ? 'revoke' : 'revoke'}</Button>;
      },
    },
  ];

  // range picker
  const { RangePicker } = DatePicker;
  const disabledDate = (current) => {
    let isInRange = false;
    for (const ava of availability) {
      if (current.isBetween(ava.start, ava.end, 'day', '[]')) {
        isInRange = true;
        break;
      }
    }
    // Can not select days before today and today
    return (current && current.isBefore(moment(), 'day')) || !isInRange;
  };

  const isValidDateRange = () => {
    if (bookingDates && bookingDates.length === 2 && bookingDates[0] && bookingDates[1]) {
      if (bookingDates[1].isAfter(bookingDates[0], 'day')) {
        return true;
      }
    }
    return false;
  }

  const obtainBookingDateString = () => {
    if (bookingDates && bookingDates.length === 2 && bookingDates[0] && bookingDates[1]) {
      return bookingDates[0].format('D MMM') + ' - ' + bookingDates[1].format('D MMM')
    }
    return ''
  }

  const obtainBookingDateDifferent = () => {
    if (bookingDates && bookingDates.length === 2 && bookingDates[0] && bookingDates[1]) {
      return bookingDates[1].diff(bookingDates[0], 'days')
    }
    return 0
  }

  // event listener
  const bookingBtnOnClick = async () => {
    if (!isValidDateRange()) {
      showAlert('Start day and end day can\'t be the same')
    }

    const res = await fetchURL('bookings/new/' + listingId, 'POST', {
      dateRange: {
        start: bookingDates[0].format('YYYYMMDD'),
        end: bookingDates[1].format('YYYYMMDD')
      },
      totalPrice: obtainBookingDateDifferent() * price
    });

    if (res.error) {
      seterrorMsg(res.error)
    } else {
      setBookingDates(null)
      setSuccessMsg('Booking request submitted')
      fetchBookings()
    }
    setSnackbarOpen(true)
  }

  // style
  const mediaQueryMatches = useMediaQuery('(max-width:999px)');

  const imgContentStyle = {
    margin: 0,
    height: '300px',
    width: '100%',
    color: '#fff',
    objectFit: 'cover',
  };

  const borderBoxCommonStyles = {
    bgcolor: 'background',
    m: 1,
    border: 1,
    borderColor: '#bbbbbb',
    borderRadius: '16px',
  };

  const reviewModalStyle = mediaQueryMatches ? { maxWidth: '95%' } : { maxWidth: '1200px' }

  // rating modal
  const [rating, setRating] = useState(0);
  const [cleanlinessRating, setCleanlinessRating] = useState(0);
  const [accuracyRating, setAccuracyRating] = useState(0);
  const [communicationRating, setCommunicationRating] = useState(0);
  const [locationRating, setLocationRating] = useState(0);
  const [checkinRating, setCheckinRating] = useState(0);
  const [valueRating, setValueRating] = useState(0);
  const [comment, setComment] = useState('');
  const [open, setOpen] = useState(false);
  const [reviewBookingId, setReviewBookingId] = useState('');
  const { Title } = AntdTypography;

  async function handleOpenModal () {
    setReviewBookingId(await getReviewableBookingId())
    setOpen(true)
    setRating(0)
    setCleanlinessRating(0)
    setAccuracyRating(0)
    setCommunicationRating(0)
    setLocationRating(0)
    setCheckinRating(0)
    setValueRating(0)
    setComment('')
  }

  function handleChange (event) {
    setComment(event.target.value);
  }

  const desc = ['terrible', 'bad', 'normal', 'good', 'wonderful'];

  async function putListingReview (listingId, bookingId) {
    let postedOn = (new Date()).toISOString().replace(/[^0-9]/g, '').slice(0, -3)
    postedOn = postedOn.slice(0, 8) + 'T' + postedOn.slice(8)
    const ratingObj = {
      overall: rating,
      cleanliness: cleanlinessRating,
      accuracy: accuracyRating,
      communication: communicationRating,
      location: locationRating,
      checkin: checkinRating,
      value: valueRating
    }
    const res = await fetchURL(`listings/${listingId}/review/${bookingId}`, 'PUT', {
      review: {
        bookingId,
        user: localStorage.email,
        rating: ratingObj,
        comment,
        postedOn
      }
    })
    return res
  }

  async function getReviewableBookingId () {
    const bookings = await getBookings()
    for (const booking of bookings) {
      if (booking.listingId === listingId && booking.owner === localStorage.email && booking.status === 'accepted') {
        return booking.id
      }
    }
  }

  async function handleSubmitReview () {
    if (rating === 0 ||
        cleanlinessRating === 0 ||
        accuracyRating === 0 ||
        communicationRating === 0 ||
        location === 0 ||
        checkinRating === 0 ||
        valueRating === 0 ||
        comment.replaceAll(' ', '') === '') {
      showAlert('rating and comment cannot be empty')
      return
    }
    putListingReview(listingId, reviewBookingId)
    setOpen(false)
    const res = await fetchURL('listings/' + listingId, 'GET');
    setReviews(res.listing.reviews.reverse())
    setReviewRatings(obtainRatingStats(res.listing.reviews))
    setRating(0)
    setCleanlinessRating(0)
    setAccuracyRating(0)
    setCommunicationRating(0)
    setLocationRating(0)
    setCheckinRating(0)
    setValueRating(0)
    setComment('')
  }

  const reviewList = [
    {
      title: 'Cleanliness',
      value: cleanlinessRating,
      setAction: setCleanlinessRating,
    },
    {
      title: 'Accuracy',
      value: accuracyRating,
      setAction: setAccuracyRating,
    },
    {
      title: 'Communication',
      value: communicationRating,
      setAction: setCommunicationRating,
    },
    {
      title: 'Location',
      value: locationRating,
      setAction: setLocationRating,
    },
    {
      title: 'Check-in',
      value: checkinRating,
      setAction: setCheckinRating,
    },
    {
      title: 'Value',
      value: valueRating,
      setAction: setValueRating,
    },
  ]

  const readyStyle = {
    backgroundColor: '#edf7ee',
    color: '#234827',
    width: 'fit-content',
    position: 'relative',
    left: '18px'
  }

  const pendingStyle = {
    backgroundColor: '#fff4e6',
    color: '#ab906f',
    width: 'fit-content',
    position: 'relative',
    left: '18px'
  }

  return (
    <ThemeProvider theme={AirBrBTheme}>
      <Container component="main" maxWidth="md">
        <CssBaseline />
        <Box
          sx={{
            paddingTop: '10px',
            paddingBottom: '50px'
          }}>
          {/* Skeleton card */}
          {!userObj.listingIsReady &&
          <>
            <Skeleton width={400} ></Skeleton>
            <Skeleton width={500} ></Skeleton>
            <Skeleton variant='rounded' height={300} ></Skeleton>
            <Box sx={{ paddingTop: '20px' }}><Skeleton variant='rounded' height='3.5rem' width={280} sx={{ paddingTop: '10px' }}></Skeleton></Box>
            <CustomDivider />
            <Box>
              <Skeleton width={100} ></Skeleton><Skeleton variant='rounded' height='7rem' ></Skeleton>
            </Box>
            <CustomDivider />
            <Box>
              <Skeleton width={100} ></Skeleton><Skeleton variant='rounded' height='7rem' ></Skeleton>
              <CustomDivider />
            </Box>
            <Box>
              <Skeleton width={200} ></Skeleton><Skeleton variant='rounded' height='14rem' ></Skeleton>
            </Box>
            <CustomDivider />
            <Skeleton width={200} ></Skeleton><Skeleton variant='rounded' height='500px' ></Skeleton>
            <CustomDivider />
            <Box>
              <Skeleton width={200} ></Skeleton><Skeleton variant='rounded' height='14rem' ></Skeleton>
            </Box>
          </>}
          {/* Real data card */}
          {userObj.listingIsReady &&
          <>
            <Typography name='listing-title' variant='h6' sx={{ fontWeight: 'bold' }}>{title}</Typography>
            <Box sx={{ position: 'relative', marginRight: '100px' }}>
              <CustomLink href='#' onClick={() => { reviews.length > 0 && setIsReviewModalOpen(true) }} >
                <Typography variant='h7' mr={2}>
                  <StarRateIcon sx={{ position: 'relative', top: '3px', height: '20px' }} />
                    { obtainSvgRatingString(reviews) }
                </Typography>
                <Typography variant='h7' mr={2}>{obtainFormattedNumber(reviews.length)} reviews</Typography>
              </CustomLink>
              <Typography name='listing-address' variant='h7' mr={3} sx={{ display: 'inline-block' }} >
                <MuiLink href={'https://www.google.com/maps?q=' + [streetAddress, city, state].join(',') } target="_blank" underline="none">
                  <LocationOnOutlinedIcon sx={{ position: 'relative', top: '3px', height: '20px' }} />
                  {[streetAddress, city, state].join(', ')}
                </MuiLink>
              </Typography>
              <Typography name='listing-type' variant='h7' color='primary' sx={{ display: 'inline-block' }}>
              <HouseOutlinedIcon sx={{ position: 'relative', top: '3px', height: '20px' }} />
                {propertyType}
              </Typography>
              {isOwner(userObj, owner) &&
                (
                  <Typography variant='h7' sx={{ position: 'absolute', bottom: 0, right: -100 }} mr={3}>{ published
                    ? <Box sx={readyStyle} >Published</Box>
                    : <Box sx={pendingStyle}>Unpublished</Box>
                  }
                  </Typography>
                )
              }
            </Box>
            <Box>
                {/* Carousel */}
                <CustomCarousel
                  swipeToSlide
                  draggable
                  arrows={true}
                  prevArrow={<SlickArrowLeft />}
                  nextArrow={<SlickArrowRight />}
                >
                  {youtubeId && <YoutubeEmbed embedId={youtubeId} />}
                  {propertyFileList.map((file, index) => {
                    return (<div key={index}>
                      <img style={imgContentStyle} src={file} alt={'image ' + (index + 1) + ' of ' + title } ></img>
                    </div>)
                  })}
                </CustomCarousel>
              </Box>
              <Box sx={{ paddingTop: '10px' }}>
                <Box name='listing-price' sx={{ ...borderBoxCommonStyles, textAlign: 'center', width: '6rem', height: '3.5rem', paddingTop: '4px', display: 'inline-block' }}>
                  ${obtainPriceValue()}<br />
                  <Typography variant="subtitle2">
                    {obtainPriceTag()}
                  </Typography>
                </Box>
                {
                  [
                    <span key='beds' name='listing-beds'><SingleBedIcon fontSize='large' sx={{ position: 'relative', top: '10px' }} />
                    {obtainFormattedNumber(obtainTotalBeds(bedrooms))}</span>,
                    <span key='bathrooms' name='listing-bathrooms'><BathtubOutlinedIcon fontSize='large' sx={{ position: 'relative', top: '10px' }} />
                    {obtainFormattedNumber(bathrooms)}</span>,
                    <span key='rooms' name='listing-rooms'><MeetingRoomIcon fontSize='large' sx={{ position: 'relative', top: '10px' }} />
                    {obtainFormattedNumber(bedrooms.length)}</span>
                  ].map((item, index) => {
                    return (<Box key={index} mr={1} sx={{ display: 'inline-block', position: 'relative', top: '-10px' }}>
                      {item}
                    </Box>)
                  })
                }
              </Box>
              <CustomDivider />
              <Box>
                <CustomSectionHeader>Rooms</CustomSectionHeader>
                <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                {
                  bedrooms.map((room, index) => {
                    return (
                      <Box key={index} sx={{ ...borderBoxCommonStyles, paddingLeft: '10px', paddingTop: '10px', width: '9rem', height: '7rem' }}>
                        <BedIconGroup room={room} />
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', fontSize: '13px' }}>
                          Bedroom {index + 1}
                        </Typography>
                        <Typography variant="subtitle2" sx={{ fontSize: '11px', paddingRight: '6px' }} >
                          <BedDescription room={room} />
                        </Typography>
                      </Box>
                    )
                  })
                }
                </Box>
              </Box>
              <CustomDivider />
              <Box>
                <CustomSectionHeader>Amenities</CustomSectionHeader>
                  <Grid container spacing={2}>
                    {amenityList.map((key, index) => <Grid key={index} item xs={12} sm={6}><AmenityItem amenity={key} /></Grid>)}
                  </Grid>
                <CustomDivider />
              </Box>
              <Box>
              {canReview
                ? <Button variant="contained" color="primary" sx={{ display: 'block', marginBottom: '15px' }} onClick={handleOpenModal}>
                    Add review
                  </Button>
                : <></>
              }
                <CustomSectionHeader>
                  <StarRateIcon sx={{ position: 'relative', top: '3px', height: '20px' }} />
                    { obtainSvgRatingString(reviews) }
                </CustomSectionHeader>
                <CustomSectionHeader>{obtainFormattedNumber(reviews.length)} reviews </CustomSectionHeader>
                {reviews.length > 0 && (
                  <>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        {Array(5).fill(0).map((i, index) => {
                          const currentIndex = 5 - index;
                          return (
                            <Box key={index} sx={{ maxWidth: '220px' }}>
                              <CustomLink
                                onClick={() => {
                                  setIsReviewModalOpen(true);
                                  setRatingFilterValue(currentIndex);
                                }}
                              >
                                <RatingSlider
                                  type={currentIndex + ' star'}
                                  value={Math.round(reviewRatings.overallRating[currentIndex] / reviewRatings.total * 100)}
                                  displayValue={Math.round(reviewRatings.overallRating[currentIndex] / reviewRatings.total * 100) + '%'}
                                  tooltipValue={reviewRatings.overallRating[currentIndex] + '(' + Math.round(reviewRatings.overallRating[currentIndex] / reviewRatings.total * 100) + '%)'}
                                  sx={{ maxWidth: '200px' }}
                                />
                              </CustomLink>
                            </Box>
                          )
                        })}
                      </Grid>
                    </Grid>
                    <Grid container spacing={2} sx={{ paddingTop: '20px' }}>
                    {
                      reviews.map((review, index) => (
                        index < 6
                          ? <Grid key={index} item xs={12} md={6} sx={{ position: 'relative' }}>
                              <ReviewItem review={review} additionalStyle={{
                                display: '-webkit-box',
                                overflow: 'hidden',
                                WebkitBoxOrient: 'vertical',
                                WebkitLineClamp: 4
                              }
                              } />
                            </Grid>
                          : <span key={index}></span>
                      ))
                    }
                    </Grid>
                  </>
                )}
                  {reviews.length > 0 && (
                    <Button
                      size="small"
                      variant='outlined'
                      color='black'
                      sx={{
                        width: '200px',
                        fontSize: '12px',
                        marginTop: '10px'
                      }}
                      onClick={() => setIsReviewModalOpen(true)}
                      >
                        Show Detail Reviews
                    </Button>
                  )}
              </Box>
              <CustomDivider />
              <CustomSectionHeader>
                <LocationOnOutlinedIcon sx={{ position: 'relative', top: '3px', height: '20px' }} />
                Loaction
              </CustomSectionHeader>
              <Location address={[streetAddress, city, state].join(',')} />
              <CustomDivider />
              <Box>
                <CustomSectionHeader>
                <AssignmentLateOutlinedIcon sx={{ position: 'relative', top: '3px', height: '20px' }} />
                Booking
              </CustomSectionHeader>
              {isOwner(userObj, owner) &&
                <Box>
                  <Button
                    size="small"
                    variant='outlined'
                    color='black'
                    sx={{
                      width: '200px',
                      fontSize: '12px',
                      marginLeft: '10px'
                    }}
                    onClick={() => navigate('/listings/book/' + listingId)}
                  >
                    Manage Booking
                  </Button>
                </Box>
              }
              {!isOwner(userObj, owner) && bookings.length > 0 && (
                <>
                  <Box sx={{ height: 400, width: '100%' }}>
                    <DataGrid
                      rows={bookings}
                      columns={columns}
                      initialState={{
                        sorting: {
                          sortModel: [{ field: 'startDate', sort: 'asc' }],
                        }
                      }}
                      pageSize={5}
                      rowsPerPageOptions={[5]}
                      disableSelectionOnClick
                      experimentalFeatures={{ newEditingApi: true }}
                    />
                  </Box>
                </>)
              }
              {!isOwner(userObj, owner) && (
                <Typography variant='subtitle1'>
                  Book More?
                </Typography>
              )}
              {!isLogin(userObj) && (
                <Typography variant='subtitle1'>
                  Looking for a room? {isLogin(userObj) ? 'Book here' : <CustomLink to='/login' >Login here</CustomLink>}
                </Typography>
              )
              }
              {!isOwner(userObj, owner) && isLogin(userObj) && (
                <>
                  <RangePicker
                    value={bookingDates}
                    onChange={(dates) => setBookingDates(dates)}
                    disabledDate={disabledDate} />
                  {isValidDateRange() && (
                    <>
                    <Box sx={{ ...borderBoxCommonStyles, padding: '10px 10px 0px 10px', width: '15rem', height: '7rem' }}>
                      <Typography name='listing-booking-duration' variant='subtitle2'>Duration: {obtainBookingDateString()}</Typography>
                      <Typography name='listing-booking-total-night' variant='subtitle2'>Total Night: {obtainBookingDateDifferent()}</Typography>
                      <hr />
                      <Typography name='listing-booking-cost' variant='subtitle2'>Total Cost: ${obtainBookingDateDifferent() * price}</Typography>
                    </Box>
                    <Button
                        size="small"
                        name='book-submit'
                        variant='outlined'
                        color='black'
                        sx={{
                          width: '100px',
                          fontSize: '12px',
                          marginLeft: '10px'
                        }}
                        onClick={() => bookingBtnOnClick(true)}
                    >
                      Book
                    </Button>
                    </>
                  )}
                </>
              )}
            </Box>
          </>}
        </Box>
      {/* Modal Forms */}
      <Modal
        title=""
        width='90%'
        open={isReviewModalOpen}
        onOk={() => {
          setIsReviewModalOpen(false);
          setRatingFilterValue(0);
        }}
        onCancel={() => {
          setIsReviewModalOpen(false);
          setRatingFilterValue(0)
        }}
        footer={null}
        style={{ ...reviewModalStyle }}
      >
        <ReviewsBoard reviews={reviews} reviewRatings={reviewRatings} ratingFilterValue={ratingFilterValue} />
      </Modal>
      <Snackbar open={snackbarOpen} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} autoHideDuration={3000} onClose={() => {
        setSnackbarOpen(false)
        setSuccessMsg('')
        seterrorMsg('')
      }}
       >
        {successMsg !== ''
          ? <Alert severity="success">{successMsg}</Alert>
          : errorMsg !== ''
            ? <Alert severity="error">{errorMsg}</Alert>
            : <></>
        }
      </Snackbar>
      </Container>
      <Modal
          title={`Share your thoughts about ${title}`}
          centered
          open={open}
          onOk={() => setOpen(false)}
          onCancel={() => setOpen(false)}
          width={1000}
          footer={[
            <Button key="submit" type="primary" onClick={handleSubmitReview}>
              Submit
            </Button>
          ]}
        >
        <Title level={5}>{`Booking id: ${reviewBookingId}`}</Title>
        <Typography variant='subtitle1' sx={{ display: 'inline-block', width: '120px', marginRight: '10px' }}>Overall Rating</Typography>
            <Rate tooltips={desc} onChange={setRating} value={rating} />
        <Box sx={{ marginTop: '20px' }}>
          <Title level={4}>Category Rating</Title>
        </Box>
        <Grid container spacing={2}>
          {
            reviewList.map((item, index) => {
              return (<Grid key={index} item xs={12} sm={6} md={4}>
                <Typography variant='subtitle1' sx={{ display: 'inline-block', width: '120px', marginRight: '10px' }}>{item.title}</Typography>
                <Rate tooltips={desc} onChange={item.setAction} value={item.value} />
              </Grid>)
            })
          }
        </Grid>

        <Title level={4} style={{ marginTop: 10 }}>Comment</Title>
        <Form.Item
          rules={[
            {
              required: true,
              message: 'Please input Intro',
            },
          ]}
        >
          <Input.TextArea style={{ height: 150 }} onChange={handleChange} value={comment} />
        </Form.Item>
      </Modal>
    </ThemeProvider>
  );
}

export default ListingPage;
