@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  color-scheme: dark;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  min-height: 100vh;
  background: #020617;
  font-family: Arial, Helvetica, sans-serif;
  color: #f8fafc;
}

* {
  box-sizing: border-box;
}

::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-track {
  background: #0f172a;
}

::-webkit-scrollbar-thumb {
  background: #1e293b;
  border-radius: 999px;
}

button,
a {
  transition: all 0.2s ease;
}



