
const childProcess =  require('child_process')


    try {
        console.log('Starting Prod forever')

        const p = childProcess.exec('npm run start-server-prod')

        p.on('exit', (code) => {
            let err = code === 0 ? null : new Error('exit code ' + code)
            if (err) {
                console.log(
                    'an error occurred while trying to npm run start-dev error is ' + err
                )
                return
            }

            p.stdout.on('data', (message) => {
                console.log('server>>> ' + message)
            })

            p.on('error', (code2) => {
                console.log('server error Error is ' + code2)
            })
        })


    } catch (err) {
        console.error(err)
    }

