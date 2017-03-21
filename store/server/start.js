/* eslint no-process-exit: 0 */
/* eslint no-process-env: 0 */
require('./').startServer({
        corsOrigins: process.env.CORS_ORIGINS && JSON.parse(process.env.CORS_ORIGINS),
        port: process.env.PORT,
        stripeSecretKey: process.env.STRIPE_SECRET_KEY,
        gmailAccount: process.env.GMAIL_ACCOUNT,
        gmailPassword: process.env.GMAIL_PASSWORD
    })
    .then(function(server) {
        function stop(err) {
            server.stop(function() {
                if (err instanceof Error) console.error(err)
                process.exit(1)
            })
        }
        server
            .once('request-error', stop)
        process
            .once('uncaughtException', stop)
            .once('unhandledRejection', stop)
            .once('SIGINT', stop)
    }, function(err) {
        console.error(err)
        process.exit(1)
    })
