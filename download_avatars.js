/*
 * 
 * https://api.github.com/repos/:owner/:repo/contributors
 * 
 * 
 */
function getRepoContributors(inputOwner, inputRepo) {
    var jsonDataURL = `https://api.github.com/repos/${inputOwner}/${inputRepo}/contributors`;
    var jsonData;


    return jsonData;
}

// Test running / debugging
console.log(getRepoContributors('chadder04', 'git_basics'));






/*
 * 
 * 
 * 
 * 
 */
function downloadImageByURL(url) {
    return url;
}

// Test running / debugging
var url = 'http://www.google.ca/';
console.log(downloadImageByURL(url));