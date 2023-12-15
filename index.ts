// This file is auto-generated, don't edit it
// 依赖的模块可通过下载工程中的模块依赖文件或右上角的获取 SDK 依赖信息查看
// import cloudphone20201230, * as $cloudphone20201230 from '@alicloud/cloudphone20201230';
import OpenApi, * as $OpenApi from '@alicloud/openapi-client';
import Util, * as $Util from '@alicloud/tea-util';
import * as $tea from '@alicloud/tea-typescript';
import * as fs from 'fs';
import { spawn, exec, execSync } from 'child_process';
import axios, { AxiosResponse, AxiosError } from 'axios';

// Define the path to the adbkey.pub file
import { promises as fsPromises } from 'fs';
import express from 'express';

const RUNNING_NAME = process.env.RUNNING_NAME;
const DEBUG = process.env.DEBUG;
const ALI_ACCOUNT_IND: number = Number(process.env.ALI_ACCOUNT_IND);

let scrcpyPID: string

const app = express();
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
  catch (e: any) {
    res.status(e.statusCode)
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
  catch (e: any) {
    res.status(e.statusCode)
  }
});

app.listen(port, () => {
  console.log(`download server is running on port ${port}`);
});

function generateUniqueName(): string {
  const date = new Date();
  const formattedDate = date.toISOString().replace(/[^0-9]/g, ''); // Format the date to remove non-numeric characters
  const uniqueName = `bmy${formattedDate}`;
  return uniqueName;
}

async function readAdbKeyPubFile() {
  // Define the path to the adbkey.pub file
  const adbkeyPubFilePath = '/home/ubuntu/.android/adbkey.pub';

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

async function writeAdbKeyPubFile(newContent : string) {
  // Define the path to the adbkey.pub file
  const adbkeyPubFilePath = '/home/ubuntu/.android/adbkey.pub';

  try {
    // Use fs.promises.writeFile to write the new content to the file
    await fsPromises.writeFile(adbkeyPubFilePath, newContent, 'utf8');

    console.log('adbkey.pub successfully overwritten with new content.');
  } catch (err) {
    // Handle errors, log the error, and rethrow it
    console.error(`Error writing file: ${err}`);
    throw err;
  }
}

// Example usage: Call the function with the new content
const newAdbKeyContent = 'QAAAAG9H0NxxCPvEDNvUHrPBNRPLDNbNQ8FNac+hk/mOTCl4RoG5kpJAb95ld3FhlSxTqyijB9IoWeR8KHaqrPCIY93SPbCH2iTmi07cfHP/IyTK3xe9Mckq/hbm8OrV/Oz7ShO3Ij9EpcV46oWvPu7OlQZpktAoIBIuHWgX8FWJ0jD3B0tdlc75+eTwM4Jqn8WyYSvTjEIb97qKPsUQGO3x0b/B7rmfiBB77nkAbIDrqoyZ1THwPW/36JgOXS+RNyb+NotXL0o1ts3ChWlN6HBJ4mBgc7YN6ZKFS9oCm6seoJCsF5RI+4sCDbp1QuAPcD61LoVNMD6fYM6VJaRUODamdcNgKQerkL+hb0O98//FiZKzEqAWNxZP+kUem22RWGq11ild+60AK10pzcZ0HlYYoCyxbahY20/G+hiTRtIaRPBC6tzvOmdIMmkiv2JSdLm3TJUqucA0cygC0FTAAeTaELppk34VSQJZL1xdihnCG7AmMTY5H6dlOmdToSpS6ZhQ7zo4IFul8aBttYTQW8fSneOcQvte3vCJveMGTu1MAVPHE3agyJSlJrKDothUGfOiEJhVn6K+N77uheDW1Aczc8amXBp2Q7lKamwMyBOHFDfqaZkN/OMfGHtWEVAXjZ6Tsw/wEo0H7FJ5HA+UcV+3iQWFbR9nZARI5PpKJ9NfiEsllT5IhgEAAQA= Starnes@WIN-20230321QKL';

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

let getInstanceIP = async () => {
  const response_get: AxiosResponse = await axios({
    url: `https://e91q1mz7e1.execute-api.cn-northwest-1.amazonaws.com.cn/get`,
    method: 'post',
    data: {
      jsonName: RUNNING_NAME,
      bucketName: "bucket-robots",
    },
    timeout: 190000,
  });
  return response_get.data.ip
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

async function downloadConfProcess() {
  return new Promise((resolve, reject) => {
    // Create a new ADB process
    const adbProcess = spawn('curl', ['-o', '/etc/wireguard/wg0.conf', `https://eci-bucket.s3.cn-northwest-1.amazonaws.com.cn/eci-${RUNNING_NAME}.conf`], {
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
}

async function startWGProcess() {
  return new Promise((resolve, reject) => {
    // Create a new ADB process
    const adbProcess = spawn('sudo', ['wg-quick', 'up', 'wg0'], {
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
}

async function statusAdbProcess() {
  return new Promise((resolve, reject) => {
    // Create a new ADB process
    const adbProcess = spawn('adb', ['devices'], {
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

async function installApkProcess(apk: string) {
  return new Promise((resolve, reject) => {
    // Create a new ADB process
    const installProcess = spawn('adb', ['install', apk], {
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

let ali_account_raw = fs.readFileSync('./aliyun_config.json', 'utf8')
let ali_account = JSON.parse(ali_account_raw);

const ALIBABA_CLOUD_ACCESS_KEY_ID = ali_account[ALI_ACCOUNT_IND].ALIBABA_CLOUD_ACCESS_KEY_ID
const ALIBABA_CLOUD_ACCESS_KEY_SECRET = ali_account[ALI_ACCOUNT_IND].ALIBABA_CLOUD_ACCESS_KEY_SECRET
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

  static async main(): Promise<void> {
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

    
    await writeAdbKeyPubFile(newAdbKeyContent)
    const PUBLIC_KEY_BODY = await readAdbKeyPubFile();
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
    console.log(DEBUG == "true" ? 200 : undefined)
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
      await timeoutPromise_boot2
      await statusAdbProcess()

      // if (imageId == "android_9_0_0_release_4501113_20230712.raw") {
      //   await installApkProcess('/appium-script/damai_android.apk');
      //   await installApkProcess('/appium-script/socksDroid.apk');
      // }

      const childProcess = spawn('scrcpy', ['--record=/media/record.mkv', '--no-playback', '--video-bit-rate=2M'], {
        detached: true,
        stdio: 'ignore', // Ignore standard I/O streams (stdio)
      });

      // Unref the child process so it can run independently
      childProcess.unref();

      await exec(`pgrep scrcpy`, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error: ${error.message}`);
          return;
        }
        // You can also capture any output from the command
        console.log('output:', stdout.trim());
        scrcpyPID = stdout.trim()
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
      await startAppiumProcess();


      // Create a new script process
      let projectId = RUNNING_NAME ? RUNNING_NAME.replace("robot", "") : '0';
      const scriptProcess = await spawn('node', ['/appium-script/damaiMain.js', projectId], {
        detached: true,
      });

      // Attach the stdio of the ADB process to the Node.js process
      await scriptProcess.stdout.pipe(process.stdout);
      await scriptProcess.stderr.pipe(process.stderr);

      console.log(`script process started.`);

      const timeoutPromise_idle = new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve('booted');
        }, 1 * 30000 * 1000); // 1 minutes in milliseconds
      });
      await timeoutPromise_idle

    } catch (error: any) {
      // 如有需要，请打印 error
      console.log(error)
      Util.assertAsString(error.message);
    }
  }

}

Client.main();







