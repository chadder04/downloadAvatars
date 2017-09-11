const loadedConfig = require('dotenv').config();
const fs = require('fs');
const request = require('request');

const requiredVariables = [
    'GITHUB_USERNAME',
    'GITHUB_TOKEN',
    'SAVE_DIR'
];

function verifyConfig() {
    for (key in requiredVariables) {
        if (!(requiredVariables[key] in process.env)) { return false; }
    }
    return true;
}

function verifyDirectory(dir) {
    console.log(`====== Verifying existance of ${dir} directory...`);
    fs.stat(dir, function (err, stats) {
        if (err) {
            // Directory does not exist
            if (err.code === 'ENOENT') {
                // Create new avatars directory
                fs.mkdir(dir, function () {
                    console.log(" * Directory did not exist - created directory - avatars...");
                    return true;
                });
            } else {
                if (err.statusCode == '404') {
                    console.log(" ERROR: Invalid repo or repoOwner");
                } else {
                    // Error output goes here
                    console.log(err.statusCode);
                }
            }
            return false;
        }
        console.log(" * " + dir + " directory already exists!...")
        return true;
    });
}

function getRepoContributors(inputOwner, inputRepo) {
    var requestURL = `https://${process.env.GITHUB_USERNAME}:${process.env.GITHUB_TOKEN}@api.github.com/repos/${inputOwner}/${inputRepo}/contributors`;
    var repoContributorData = {};
    var options = {
        url: requestURL,
        headers: {
            'User-Agent': 'request'
        }
    };

    if (!loadedConfig.error) {
        if (verifyConfig()) {
            verifyDirectory(process.env.SAVE_DIR);
            request(options, function (error, response, body) {
                if (!inputOwner || !inputRepo) { console.log("ERROR: Missing required input arguments! :owner :repo"); return false; }
                console.log("====== Getting repo contributor data from Github.com...");
                console.log(requestURL);

                if (!error && response.statusCode == 200) {
                    let jsonData = JSON.parse(body);
                    for (index in jsonData) {
                        downloadImageByURL(jsonData[index].avatar_url, jsonData[index].login);
                    }
                } else {
                    switch(response.statusCode) {
                        case 404: 
                            console.log(' ERROR: Repo or RepoOwner invalid! Please try again');
                        break;
                        case 401: 
                            console.log(' ERROR: Bad credentials configured in the .env file');
                        break;
                        default: 
                            console.log(' error:', error); // Print the error if one occurred 
                            console.log(' statusCode:', response && response.statusCode); // Print the response status code if a response was received 
                            console.log(' body:', body);
                        break;
                    }
                    
                }
            });
        } else {
            console.log('ERROR: Not all .env variables have been defined properly!');
        }
    } else {
        console.log("ERROR: Unable to find .env configuration file. Please configure a .env file before attempting to run again.");
        // console.log(loadedConfig.error);
    }
}

function downloadImageByURL(url, saveName) {
    var fullPath = 'avatars/' + saveName + '.png';
    fs.stat(fullPath, function (err, stats) {
        // console.log(err);
        // console.log(stats);
        console.log(' ' + saveName + ' : ' + url);
        console.log(`  * Downloading avatar ${saveName}.png from ${url}`);
        if (err) {
            // Directory does not exist
            if (err.code === 'ENOENT') {
                // Create new avatars directory
                request(url).pipe(fs.createWriteStream(fullPath));
                console.log('  * Created new file : ' + fullPath);
            } else {
                // Error output goes here
                console.log(err);
            }
            return false;
        }
        console.log(`  * File already exists, skipping download... : ${fullPath}`);
        return true;
    });
    return true;
}

// Test running / debugging
getRepoContributors(process.argv[2], process.argv[3]);
