const { exec } =  require('child_process')

const repoName =  process && process.argv && process.argv.length >=3 ? process.argv[2] : 'strengthpitotara'

  console.log("==============")
console.log('INSTALLING  modules for: ' + repoName)
  console.log("==============")

// const repoInstallProcess = childProcess.exec(`npm run repo-install ${repoName}`)
// npm run repo-install strengthpitotara
const repoInstallProcess =  exec(`#!/bin/bash; npm run repo-install ${repoName}`)

repoInstallProcess.on('exit', (error, stdout, stderr) => {
    if (error) {
        console.log('Error: npm run repo-install')
        console.log(error.stack)
        console.log('Error code: ' + error.code)
        console.log('Signal received: ' + error.signal)
        return
    }
    console.log('npm run repo-install STDOUT: ' + stdout)
    console.log('npm run repo-install STDERR: ' + stderr)

    console.log(repoName + ' node modules installed, executing: npm run repo-start')

    const repoStartProcess = exec(`npm run repo-start ${repoName}`)

    repoStartProcess.on('exit', (error, stdout, stderr) => {
        if (error) {
            console.log('Error: npm run repo-install')
            console.log(error.stack)
            console.log('Error code: ' + error.code)
            console.log('Signal received: ' + error.signal)
            return
        }
        console.log('npm run repo-install STDOUT: ' + stdout)
        console.log('npm run repo-install STDERR: ' + stderr)

        console.log(repoName + ' is no longer running')
    })
// show all console messages from repo start
    repoStartProcess.stdout.on('data', (message) => {
        console.log(repoName + '>>>' + message)
    })

    repoStartProcess.on('error', (code2) => {
        console.log('error starting up ' + repoName + 'Error is ' + code2)
    })

// listen for errors as they may prevent the exit event from firing
    repoInstallProcess.on('error', (err) => {
        console.log(err)
    })
})



