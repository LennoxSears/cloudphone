// This file is auto-generated, don't edit it
// 依赖的模块可通过下载工程中的模块依赖文件或右上角的获取 SDK 依赖信息查看
import cloudphone20201230, * as $cloudphone20201230 from '@alicloud/cloudphone20201230';
import OpenApi, * as $OpenApi from '@alicloud/openapi-client';
import Util, * as $Util from '@alicloud/tea-util';
import * as $tea from '@alicloud/tea-typescript';
import * as fs from 'fs';
import { spawn, execSync, exec } from 'child_process';
import axios, { AxiosResponse, AxiosError } from 'axios';
import express from 'express';
import Ecs20140526, * as $Ecs20140526 from '@alicloud/ecs20140526';

const app = express();
const port = 3000;

app.get('/download', (req, res) => {
    execSync(`kill -9 ${scrcpyPID}`);
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
import { promises as fsPromises } from 'fs';

const RUNNING_NAME = process.env.RUNNING_NAME;
const TASK_SCRIPT = process.env.TASK_SCRIPT;
let scrcpyPID: number

function generateUniqueName(): string {
    const date = new Date();
    const formattedDate = date.toISOString().replace(/[^0-9]/g, ''); // Format the date to remove non-numeric characters
    const uniqueName = `bmy${formattedDate}`;
    return uniqueName;
}

async function readAdbKeyPubFile() {
    // Define the path to the adbkey.pub file
    const adbkeyPubFilePath = '/root/.android/adbkey.pub';

    try {
        // Use fs.promises.readFile to read the contents of the file
        const publicKeyBody = await fsPromises.readFile(adbkeyPubFilePath, 'utf8');

        // Log the contents of adbkey.pub
        console.log('Contents of adbkey.pub:');
        console.log(publicKeyBody);

        // You can return the publicKeyBody or perform any other actions here
        return publicKeyBody;
    } catch (err) {
        console.error(`Error reading file: ${err}`);
        throw err;
    }
}

function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

let updateS3 = async (keyPair: string, instanceId: string) => {
    const response_get: AxiosResponse = await axios({
        url: `https://e91q1mz7e1.execute-api.cn-northwest-1.amazonaws.com.cn/get`,
        method: 'post',
        data: {
            jsonName: RUNNING_NAME,
            bucketName: "bucket-tickets-docker",
        },
        timeout: 190000,
    });
    response_get.data.keyPair = keyPair
    response_get.data.instanceId = instanceId
    const response_update: AxiosResponse = await axios({
        url: `https://e91q1mz7e1.execute-api.cn-northwest-1.amazonaws.com.cn/update`,
        method: 'post',
        data: {
            body: response_get.data,
            jsonName: RUNNING_NAME,
            bucketName: "bucket-tickets-docker",
        },
        timeout: 190000,
    });
}

let updateImage = async (imageId: string) => {
    const response_get: AxiosResponse = await axios({
        url: `https://e91q1mz7e1.execute-api.cn-northwest-1.amazonaws.com.cn/get`,
        method: 'post',
        data: {
            jsonName: RUNNING_NAME,
            bucketName: "bucket-robots",
        },
        timeout: 190000,
    });
    console.log(response_get.data)
    response_get.data.mobileImage = imageId
    const response_update: AxiosResponse = await axios({
        url: `https://e91q1mz7e1.execute-api.cn-northwest-1.amazonaws.com.cn/update`,
        method: 'post',
        data: {
            body: response_get.data,
            jsonName: RUNNING_NAME,
            bucketName: "bucket-robots",
        },
        timeout: 190000,
    });
}

let getImage = async () => {
    const response_get: AxiosResponse = await axios({
        url: `https://e91q1mz7e1.execute-api.cn-northwest-1.amazonaws.com.cn/get`,
        method: 'post',
        data: {
            jsonName: RUNNING_NAME,
            bucketName: "bucket-robots",
        },
        timeout: 190000,
    });
    return response_get.data.mobileImage;
}

async function startAdbProcess(instanceIP: string | undefined) {
    return new Promise((resolve, reject) => {
        // Create a new ADB process
        const adbProcess = spawn('adb', ['connect', `${instanceIP}:5555`], {
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
}

async function startAppiumProcess() {
    return new Promise((resolve, reject) => {
        // Create a new ADB process
        const appiumProcess = spawn('appium', {
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
}

async function installApkProcess() {
    return new Promise((resolve, reject) => {
        // Create a new ADB process
        const installProcess = spawn('adb', ['install', `/appium-script/damai_android.apk`], {
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
}

const ALIBABA_CLOUD_ACCESS_KEY_ID = "LTAI5t9h2T4Ry1PUyz6xAJmW"
const ALIBABA_CLOUD_ACCESS_KEY_SECRET = "GBX6RTfg38ZyJS4ItzQK6XXsgBu5sY"
const KEY_PAIR_ID = generateUniqueName();
let INSTANCE_ID = '';
let instanceIP: string | undefined = undefined;

export default class Client {

    /**
     * 使用AK&SK初始化账号Client
     * @param accessKeyId
     * @param accessKeySecret
     * @return Client
     * @throws Exception
     */
    static createClient(accessKeyId: string | undefined, accessKeySecret: string | undefined): cloudphone20201230 {
        let config = new $OpenApi.Config({
            // 必填，您的 AccessKey ID
            accessKeyId: accessKeyId,
            // 必填，您的 AccessKey Secret
            accessKeySecret: accessKeySecret,
        });
        // Endpoint 请参考 https://api.aliyun.com/product/cloudphone
        config.endpoint = `cloudphone.cn-shanghai.aliyuncs.com`;
        return new cloudphone20201230(config);
    }

    static async main(): Promise<void> {
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

        const PUBLIC_KEY_BODY = await readAdbKeyPubFile();
        let importKeyPairRequest = new $cloudphone20201230.ImportKeyPairRequest({
            regionId: "cn-shanghai",
            keyPairName: KEY_PAIR_ID,
            publicKeyBody: PUBLIC_KEY_BODY
        });

        let imageId = await getImage();
        if (!imageId) {
            imageId = "android_9_0_0_release_4501113_20230712.raw"
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

            const importKeyPair_response = await client.importKeyPair(importKeyPairRequest);
            console.log(importKeyPair_response.body);

            const runInstances_response = await client.runInstances(RunInstancesRequest);
            let instanceID = ''
            if (runInstances_response.body.instanceIds?.instanceId) {
                instanceID = runInstances_response.body.instanceIds?.instanceId[0]
                INSTANCE_ID = instanceID
            }

            let getInfo = false

            while (!getInfo) {
                const listInstances_response = await client.listInstances(listInstancesRequest);
                if (listInstances_response.body.instances?.instance) {
                    listInstances_response.body.instances?.instance.forEach((it, idx) => {
                        if (it.instanceId == instanceID) {
                            instanceIP = it.eipAddress?.ipAddress
                        }
                    })
                    if (instanceIP) {
                        console.log(instanceIP)
                        getInfo = true
                    }
                }
                await sleep(1000);
            }

            console.log('waiting for boot...')
            const timeoutPromise_boot = new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve('booted');
                }, 1 * 60 * 1000); // 1 minutes in milliseconds
            });

            await timeoutPromise_boot
            //update docker-bucket json
            try {
                updateS3(KEY_PAIR_ID, INSTANCE_ID)
            } catch (err) {
                if (axios.isAxiosError(err)) {
                    const axiosError: AxiosError = err;
                    console.log('Error: ', axiosError.message, axiosError.response?.data);
                } else {
                    console.error('An error occurred:', err);
                }
            }

            await startAdbProcess(instanceIP);
            if (imageId == "android_9_0_0_release_4501113_20230712.raw") {
                await installApkProcess();
            }
            await startAppiumProcess();

            // Create a new script process
            let projectId = RUNNING_NAME ? RUNNING_NAME[RUNNING_NAME.length - 1] : '0'
            const scriptProcess = await spawn('node', [`/appium-script/${TASK_SCRIPT}Main.js`, projectId], {
                detached: true,
            });

            // Attach the stdio of the ADB process to the Node.js process
            await scriptProcess.stdout.pipe(process.stdout);
            await scriptProcess.stderr.pipe(process.stderr);

            console.log(`script process started.`);

            scriptProcess.on('close', async (code) => {
                // This callback is executed when 'damaiMain.js' has completed.
                console.log(`script process completed with code ${code}`);

                // You can run your additional task here.
                // For example, you can call a function or execute code.
                //commit new mobile image
                let createImageRequest = new $cloudphone20201230.CreateImageRequest({
                    regionId: "cn-shanghai",
                    instanceId: INSTANCE_ID,
                    imageName: RUNNING_NAME
                })
                let stopInstancesRequest = new $cloudphone20201230.StopInstancesRequest({
                    regionId: "cn-shanghai",
                    instanceId: [INSTANCE_ID]
                })
                let deleteImagesRequest = new $cloudphone20201230.DeleteImagesRequest({
                    regionId: "cn-shanghai",
                    imageId: [imageId]
                })
                if (imageId != "android_9_0_0_release_4501113_20230712.raw") {
                    const response_delete_image = await client.deleteImages(deleteImagesRequest);
                    console.log(response_delete_image);
                }
                const response_stop_instance = await client.stopInstances(stopInstancesRequest);
                console.log(response_stop_instance);
                console.log("waiting for stop...")
                await timeoutPromise_boot
                const response_create_image = await client.createImage(createImageRequest);
                if (response_create_image.body.imageId) {
                    console.log(response_create_image.body.imageId)
                    updateImage(response_create_image.body.imageId)
                }
            });

        } catch (error: any) {
            // 如有需要，请打印 error
            console.log(error)
            Util.assertAsString(error.message);
        }
    }

}

//Client.main();
let getAllRobot = async () => {
    const response_get: AxiosResponse = await axios({
        url: `https://e91q1mz7e1.execute-api.cn-northwest-1.amazonaws.com.cn/allJson`,
        method: 'post',
        data: {
            bucketName: "bucket-robots",
        },
        timeout: 190000,
    });
    return response_get.data
}

let debug = async () => {
    let config = await new $OpenApi.Config({
        // 必填，您的 AccessKey ID
        accessKeyId: ALIBABA_CLOUD_ACCESS_KEY_ID,
        // 必填，您的 AccessKey Secret
        accessKeySecret: ALIBABA_CLOUD_ACCESS_KEY_SECRET
    });
    // Endpoint 请参考 https://api.aliyun.com/product/cloudphone
    config.endpoint = `ecs.cn-shanghai.aliyuncs.com`;
    let client = await new Ecs20140526(config)
    let describeInstanceTypesRequest = new $Ecs20140526.DescribeInstanceTypesRequest({
        maximumCpuCoreCount : 2,
        maximumMemorySize : 4.0
    })
    let result = await client.describeInstanceTypes(describeInstanceTypesRequest)
    console.log(result.body.instanceTypes);
}


debug()