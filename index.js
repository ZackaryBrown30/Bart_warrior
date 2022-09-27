const Courierkey = "dk_test_SEB6GGN8ZQM6PEQGCBQT2JCZHJ7Q";


const fetch = require('node-fetch');

const options = {
  method: 'POST',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: "dk_test_SEB6GGN8ZQM6PEQGCBQT2JCZHJ7Q"
  },
  body: JSON.stringify({
    
    "message": {
      "to": {
        "email": "courier.demos+secretmessage@gmail.com"
      },
      "content": {
        "title": "Test",
        "body": "Yo! "
      }
    }
  })
};

fetch('https://api.courier.com/send', options)
  .then(response => response.json())
  .then(response => console.log(response))
  .catch(err => console.error(err));