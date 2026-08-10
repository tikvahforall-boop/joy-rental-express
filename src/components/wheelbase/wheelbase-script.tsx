"use client";

import { useEffect } from "react";

const WHEELBASE_SCRIPT_URL =
  "https://d2toxav8qvoos4.cloudfront.net/latest/wheelbase-widget.js";

let scriptLoaded = false;

export function WheelbaseScript() {
  useEffect(() => {
    if (scriptLoaded || document.querySelector(`script[src="${WHEELBASE_SCRIPT_URL}"]`)) {
      scriptLoaded = true;
      return;
    }

    const script = document.createElement("script");
    script.type = "module";
    script.src = WHEELBASE_SCRIPT_URL;
    document.head.appendChild(script);
    scriptLoaded = true;
  }, []);

  return null;
}
