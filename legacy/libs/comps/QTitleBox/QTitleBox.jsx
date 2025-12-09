import { Box, Typography } from "../";

function QTitleBox({ children, titulo, ...props }) {
  return (
    <Box mb={1} {...props}>
      <Box>
        <Typography variant="overline">{titulo}</Typography>
      </Box>
      {children}
    </Box>
  );
}

export default QTitleBox;
