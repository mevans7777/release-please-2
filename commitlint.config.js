module.exports = {
    extends: ['@commitlint/config-conventional'],
    plugins: [
      {
        rules: {
          'jira-ticket-required': (parsed) => {
            const { subject } = parsed;
            // Match JIRA ticket pattern (e.g., EVO-1234) at the start of the subject
            const jiraTicketPattern = /^[A-Z]+-\d+\s+-\s+.+/;
            
            if (!subject) return [false, 'Subject cannot be empty'];
            
            const hasJiraTicket = jiraTicketPattern.test(subject);
            
            return [
              hasJiraTicket,
              'Subject must start with a JIRA ticket ID (e.g., "EVO-1234 - description")'
            ];
          }
        }
      }
    ],
    rules: {
      'body-leading-blank': [1, 'always'],
      'body-max-line-length': [2, 'always', 100],
      'footer-leading-blank': [1, 'always'],
      'footer-max-line-length': [2, 'always', 100],
      'header-max-length': [2, 'always', 100],
      'subject-case': [0, 'never', ['sentence-case', 'start-case', 'pascal-case', 'upper-case']],
      'subject-empty': [2, 'never'],
      'subject-full-stop': [2, 'never', '.'],
      'type-case': [2, 'always', 'lower-case'],
      'type-empty': [2, 'never'],
      'type-enum': [
        2,
        'always',
        [
          'build',
          'chore',
          'ci',
          'docs',
          'feat',
          'fix',
          'perf',
          'refactor',
          'revert',
          'style',
          'test',
        ],
      ],
      // Add our custom rule
      'jira-ticket-required': [2, 'always'],
    },
  };