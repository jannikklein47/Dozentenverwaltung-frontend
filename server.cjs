const express = require('express')
const path = require('path')
const app = express()
const DIST_DIR = path.join(__dirname, 'dist/spa')
const INDEX_FILE = path.join(DIST_DIR, 'index.html')
let server

const http = require('http')
server = http.createServer(app)

app.use(
  express.static(DIST_DIR, {
    extensions: ['html'],
    maxAge: 1000 * 60 * 60,
    setHeaders: customCacheControl,
  }),
)

function customCacheControl(res, file) {
  if (path.extname(file) === '.html') {
    res.setHeader('Cache-Control', 'public, max-age=0')
  }
}

const PORT = 443

app.get('/{*any}', (req, res) => {
  //res.set('Cache-Control', 'no-store')
  res.sendFile(INDEX_FILE)
})

server.listen(PORT, () => {
  console.log(`Server running on ${PORT}`)
})
