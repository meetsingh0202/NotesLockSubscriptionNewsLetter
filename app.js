const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');
const https = require('https');
require('dotenv').config();

var API_KEY = process.env.API_KEY;

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true}));


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/signup.html');
});

app.post('/', (req, res) => {
    const firstName = req.body.firstName;
    const secondName = req.body.secondName;
    const email = req.body.email;
    
    var data = {
        members : [
            {
                email_address : email,
                status : "subscribed",
                merge_feilds: {
                    FIRSTNAME : firstName,
                    LASTNAME : secondName
                }
            }
        ]
    }

    const jsonData = JSON.stringify(data);
    
    var url = "https://us21.api.mailchimp.com/3.0/lists/b42cbfdf3a"
    
    const options = {
        method : "POST",
        auth : "meet1:"+API_KEY,
    }

    const request = https.request(url, options, function(response){
        if (response.statusCode === 200){
            res.sendFile(__dirname + "/success.html");
        }
        else{
            res.sendFile(__dirname + "/failure.html");
        }
        console.log(response.statusCode);

        response.on("data", function(data){
            console.log(JSON.parse(data));
        })
    })

    request.write(jsonData);
    request.end(); 
});

app.post('/failure', function(req, res){
    res.redirect('/');
});

app.listen(3000, function () {
    console.log('Listening on port 3000');
}); 
