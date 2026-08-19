module.exports = {
  ci: {
    collect: {
      startServerCommand: "npm run start:quality -- -p 3101",
      startServerReadyPattern: "Ready in",
      startServerReadyTimeout: 120000,
      url: [
        "http://127.0.0.1:3101/",
        "http://127.0.0.1:3101/about",
        "http://127.0.0.1:3101/tracks",
        "http://127.0.0.1:3101/tracks/ai",
        "http://127.0.0.1:3101/tracks/software",
        "http://127.0.0.1:3101/tracks/database",
        "http://127.0.0.1:3101/tracks/cloud-iot",
        "http://127.0.0.1:3101/tracks/industrial",
        "http://127.0.0.1:3101/works",
        "http://127.0.0.1:3101/works/matrix-calculator",
        "http://127.0.0.1:3101/works/zgyc-smart-light",
        "http://127.0.0.1:3101/works/intellibuddy",
        "http://127.0.0.1:3101/awards",
        "http://127.0.0.1:3101/join",
      ],
      numberOfRuns: 1,
      settings: {
        chromeFlags: "--headless --no-sandbox --disable-gpu",
        formFactor: "mobile",
        screenEmulation: {
          mobile: true,
          width: 390,
          height: 844,
          deviceScaleFactor: 2,
          disabled: false,
        },
        throttlingMethod: "simulate",
      },
    },
    assert: {
      assertions: {
        "categories:accessibility": ["error", { minScore: 1 }],
        "categories:performance": ["error", { minScore: 0.9 }],
        "cumulative-layout-shift": ["error", { maxNumericValue: 0.1 }],
        "largest-contentful-paint": ["error", { maxNumericValue: 2500 }],
        "total-blocking-time": ["error", { maxNumericValue: 300 }],
      },
    },
    upload: { target: "filesystem", outputDir: ".lighthouseci/reports" },
  },
};
