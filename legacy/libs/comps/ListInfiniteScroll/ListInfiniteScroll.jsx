import { Box, InfiniteScroll } from "@quimera/thirdparty";

function ListInfiniteScroll({ next, hasMore, children, scrollableTarget = false, infiniteScrollProps, loader, ...props }) {
  const dataLength = Array.isArray(children) ? children.length : 0;

  return (
    <Box id="scrollableDiv" height="100%" overflow="auto" {...props}>
      <InfiniteScroll
        dataLength={dataLength}
        next={next}
        hasMore={hasMore}
        loader={loader || <h4>Loading...</h4>}
        endMessage={
          <p style={{ textAlign: "center" }}>
            <b></b>
          </p>
        }
        scrollableTarget={!!scrollableTarget && scrollableTarget}
        // Quitar scrollableTarget='scrollableDiv' para que depende del scroll principal de la pantalla
        {...infiniteScrollProps}
      >
        {children}
      </InfiniteScroll>
    </Box>
  );
}

export default ListInfiniteScroll;
