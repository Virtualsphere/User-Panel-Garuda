export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: "Missing url parameter" });
  }

  try {
    const targetUrl = decodeURIComponent(url);

    // Forward range header for video streaming
    const headers = {};
    if (req.headers.range) {
      headers.Range = req.headers.range;
    }

    const response = await fetch(targetUrl, {
      method: "GET",
      headers,
    });

    // Forward status code (200 / 206)
    res.status(response.status);

    // Forward ALL headers (CRITICAL)
    response.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });

    // Allow browser access
    res.setHeader("Access-Control-Allow-Origin", "*");

    // Stream binary data
    const buffer = Buffer.from(await response.arrayBuffer());
    res.send(buffer);
  } catch (error) {
    console.error("Proxy error:", error);
    res.status(500).json({
      error: "Proxy failed",
      details: error.message,
    });
  }
}