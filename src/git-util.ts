import simpleGit, { SimpleGit, SimpleGitOptions } from 'simple-git';

export async function  cloneRepo(repoURL: string) {
    try{
        const options: SimpleGitOptions = {
            baseDir: process.cwd(),
            binary: 'git',
            maxConcurrentProcesses: 6,
        };

        const git: SimpleGit = simpleGit(options)
        await git.clone(repoURL)
    } catch(e) {
        console.log('error====' + e)
        throw e
    }
}

export async function  commit(repoName: string, message: string, ...fileNames: string[]) {
    try{
        const options: SimpleGitOptions = {
            baseDir: process.cwd() + '/' + repoName,
            binary: 'git',
            maxConcurrentProcesses: 6,
        };

        const git: SimpleGit = simpleGit(options)
        await git.add(fileNames)
        await git.commit(message)
    } catch(e) {
        console.log('error====' + e)
        throw e
    }
}

export async function  pushToMaster(repoName: string) {
    try{
        const options: SimpleGitOptions = {
            baseDir: process.cwd() + '/' + repoName,
            binary: 'git',
            maxConcurrentProcesses: 6,
        }

        const git: SimpleGit = simpleGit(options)
        await git.push('origin', 'master')

    } catch(e) {
        console.log('error====' + e)
        throw e
    }
}
