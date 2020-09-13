<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>Display ${$.index}</title>
  <style type="text/css">
    html, body. div, span {
      display: block;
      box-sizing: border-box;
      overflow: hidden;
    }

    html, body {
      width: 100vw;
      height: 100vh;
    }

    body {
      margin: 0;
      display: grid;
      justify-content: center;
      align-content: center;

      font-family: sans-serif;
      font-size: 30px;
      line-height: 1;

      --bg-size: 60px;
      background: repeating-conic-gradient(#000 0% 25%, #eee 0% 50%) 50% / var(--bg-size) var(--bg-size);
    }

    .info {
      width: calc(var(--bg-size) * 8);
      height: calc(var(--bg-size) * 8);
      display: grid;
      align-content: space-evenly;

      white-space: nowrap;
      text-align: center;

      background: #000;
      color: #fff;
    }

    .info__id {
      font-size: 150px;
      font-weight: 700;
      line-height: 0.8;
    }
  </style>
</head>
<body>
  <div class="info">
    <span class="info__id">${$.id}</span>
    <span>${$.width}×${$.height}</span>
    <span>x: ${$.x}  y: ${$.y}</span>
    <span>IPv4: ${$.IPv4}</span>
    <span>IPv6: ${$.IPv6}</span>
    <span>MAC: ${$.mac}</span>
  </div>
</body>
</html>