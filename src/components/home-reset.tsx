"use client";

import { useEffect } from "react";

const HOME_RESET_KEYS = [
  "campaign-form-info",
  "campaign-preview",
  "campaign-submission-id",
];

export default function HomeReset() {
  useEffect(() => {
    HOME_RESET_KEYS.forEach((key) => localStorage.removeItem(key));
  }, []);

  return null;
}
