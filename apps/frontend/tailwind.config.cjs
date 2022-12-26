module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  daisyui: {
    themes: ["night"],
  },
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
};
