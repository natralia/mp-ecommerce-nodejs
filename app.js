var express = require('express')
var exphbs = require('express-handlebars')
var mercadopago = require('./src/mercadopago')
var port = process.env.PORT || 3000

var app = express()

app.engine('handlebars', exphbs())
app.set('view engine', 'handlebars')

app.use(express.static('assets'))

app.use('/assets', express.static(__dirname + '/assets'))

app.get('/', function (req, res) {
    res.render('home')
})
app.get('/success', function (req, res) {
    res.render('success', req.query)
})
app.get('/failure', function (req, res) {
    res.render('failure')
})
app.get('/pending', function (req, res) {
    res.render('pending')
})


app.get('/detail', function (req, res) {
    var product = req.query
    var preference = {
        payment_methods: {
            excluded_payment_methods: [
                { id: 'amex' }
            ],
            installments: 6
        },
        payer: {
            name: 'Lalo',
            surname: 'Landa',
            email: 'test_user_92801501@testuser.com',
            phone: {
                area_code: '55',
                number: 985298743
            },
            address: {
                zip_code: '78134290',
                street_name: 'Insurgentes Sur',
                street_number: 1602

            }

        },
        external_reference: 'cath.ztk27@gmail.com',
        items: [
            {
                id: '1234',
                title: product.title,
                description: 'Celular de Tienda e-commerce',
                picture_url: `${process.env.BASE_URL_APP}${product.img}`,
                quantity: parseInt(product.unit),
                unit_price: parseFloat(product.price)
            },
        ],
        notification_url: process.env.WEBHOOK_URL,
        back_urls: {
            success: `${process.env.BASE_URL_APP}success`,
            failure: `${process.env.BASE_URL_APP}failure`,
            pending: `${process.env.BASE_URL_APP}pending`
        },
    }
    mercadopago.preferences.create(preference)
        .then(function (response) {
            var preferenceId = response.body.id
            res.render('detail', { ...req.query, preferenceId })
        }).catch(function (error) {
            console.log(error)
        })

})

app.listen(port)