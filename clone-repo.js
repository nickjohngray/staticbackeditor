const simpleGit = require('simple-git');
const git = simpleGit();

/*const options: SimpleGitOptions = {
    baseDir: process.cwd(),
    binary: 'git',
    maxConcurrentProcesses: 6,
};
*/


async function  clone() {
    try{


    await git.clone('https://github.com/nickjohngray/doomroom')
    } catch(e) {
        console.log('error====' + e)
    }
//checkout(checkoutWhat [, options])
}

clone()
