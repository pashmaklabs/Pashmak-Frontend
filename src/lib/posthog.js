import posthog from "posthog-js";

export const initPostHog = () => {
  if (window.__posthog_initialized) {
    return window.posthog;
  }

  const apiKey = "phc_sQFb5gZjU9Pr4okYf6rEipDhibaxEd7WuAfoWuQG78JL";

  posthog.init(apiKey, {
    api_host: "https://us.i.posthog.com",

    autocapture: true,
    capture_pageview: true,
    capture_pageleave: true,

    enable_heatmaps: true,
    capture_heatmaps: true,

    session_recording: {
      maskAllInputs: true,
      blockClass: "ph-no-capture",
    },

    debug: process.env.NODE_ENV === "development",

    loaded: (posthog) => {
      console.log("✅ PostHog loaded");
      console.log("🔥 Heatmaps enabled:", posthog.config.capture_heatmaps);
    },
  });

  window.__posthog_initialized = true;
  return posthog;
};

export const trackError = (error, context = {}) => {
  if (window.posthog) {
    window.posthog.capture("app_error", {
      error_message: error?.message || String(error),
      error_stack: error?.stack,
      context: context,
      url: window.location.href,
      timestamp: new Date().toISOString(),
    });
    console.error("Error tracked in PostHog:", error);
  }
};

export const trackClick = (elementName, additionalProps = {}) => {
  if (window.posthog) {
    window.posthog.capture("button_click", {
      element: elementName,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      ...additionalProps,
    });
  }
};

export const trackPageView = (pageName, additionalProps = {}) => {
  if (window.posthog) {
    window.posthog.capture("$pageview", {
      current_url: window.location.href,
      page_name: pageName,
      ...additionalProps,
    });
  }
};

export const testHeatmap = () => {
  if (window.posthog) {
    for (let i = 0; i < 10; i++) {
      window.posthog.capture("$heatmap_click_test", {
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        element: "test_button",
        pathname: window.location.pathname,
        timestamp: new Date().toISOString(),
      });
    }
    console.log("🧪 10 test heatmap events sent!");
  } else {
    console.error("❌ PostHog not initialized yet");
  }
};

export const checkHeatmapStatus = () => {
  if (!window.posthog) {
    console.error("❌ PostHog not initialized");
    return false;
  }

  const config = window.posthog.config;
  console.log("📊 Heatmap Status:", {
    enabled: config?.capture_heatmaps,
    autocapture: config?.autocapture,
    hasEvents: !!window.posthog.persistence?.props(),
  });

  return config?.capture_heatmaps;
};
