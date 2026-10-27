"use client";

import { useEffect } from "react";
import { initializeLanding } from "../lib/interactions";

export default function SiteInteractions() {
  useEffect(() => initializeLanding(), []);
  return null;
}
