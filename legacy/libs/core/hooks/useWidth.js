import { useTheme } from "@quimera/styles";
import { useMediaQuery } from "@quimera/thirdparty";

export default function useWidth() {
  const theme = useTheme();
  const keys = [...theme.breakpoints.keys].reverse();

  return (
    keys.reduce((output, key) => {
      // eslint-disable-next-line
      const matches = useMediaQuery(theme.breakpoints.up(key));

      return !output && matches ? key : output;
    }, null) || "lg"
  );
}
