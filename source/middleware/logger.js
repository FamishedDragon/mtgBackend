
function log(req, res, next) {
    console.log('Logging...')
    console.log('URL:',req.url)
    console.log('Method:', req.method)
    console.log('Request:',req.body)
    next()
}

module.exports = log