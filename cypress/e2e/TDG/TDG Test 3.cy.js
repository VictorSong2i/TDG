import 'cypress-file-upload'; //imports upload 

describe('TDG Test suite', () => {

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
})
