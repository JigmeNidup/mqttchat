import { SitemapStream, streamToPromise } from "sitemap";
import { Readable } from "stream";

export default async (req, res) => {
  const links = [{ url: "/", changefreq: "never", priority: 1 }];

  const stream = new SitemapStream({ hostname: `https://${req.headers.host}` });

  res.writeHead(200, {
    "Content-Type": "application/xml",
  });

  const xmlString = await streamToPromise(
    Readable.from(links).pipe(stream)
  ).then((data) => data.toString());

  res.end(xmlString);
};
