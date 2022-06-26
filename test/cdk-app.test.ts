import { Capture, Match, Template } from "aws-cdk-lib/assertions";
import * as cdk from "aws-cdk-lib";
import * as sns from "aws-cdk-lib/aws-sns";
import { CdkAppStack } from "../lib/cdk-app-stack";

describe("ProcessorStack", () => {
    test("synthesizes the way we expect", () => {
        const app = new cdk.App();
        // Create the ProcessorStack.
        const processorStack = new CdkAppStack(app, "CdkAppStack", {
            stackName: "CdkAppStack"
        });

        // Prepare the stack for assertions.
        const template = Template.fromStack(processorStack);
        template.hasResourceProperties("AWS::Lambda::Function", {
            Handler: "handler",
            Runtime: "nodejs14.x",
        });


    })
})