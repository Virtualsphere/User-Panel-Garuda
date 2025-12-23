export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: "Missing url parameter" });
  }

  try {
    const targetUrl = decodeURIComponent(url);

    const headers = {
      ...req.headers,
    };

    // Remove hop-by-hop headers (CRITICAL)
    delete headers.host;
    delete headers.connection;
    delete headers["content-length"];

    const response = await fetch(targetUrl, {
      method: req.method,
      headers,
      body:
        req.method !== "GET" && req.method !== "HEAD"
          ? JSON.stringify(req.body)
          : undefined,
    });

    const contentType = response.headers.get("content-type") || "";

    res.status(response.status);

    // JSON response
    if (contentType.includes("application/json")) {
      const data = await response.json();
      return res.json(data);
    }

    // Binary / media response
    const buffer = Buffer.from(await response.arrayBuffer());
    res.setHeader("Content-Type", contentType);
    res.send(buffer);
  } catch (error) {
    console.error("Proxy error:", error);
    res.status(500).json({ error: "Proxy failed" });
  }
}
