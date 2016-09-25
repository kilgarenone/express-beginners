var nodemailer = require('nodemailer');

module.exports = sendEmail;

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
        }
    });

    var from = '"Meadowlark Travel" <info@meadowlarktravel.com>';
    var errorRecipient = 'youremail@gmail.com';
    
    return {
        send: function(to, subj, body) {
            mailTransport.sendMail({
               from    : from,
               to      : to,
               subject : subj,
               html    : body,
                //generateTextFromHtml: true, // Deprecated. Need to use this module: https://github.com/andris9/nodemailer-html-to-text
            }, function(err) {
                if (err) console.error('Unable to send email: ' + err);
            });
        },
        emailError: function(message, filename, exception) {
            var body = '<h1>Meadowlark Travel Site Error</h1>' +
                'message:<br><pre>' + message + '</pre><br>';
            if (exception) body += 'exception:<br><pre>' + exception + '</pre><br>';
            if (filename) body += 'filename:<br><pre>' + filename + '</pre><br>';
            mailTransport.sendMail({
                from                 : from,
                to                   : errorRecipient,
                subject              : 'Meadowlark Travel Site Error',
                html                 : body,
                // generateTextFromHtml : true
            }, function(err) {
                if (err) console.error('Unable to send email: ' + err);
            });
        }
    };
}