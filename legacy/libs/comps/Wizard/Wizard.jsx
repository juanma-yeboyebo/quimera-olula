import { useState } from "react";

import { Box, Button, Field, Icon, QSection, Typography } from "../";

const dotBoxStyle = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  gap: "0.25rem",
  marginTop: "5px",
};

const stepDotStyle = {
  borderRadius: "100%",
  width: "10px",
  height: "10px",
  border: "1px solid grey",
  backgroundColor: "white",
};

const activeDotStyle = {
  backgroundColor: "indigo",
};

const skipDotStyle = {
  backgroundColor: "grey",
};

const completedDotStyle = {
  backgroundColor: "green",
};

export default function Wizard({ parentRef, schema, action, steps }) {
  const [active, setActive] = useState(0);

  const stepsWithSummary = [...steps, { title: "Resumen" }];

  const cancelCallback = () =>
    setActive(
      active -
        1 -
        [...stepsWithSummary]
          .slice(0, active)
          .reverse()
          .findIndex(step => !(step?.skip ?? false)),
    );

  const saveCallback = () =>
    setActive(
      active +
        1 +
        [...stepsWithSummary].slice(active + 1).findIndex(step => !(step?.skip ?? false)),
    );

  const SummaryStep = () => (
    <>
      {steps
        .filter(step => !(step?.skip ?? false))
        .map(step => (
          <QSection key={`summary_${step.title}`} title={step.title} alwaysInactive={true}>
            {step.staticComp ?? (
              <Box display="flex" style={{ gap: "0.5rem" }} alignItems="center">
                <Icon>{step.icon}</Icon>
                <Typography variant="h6">{step.staticValue}</Typography>
              </Box>
            )}
          </QSection>
        ))}
      <Box display="flex" justifyContent="space-evenly" style={{ margin: "20px 0 25px" }}>
        <Button id="wizardSummaryCancel" variant="text" color="secondary" onClick={cancelCallback}>
          <Icon>arrow_back</Icon>
          &nbsp; Volver
        </Button>
        <Button id={action.id} variant="outlined" color="primary">
          <Icon>rocket_launch</Icon>
          &nbsp;
          {action.label}
        </Button>
      </Box>
    </>
  );

  const StepsDotBox = () => (
    <div style={dotBoxStyle}>
      {stepsWithSummary.map((step, idx) => {
        return (
          <span
            key={`dot_${step.title}`}
            style={{
              ...stepDotStyle,
              ...(step.skip ? skipDotStyle : {}),
              ...(step.completed ? completedDotStyle : {}),
              ...(idx === active ? activeDotStyle : {}),
            }}
            onClick={() => idx < active && !(step?.skip ?? false) && setActive(idx)}
          >
            &nbsp;
          </span>
        );
      })}
    </div>
  );

  return (
    <>
      {active !== stepsWithSummary.length - 1 ? (
        <>
          {steps.map((step, idx) => (
            <Box
              key={`wrapper_${step.title}`}
              style={{ display: idx === active ? "block" : "none" }}
            >
              <QSection
                title={step.title}
                alwaysActive={true}
                cancel={{
                  icon: <Icon>arrow_back</Icon>,
                  text: "Volver",
                  disabled: () => idx === 0,
                  callback: cancelCallback,
                }}
                save={{
                  icon: <Icon>arrow_forward</Icon>,
                  text: "Siguiente",
                  disabled: () => idx === stepsWithSummary.length - 1 || !step.completed,
                  callback: saveCallback,
                }}
                dynamicComp={() =>
                  step.dynamicComp ?? (
                    <Field.Schema
                      id={`${parentRef}.${step.field}`}
                      schema={schema}
                      label=""
                      fullWidth
                      autoFocus
                      {...(step.icon
                        ? {
                            startAdornment: <Icon>{step.icon}</Icon>,
                          }
                        : {})}
                    />
                  )
                }
              />
            </Box>
          ))}
        </>
      ) : (
        <SummaryStep />
      )}

      <StepsDotBox />
    </>
  );
}
