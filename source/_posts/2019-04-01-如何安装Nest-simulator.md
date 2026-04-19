---
title: 如何安装Nest-simulator
date: 2019-04-01 00:00
categories:
  - 教程
---
## 如何安装nest simulator

官方参考链接：<https://nest-simulator.readthedocs.io/en/latest/installation/linux_install.html#dependencies>

官方是不支持直接在windows上安装nest的，但是可以使用virtualBox或者vmware来间接使用。

#### **所需材料**

  1. nest simulator源代码（我使用的是2.16.0版本，github上可以找到源代码）



<https://nest-simulator.readthedocs.io/en/latest/download.html>

  1. vmware player 15（正版免费，官网有）
  2. Ubuntu16.04.4的iso镜像
  3. windows10上安装



#### 安装步骤

  1. 首先安装好vmware并创建虚拟机，建议安装linux tool，可以直接在主机和虚拟机之间复制粘贴、可以全屏。可参考：<https://blog.csdn.net/stpeace/article/details/78598333>

  2. 在Ubuntu中安装下列包：
    
        sudo apt-get install -y build-essential cmake libltdl7-dev libreadline6-dev \
    libncurses5-dev libgsl0-dev python-all-dev python-numpy python-scipy \
    python-matplotlib ipython openmpi-bin libopenmpi-dev python-nose
    
    //注意，这里可以先不安装，编译、安装nest的时候遇到有缺少的在安装，直接安装
    //在Ubuntu16.04上会遇到一些包的依赖的问题，见下。

  3. 解压缩tarball：
    
        tar -xzvf nest-simulator-2.16.0.tar.gz

  4. 创建编译的目录：
    
        mkdir nest-simulator-2.16.0-build

  5. cmake
    
        cmake -DCMAKE_INSTALL_PREFIX:PATH=</install/path> </path/to/NEST/src>
    
    //</install/path>是安装的目录，即nest-simulator-2.16.0-build文件夹
    //</path/to/NEST/src>是源代码的目录
    //目录最好都是绝对路径

出现NEST Configuration Summary之后不报错就可以make、make install、make installcheck了。




**会遇到的问题！！**

安装过程中第一步就出现了错误
    
    
    orion@orion233:~$ sudo apt-get install -y build-essential cmake libltdl7-dev libreadline6-dev \
    > libncurses5-dev libgsl0-dev python-all-dev python-numpy python-scipy \
    > python-matplotlib ipython openmpi-bin libopenmpi-dev python-nose
    sudo: unable to resolve host orion233
    [sudo] password for orion: 
    Sorry, try again.
    [sudo] password for orion: 
    Reading package lists... Done
    Building dependency tree       
    Reading state information... Done
    Note, selecting 'libltdl-dev' instead of 'libltdl7-dev'
    Note, selecting 'libgsl-dev' instead of 'libgsl0-dev'
    build-essential is already the newest version (12.1ubuntu2).
    cmake is already the newest version (3.5.1-1ubuntu1).
    libgsl-dev is already the newest version (2.1+dfsg-2).
    libltdl-dev is already the newest version (2.4.6-0.1).
    libncurses5-dev is already the newest version (6.0+20160213-1ubuntu1).
    libreadline6-dev is already the newest version (6.3-8ubuntu2).
    ipython is already the newest version (2.4.1-1).
    openmpi-bin is already the newest version (1.10.2-8ubuntu1).
    Some packages could not be installed. This may mean that you have
    requested an impossible situation or if you are using the unstable
    distribution that some required packages have not yet been created
    or been moved out of Incoming.
    The following information may help to resolve the situation:
    
    The following packages have unmet dependencies:
     libopenmpi-dev : Depends: libhwloc-dev but it is not going to be installed
     python-all-dev : Depends: python (= 2.7.11-1) but 2.7.12-1~16.04 is to be installed
                      Depends: python-all (= 2.7.11-1) but it is not going to be installed
                      Depends: libpython-all-dev (= 2.7.11-1) but it is not going to be installed
                      Depends: python-dev (= 2.7.11-1) but it is not going to be installed
                      Depends: python2.7-dev (>= 2.7-7) but it is not going to be installed
     python-numpy : Depends: liblapack3 but it is not going to be installed or
                             liblapack.so.3
     python-scipy : Depends: libgfortran3 (>= 4.6) but it is not going to be installed
                    Depends: liblapack3 but it is not going to be installed or
                             liblapack.so.3
                    Recommends: python-dev but it is not going to be installed
    E: Unable to correct problems, you have held broken packages.
    

这是一些包之间相互依赖出现了问题，Linux下经常需要安装不同类型的库，在Ubuntu中，这些类库都是以“lib_name-version”的形式命名的。很多库之间存在依赖关系，即要安装这个就必须安装那个。有时候，类库之间依赖关系无法满足，你所要安装的程序就不能安装。 这类问题大多是由于相互依赖的几个库中一个或多个的版本已经更新，而用户要安装的库依赖于这几个库的较低的版本，这时候可以试试使用“sudo aptitude install ”（尖括号内为你要安装的程序的名字）。我们莫慌，先安装**aptitude**

**使用aptitude**

