const { Command, flags } = require('@oclif/command');

const RunCommand = require('./run');

class RunLambdaCommand extends Command {
  static aliases = ['run:lambda'];
  static strict = false;

  async run() {
    const { flags, argv, args } = this.parse(RunLambdaCommand);

    flags['platform-opt'] = [
      `region=${flags.region}`,
      `memory-size=${flags['memory-size']}`,
      `architecture=${flags.architecture}`
    ];

    delete flags.region;
    delete flags['memory-size'];
    delete flags.architecture;

    if (flags['lambda-role-arn']) {
      flags['platform-opt'].push(`lambda-role-arn=${flags['lambda-role-arn']}`);
    }

    if (flags['security-group-ids']) {
      flags['platform-opt'].push(
        `security-group-ids=${flags['security-group-ids']}`
      );
    }

    if (flags['subnet-ids']) {
      flags['platform-opt'].push(`subnet-ids=${flags['subnet-ids']}`);
    }

    RunCommand.runCommandImplementation(flags, argv, args);
  }
}

RunLambdaCommand.description = `launch a test using AWS Lambda
Launch a test on AWS Lambda

Examples:

  To run a test script in my-test.yml on AWS Lambda in us-east-1 region
  distributed across 10 Lambda functions:

    $ artillery run:lambda --region us-east-1 --count 10 my-test.yml
`;
RunLambdaCommand.flags = {
  target: flags.string({
    char: 't',
    description:
      'Set target endpoint. Overrides the target already set in the test script'
  }),
  output: flags.string({
    char: 'o',
    description: 'Write a JSON report to file'
  }),
  insecure: flags.boolean({
    char: 'k',
    description: 'Allow insecure TLS connections; do not use in production'
  }),
  overrides: flags.string({
    description: 'Dynamically override values in the test script; a JSON object'
  }),
  variables: flags.string({
    char: 'v',
    description:
      'Set variables available to vusers during the test; a JSON object'
  }),
  // TODO: Replace with --profile
  environment: flags.string({
    char: 'e',
    description: 'Use one of the environments specified in config.environments'
  }),
  config: flags.string({
    char: 'c',
    description: 'Read configuration for the test from the specified file'
  }),
  payload: flags.string({
    char: 'p',
    description: 'Specify a CSV file for dynamic data'
  }),
  // multiple allows multiple arguments for the -i flag, which means that e.g.:
  // artillery -i one.yml -i two.yml main.yml
  // does not work as expected. Instead of being considered an argument, "main.yml"
  // is considered to be input for "-i" and oclif then complains about missing
  // argument
  input: flags.string({
    char: 'i',
    description: 'Input script file',
    multiple: true,
    hidden: true
  }),
  dotenv: flags.string({
    description: 'Path to a dotenv file to load environment variables from'
  }),
  count: flags.string({
    // locally defaults to number of CPUs with mode = distribute
    default: '1'
  }),
  tags: flags.string({
    description:
      'Comma-separated list of tags in key:value format to tag the test run, for example: --tags team:sqa,service:foo'
  }),
  note: flags.string({
    description: 'Add a note/annotation to the test run'
  }),
  record: flags.boolean({
    description: 'Record test run to Artillery Cloud'
  }),
  key: flags.string({
    description: 'API key for Artillery Cloud'
  }),
  architecture: flags.string({
    description: 'Architecture of the Lambda function',
    default: 'arm64'
  }),
  'memory-size': flags.string({
    description: 'Memory size of the Lambda function',
    default: '4096'
  }),
  region: flags.string({
    description: 'AWS region to run the test in',
    default: 'us-east-1'
  }),
  'lambda-role-arn': flags.string({
    description: 'ARN of the IAM role to use for the Lambda function'
  }),
  'security-group-ids': flags.string({
    description:
      'Comma-separated list of security group IDs to use for the Lambda function'
  }),
  'subnet-ids': flags.string({
    description:
      'Comma-separated list of subnet IDs to use for the Lambda function'
  })
};

RunLambdaCommand.args = [{ name: 'script', required: true }];

module.exports = RunLambdaCommand;