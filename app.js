const express = require('express')
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser') 
const db = require('./models') 
const app = express()
const port = 3000

app.engine('handlebars', handlebars({defaultLayout: 'main'})) // Handlebars 註冊樣板引擎
app.set('view engine', 'handlebars') // 設定使用 Handlebars 做為樣板引擎

app.use(bodyParser.urlencoded({extended: true}))

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

require('./routes')(app)

module.exports = app
