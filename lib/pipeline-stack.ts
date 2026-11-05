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
        input: CodePipelineSource.connection('itsdaudi/capstone4m1', 'main', {
          connectionArn: 'arn:aws:codeconnections:us-east-2:325657596892:connection/f75f9621-da72-4729-9081-0c8dcd18b890',
        }),
        commands: ['npm ci', 'npm run build', 'npx cdk synth'],
      }),
    });

    pipeline.addStage(new WorkflowStage(this, 'Prod'));
  }
}