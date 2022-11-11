module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: "#52f9cd",
          secondary: "#7ad102",
          accent: "#efc83b",
          neutral: "#181B25",
          "base-100": "#EBECEF",
          info: "#4CA7DC",
          success: "#3FD58F",
          warning: "#E8A530",
          error: "#EE7C6D",
        },
      },
    ],
  },
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
};
