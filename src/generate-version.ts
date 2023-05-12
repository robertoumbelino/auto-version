import { execSync } from 'child_process'

const response = execSync(`git cherry -v`)

console.log(response.toString())

console.log('hi')
