export const parse = (path) => {
    const ext = extention(path);
    return {
        isRoot: (path.endsWith("/")),
        isFile: ((!isRoute(path)) && ext.length > 2),
        baseName: base(path),
        extention: ext,
        contentType: contentType(ext)
    };
};
const isRoute = (path) => {
    if (path.length < 1)
        return false;
    if (path.lastIndexOf("/") === -1)
        return false;
    const last = path.split("/").pop();
    if (!last)
        return true;
    return last && !~last.indexOf(".");
};
const contentType = (ext) => {
    if (ext.length > 2) {
        return MIME_TYPE[ext] || "application/octet-stream";
    }
    return '';
};
const base = (name) => {
    return name.substring(1);
};
const extention = (name) => {
    return (name) ?
        name.substring(name.lastIndexOf('.'), name.length) || name :
        '';
};
const MIME_TYPE = {
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
};
