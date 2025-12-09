import { useEffect, useState } from "react";

export default function useOnlineStatus() {
  const [isOnline, setOnline] = useState(true);

  useEffect(() => {
    window.addEventListener("offline", () => {
      setOnline(false);
    });
    window.addEventListener("online", () => {
      setOnline(true);
    });

    return () => {
      window.removeEventListener("offline", () => {
        setOnline(false);
      });
      window.removeEventListener("online", () => {
        setOnline(true);
      });
    };
  }, []);

  return isOnline;
}
