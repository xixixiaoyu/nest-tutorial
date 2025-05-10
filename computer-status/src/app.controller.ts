import { Controller, Get } from '@nestjs/common';
import * as os from 'os';
import * as nodeDiskInfo from 'node-disk-info';

@Controller()
export class AppController {
  @Get('status')
  async status() {
    return {
      cpu: this.getCpuInfo(),
      mem: this.getMemInfo(),
      disk: await this.getDiskStatus(),
      sys: this.getSysInfo(),
    };
  }

  getCpuInfo() {
    const cpus = os.cpus();
    const cpuInfo = cpus.reduce(
      (info, cpu) => {
        info.user += cpu.times.user;
        info.sys += cpu.times.sys;
        info.idle += cpu.times.idle;
        return info;
      },
      { user: 0, sys: 0, idle: 0 },
    );

    const total = cpuInfo.user + cpuInfo.sys + cpuInfo.idle;

    // Avoid division by zero if total is 0
    const sysPercentage =
      total === 0 ? '0.00' : ((cpuInfo.sys / total) * 100).toFixed(2);
    const usedPercentage =
      total === 0 ? '0.00' : ((cpuInfo.user / total) * 100).toFixed(2);
    const freePercentage =
      total === 0 ? '0.00' : ((cpuInfo.idle / total) * 100).toFixed(2);

    return {
      cpuNum: cpus.length,
      sys: sysPercentage,
      used: usedPercentage,
      free: freePercentage,
    };
  }

  getMemInfo() {
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    const usedMemory = totalMemory - freeMemory;

    return {
      total: this.bytesToGB(totalMemory) + ' GB',
      used: this.bytesToGB(usedMemory) + ' GB',
      free: this.bytesToGB(freeMemory) + ' GB',
      usage:
        totalMemory === 0
          ? '0.00 %'
          : ((usedMemory / totalMemory) * 100).toFixed(2) + ' %',
    };
  }

  async getDiskStatus() {
    try {
      const disks = nodeDiskInfo.getDiskInfoSync();
      // Assuming public accessors exist without the underscore
      return disks.map((disk) => ({
        dirName: disk.mounted,
        typeName: disk.filesystem,
        total: this.bytesToGB(disk.blocks) + ' GB',
        used: this.bytesToGB(disk.used) + ' GB',
        free: this.bytesToGB(disk.available) + ' GB',
        usage: disk.capacity,
      }));
    } catch (error) {
      console.error('Error getting disk info:', error);
      // Return an empty array or a specific error structure if disk info fails
      return [];
    }
  }

  getSysInfo() {
    return {
      computerName: os.hostname(),
      computerIp: this.getServerIP(),
      osName: os.platform(),
      osArch: os.arch(),
    };
  }

  private bytesToGB(bytes: number): string {
    if (bytes === 0) return '0.00';
    return (bytes / 1024 ** 3).toFixed(2);
  }

  private getServerIP(): string {
    const nets = os.networkInterfaces();
    for (const name of Object.keys(nets)) {
      const netInterface = nets[name];
      if (netInterface) {
        for (const net of netInterface) {
          // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
          if (net.family === 'IPv4' && !net.internal) {
            return net.address;
          }
        }
      }
    }
    return 'N/A';
  }
}
