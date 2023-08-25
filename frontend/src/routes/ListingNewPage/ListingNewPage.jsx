import React, { useState, useEffect } from 'react';
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
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { AirBrBTheme, DefaultTheme } from '../../components/Theme';
import StackIcon from '../../components/StackIcon';

import { fetchURL, setupHistoryPoint, fileToDataUrl, showAlert, parseJsonFile, extractYoutubeId } from '../../helper';
import UserChecking from '../../components/UserChecking';
import { Box } from '@mui/system';
import { Button, Checkbox, FormControlLabel, FormGroup, Grid, IconButton, InputLabel, MenuItem, Select, Snackbar, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function ListingNewPage () {
  // use state
  const [show, setShow] = useState(false)
  const [errorMessage, setErrorMessage] = useState('Error')
  const [imageRawData, setImageRawData] = useState('')
  const [propertyType, setPropertyType] = useState('House')
  const [bedrooms, setBedrooms] = useState([['single']])

  const [snackbarOpen, setSnackbarOpen] = useState(false)

  const navigate = useNavigate();

  useEffect(() => {
    setupHistoryPoint('/');
  }, [])

  // in page functions

  const thumbnailOnChange = async (e) => {
    const bufferData = await fileToDataUrl(e.target.files[0])
    setImageRawData(bufferData)
  }

  async function handleSubmit (event) {
    event.preventDefault();

    const data = new FormData(event.currentTarget);

    const title = data.get('title');
    const propertyType = data.get('propertyType');
    const streetAddress = data.get('street-address');
    const city = data.get('city');
    const state = data.get('state-province');
    const zipNumber = data.get('zip');
    const price = parseInt(data.get('price'));
    const bathrooms = data.get('bathrooms');
    const youtubeURL = data.get('youtube-url')

    const youtubeId = extractYoutubeId(youtubeURL)

    if (!youtubeId.replaceAll(' ', '') && !imageRawData) {
      setSnackbarOpen(true)
      return;
    }

    const imageRawDataMod = imageRawData || 'NULL';

    const amenityList = []
    const checkAmenity = (item) => {
      if (data.get(item)) {
        amenityList.push(item)
      }
    }

    checkAmenity('essentials')
    checkAmenity('air-conditioning')
    checkAmenity('hair-dryer')
    checkAmenity('iron')
    checkAmenity('dryer')
    checkAmenity('TV')
    checkAmenity('indoor-fireplace')
    checkAmenity('private-entrance')
    checkAmenity('kitchen')
    checkAmenity('heating')
    checkAmenity('hangers')
    checkAmenity('washer')
    checkAmenity('hot-water')
    checkAmenity('cable-TV')
    checkAmenity('private-bathroom')
    checkAmenity('private-living-room')

    const res = await fetchURL('listings/new', 'POST', {
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
        propertyImageList: []
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

  const jsonOnChange = async (e) => {
    const jsonData = await parseJsonFile(e.target.files[0])
    const listingData = jsonData.listing

    let res;

    try {
      res = await fetchURL('listings/new', 'POST', {
        title: listingData.title,
        address: listingData.address,
        price: listingData.price,
        thumbnail: listingData.thumbnail,
        metadata: listingData.metadata,
      })
    } catch (error) {
      showAlert('Please validate your JSON file')
      e.target.value = null
      return;
    }

    if (res.error) {
      setErrorMessage(res.error)
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
      e.target.value = null
      setShow(true)
    } else {
      setShow(false)
      navigate('/listings/host')
      showAlert('Created successfully')
    }
  }

  return (
    <ThemeProvider theme={AirBrBTheme}>
      <UserChecking needLogin={true} />
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
              ele2={<AddIcon fontSize="6" sx={{ position: 'relative', left: -5, top: 10 }} />}
            />
          </Avatar>
          <Typography component="h1" variant="h5">
            New Listing
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="new-listing-title"
              label="Title"
              name="title"
              autoComplete="title"
              inputProps={{ 'aria-label': 'title' }}
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
              id="new-listing-street-address"
              label="Street Address"
              name="street-address"
              autoComplete="Street Address"
              inputProps={{ 'aria-label': 'street address' }}
              sx={{ marginTop: '10px' }}
            />
            <Grid container spacing={2}>
              <Grid item xs={6} md={6}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="new-listing-city"
                  label="City"
                  name="city"
                  autoComplete="City"
                  inputProps={{ 'aria-label': 'city' }} />
              </Grid>
              <Grid item xs={6} md={6}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="new-listing-state-province"
                  label="State / Province"
                  name="state-province"
                  autoComplete="State / Province"
                  inputProps={{ 'aria-label': 'state or province' }} />
              </Grid>
            </Grid>
            <TextField
              margin="normal"
              required
              fullWidth
              id="new-listing-zip"
              label="Postal / Zip Code"
              name="zip"
              type="number"
              autoComplete="0"
              onChange={ (e) => e.target.value < 0 ? (e.target.value = 0) : e.target.value }
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
                  id="new-listing-price"
                  label="Price (per night)"
                  name="price"
                  type="number"
                  autoComplete="0"
                  onChange={ (e) => e.target.value < 0 ? (e.target.value = 0) : e.target.value }
                  inputProps={{ 'aria-label': 'Price per night' }}
                  />
              </Grid>
              <Grid item xs={6} md={6}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="new-listing-bathrooms"
                  type="number"
                  label="Bathrooms"
                  name="bathrooms"
                  autoComplete="bathrooms"
                  onChange={ (e) => e.target.value < 0 ? (e.target.value = 0) : e.target.value }
                  inputProps={{ 'aria-label': 'number of bathrooms' }}
                  />
              </Grid>
            </Grid>
            {bedrooms.map((bedroom, roomIndex) => {
              const bedroomCount = bedrooms.length;
              return (
                <Box key={roomIndex}>
                  <Typography key={roomIndex} variant="h6" sx={{ marginTop: '10px' }}>
                    Bedroom {roomIndex + 1}
                    {bedroomCount > 1 && (
                    <IconButton
                      color="primary"
                      name={'delete-room-' + roomIndex}
                      aria-label="Delete Room"
                      title="Delete Room"
                      component="label"
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
                            name={'delete-bed-' + bedIndex}
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
                          name={'bed-' + roomIndex + '-' + bedIndex }
                          value={bed}
                          exclusive
                          onChange={ (e) => {
                            const newBedrooms = [...bedrooms]
                            newBedrooms[roomIndex][bedIndex] = e.target.value
                            setBedrooms(newBedrooms)
                          }}
                          aria-label="bed type"
                        >
                          <ToggleButton name={'single-' + roomIndex + '-' + bedIndex } value="single">Single</ToggleButton>
                          <ToggleButton name={'double-' + roomIndex + '-' + bedIndex } value="double">Double</ToggleButton>
                          <ToggleButton name={'queen-' + roomIndex + '-' + bedIndex } value="queen">Queen</ToggleButton>
                          <ToggleButton name={'king-' + roomIndex + '-' + bedIndex } value="king">King</ToggleButton>
                        </ToggleButtonGroup>
                      </Box>
                    )
                  })}
                <IconButton
                  color="primary"
                  name='add-bed'
                  aria-label="Add Bed"
                  title="Add Bed"
                  component="label"
                  onClick={() => {
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
              aria-label="Add Room"
              title="Add Room"
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
                  <FormControlLabel control={<Checkbox name="essentials" />} label="Essentials" aria-label="Essentials" />
                  <FormControlLabel control={<Checkbox name="air-conditioning" />} label="Air conditioning" aria-label="Air conditioning" />
                  <FormControlLabel control={<Checkbox name="hair-dryer" />} label="Hair dryer" aria-label="Hair dryer" />
                  <FormControlLabel control={<Checkbox name="iron" />} label="Iron" aria-label="Iron" />
                  <FormControlLabel control={<Checkbox name="dryer" />} label="Dryer" aria-label="Dryer" />
                  <FormControlLabel control={<Checkbox name="TV" />} label="TV" aria-label="TV" />
                  <FormControlLabel control={<Checkbox name="indoor-fireplace" />} label="Indoor fireplace" aria-label="Indoor fireplace" />
                  <FormControlLabel control={<Checkbox name="private-entrance" />} label="Private Entrance" aria-label="Private Entrance" />
                </FormGroup>
              </Grid>
              <Grid item xs={6} md={6}>
              <FormGroup>
                  <FormControlLabel control={<Checkbox name="kitchen" />} label="Kitchen" aria-label="Kitchen" />
                  <FormControlLabel control={<Checkbox name="heating" />} label="Heating" aria-label="Heating" />
                  <FormControlLabel control={<Checkbox name="hangers" />} label="Hangers" aria-label="Hangers" />
                  <FormControlLabel control={<Checkbox name="washer" />} label="Washer" aria-label="Washer" />
                  <FormControlLabel control={<Checkbox name="hot-water" />} label="Hot water" aria-label="Hot water" />
                  <FormControlLabel control={<Checkbox name="cable-TV" />} label="Cable TV" aria-label="Cable TV" />
                  <FormControlLabel control={<Checkbox name="private-bathroom" />} label="Private bathroom" aria-label="Private bathroom" />
                  <FormControlLabel control={<Checkbox name="private-living-room" />} label="Private living room" aria-label="Private living room" />
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
                  id="new-listing-youtube-url"
                  label="Youtube video url"
                  name="youtube-url"
                  autoComplete="Youtube video url"
                  helperText='URL is the format of https://www.youtube.com/watch?v={id}'
                  inputProps={{ 'aria-label': 'Youtube video url' }}>
              </TextField>
              <Button
                variant="contained"
                component="label"
              >
                Upload Image Thumbnail
                <input
                  name="image-thumbnail"
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
                    aria-label="Remove image"
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

            <Button
              type="submit"
              name='submit'
              fullWidth
              aria-label="Create listing"
              variant="contained"
              color="primary"
              sx={{ mt: 3, mb: 2 }}
            >
              Create Listing
            </Button>

            <Button
                variant="contained"
                component="label"
                fullWidth
                aria-label="Import Listing from JSON"
                color="primary"
              >
                Create Listing by uploading JSON file
                <input
                  type="file"
                  accept=".json"
                  onChange={jsonOnChange}
                  hidden
                />
            </Button>
          </Box>
        </Box>
      </Container>
      <Snackbar open={snackbarOpen} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} autoHideDuration={3000} onClose={() => setSnackbarOpen(false)}>
        <Alert severity="error">Thumbnail cannot be empty</Alert>
      </Snackbar>
    </ThemeProvider>

  );
}

export default ListingNewPage;
