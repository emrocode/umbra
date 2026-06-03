#!/bin/bash
rm -rf demo; mkdir demo && cat > ./demo/index.html << EOF
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <script type="text/javascript" src="../dist/umbra.umd.js"></script>
    <title>Demo</title>
  </head>
  <style>
    :root{--background-color:#f0f0f0;--foreground-color:#0f0f0f}:root:where([data-theme=dark]){--background-color:#1e1e1e;--foreground-color:#e1e1e1}body,html{font:16px/2 system-ui,sans-serif;background-color:var(--background-color);color:var(--foreground-color)}body{margin:0}main{max-width:24ch;width:90%;height:100vh;margin:0 auto;display:flex;flex-direction:column;align-items:center;justify-content:center;row-gap:1rem;text-align:center;text-wrap:pretty}
  </style>
  <body>
    <main>
      <em>Create an <strong>easy dark mode</strong> for your site.</em>
      <button>toggle_theme</button>
    </main>
    <script type="text/javascript">
      var umbra = new Umbra("button");
      console.info(umbra);
    </script>
  </body>
</html>
EOF