export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()

  const { content, message } = req.body
  const owner = process.env.GITHUB_OWNER
  const repo = process.env.GITHUB_REPO
  const path = 'src/App.js'
  const token = process.env.GITHUB_TOKEN

  // First get the current file SHA (GitHub requires this to update a file)
  const getRes = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
    { headers: { Authorization: `Bearer ${token}`, 'User-Agent': 'website-agent' } }
  )
  const getJson = await getRes.json()
  const sha = getJson.sha

  // Now update the file
  const updateRes = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'User-Agent': 'website-agent'
      },
      body: JSON.stringify({
        message: message || 'Website agent update',
        content: Buffer.from(content).toString('base64'),
        sha
      })
    }
  )

  const updateJson = await updateRes.json()
  res.status(200).json({ success: true, commit: updateJson.commit?.sha })
}