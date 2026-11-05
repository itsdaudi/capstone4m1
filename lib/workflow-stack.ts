import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as ssm from 'aws-cdk-lib/aws-ssm';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import * as tasks from 'aws-cdk-lib/aws-stepfunctions-tasks';
import { Construct } from 'constructs';

export class WorkflowStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // ---------- STEP 1 ----------
    const configParam = new ssm.StringParameter(this, 'AppGreeting', {
      parameterName: '/app/config/greeting',
      stringValue: 'Hello from CI/CD Automated Infrastructure!',
    });

    const myLambda = new lambda.Function(this, 'WorkflowTask', {
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('lambda'),
      environment: { PARAM_NAME: configParam.parameterName },
    });

    configParam.grantRead(myLambda);

    // ---------- STEP 2 ----------
    const start = new sfn.Pass(this, 'StartWorkflow');

    const invokeTask = new tasks.LambdaInvoke(this, 'Invoke Task', {
      lambdaFunction: myLambda,
      payloadResponseOnly: true,
    });

    invokeTask.addRetry({
      errors: ['States.ALL'],
      maxAttempts: 2,
      interval: cdk.Duration.seconds(2),
      backoffRate: 2,
    });

    const failState = new sfn.Fail(this, 'WorkflowFailed', {
      cause: 'Lambda failed after retries',
    });
    invokeTask.addCatch(failState, { errors: ['States.ALL'] });

    new sfn.StateMachine(this, 'MyStateMachine', {
      definitionBody: sfn.DefinitionBody.fromChainable(
        start.next(invokeTask)
      ),
      timeout: cdk.Duration.minutes(5),
    });
  }
}