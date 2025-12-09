import PropTypes from "prop-types";

export default {
  propTypes: {
    parents: PropTypes.array,
    children: PropTypes.any,
  },
  defaultProps: {
    parents: [],
    children: [],
  },
};
