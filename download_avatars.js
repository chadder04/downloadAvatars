var fs = require('fs');
var request = require('request');

function verifyDirectory(dir) {
    console.log(`Verifying existance of ${dir} directory...`);
    fs.stat(dir, function (err, stats) {
        if (err) {
            // Directory does not exist
            if (err.code === 'ENOENT') {
                // Create new avatars directory
                fs.mkdir(dir, function () {
                    console.log("Directory did not exist - created directory - avatars...");
                });
            } else {
                // Error output goes here
                console.log(err);
            }
            return false;
        }
        console.log(dir + " directory already exists!...")
        return true;
    });
}

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
        if (!inputOwner && !inputRepo) { console.log("Missing required input arguments! :owner :repo"); return false; }        
        console.log("Getting repo contributor data from Github.com...");

        if (!error && response.statusCode == 200) {
            let jsonData = JSON.parse(body);
            for (index in jsonData) {
                console.log(' ' + jsonData[index].login + ' : ' + jsonData[index].avatar_url);
                downloadImageByURL(jsonData[index].avatar_url, jsonData[index].login);
            }
        } else {
            console.log(' error:', error); // Print the error if one occurred 
            console.log(' statusCode:', response && response.statusCode); // Print the response status code if a response was received 
            console.log(' body:', body);
        }
    }
    request(options, callback);
}

function downloadImageByURL(url, saveName) {
    request(url).pipe(fs.createWriteStream('avatars/' + saveName + '.png'))
    console.log(`  Downloading avatar ${saveName}.png from ${url}`);
    return true;
}

// Test running / debugging
verifyDirectory('avatars/');
getRepoContributors(process.argv[2], process.argv[3]);
