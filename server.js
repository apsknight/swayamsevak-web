// Dependency for serving dist.
const path = require('path')
// Dependecy for creating server
const express = require('express')

// Server app
const app = express(),
            DIST_DIR = 'dist',
            HTML_FILE = path.join('.', 'index.html')

// Serve dist directory for dist webpack build.
app.use(express.static('.'))
// Sever index file for all requests.
app.get('*', (req, res) => {
    res.sendFile(HTML_FILE, { root: __dirname })
})

// Server on env variable port otherwise on 8080
const PORT = process.env.PORT || 8080

// Start server
app.listen(PORT, () => {
    console.log(`App listening to ${PORT}....`)
    console.log('Press Ctrl+C to quit.')
})