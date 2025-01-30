const express = require('express')
const app = express()
const port = 3000

app.use(express.json())

app.get('/sensor', (req, res) => {
  res.send(JSON.stringify({
    wandEntfernung: ((Math.random() * (2 - 1) + 1).toFixed(2)),
    geschwindigkeit: ((Math.random() * (10 - 1) + 1).toFixed(2))
  }))
})

app.get('/daten', (req, res) => {
  res.send(JSON.stringify({
    betriebsDauer: ((Math.random() * (10 - 1) + 1).toFixed(2)),
    wegStrecke: ((Math.random() * (100 - 1) + 1).toFixed(2))
  }))
})

app.get('/ip', (req, res) => {
  const ips = ['10.10.3.14', '192.168.0.133', '172.16.1.34']
  const randIP = ips[Math.floor(Math.random() * ips.length)]
  const name = ['mbot1', 'mbot2', 'mbot3', 'mbot4']
  const randName = name[Math.floor(Math.random() * name.length)]

  res.send(JSON.stringify({
    ipAdresse: randIP,
    name: randName
  }))
})

app.post('/sendData', (req, res) => {
  console.log('Request Body:', req.body)
  res.send('Logged Data')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})