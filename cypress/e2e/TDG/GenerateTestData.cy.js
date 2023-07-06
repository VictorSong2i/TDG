let path = 'cypress/downloads/'
let file = 'GENERIC-fULBMw.zip'

let gpDetails = ['GP Location','GP Name']
let title = ['First name','Last Name','Date Of Birth']
let mergedDetails = gpDetails.concat(title)

let numData = 5000

describe('generate test data', () => {
  it.skip('Generate data', () => {
    cy.visit('https://develop.d3nylssqqiptjw.amplifyapp.com/');

    //Log in
    cy.get('input#email-input').click().type('joebloggs@gmail.com')
    cy.get('input#password-input').click().type('123456')
    cy.get('button#login-button').click()

    //Generate data
    cy.get('.nav-links-container > a:nth-of-type(2)').click();
    cy.get('input#entries-counter').clear().type('5000');
    cy.get('div#personal > .search-wrapper.searchWrapper').click();
    cy.contains('First name').click()
    // cy.get('button#submit-template').click()
    // cy.startTimer();
    cy.get('button#generate-values').click()
    // cy.logExecutionTime();
  })

  it.skip('Generate data with selected fields',()=>{
    cy.visit('https://develop.d3nylssqqiptjw.amplifyapp.com/');

    //Log in
    cy.get('input#email-input').click().type('joebloggs@gmail.com')
    cy.get('input#password-input').click().type('123456')
    cy.get('button#login-button').click()

    //Navigate to generate data page
    cy.get('.nav-links-container > a:nth-of-type(2)').click();
    cy.get('input#entries-counter').clear().type(numData.toString());

    //Select fields for generating data
    cy.get('div#personal > .search-wrapper.searchWrapper').click();
    for (let i = 0; i < title.length; i++) {
      cy.contains(title[i]).click()
    }

    cy.get('input#medical_input').click()
    for (let i = 0; i < gpDetails.length; i++) {
      cy.contains(gpDetails[i]).click()
    }
    
    //Check fields are present
    cy.get('div:nth-of-type(11) > h4').click()
    cy.get('button#submit-selected').click()

    for (let i = 0; i < mergedDetails.length; i++) {
      cy.contains(mergedDetails[i])
    }

    //Generate data
    cy.get('button#csv-json-btn').click()
    cy.get('button#generate-values').click()

    //Download and save data
    cy.contains('Download').click()
    cy.contains('Save').click()
    cy.contains('OK').click()

    // //Verify download file name
    // cy.get('input#file-name-input').invoke('val').then((fileName)=>{

    //   //Check History
    //   cy.contains('HISTORY').click()
    //   cy.contains(fileName)
    //   cy.log('File saved in history')
    // })

    //Log out
    cy.get('button#logout-link').click()
  })

  it.only('Check contents of csv and json file match',()=>{
    cy.task('unzipping', { path, file}) //Unzip file
    let renameFile = file.substring(0,file.length-4) //Deletes .zip in name

    //Assign paths to each file type
    let csvFilePath = path.concat('unzip/',renameFile,'/CSV1.csv')
    let jsonFilePath = path.concat('unzip/',renameFile,'/JSON1.json')
    cy.readFile(csvFilePath).then((csvFile)=>{
      let lines = csvFile.split('\n')
      let fields = lines[0].split(',')
      cy.log(lines[1])
      expect(lines.length).to.equal(numData+1);
      expect(fields.length).to.equal(mergedDetails.length)
    })

    // cy.readFile(jsonFilePath).then((jsonFile)=>{
    //   cy.log(Object.keys(jsonFile))
    // })
    
  })
})