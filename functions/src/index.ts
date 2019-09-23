import * as functions from 'firebase-functions';
import * as validator from 'validator';

export const simpleSVGButton = functions.https.onRequest((req, res) => {
  // Cache in browser one month(4 weeks), cache in CDN 6 monthes
  res.set('Cache-Control', 'public, max-age=2419200, s-maxage=14515200');

  const name = req.query["name"];
  if (typeof name !== "string") {
    res.status(401).contentType("image/svg+xml").send("");
    return
  }
  const sanitizedName = validator.escape(name)
  // FIXME: This response svg is copied from ../src/Repo.tsx. Do commonize.
  res.status(200).contentType("image/svg+xml").send(`
  <svg width="250" height="80" xmlns="http://www.w3.org/2000/svg">
    <rect y="1" x="1" rx="20" height="78" width="248" stroke-width="1" stroke="#000" fill="#9ACEE6" />
    <text stroke="#666" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="16" y="22" x="125">Run Actions</text>
    <text stroke="#000" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="20" y="52" x="125">${sanitizedName}</text>
  </svg>
  `)
})
