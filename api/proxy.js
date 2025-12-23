export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: "Missing url parameter" });
  }

  try {
    const targetUrl = decodeURIComponent(url);

    const headers = {};

    // Forward auth headers if needed
    if (req.headers.authorization) {
      headers.authorization = req.headers.authorization;
    }

    // Forward range header (video streaming)
    if (req.headers.range) {
      headers.range = req.headers.range;
    }

    const response = await fetch(targetUrl, {
      method: req.method,
      headers,
      body:
        req.method !== "GET" && req.method !== "HEAD"
          ? JSON.stringify(req.body)
          : undefined,
    });

    // Forward status
    res.status(response.status);

    // Forward headers (CRITICAL for images/videos)
    response.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });

    res.setHeader("Access-Control-Allow-Origin", "*");

    const buffer = Buffer.from(await response.arrayBuffer());
    res.send(buffer);
  } catch (error) {
    console.error("Proxy error:", error);
    res.status(500).json({ error: "Proxy failed" });
  }
}