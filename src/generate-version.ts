import { execSync } from 'child_process'

const response = execSync(`git cherry -v origin/master master`)

console.log(response.toString())

console.log('hi')
