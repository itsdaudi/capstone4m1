import * as cdk from 'aws-cdk-lib';
import { CodePipeline, CodePipelineSource, ShellStep } from 'aws-cdk-lib/pipelines';
import { Construct } from 'constructs';
import { WorkflowStage } from './workflow-stage';

export class PipelineStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const pipeline = new CodePipeline(this, 'Pipeline', {
      pipelineName: 'CapstonePipeline',
      synth: new ShellStep('Synth', {
        input: CodePipelineSource.connection('YOUR_USER/YOUR_REPO', 'main', {
          connectionArn: 'PASTE_YOUR_CONNECTION_ARN',
        }),
        commands: ['npm ci', 'npm run build', 'npx cdk synth'],
      }),
    });

    pipeline.addStage(new WorkflowStage(this, 'Prod'));
  }
}