#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { WorkflowStack } from '../lib/workflow-stack';

const app = new cdk.App();
new WorkflowStack(app, 'WorkflowStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});