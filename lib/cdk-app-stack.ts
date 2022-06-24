import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { join } from 'path';
import { copySync } from 'fs-extra';

export class CdkAppStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id + "Wrapper");

    const api = new apigateway.RestApi(this, 'api', {
      description: 'newsApi',
      deployOptions: {
        stageName: 'dev',
      },
      // 👇 enable CORS
      defaultCorsPreflightOptions: {
        allowHeaders: [
          'Content-Type',
          'X-Amz-Date',
          'Authorization',
          'X-Api-Key',
        ],
        allowMethods: ['OPTIONS', 'GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
        allowCredentials: true,
        allowOrigins: ['http://localhost:3000'],
      },
    });

    const packages = ["asynckit", "axios", "combined-stream", "delayed-stream", "follow-stream", "form-data", "mime-db", "mime-types", "node-gyp-build"];
    const nodeModulesPath = join(__dirname, "../node_modules");
    const buildPath = join(__dirname, "../dist");
    for (const packageName of packages) {
      copySync(join(nodeModulesPath, packageName),
        join(buildPath, id, "nodejs", "node_modules", packageName))
    }


    const myLayers = new lambda.LayerVersion(this, 'MyLayers', {
      compatibleRuntimes: [
        lambda.Runtime.NODEJS_16_X,
        lambda.Runtime.NODEJS_14_X,
      ],
      code: lambda.Code.fromAsset(join(__dirname, "../dist/CdkAppStack")),
      description: 'lambda layer',
    });

    // 👇 define GET todos function
    const headLinesLambda = new lambda.Function(this, 'headlines', {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'handler',
      code: lambda.Code.fromAsset(join(__dirname, '../src/handlers')),
      layers: [myLayers]
    });

    // 👇 add a /todos resource
    const headlines = api.root.addResource('headlines');

    // 👇 integrate GET /todos with getTodosLambda
    headlines.addMethod(
      'GET',
      new apigateway.LambdaIntegration(headLinesLambda, { proxy: true }),
    );

    // 👇 create an Output for the API URL
    new cdk.CfnOutput(this, 'apiUrl', { value: api.url });
  }
}
