const GoogleSpreadsheet = require('google-spreadsheet');
const credencials = require('./bugtracker.json');
const { promisify } = require('util');
//Configurações
const docId = '1w4pJ5-NJhJ1tvYxaeCsoKx7TPCrrJJ_luUGFlCG4U3Y';
const worksheetIndex = 0;

/*const doc = new GoogleSpreadsheet('1w4pJ5-NJhJ1tvYxaeCsoKx7TPCrrJJ_luUGFlCG4U3Y');
doc.useServiceAccountAuth(credencials, (err)=>{
    if (err) {
        console.log('Não foi possivel abrir a planilha');
    }else {
        console.log('Planilha Aberta');
        doc.getInfo((err, info)=>{
            
            const worksheet = info.worksheets[0];
            worksheet.getRows((info,err)=>{
                console.log(info);
            });
            /*const worksheet = info.worksheets[0];
            worksheet.addRow({name: 'Gabriel', email: 'gabrielmussolini@hotmail.com'}, error=>{
                console.log('Linha Inserida');
            });
        })
    }
})*/

const acessSheet = async() => {
    const doc = new GoogleSpreadsheet(docId);
    await promisify(doc.useServiceAccountAuth)(credencials);
    const info = await promisify(doc.getInfo)();  
   
    const worksheet = info.worksheets[worksheetIndex];
    const rows = await promisify(worksheet.getRows)({
        
    });
    const resolvido = rows[0].solved
    const resolvido2 = rows[0].notsolved
    console.log(resolvido)
    console.log(resolvido2)
    
}

acessSheet();
/*const addRow
ToSheet = async () => {
    const doc = new GoogleSpreadsheet('1w4pJ5-NJhJ1tvYxaeCsoKx7TPCrrJJ_luUGFlCG4U3Y');
    await promisify(doc.useServiceAccountAuth)(credencials);
    console.log('Planilha Aberta');
    const info = await promisify(doc.getInfo)();
    const worksheet = info.worksheets[0];
    await promisify(worksheet.addRow)({name: 'Gabriel', email: 'gabrielmussolini@hotmail.com'});
}
addRowToSheet();


*/
