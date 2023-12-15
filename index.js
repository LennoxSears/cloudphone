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
const tea_util_1 = __importDefault(require("@alicloud/tea-util"));
const fs = __importStar(require("fs"));
const child_process_1 = require("child_process");
const axios_1 = __importDefault(require("axios"));
// Define the path to the adbkey.pub file
const fs_1 = require("fs");
const express_1 = __importDefault(require("express"));
const RUNNING_NAME = process.env.RUNNING_NAME;
const DEBUG = process.env.DEBUG;
const ALI_ACCOUNT_IND = Number(process.env.ALI_ACCOUNT_IND);
let scrcpyPID;
const app = (0, express_1.default)();
const port = 3000;
app.get('/record', (req, res) => {
    try {
        //execSync(`kill -9 ${scrcpyPID}`);
        const filePath = '/media/record.mkv'; // Replace with the actual file path
        const fileName = `${RUNNING_NAME}.mkv`;
        res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
        res.setHeader('Content-Type', 'application/octet-stream');
        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(res);
    }
    catch (e) {
        res.status(e.statusCode);
    }
});
app.get('/log', (req, res) => {
    try {
        //execSync(`kill -9 ${scrcpyPID}`);
        const filePath = '/media/log.txt'; // Replace with the actual file path
        const fileName = `${RUNNING_NAME}.txt`;
        res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
        res.setHeader('Content-Type', 'application/octet-stream');
        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(res);
    }
    catch (e) {
        res.status(e.statusCode);
    }
});
app.listen(port, () => {
    console.log(`download server is running on port ${port}`);
});
function generateUniqueName() {
    const date = new Date();
    const formattedDate = date.toISOString().replace(/[^0-9]/g, ''); // Format the date to remove non-numeric characters
    const uniqueName = `bmy${formattedDate}`;
    return uniqueName;
}
function readAdbKeyPubFile() {
    return __awaiter(this, void 0, void 0, function* () {
        // Define the path to the adbkey.pub file
        const adbkeyPubFilePath = '/home/ubuntu/.android/adbkey.pub';
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
function writeAdbKeyPubFile(newContent) {
    return __awaiter(this, void 0, void 0, function* () {
        // Define the path to the adbkey.pub file
        const adbkeyPubFilePath = '/home/ubuntu/.android/adbkey.pub';
        try {
            // Use fs.promises.writeFile to write the new content to the file
            yield fs_1.promises.writeFile(adbkeyPubFilePath, newContent, 'utf8');
            console.log('adbkey.pub successfully overwritten with new content.');
        }
        catch (err) {
            // Handle errors, log the error, and rethrow it
            console.error(`Error writing file: ${err}`);
            throw err;
        }
    });
}
// Example usage: Call the function with the new content
const newAdbKeyContent = 'QAAAAG9H0NxxCPvEDNvUHrPBNRPLDNbNQ8FNac+hk/mOTCl4RoG5kpJAb95ld3FhlSxTqyijB9IoWeR8KHaqrPCIY93SPbCH2iTmi07cfHP/IyTK3xe9Mckq/hbm8OrV/Oz7ShO3Ij9EpcV46oWvPu7OlQZpktAoIBIuHWgX8FWJ0jD3B0tdlc75+eTwM4Jqn8WyYSvTjEIb97qKPsUQGO3x0b/B7rmfiBB77nkAbIDrqoyZ1THwPW/36JgOXS+RNyb+NotXL0o1ts3ChWlN6HBJ4mBgc7YN6ZKFS9oCm6seoJCsF5RI+4sCDbp1QuAPcD61LoVNMD6fYM6VJaRUODamdcNgKQerkL+hb0O98//FiZKzEqAWNxZP+kUem22RWGq11ild+60AK10pzcZ0HlYYoCyxbahY20/G+hiTRtIaRPBC6tzvOmdIMmkiv2JSdLm3TJUqucA0cygC0FTAAeTaELppk34VSQJZL1xdihnCG7AmMTY5H6dlOmdToSpS6ZhQ7zo4IFul8aBttYTQW8fSneOcQvte3vCJveMGTu1MAVPHE3agyJSlJrKDothUGfOiEJhVn6K+N77uheDW1Aczc8amXBp2Q7lKamwMyBOHFDfqaZkN/OMfGHtWEVAXjZ6Tsw/wEo0H7FJ5HA+UcV+3iQWFbR9nZARI5PpKJ9NfiEsllT5IhgEAAQA= Starnes@WIN-20230321QKL';
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
let getInstanceIP = () => __awaiter(void 0, void 0, void 0, function* () {
    const response_get = yield (0, axios_1.default)({
        url: `https://e91q1mz7e1.execute-api.cn-northwest-1.amazonaws.com.cn/get`,
        method: 'post',
        data: {
            jsonName: RUNNING_NAME,
            bucketName: "bucket-robots",
        },
        timeout: 190000,
    });
    return response_get.data.ip;
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
function downloadConfProcess() {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            // Create a new ADB process
            const adbProcess = (0, child_process_1.spawn)('curl', ['-o', '/etc/wireguard/wg0.conf', `https://eci-bucket.s3.cn-northwest-1.amazonaws.com.cn/eci-${RUNNING_NAME}.conf`], {
                detached: true,
                stdio: 'pipe', // Capture stdio
            });
            // Capture stdout and stderr
            let stdoutData = '';
            let stderrData = '';
            adbProcess.stdout.on('data', (data) => {
                stdoutData += data.toString();
                //console.log(stdoutData);
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
                    reject(new Error(`WGConf process exited with code ${code}`));
                }
            });
            console.log(`WGConf process started.`);
            setTimeout(() => {
                resolve('done');
            }, 1 * 10 * 1000);
        });
    });
}
function startWGProcess() {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            // Create a new ADB process
            const adbProcess = (0, child_process_1.spawn)('sudo', ['wg-quick', 'up', 'wg0'], {
                detached: true,
                stdio: 'pipe', // Capture stdio
            });
            // Capture stdout and stderr
            let stdoutData = '';
            let stderrData = '';
            adbProcess.stdout.on('data', (data) => {
                stdoutData += data.toString();
                //console.log(stdoutData);
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
                    reject(new Error(`startWG process exited with code ${code}`));
                }
            });
            console.log(`startWG process started.`);
            setTimeout(() => {
                resolve('done');
            }, 1 * 5 * 1000);
        });
    });
}
function statusAdbProcess() {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            // Create a new ADB process
            const adbProcess = (0, child_process_1.spawn)('adb', ['devices'], {
                detached: true,
                stdio: 'pipe', // Capture stdio
            });
            // Capture stdout and stderr
            let stdoutData = '';
            let stderrData = '';
            adbProcess.stdout.on('data', (data) => {
                stdoutData += data.toString();
                console.log(stdoutData);
                if (stdoutData.includes(`List`)) {
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
function installApkProcess(apk) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            // Create a new ADB process
            const installProcess = (0, child_process_1.spawn)('adb', ['install', apk], {
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
let ali_account_raw = fs.readFileSync('./aliyun_config.json', 'utf8');
let ali_account = JSON.parse(ali_account_raw);
const ALIBABA_CLOUD_ACCESS_KEY_ID = ali_account[ALI_ACCOUNT_IND].ALIBABA_CLOUD_ACCESS_KEY_ID;
const ALIBABA_CLOUD_ACCESS_KEY_SECRET = ali_account[ALI_ACCOUNT_IND].ALIBABA_CLOUD_ACCESS_KEY_SECRET;
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
    // static createClient(accessKeyId: string | undefined, accessKeySecret: string | undefined): cloudphone20201230 {
    //   let config = new $OpenApi.Config({
    //     // 必填，您的 AccessKey ID
    //     accessKeyId: accessKeyId,
    //     // 必填，您的 AccessKey Secret
    //     accessKeySecret: accessKeySecret,
    //   });
    //   // Endpoint 请参考 https://api.aliyun.com/product/cloudphone
    //   config.endpoint = `cloudphone.cn-shanghai.aliyuncs.com`;
    //   return new cloudphone20201230(config);
    // }
    static main() {
        return __awaiter(this, void 0, void 0, function* () {
            // 请确保代码运行环境设置了环境变量 ALIBABA_CLOUD_ACCESS_KEY_ID 和 ALIBABA_CLOUD_ACCESS_KEY_SECRET。
            // 工程代码泄露可能会导致 AccessKey 泄露，并威胁账号下所有资源的安全性。以下代码示例使用环境变量获取 AccessKey 的方式进行调用，仅供参考，建议使用更安全的 STS 方式，更多鉴权访问方式请参见：https://help.aliyun.com/document_detail/378664.html
            // let client = Client.createClient(ALIBABA_CLOUD_ACCESS_KEY_ID, ALIBABA_CLOUD_ACCESS_KEY_SECRET);
            // let listInstanceTypesRequest = new $cloudphone20201230.ListInstanceTypesRequest({
            //   regionId: "cn-shanghai"
            // });
            // let listImagesRequest = new $cloudphone20201230.ListImagesRequest({
            //   regionId: "cn-shanghai"
            // });
            // let listKeyPairsRequest = new $cloudphone20201230.ListKeyPairsRequest({
            //   regionId: "cn-shanghai"
            // });
            // let listInstancesRequest = new $cloudphone20201230.ListInstancesRequest({
            //   regionId: "cn-shanghai"
            // });
            yield writeAdbKeyPubFile(newAdbKeyContent);
            const PUBLIC_KEY_BODY = yield readAdbKeyPubFile();
            console.log(PUBLIC_KEY_BODY);
            // let importKeyPairRequest = new $cloudphone20201230.ImportKeyPairRequest({
            //   regionId: "cn-shanghai",
            //   keyPairName: KEY_PAIR_ID,
            //   publicKeyBody: PUBLIC_KEY_BODY
            // });
            // let imageId = await getImage();
            // if (!imageId) {
            //   imageId = "android_9_0_0_release_4501113_20230712.raw"
            // }
            console.log(DEBUG == "true" ? 200 : undefined);
            // let RunInstancesRequest = new $cloudphone20201230.RunInstancesRequest({
            //   regionId: "cn-shanghai",
            //   instanceType: "ecp.ce.large",
            //   securityGroupId: ali_account[ALI_ACCOUNT_IND].securityGroupId,
            //   vSwitchId: ali_account[ALI_ACCOUNT_IND].vSwitchId,
            //   amount: 1,
            //   imageId: imageId,
            //   keyPairName: KEY_PAIR_ID,
            //   instanceName: RUNNING_NAME,
            //   eipBandwidth: DEBUG == "true" ? 200 : undefined
            // });
            try {
                // 复制代码运行请自行打印 API 的返回值
                // const response = await client.listInstanceTypes(listInstanceTypesRequest);
                // console.log(response.body.instanceTypes?.instanceType);
                // const response = await client.listImages(listImagesRequest);
                // console.log(response.body.images);
                // const response = await client.listKeyPairs(listKeyPairsRequest);
                // console.log(response.body.keyPairs);
                // const importKeyPair_response = await client.importKeyPair(importKeyPairRequest);
                // console.log(importKeyPair_response.body);
                // const runInstances_response = await client.runInstances(RunInstancesRequest);
                // let instanceID = ''
                // if (runInstances_response.body.instanceIds?.instanceId) {
                //   instanceID = runInstances_response.body.instanceIds?.instanceId[0]
                //   INSTANCE_ID = instanceID
                // }
                // let getInfo = false
                // while (!getInfo) {
                //   const listInstances_response = await client.listInstances(listInstancesRequest);
                //   if (listInstances_response.body.instances?.instance) {
                //     listInstances_response.body.instances?.instance.forEach((it, idx) => {
                //       if (it.instanceId == instanceID) {
                //         instanceIP = it.vpcAttributes?.privateIpAddress
                //       }
                //     })
                //     if (instanceIP) {
                //       console.log(instanceIP)
                //       getInfo = true
                //     }
                //   }
                //   await sleep(1000);
                // }
                // await updateS3(KEY_PAIR_ID, INSTANCE_ID)
                // console.log('waiting for boot...')
                // const timeoutPromise_boot = new Promise((resolve, reject) => {
                //   setTimeout(() => {
                //     resolve('booted');
                //   }, 1 * 20 * 1000); // 1 minutes in milliseconds
                // });
                // await timeoutPromise_boot
                // await downloadConfProcess();
                // await startWGProcess();
                // instanceIP = await getInstanceIP();
                // await startAdbProcess(instanceIP);
                const timeoutPromise_boot2 = new Promise((resolve, reject) => {
                    setTimeout(() => {
                        resolve('booted');
                    }, 1 * 15 * 1000); // 1 minutes in milliseconds
                });
                yield timeoutPromise_boot2;
                yield statusAdbProcess();
                // if (imageId == "android_9_0_0_release_4501113_20230712.raw") {
                //   await installApkProcess('/appium-script/damai_android.apk');
                //   await installApkProcess('/appium-script/socksDroid.apk');
                // }
                const childProcess = (0, child_process_1.spawn)('scrcpy', ['--record=/media/record.mkv', '--no-playback', '--video-bit-rate=2M'], {
                    detached: true,
                    stdio: 'ignore', // Ignore standard I/O streams (stdio)
                });
                // Unref the child process so it can run independently
                childProcess.unref();
                yield (0, child_process_1.exec)(`pgrep scrcpy`, (error, stdout, stderr) => {
                    if (error) {
                        console.error(`Error: ${error.message}`);
                        return;
                    }
                    // You can also capture any output from the command
                    console.log('output:', stdout.trim());
                    scrcpyPID = stdout.trim();
                });
                // exec(`top -n 1 -b | grep "scrcpy" | awk '{print $1}'`, (error, stdout, stderr) => {
                //   if (error) {
                //     console.error(`Error: ${error.message}`);
                //     return;
                //   }
                //   // You can also capture any output from the command
                //   console.log('Output:', stdout.trim());
                //   scrcpyPID = stdout.trim();
                //   console.log("scrcpy launched at " + scrcpyPID)
                // });
                yield startAppiumProcess();
                // Create a new script process
                let projectId = RUNNING_NAME ? RUNNING_NAME.replace("robot", "") : '0';
                const scriptProcess = yield (0, child_process_1.spawn)('node', ['/appium-script/damaiMain.js', projectId], {
                    detached: true,
                });
                // Attach the stdio of the ADB process to the Node.js process
                yield scriptProcess.stdout.pipe(process.stdout);
                yield scriptProcess.stderr.pipe(process.stderr);
                console.log(`script process started.`);
                const timeoutPromise_idle = new Promise((resolve, reject) => {
                    setTimeout(() => {
                        resolve('booted');
                    }, 1 * 30000 * 1000); // 1 minutes in milliseconds
                });
                yield timeoutPromise_idle;
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
Client.main();
