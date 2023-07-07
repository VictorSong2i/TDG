# TDG Test data suite written in Cypress

### Contains 3 tests:

#### Test 1: Generate Test data and save into Downloads folder
#### Test 2: Asserts CSV and JSON file in downloaded zip folder
#### Test 3: Change data and re-upload using TDG site

User can currently input any fields to be generated in the personal data, medical and residential address tabs in `fieldSelect.json` in fixtures folder. Make sure the names **align** with those on [the TDG data generator site](https://develop.d3nylssqqiptjw.amplifyapp.com/data)

***NOTE:*** 

you will need to run the following commands in terminal when you use vscode: 

>npm install cypress
>
>npm install --save-dev cypress-file-upload

You will need to run *Test 1*, *Test 2* and *Test 3* ***seprately and in order***, the `sequencedTests.cy.js` is for running Tests 1-3 in order but currently does not update zip folder downloaded from *Test 1*, *Test 2* uses a pre-downloaded zip folder which is then accessed and validated.

Before running Test 1, you will need to set number of entries to download by changing `numData` variable in *line 1 in* ***`TDG Test 1.cy.js`***
``` 
let numData = 5000
```
After running *Test 1*, there will be a new zip file downloaded.

You will then need to navigate to the second test file: ***`TDG Test 2.cy.js`***, there are several settings you will need to adjust in `line 2-3`:

```
let file = 'GENERIC-IPbaqN.zip'
let numData = 5000
```

Change the zip folder name in `let file = 'GENERIC-IPbaqN.zip'` to the zip file name downloaded into `cypress/downloads` and change `numData` to number entered from *Test 1*.

*Test 2* will unzip the folder into its csv and json equivalents and store into the downloads folder.

*Test 3* will copy the `CSV1.csv' unzipped from *Test 2* and change the contents of the fields and re-uploads onto the TDG website. (**NOTE:** Currently TDG does not have ability to re-download it's contents so cannot test to validate a changed file after uploaded matches)

## Things to improve/implement

Currently, the user can only update fields in personal data, medical and residential address tabs, need to introduce all the fields into `fieldSelect.json`