aptitude与 apt-get 一样，是 Debian 及其衍生系统中功能极其强大的包管理工具。与 apt-get 不同的是，aptitude在处理依赖问题上更佳一些。举例来说，aptitude在删除一个包时，会同时删除本身所依赖的包。这样，系统中不会残留无用的包，整个系统更为干净。

sudo aptitude install python-numpy

运行后，不接受未安装方案，接受降级方案。搞定。
    
    
    orion@orion233:~$ sudo aptitude install libopenmpi-dev
    The following NEW packages will be installed:
      libhwloc-dev{a} libibverbs-dev{a} libnuma-dev{ab} libopenmpi-dev 
    0 packages upgraded, 4 newly installed, 0 to remove and 0 not upgraded.
    Need to get 802 kB of archives. After unpacking 5.510 kB will be used.
    The following packages have unmet dependencies:
     libnuma-dev : Depends: libnuma1 (= 2.0.11-1ubuntu1) but 2.0.11-1ubuntu1.1 is installed.
    The following actions will resolve these dependencies:
    
         Keep the following packages at their current version:
    1)     libhwloc-dev [Not Installed]                       
    2)     libnuma-dev [Not Installed]                        
    3)     libopenmpi-dev [Not Installed]                     
    
    
    
    Accept this solution? [Y/n/q/?] n
    The following actions will resolve these dependencies:
    
         Downgrade the following packages:                               
    1)     libnuma1 [2.0.11-1ubuntu1.1 (now) -> 2.0.11-1ubuntu1 (xenial)]
    
    
    
    Accept this solution? [Y/n/q/?] Y
    The following packages will be DOWNGRADED:
      libnuma1 
    The following NEW packages will be installed:
      libhwloc-dev{a} libibverbs-dev{a} libnuma-dev{a} libopenmpi-dev 
    0 packages upgraded, 4 newly installed, 1 downgraded, 0 to remove and 0 not upgraded.
    Need to get 823 kB of archives. After unpacking 5.510 kB will be used.
    Do you want to continue? [Y/n/?] Y
    Get: 1 http://ftp.sjtu.edu.cn/ubuntu xenial/main amd64 libnuma1 amd64 2.0.11-1ubuntu1 [21,0 kB]
    Get: 2 http://ftp.sjtu.edu.cn/ubuntu xenial/main amd64 libnuma-dev amd64 2.0.11-1ubuntu1 [31,7 kB]
    Get: 3 http://ftp.sjtu.edu.cn/ubuntu xenial/universe amd64 libhwloc-dev amd64 1.11.2-3 [155 kB]
    Get: 4 http://ftp.sjtu.edu.cn/ubuntu xenial/main amd64 libibverbs-dev amd64 1.1.8-1.1ubuntu2 [77,6 kB]
    Get: 5 http://ftp.sjtu.edu.cn/ubuntu xenial/universe amd64 libopenmpi-dev amd64 1.10.2-8ubuntu1 [537 kB]
    Fetched 823 kB in 2s (275 kB/s)         
    dpkg: warning: downgrading libnuma1:amd64 from 2.0.11-1ubuntu1.1 to 2.0.11-1ubuntu1
    (Reading database ... 180946 files and directories currently installed.)
    Preparing to unpack .../libnuma1_2.0.11-1ubuntu1_amd64.deb ...
    Unpacking libnuma1:amd64 (2.0.11-1ubuntu1) over (2.0.11-1ubuntu1.1) ...
    Selecting previously unselected package libnuma-dev:amd64.
    Preparing to unpack .../libnuma-dev_2.0.11-1ubuntu1_amd64.deb ...
    Unpacking libnuma-dev:amd64 (2.0.11-1ubuntu1) ...
    Selecting previously unselected package libhwloc-dev:amd64.
    Preparing to unpack .../libhwloc-dev_1.11.2-3_amd64.deb ...
    Unpacking libhwloc-dev:amd64 (1.11.2-3) ...
    Selecting previously unselected package libibverbs-dev.
    Preparing to unpack .../libibverbs-dev_1.1.8-1.1ubuntu2_amd64.deb ...
    Unpacking libibverbs-dev (1.1.8-1.1ubuntu2) ...
    Selecting previously unselected package libopenmpi-dev.
    Preparing to unpack .../libopenmpi-dev_1.10.2-8ubuntu1_amd64.deb ...
    Unpacking libopenmpi-dev (1.10.2-8ubuntu1) ...
    Processing triggers for libc-bin (2.23-0ubuntu10) ...
    Processing triggers for man-db (2.7.5-1) ...
    Setting up libnuma1:amd64 (2.0.11-1ubuntu1) ...
    Setting up libnuma-dev:amd64 (2.0.11-1ubuntu1) ...
    Setting up libhwloc-dev:amd64 (1.11.2-3) ...
    Setting up libibverbs-dev (1.1.8-1.1ubuntu2) ...
    Setting up libopenmpi-dev (1.10.2-8ubuntu1) ...
    update-alternatives: using /usr/lib/openmpi/include to provide /usr/include/mpi (mpi) in auto mode
    Processing triggers for libc-bin (2.23-0ubuntu10) ...
    

按照上述方法（主要是17、15行）全部处理好包的版本和依赖问题，那么就可以一次输入一开始的那段指令，安装所有的包了。