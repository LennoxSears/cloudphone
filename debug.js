"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// This file is auto-generated, don't edit it
// 依赖的模块可通过下载工程中的模块依赖文件或右上角的获取 SDK 依赖信息查看
const cloudphone20201230_1 = __importStar(require("@alicloud/cloudphone20201230")), $cloudphone20201230 = cloudphone20201230_1;
const $OpenApi = __importStar(require("@alicloud/openapi-client"));
const tea_util_1 = __importDefault(require("@alicloud/tea-util"));
const fs = __importStar(require("fs"));
const child_process_1 = require("child_process");
const axios_1 = __importDefault(require("axios"));
const express_1 = __importDefault(require("express"));
const ecs20140526_1 = __importStar(require("@alicloud/ecs20140526")), $Ecs20140526 = ecs20140526_1;
const app = (0, express_1.default)();
const port = 3000;
app.get('/download', (req, res) => {
    (0, child_process_1.execSync)(`kill -9 ${scrcpyPID}`);
    const filePath = './test.mkv'; // Replace with the actual file path
    const fileName = 'test2.mkv';
    res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
    res.setHeader('Content-Type', 'application/octet-stream');
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
});
// app.listen(port, () => {
//     console.log(`Server is running on port ${port}`);
// });
// Define the path to the adbkey.pub file
const fs_1 = require("fs");
const RUNNING_NAME = process.env.RUNNING_NAME;
const TASK_SCRIPT = process.env.TASK_SCRIPT;
let scrcpyPID;
function generateUniqueName() {
    const date = new Date();
    const formattedDate = date.toISOString().replace(/[^0-9]/g, ''); // Format the date to remove non-numeric characters
    const uniqueName = `bmy${formattedDate}`;
    return uniqueName;
}
function readAdbKeyPubFile() {
    return __awaiter(this, void 0, void 0, function* () {
        // Define the path to the adbkey.pub file
        const adbkeyPubFilePath = '/root/.android/adbkey.pub';
        try {
            // Use fs.promises.readFile to read the contents of the file
            const publicKeyBody = yield fs_1.promises.readFile(adbkeyPubFilePath, 'utf8');
            // Log the contents of adbkey.pub
            console.log('Contents of adbkey.pub:');
            console.log(publicKeyBody);
            // You can return the publicKeyBody or perform any other actions here
            return publicKeyBody;
        }
        catch (err) {
            console.error(`Error reading file: ${err}`);
            throw err;
        }
    });
}
function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}
let updateS3 = (keyPair, instanceId) => __awaiter(void 0, void 0, void 0, function* () {
    const response_get = yield (0, axios_1.default)({
        url: `https://e91q1mz7e1.execute-api.cn-northwest-1.amazonaws.com.cn/get`,
        method: 'post',
        data: {
            jsonName: RUNNING_NAME,
            bucketName: "bucket-tickets-docker",
        },
        timeout: 190000,
    });
    response_get.data.keyPair = keyPair;
    response_get.data.instanceId = instanceId;
    const response_update = yield (0, axios_1.default)({
        url: `https://e91q1mz7e1.execute-api.cn-northwest-1.amazonaws.com.cn/update`,
        method: 'post',
        data: {
            body: response_get.data,
            jsonName: RUNNING_NAME,
            bucketName: "bucket-tickets-docker",
        },
        timeout: 190000,
    });
});
let updateImage = (imageId) => __awaiter(void 0, void 0, void 0, function* () {
    const response_get = yield (0, axios_1.default)({
        url: `https://e91q1mz7e1.execute-api.cn-northwest-1.amazonaws.com.cn/get`,
        method: 'post',
        data: {
            jsonName: RUNNING_NAME,
            bucketName: "bucket-robots",
        },
        timeout: 190000,
    });
    console.log(response_get.data);
    response_get.data.mobileImage = imageId;
    const response_update = yield (0, axios_1.default)({
        url: `https://e91q1mz7e1.execute-api.cn-northwest-1.amazonaws.com.cn/update`,
        method: 'post',
        data: {
            body: response_get.data,
            jsonName: RUNNING_NAME,
            bucketName: "bucket-robots",
        },
        timeout: 190000,
    });
});
let getImage = () => __awaiter(void 0, void 0, void 0, function* () {
    const response_get = yield (0, axios_1.default)({
        url: `https://e91q1mz7e1.execute-api.cn-northwest-1.amazonaws.com.cn/get`,
        method: 'post',
        data: {
            jsonName: RUNNING_NAME,
            bucketName: "bucket-robots",
        },
        timeout: 190000,
    });
    return response_get.data.mobileImage;
});
function startAdbProcess(instanceIP) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            // Create a new ADB process
            const adbProcess = (0, child_process_1.spawn)('adb', ['connect', `${instanceIP}:5555`], {
                detached: true,
                stdio: 'pipe', // Capture stdio
            });
            // Capture stdout and stderr
            let stdoutData = '';
            let stderrData = '';
            adbProcess.stdout.on('data', (data) => {
                stdoutData += data.toString();
                console.log(stdoutData);
                if (stdoutData.includes(`connected to ${instanceIP}:5555`)) {
                    resolve({ stdout: stdoutData, stderr: stderrData });
                }
            });
            adbProcess.stderr.on('data', (data) => {
                stderrData += data.toString();
                console.log(stderrData);
            });
            adbProcess.on('error', (error) => {
                reject(error);
            });
            adbProcess.on('exit', (code) => {
                if (code !== 0) {
                    reject(new Error(`ADB process exited with code ${code}`));
                }
            });
            console.log(`ADB process started.`);
        });
    });
}
function startAppiumProcess() {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            // Create a new ADB process
            const appiumProcess = (0, child_process_1.spawn)('appium', {
                detached: true,
                stdio: 'pipe', // Capture stdio
            });
            // Capture stdout and stderr
            let stdoutData = '';
            let stderrData = '';
            appiumProcess.stdout.on('data', (data) => {
                stdoutData += data.toString();
                //console.log(stdoutData);
                if (stdoutData.includes(`Appium REST http interface listener started`)) {
                    resolve({ stdout: stdoutData, stderr: stderrData });
                }
            });
            appiumProcess.stderr.on('data', (data) => {
                stderrData += data.toString();
                //console.log(stderrData);
            });
            appiumProcess.on('error', (error) => {
                reject(error);
            });
            appiumProcess.on('exit', (code) => {
                if (code !== 0) {
                    reject(new Error(`Appium process exited with code ${code}`));
                }
            });
            console.log(`Appium process started.`);
        });
    });
}
function installApkProcess() {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            // Create a new ADB process
            const installProcess = (0, child_process_1.spawn)('adb', ['install', `/appium-script/damai_android.apk`], {
                detached: true,
                stdio: 'pipe', // Capture stdio
            });
            // Capture stdout and stderr
            let stdoutData = '';
            let stderrData = '';
            installProcess.stdout.on('data', (data) => {
                stdoutData += data.toString();
                console.log(stdoutData);
                if (stdoutData.includes(`Success`)) {
                    resolve({ stdout: stdoutData, stderr: stderrData });
                }
            });
            installProcess.stderr.on('data', (data) => {
                stderrData += data.toString();
                console.log(stderrData);
            });
            installProcess.on('error', (error) => {
                reject(error);
            });
            installProcess.on('exit', (code) => {
                if (code !== 0) {
                    reject(new Error(`Install process exited with code ${code}`));
                }
            });
            console.log(`Install process started.`);
        });
    });
}
const ALIBABA_CLOUD_ACCESS_KEY_ID = "LTAI5t9h2T4Ry1PUyz6xAJmW";
const ALIBABA_CLOUD_ACCESS_KEY_SECRET = "GBX6RTfg38ZyJS4ItzQK6XXsgBu5sY";
const KEY_PAIR_ID = generateUniqueName();
let INSTANCE_ID = '';
let instanceIP = undefined;
class Client {
    /**
     * 使用AK&SK初始化账号Client
     * @param accessKeyId
     * @param accessKeySecret
     * @return Client
     * @throws Exception
     */
    static createClient(accessKeyId, accessKeySecret) {
        let config = new $OpenApi.Config({
            // 必填，您的 AccessKey ID
            accessKeyId: accessKeyId,
            // 必填，您的 AccessKey Secret
            accessKeySecret: accessKeySecret,
        });
        // Endpoint 请参考 https://api.aliyun.com/product/cloudphone
        config.endpoint = `cloudphone.cn-shanghai.aliyuncs.com`;
        return new cloudphone20201230_1.default(config);
    }
    static main() {
        var _a, _b, _c, _d, _e;
        return __awaiter(this, void 0, void 0, function* () {
            // 请确保代码运行环境设置了环境变量 ALIBABA_CLOUD_ACCESS_KEY_ID 和 ALIBABA_CLOUD_ACCESS_KEY_SECRET。
            // 工程代码泄露可能会导致 AccessKey 泄露，并威胁账号下所有资源的安全性。以下代码示例使用环境变量获取 AccessKey 的方式进行调用，仅供参考，建议使用更安全的 STS 方式，更多鉴权访问方式请参见：https://help.aliyun.com/document_detail/378664.html
            let client = Client.createClient(ALIBABA_CLOUD_ACCESS_KEY_ID, ALIBABA_CLOUD_ACCESS_KEY_SECRET);
            let listInstanceTypesRequest = new $cloudphone20201230.ListInstanceTypesRequest({
                regionId: "cn-shanghai"
            });
            let listImagesRequest = new $cloudphone20201230.ListImagesRequest({
                regionId: "cn-shanghai"
            });
            let listKeyPairsRequest = new $cloudphone20201230.ListKeyPairsRequest({
                regionId: "cn-shanghai"
            });
            let listInstancesRequest = new $cloudphone20201230.ListInstancesRequest({
                regionId: "cn-shanghai"
            });
            const PUBLIC_KEY_BODY = yield readAdbKeyPubFile();
            let importKeyPairRequest = new $cloudphone20201230.ImportKeyPairRequest({
                regionId: "cn-shanghai",
                keyPairName: KEY_PAIR_ID,
                publicKeyBody: PUBLIC_KEY_BODY
            });
            let imageId = yield getImage();
            if (!imageId) {
                imageId = "android_9_0_0_release_4501113_20230712.raw";
            }
            let RunInstancesRequest = new $cloudphone20201230.RunInstancesRequest({
                regionId: "cn-shanghai",
                instanceType: "ecp.cs.large",
                securityGroupId: "sg-uf6f62zjps9f184dmhmf",
                vSwitchId: "vsw-uf6nka54h5kudkl1dmv1x",
                amount: 1,
                imageId: imageId,
                eipBandwidth: 200,
                keyPairName: KEY_PAIR_ID
            });
            try {
                // 复制代码运行请自行打印 API 的返回值
                // const response = await client.listInstanceTypes(listInstanceTypesRequest);
                // console.log(response.body.instanceTypes?.instanceType);
                // const response = await client.listImages(listImagesRequest);
                // console.log(response.body.images);
                // const response = await client.listKeyPairs(listKeyPairsRequest);
                // console.log(response.body.keyPairs);
                const importKeyPair_response = yield client.importKeyPair(importKeyPairRequest);
                console.log(importKeyPair_response.body);
                const runInstances_response = yield client.runInstances(RunInstancesRequest);
                let instanceID = '';
                if ((_a = runInstances_response.body.instanceIds) === null || _a === void 0 ? void 0 : _a.instanceId) {
                    instanceID = (_b = runInstances_response.body.instanceIds) === null || _b === void 0 ? void 0 : _b.instanceId[0];
                    INSTANCE_ID = instanceID;
                }
                let getInfo = false;
                while (!getInfo) {
                    const listInstances_response = yield client.listInstances(listInstancesRequest);
                    if ((_c = listInstances_response.body.instances) === null || _c === void 0 ? void 0 : _c.instance) {
                        (_d = listInstances_response.body.instances) === null || _d === void 0 ? void 0 : _d.instance.forEach((it, idx) => {
                            var _a;
                            if (it.instanceId == instanceID) {
                                instanceIP = (_a = it.eipAddress) === null || _a === void 0 ? void 0 : _a.ipAddress;
                            }
                        });
                        if (instanceIP) {
                            console.log(instanceIP);
                            getInfo = true;
                        }
                    }
                    yield sleep(1000);
                }
                console.log('waiting for boot...');
                const timeoutPromise_boot = new Promise((resolve, reject) => {
                    setTimeout(() => {
                        resolve('booted');
                    }, 1 * 60 * 1000); // 1 minutes in milliseconds
                });
                yield timeoutPromise_boot;
                //update docker-bucket json
                try {
                    updateS3(KEY_PAIR_ID, INSTANCE_ID);
                }
                catch (err) {
                    if (axios_1.default.isAxiosError(err)) {
                        const axiosError = err;
                        console.log('Error: ', axiosError.message, (_e = axiosError.response) === null || _e === void 0 ? void 0 : _e.data);
                    }
                    else {
                        console.error('An error occurred:', err);
                    }
                }
                yield startAdbProcess(instanceIP);
                if (imageId == "android_9_0_0_release_4501113_20230712.raw") {
                    yield installApkProcess();
                }
                yield startAppiumProcess();
                // Create a new script process
                let projectId = RUNNING_NAME ? RUNNING_NAME[RUNNING_NAME.length - 1] : '0';
                const scriptProcess = yield (0, child_process_1.spawn)('node', [`/appium-script/${TASK_SCRIPT}Main.js`, projectId], {
                    detached: true,
                });
                // Attach the stdio of the ADB process to the Node.js process
                yield scriptProcess.stdout.pipe(process.stdout);
                yield scriptProcess.stderr.pipe(process.stderr);
                console.log(`script process started.`);
                scriptProcess.on('close', (code) => __awaiter(this, void 0, void 0, function* () {
                    // This callback is executed when 'damaiMain.js' has completed.
                    console.log(`script process completed with code ${code}`);
                    // You can run your additional task here.
                    // For example, you can call a function or execute code.
                    //commit new mobile image
                    let createImageRequest = new $cloudphone20201230.CreateImageRequest({
                        regionId: "cn-shanghai",
                        instanceId: INSTANCE_ID,
                        imageName: RUNNING_NAME
                    });
                    let stopInstancesRequest = new $cloudphone20201230.StopInstancesRequest({
                        regionId: "cn-shanghai",
                        instanceId: [INSTANCE_ID]
                    });
                    let deleteImagesRequest = new $cloudphone20201230.DeleteImagesRequest({
                        regionId: "cn-shanghai",
                        imageId: [imageId]
                    });
                    if (imageId != "android_9_0_0_release_4501113_20230712.raw") {
                        const response_delete_image = yield client.deleteImages(deleteImagesRequest);
                        console.log(response_delete_image);
                    }
                    const response_stop_instance = yield client.stopInstances(stopInstancesRequest);
                    console.log(response_stop_instance);
                    console.log("waiting for stop...");
                    yield timeoutPromise_boot;
                    const response_create_image = yield client.createImage(createImageRequest);
                    if (response_create_image.body.imageId) {
                        console.log(response_create_image.body.imageId);
                        updateImage(response_create_image.body.imageId);
                    }
                }));
            }
            catch (error) {
                // 如有需要，请打印 error
                console.log(error);
                tea_util_1.default.assertAsString(error.message);
            }
        });
    }
}
exports.default = Client;
//Client.main();
let getAllRobot = () => __awaiter(void 0, void 0, void 0, function* () {
    const response_get = yield (0, axios_1.default)({
        url: `https://e91q1mz7e1.execute-api.cn-northwest-1.amazonaws.com.cn/allJson`,
        method: 'post',
        data: {
            bucketName: "bucket-robots",
        },
        timeout: 190000,
    });
    return response_get.data;
});
let debug = () => __awaiter(void 0, void 0, void 0, function* () {
    let config = yield new $OpenApi.Config({
        // 必填，您的 AccessKey ID
        accessKeyId: ALIBABA_CLOUD_ACCESS_KEY_ID,
        // 必填，您的 AccessKey Secret
        accessKeySecret: ALIBABA_CLOUD_ACCESS_KEY_SECRET
    });
    // Endpoint 请参考 https://api.aliyun.com/product/cloudphone
    config.endpoint = `ecs.cn-shanghai.aliyuncs.com`;
    let client = yield new ecs20140526_1.default(config);
    let describeInstanceTypesRequest = new $Ecs20140526.DescribeInstanceTypesRequest({
        maximumCpuCoreCount: 2,
        maximumMemorySize: 4.0
    });
    let result = yield client.describeInstanceTypes(describeInstanceTypesRequest);
    console.log(result.body.instanceTypes);
});
debug();
