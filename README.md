Bartwarrior.com was Intended to be the a very lightweight web application for easy access in low connectivity zones. 
It was built with Mobile users in mind, chrome/broswer native.

TECHNOLOGIES USED: NodeJs, Ejs (template engine), Express. 
There is no database needed for this app.

To run this app ;
 1. @ root of directory, run command "npm install". 
 2. Run server with "Nodemon server.js" command.
 3. Port will run at localhost:3000.




Developers:

In order to make a clone of this app, you should add a file called key.js in your the /secure folder directory and export a variable key: "Your-Key-Here", bart supplies a free public key that is prone to changing from time to time. I have setup the Git app to automatically run without making adjustments to this by defaulting to the public key. 
  if you add a secure key to your app it is suggested to add it to your .gitignore much as you would with your session key. 

key.js example - 
module.exports = {
  tempKey: "MW9S-E7SL-26DU-VV8V",
  MyKey: "your-key-here",
};

 (optional) add a key.js
 (optional) Either insert your own api key in key.js's MyKey: "" placeholder 
  Or, change all instances inside Server.js.Bi-directionalApiCall funciton of "Tempkey" to "Mykey".
   There are 2 instances in each route that will need to be adjusted. (4 total)

Later additions I will be making- 
  1. Design a Bart-Map in this theme to fill in the space remaining within the accordion. It will be a button that can collapse in the accordion but will show by default. 
  2. Design a favicon/brand. 
  3. add desktop proportions, it is currently made to render on  mobile, the North.ejs and South.ejs tempates could easily be made to fill out negative space responsively.

  Thank You, Zackary Brown.