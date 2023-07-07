let path = 'cypress/downloads/'
let file = 'GENERIC-t1rqOU.zip'
let numData = 5000

describe('generate test data', () => {

  it.skip('Generate data with selected fields',()=>{
    cy.visit('https://develop.d3nylssqqiptjw.amplifyapp.com/');

    //Log in
    cy.get('input#email-input').click().type('joebloggs@gmail.com')
    cy.get('input#password-input').click().type('123456')
    cy.get('button#login-button').click()

    //Navigate to generate data page
    cy.get('.nav-links-container > a:nth-of-type(2)').click();
    cy.get('input#entries-counter').clear().type(numData.toString());

    //Use field select json to choose fields for data generation
    cy.fixture("fieldSelect.json").then((fieldSelect)=>{
      //Set key variables in select fields json
      let personalDataKey = Object.keys(fieldSelect)[0]
      let medicalKey = Object.keys(fieldSelect)[1]
      let residentialAddressKey = Object.keys(fieldSelect)[2]

      //Enter personal data fields
      cy.get("[placeholder=\""+personalDataKey+"\"]").click()
      for (let i = 0; i < fieldSelect[personalDataKey].length; i++) {
        cy.contains(fieldSelect[personalDataKey][i]).click()
      }

      //Enter medical fields
      cy.get("[placeholder=\""+medicalKey+"\"]").click()
      for (let i = 0; i < fieldSelect[medicalKey].length; i++) {
        cy.contains(fieldSelect[medicalKey][i]).click()
      }

      //Residential fields
      cy.get("[placeholder=\""+residentialAddressKey+"\"]").click()
      for (let i = 0; i < fieldSelect[residentialAddressKey].length; i++) {
        cy.contains(fieldSelect[residentialAddressKey][i]).click()
      }

      //submit fields for data generation
      cy.get('div:nth-of-type(11) > h4').click()
      cy.get('button#submit-selected').click()

      //Adds all fields in field select json into an array
      let allFields = [];
      for(let fields in fieldSelect){
        allFields = allFields.concat(fieldSelect[fields])
      }

      //Check if fields are present
      for(let field in allFields){
        cy.contains(field)
      }
    })
    
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

  it('Check contents of csv and json file match',()=>{
    cy.task('unzipping', { path, file}) //Unzip file into its csv and json
    let renameFile = file.substring(0,file.length-4) //Deletes .zip in name

    //Assign paths to each file type
    let csvFilePath = path.concat('CSV1.csv')
    let jsonFilePath = path.concat('JSON1.json')

    //Reads csv downlaoded
    cy.readFile(csvFilePath).then((csvFile)=>{
      cy.fixture("fieldSelect.json").then((fieldSelect)=>{

        //Number of fields
        let allFields = [];
        for(let fields in fieldSelect){
          allFields = allFields.concat(fieldSelect[fields])
        }

        //CSV lines
        let lines = csvFile.split('\n') //Splits csv into lines
        let fields = lines[0].split(',') //Creates fields array

        expect(lines.length).to.equal(numData+1) //Checks number of entries, +1 because of extra line for field names
        expect(fields.length).to.equal(allFields.length) //Check number of fields
      
       //Compare field name in downloaded file to dataNames in fixtures
       cy.fixture("dataNameLib.json").then((properties)=>{
          //Properties - dictionary for matching field names on website to csv/json field names
          //Checks if fields in downloaded file exist in dictionary dataName library using expect
          for(let i=0;i < allFields.length; i++){
           cy.log(expect(Object.keys(properties).find(key => properties[key] == fields[i].substring(1,fields[i].length-1))).to.exist)
          }
        })
      })
  })

    //Reads JSON file
    cy.readFile(jsonFilePath).then((jsonFile)=>{
      cy.log(jsonFile[0]) //gives data on first entry

      cy.fixture("dataNameLib.json").then((properties)=>{ 
        //Properties - dictionary for matching field names on website to csv/json field names
        //Checks field to match dataNamelib.json by using key from json file to validate the field exists in our library
        for(let i in jsonFile[0]){
          cy.log(Object.keys(properties).find(key => properties[key] == i))
        }
    })
    })
  })

  it.only('Change data file and re-upload to site', function () {

    cy.visit('https://develop.d3nylssqqiptjw.amplifyapp.com/');
    cy.get('#email-input').clear();
    cy.get('#password-input').clear();
    cy.get('#email-input').type('joebloggs@gmail.com');
    cy.get('#password-input').type('123456');
    cy.get('#login-button').click();

    cy.moveCsvToFixtures('CSV1.csv');

    cy.get('#root > header > div.navbar > div > div > a:nth-child(2)').click();
    cy.get('#next-section-btn > button').click();
    cy.contains('Choose File').click();
    const fileName = 'CSV1.csv';
    cy.fixture(fileName).then(fileContent=>{
      cy.contains('Choose File').attachFile({
            fileContent:fileContent,
            fileName: fileName,
            mimeType: 'text/csv'
        });
        // cy.contains('Choose File').click().uploadFile(fileName);
    })  

    cy.get('#personal_title').clear();
    cy.get('#personal_title').type('Mr');
    cy.get('#personal_dob').type('Sun Oct 22 1999 16:34:00 GMT+0100 (British Summer Time)')
    cy.get('#medical_gpName').clear();
    cy.get('#medical_gpName').type('GP Daniel');

    cy.get('#csv-json-btn').click();
    cy.get('#btn-down-xml').click();
    cy.get('#download-button').click();
    cy.get('#upload-button').click();
    cy.get('#modal-ok-button').click();
    
    //unzip 
    //then compare the csv files from fixture and download
  })
})
