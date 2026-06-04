import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to run commands
function run(cmd) {
  try {
    return execSync(cmd, { encoding: 'utf8' }).trim();
  } catch (err) {
    return '';
  }
}

// Semver bump logic
function bumpVersion(current, bumpType) {
  const parts = current.split('.').map(Number);
  if (parts.length !== 3 || parts.some(isNaN)) {
    throw new Error(`Invalid current version: ${current}`);
  }

  let [major, minor, patch] = parts;
  if (bumpType === 'major') {
    major += 1;
    minor = 0;
    patch = 0;
  } else if (bumpType === 'minor') {
    minor += 1;
    patch = 0;
  } else if (bumpType === 'patch') {
    patch += 1;
  } else {
    // If it's a specific version string
    if (/^\d+\.\d+\.\d+$/.test(bumpType)) {
      return bumpType;
    }
    throw new Error(`Invalid bump type or version: ${bumpType}`);
  }
  return `${major}.${minor}.${patch}`;
}

async function main() {
  const args = process.argv.slice(2);
  const bumpType = args[0] || 'patch';
  const customNotes = args[1] || '';

  // 1. Read package.json version
  const pkgPath = path.join(__dirname, '../package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  const currentVersion = pkg.version;

  // 2. Compute next version
  const nextVersion = bumpVersion(currentVersion, bumpType);
  console.log(`Bumping version from ${currentVersion} to ${nextVersion}...`);

  // 3. Get latest git tag
  let lastTag = run('git describe --tags --abbrev=0');
  console.log(`Latest git tag found: ${lastTag || 'None (root of repo)'}`);

  // 4. Get commits since last tag
  const gitLogCmd = lastTag 
    ? `git log ${lastTag}..HEAD --oneline`
    : `git log --oneline`;
  
  const rawLogs = run(gitLogCmd);
  const commits = rawLogs ? rawLogs.split('\n') : [];
  console.log(`Found ${commits.length} commits since last tag.`);

  // 5. Parse and group commits
  const categories = {
    Added: [],
    Fixed: [],
    Changed: [],
    Refactored: [],
    Other: []
  };

  commits.forEach(commit => {
    // Commit format: Hash type: Description #issue_id
    // e.g. "a4036b7 fix: removed typos" or "12f6ef0 change: Add semantic versioning changelog #0"
    const match = commit.match(/^[a-f0-9]+\s+(\w+):\s*(.*?)\s*(#\d+)?$/i);
    if (match) {
      const [, type, desc, issue] = match;
      const formattedText = desc + (issue ? ` (${issue})` : '');
      const t = type.toLowerCase();
      if (t === 'feature' || t === 'feat') {
        categories.Added.push(formattedText);
      } else if (t === 'bugfix' || t === 'fix') {
        categories.Fixed.push(formattedText);
      } else if (t === 'change') {
        categories.Changed.push(formattedText);
      } else if (t === 'refactor') {
        categories.Refactored.push(formattedText);
      } else {
        categories.Other.push(`${type}: ${formattedText}`);
      }
    } else {
      // Try a simpler match for commits that might not have #issue_id
      const simpleMatch = commit.match(/^[a-f0-9]+\s+(\w+):\s*(.*)$/i);
      if (simpleMatch) {
        const [, type, desc] = simpleMatch;
        const t = type.toLowerCase();
        if (t === 'feature' || t === 'feat') {
          categories.Added.push(desc);
        } else if (t === 'bugfix' || t === 'fix') {
          categories.Fixed.push(desc);
        } else if (t === 'change') {
          categories.Changed.push(desc);
        } else if (t === 'refactor') {
          categories.Refactored.push(desc);
        } else {
          categories.Other.push(`${type}: ${desc}`);
        }
      } else {
        // Strip the hash from other commits
        const noHash = commit.replace(/^[a-f0-9]+\s+/, '');
        if (noHash.trim()) {
          categories.Other.push(noHash);
        }
      }
    }
  });

  // 6. Generate markdown section
  const today = new Date().toISOString().split('T')[0];
  let markdown = `## [${nextVersion}] - ${today}\n\n`;

  let hasContent = false;
  if (categories.Added.length > 0) {
    markdown += `### Added\n` + categories.Added.map(item => `- ${item}`).join('\n') + `\n\n`;
    hasContent = true;
  }
  if (categories.Fixed.length > 0) {
    markdown += `### Fixed\n` + categories.Fixed.map(item => `- ${item}`).join('\n') + `\n\n`;
    hasContent = true;
  }
  if (categories.Changed.length > 0) {
    markdown += `### Changed\n` + categories.Changed.map(item => `- ${item}`).join('\n') + `\n\n`;
    hasContent = true;
  }
  if (categories.Refactored.length > 0) {
    markdown += `### Refactored\n` + categories.Refactored.map(item => `- ${item}`).join('\n') + `\n\n`;
    hasContent = true;
  }

  if (customNotes) {
    markdown += `### Notes\n- ${customNotes.replace(/\n/g, '\n- ')}\n\n`;
    hasContent = true;
  }

  if (!hasContent) {
    markdown += `### Changed\n- Maintenance updates and dependencies upgrade.\n\n`;
  }

  markdown += `---\n\n`;

  // 7. Update CHANGELOG.md
  const changelogPath = path.join(__dirname, '../CHANGELOG.md');
  if (fs.existsSync(changelogPath)) {
    let changelogContent = fs.readFileSync(changelogPath, 'utf8');
    
    // Find the first heading matching ## [
    const insertIndex = changelogContent.indexOf('## [');
    if (insertIndex !== -1) {
      const updatedContent = 
        changelogContent.slice(0, insertIndex) + 
        markdown + 
        changelogContent.slice(insertIndex);
      fs.writeFileSync(changelogPath, updatedContent, 'utf8');
      console.log('CHANGELOG.md updated successfully.');
    } else {
      // Append if no header found
      fs.appendFileSync(changelogPath, `\n` + markdown, 'utf8');
      console.log('CHANGELOG.md appended.');
    }
  } else {
    // Create new CHANGELOG.md
    const initContent = `# Changelog\n\nAll notable changes to this project will be documented in this file.\n\n` + markdown;
    fs.writeFileSync(changelogPath, initContent, 'utf8');
    console.log('CHANGELOG.md created.');
  }

  // 8. Run npm version to update package.json & package-lock.json
  console.log('Updating package.json & package-lock.json...');
  run(`npm version ${nextVersion} --no-git-tag-version`);

  // Write release notes to a temp file for GitHub Release body
  const notesPath = path.join(__dirname, '../release-notes.md');
  const cleanNotes = markdown.replace(/^## \[.*?\] - .*?\n\n/, '').replace(/\n+---\n+$/, '');
  fs.writeFileSync(notesPath, cleanNotes, 'utf8');

  console.log(`Successfully completed! Version updated to ${nextVersion}.`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
