const express = require('express')
const server = express()

const fs = require('fs')
const path = 'sample.mp4'

const stat = fs.statSync(path)
const fileSize = stat.size


server.get('/play', (req, res) => {

    const { range } = req.headers

    console.log(range)

    if (range) {
        const parts = range.replace(/bytes=/, "").split('-')

        const start = parseInt(parts[0], 10)

        const end = parts[1] ? (
            parseInt(parts[1], 10)
        ) : (
                fileSize - 1
            )

        const chunkSize = (end - start) + 1

        const file = fs.createReadStream(path, { start, end })

        const header = {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunkSize,
            'Content-Type': 'video/mp4'
        }

        res.writeHead(206, header)

        file.pipe(res)

    } else {
        const header = {
            'Content-Length': fileSize,
            'Content-Type': 'video/mp4',
        }

        res.writeHead(200, header)
        fs.createReadStream(path).pipe(res)
    }



})


server.listen(3000, () => {
    console.log("Server is running...")
})
