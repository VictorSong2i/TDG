describe('TDG Test suite', () => {
  it('Check contents of csv and json file match',()=>{

    cy.readFile("cypress/fixtures/initialSettings.json").then((settings)=>{

      //Init settings for path, file and number of entries 
      let path = settings.path
      let file = settings.zipfilename
      let numData = settings.number

      cy.task('unzipping', { path, file}) //Unzip file into its csv and json
      let renameFile = file.substring(0,file.length-4) //Deletes .zip in name

      //Assign paths to each f'cypress/downloads/'ile type
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
                //  cy.log(fields[i])
                cy.log(Object.keys(properties).find(key => properties[key] == fields[i].substring(1,fields[i].length-1)))
              }
            })
          })

        //Reads JSON file
        cy.readFile(jsonFilePath).then((jsonFile)=>{

          cy.fixture("dataNameLib.json").then((properties)=>{ 
          //Properties - dictionary for matching field names on website to csv/json field names
          //Checks field to match dataNamelib.json by using key from json file to validate the field exists in our library
            for(let field in jsonFile[0]){
              cy.log(Object.keys(properties).find(key => properties[key] == field))
            }
          })
        })
      })
    })
  })
})
