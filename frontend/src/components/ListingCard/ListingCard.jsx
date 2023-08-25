import * as React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import StarRateIcon from '@mui/icons-material/StarRate';
import SingleBedIcon from '@mui/icons-material/SingleBed';
import BookOnlineIcon from '@mui/icons-material/BookOnline';
import BathtubOutlinedIcon from '@mui/icons-material/BathtubOutlined';
import ReviewsIcon from '@mui/icons-material/Reviews';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import RemoveIcon from '@mui/icons-material/Remove';
import CancelScheduleSendIcon from '@mui/icons-material/CancelScheduleSend';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import { CardActionArea, Divider, ListItemIcon, ListItemText, Menu, MenuItem, Skeleton } from '@mui/material';
import { fetchURL, getDefaultThumbnail, showAlert, obtainSvgRatingString, obtainFormattedNumber, obtainSortedBedrooms, obtainTotalBeds, obtainEarliestAvailability, getYoutubeThumbnail } from '../../helper';
import { useNavigate } from 'react-router-dom';
import { Modal, Button, Tooltip, Carousel } from 'antd';
import moment from 'moment';
import { SlickArrowLeft, SlickArrowRight } from '../CarouselButton/CarouselButton';
import CustomRangePicker from '../CustomRangePicker';
import IconChip from '../IconChip';

import { ThemeProvider } from '@mui/material/styles';
import { DefaultTheme } from '../../components/Theme';

const ITEM_HEIGHT = 48;

