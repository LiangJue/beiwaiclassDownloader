var request = require('request');
var fs = require('fs');
var exec = require('child_process').exec;
var courseCode = process.argv.splice(2)[0];

console.log('欢迎使用北外网课下载脚本，请自觉遵守法律法规，本脚本仅供学习参考，所有下载的视频请在24小时内删除，请勿传播或进行营利，一切法律责任由用户自己承担，与本人无关')
console.log('您输入的courseCode是' + courseCode + ', 获取方法可参考GitHub: https://github.com/yqylh/beiwaiclassDownloader\n开始下载')

request('http://study.ebeiwai.com/ws/studyservice/getStudyCourseOutline?courseCode='+courseCode+'&userId=78&learnerCourseId=20200&orgCode=org_eclass&userName=null', (err, response, body) => {
    body = JSON.parse(response.body)
    body.backData = body.backData.replace(/\s/g, '');
    let items = body.items;
    // console.log(body.items)
    download = (item) =>{
        return new Promise((resolve, reject) => {
            fs.mkdir(__dirname + '/' + body.backData, err =>{
                // console.log('gohls -l=true ' + item.selftestUrl + ' ' + __dirname + '/' + body.backData + '/' +  item.nameZh + '.mp4')
                exec('gohls.exe -l=true ' + item.selftestUrl + ' ' + __dirname + '/' + body.backData + '/' +  item.nameZh + '.mp4', (error, stdout, stderr) => {
                    console.log(error, stdout, stderr)
                    resolve()
                })
            })
        })
    }
    download2 = (name, item) => {
        return new Promise((resolve, reject) => {
            fs.mkdir(__dirname + '/' + body.backData, err =>{
                fs.mkdir(__dirname + '/' + body.backData + '/' + name, err =>{
                    item.nameZh = item.nameZh.replace(/\s/g, '');
                    // console.log('gohls -l=true ' + item.selftestUrl + ' ' + __dirname + '/' + body.backData + '/' + name + '/' + item.nameZh + '.mp4')
                    exec('gohls.exe -l=true ' + item.selftestUrl + ' ' + __dirname + '/' + body.backData + '/' + name + '/' + item.nameZh + '.mp4', (error, stdout, stderr) => {
                        console.log(error, stdout, stderr)
                        resolve()
                    })
                })
            })
        })
    }

    main = async () =>{
        for (let i = 0; i < items.length; i++) {
            items[i].nameZh = items[i].nameZh.replace(/\s/g, '');
            if (items[i].coursElementDTOs != undefined && items[i].coursElementDTOs[0] != undefined) {
                console.log('download_' + items[i].nameZh)
                for (let j = 0; j < items[i].coursElementDTOs.length; j++) {
                    console.log('download__' + items[i].nameZh + ' ' + items[i].coursElementDTOs[j].nameZh)
                    await download2(items[i].nameZh,items[i].coursElementDTOs[j])
                }
            } else {
                console.log('download ' + items[i].nameZh)
                await download(items[i]); 
            }
        }
    }
    main();
})
