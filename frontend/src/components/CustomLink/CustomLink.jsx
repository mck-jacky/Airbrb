import { Link } from 'react-router-dom';

import { styled } from '@mui/system'

const CustomLink = styled(Link)({
  '&': {
    color: '#FF5A5F'
  },
  '&:hover': {
    color: '#993639'
  }
})

export default CustomLink;
