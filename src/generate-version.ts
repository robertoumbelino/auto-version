import packageJson from '../package.json'
import { execSync } from 'child_process'

console.log('Gerando nova versão')

/**
 * Get not pushed commits.
 */
const response = execSync(`git cherry -v origin/master master`)

/**
 * Valid terms.
 */
const TERMS = ['feat', 'fix', 'chore']

/**
 * Get current version.
 */
const [major, minor, patch] = packageJson.version
  .split('.')
  .map(value => +value)

/**
 * Get new version.
 */
const newVersion = response
  .toString()
  .split('\n')
  .reduce(
    (version, message) => {
      const [firstPart] = message.split(':')
      const [, , term] = firstPart.split(' ')

      /**
       * Term not found,
       */
      if (!TERMS.includes(term)) {
        return version
      }

      /**
       * Is chore.
       */
      if (term === 'chore') return { ...version, patch: version.patch + 1 }

      /**
       * Is fix.
       */
      if (term === 'fix') return { ...version, patch: version.patch + 1 }

      /**
       * Is feat.
       */
      if (term === 'feat')
        return { ...version, minor: version.minor + 1, patch: 0 }

      return version
    },
    { major, minor, patch }
  )

/**
 * Normalize version.
 */
const normalizedVersion = `${newVersion.major}.${newVersion.minor}.${newVersion.patch}`

/**
 * Generate new version.
 */
execSync(
  `yarn version --new-version ${normalizedVersion} && git push origin master git push --no-verify`
)

console.log(`Nova versão: ${normalizedVersion}`)
