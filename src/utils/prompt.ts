import type { CommitType } from './config.js';

const commitTypeFormats: Record<CommitType, string> = {
	'': '<commit message>',
	conventional: '<type>(<optional scope>): <commit message>',
};
const specifyCommitFormat = (type: CommitType) =>
	`The output response must be in format:\n${commitTypeFormats[type]}.`;

const specifyExample = () =>
`
if the input is: 
<input>
Author: LiYang <cctv1005s@gmail.com>
Date:   Thu Oct 24 17:17:24 2024 +0800

    feat: update commit format message

diff --git a/package.json b/package.json
index d725a58..4b3ef8b 100644
--- a/package.json
+++ b/package.json
@@ -1,6 +1,6 @@
 {
        "name": "aicommits-kimi",
-       "version": "0.0.4",
+       "version": "0.0.5",
        "description": "Writes your git commit messages for you with AI",
        "keywords": [
                "ai",
diff --git a/src/utils/prompt.ts b/src/utils/prompt.ts
index 44fb4bb..751ff4c 100644
--- a/src/utils/prompt.ts
+++ b/src/utils/prompt.ts
@@ -5,7 +5,7 @@ const commitTypeFormats: Record<CommitType, string> = {
        conventional: '<type>(<optional scope>): <commit message>',
 };
 const specifyCommitFormat = (type: CommitType) =>
-       \`The output response must be in format:\n$\{commitTypeFormats[type]}\`;
+       \`The output response must be in format:\n$\{commitTypeFormats[type]}, for example: feat: add new feature or fix: correct typo\`;

</input>

the output response should be:
<output>
feat: update commit format message
</output>
`;

const commitTypes: Record<CommitType, string> = {
	'': '',

	/**
	 * References:
	 * Commitlint:
	 * https://github.com/conventional-changelog/commitlint/blob/18fbed7ea86ac0ec9d5449b4979b762ec4305a92/%40commitlint/config-conventional/index.js#L40-L100
	 *
	 * Conventional Changelog:
	 * https://github.com/conventional-changelog/conventional-changelog/blob/d0e5d5926c8addba74bc962553dd8bcfba90e228/packages/conventional-changelog-conventionalcommits/writer-opts.js#L182-L193
	 */
	conventional: `Choose a type from the type-to-description JSON below that best describes the git diff:\n${JSON.stringify(
		{
			docs: 'Documentation only changes',
			style:
				'Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)',
			refactor: 'A code change that neither fixes a bug nor adds a feature',
			perf: 'A code change that improves performance',
			test: 'Adding missing tests or correcting existing tests',
			build: 'Changes that affect the build system or external dependencies',
			ci: 'Changes to our CI configuration files and scripts',
			chore: "Other changes that don't modify src or test files",
			revert: 'Reverts a previous commit',
			feat: 'A new feature',
			fix: 'A bug fix',
		},
		null,
		2
	)}`,
};

export const generatePrompt = (
	locale: string,
	maxLength: number,
	type: CommitType
) =>
	[
		'Generate a concise git commit message written in present tense for the following code diff with the given specifications below:',
		`Message language: ${locale}`,
		`Commit message must be a maximum of ${maxLength} characters.`,
		'Exclude anything unnecessary such as translation. Your entire response will be passed directly into git commit.',
		commitTypes[type],
		specifyCommitFormat(type),
		specifyExample(),
	]
		.filter(Boolean)
		.join('\n');
