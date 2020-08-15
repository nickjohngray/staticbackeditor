import path from 'path'
import fs from 'fs'

export const getPageComponentPath = (pageName: string, repoName: string) =>
    path.resolve(
        process.cwd(),
        repoName, 'src', 'components',
        'pages', pageName + '.tsx')

export const getPageComponentName = (template: string): string => {
    const pathBits = template.split('/')
    console.log('getPageComponentName=== ' + pathBits[pathBits.length - 1])
    return pathBits[pathBits.length - 1]
}

export const deletePageComponent = async (pageName: string, repoName: string): Promise<boolean> => {
    const pageComponentPath = getPageComponentPath(pageName, repoName)
    if (await fs.existsSync(pageComponentPath)) {
        await fs.unlinkSync(pageComponentPath)
        return true
    } else {
        return false
    }
}

export const makePageComponetIfNotExist = async (pageName: string, repoName: string): Promise<boolean> => {
    const pageComponentPath = getPageComponentPath(pageName, repoName)
    if (await !fs.existsSync(pageComponentPath)) {
        // write new page to the current repo pages dir
        console.log('adding ' + pageComponentPath + ' with content: ' + pageTemplate)
        await fs.writeFileSync(pageComponentPath, pageTemplate)
        return true
    } else {
        console.log(pageComponentPath + ' exists can make')
        return false
    }
}

export const makePageComponet = async (pageName: string, repoName: string, pageContent: string): Promise<boolean> => {
    try {
        const pageComponentPath = getPageComponentPath(pageName, repoName)
        // remove old component file if it exist
        if (await fs.existsSync(pageComponentPath)) {
            console.log('File Exists removing it. ' + pageComponentPath)
            await fs.unlinkSync(pageComponentPath)
        }
        await fs.writeFileSync(pageComponentPath, pageContent)
        return true
    } catch (error) {
        throw error
    }

}

const rmdir = (dir) => {
    return new Promise((resolve, reject) => {
        var list = fs.readdirSync(dir)
        for (var i = 0; i < list.length; i++) {
            var filename = path.join(dir, list[i])
            var stat = fs.statSync(filename)

            if (filename == '.' || filename == '..') {
                // pass these files
            } else if (stat.isDirectory()) {
                // rmdir recursively
                rmdir(filename)
            } else {
                // rm fiilename
                fs.unlinkSync(filename)
            }
        }
        fs.rmdirSync(dir)
        resolve(true)
    })
}

export const pageTemplate = `import React from 'react'
import SectionList from 'components/SectionList'
import {getPage} from 'components/pages/pageUtil'

export default () => (
    <div className={'page center-it '}>
        <h1>Athletes</h1>
        <SectionList sections={getPage('athletes').sections} />
    </div>
)`


export const dumpError = (err) => {
    if (typeof err === 'object') {
        if (err.message) {
            console.log('\nMessage: ' + err.message)
        }
        if (err.stack) {
            console.log('\nStacktrace:')
            console.log('====================')
            console.log(err.stack);
        }
    } else {
        console.log('dumpError :: argument is not an object');
    }
}

const  childProcess = require('child_process');
export const startUpPreviewRepo = async (repoName) =>  {
    try {
        console.log('About to install node modules for: ' + repoName);

        const cp = childProcess.exec(`npm run repo-install ${repoName}`);

        cp.on('exit', function (code) {
            var err = code === 0 ? null : new Error('exit code ' + code)
            if( err) {
                console.log(err)
                return
            }
            console.log(repoName + ' modules installed, starting up...')
            const p = childProcess.exec(`npm run repo-start ${repoName}`)
        })

        // listen for errors as they may prevent the exit event from firing
        cp.on('error', function (err) {
            console.log(err)
        })
    }catch (err){
        console.error(err)
    }
}



//var childProcess = require('child_process');
/*
export const runScript = (scriptPath, callback) => {

    // keep track of whether callback has been invoked to prevent multiple invocations
    var invoked = false;

    var process = childProcess.fork(scriptPath);

    // listen for errors as they may prevent the exit event from firing
    process.on('error', function (err) {
        if (invoked) return;
        invoked = true;
        callback(err);
    });

    // execute the callback once the process has finished running
    process.on('exit', function (code) {
        if (invoked) return;
        invoked = true;
        var err = code === 0 ? null : new Error('exit code ' + code);
        callback(err);
    });

}*/

/*
// Now we can run a script and invoke a callback when complete, e.g.
runScript('./some-script.js', function (err) {
    if (err) throw err;
    console.log('finished running some-script.js');
});*/
