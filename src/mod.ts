
import { parse } from './path.js'

async function handleRequest(request: { url: string; }) {
    const { pathname } = new URL(request.url);
    const {
        isRoot,
        isFile,
        baseName,
        extention,
        contentType
    } = parse(pathname)

    // is this request for a file
    if (isFile) {

        // create a new URL using the URL for mod.ts as the base
        const newURL = new URL(baseName, import.meta.url);
        
        // fetch the file 
        let originalResponse = await fetch(newURL.href);
        
        // create a new headers object from the existing response headers
        const newHeaders = new Headers(originalResponse.headers); //  works

        // get/set the appropriate content-type header value. 
        if (contentType) {
            newHeaders.set("content-type", `${contentType}; charset=utf-8`);
        } else {
            console.log('No mime type found for -> ', extention)
        }

        // construct and return a new response with the modified headers.
        return new Response(originalResponse.body, { ...originalResponse, headers: newHeaders });
    }

    // handle the root route (index.html)
    if (isRoot) {
        // return the HTML content with apropriate header
        return new Response(
            bodyString,
            { headers: { "content-type": "text/html; charset=UTF-8", }, },
        );
    }
}

addEventListener("fetch", (event) => {
    //@ts-ignore
    event.respondWith(handleRequest(event.request));
});

// Note the back-ticks
const bodyString = `
<!DOCTYPE html>
<html lang="en">
<head>
    <title>Deno-Deploy Clock</title>
    <meta charset="utf-8">
    <meta name="description" content="Author: N.D. Hrones, Category: Clock">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- Suppress browser request for favicon.ico -->
    <link rel="shortcut icon"type="image/x-icon" href="data:image/x-icon;,">
    <link rel="stylesheet" href=./styles.css />
    <script type=module src="./app.js"></script>
</head>

<body>
    <canvas id="canvas-content"></canvas>

    <label for="gravity" id="gravity-value">Gravity: 100</label>
    <input type="range" name="gravity" id="gravity" value="100" min="2" max="100">

    <label for="bounce" id="bounce-value">Bounce: 80</label>
    <input type="range" name="bounce" id="bounce" value="80" min="10" max="100">

    <label for="velocity" id="velocity-value">Velocity: 200</label>
    <input type="range" name="velocity" id="velocity" value="200" min="10" max="1000">

    <label for="contrail" id="contrail-value">Con-Trail: 15</label>
    <input type="range" name="contrail" id="contrail" value="15" min="5" max="30">

</body>

`
