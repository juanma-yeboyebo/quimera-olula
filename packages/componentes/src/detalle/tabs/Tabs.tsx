import React, { useEffect, useRef, useState } from "react";
import estilos from "./tabs.module.css";

interface TabProps {
  label: string;
  children: React.ReactNode;
}

interface TabsProps {
  children: React.ReactElement<TabProps>[];
  className?: string;
}

const Tab: React.FC<TabProps> = ({ children }) => {
  return <div>{children}</div>;
};

const Tabs: React.FC<TabsProps> = ({ children, className }) => {
  const [activeTab, setActiveTab] = React.useState(0);
  const [showArrows, setShowArrows] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Detecta overflow
  useEffect(() => {
    const slider = sliderRef.current;
    if (slider) {
      setShowArrows(slider.scrollWidth > slider.clientWidth);
    }
    const handleResize = () => {
      if (slider) {
        setShowArrows(slider.scrollWidth > slider.clientWidth);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [children]);

  // Scroll al hacer clic en flechas
  const scrollSlider = (direction: "left" | "right") => {
    const slider = sliderRef.current;
    if (slider) {
      const scrollAmount = slider.clientWidth * 0.6;
      slider.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const { detalleTabs, active } = estilos;

  return (
    <div className={`${detalleTabs} ${className || ""}`.trim()}>
      <div className={estilos.tabSliderWrapper}>
        {showArrows && (
          <span
            className={estilos.arrow + " " + estilos.left}
            onClick={() => scrollSlider("left")}
          >
            &lt;
          </span>
        )}
        <div className={estilos.tabHeaderSlider} ref={sliderRef}>
          {children.map((tab, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(index)}
              className={activeTab === index ? active : "inactive"}
            >
              {tab.props.label}
            </button>
          ))}
        </div>
        {showArrows && (
          <span
            className={estilos.arrow + " " + estilos.right}
            onClick={() => scrollSlider("right")}
          >
            &gt;
          </span>
        )}
      </div>
      <div className="tab-content">{children[activeTab]}</div>
    </div>
  );
};

export { Tab, Tabs };