// Reference @ mui: https://mui.com/material-ui/react-card/#main-content
function ListingCard ({ id, isAccepted, isPending, isHosting, fetchListings }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [availability, setAvailability] = React.useState([[]]);
  const [options, setOptions] = React.useState([[]]);
  const [loading, setLoading] = React.useState(true);
  const [thumbnailList, setThumbnailList] = React.useState([])

  const [listing, setListing] = React.useState({
    title: '',
    owner: '',
    address: {},
    price: 0,
    thumbnail: '',
    metadata: {
      youtubeId: '',
      bathrooms: 0,
      bedrooms: [],
      amenityList: [],
      propertyType: 'House',
      propertyImageList: []
    },
    reviews: [
      {}
    ],
    availability: [],
    published: false,
    postedOn: ''
  });
  const [totalBed, setTotalBed] = React.useState(0)
  const [svgRating, setSvgRating] = React.useState('-')

  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const showModal = () => {
    setIsModalOpen(true);
    setAvailability([[]])
  };
  const handleOk = (e) => {
    e.stopPropagation()
    publishListing();
    setIsModalOpen(false);
  };
  const handleCancel = (e) => {
    e.stopPropagation()
    setIsModalOpen(false);
  };

  const publishListing = async () => {
    const availabilityList = []
    for (const range of availability) {
      if (!range || range.length === 0 || !range[0] || !range[1]) {
        continue
      }

      availabilityList.push({
        start: range[0].format('YYYYMMDD'),
        end: range[1].format('YYYYMMDD')
      })
    }

    if (availabilityList.length !== 0) {
      const res = await fetchURL('listings/publish/' + id, 'PUT', {
        availability: availabilityList
      });
      if (res.error) {
        showAlert(res.error);
      } else {
        fetchListing();
      }
    }
  }

  const rangePickerOnChange = (index, value, dateString) => {
    const resultValue = value
    if (value && value[0].isSame(value[1], 'day')) {
      alert("start date and end date can't be the same")
      resultValue[1] = null
    }
    // prevent overlap availability
    for (let i = 0; i < availability.length; i++) {
      if (i === index) {
        continue
      }

      const tmpStart = moment(availability[i][0], 'YYYY/MM/DD')
      const tmpEnd = moment(availability[i][1], 'YYYY/MM/DD')
      if (tmpStart.isValid() && tmpEnd.isValid() && value[0] && value[1]) {
        if (value[0].isBefore(tmpEnd, 'day') && value[1].isAfter(tmpStart, 'day')) {
          showAlert('Booking date cannot be overlap with existing bookings')
          resultValue[1] = null
        }
      }
    }

    const newAvailability = [...availability]
    newAvailability[index] = resultValue
    setAvailability(newAvailability)
  }

  const fetchListing = async () => {
    setLoading(true);
    const res = await fetchURL('listings/' + id, 'GET');
    if (res.error) {
      showAlert(res.error);
    } else {
      setListing(res.listing)
      let newOptions = []
      if (res.listing.published) {
        newOptions = ['Edit',
          'Delete',
          'Booking',
          '-',]
      } else {
        newOptions = ['Edit',
          'Delete',
          '-',]
      }
      newOptions.push(res.listing.published ? 'Unpublish' : 'Publish')
      setOptions(newOptions)
      const sortedBedrooms = obtainSortedBedrooms(res.listing.metadata.bedrooms)
      setTotalBed(obtainTotalBeds(sortedBedrooms))
      setSvgRating(obtainSvgRatingString(res.listing.reviews))
      setLoading(false);
      setupThumbnailList(res.listing)
    }
  }

  React.useEffect(() => {
    if (id !== 0) {
      fetchListing();
    }
  }, []);

  const handleMoreClick = (e) => {
    e.stopPropagation()
    setAnchorEl(e.currentTarget);
  };
  const handleClose = (e) => {
    setAnchorEl(null);
  };
  const handleMenuItemClick = async (e, option) => {
    e.stopPropagation();
    if (option === 'Edit') {
      navigate('/listings/edit/' + id)
    } else if (option === 'Delete') {
      const res = await fetchURL('listings/' + id, 'DELETE');
      if (res.error) {
        showAlert(res.error);
      } else {
        fetchListings()
      }
    } else if (option === 'Publish') {
      showModal()
    } else if (option === 'Unpublish') {
      const res = await fetchURL('listings/unpublish/' + id, 'PUT');
      if (res.error) {
        showAlert(res.error);
      } else {
        fetchListing()
      }
    } else if (option === 'Booking') {
      navigate('/listings/book/' + id)
    }
    handleClose();
  };

  const obtainDateRange = () => {
    const [startDate, endDate] = obtainEarliestAvailability(listing.availability);
    if (!startDate) {
      return 'No upcoming availability'
    } else {
      return startDate.format('D MMM') + ' - ' + endDate.format('D MMM')
    }
  }

  const disabledDate = (current) => {
    // Can not select days before today and today
    return current && current.isBefore(moment(), 'day')
  };

  const setupThumbnailList = (listing) => {
    const results = []
    if (listing.metadata.youtubeId) {
      results.push(getYoutubeThumbnail(listing.metadata.youtubeId))
    } else if (listing.thumbnail && listing.thumbnail !== 'NULL') {
      results.push(listing.thumbnail)
    } else if (results.length === 0) {
      results.push(getDefaultThumbnail())
    }
    setThumbnailList(results)
  }

  const acceptedStyle = {
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
    <Card
      sx={{ width: 350, height: 450, borderRadius: '10px' }}
    >
      <Modal title="Publish Listing" okText='Publish' open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        {
          availability.map((item, index) => {
            return (
              <Box key={index}>
                <CustomRangePicker
                  name={'range-picker-' + index}
                  key={index}
                  onChange= { (value, dateString) => { rangePickerOnChange(index, value, dateString) }}
                  size={availability.length}
                  disabledDate={disabledDate}
                  value={item}
                />
                {availability.length !== 1 && (
                <Tooltip title="Remove">
                  <Button type="primary" shape="circle" icon={<RemoveIcon />} onClick={() => {
                    const newAvailability = [...availability]
                    newAvailability.splice(index, 1)
                    setAvailability(newAvailability)
                  }}/>
                </Tooltip>
                )}
              </Box>
            )
          })
        }
        <Button
          onClick={() => {
            const newAvailability = [...availability]
            newAvailability.push('')
            setAvailability(newAvailability)
          }}
        >
          Add new range
        </Button>
      </Modal>
        <CardHeader
          avatar={
              loading
                ? (
                  <Skeleton variant='circular'>
                    <Avatar />
                  </Skeleton>
                  )
                : (
                  <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                    {listing.owner.substring(0, 2).toUpperCase()}
                  </Avatar>
                  )
          }
          action={
            isHosting && !loading && (
            <ThemeProvider theme={DefaultTheme}>
              <IconButton
                name='more'
                aria-label="More"
                aria-controls={open ? 'menu' : undefined}
                aria-expanded={open ? 'true' : undefined}
                aria-haspopup='true'
                onClick={handleMoreClick}
                onMouseDown={(e) => e.stopPropagation()}
              >
                <MoreVertIcon />
              </IconButton>
              <Menu
                id="long-menu"
                MenuListProps={{
                  'aria-labelledby': 'long-button',
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                onClick={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
                disableScrollLock={true}
                PaperProps={{
                  sx: {
                    maxHeight: ITEM_HEIGHT * 4.5,
                    width: '20ch',
                  },
                }}
              >
                {options.map((option, index) => {
                  if (option === '-') {
                    return [<Divider key={option} />]
                  } else {
                    return (
                      [
                      <MenuItem name={option} key={option} onClick={ (e) => { handleMenuItemClick(e, option) } }>
                        {index === 0 &&
                        (<>
                          <ListItemIcon>
                            <EditIcon fontSize="small" />
                          </ListItemIcon>
                          </>
                        )}
                        {index === 1 &&
                        (<>
                          <ListItemIcon>
                            <DeleteIcon fontSize="small" />
                          </ListItemIcon>
                          </>
                        )}
                        {index === 2 && listing.published &&
                        (<>
                          <ListItemIcon>
                            <BookOnlineIcon fontSize="small" />
                          </ListItemIcon>
                          </>
                        )}
                        {index === 3 && !listing.published &&
                        (<>
                          <ListItemIcon>
                            <SendIcon fontSize="small" />
                          </ListItemIcon>
                          </>
                        )}
                        {index === 4 && listing.published &&
                        (<>
                          <ListItemIcon>
                            <CancelScheduleSendIcon fontSize="small" />
                          </ListItemIcon>
                          </>
                        )}
                        <ListItemText>{option}</ListItemText>
                      </MenuItem>
                      ])
                  }
                })}
              </Menu>
            </ThemeProvider>
            )}
          title={ <Typography name='listing-title' noWrap>{ loading ? <Skeleton width={250}/> : listing.title}</Typography> }
          subheader={loading ? <Skeleton width={100} /> : listing.metadata.propertyType}

        />
        <CardActionArea
        name='card-action'
        sx={{ paddingBottom: '50px' }}
        onClick={ () => !isModalOpen ? navigate('/listings/' + id) : '' }
      >
        {loading
          ? <Skeleton variant='rectangular' height={194} />
          : <Carousel
              arrows={true}
              prevArrow={<SlickArrowLeft />}
              nextArrow={<SlickArrowRight />}
            >
              {thumbnailList.map((item, index) => {
                return <CardMedia
                  key={item}
                  component="img"
                  height="194"
                  image={item}
                  alt={listing.title + ' thumbnail'}
                />
              })
              }
            </Carousel>
        }
        <CardContent sx={{ paddingLeft: '16px', paddingTop: '16px', paddingRight: '16px', paddingBottom: '0px' }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="body2" color="text.secondary" sx={{ wordBreak: 'break-word' }}>
              {loading ? <Skeleton width={200}/> : listing.address.city + ', ' + listing.address.state}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {loading
                ? <Skeleton width={50} />
                : (<>
                    <StarRateIcon sx={{ position: 'relative', top: '4px', height: '20px' }} />
                    { svgRating }
                    </>
                  )
              }
            </Typography>
          </Box>
          <Typography name='price' variant="body2" color="text.secondary" sx={{ fontWeight: 'bold' }}>
            {loading ? <Skeleton width={80} /> : '$ ' + listing.price.toString()}
          </Typography>
          <Typography name='date-range' variant="body2" color="text.secondary" sx={{ fontWeight: 'bold' }}>
            {loading ? <Skeleton width={80} /> : obtainDateRange()}
          </Typography>
        </CardContent>
        <CardActions
          sx={ loading ? { paddingLeft: '16px' } : {}}>
          {loading
            ? <Skeleton height={40} width={150} />
            : (
              <>
                <IconChip icon={<SingleBedIcon />} label={totalBed.toString()} />
                <IconChip icon={<BathtubOutlinedIcon />} label={obtainFormattedNumber(listing.metadata.bathrooms)} />
                <IconChip icon={<ReviewsIcon />} label={obtainFormattedNumber(listing.reviews.length)} />
              </>
              )
          }
        </CardActions>
        {loading
          ? <Skeleton width={80} sx={{ marginLeft: '18px' }}/>
          : (<>
            {isAccepted
              ? <Box className='accepted-status' name="status" sx={acceptedStyle} >accepted</Box>
              : <></>
            }
            {isPending
              ? <Box className='pending-status' name="status" sx={pendingStyle} >pending</Box>
              : <></>
            }
            {isHosting
              ? listing.published
                ? <Box name="publish-label" sx={acceptedStyle} >Published</Box>
                : <Box name="unpublish-label" sx={pendingStyle} >Unpublished</Box>
              : <></>
            }
            </>
            )
        }
      </CardActionArea>
    </Card>
  );
}

ListingCard.propTypes = {
  id: PropTypes.number,
  isAccepted: PropTypes.bool,
  isPending: PropTypes.bool,
  isHosting: PropTypes.bool,
  fetchListings: PropTypes.func
};

export default ListingCard;
