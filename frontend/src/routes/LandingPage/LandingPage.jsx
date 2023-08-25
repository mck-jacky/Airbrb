import { React, useEffect, useContext } from 'react';
import ListingCard from '../../components/ListingCard'
import { Grid, Box } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { getBookings, getListings, getListingData, isLogin, setupHistoryPoint, obtainEarliestAvailability } from '../../helper';
import { UserContext } from '../../userContext';
import { Empty } from 'antd';

import { ThemeProvider } from '@mui/material/styles';
import { AirBrBTheme } from '../../components/Theme';

const LandingPage = () => {
  const systemObj = useContext(UserContext)

  // in page function
  const fetchListings = async () => {
    setupHistoryPoint('/')
    systemObj.setListing([])
    systemObj.setListingIsReady(false)

    systemObj.setSearchDate([])
    const listings = await getListings()

    if (isLogin(systemObj)) {
      const bookings = await getBookings()
      const listingWithStatus = []

      if (bookings) {
        for (const booking of bookings) {
          if (booking.owner === localStorage.email) {
            for (const [i, listing] of listings.entries()) {
              if (parseInt(booking.listingId) === parseInt(listing.id)) {
                if (booking.status === 'accepted') {
                  listing.accepted = true
                  listingWithStatus.unshift(listing)
                  listings.splice(i, 1)
                }
                if (booking.status === 'pending') {
                  listing.pending = true
                  listingWithStatus.push(listing)
                  listings.splice(i, 1)
                }
              }
            }
          }
        }
      }

      listings.sort((a, b) => (a.title > b.title) ? 1 : -1)

      for (const listing of listingWithStatus) {
        listings.unshift(listing)
      }
    } else {
      listings.sort((a, b) => (a.title > b.title) ? 1 : -1)
    }

    let i = listings.length
    while (i--) {
      const listingData = await getListingData(listings[i].id)
      const dates = obtainEarliestAvailability(listingData.availability)
      if (!listingData.published || (isLogin(systemObj) && listingData.owner === localStorage.email) || !dates[0]) {
        listings.splice(i, 1)
      }
    }

    systemObj.setListing(listings)
    systemObj.setListingIsReady(true)
  }

  useEffect(async () => {
    fetchListings();
  }, [systemObj.user])

  return (
    <ThemeProvider theme={AirBrBTheme}>
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="flex-start"
        spacing={5}
        marginTop={2}
      >
          {systemObj.listingIsReady
            ? systemObj.listing.length > 0
              ? systemObj.listing.map(listing => (
                <Grid item key={listing.id}>
                  <ListingCard
                    isAccepted={listing.accepted}
                    isPending={listing.pending}
                    id={listing.id}
                    isHosting={false}
                  />
                </Grid>
              ))
              : <Empty description='No Listing' image={Empty.PRESENTED_IMAGE_SIMPLE} />
            : <Box sx={{ display: 'flex' }}><CircularProgress color="primary" /></Box>
          }
      </Grid>
    </ThemeProvider>
  )
}

export default LandingPage
