"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpLambda = void 0;
const constructs_1 = require("constructs");
const child_process_1 = require("child_process");
const fs_1 = require("fs");
const os_1 = require("os");
const lambda = require("aws-cdk-lib/aws-lambda");
const path = require("path");
const aws_cdk_lib_1 = require("aws-cdk-lib");
class HttpLambda extends constructs_1.Construct {
    constructor(scope, id, props) {
        super(scope, "HttpLambda" + id);
        const stack = aws_cdk_lib_1.Stack.of(this);
        const { buildScript, architecture, handler, runtime, ...functionProps } = this.validateProps(props);
        const archShorthand = architecture == lambda.Architecture.ARM_64 ? "Arm64" : "X86";
        const adapterLayer = lambda.LayerVersion.fromLayerVersionArn(this, "HttpAdapterLayer", `arn:aws:lambda:${stack.region}:753240598075:layer:LambdaAdapterLayer${archShorthand}:2`);
        const buildArtifactPath = this.executeBuildScript(buildScript, architecture);
        this.func = new lambda.Function(scope, id, {
            ...functionProps,
            runtime,
            handler,
            architecture,
            layers: [adapterLayer],
            code: lambda.Code.fromAsset(buildArtifactPath),
            environment: {
                ...functionProps.environment,
                // This option forces lambda to send the event payload to the http adapter (LambdaAdapterLayer)
                // The adapter then calls our server at port 8080 via http
                AWS_LAMBDA_EXEC_WRAPPER: "/opt/bootstrap",
            },
        });
    }
    executeBuildScript(scriptPath, architecture) {
        const tmpDir = fs_1.mkdtempSync(path.join(os_1.tmpdir(), "asset"));
        let command = `${scriptPath} ${tmpDir} ${architecture.name}`;
        if (path.extname(scriptPath) == ".sh") {
            command = `sh ${command}`;
        }
        child_process_1.spawnSync(command, {
            shell: true,
            cwd: path.dirname(scriptPath),
            stdio: "inherit",
        });
        return tmpDir;
    }
    validateProps(props) {
        const { buildScript } = props;
        if (!path.isAbsolute(buildScript)) {
            throw new Error(`buildScript has to be an absolute path, got a relative path: ${buildScript}`);
        }
        return props;
    }
}
exports.HttpLambda = HttpLambda;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9saWIvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsMkNBQXVDO0FBQ3ZDLGlEQUEwQztBQUMxQywyQkFBaUM7QUFDakMsMkJBQTRCO0FBQzVCLGlEQUFpRDtBQUNqRCw2QkFBNkI7QUFDN0IsNkNBQW9DO0FBb0NwQyxNQUFhLFVBQVcsU0FBUSxzQkFBUztJQUd2QyxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQXNCO1FBQzlELEtBQUssQ0FBQyxLQUFLLEVBQUUsWUFBWSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBRWhDLE1BQU0sS0FBSyxHQUFHLG1CQUFLLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzdCLE1BQU0sRUFBRSxXQUFXLEVBQUUsWUFBWSxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsR0FBRyxhQUFhLEVBQUUsR0FDckUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUU1QixNQUFNLGFBQWEsR0FDakIsWUFBWSxJQUFJLE1BQU0sQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztRQUUvRCxNQUFNLFlBQVksR0FBRyxNQUFNLENBQUMsWUFBWSxDQUFDLG1CQUFtQixDQUMxRCxJQUFJLEVBQ0osa0JBQWtCLEVBQ2xCLGtCQUFrQixLQUFLLENBQUMsTUFBTSx5Q0FBeUMsYUFBYSxJQUFJLENBQ3pGLENBQUM7UUFFRixNQUFNLGlCQUFpQixHQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FDL0MsV0FBVyxFQUNYLFlBQVksQ0FDYixDQUFDO1FBRUYsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLE1BQU0sQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRTtZQUN6QyxHQUFHLGFBQWE7WUFDaEIsT0FBTztZQUNQLE9BQU87WUFDUCxZQUFZO1lBQ1osTUFBTSxFQUFFLENBQUMsWUFBWSxDQUFDO1lBQ3RCLElBQUksRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxpQkFBaUIsQ0FBQztZQUM5QyxXQUFXLEVBQUU7Z0JBQ1gsR0FBRyxhQUFhLENBQUMsV0FBVztnQkFDNUIsK0ZBQStGO2dCQUMvRiwwREFBMEQ7Z0JBQzFELHVCQUF1QixFQUFFLGdCQUFnQjthQUMxQztTQUNGLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCxrQkFBa0IsQ0FBQyxVQUFrQixFQUFFLFlBQWlDO1FBQ3RFLE1BQU0sTUFBTSxHQUFHLGdCQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFNLEVBQUUsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDO1FBRXpELElBQUksT0FBTyxHQUFHLEdBQUcsVUFBVSxJQUFJLE1BQU0sSUFBSSxZQUFZLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDN0QsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxJQUFJLEtBQUssRUFBRTtZQUNyQyxPQUFPLEdBQUcsTUFBTSxPQUFPLEVBQUUsQ0FBQztTQUMzQjtRQUVELHlCQUFTLENBQUMsT0FBTyxFQUFFO1lBQ2pCLEtBQUssRUFBRSxJQUFJO1lBQ1gsR0FBRyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDO1lBQzdCLEtBQUssRUFBRSxTQUFTO1NBQ2pCLENBQUMsQ0FBQztRQUVILE9BQU8sTUFBTSxDQUFDO0lBQ2hCLENBQUM7SUFFRCxhQUFhLENBQUMsS0FBc0I7UUFDbEMsTUFBTSxFQUFFLFdBQVcsRUFBRSxHQUFHLEtBQUssQ0FBQztRQUU5QixJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsRUFBRTtZQUNqQyxNQUFNLElBQUksS0FBSyxDQUNiLGdFQUFnRSxXQUFXLEVBQUUsQ0FDOUUsQ0FBQztTQUNIO1FBRUQsT0FBTyxLQUFLLENBQUM7SUFDZixDQUFDO0NBQ0Y7QUFwRUQsZ0NBb0VDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSBcImNvbnN0cnVjdHNcIjtcbmltcG9ydCB7IHNwYXduU3luYyB9IGZyb20gXCJjaGlsZF9wcm9jZXNzXCI7XG5pbXBvcnQgeyBta2R0ZW1wU3luYyB9IGZyb20gXCJmc1wiO1xuaW1wb3J0IHsgdG1wZGlyIH0gZnJvbSBcIm9zXCI7XG5pbXBvcnQgKiBhcyBsYW1iZGEgZnJvbSBcImF3cy1jZGstbGliL2F3cy1sYW1iZGFcIjtcbmltcG9ydCAqIGFzIHBhdGggZnJvbSBcInBhdGhcIjtcbmltcG9ydCB7IFN0YWNrIH0gZnJvbSBcImF3cy1jZGstbGliXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgSHR0cExhbWJkYVByb3BzXG4gIGV4dGVuZHMgT21pdDxsYW1iZGEuRnVuY3Rpb25Qcm9wcywgXCJoYW5kbGVyXCIgfCBcImxheWVyc1wiIHwgXCJjb2RlXCI+IHtcbiAgYXJjaGl0ZWN0dXJlOiBsYW1iZGEuQXJjaGl0ZWN0dXJlO1xuICAvKipcbiAgICogU2NyaXB0IC8gZXhlY3V0YWJsZSB0byBzdGFydCB0aGUgaHR0cCBzZXJ2ZXIuXG4gICAqIFxuICAgKiBAZXhhbXBsZVxuICAgKiAvLyBOb2RlLmpzIHNjcmlwdCAod2l0aCAjIS91c3IvYmluL2VudiBub2RlKVxuICAgKiBcImluZGV4LmpzXCJcbiAgICogQGV4YW1wbGVcbiAgICogLy8gUnVzdCBiaW5hcnlcbiAgICogXCJib290c3RyYXBcIlxuICAgKi9cbiAgaGFuZGxlcjogc3RyaW5nO1xuICAvKipcbiAgICogQWJzb2x1dGUgcGF0aCB0byB0aGUgYnVpbGQgc2NyaXB0IGZvciB0aGUgaHR0cCBzZXJ2ZXIuIFRoZSBzY3JpcHQgd2lsbCBiZSBjYWxsZWQgYnkgdGhpcyBjb25zdHJ1Y3Qgd2l0aCB0d28gcG9zaXRpb25hbCBwYXJhbWV0ZXJzOlxuICAgKlxuICAgKiAkMTogYSBwYXRoIHRvIGEgdGVtcG9yYXJ5IGRpcmVjdG9yeSwgd2hlcmUgdGhlIGJ1aWxkIHNjcmlwdCBzaG91bGQgY29weSBpdCdzIG91dHB1dCB0b1xuICAgKlxuICAgKiAkMjogdGhlIHNlbGVjdGVkIENQVSBhcmNoaXRlY3R1cmUgKFwiYXJtNjRcIiB8IFwieDg2XzY0XCIpXG4gICAqXG4gICAqIE1ha2Ugc3VyZSB0aGUgZmlsZSBwZXJtaXNzaW9ucyBhbGxvdyB0aGUgY3VycmVudCB1c2VyIHRvIGV4ZWN1dGUgdGhlIHNjcmlwdC5cbiAgICogXG4gICAqIEBleGFtcGxlXG4gICAqIC8vIEJhc2ggc2NyaXB0XG4gICAqIGJ1aWxkLnNoXG4gICAqXG4gICAqIEBleGFtcGxlXG4gICAqIC8vIE5vZGUuanMgc2NyaXB0XG4gICAqIGJ1aWxkLmpzXG4gICAqL1xuICBidWlsZFNjcmlwdDogc3RyaW5nO1xufVxuXG5leHBvcnQgY2xhc3MgSHR0cExhbWJkYSBleHRlbmRzIENvbnN0cnVjdCB7XG4gIHB1YmxpYyBmdW5jOiBsYW1iZGEuRnVuY3Rpb247XG5cbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IEh0dHBMYW1iZGFQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBcIkh0dHBMYW1iZGFcIiArIGlkKTtcblxuICAgIGNvbnN0IHN0YWNrID0gU3RhY2sub2YodGhpcyk7XG4gICAgY29uc3QgeyBidWlsZFNjcmlwdCwgYXJjaGl0ZWN0dXJlLCBoYW5kbGVyLCBydW50aW1lLCAuLi5mdW5jdGlvblByb3BzIH0gPVxuICAgICAgdGhpcy52YWxpZGF0ZVByb3BzKHByb3BzKTtcblxuICAgIGNvbnN0IGFyY2hTaG9ydGhhbmQgPVxuICAgICAgYXJjaGl0ZWN0dXJlID09IGxhbWJkYS5BcmNoaXRlY3R1cmUuQVJNXzY0ID8gXCJBcm02NFwiIDogXCJYODZcIjtcblxuICAgIGNvbnN0IGFkYXB0ZXJMYXllciA9IGxhbWJkYS5MYXllclZlcnNpb24uZnJvbUxheWVyVmVyc2lvbkFybihcbiAgICAgIHRoaXMsXG4gICAgICBcIkh0dHBBZGFwdGVyTGF5ZXJcIixcbiAgICAgIGBhcm46YXdzOmxhbWJkYToke3N0YWNrLnJlZ2lvbn06NzUzMjQwNTk4MDc1OmxheWVyOkxhbWJkYUFkYXB0ZXJMYXllciR7YXJjaFNob3J0aGFuZH06MmBcbiAgICApO1xuXG4gICAgY29uc3QgYnVpbGRBcnRpZmFjdFBhdGggPSB0aGlzLmV4ZWN1dGVCdWlsZFNjcmlwdChcbiAgICAgIGJ1aWxkU2NyaXB0LFxuICAgICAgYXJjaGl0ZWN0dXJlXG4gICAgKTtcblxuICAgIHRoaXMuZnVuYyA9IG5ldyBsYW1iZGEuRnVuY3Rpb24oc2NvcGUsIGlkLCB7XG4gICAgICAuLi5mdW5jdGlvblByb3BzLFxuICAgICAgcnVudGltZSxcbiAgICAgIGhhbmRsZXIsXG4gICAgICBhcmNoaXRlY3R1cmUsXG4gICAgICBsYXllcnM6IFthZGFwdGVyTGF5ZXJdLFxuICAgICAgY29kZTogbGFtYmRhLkNvZGUuZnJvbUFzc2V0KGJ1aWxkQXJ0aWZhY3RQYXRoKSxcbiAgICAgIGVudmlyb25tZW50OiB7XG4gICAgICAgIC4uLmZ1bmN0aW9uUHJvcHMuZW52aXJvbm1lbnQsXG4gICAgICAgIC8vIFRoaXMgb3B0aW9uIGZvcmNlcyBsYW1iZGEgdG8gc2VuZCB0aGUgZXZlbnQgcGF5bG9hZCB0byB0aGUgaHR0cCBhZGFwdGVyIChMYW1iZGFBZGFwdGVyTGF5ZXIpXG4gICAgICAgIC8vIFRoZSBhZGFwdGVyIHRoZW4gY2FsbHMgb3VyIHNlcnZlciBhdCBwb3J0IDgwODAgdmlhIGh0dHBcbiAgICAgICAgQVdTX0xBTUJEQV9FWEVDX1dSQVBQRVI6IFwiL29wdC9ib290c3RyYXBcIixcbiAgICAgIH0sXG4gICAgfSk7XG4gIH1cblxuICBleGVjdXRlQnVpbGRTY3JpcHQoc2NyaXB0UGF0aDogc3RyaW5nLCBhcmNoaXRlY3R1cmU6IGxhbWJkYS5BcmNoaXRlY3R1cmUpIHtcbiAgICBjb25zdCB0bXBEaXIgPSBta2R0ZW1wU3luYyhwYXRoLmpvaW4odG1wZGlyKCksIFwiYXNzZXRcIikpO1xuXG4gICAgbGV0IGNvbW1hbmQgPSBgJHtzY3JpcHRQYXRofSAke3RtcERpcn0gJHthcmNoaXRlY3R1cmUubmFtZX1gO1xuICAgIGlmIChwYXRoLmV4dG5hbWUoc2NyaXB0UGF0aCkgPT0gXCIuc2hcIikge1xuICAgICAgY29tbWFuZCA9IGBzaCAke2NvbW1hbmR9YDtcbiAgICB9XG5cbiAgICBzcGF3blN5bmMoY29tbWFuZCwge1xuICAgICAgc2hlbGw6IHRydWUsXG4gICAgICBjd2Q6IHBhdGguZGlybmFtZShzY3JpcHRQYXRoKSxcbiAgICAgIHN0ZGlvOiBcImluaGVyaXRcIixcbiAgICB9KTtcblxuICAgIHJldHVybiB0bXBEaXI7XG4gIH1cblxuICB2YWxpZGF0ZVByb3BzKHByb3BzOiBIdHRwTGFtYmRhUHJvcHMpIHtcbiAgICBjb25zdCB7IGJ1aWxkU2NyaXB0IH0gPSBwcm9wcztcblxuICAgIGlmICghcGF0aC5pc0Fic29sdXRlKGJ1aWxkU2NyaXB0KSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICBgYnVpbGRTY3JpcHQgaGFzIHRvIGJlIGFuIGFic29sdXRlIHBhdGgsIGdvdCBhIHJlbGF0aXZlIHBhdGg6ICR7YnVpbGRTY3JpcHR9YFxuICAgICAgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcHJvcHM7XG4gIH1cbn1cbiJdfQ==