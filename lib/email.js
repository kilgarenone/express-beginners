var nodemailer = require('nodemailer');

function sendEmail(credentials) {
    var mailTransport = nodemailer.createTransport({
        /* To connect to an external SMTP server
        host: 'smtp.meadowlarktravel.com',
        secureConnection: true, // use SSL
        port: 465,*/
        service: 'gmail',
        auth: {
            user: credentials.gmail.user,
            pass: credentials.gmail.password,
        },
    });

    var from = '"Meadowlark Travel" <info@meadowlarktravel.com>';
    var errorRecipient = 'youremail@gmail.com';

    return {
        send(to, subj, body) {
            mailTransport.sendMail({
                from,
                to,
                subject: subj,
                html: body,
                //generateTextFromHtml: true, // Deprecated. Need to use this module: https://github.com/andris9/nodemailer-html-to-text
            }, (err) => {
                if (err) console.error(`Unable to send email: ${err}`);
            });
        },
        emailError(message, filename, exception) {
            var body = `${'<h1>Meadowlark Travel Site Error</h1>' +
                'message:<br><pre>'}${message}</pre><br>`;
            if (exception) body += `exception:<br><pre>${exception}</pre><br>`;
            if (filename) body += `filename:<br><pre>${filename}</pre><br>`;
            mailTransport.sendMail({
                from,
                to: errorRecipient,
                subject: 'Meadowlark Travel Site Error',
                html: body,
                // generateTextFromHtml : true
            }, (err) => {
                if (err) console.error(`Unable to send email: ${err}`);
            });
        },
    };
}

module.exports = sendEmail;
