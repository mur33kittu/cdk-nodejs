import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { join } from 'path';
import { copySync } from 'fs-extra';

export class CdkAppStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id);

    // const apiBaseUrl = new cdk.CfnParameter(this, "newsApiURL", {
    //   default: "https://newsapi.org/v2/",
    //   noEcho: false
    // })

    const api = new apigateway.RestApi(this, 'api', {
      description: 'newsApi',
      deployOptions: {
        stageName: 'dev',
      },
      // 👇 enable CORS
      defaultCorsPreflightOptions: {
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowCredentials: true,
        allowOrigins: apigateway.Cors.ALL_ORIGINS
      },
    });

    const packages = ["ts-newsapi"];
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
      code: lambda.Code.fromAsset(join(__dirname, "../dist/NewsApi")),
      description: 'lambda layer',
    });

    // 👇 define GET function
    const headLinesLambda = new lambda.Function(this, 'headlines', {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'headlines.handler',
      code: lambda.Code.fromAsset(join(__dirname, '../dist/src/handlers')),
      layers: [myLayers],
      // environment: { newsApiBaseUrl: apiBaseUrl.default }
    });

    const everythingLambda = new lambda.Function(this, 'everything', {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'everything.handler',
      code: lambda.Code.fromAsset(join(__dirname, '../dist/src/handlers')),
      layers: [myLayers],
      // environment: { newsApiBaseUrl: apiBaseUrl.default }
    });

    // 👇 add a / resource
    const headlines = api.root.addResource('headlines');
    const country = headlines.addResource('{country}');
    const everything = api.root.addResource('everything');
    const searchString = everything.addResource('{searchString}');

    // 👇 integrate GET / with lambdas
    country.addMethod('GET', new apigateway.LambdaIntegration(headLinesLambda, { proxy: true }));
    headlines.addMethod('GET', new apigateway.LambdaIntegration(headLinesLambda, { proxy: true }));

    everything.addMethod('GET', new apigateway.LambdaIntegration(everythingLambda, { proxy: true }));
    searchString.addMethod('GET', new apigateway.LambdaIntegration(everythingLambda, { proxy: true }));

    // 👇 create an Output for the API URL
    new cdk.CfnOutput(this, 'apiUrl', { value: api.url });
  }
}
