/*
    Using the nodemailer library for email service

    Examples:
    https://www.npmjs.com/package/nodemailer#tldr-usage-example
    https://github.com/EthanRBrown/web-development-with-node-and-express/blob/master/ch13/lib/email.js
*/

const nodemailer = require('nodemailer');

function sendEmail(credentials) {
    const mailTransport = nodemailer.createTransport({
        /* To connect to an external SMTP server
        host: 'smtp.meadowlarktravel.com',
        secureConnection: true, // use SSL
        port: 465,*/
        service: 'gmail',
        auth: {
            user: 'YOUR_GMAIL_USERNAME',
            pass: 'YOUR_GMAIL_PASSWORD',
        },
    });

    const from = '"Meadowlark Travel" <info@meadowlarktravel.com>';
    const errorRecipient = 'youremail@gmail.com';

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
            var body = `<h1>Meadowlark Travel Site Error</h1> Message:<br><pre>${message}</pre><br>`;
            if (exception) body += `exception:<br><pre>${exception}</pre><br>`;
            if (filename) body += `filename:<br><pre>${filename}</pre><br>`;
            mailTransport.sendMail({
                from,
                to: errorRecipient,
                subject: 'Meadowlark Travel Site Error',
                html: body,
                //generateTextFromHtml: true, // Deprecated. Need to use this module: https://github.com/andris9/nodemailer-html-to-text
            }, (err) => {
                if (err) console.error(`Unable to send email: ${err}`);
            });
        },
    };
}

module.exports = sendEmail;
