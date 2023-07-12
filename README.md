# TDG Test data suite written in Cypress

### Contains the following 3 tests:

#### Test 1: Generate Test data and save into Downloads folder
#### Test 2: Asserts CSV and JSON file in downloaded zip folder
#### Test 3: Change data and re-upload to TDG site

---


User can currently input any fields to be generated in the personal data, medical and residential address tabs in `fieldSelect.json` in fixtures folder. Make sure the names **align** with those on [the TDG data generator site](https://develop.d3nylssqqiptjw.amplifyapp.com/data)

***NOTE:*** 

**NOTE:** 
you will need to run the following commands in terminal when you use vscode: 

>npm install cypress@12.14.0
>
>npm install --save-dev cypress-file-upload

`sequencedTests.cy.js` runs tests 1-3 sequentially and will automatically update its CSV and JSON files accordingly to the test run. 

**Test 1** generates number of entries from `initialSettings.json` file with the fields stored in `fieldSelect.json`

**Test 2** will unzip the folder into its CSV and JSON equivalents and store into the downloads folder.

**Test 3** will copy the `CSV1.csv` unzipped from test 2 and alters a preset of fields: 

+ Personal title
+ Personal date of birth
+ Medical GP's name

Then it is re-uploaded onto the TDG website. (**CAUTION:** Currently TDG does not have ability to re-download it's contents as mentioned in [things to improve](#things-to-improve)).

***NOTE:***

User can currently input any fields to be generated in the personal data, medical and residential address tabs in `fieldSelect.json` in fixtures folder. Make sure the names **align** with those on [the TDG data generator site](https://develop.d3nylssqqiptjw.amplifyapp.com/data)

Additionally there is a `initialSettings.json` file in fixtures folder to modify number of entries created and a path to where download will be, default is `cypress/downloads` folder.

You will need to run *Test 1*, *Test 2* and *Test 3* ***seprately and in order***, the `sequencedTests.cy.js` is for running Tests 1-3 in order but currently does not update zip folder downloaded from *Test 1*, *Test 2* uses a pre-downloaded zip folder which is then accessed and validated.

Before running Test 1, you will need to set number of entries to download by changing `numData` variable in *line 1 in* ***`TDG Test 1.cy.js`***
``` 
let numData = 5000
```
After running *Test 1*, there will be a new zip file downloaded.

At the very top of the following file: ***`TDG Test.cy.js`***, there are several settings you will need to adjust:

```
let file = 'GENERIC-IPbaqN.zip
let numData = 5000
```

Change file to the zip file downloaded into `cypress/downloads` and change `numData` to number of entries you want to generate

TDG site does not update history tab fast enough for assertions to be made if file was saved correctly in test 1. Ater re-downloading the file with its modified contents in test 3, the zip folder contains no CSV or JSON files. 