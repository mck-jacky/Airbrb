import { DatePicker } from 'antd';
import { styled } from '@mui/system'

const { RangePicker } = DatePicker;

const CustomRangePicker = styled(RangePicker)((props) => ({
  width: '90%',
  marginRight: '10px',
  marginBottom: '5px'
}));

export default CustomRangePicker;
