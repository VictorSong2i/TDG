let path = 'cypress/downloads/'
let file = 'GENERIC-IPbaqN.zip'
let numData = 5000

import 'cypress-file-upload';

describe('TDG Test suite', () => {

  it('Generate data with selected fields',()=>{
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

  it('Change data file and re-upload to site', function () {

    //Login 
    cy.visit('https://develop.d3nylssqqiptjw.amplifyapp.com/');
    cy.get('#email-input').clear().type('joebloggs@gmail.com');
    cy.get('#password-input').clear().type('123456');
    cy.get('#login-button').click();

        //move to csv1.csv from downloads to fixtures
        cy.moveCsvToFixtures('CSV1.csv');

        //click on data in the nav bar
        cy.get('#root > header > div.navbar > div > div > a:nth-child(2)').click();

        //click the next button to upload a document
        cy.get('#next-section-btn > button').click();

        //this block of code would upload the CSV1.csv from the fixtures to the browser
        const fileName = 'CSV1.csv';
        cy.fixture(fileName).then(fileContent=>{
            cy.get('#file-upload-input').attachFile({
                fileContent:fileContent,
                fileName: fileName,
                mimeType: 'text/csv'
            });
        })  


        //clear the text field and type new text to be updated
        cy.get('#personal_title').clear().type('Mr');
        cy.get('#personal_dob').clear().type('Sun Oct 22 1999 16:34:00 GMT+0100 (British Summer Time)');
        cy.get('#medical_gpName').clear().type('GP Daniel');

        //select the csv json option
        cy.get('#csv-json-btn').click();

        //submit values
        cy.get('#btn-down-xml').click();

        //then press the download button to download the altered version of the generated data
        cy.get('#download-button').click();

        //save the altered version of the generated data
        cy.get('#upload-button').click();

        //press ok once the save has been completed
        cy.get('#modal-ok-button').click();

       

        //logout of the website
        cy.get('#logout-link').click();
})
