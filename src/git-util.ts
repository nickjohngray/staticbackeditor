import simpleGit, { SimpleGit, SimpleGitOptions } from 'simple-git';

const options: SimpleGitOptions = {
    baseDir: process.cwd(),
    binary: 'git',
    maxConcurrentProcesses: 6,
};

const git: SimpleGit = simpleGit(options);

export async function  cloneRepo(repoURL: string) {
    try{

    await git.clone(repoURL)
    } catch(e) {
        console.log('error====' + e)
    }
}
