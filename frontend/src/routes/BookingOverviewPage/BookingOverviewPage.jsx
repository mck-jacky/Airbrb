import React, { useState, useEffect } from 'react';

import { Box, CircularProgress, Grid, ThemeProvider, Typography } from '@mui/material';
import { Empty } from 'antd';

import ListingCard from '../../components/ListingCard';
import { AirBrBTheme } from '../../components/Theme';
import UserChecking from '../../components/UserChecking';

import { fetchURL, getBookings, getListingData } from '../../helper';

function BookingOverviewPage () {
  // use state
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchBookings = async (fullListings) => {
    const bookings = await getBookings()
    const bookingInfos = []
    const results = []
    if (bookings) {
      for (const booking of bookings) {
        // booking found
        if (booking.owner === localStorage.email) {
          const listingData = await getListingData(booking.listingId)
          // not yet in the list
          if (listingData &&
              listingData.published &&
              bookingInfos.indexOf(parseInt(booking.listingId)) === -1) {
            bookingInfos.push(parseInt(booking.listingId))
            listingData.id = booking.listingId
            listingData.status = booking.status
            results.push(listingData)
          }
        }
      }
    }

    setListings(results)
    setLoading(false)
  }

  const fetchListings = async () => {
    setLoading(true)
    const res = await fetchURL('listings', 'GET');
    if (res.error) {
      alert(res.error);
    } else {
      fetchBookings(res.listings)
    }
  }

  useEffect(() => {
    fetchListings()
  }, [])

  return (
    <ThemeProvider theme={AirBrBTheme}>
      <UserChecking needLogin={true} />
      <Box sx={{ position: 'relative' }}>
        <Typography
            variant='h5'
            align='center'
            style={{ marginTop: 30 }}
          >
            My Bookings
        </Typography >
      </Box>
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="flex-start"
        spacing={5}
        marginTop={2}
      >
          {
            loading
              ? <Box sx={{ display: 'flex' }}><CircularProgress color="primary" /></Box>
              : listings.length > 0
                ? listings.map((listing) => (
                    <Grid item key={listing.id}>
                      <ListingCard
                        id={parseInt(listing.id)}
                        isAccepted={listing.status === 'accepted'}
                        isPending={listing.status === 'pending'}
                        isHosting={false}
                      />
                    </Grid>
                ))
                : <Empty
                  description='No Listing'
                  image={Empty.PRESENTED_IMAGE_SIMPLE} />
          }
        </Grid>
    </ThemeProvider>
  )
}

export default BookingOverviewPage;
