export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()

  const owner = process.env.GITHUB_OWNER
  const repo = process.env.GITHUB_REPO
  const token = process.env.GITHUB_TOKEN

  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/src/App.js`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'User-Agent': 'website-agent'
      }
    }
  )

  const data = await response.json()
  const content = Buffer.from(data.content, 'base64').toString('utf8')

  res.status(200).json({ content })
}