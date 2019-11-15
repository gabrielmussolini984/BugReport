const express = require('express');
const app = express();
const path =  require('path');
const bodyParser = require('body-parser');
const { promisify } = require('util');
const sgMail = require('@sendgrid/mail');


// Google SpreadSheet
const GoogleSpreadsheet = require('google-spreadsheet');
const credencials = require('./bugtracker.json');
const docId = '1w4pJ5-NJhJ1tvYxaeCsoKx7TPCrrJJ_luUGFlCG4U3Y';
const worksheetIndex = 0;

// Send Grid (Emails)
const sendGridKey = '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';

// Configure EJS
app.use(express.static(path.join(__dirname,'public')));
app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname, 'views'));
// Use BodyParser
app.use(bodyParser.urlencoded({extended: true}))


// Routes
    // Initial Route (Home)
    app.get('/', (request, response)=>{
        response.render('home');
    });
    app.post('/', async(request, response)=>{
        try{
            const doc = new GoogleSpreadsheet(docId);
            await promisify(doc.useServiceAccountAuth)(credencials);
            const info = await promisify(doc.getInfo)();  
            const worksheet = info.worksheets[worksheetIndex];
            await promisify(worksheet.addRow)({
                name: request.body.name,
                email: request.body.email,
                issueType: request.body.issueType,
                howToReproduce: request.body.howToReproduce,
                expectedOutput: request.body.expectedOutput,
                receivedOutput: request.body.receivedOutput, 
                source: request.query.source || 'direct',
                userAgent: request.body.userAgent,
                userDate: request.body.userDate,
                resolve: "no"
            });
            if (request.body.issueType === 'CRITICAL'){
                sgMail.setApiKey(sendGridKey);
                const msg = {
                to: 'gabrielmussolini59401@gmail.com',
                from: 'gabrielmussolini@hotmail.com',
                subject: 'Bug Crítico Reportado',
                text: `
                    O Usuario ${request.body.name}, encontrou um problema.

                `,
                html: `<strong>O Usuario ${request.body.name}, encontrou um problema.</strong>`,
                };
                await sgMail.send(msg);
            }
            const rows = await promisify(worksheet.getRows)({
            });
            const solved = rows[0].solved;
            const notsolved = rows[0].notsolved;
            const total = Number(solved)+Number(notsolved)
            response.render('success', {solved,notsolved,total});
        }catch(err){
            response.send('Erro ao enviar o formulario.');
            console.log(err);
        }
    });

// Server
app.listen(3000, (err)=>{
    if (err){
        console.log('Aconteceu um erro: '+err);
    }else{
        console.log('Servidor rodando na porta 3000');
    }
});
