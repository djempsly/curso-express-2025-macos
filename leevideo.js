const http = require('http')
const fs = require('fs')
const path = require('path')

const server = http.createServer((req, res) =>{

    if (req.url === '/video') {
            const videoPath = path.join(__dirname, 'video.mp4')
          const stat = fs.statSync(videoPath)
    
    res.writeHead(200, {
        'Content-length': stat.size,
        'Content-Type':'video/mp4'
    })

    const readable = fs.createReadStream(videoPath)
    let chunkCount = 0

    readable.on('data', (chunk)=>{
        chunkCount++
        console.log(`${chunkCount} size ${chunk.length}`)
    })
        readable.pipe(res)
    }else{
        res.writeHead(404, {'Content-Type':'Text/plain'})
        res.end('Not Found')
    }

})


server.listen(3003, ()=>{
    console.log('Servideo corriendo correctamente')
})


