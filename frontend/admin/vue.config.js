module.exports = {
    configureWebpack: {
        resolve: {
            symlinks: false
        }
    },
    publicPath: process.env.NODE_ENV === 'production' ? '/admin/' : '/',
    indexPath: 'app.html'
}
