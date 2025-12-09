import { makeStyles } from "@quimera/styles";
import { useState } from "react";

const today = new Date();
const firstDay = new Date();
firstDay.setDate(1);
const first = firstDay.getDay() || 7;
const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
const last = lastDay.getDate();

const months = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

const dayArray = new Array(last).fill(null).map((i, idx) => idx + 1);
new Array(first - 1).fill(null).forEach(_ => dayArray.unshift("."));
new Array(7 - lastDay.getDay()).fill(null).forEach(_ => dayArray.push("."));

const useStyles = makeStyles(theme => ({
  wrapper: {
    padding: "8px 0",
  },
  title: {
    fontSize: "1.3em",
  },
  list: {
    listStyle: "none",
    display: "grid",
    gridTemplateColumns: "repeat(7, 1fr)",
    padding: "0 10px",
    margin: "5px 0",
  },
  item: {
    display: "flex",
    flexDirection: "column",
    textAlign: "center",
  },
  past: {
    color: theme.palette.grey[400],
  },
  future: {
    color: "#505050",
  },
  today: {
    color: "white",
    backgroundColor: "red",
  },
  day: {
    borderRadius: "100%",
    // padding: '5px 0',
    display: "grid",
    placeContent: "center",
    aspectRatio: 1,
    margin: "0 7px",
    fontSize: "1.3em",
    fontWeight: "bold",
  },
  points: {
    marginLeft: "-4px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "0",
    flexGrow: "0",
    flexBasis: "5px",
    maxHeight: "5px",
  },
  tarea: {
    width: "8px",
    color: "red",
    fontSize: "3em",
  },
  trato: {
    width: "8px",
    color: "green",
    fontSize: "3em",
  },
}));

const Day = ({ item, tareas, tratos }) => {
  const classes = useStyles();

  let dayClasses = classes.day;
  item === "." && (dayClasses += ` ${classes.past}`);
  item < today.getDate() && (dayClasses += ` ${classes.past}`);
  item > today.getDate() && (dayClasses += ` ${classes.future}`);
  item === today.getDate() && (dayClasses += ` ${classes.today}`);

  return (
    <li className={classes.item}>
      <span className={dayClasses}>{item === "." ? "." : item.toString().padStart(2, "0")}</span>
      <span className={classes.points}>
        {item !== today.getDate() &&
          tareas &&
          new Array(tareas).fill(null).map((t, idx) => (
            idx < 5 && (
              <span key={idx} className={classes.tarea}>
                ·
              </span>
            )
          ))}
        {item !== today.getDate() &&
          tratos &&
          new Array(tratos).fill(null).map((t, idx) => (
            idx < 5 && (
              <span key={idx} className={classes.trato}>
                ·
              </span>
            )
          ))}
      </span>
    </li>
  );
};

export default function Calendar({ tareas, tratos }) {
  const [full, setFull] = useState(false);
  const classes = useStyles();
  const week = parseInt(dayArray.findIndex(i => i === today.getDate()) / 7);
  const days = full ? dayArray : dayArray.slice(week * 7, week * 7 + 7);

  return (
    <div className={classes.wrapper} onClick={() => setFull(!full)}>
      {full && (
        <h1 className={classes.title}>{`${months[today.getMonth()]} ${today.getFullYear()}`}</h1>
      )}
      <ol className={classes.list}>
        {days.map((i, idx) => (
          <Day
            key={idx}
            item={i}
            tareas={
              tareas[
              `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, "0")}-${i
                .toString()
                .padStart(2, "0")}`
              ]
            }
            tratos={
              tratos[
              `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, "0")}-${i
                .toString()
                .padStart(2, "0")}`
              ]
            }
          />
        ))}
      </ol>
    </div>
  );
}
