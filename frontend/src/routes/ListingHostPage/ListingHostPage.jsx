import React, { useState } from 'react';

import ListingCard from '../../components/ListingCard';
import UserChecking from '../../components/UserChecking';
import { fetchURL, showAlert, getBookings, getListingData, dateIsWithinRange, setupHistoryPoint } from '../../helper';
import { Box, Button, CircularProgress, Grid, ThemeProvider, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AirBrBTheme } from '../../components/Theme';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import moment from 'moment';
import { Empty } from 'antd';

function ListingHostPage () {
  // use state
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [graph, setGraph] = useState([])
  const navigate = useNavigate();

  // in page function
  const fetchListings = async () => {
    setLoading(true)
    const res = await fetchURL('listings', 'GET');
    if (res.error) {
      showAlert(res.error);
    } else {
      const results = []
      for (const listing of res.listings) {
        if (listing.owner === localStorage.email && listing.id) {
          results.push(listing)
        }
      }

      results.sort((a, b) => (a.title > b.title) ? 1 : -1)

      setListings(results);
      setLoading(false)
    }
  }

  const newListingClick = () => {
    navigate('/listings/new')
  }

  function keyExistInArrayOfObjects (array, key) {
    for (const item of array) {
      if (item.name === key) {
        return true;
      }
    }
    return false
  }

  const fetchProfitGraph = async () => {
    const bookings = await getBookings()
    const data = []

    const today = new Date();
    let loop = new Date(new Date().setDate(today.getDate() - 30));
    while (loop <= today) {
      data.push({
        name: loop.toDateString(),
        profit: 0
      })
      loop = new Date(loop.setDate(loop.getDate() + 1));
    }

    for (const booking of bookings) {
      if (booking.status === 'accepted') {
        const listing = await getListingData(booking.listingId)
        if (listing.owner === localStorage.email) {
          const startDateString = booking.dateRange.start
          const endDateString = booking.dateRange.end
          const start = new Date(startDateString.substring(0, 4), startDateString.substring(4, 6) - 1, startDateString.substring(6, 8))
          const end = new Date(endDateString.substring(0, 4), endDateString.substring(4, 6) - 1, endDateString.substring(6, 8))

          const date1 = moment(startDateString, 'YYYYMMDD')
          const date2 = moment(endDateString, 'YYYYMMDD')
          let loop = new Date(start)
          const today = new Date();
          const profit = Math.round(booking.totalPrice / date2.diff(date1, 'days'))

          while (loop <= end) {
            if (dateIsWithinRange(loop, loop, new Date(new Date().setDate(today.getDate() - 30)), new Date())) {
              if (keyExistInArrayOfObjects(data, loop.toDateString())) {
                const index = data.findIndex(data => data.name === loop.toDateString())
                data[index].profit = data[index].profit + profit
              } else {
                data.push({
                  name: loop.toDateString(),
                  profit
                })
              }
            }
            loop = new Date(loop.setDate(loop.getDate() + 1));
          }
        }
      }
    }

    return data
  }

  React.useEffect(async () => {
    setupHistoryPoint('/');
    fetchListings();
    setGraph(await fetchProfitGraph())
  }, []);

  return (
    <ThemeProvider theme={AirBrBTheme}>
      <UserChecking needLogin={true} />
      <Box mt={2} sx={{ position: 'relative' }} style={{ marginBottom: 10 }}>
        <Typography
          variant='h5'
          align='center'
        >
          Profit made
        </Typography >
      </Box>
      <Box style={{ display: 'flex', justifyContent: 'center' }}>
      <ResponsiveContainer width="95%" height={300}>
        <LineChart
            width='100%'
            height={300}
            data={graph}
            margin={{
              top: 5,
              right: 50,
              left: 5,
              bottom: 5
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="profit"
              stroke="#FF5A5F"
              activeDot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
      <Box sx={{ position: 'relative' }}>
        <Typography
            variant='h5'
            align='center'
            style={{ marginTop: 30 }}
          >
            My Listing
        </Typography >
        <Button
          name="new-listing"
          sx={{ paddingLeft: '10px', paddingRight: '10px', position: 'absolute', right: '10px', top: '0' }}
          variant="outlined"
          onClick={newListingClick}
        >
          New Listing
        </Button>
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
                        id={listing.id}
                        isHosting={true}
                        fetchListings={fetchListings}
                      />
                    </Grid>
                ))
                : <Empty
                  description='No Listing'
                  image={Empty.PRESENTED_IMAGE_SIMPLE} />
          }
        </Grid>
    </ThemeProvider>
  );
}

export default ListingHostPage;
