TDG Test data suite written in Cypress

Contains 3 tests:

Test 1: Generate Test data and save into Downloads folder
Test 2: Asserts CSV and JSON file in downloaded zip folder
Test 3: Change data and re-upload using TDG site

NOTE: 
you will need to run the following commands: 

>npm cypress install
>
>npm install --save-dev cypress-file-upload


On top of ***TDG Test.cy.js*** , there are several settings you will need to adjust:

```
let file = 'GENERIC-IPbaqN.zip
let numData = 5000
```

change file to the zip file downloaded into >cypress/downloads and change `numData` to number of entries 
