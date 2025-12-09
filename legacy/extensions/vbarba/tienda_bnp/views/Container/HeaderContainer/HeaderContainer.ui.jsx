import { Box } from "@quimera/thirdparty";
import Quimera, { useWidth, util } from "quimera";

function HeaderContainer({ useStyles }) {
  const renderHeader = util.renderHeader();
  const width = useWidth();
  const mobile = ["xs", "sm"].includes(width);
  const headerHeight = renderHeader ? (mobile ? 185 : 215) : 0;

  return (
    <Quimera.Template id="HeaderContainer">
      <Box id="HeaderContainer" height={`${headerHeight}px`}>
        {renderHeader && <Quimera.View id="Header" />}
        <Quimera.View id="Dialog" />
      </Box>
    </Quimera.Template>
  );
}

HeaderContainer.displayName = "HeaderContainer";
export default HeaderContainer;
