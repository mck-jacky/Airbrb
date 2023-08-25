import React, { useState, useContext, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';
import SearchIcon from '@mui/icons-material/Search';
import TuneIcon from '@mui/icons-material/Tune';
import IconButton from '@mui/material/IconButton';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import { UserContext } from '../../userContext';
import { fetchURL, isLogin, sortListingWithStatus, obtainSvgRating, obtainEarliestAvailability } from '../../helper';
import { Modal, Button, DatePicker, Radio, Typography, InputNumber, Switch, Space } from 'antd';
import Slider from '@mui/material/Slider';
import moment from 'moment';
import { Box, InputAdornment } from '@mui/material';

const { Title } = Typography;

const SearchBar = () => {
  const systemObj = useContext(UserContext)
  // SERVER
  async function getListings () {
    const res = await fetchURL('listings', 'GET')
    return res.listings
  }

  async function getListingData (listingId) {
    const res = await fetchURL(`listings/${listingId}`, 'GET', {
      listingid: listingId
    })
    return res.listing
  }

  // TEXT BOX SEARCH
  const [input, setInput] = useState('')
  const listingObj = useContext(UserContext)

  function handleChange (event) {
    setInput(event.target.value);
  }

  async function handleSearch (event, searchText) {
    event.preventDefault();

    listingObj.setListing([])
    listingObj.setListingIsReady(false)
    const listings = await getListings()
    handleReset();

    if (searchText === '') {
      if (isLogin(systemObj)) {
        await sortListingWithStatus(listings)
      }

      let i = listings.length
      while (i--) {
        const listingData = await getListingData(listings[i].id)
        if (!listingData.published || (isLogin(systemObj) && listingData.owner === localStorage.email)) {
          listings.splice(i, 1)
        }
      }
    }

    const filteredListing = []

    for (const listing of listings) {
      const listingData = await getListingData(listing.id)
      if (listingData.title.toLowerCase().search(searchText.toLowerCase()) !== -1 || listingData.address.city.toLowerCase().search(searchText.toLowerCase()) !== -1) {
        filteredListing.push(listing)
      }
    }

    if (isLogin(systemObj)) {
      await sortListingWithStatus(filteredListing)
    }

    let i = filteredListing.length
    while (i--) {
      const listingData = await getListingData(filteredListing[i].id)
      const dates = obtainEarliestAvailability(listingData.availability)
      if (!listingData.published || (isLogin(systemObj) && listingData.owner === localStorage.email) || !dates[0]) {
        filteredListing.splice(i, 1)
      }
    }

    filteredListing.sort((a, b) => (a.title > b.title) ? 1 : -1)

    listingObj.setListing(filteredListing)
    listingObj.setListingIsReady(true)
  }

  // FILTER MODAL
  async function filter () {
    if (systemObj.searchDate.length === 2 && systemObj.searchDate[0] === systemObj.searchDate[1]) {
      alert('Start date and end date cannot be the same')
      return;
    }

    setInput('')
    listingObj.setListingIsReady(false)

    const listings = await getListings()

    const filteredListing = []

    // Sort by number of bedrooms and price range
    for (const listing of listings) {
      const listingData = await getListingData(listing.id)
      listing.avgRating = obtainSvgRating(listingData.reviews)
      if (listingData.metadata.bedrooms.length >= numOfBedrooms[0] && listingData.metadata.bedrooms.length <= numOfBedrooms[1]) {
        if (listingData.price >= priceRange[0] && listingData.price <= priceRange[1]) {
          filteredListing.push(listing)
        }
      }
    }

    // Sort by average rating
    if (sort === 'Rating: Low to High') {
      filteredListing.sort((a, b) => (a.avgRating > b.avgRating) ? 1 : -1)
    } else if (sort === 'Rating: High to Low') {
      filteredListing.sort((a, b) => (a.avgRating > b.avgRating) ? -1 : 1)
    } else if (sort === 'Default a-z') {
      filteredListing.sort((a, b) => (a.title > b.title) ? 1 : -1)
    }

    const searchStartDate = moment(systemObj.searchDate[0], 'YYYY/MM/DD')
    const searchEndDate = moment(systemObj.searchDate[1], 'YYYY/MM/DD')
    const dayDiff = searchEndDate.diff(searchStartDate, 'days')
    searchStartDate.isAfter(searchEndDate)
    const diffList = []
    if (flexibleIsOn) {
      for (let i = -flexValue; i <= flexValue; i++) {
        diffList.push(i)
      }
    } else {
      diffList.push(0)
    }

    const dateRangeChecking = (start, end, deltaStart, deltaEnd) => {
      if (!deltaStart.isValid() ||
          !deltaEnd.isValid() ||
          (start.isSameOrBefore(deltaStart) && end.isSameOrAfter(deltaEnd))) {
        return true
      }

      return false
    }

    for (const listing of filteredListing) {
      const listingData = await getListingData(listing.id)
      let match = false
      for (const date of listingData.availability) {
        for (const delta of diffList) {
          const start = moment(date.start, 'YYYYMMDD')
          const end = moment(date.end, 'YYYYMMDD')
          const deltaStart = searchStartDate.clone().subtract(delta, 'days')
          const deltaEnd = deltaStart.clone().add(dayDiff, 'days')

          if (dateRangeChecking(start, end, deltaStart, deltaEnd)) {
            match = true
            listing.dateCheck = true
            break
          }
        }
      }
      if (!match) {
        listing.dateCheck = false
      }
    }

    let i = filteredListing.length
    while (i--) {
      if (filteredListing[i].dateCheck === false) {
        filteredListing.splice(i, 1)
      }
    }

    if (isLogin(systemObj)) {
      await sortListingWithStatus(filteredListing)
    }

    i = filteredListing.length
    while (i--) {
      const listingData = await getListingData(filteredListing[i].id)
      const dates = obtainEarliestAvailability(listingData.availability)
      if (!listingData.published || (isLogin(systemObj) && listingData.owner === localStorage.email) || !dates[0]) {
        filteredListing.splice(i, 1)
      }
    }

    systemObj.setListing(filteredListing)
    listingObj.setListingIsReady(true)
  }

  const [open, setOpen] = useState(false);

  useEffect(() => {
    handleReset()
  }, [systemObj.user]);

  const showModal = () => {
    setOpen(true);
  };

  const handleSubmit = () => {
    setOpen(false);

    filter(numOfBedrooms, systemObj.searchDate, priceRange, sort)
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handleReset = () => {
    setDate([null, null])
    systemObj.setSearchDate([])
    setFlexibleIsOn(false)
    setFlexValue(4)
    setSort('Default a-z')
    setNumOfBedrooms([1, 8])
    setPriceRange([1, 10000])
  }

  function valuetext (value) {
    return value;
  }

  const [date, setDate] = React.useState([null, null]);
  // const [dateRange, setDateRange] = React.useState('');
  const [numOfBedrooms, setNumOfBedrooms] = React.useState([1, 8]);
  const [priceRange, setPriceRange] = React.useState([1, 10000]);
  const [sort, setSort] = useState('Default a-z');
  const [flexibleIsOn, setFlexibleIsOn] = React.useState(false)
  const [flexValue, setFlexValue] = React.useState(4)

  const handleDateRangeChange = (event, dateRange) => {
    const startDate = moment(dateRange[0], dateFormat)
    const endDate = moment(dateRange[1], dateFormat)
    if (startDate.isValid() && endDate.isValid()) {
      setDate([startDate, endDate])
      systemObj.setSearchDate(dateRange)
    } else {
      setDate([])
      systemObj.setSearchDate([])
    }
  }

  const handleBedroomChange = (event, newValue) => {
    setNumOfBedrooms(newValue);
  };

  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue);
  };

  const dateFormat = 'YYYY/MM/DD';
  const { RangePicker } = DatePicker;

  const disabledDate = (current) => {
    return current && current.isBefore(moment(), 'day');
  };

  const options = [
    {
      label: 'Rating: Low to High',
      value: 'Rating: Low to High',
    },
    {
      label: 'Rating: High to Low',
      value: 'Rating: High to Low',
    },
    {
      label: 'Default a-z',
      value: 'Default a-z',
    }
  ];

  const sortOnChange = ({ target: { value } }) => {
    setSort(value);
  };

  const endAdornment = () => {
    if (input) {
      return (
        <InputAdornment position='end'>
          <IconButton
            name="clear-button"
            onClick={(e) => { setInput(''); handleSearch(e, '') }}
            onMouseDown={(e) => e.preventDefault()}
            color='primary'
          >
            <ClearOutlinedIcon />
          </IconButton>
        </InputAdornment>
      );
    }

    return '';
  };

  return (
    <Paper
      sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: [220, 300, 500] }}
    >
      <Box
        component="form"
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch(e, input);
        }}
        sx={{ ml: 1, flex: 1 }}
      >
      <InputBase
        name="search-bar"
        sx={{ width: '100%' }}
        placeholder="Anywhere"
        inputProps={{ 'aria-label': 'search airbnb' }}
        onChange={handleChange}
        value={input}
        endAdornment={endAdornment()}
      />
      </Box>
      <IconButton name="search-button" type="button" sx={{ p: '10px' }} aria-label="search" onClick={(e) => handleSearch(e, input)}>
        <SearchIcon />
      </IconButton>
      <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
      <IconButton name="filter-button" color="primary" sx={{ p: '10px' }} aria-label="filter" onClick={showModal}>
        <TuneIcon />
      </IconButton>
      <Modal
        open={open}
        title="Filters"
        onOk={handleSubmit}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleReset}>
            Reset
          </Button>,
          <Button name="modal-search-button" key="submit" type="primary" onClick={handleSubmit}>
            Search
          </Button>
        ]}
      >
        <Title level={3}>Number of bedrooms</Title>
        <Slider
          getAriaLabel={() => 'Number of bedrooms range'}
          value={numOfBedrooms}
          onChange={handleBedroomChange}
          valueLabelDisplay="auto"
          getAriaValueText={valuetext}
          step={1}
          marks
          min={1}
          max={8}
          color="blue"
        />

        <Title level={3}>Choose dates</Title>
        <Space
          direction="vertical"
          size="middle"
          style={{
            display: 'flex',
          }}
        >
          <RangePicker disabledDate={disabledDate} style={{ marginTop: 10, marginBottom: 10, marginLeft: 0 }}
            format={dateFormat}
            onChange={handleDateRangeChange}
            value={date}
          />

          <Space>
            <Switch checkedChildren="Flexible Date" unCheckedChildren="Flexible Date" onChange={() => setFlexibleIsOn(!flexibleIsOn)} checked={flexibleIsOn} />
            <InputNumber min={1} max={8} value={flexValue} onChange={(value) => { setFlexValue(value) }} disabled={!flexibleIsOn}/>
          </Space>
        </Space>

        <Title level={3}>Price</Title>
        <Slider
          getAriaLabel={() => 'Price range'}
          value={priceRange}
          onChange={handlePriceChange}
          valueLabelDisplay="auto"
          getAriaValueText={valuetext}
          min={1}
          max={10000}
          color="blue"
        />

        <Title level={3}>Sort by rating</Title>
        <Radio.Group options={options} onChange={sortOnChange} value={sort} optionType="button" buttonStyle="solid" />

      </Modal>
    </Paper>
  )
}

export default SearchBar
