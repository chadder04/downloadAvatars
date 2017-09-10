var fs = require('fs');
var request = require('request');

/*
 * 
 * https://api.github.com/repos/:owner/:repo/contributors
 * 
 * 
 */
function getRepoContributors(inputOwner, inputRepo) {
    var jsonDataURL = `https://api.github.com/repos/${inputOwner}/${inputRepo}/contributors`;
    var repoContributorData = {};
    var options = {
        url: jsonDataURL,
        headers: {
            'User-Agent': 'request'
        }
    };

    function callback(error, response, body) {
        // console.log('error:', error); // Print the error if one occurred 
        // console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received 
        // console.log('body:', body);
        if (!error && response.statusCode == 200) {
            let jsonData = JSON.parse(body);
            for (index in jsonData) {
                repoContributorData
                console.log(jsonData[index].login + ' : ' + jsonData[index].avatar_url);
            }
            // console.log(jsonData.length);
        }
    }

    request(options, callback);
}

// Test running / debugging
var requestData = getRepoContributors('jquery', 'jquery');
// console.log(requestData);






/*
 * 
 * 
 * 
 * 
 */
function downloadImageByURL(url, saveName) {
    request('http://google.com/doodle.png').pipe(fs.createWriteStream('doodle.png'))
    return url;
}

// Test running / debugging
// var url = 'http://www.google.ca/';
// console.log(downloadImageByURL(url));