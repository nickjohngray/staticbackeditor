import {cloneRepo} from './git-util'

const repoAccount = 'https://github.com/nickjohngray/'

const start =  async (repo: string) => {
    await cloneRepo(repoAccount + 'doomroom')
    console.log('just cloned ')
}

start('doomroom');
