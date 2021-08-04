
/** parse the path name and return a properties object */
export const parse = (path: string) => {
    const ext = extention(path)
    return {
        isRoot: (path.endsWith("/")),
        isFile: ((!isRoute(path)) && ext.length > 2),
        baseName: base(path),
        extention: ext,
        contentType: contentType(ext)
    }
}

/** Is this a route?
 * If there's a value past the last slash and it doesn't contain     
 * a dot '.' (a file extension), then it must be a named route.    
 * If there is a slash and no value after it, it must be the 'root'.   
 * Otherwise return false
*/
const isRoute = (path: string) => {
    if (path.length < 1) return false;               // empty string
    if (path.lastIndexOf("/") === -1) return false;  // no slash
    const last = path.split("/").pop();
    if (!last) return true;                           // just a slash (root)
    return last && !~last.indexOf(".");             // (slash and no-dot) ? true : false
}

/** returns a contentType string based on a files extention */
const contentType = (ext: string) => {
    if (ext.length > 2) {
        return MIME_TYPE[ext] as string || "application/octet-stream";
    }
    return '';
}

/** Returns the 'base' name from a file name */
const base = (name: string) => {
    return name.substring(1);
}

const extention = (name: string) => {
    return (name) ?
        name.substring(name.lastIndexOf('.'), name.length) || name :
        '';
}

// contentType dictionary
const MIME_TYPE: Record<string, string> = {
    ".md": "text/markdown",
    ".ico": "image/x-icon",
    ".html": "text/html",
    ".htm": "text/html",
    ".css": "text/css",
    ".json": "application/json",
    ".map": "application/json",
    ".txt": "text/plain",
    ".ts": "text/typescript",
    ".tsx": "text/tsx",
    ".js": "application/javascript",
    ".jsx": "text/jsx",
    ".gz": "application/gzip",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".wav": "audio/wav",
    ".mp3": "audio/mpeg",
    ".svg": "image/svg+xml",
    ".pdf": "application/pdf",
    ".doc": "application/msword",
    ".eot": "appliaction/vnd.ms-fontobject",
    ".ttf": "aplication/font-sfnt",
}
