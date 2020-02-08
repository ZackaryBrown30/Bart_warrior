Bartwarrior.com was Intended to be the a very lightweight web application for easy access in low connectivity zones. 
It was built with Mobile users in mind, chrome/broswer native.

TECHNOLOGIES USED: NodeJs, Ejs (template engine), Express. 
There is no database needed for this app.

Developers:
In order to make a clone of this app, you will need to add a file called key.js in your App's root directory and export a variable key: "Your-Key-Here", bart supplies a free public key that is prone to changing from time to time, or you may request a legacy key for your peronal use that will not in theory expire.

root-
 - key.js

module.exports = {
  tempKey: "MW9S-E7SL-26DU-VV8V",
  MyKey: "your-key-here",
};


Step 1: insert key.js
Step 2: in terminal at root of directory, type command "npm install". 

Later additions - 
  1. Design a Bart-Map in this theme to fill in the space remaining within the accordion. It will be a button that can collapse in the accordion but will show by default. 
  2. Design a favicon/brand. 
  3. add desktop proportions, it is currently made to render on  mobile, the North.ejs and South.ejs tempates could easily be made to fill out negative space responsively.

  Thank You, Zackary Brown.