let numData = 5000

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
