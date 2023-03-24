import PropTypes from 'prop-types';

// ledger list 的 prop types 验证
export const ledgerBilllistProptypes = {
  ledgerBilllist: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      date: PropTypes.number.isRequired,
      amount: PropTypes.number.isRequired,
      payway: PropTypes.string.isRequired,
      subtype: PropTypes.string.isRequired,
      description: PropTypes.string,
    }).isRequired,
  ).isRequired,
};

// ledger subtypes 的 prop types 验证
export const ledgerSubtypesProptypes = {
  ledgerSubtypes: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
    }).isRequired,
  ).isRequired,
};

// ledger category 的 prop types 验证
export const ledgerCategoryProptypes = {
  ledgerCategory: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
    }).isRequired,
  ).isRequired,
};

// date piacker range 的 prop types 验证
export const datPickerRangeProptypes = {
  datePickerRange: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.number,
  ]).isRequired,
};
