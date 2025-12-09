import "react-swipeable-list/dist/styles.css";

import { makeStyles } from "@quimera/styles";
import {
  SwipeableList,
  SwipeableListItem,
  SwipeAction,
  SwipeListType,
  TrailingActions,
} from "@quimera/thirdparty";
import { useState } from "react";

import { SkewedAdornment, SkewedListItem } from ".";

const useStyles = makeStyles(theme => ({
  swipeAction: {
    "display": "flex",
    "justifyContent": "center",
    "alignItems": "center",
    "margin": "5px 7px",
    "width": "100px",
    "color": "white",
    "boxShadow": "0 0 5px 2px #c1c1c1",
    "transform": "skew(-20deg)",
    "&>*": {
      transform: "skew(20deg)",
    },
  },
  successSwipeAction: {
    backgroundColor: "#99E2CE",
  },
  success_altSwipeAction: {
    backgroundColor: "#46C756",
  },
  errorSwipeAction: {
    backgroundColor: "#FF9191",
  },
}));

function List({
  type = "ios",
  fullswipe = false,
  data,
  dark,
  actions,
  callback,
  onClick,
  ...props
}) {
  const [isSwiping, setSwiping] = useState(false);
  const classes = useStyles();

  const handleClick = (e, item) => {
    if (!onClick) {
      return;
    }

    e.stopPropagation();
    !isSwiping && onClick?.(item);
  };

  const onSwipe = value => {
    setSwiping(value);
    callback?.(value);
  };

  const trailingActions = item => (
    <TrailingActions>
      {actions(item).map(action => (
        <SwipeAction key={action.name} onClick={action.trigger}>
          <div className={`${classes.swipeAction} ${classes[`${action.class}SwipeAction`]}`}>
            <span>{action.name}</span>
          </div>
        </SwipeAction>
      ))}
    </TrailingActions>
  );

  return (
    <SwipeableList
      type={type === "ios" ? SwipeListType.IOS : SwipeListType.ANDROID}
      fullSwipe={fullswipe}
    >
      {data?.map((item, idx) => (
        <SwipeableListItem
          key={idx}
          trailingActions={trailingActions(item)}
          onSwipeStart={() => onSwipe(true)}
          onSwipeEnd={() => setTimeout(() => onSwipe(false), 100)}
        >
          <SkewedListItem
            onClick={e => handleClick(e, item)}
            text={item.text}
            data1={[item.auxData1, item.auxData1ud]}
            data2={[item.auxData2, item.auxData2ud]}
            finished={item.finished}
            dark={dark}
            success={item.success}
            error={item.error}
          />
          {item.adornment && (
            <SkewedAdornment
              adornment={item.adornment}
              adornmentClass={item.adornmentClass}
              finished={item.finished}
            />
          )}
        </SwipeableListItem>
      ))}
    </SwipeableList>
  );
}

export default List;
