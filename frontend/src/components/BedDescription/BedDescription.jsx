import PropTypes from 'prop-types';

const BedDescription = ({ room }) => {
  const obtainBedString = (type, count) => {
    if (count > 0) {
      let resultStr = count + ' ' + type;
      resultStr += count > 1 ? ' beds' : ' bed'
      results.push(resultStr)
    }
  }

  const results = []
  obtainBedString('king', room.king ? room.king : 0)
  obtainBedString('queen', room.queen ? room.queen : 0)
  obtainBedString('double', room.double ? room.double : 0)
  obtainBedString('single', room.single ? room.single : 0)
  return results.join(', ')
}

BedDescription.propTypes = {
  room: PropTypes.object
}

export default BedDescription;
