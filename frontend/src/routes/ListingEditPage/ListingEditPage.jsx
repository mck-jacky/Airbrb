import React, { useState } from 'react';
import Alert from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import MapsHomeWorkIcon from '@mui/icons-material/MapsHomeWork';
import BedIcon from '@mui/icons-material/Bed';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import CreateIcon from '@mui/icons-material/Create';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { AirBrBTheme, DefaultTheme } from '../../components/Theme';
import StackIcon from '../../components/StackIcon';
import PictureWall from '../../components/PictureWall';
import { fetchURL, showAlert, fileToDataUrl, setupHistoryPoint, extractYoutubeId } from '../../helper';
import { Box } from '@mui/system';
import { Backdrop, Button, Checkbox, CircularProgress, FormControlLabel, FormGroup, Grid, IconButton, InputLabel, MenuItem, Select, Snackbar, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import UserChecking from '../../components/UserChecking';

function ListingEditPage () {
  // use state
  const [show, setShow] = useState(false)
  const [errorMessage, setErrorMessage] = useState('Error')
  const [isReady, setIsReady] = React.useState(false);

  const [owner, setOwner] = useState('')
  const [title, setTitle] = useState('')
  const [imageRawData, setImageRawData] = useState('')
  const [propertyType, setPropertyType] = useState('House')
  const [streetAddress, setStreetAddress] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [zipNumber, setZipNumber] = useState(0)
  const [price, setPrice] = useState(0)
  const [bathrooms, setBathrooms] = useState(0)
  const [bedrooms, setBedrooms] = useState([['single']])
  const [amenityList, setAmenityList] = useState([])
  const [propertyFileList, setPropertyFileList] = useState([])
  const [youtubeURL, setYoutubeURL] = useState('')

  const [snackbarOpen, setSnackbarOpen] = useState(false)

  const { listingId } = useParams();

  const navigate = useNavigate();

  // in page functions
  const fetchListing = async () => {
    const res = await fetchURL('listings/' + listingId, 'GET');
    if (res.error) {
      showAlert(res.error);
      return null
    } else {
      if (Object.keys(res.listing).length === 0) {
        navigate('/')
        return null
      }
      // setup controls
      return res.listing
    }
  }

  const setupControls = (listing) => {
    setOwner(Object.prototype.hasOwnProperty.call(listing, 'owner') ? listing.owner : '')
    setTitle(Object.prototype.hasOwnProperty.call(listing, 'title') ? listing.title : '')
    setPropertyType(Object.prototype.hasOwnProperty.call(listing, 'metadata') ? listing.metadata.propertyType : 'House')
    setStreetAddress(Object.prototype.hasOwnProperty.call(listing, 'address') ? listing.address.streetAddress : '')
    setCity(Object.prototype.hasOwnProperty.call(listing, 'address') ? listing.address.city : '')
    setState(Object.prototype.hasOwnProperty.call(listing, 'address') ? listing.address.state : '')
    setZipNumber(Object.prototype.hasOwnProperty.call(listing, 'address') ? parseInt(listing.address.zip) : 0)
    setPrice(Object.prototype.hasOwnProperty.call(listing, 'price') ? parseInt(listing.price) : 0)
    setBathrooms(Object.prototype.hasOwnProperty.call(listing, 'metadata') ? parseInt(listing.metadata.bathrooms) : 0)
    setBedrooms(Object.prototype.hasOwnProperty.call(listing, 'metadata') ? listing.metadata.bedrooms : [['single']])
    setImageRawData(Object.prototype.hasOwnProperty.call(listing, 'thumbnail') && listing.thumbnail !== 'NULL' ? listing.thumbnail : '')
    setAmenityList(Object.prototype.hasOwnProperty.call(listing, 'metadata') ? listing.metadata.amenityList : [])
    setYoutubeURL(Object.prototype.hasOwnProperty.call(listing, 'metadata') && listing.metadata.youtubeId ? 'https://www.youtube.com/watch?v=' + listing.metadata.youtubeId : '')
    if (Object.prototype.hasOwnProperty.call(listing, 'metadata')) {
      const propertyImageList = listing.metadata.propertyImageList
      const fileList = []
      for (const i in propertyImageList) {
        fileList.push({
          uid: i,
          name: 'Image ' + i,
          status: 'done',
          url: propertyImageList[i],
          isFetched: true
        })
      }
      setPropertyFileList(fileList)
    }
  }

  React.useEffect(() => {
    let mounted = true
    setupHistoryPoint('/')
    fetchListing().then((listing) => {
      if (listing && mounted) {
        setupControls(listing)
        setIsReady(true)
      }
    })

    return () => {
      mounted = false
      return null;
    }
  }, []);

  const thumbnailOnChange = async (e) => {
    const bufferData = await fileToDataUrl(e.target.files[0])
    setImageRawData(bufferData)
  }

  const amenitiesChecking = (type) => {
    return amenityList.indexOf(type) !== -1
  }

  const amenitiesOnChange = (e, type) => {
    const newAmenities = [...amenityList]
    if (e.target.checked) {
      newAmenities.push(type)
    } else {
      newAmenities.splice(newAmenities.indexOf(type), 1)
    }
    setAmenityList(newAmenities)
  }

  async function handleSubmit (event) {
    event.preventDefault();

    const youtubeId = extractYoutubeId(youtubeURL)

    if (!youtubeId.replaceAll(' ', '') && !imageRawData) {
      setSnackbarOpen(true)
      return;
    }

    const imageRawDataMod = imageRawData || 'NULL';

    const propertyImageList = []
    for (const file of propertyFileList) {
      let raw = ''
      if (!file.isFetched) {
        raw = await fileToDataUrl(file.originFileObj);
      } else {
        raw = file.url
      }
      propertyImageList.push(raw);
    }

    const res = await fetchURL('listings/' + listingId, 'PUT', {
      title,
      address: {
        streetAddress,
        city,
        state,
        zip: zipNumber
      },
      price,
      thumbnail: imageRawDataMod,
      metadata: {
        youtubeId,
        bathrooms,
        bedrooms,
        amenityList,
        propertyType,
        propertyImageList
      }
    })

    if (res.error) {
      setErrorMessage(res.error)
      setShow(true)
    } else {
      setShow(false)
      navigate('/listings/host');
    }
  }

  return (
    <ThemeProvider theme={AirBrBTheme}>
      <UserChecking needLogin={true} specificUserId={owner} />
      {show &&
        <Alert severity='error' onClose={() => setShow(false)}>{errorMessage}</Alert>
      }
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 10,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
            <StackIcon
              ele1={<MapsHomeWorkIcon fontSize="12" sx={{ position: 'relative', left: -2 }} />}
              ele2={<CreateIcon fontSize="6" sx={{ position: 'relative', left: -5, top: 10 }} />}
            />
          </Avatar>
          <Typography component="h1" variant="h5">
            Edit Listing
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="edit-listing-title"
              label="Title"
              name="title"
              value={title}
              autoComplete="title"
              inputProps={{ 'aria-label': 'title' }}
              onChange={ (e) => { setTitle(e.target.value) }}
              autoFocus />
            <InputLabel id="demo-simple-select-label">Property Type</InputLabel>
            <ThemeProvider theme={DefaultTheme}>
              <Select
                name="propertyType"
                value={propertyType}
                onChange={ (e) => setPropertyType(e.target.value) }
                displayEmpty
                fullWidth
                inputProps={{ 'aria-label': 'Property type' }}
              >
                <MenuItem value='House'>House</MenuItem>
                <MenuItem value='Apartment'>Apartment</MenuItem>
                <MenuItem value='Guesthouse'>Guesthouse</MenuItem>
                <MenuItem value='Hotel'>Hotel</MenuItem>
              </Select>
            </ThemeProvider>
            <Typography variant="h6" sx={{ marginTop: '10px' }}>
              Address
            </Typography>
            <TextField
              margin="normal"
              required
              fullWidth
              id="edit-listing-street-address"
              label="Street Address"
              name="street-address"
              autoComplete="Street Address"
              inputProps={{ 'aria-label': 'street address' }}
              value={streetAddress}
              onChange={ (e) => { setStreetAddress(e.target.value) }}
              sx={{ marginTop: '10px' }}
            />
            <Grid container spacing={2}>
              <Grid item xs={6} md={6}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="edit-listing-city"
                  label="City"
                  name="city"
                  autoComplete="City"
                  value={city}
                  onChange={ (e) => { setCity(e.target.value) }}
                  inputProps={{ 'aria-label': 'city' }} />
              </Grid>
              <Grid item xs={6} md={6}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="edit-listing-state-province"
                  label="State / Province"
                  name="state-province"
                  autoComplete="State / Province"
                  value={state}
                  onChange={ (e) => { setState(e.target.value) }}
                  inputProps={{ 'aria-label': 'state or province' }} />
              </Grid>
            </Grid>
            <TextField
              margin="normal"
              required
              fullWidth
              id="edit-listing-zip"
              label="Postal / Zip Code"
              name="zip"
              type="number"
              autoComplete="0"
              value={zipNumber}
              onChange={ (e) => e.target.value < 0 ? setZipNumber(0) : setZipNumber(e.target.value) }
              inputProps={{ 'aria-label': 'postal or zip code' }} />
            <Typography variant="h6" sx={{ marginTop: '10px' }}>
              Details
            </Typography>
            <Grid container spacing={2} >
              <Grid item xs={6} md={6}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="edit-listing-price"
                  label="Price (per night)"
                  name="price"
                  type="number"
                  autoComplete="0"
                  value={price}
                  onChange={ (e) => e.target.value < 0 ? setPrice(0) : setPrice(e.target.value) }
                  inputProps={{ 'aria-label': 'Price per night' }}
                  />
              </Grid>
              <Grid item xs={6} md={6}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="edit-listing-bathrooms"
                  type="number"
                  label="Bathrooms"
                  name="bathrooms"
                  autoComplete="bathrooms"
                  value={bathrooms}
                  onChange={ (e) => e.target.value < 0 ? setBathrooms(0) : setBathrooms(e.target.value) }
                  inputProps={{ 'aria-label': 'number of bathrooms' }}
                  />
              </Grid>
            </Grid>
            {bedrooms.map((bedroom, roomIndex) => {
              const bedroomCount = bedrooms.length;
              return (
                <Box key={roomIndex}>
                  <Typography variant="h6" sx={{ marginTop: '10px' }}>
                    Bedroom {roomIndex + 1}
                    {bedroomCount > 1 && (
                    <IconButton
                      color="primary"
                      aria-label="Delete Room"
                      component="label"
                      title="Delete Room"
                      onClick={() => {
                        const newBedrooms = [...bedrooms]
                        newBedrooms.splice(roomIndex, 1)
                        setBedrooms(newBedrooms)
                      }}
                    >
                      <StackIcon
                        ele1={<MeetingRoomIcon fontSize="12" />}
                        ele2={<RemoveIcon fontSize="6" />}
                      />
                    </IconButton>
                    )}
                  </Typography>
                  {bedroom.map((bed, bedIndex) => {
                    const bedCount = bedroom.length;
                    return (
                      <Box key={bedIndex}>
                        <Typography variant="body1">
                          Bed {bedIndex + 1}
                          {bedCount > 1 && (
                          <IconButton
                            color="primary"
                            aria-label="Delete Bed"
                            title="Delete Bed"
                            component="label"
                            onClick={() => {
                              const newBedrooms = [...bedrooms]
                              newBedrooms[roomIndex].splice(bedIndex, 1)
                              setBedrooms(newBedrooms)
                            }}
                          >
                            <StackIcon
                              ele1={<BedIcon fontSize="12" />}
                              ele2={<RemoveIcon fontSize="6" />}
                            />
                          </IconButton>
                          )}
                        </Typography>
                        <ToggleButtonGroup
                          color="primary"
                          value={bed}
                          exclusive
                          onChange={ (e) => {
                            const newBedrooms = [...bedrooms]
                            newBedrooms[roomIndex][bedIndex] = e.target.value
                            setBedrooms(newBedrooms)
                          }}
                          aria-label="bed type"
                        >
                          <ToggleButton value="single">Single</ToggleButton>
                          <ToggleButton value="double">Double</ToggleButton>
                          <ToggleButton value="queen">Queen</ToggleButton>
                          <ToggleButton value="king">King</ToggleButton>
                        </ToggleButtonGroup>
                      </Box>
                    )
                  })}
                <IconButton
                  color="primary"
                  component="label"
                  title="Add Bed"
                  aria-label="Add Bed"
                  onClick={ () => {
                    const newBedrooms = [...bedrooms]
                    newBedrooms[roomIndex].push(['single'])
                    setBedrooms(newBedrooms)
                  }}
                >
                  <StackIcon
                    ele1={<BedIcon fontSize="12" />}
                    ele2={<AddIcon fontSize="6" />}
                  />
                </IconButton>
                </Box>
              )
            })}
            <Button
              variant="contained"
              component="label"
              title="Add Room"
              aria-label="Add Room"
              sx={{ position: 'relative' }}
              onClick={() => {
                const newBedrooms = [...bedrooms]
                newBedrooms.push(['single'])
                setBedrooms(newBedrooms)
              }}
            >
              <StackIcon
                ele1={<BedIcon fontSize="12" sx={{ position: 'relative', left: -8, top: 2 }} />}
                ele2={<AddIcon fontSize="6" sx={{ position: 'relative', left: -18, top: -2 }}/>}
              />
              Add Room
            </Button>

            <Typography variant="h6" sx={{ marginTop: '10px' }}>
              Amenities
            </Typography>
            <Grid container spacing={2} >
              <Grid item xs={6} md={6}>
                <FormGroup>
                  <FormControlLabel control={<Checkbox name="essentials" checked={ amenitiesChecking('essentials') } onChange={ (e) => amenitiesOnChange(e, 'essentials') } />} label="Essentials" aria-label="Essentials" />
                  <FormControlLabel control={<Checkbox name="air-conditioning" checked={ amenitiesChecking('air-conditioning') } onChange={ (e) => amenitiesOnChange(e, 'air-conditioning') }/>} label="Air conditioning" aria-label="Air conditioning" />
                  <FormControlLabel control={<Checkbox name="hair-dryer" checked={ amenitiesChecking('hair-dryer') } onChange={ (e) => amenitiesOnChange(e, 'hair-dryer') } />} label="Hair dryer" aria-label="Hair dryer" />
                  <FormControlLabel control={<Checkbox name="iron" checked={ amenitiesChecking('iron') } onChange={ (e) => amenitiesOnChange(e, 'iron') } />} label="Iron" aria-label="Iron" />
                  <FormControlLabel control={<Checkbox name="dryer" checked={ amenitiesChecking('dryer') } onChange={ (e) => amenitiesOnChange(e, 'dryer') } />} label="Dryer" aria-label="Dryer" />
                  <FormControlLabel control={<Checkbox name="TV" checked={ amenitiesChecking('TV') } onChange={ (e) => amenitiesOnChange(e, 'TV') } />} label="TV" aria-label="TV" />
                  <FormControlLabel control={<Checkbox name="indoor-fireplace" checked={ amenitiesChecking('indoor-fireplace') } onChange={ (e) => amenitiesOnChange(e, 'indoor-fireplace') } />} label="Indoor fireplace" aria-label="Indoor fireplace" />
                  <FormControlLabel control={<Checkbox name="private-entrance" checked={ amenitiesChecking('private-entrance') } onChange={ (e) => amenitiesOnChange(e, 'private-entrance') } />} label="Private Entrance" aria-label="Private Entrance" />
                </FormGroup>
              </Grid>
              <Grid item xs={6} md={6}>
              <FormGroup>
                  <FormControlLabel control={<Checkbox name="kitchen" checked={ amenitiesChecking('kitchen') } onChange={ (e) => amenitiesOnChange(e, 'kitchen') } />} label="Kitchen" aria-label="Kitchen" />
                  <FormControlLabel control={<Checkbox name="heating" checked={ amenitiesChecking('heating') } onChange={ (e) => amenitiesOnChange(e, 'heating') } />} label="Heating" aria-label="Heating" />
                  <FormControlLabel control={<Checkbox name="hangers" checked={ amenitiesChecking('hangers') } onChange={ (e) => amenitiesOnChange(e, 'hangers') } />} label="Hangers" aria-label="Hangers" />
                  <FormControlLabel control={<Checkbox name="washer" checked={ amenitiesChecking('washer') } onChange={ (e) => amenitiesOnChange(e, 'washer') } />} label="Washer" aria-label="Washer" />
                  <FormControlLabel control={<Checkbox name="hot-water" checked={ amenitiesChecking('hot-water') } onChange={ (e) => amenitiesOnChange(e, 'hot-water') } />} label="Hot water" aria-label="Hot water" />
                  <FormControlLabel control={<Checkbox name="cable-TV" checked={ amenitiesChecking('cable-TV') } onChange={ (e) => amenitiesOnChange(e, 'cable-TV') } />} label="Cable TV" aria-label="Cable TV" />
                  <FormControlLabel control={<Checkbox name="private-bathroom" checked={ amenitiesChecking('private-bathroom') } onChange={ (e) => amenitiesOnChange(e, 'private-bathroom') } />} label="Private bathroom" aria-label="Private bathroom" />
                  <FormControlLabel control={<Checkbox name="private-living-room" checked={ amenitiesChecking('private-living-room') } onChange={ (e) => amenitiesOnChange(e, 'private-living-room') } />} label="Private living room" aria-label="Private living room" />
                </FormGroup>
              </Grid>
            </Grid>

            <Box sx={{ marginTop: '10px' }}>
              <Typography variant="h6" sx={{ marginTop: '10px' }}>
                Thumbnails
              </Typography>
              <TextField
                  margin="normal"
                  fullWidth
                  id="edit-listing-youtube-url"
                  label="Youtube video url"
                  name="youtube-url"
                  autoComplete="Youtube video url"
                  value={youtubeURL}
                  helperText='URL is the format of https://www.youtube.com/watch?v={id}'
                  onChange={ (e) => { setYoutubeURL(e.target.value) }}
                  inputProps={{ 'aria-label': 'Youtube video url' }}>
              </TextField>
              <Button
                variant="contained"
                component="label"
                aria-label='uplaod thumbnail'
              >
                Upload Thumbnail
                <input
                  type="file"
                  accept="image/*"
                  aria-label="Upload image thumbnail"
                  onChange={thumbnailOnChange}
                  hidden
                />
              </Button>
              {imageRawData && (
                <>
                  <Button
                    sx={{ marginLeft: '10px' }}
                    variant="contained"
                    component="label"
                    aria-label="Remove"
                    onClick={ () => setImageRawData('') }
                  >Remove</Button>
                  <Box sx={{ marginTop: '10px' }}>
                    <img
                      src={imageRawData}
                      width='200'
                    >
                    </img>
                  </Box>
                </>
              )}
            </Box>
            <Typography variant="h6" sx={{ marginTop: '10px' }}>
              Property Images (Max: 8)
            </Typography>
            <PictureWall
              fileList={propertyFileList}
              setFileList={setPropertyFileList}
            />

            <Button
              type="submit"
              fullWidth
              aria-label="Edit listing"
              variant="contained"
              color="primary"
              sx={{ mt: 3, mb: 2 }}
            >
              Edit Listing
            </Button>
          </Box>
        </Box>
      </Container>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={!isReady}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Snackbar open={snackbarOpen} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} autoHideDuration={3000} onClose={() => setSnackbarOpen(false)}>
        <Alert severity="error">Thumbnail cannot be empty</Alert>
      </Snackbar>
    </ThemeProvider>

  );
}

export default ListingEditPage;
