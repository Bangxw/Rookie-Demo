// ledger category 的 prop types 验证
export const ledgerCategoryPropTypes = (PropTypes) => ({
  ledgerCategory: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
    }).isRequired,
  ).isRequired,
});

// ledger subtypes 的 prop types 验证
export const ledgerSubtypesPropTypes = (PropTypes) => ({
  ledgerSubtypes: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
    }).isRequired,
  ).isRequired,
});

// ledger list 的 prop types 验证
export const ledgerListPropTypes = (PropTypes) => ({
  ledgerBilllist: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      date: PropTypes.number.isRequired,
      amount: PropTypes.number.isRequired,
      payway: PropTypes.string.isRequired,
      subtype_id: PropTypes.string.isRequired,
      description: PropTypes.string,
    }).isRequired,
  ).isRequired,
});
