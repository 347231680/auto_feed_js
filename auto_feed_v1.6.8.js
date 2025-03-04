// ==UserScript==
// @name         auto_feed
// @author       tomorrow505
// @thanks       感谢宝大、86大佬、贝壳大佬提供邀请码;感谢宝大、86大佬提供友情赞助;感谢手大、kmeng、黑白等大佬赠予PTP积分.（ID：tomorrow505, 感谢支持）
// @contributor  daoshuailx/hollips/kmeng/wyyqyl
// @description  PT一键转种脚本
// @include      https://blutopia.xyz/torrents?imdb=tt*
// @namespace    Violentmonkey Scripts
// @include      http*://*/*details*.php*
// @include      http*://*/upload*php*
// @include      https://hd-space.org/index.php?page=upload
// @include      https://hdcity.city/upload*
// @include      https://hdbits.org/upload*
// @include      https://hdbits.org/browse*
// @include      https://passthepopcorn.me/torrents.php*
// @include      https://hd-torrents.org/torrents.php*
// @include      https://beyond-hd.me/upload*
// @include      https://uhdbits.org/torrents.php*
// @include      https://blutopia.xyz/upload/*
// @include      https://pt.hdpost.top/upload/*
// @include      http*://totheglory.im/t/*
// @include      http*://privatehd.to/torrent/*
// @include      http*://avistaz.to/torrent/*
// @include      http*://passthepopcorn.me/torrents.php?id*
// @include      http*://*php?id=*&torrentid=*
// @include      https://*php?torrentid=*&id=*
// @include      https://hdbits.org/details.php?id=*
// @include      https://hdf.world/torrents.php*
// @include      http*://www.morethan.tv/torrents.php?id*
// @include      http*://beyond-hd.me/torrents/*
// @include      http*://hon3yhd.com/details.php?id=*
// @include      http*://www.torrentleech.org/torrent/*
// @include      http*://blutopia.xyz/torrents/*
// @include      https://*/torrents?imdb=tt*
// @include      http*://www.bfdz.ink/tools/ptgen*
// @require      https://cdn.staticfile.org/jquery/3.3.1/jquery.min.js
// @icon         https://kp.m-team.cc//favicon.ico
// @run-at       document-end
// @version      v1.6.8
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @grant        GM_download
// ==/UserScript==

/*
日志：
    版本 v1.0
    20200417：新增支持外站PHD和avz作为源站点;
    20200420：新增馒头、猫站、春天、听歌、瓷器、我堡发布页面填写匹配 (by tomorrow505)
    20200422：新增pthome、hdhome发布页面填写匹配; 修复我堡部分bug (by tomorrow505);新增天空、岛、联盟发布页面匹配 (by hollips)

    版本 v1.1
    20200424：新增MTV作为源站点, 新增ptp作为源站点(待测试) (by tomorrow505) ——> 已测试
    20200425：新增一键打开常用站点的功能，需要设置common_sites (by tomorrow505)
    20200427：修复CMCT新种子页面mediainfo信息异步加载获取不到的bug; 添加ptgen跳转，主要是为了方便外站查询信息 (by tomorrow505)

    版本 v1.2
    20200429：修改获取豆瓣信息的代码，使用promise进行链式简化;从副标题匹配是否包含国语粤语中字等信息并勾选标签 (by tomorrow505)
              修复league(柠檬)分类更新导致错误分类的bug; 修复HDT有多个重复发布的资源获取类别错误的bug (by tomorrow505)
    20200430：新增支持南洋、葡萄、TLF、杜比发布页填写匹配;完善官种感谢机制,在reg_team_name补充官方小组后缀名即可; 
              修复猫站官种转发table到其他站点混乱的bug (by tomorrow505)

    版本 v1.3
    20200501：修复插入节点不在常规位置的bug;修复cmct因为图片元素节点更名获取不到图片的bug (by tomorrow505)
              修复HDT部分bug; 修复豆瓣获取button部分bug; 新增：瓷器没有豆瓣信息插入获取豆瓣获取button (by tomorrow505)
              支持：萌猫——匹配一部分，因为是二级勾选，然后比较繁琐…… (by tomorrow505)
    20200506: 匹配HDT原盘转发到春天。 (by hollips)

    版本 v1.4
    20200531: 修复TTG官种wiki转出图片未加载的bug; 修复猫站转出带站点转出链接提示的bug. (by tomorrow505)
              增加北洋作为源站点的部分修复，支持北洋作为发布站点; 新增UHD作为源站点，费老劲了(by tomorrow505)
    20200606: 新增blutopia为源站点 (by tomorrow505)
    20200703：新增TCCF为发布站点；修复: 葡萄北洋默认勾选匿名。  (by tomorrow505)
    20200713：大致支持印度站点hon3yhd，新增api替换选项。  (by tomorrow505)
    20200714：烧包支持，海胆支持，diy标签支持；匿名整合作为用户选项。  (by tomorrow505)

    版本 v1.5
    20200715：支持蝴蝶转发及转出，可惜只能校内用户登录及IPV6用户(带有不确定因素)~; 支持HDFANS转发。 (by tomorrow505)
    20200722：加入IPT进入豪华套餐。  (by tomorrow505)
    20200723：加入xthor作为外网源站点，感谢贝壳大佬发邀。 (by tomorrow505)
    20200724：支持hdroute..感谢假装大佬测试。佛曰：不可说; 修复萌猫的部分bug，修复其他站点部分bug。 (by tomorrow505)
    20200725：支持Filelist作为源站点，感谢宝大发邀。 (by tomorrow505)

    20200729：修复UHD原盘转发命名错误的bug,但是仍旧可能不准确，TL缺少mediainfo基本无解。 (by tomorrow505)
    20200804：修复北邮人转出部分bug, 修复hon3yhd小组DRs原盘命名。 (by tomorrow505)
    20200811：修复CMCT，对新版适配更加方便。 (by tomorrow505)
    20200814：新增支持HDPOST、HDCity，整合代码提取两个函数。修复部分bug. 完善HDFans，完善海胆(by tomorrow505)

    20200820；由于imdb转豆瓣解析api失效，暂时没有更好的办法，对外站获取豆瓣信息做了一丢丢修复工作。(by tomorrow505)
    20200827：修复ptgen跳转出错问题、修复HDT失效问题。 (by tomorrow505)
    20200828：修复PThome分辨率选择增加8K导致的错误，修正类别为动画或者纪录片获取初始为电影的错误; 修复HDHome原盘转载媒介错误的bug。整合精简部分代码。 (by tomorrow505)
    20200829：新增支持发布到BHD，截图部分需要自行解决。 (by tomorrow505)
    20200903：新增支持HDF作为源站点，但是基本缺少截图;简单修复ptgen跳转获取不到豆瓣信息的问题。 (by tomorrow505)
    20200908：新增支持RED和皇后作为源站点，简单适配发布到柠檬及其他站点;简单音乐转载的修复部分bug, 修复皇后有两种版面-老种不规范带来的部分bug。

    版本 v1.6
    20200923：萌猫关站, 不再支持萌猫;支持U2作为源站点转外。
    20200926：支持HDB作为源站转发。优化外站电视剧转载非第一季获取豆瓣过程，勾选API进行检索即可获得备选豆瓣链接。
    20200927：支持BTN作为源站转发，基本集齐。
    20200928：新修复一堆bug，以后大伙使用有bug可以直接给我抛链接和描述，尽量及时修复。
    20201001：新增支持兽站、CCF、HDTime、龙之家、52PT、影客、伊甸园、PTMSG、铃音、碟粉、JoyHD、HDZone、Oshen、HDAtmos、PTNIC作为发布站点。
    20201002：新增支持发布到HDT，简单适配。修复bug一堆。

    20201019：高清街关站，不再支持。
    20201027：新增Bdc为源站点，blutopia为发布站点(需要申请TMDB的api)、AHD。
    20201115：修复柠檬，增加UHD作为发布站。

    20201119：支持转发到HDSpace，取消支持IPT, 太混乱了。修复其余bug多项，完善PTP原盘命名，支持多个站点下载截图(外站很慢)。
    20201129：简单适配KG电影类别。

    20201227：修复柠檬域名,修复柠檬查重, 修复CMCT跳转查询,豆瓣页面新增跳转查询。
    20210104：支持elite-tracker, 修复cmct转出感谢多次的bug。

    20210308：取消对AHD的支持，修改HDPOST新架构的支持。
    20210312：支持1PTBA、HITPT、PTtime(shmt86)、简单支持iTS(感谢黑白大佬提供帮助)->已经完善。 取消支持影客(关站)。
    20210316：重构部分代码，用户变量提前至顶端，可以方便更改自己的配置; 
    20200318：修复HDT的图链bug一枚，修复BLU等相似架构搜索问题。

任务：
    接下来想要做的事：完善各个块的代码逻辑(尤其是发布页形成函数封装)，源页面干掉外站ajax,重构代码ing...
    完善mediainfo和截图分离函数，大部分外站都需要分离操作；柠檬动漫和音乐改版之后代码需要重新整理。
*/

/*******************************************************************************************************************
*                                          part 0 用户变量层                                                        *
********************************************************************************************************************/

//提供可用的获取豆瓣信息两个api，从0-1选择。主要应用于外站，
const apis = ['https://ptgen.rhilip.info', 'https://api.rhilip.info/tool/movieinfo/gen'];
const api_chosen = 0;
const if_uplver = 1; //是否匿名，默认匿名，不匿名改成0
const tmdb_key = '0f79586eb9d92afa2b7266f7928b055c'; //TMDB API-KEY，用于发布需要TMDB编号的站点，这里提供一个key,如果使用不了了请自行申请
//欧美国家列表，可以酌情添加
const us_ue = ['挪威|丹麦|瑞典|芬兰|英国|爱尔兰|荷兰|比利时|卢森堡|法国|西班牙|葡萄牙|德国|奥地利|瑞士|美国|加拿大|澳大利亚|意大利|波兰|新西兰'];

//是否在PTP/HDB/HDT/UHD种子列表显示搜索跳转功能，1表示显示，0表示隐藏
const SHOW_PTP_SEARCH_URLS = 1;
const SHOW_HDB_SEARCH_URLS = 0;
const SHOW_HDT_SEARCH_URLS = 0;
const SHOW_UHD_SEARCH_URLS = 0;

//支持转发的站点列表，可以自行取消注释
const site_info = {
    // '1PTBA': 'https://1ptba.com/',   
    // '52PT': 'https://52pt.site/',
    // 'BHD' : 'https://beyond-hd.me/',
    // 'BLU': "https://blutopia.xyz/",
    // 'BTSchool': 'https://pt.btschool.club/',
    // 'CCF': 'http://ccfbits.org/',
    'CMCT': "https://springsunday.net/",
    'CHDBits': "https://chdbits.co/",
    // 'DiscFan': 'https://discfan.net/',
    // 'Dragon': 'https://www.dragonhd.xyz/',
    // 'HaiDan': 'https://www.haidan.video/',
    'HD4FANS': 'https://pt.hd4fans.org/',
    // 'HDArea': 'https://www.hdarea.co/',
    // 'HDAtmos' : 'https://hdatmos.club/',
    // 'HDB': 'https://hdbits.org/',
    'HDChina': "https://hdchina.org/",
    // 'HDCity': 'https://hdcity.city/',
    // 'HDDolby': 'https://www.hddolby.com/',
    // 'HDfans': 'http://hdfans.org/',
    // 'HDHome': "https://hdhome.org/",
    'HDPost': 'https://pt.hdpost.top/',
    // 'HDRoute': 'http://hdroute.org/',
    'HDSky': "https://hdsky.me/",
    // 'HDSpace': 'https://hd-space.org/',
    // 'HDT': 'https://hd-torrents.org/',
    // 'HDTime': 'https://hdtime.org/',
    // 'HDU': 'https://pt.hdupt.com/',
    // 'HDZone': 'https://hdzone.me/',
    // 'HITPT': 'https://www.hitpt.com/',
    'HUDBT': 'https://hudbt.hust.edu.cn/',
    // 'iTS': 'https://shadowthein.net/',
    // 'JoyHD': 'https://www.joyhd.net/',
    'LemonHD': "https://lemonhd.org/",
    'MTeam': "https://kp.m-team.cc/",
    // 'NanYang': "https://nanyangpt.com/",
    // 'Oshen': 'http://www.oshen.win/',
    'OurBits': "https://ourbits.club/",
    'PTer': "https://pterclub.com/",
    'PThome': "https://www.pthome.net/",
    // 'PTMSG': 'https://pt.msg.vg/',
    // 'PTNIC': 'https://www.ptnic.net/',
    // 'ptsbao': 'https://ptsbao.club/',
    // 'PTT': 'https://www.pttime.org/',
    'PuTao': "https://pt.sjtu.edu.cn/",
    // 'SoulVoice': 'https://pt.soulvoice.club/',
    // 'TCCF': 'https://et8.org/',
    'TJUPT': 'https://www.tjupt.org/',
    'TLFbits': "http://pt.eastgame.org/",
    'TTG': "https://totheglory.im/",
    // 'UHD': 'https://uhdbits.org/',
    // 'YDY' :'https://pt.hdbd.us/',
};

//支持快速搜索的站点列表，可自行添加或注释，举例：imdbid表示tt123456, imdbno表示123456，search_name表示the big bang thoery
const site_search_list = [
    `<a href="https://passthepopcorn.me/torrents.php?searchstr={imdbid}" target="_blank">PTP</a>`,
    // `<a href="https://broadcasthe.net/torrents.php?action=advanced&imdb={imdbid}" target="_blank">BTN</a>`,
    `<a href="https://hdbits.org/browse.php?search={imdbid}" target="_blank">HDB</a>`,
    `<a href="https://karagarga.in/browse.php?search={imdbid}&search_type=imdb" target="_blank">KG</a>`,
    `<a href="http://cinemageddon.net/browse.php?search={imdbid}&proj=0&descr=1" target="_blank">CG</a>`,
    `<a href="https://filelist.io/browse.php?search={imdbid}" target="_blank">FileList</a>`,
    `<a href="https://beyond-hd.me/torrents?imdb={imdbid}" target="_blank">BHD</a>`,
    `<a href="https://blutopia.xyz/torrents?imdb={imdbid}#page/1" target="_blank">BLU</a>`,
    `<a href="https://pt.hdpost.top/torrents?imdb={imdbid}#page/1" target="_blank">HDPost</a>`,
    `<a href="https://hd-torrents.org/torrents.php?&search={imdbid}" target="_blank">HDT</a>`,
    `<a href="https://hd-space.org/index.php?page=torrents&search={imdbno}&active=1&options=2" target="_blank">HDSpace</a>`,
    // `<a href="http://hdroute.org/browse.php?action=s&imdb={imdbno}" target="_blank">HDR</a>`,
    // `<a href="https://hdf.world/torrents.php?searchstr={search_name}" target="_blank">HDF</a>`,
    `<a href="https://privatehd.to/torrents?in=1&search={search_name}" target="_blank">PHD</a>`,
    // `<a href="https://avistaz.to/torrents?in=1&search={search_name}" target="_blank">AVZ</a>`,
    // `<a href="https://xthor.tk/browse.php?sch={search_name}" target="_blank">xTHOR</a>`,
    `<a href="https://lemonhd.org/torrents.php?search={imdbid}&search_area=imdb&suggest=4" target="_blank">Lemon</a>`,
    // `<a href="https://lemonhd.org/torrents.php?search={search_name}&search_area=0" target="_blank">Lemon2</a>`,
    `<a href="https://uhdbits.org/torrents.php?searchstr={imdbid}" target="_blank">UHD</a>`
];

//常用站点列表，这里只是举例说明，可以替换成自己想要的站点名称即可
const common_sites = ['HDPost', 'TTG', 'CMCT', 'HUDBT', 'LemonHD', 'Pter'];

//这部分是属于官种名称匹配，用于声明感谢，可自定义匹配正则以及感谢bbcode
const reg_team_name = {
    'MTeam': /-(.*mteam|mpad|tnp|BMDru)/i,
    'CMCT': /-(CMCT|cmctv)/i,
    'HDSky': /-(hds|.*@HDSky)/i,
    'CHDBits': /-(CHD|.*@CHDBits)/i,
    'OurBits': /(-Ao|-.*OurBits|-FLTTH|-IloveTV)/i,
    'TTG': /-(WiKi|DoA|.*TTG|NGB|ARiN)/i,
    'HDChina': /-(HDC)/i,
    'PTer': /-(Pter|.*Pter)/i,
    'LemonHD': /-(LHD|i18n|League.*)/i,
    'HDHome': /-hdh/i,
    'PThome': /(-pthome|-pth|.*@pth)/i,
    'PuTao': /-putao/i,
    'NanYang': /-nytv/i,
    'TLFbits': /-tlf/i,
    'HDDolby': /-DBTV/i,
    'FRDS': /-FRDS|@FRDS/i,
    'BeiTai': /-BeiTai/i
};
const thanks_str = "[quote][b][color=Blue]转自{site}，感谢原制作者发布。[/color][/b][/quote]\n\n{descr}";

/*******************************************************************************************************************
*                                          part 1 部分业务逻辑                                                      *
********************************************************************************************************************/

//获取网页地址，有两种可能，一种匹配上发布页面，一种匹配上源页面，源页面进行解析，跳转发布页面进行填写
var site_url = decodeURI(location.href);

if (site_url.match(/^.{3,30}userdetail/i)) {
    return;
}

//用于修改hdf的显示样式，不喜欢可以删除或者注释掉
if (site_url.match(/https:\/\/hdf\.world\/torrents\.php/i) && !site_url.match(/torrentid/i)){
    $('.team_name').each(function(){
        var $span = $(this).parent().next();
        $span.find('a:eq(1)').append(" / --");
        try{
            if ($span.find('a:eq(1)').html().match(/Free/)){
                $span.parent().css({'border-right': '5px solid yellow'});
            }
        } catch(err){}
        $(this).html(`<font color='red'>${$(this).html()}</font>`)
        $span.find('a:eq(1)').append($(this));
    });

    $('.group_torrent').each(function(){
        $(this).find('td:eq(1)').css({"vertical-align": "middle", "text-align":"center"});
        var text = $(this).find('td:eq(2)').html();
        text = text.replace('ans', 'years').replace('mois', 'month').replace('heure', 'hour').replace('jour', 'day').replace('semaine', 'week').replace('1 an', '1 year');
        $(this).find('td:eq(2)').html(text);
    });

    $('.group').each(function(){
        $(this).find('td').css({"border-top": "2px solid darkgrey"});
        $(this).find('td:lt(2)').remove();
        $(this).find('td:eq(0)').attr("colSpan", "4");
        var text = $(this).find('td:eq(1)').html();
        text = text.replace('ans', 'years').replace('mois', 'month').replace('heure', 'hour').replace('jour', 'day').replace('semaine', 'week').replace('1 an', '1 year');
        $(this).find('td:eq(1)').html(text);
        $(this).find('td:eq(1)').css({"text-align":"right"});
    });
    $('.head:gt(1)').hide();
    return;
}

//处理blutopia和hdpost跳转检索，因为其使用ajax异步检索
if (site_url.match(/https:\/\/blutopia\.xyz\/torrents\?imdb=tt.*/) || site_url.match(/https:\/\/pt\.hdpost\.top\/torrents\?imdb=tt.*/)){
    $('#imdb').val(site_url.split('=')[1].split('#')[0]);
    return;
}

//长mediainfo转换简洁版mediainfo，借鸡窝下蛋
if (site_url == 'https://www.bfdz.ink/tools/ptgen/'){
    const N = "\n";
    function get_general_info(general_info){

        var general_text = "General\n";
        try{
            var filename = general_info.match(/Complete name.*?:(.*)/i)[1].split('/').pop().trim();
            general_text += `Release Name.......: ${filename}${N}`;
        } catch(err) {}
        try{
            var format = general_info.match(/format.*:(.*)/i)[1].trim();
            general_text += `Container..........: ${format}${N}`;
        } catch(err) {}
        try{
            var duration = general_info.match(/duration.*:(.*)/i)[1].trim();
            general_text += `Duration...........: ${duration}${N}`;
        } catch(err) {}
        try {
            var file_size = general_info.match(/file.{0,5}size.*:(.*)/i)[1].trim();
            general_text += `Size...............: ${file_size}${N}`;
        } catch(err) {}

        general_text += `Source(s)..........: ${N}`;

        // var date_ = new Date();
        // var release_date = date_.getDate() + '/' + (date_.getMonth()+1) + '/' + date_.getFullYear();
        // general_text += `Release date....: ${release_date}${N}${N}`;

        return general_text;
    }
    function get_video_info(video_info){
        var video_text = `Video${N}`;
        try{
            var codec = video_info.match(/format.*:(.*)/i)[1].trim();
            video_text += `Codec..............: ${codec}${N}`;
        } catch(err) {}
        try {
            var type = video_info.match(/scan.{0,5}type.*:(.*)/i)[1].trim();
            video_text += `Type...............: ${type}${N}`;
        } catch(err) {}
        try{
            var width = video_info.match(/width.*:(.*)/i)[1].trim();
            var height = video_info.match(/height.*:(.*)/i)[1].trim();
            var resolution = width.replace(/ /g, '').match(/\d+/)[0] + 'x' + height.replace(/ /g, '').match(/\d+/)[0];
            video_text += `Resolution.........: ${resolution}${N}`;
        } catch(err) {}
        try{
            var aspect_ratio = video_info.match(/display.{0,5}aspect.{0,5}ratio.*?:(.*)/i)[1].trim();
            video_text += `Aspect ratio.......: ${aspect_ratio}${N}`;
        } catch(err) {}
        try{
            var bit_rate = video_info.match(/bit.{0,5}rate(?!.*mode).*:(.*)/i)[1].trim();
            video_text += `Bit rate...........: ${bit_rate}${N}`;
        } catch(err) {}
        try{
            var frame_rate = video_info.match(/frame.{0,5}rate.*:(.*fps)/i)[1].trim();
            video_text += `Frame rate.........: ${frame_rate}${N}`;
        } catch(err) {}

        video_text += `${N}`;

        return video_text;
    }
    function get_audio_info(audio_info){
        var audio_text = `Audio${N}`
        try{
            var format = audio_info.match(/format.*:(.*)/i)[1].trim();
            audio_text += `Format.............: ${format}${N}`;
        } catch(err) {}
        try{
            var channels = audio_info.match(/channel\(s\).*:(.*)/i)[1].trim();
            audio_text += `Channels...........: ${channels}${N}`;
        } catch(err) {}
        try{
            var bit_rate = audio_info.match(/bit.{0,5}rate(?!.*mode).*:(.*)/i)[1].trim();
            audio_text += `Bit rate...........: ${bit_rate}${N}`;
        } catch(err) {alert(err)}
        try{
            var language = audio_info.match(/language.*:(.*)/i)[1].trim();
            audio_text += `Language...........: ${language}`;
        } catch(err) {}
        
        try{ var title = audio_info.match(/title.*:(.*)/i)[1].trim(); } catch(err){ title = ''}
        audio_text += ` ${title}${N}${N}`

        return audio_text;
    }
    function get_text_info(text_info){
        var format = text_info.match(/format.*:(.*)/i)[1].trim();
        var language = text_info.match(/language.*:(.*)/i)[1].trim();
        try{ var title = text_info.match(/title.*:(.*)/i)[1].trim(); } catch(err){ title = ''}
        var subtitle_text = `Subtitles..........: ${language} ${format} ${title}${N}`
        return subtitle_text;
    }

    $('#status').hide(); $('#gen_out').hide(); $('#gen_replace').hide();
    $('.form-inline').hide(); $('hr').hide();
    $('.navbar-brand').first().html(`MediaInfo Parser`);

    $('#gen_out').parent().append(`

        <div id="mediainfo">
            <textarea class="form-control" rows="22" id="media_info"></textarea>
        </div>

        <div id='transfer'>
            <button class="btn btn-success" id="transfer_btn">转换</button>
        </div>

        <div id="clarify_mediainfo">
            <textarea class="form-control" rows="22" id="clarify_media_info"></textarea>
        </div>
    `);

    $('#transfer').click(function(){
        var mediainfo_text = $('#media_info').val();

        var general_info = mediainfo_text.match(/(general[\s\S]*?)?video/i)[0].trim();
        general_info = get_general_info(general_info);
        if (mediainfo_text.match(/encode.{0,10}date.*?:(.*)/i)){
            var release_date = mediainfo_text.match(/encode.{0,10}date.*?:(.*)/i)[1].trim();
            general_info += `Release date.......: ${release_date}`;
        }
        general_info += `${N}${N}`;
        $('#clarify_media_info').val(general_info);
        var video_info = mediainfo_text.match(/(video[\s\S]*?)audio/i)[0].trim();
        video_info = get_video_info(video_info);
        $('#clarify_media_info').val($('#clarify_media_info').val() + video_info);
        var audio_info = mediainfo_text.match(/(audio[\s\S]*)(text)?/i)[0].trim();
        var audio_infos = audio_info.split(/audio.*?\nid.*/i).filter(audio => audio.length > 30);
        for (i=0; i < audio_infos.length; i++){
            audio_info = get_audio_info(audio_infos[i]);
            $('#clarify_media_info').val($('#clarify_media_info').val() + audio_info);
        }
        try{
            var text_info = mediainfo_text.match(/(text[\s\S]*)$/i)[0].trim();
            var text_infos = text_info.split(/text.*?\nid.*/i).filter(text => text.length > 30);
            for (i=0; i < text_infos.length; i++){
                subtitle_info = get_text_info(text_infos[i]);
                $('#clarify_media_info').val($('#clarify_media_info').val() + subtitle_info);
            }
        } catch(err){
            var subtitle_text = `Subtitles..........: no`;
            $('#clarify_media_info').val($('#clarify_media_info').val() + subtitle_text);
        }
        console.log($('#clarify_media_info').val());
    });
    return;
}

//处理ptgen跳转，基本上使用频率很少了
if (site_url.match('ptgen')){
    url = site_url.split('=')[1];
    if (url.match(/tt/i)){
        url = 'http://www.imdb.com/title/' + url + '/';
    } else {
        url = 'https://movie.douban.com/subject/' + url + '/';
    }
    document.getElementById('input_value').value = url;
    document.getElementById('query_btn').click();
    return;
}

/*******************************************************************************************************************
*                                          part 2 常量、变量及函数定义封装层                                          *
********************************************************************************************************************/
//用于作为源站点但是不是转发站点的字典，大部分都外站
const o_site_info = {
    'FRDS': 'https://pt.keepfrds.com/',
    'BeiTai': 'https://www.beitai.pt/',
    'byr': 'https://bt.byr.cn/',
    'avz': 'https://avistaz.to/',
    'PHD': 'https://privatehd.to/',
    'PTP': 'https://passthepopcorn.me/',
    'HDT': 'https://hd-torrents.org/',
    'MTV': 'https://www.morethan.tv/',
    'BHD': 'https://beyond-hd.me/',
    'UHD': 'https://uhdbits.org/',
    'BLU': 'https://blutopia.xyz/',
    'hon3yhd': 'https://hon3yhd.com/',
    'TorrentLeech': 'https://www.torrentleech.org/',
    'xthor': 'https://xthor.tk/',
    'FileList': 'https://filelist.io/',
    'HDF': 'https://hdf.world/',
    'HDB': 'https://hdbits.org/',
    'BTN': 'https://broadcasthe.net/',
    'RED': 'https://redacted.ch/',
    'OpenCD': 'https://open.cd/',
    'U2': 'https://u2.dmhy.org/',
    'jpop': 'https://jpopsuki.eu/',
    'Bdc': 'https://broadcity.in/',
    'CG': 'http://cinemageddon.net/',
    'KG': 'https://karagarga.in/',
    'elite-tracker': 'https://elite-tracker.net/',
    'iTS': 'https://shadowthein.net/'
};

//获取源站点
const origin_site = find_origin_site(site_url);

//部分站点加载图标会有问题，可以将图标下载下来上传到公网图床提供网址即可
const site_img_info = {
    'HDHome': 'https://img.pterclub.com/images/2020/04/21/hdhfavicon.png',
    'TJUPT': 'https://img.pterclub.com/images/2020/04/21/hdhfavicon.png',
    'HDChina': 'https://img.pterclub.com/images/2020/04/21/hdcfavicon.png',
    'HDArea': 'https://img.pterclub.com/images/2020/04/21/hdafavicon.png',
    'BTSchool': 'https://img.pterclub.com/images/2020/05/05/bts.png',
    'HDDolby': 'https://s1.ax1x.com/2020/09/27/0A8NNV.png',
    'HDRoute': 'https://s1.ax1x.com/2020/09/27/0A8UhT.png',
    'HUDBT': 'https://img.pterclub.com/images/2020/07/15/favicon.png',
    'MTeam': 'https://i.endpot.com/image/4BLSA/favicon.jpg'
};

//用来拼接发布站点的url和字符串,也可用于识别发布页和源页面
const seperator = '#seperator#';

//iTS的简介模板，用于获取数据替换后填充
const its_base_content = `
[center]

[img]{poster}[/img]

[url={imdb_url}][img]https://i.ibb.co/KD855ZM/IMDb-Logo-2016.png[/img][/url]  [size=3]{imdb_score}[/size]  [*] [size=3][url={rt_url}][img]https://i.ibb.co/cDSgzxm/rt-logo.png[/img][/url] {rt_score}%[/size]  [*] [url={tmdb_url}][img]https://i.ibb.co/VWMtVnN/0fa9aceda3e5.png[/img][/url] [size=3]{tmdb_score}%[/size] 
 

[color=DarkOrange][size=2]◢ SYNOPSIS ◣[/size][/color]
    {en_descr}


[color=DarkOrange][size=2]◢ TRAILER ◣[/size][/color]
[youtube]{youtube_url}[/youtube]


[color=DarkOrange][size=2]◢ SCREENSHOTS ◣[/size][/color]
{screenshots}

[/center]
`

//需要从源网页获取的信息，有些可能没有
var raw_info = {
    //填充类信息
    'name': '', //主标题
    'small_descr': '', //副标题
    'url': '', //imdb链接
    'dburl': '', //豆瓣链接
    'descr': '', //简介
    'log_info': '',  //音乐特有
    'tracklist': '', //音乐特有
    'music_type': '', //音乐特有
    'music_media': '', //音乐特有
    'animate_info': '', //动漫特有|针对北邮人北洋U2的命名方式
    'anidb': '', //动漫特有
    'torrent_name': '', //动漫辅助
    'images': [], // 截图

    //选择类信息
    'type': '',  //type:可取值——电影/纪录/体育/剧集/动画/综艺……
    'source_sel': '', //来源(地区)：可取值——欧美/大陆/港台/日本/韩国/印度……
    'standard_sel': '',  //分辨率：可取值——4K/1080p/1080i/720p/SD
    'audiocodec_sel': '',  //音频：可取值——AAC/AC3/DTS…………
    'codec_sel': '', //编码：可取值——H264/H265……
    'medium_sel': '', //媒介：可取值——web-dl/remux/encode……

    //其他
    'origin_site': '', //记录源站点用于跳转后识别
    'origin_url': '', //记录源站点用于跳转后识别
    'golden_torrent': false, //主要用于皮转柠檬
    'mediainfo_cmct': '', //适用于春天的info
    'imgs_cmct': '', //适用于春天的截图
    'full_mediainfo': '', //完整的mediainfo有的站点有长短两种，如：铂金家、猫、春天

    'youtube_url': '', //用于发布iTS
    'ptp_poster': '',  //用于发布iTS
};

//函数用来豆瓣信息搜索时候进行处理, 后期准备作废
const numToChn = function(num) {
    var chnNumChar = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
    var index = num.toString().indexOf(".");
    if (index != -1) {
        var str = num.toString().slice(index);
        var a = "点";
        for (var i = 1; i < str.length; i++) {
            a += chnNumChar[parseInt(str[i])];
        }
        return a;
    } else {
        return;
    }
};

//添加搜索框架，可以自行添加或者注释站点
function add_search_urls(container, imdbid, imdbno, search_name, mode) {
    var div_style = 'align="center" style="border: 1px solid blue;"';
    var text = '快速搜索：';
    var brs = '</br></br>';
    var font_color = 'red';

    if (mode == 1) {
        div_style = '';  font_color = 'green'; text = ''; brs = '</br>';
    } else if (mode == 2) {
        div_style = ''; brs = '</br>';
    } else if (mode == 3) {
        div_style = ''; font_color = 'green'; text = ''; brs = '';
    }
    var site_search_lists = site_search_list.join(' | ');
    site_search_lists = site_search_lists.format({'imdbid': imdbid, 'imdbno': imdbno, 'search_name': search_name});
    container.append(`${brs}<div ${div_style}><font size="2px" color=${font_color}>${text}${site_search_lists}</font></div>`);
}

function numToChinese(num) { //定义在每个小节的内部进行转化的方法，其他部分则与小节内部转化方法相同
    var chnNumChar = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
    var chnUnitChar = ["", "十", "百", "千"];
    var str = '',
        chnstr = '',
        zero = false,
        count = 0; //zero为是否进行补零， 第一次进行取余由于为个位数，默认不补零
    if (num > 0 && num < 100) {
        var v = num % 10;
        var q = Math.floor(num / 10);

        if (num < 10) { //如果数字为零，则对字符串进行补零
            chnstr = chnNumChar[v] + chnstr;

        } else if (num == 10) chnstr = chnUnitChar[1];
        else if (num > 10 && num < 20) chnstr = "十" + chnNumChar[v];
        else {
            if (v == 0) chnstr = chnNumChar[q] + "十";
            else chnstr = chnNumChar[q] + "十" + chnNumChar[v];
        }
    }
    return chnstr;
}

//用来判断地址属于哪个站点（国内发布站点，国外源站点，或其他）
function find_origin_site(url){

    var domain; //域名
    var reg;    //正则匹配表达式
    var key;
    //先从发布站点找
    for (key in site_info){
        //获取域名
        domain = site_info[key].split('//')[1].replace('/', '');
        reg = new RegExp(domain, 'i');
        if (url.match(reg)){
            if (key == 'HDB' && url.match(/uhdbits\.org/)){
                return 'UHD';
            }
            return key;
        }
    }
    //再从特殊源站点找
    for (key in o_site_info){
        //获取域名
        domain = o_site_info[key].split('//')[1].replace('/', '');
        reg = new RegExp(domain, 'i');
        if (url.match(reg)){
            return key;
        }
    }
    return 'other';
}

//标签及其字标签转换为字符串，主要用于获取简介等等, 根据网页树的结构，采用前序遍历递归呈现。
function walkDOM(n) {
    do {
        if (n.nodeName == 'FONT') {
            if (n.color != '') {
                n.innerHTML = '[color=' + n.color + ']' + n.innerHTML + '[/color]';
            }
            if (n.size != '') {
                n.innerHTML = '[size=' + n.size + ']' + n.innerHTML + '[/size]';
            }
            if (n.face != '') {
                n.innerHTML = '[font=' + n.face + ']' + n.innerHTML + '[/font]';
            }
        } else if (n.nodeName == 'SCRIPT'){
            n.innerHTML = '';
        } else if (n.nodeName == 'SPAN') {
            if (n.style.color != '') {
                n.innerHTML = '[color=' + n.style.color + ']' + n.innerHTML + '[/color]';
            }
        } else if (n.nodeName == 'U'){
            n.innerHTML = '[u]' + n.innerHTML + '[/u]';
        } else if (n.nodeName == 'A') {
            if (n.innerHTML != "" && n.href) {
                if (site_url.match(/http(s*):\/\/chdbits.co\/details.php.*/i)) {
                    if (!n.innerHTML.match(/pic\/hdl\.gif/g)) {
                        n.innerHTML = '[url=' + n.href + ']' + n.innerHTML + '[/url]';
                    }
                } else {
                    n.innerHTML = '[url=' + n.href + ']' + n.innerHTML + '[/url]';
                }
            }
        } else if (n.nodeName == 'TABLE') {
            if (n.innerHTML != "") {
                if (site_url.match(/http(s*):\/\/totheglory.im.*/i)) {
                    n.innerHTML = '[quote]' + n.innerHTML + '[/quote]';
                }
            }
        } else if (n.nodeName == 'P') {
            if (n.innerHTML != "") {
                if (site_url.match(/http(s*):\/\/totheglory.im.*/i)) {
                    n.innerHTML = '';
                }
            }
        } else if (n.nodeName == 'FIELDSET' || n.nodeName == 'BLOCKQUOTE') {
            if (!site_url.match(/hudbt/i) || n.nodeName != 'BLOCKQUOTE'){
                n.innerHTML = '[quote]' + n.innerHTML + '[/quote]';
            }
            if (n.nodeName == 'FIELDSET' && n.textContent.match(/(温馨提示|郑重声明|您的保种|商业盈利|相关推荐|自动发布|仅供测试宽带)/g)) {
                n.innerHTML = '';
            }
        } else if (n.nodeName == 'DIV' && n.innerHTML == '代码') {
            n.innerHTML = '';
            n.nextSibling.innerHTML = '[quote]' + n.nextSibling.innerHTML + '[/quote]';
        } else if (n.nodeName == 'BR') {
            if (site_url.match(/ourbits.club\/details.php.*|totheglory.im.*|blutopia.xyz.*|awesome-hd|hudbt|cinemageddon/i)) {
                n.innerHTML = '\r\n';
            }
        } else if (n.nodeName == 'LEGEND') {
            n.innerHTML = '';
        } else if (n.nodeName == 'IMG') {
            if (site_url.match(/http(s*):\/\/chdbits.co\/details.php.*/i)) {
                if (!n.src.match(/pic\/hdl\.gif/g)) {
                    raw_info.descr = raw_info.descr + '[img]' + n.src + '[/img]';
                }
            } else {
                raw_info.descr = raw_info.descr + '[img]' + n.src + '[/img]';
            }

        } else if (n.nodeName=='DIV' && site_url.match(/pthome/i) && n.className == 'codemain') {
            n.innerHTML = '';
        }
        if (n.hasChildNodes()) {
            walkDOM(n.firstChild);
        } else {
            raw_info.descr = raw_info.descr + n.textContent;
        }
        n = n.nextSibling;
    } while (n);
    return raw_info.descr;
}

//为了春天获取简介而写的定制节点转文本
function walk_cmct(n) {
    do {
        if (n.nodeName == 'SPAN') {
            if (n.style.color != '') {
                n.innerHTML = '[color=' + n.style.color + ']' + n.innerHTML + '[/color]';
            }
        } else if (n.nodeName == 'A') {
            if (n.innerHTML != "") {
                n.innerHTML = n.innerHTML;
            }
        } else if (n.nodeName == 'BR') {
            n.innerHTML = '\r\n';
        }

        if (n.hasChildNodes()) {
            walk_cmct(n.firstChild);
        } else {
            if (n.nodeType !=1){
                raw_info.descr = raw_info.descr + n.textContent;
            }
        }
        n = n.nextSibling;
    } while (n);
    return raw_info.descr;
}

//标签节点连带转换成字符串
function domToString (node) {
    var tmpNode = document.createElement('div');
    tmpNode.appendChild(node);
    var str = tmpNode.innerHTML;
    tmpNode = node = null; // 解除引用，以便于垃圾回收
    return str;
}

//方便进行判断是否是源站点，不然太长了,属于源站点进入逻辑业务层
function judge_if_the_site_as_source() {

    if (site_url.match(/http(s*):\/\/.*\/(upload|offer).*(php)?#seperator#/i)) {
        return 0;
    }
    if (site_url.match(/https:\/\/hd-space\.org\/index.php\?page=upload/)){
        return 0;
    }
    if (site_url.match(/https:\/\/hdcity.city\/upload\?tfu/)){
        return 2;
    }
    if (site_url.match(/https:\/\/hdcity.city\/upload/)){
        return 0;
    }
    if (site_url.match(/https:\/\/pt\.hdpost\.top/)){
        return 1;
    }
    if (site_url.match(/http(s*):\/\/.*\/.*details.*php.*/i)) {
        return 1;
    }
    if (site_url.match(/http(s*):\/\/totheglory.im\/t\/.*/i)) {
        return 1;
    }
    if (site_url.match(/http(s*):\/\/passthepopcorn.me.*torrentid.*/i)) {
        return 1;
    }
    if (site_url.match(/http(s*):\/\/broadcasthe.net.*torrentid.*/i)) {
        return 1;
    }
    if (site_url.match(/https:\/\/hdbits\.org\/details\.php\?id=.*/i)) {
        return 1;
    }
    if (site_url.match(/http(s*):\/\/privatehd.to\/torrent/i)) {
        return 1;
    }
    if (site_url.match(/http(s*):\/\/avistaz.to\/torrent/i)) {
        return 1;
    }
    if (site_url.match(/http(s*):\/\/www.morethan.tv\/torrents.php\?id/i)) {
        return 1;
    }
    if (site_url.match(/http(s*):\/\/beyond-hd.me\/torrents/i)) {
        return 1;
    }
    if (site_url.match(/http(s*):\/\/blutopia.xyz\//i)) {
        return 1;
    }
    if (site_url.match(/http(s*):\/\/awesome-hd.me\//i)) {
        return 1;
    }

    if (site_url.match(/http(s*):\/\/uhdbits.org\/torrents.php\?id=\d+&torrentid=\d+/i)) {
        return 1;
    }
    if (site_url.match(/http(s*):\/\/hdf.world\/torrents.php\?id=\d+&torrentid=\d+/i)) {
        return 1;
    }
    if (site_url.match(/http(s*):\/\/jpopsuki.eu\/torrents.php\?id=\d+&torrentid=\d+/i)) {
        return 1;
    }
    if (site_url.match(/http(s*):\/\/redacted.ch\/torrents.php\?id=\d+&torrentid=\d+/i)) {
        return 1;
    }
    if (site_url.match(/http(s*):\/\/www\.torrentleech\.org\/torrent\/*/i)) {
        return 1;
    }
    if (site_url.match(/http(s*):\/\/hon3yhd.com\//i)) {
        return 1;
    }
    if (site_url.match(/http(s*):\/\/xthor.tk\//i)) {
        return 1;
    }
}

//判断是否是国内的站点，国内站点架构基本一致且不需要额外获取豆瓣信息
function judge_if_the_site_in_domestic() {

    var domain; //域名
    var reg;    //正则匹配表达式
    var key;
    for (key in o_site_info){
        if (key != 'FRDS' && key != 'BeiTai' && key != 'byr' && key != 'U2'){
            domain = o_site_info[key].split('//')[1].replace('/', '');
            reg = new RegExp(domain, 'i');
            if (site_url.match(reg)){
                return 0;
            }
        }
    }
    return 1;
}

//处理标题业务封装进函数
function deal_with_title(title){

    title = title.replace(/\./g, ' ');
    title = title.replace(/mkv$|mp4$/i, '');

    if (title.match(/[^\d](2 0|5 1|7 1|1 0)/)) {
        title = title.replace(/[^\d](2 0|5 1|7 1|1 0)/, function(data){
            return data.slice(0,2)+'.'+ data.slice(3,data.length);
        });
    }

    title = title.replace(/H ?(26[45])/i, "H.$1");
    title = title.replace(/x265[.-]10bit/i, 'x265 10bit');
    //处理免费后缀等等写在后边
    title = title.replace(/\s+\[2?x?(免费|free)\].*$|\(限时.*\)|\(限時.*\)/ig, '');
    title = title.replace(/\[.*?\]/ig, '');
    title = title.replace(/剩余时间.*/i, '');
    title = title.replace(/\(|\)/ig, '');
    title = title.trim();

    return title;
}

//处理副标题逻辑业务封装进函数
function deal_with_subtitle(subtitle){
    //去除中括号等等
    subtitle = subtitle.replace(/(\[|\])/g, "");
    subtitle = subtitle.replace(/autoup/i, '');
    return subtitle;
}

//字典转成字符串传达到跳转页面
function dictToString(my_dict){
    var tmp_string = '';
    var link_str = '#linkstr#';
    var key;
    for (key in my_dict){
        tmp_string += key + link_str + my_dict[key] + link_str;
    }
    return tmp_string.slice(0, tmp_string.length-9);
}

//字符串转换成字典回来填充发布页面
function stringToDict(my_string){
    var link_str = '#linkstr#';

    var tmp_array = my_string.split(link_str);

    var tmp_dict = {};
    for (i = 0; i < tmp_array.length; i++) {
        if (i % 2 == 0) {
            tmp_dict[tmp_array[i]] = tmp_array[i + 1];
        }
    }
    return tmp_dict;
}

//下面两个函数用来为字符串赋予format方法：例如——'thank you {site}'.format({'site':'ttg'}) => 'thank you ttg'
String.prototype.replaceAll = function (exp, newStr) {
    return this.replace(new RegExp(exp, "gm"), newStr);
};

String.prototype.format = function(args) {
    var result = this;
    if (arguments.length < 1) {
        return result;
    }

    var data = arguments; // 如果模板参数是数组
    if (arguments.length == 1 && typeof (args) == "object") {
        // 如果模板参数是对象
        data = args;
    }
    for ( var key in data) {
        var value = data[key];
        if (undefined != value) {
            result = result.replaceAll("\\{" + key + "\\}", value);
        }
    }
    return result;
};

//下面几个函数为字符串赋予获取各种编码信息的方法——适用于页面基本信息和字符串
String.prototype.medium_sel = function() { //媒介
    var result = this;
    if (result.match(/(Webdl|Web-dl)/i)) {
        result = 'WEB-DL';
    } else if (result.match(/(HDTV)/i)) {
        result = 'HDTV';
    } else if (result.match(/(Remux)/i) && ! result.match(/Encode/)) {
        result = 'Remux';
    } else if (result.match(/(UHD|UltraHD)/i)) {
        result = 'UHD';
    } else if (result.match(/(Blu-ray|.MPLS)/i)) {
        result = 'Blu-ray';
    } else if (result.match(/(Encode|BDRIP|webrip|BluRay)/i)) {
        result = 'Encode';
    } else if (result.match(/(DVDRip|DVD)/i)) {
        result = 'DVD';
    } else {
        result = '';
    }
    return result;
};

String.prototype.codec_sel = function() { //编码

    var result = this;

    if (result.match(/(H264|H\.264|AVC)/i)) {
        result = 'H264';
    } else if (result.match(/(HEVC|H265|H\.265)/i)) {
        result = 'H265';
    } else if (result.match(/(X265)/i)) {
        result = 'X265';
    } else if (result.match(/(X264)/i)) {
        result = 'X264';
    } else if (result.match(/(VC-1)/i)) {
        result = 'VC-1';
    } else if (result.match(/(MPEG-2)/i)) {
        result = 'MPEG-2';
    } else if (result.match(/(MPEG-4)/i)) {
        result = 'MPEG-4';
    } else if (result.match(/(XVID)/i)) {
        result = 'XVID';
    } else {
        result = '';
    }

    return result;
};

String.prototype.audiocodec_sel = function() { //音频编码
    var result = this;
    if (result.match(/(DTS-HDMA:X 7\.1)/i)){
        result = 'DTS-HDMA:X 7.1';
    } else if (result.match(/(DTS-HD.?MA)/i)) {
        result = 'DTS-HDMA';
    } else if (result.match(/(DTS-HD HR)/i)) {
        result = 'DTS-HDHR';
    } else if (result.match(/(DTS-HD)/i)) {
        result = 'DTS-HD';
    } else if (result.match(/(DTS-X)/i)) {
        result = 'DTS-X';
    } else if (result.match(/(LPCM)/i)) {
        result = 'LPCM';
    } else if (result.match(/(DD|AC3|AC-3|Dolby Digital)/i)) {
        result = 'AC3';
    } else if (result.match(/(Atmos)/i)) {
        result = 'Atmos';
    } else if (result.match(/(AAC)/i)) {
        result = 'AAC';
    } else if (result.match(/(TrueHD)/i)) {
        result = 'TrueHD';
    } else if (result.match(/(DTS)/i)) {
        result = 'DTS';
    } else if (result.match(/(Flac)/i)) {
        result = 'Flac';
    } else if (result.match(/(APE)/i)) {
        result = 'APE';
    } else if (result.match(/(MP3)/i)) {
        result = 'MP3';
    } else if (result.match(/(WAV)/i)) {
        result = 'WAV';
    } else {
        result = '';
    }
    return result;
};

String.prototype.standard_sel = function() {

    var result = this;
    if (result.match(/(4320p|8k)/i)){
        result = '8K';
    } else if (result.match(/(2160p|4k)/i)){
        result = '4K';
    } else if (result.match(/(1080p|2K)/i)){
        result = '1080p';
    } else if (result.match(/(720p)/i)){
        result = '720p';
    } else if (result.match(/(1080i)/i)){
        result = '1080i';
    } else if (result.match(/(576p|480p)/i)){
        result = 'SD';
    } else {
        result = '';
    }
    return result;
};

//获取类型
String.prototype.get_type = function() {

    var result = this;
    if (result.match(/(Movie|电影|UHD原盘)/i)) {
        result = '电影';
    } else if (result.match(/(Animations|动漫|動畫|动画|Anime)/i)) {
        result = '动漫';
    } else if (result.match(/(Docu|纪录)/i)) {
        result = '纪录';
    } else if (result.match(/(TV.*Series|剧|TV-PACK|TV-Episode|TV)/i)) {
        result = '剧集';
    } else if (result.match(/(TV.*Show|综艺)/i)) {
        result = '综艺';
    } else if (result.match(/(Music|音乐)/i)) {
        result = '音乐';
    } else if (result.match(/(Sport|体育)/i)) {
        result = '体育';
    } else if (result.match(/(学习|资料|Study)/i)) {
        result = '学习';
    } else if (result.match(/(Software|软件)/i)) {
        result = '软件';
    } else if (result.match(/(Game|游戏)/i)) {
        result = '游戏';
    } else {
        result = '';
    }

    return result;
};

String.prototype.source_sel = function() {
    var info_text = this;
    //来源就在这里获取
    if (info_text.match(/(大陆|China|中国|CN|chinese)/i)) {
        source_sel = '大陆';
    } else if (info_text.match(/(HK&TW|港台|thai)/i)) {
        source_sel = '港台';
    } else if (info_text.match(/(EU&US|欧美|US\/EU)/i)) {
        source_sel = '欧美';
    } else if (info_text.match(/(JP&KR|日韩|japanese|korean)/i)) {
        source_sel = '日韩';
    } else if (info_text.match(/(香港)/i)) {
        source_sel = '香港';
    } else if (info_text.match(/(台湾)/i)) {
        source_sel = '台湾';
    } else if (info_text.match(/(日本|JP)/i)) {
        source_sel = '日本';
    } else if (info_text.match(/(韩国|KR)/i)) {
        source_sel = '韩国';
    } else if (info_text.match(/(印度)/i)) {
        source_sel = '印度';
    } else {
        source_sel = '';
    }
    return source_sel;
};

//获取副标题或是否中字、国语、粤语以及DIY
String.prototype.get_label = function(){
    var my_string = this;
    var labels = {'gy': false, 'yy': false, 'zz': false, 'diy': false, 'hdr10': false, 'db': false};

    if (my_string.match(/([简繁].{0,12}字幕|[简繁中].{0,3}字|DIY.{1,5}字|内封.{0,3}[繁中字])|(Text.*?#\d+[\s\S]*?Chinese|subtitles.*chs|subtitles.*mandarin)/i)){
        labels.zz = true;
    }
    if (my_string.match(/(国.{0,3}语|国.{0,3}配|台.{0,3}语|台.{0,3}配)|(Audio.*Chinese|Audio.*mandarin)/i)){
        labels.gy = true;
    }
    if (my_string.match(/(粤.{0,3}语|粤.{0,3}配|Audio.*cantonese)/i)){
        labels.yy = true;
    }
    if (my_string.match(/DIY|-.*?@(MTeam|CHDBits|HDHome|OurBits|HDChina|Language|TTG|Pter|HDSky|PThome|CMCT|Dream)/i)){
        labels.diy = true;
    }
    if (my_string.match(/hdr10/i)) {
        labels.hdr10 = true;
    }
    if (my_string.match(/Dolby Vision/i)){
        labels.db = true;
    }
    return labels;
};

function set_selected_option_by_value(my_id, value){

    var box = document.getElementById(my_id);
    for (i=0; i < box.options.length; i++){
        if ( box.options[i].value == value){
            box.options[i].selected = true;
        }
    }
}

//副标题增加原盘版本信息
function blurayVersion(name){

    var small_descr;
    const ver = ['AUS','CAN','CEE','CZE','ESP','EUR','FRA','GBR','GER','HKG','ITA','JPN','KOR','NOR','NLD','RUS','TWN','USA'];
    const ver_chinese=['澳版','加拿大','CEE','捷克','西班牙版','欧版','法版','英版','德版','港版','意大利版','日版','韩版','挪威版','荷兰版','俄版','台版','美版'];
    for (i=0; i<ver.length; i++) {
        var reg = new RegExp('(\\.| )'+ ver[i] + '(\\.| )', 'i');
            if (name.match(reg)) {
                small_descr ='【'+ver_chinese[i]+'原盘】';
                break;
        }
    }
    return small_descr;
}

function judge_forward_sit_in_domestic(site){
    if ( Object.keys(o_site_info).indexOf(site) < 0 && site != "HDSpace") {
        return true;
    } else {
        return false;
    }
}

//从简介和名称获取副标题
function get_small_descr_from_descr(descr, name){

    var small_descr = '';
    var videoname = ''; //译名
    var sub_str = '';   //剧集季集信息
    var type_str = '';  //类别信息

    if (descr.match(/译.{0,5}名[^\r\n]+/)) {
        videoname = descr.match(/译.*?名([^\r\n]+)/)[1];
        videoname = videoname.trim(); //去除首尾空格
        if (name.match(/S\d{2}E\d{2}/ig)) { //电视剧单集
            sub_str = name.match(/(S\d{2}E\d{2})/ig)[0];
            sub_str = sub_str.replace(/S/i, '*第');
            sub_str = sub_str.replace(/E/i, '季 第') + '集*';
        }
        small_descr = videoname + sub_str;
    } if (descr.match(/类.{0,5}别[^\r\n]+/)) {
        type_str = descr.match(/类.*别([^\r\n]+)/)[1];
        type_str = type_str.trim(); //去除首尾空格
        type_str = type_str.replace(/\//g, ''); //去除/
        small_descr = small_descr + ' | 类别：' + type_str;
    }
    return small_descr.trim();
}

//根据简介获取来源，也就是地区国家产地之类的——尤其分类是日韩或者港台的，有的站点需要明确一下
function get_source_sel_from_descr(descr){

    var region = '';
    var reg_region = descr.match(/(地.{0,5}?区|国.{0,5}?家|产.{0,5}?地)([^\r\n]+)/);
    if (reg_region) {
        region = reg_region[2];
        region = region.trim(); //去除首尾空格

        reg_region = RegExp(us_ue, 'i');
        if (region.match(reg_region)){
            region = '欧美';
        } else if (region.match(/香港/)){
            region = '香港';
        } else if (region.match(/台湾/)){
            region = '台湾';
        } else if (region.match(/日本/)){
            region = '日本';
        } else if (region.match(/韩国/)){
            region = '韩国';
        } else if (region.match(/印度/)){
            region = '印度';
        } else if (region.match(/中国|大陆/)){
            region = '大陆';
        }
    }
    return region;
}

//为获取豆瓣信息提供链接简化 promise
function create_site_url_for_douban_info(raw_info, is_douban_search_needed){
    var p = new Promise(function(resolve, reject){
        if (is_douban_search_needed){
            url = raw_info.url.match(/tt\d+/)[0];
            req = 'https://movie.douban.com/j/subject_suggest?q={url}'.format({ 'url': url });
            GM_xmlhttpRequest({
                method: 'GET',
                url: req,
                onload: function(res) {
                    var response = JSON.parse(res.responseText);
                    if (response.length > 0) {
                        raw_info.dburl = 'https://movie.douban.com/subject/' + response[0].id;
                        resolve(raw_info);
                    } else {
                        reject();
                    }
                }
            });
        } else {
             resolve(raw_info);
        }
    });
    return p;
}

//颜色转换rgb转16进制
function rgb_2_hex(data) {
    if (data.match(/rgb\((.*)\)/)){
        data = data.match(/rgb\((.*)\)/)[1];
        data = data.split(',');
        color = '#';
        for (iii=0; iii<data.length; iii++){
            color += parseInt(data[iii]).toString(16);
        }
        return color;
    } else {
        return data;
    }
}

//判断是否是原盘
function check_descr(descr){
    flag = false;
    if (descr.match(/mpls/i)){
        flag = true;
    }
    return flag;
}

function get_bluray_name_from_descr(descr, name) {

    var temp_title="";
    //分辨率
    if(descr.match(/(2160)(P|I)/i)) {
        temp_title = temp_title+"2160p.Blu-ray ";
    } else if(descr.match(/(1080)(P)/i)) {
        temp_title = temp_title+"1080p.Blu-ray.";
    } else if(descr.match(/(1080)(i)/i)) {
        temp_title = temp_title+"1080i.Blu-ray.";
    }

    if(descr.match(/Ultra HD|UHD/i)) {
        temp_title = "UHD ";
    }

    //视频编码
    if(descr.match(/(AVC Video)/i)) {
        temp_title = temp_title+"AVC.";
    } else if(descr.match(/(HEVC)/i)){
        temp_title = temp_title+"HEVC.";
    } else if(descr.match(/MPEG-2 Video/i)){
        temp_title = temp_title + "MPEG-2.";
    }

    //音频编码
    if(descr.match(/(DTS:X[\s\S]{0,200}7.1)/i)) {
        temp_title = temp_title+"DTS-HD.MA.7.1";
    }
    else if(descr.match(/(TrueHD[\s\S]{0,200}7.1)/i)){
        temp_title = temp_title+"TrueHD.7.1";
    }
    else if(descr.match(/(TrueHD[\s\S]{0,200}5.1)/i)){
        temp_title = temp_title+"TrueHD.5.1";
    }
    else if(descr.match(/(DTS-HD[\s\S]{0,200}5.1)/i)){
        temp_title = temp_title+"DTS-HD.MA.5.1";
    }
    else if(descr.match(/(DTS-HD[\s\S]{0,200}2.0)/i)){
        temp_title = temp_title+"DTS-HD.MA.2.0";
    }
    else if(descr.match(/(DTS-HD[\s\S]{0,200}1.0)/i)){
        temp_title = temp_title+"DTS-HD.MA.1.0";
    }
    else if(descr.match(/(LPCM[\s\S]{0,200}2.0)/i)){
        temp_title = temp_title+"LPCM.2.0";
    }
    else if(descr.match(/(Dolby Digital[\s\S]{0,200}2.0)/i)){
        temp_title = temp_title+"DD.2.0";
    }
    else if(descr.match(/(Dolby Digital[\s\S]{0,200}5.1)/i)){
        temp_title = temp_title+"DD.5.1";
    }
    if (raw_info.name.match(/Blu-ray|DTS-HD|TrueHD|LPCM|HEVC|Bluray/)){
       name = raw_info.name;
    }
    else if (name.match(/BLURAY|UHD.BLURAY/)){
        name = name.replace(/(MULTi.)/i,"");
        name = name.replace(/(DUAL.)/i,"");
        name = name.replace(/(GERMAN)/i,"GER");
        name = name.replace(/(REMASTERED)/i,"Remastered");
        name = name.replace(/(UNCUT)/i,"Uncut");
        name = name.replace(/(SWEDiSH)/i,"");
        name = name.replace(/(DOCU)/i,"");
        name = name.replace(/COMPLETE[\s\S]{0,20}BLURAY/,temp_title);
    }  else {
        name = name + '.' + temp_title + "-UNTOUCHED";
    }

    return name;
}

//从简介拆分出来mediainfo和截图
function get_mediainfo_picture_from_descr(descr){

    var info = {'mediainfo': '', 'pic_info': ''};

    //获取mediainfo,这里可以扩展匹配不同情形
    if (descr.match(/DISC INFO:|.MPLS|Video Codec/i)){
        cmctinfos = descr.match(/\[quote.*?\][\s\S]*?(DISC INFO|.MPLS|Video Codec)[\s\S]*?\[\/quote\]/i)[0];
    } else if (descr.match(/General|RELEASE.NAME|RELEASE DATE|Unique ID|RESOLUTiON|Bitrate|帧　率/i)){
        cmctinfos = descr.match(/\[quote.*?\][\s\S]*?(General|RELEASE.NAME|RELEASE DATE|Unique ID|RESOLUTiON|Bitrate|帧　率)[\s\S]*?\[\/quote\]/i)[0];
    }
    cmctinfos = cmctinfos.replace(/\[quote.*?\]/ig, '[quote]');
    while (cmctinfos.match(/\[quote\]/i)) {
        cmctinfos = cmctinfos.slice(cmctinfos.search(/\[quote\]/)+7);
    }
    cmctinfos = cmctinfos.replace(/\[\/quote\]/i, '');
    cmctinfos = cmctinfos.replace(/\[\/?(font|size|quote).{0,80}?\]/ig, '');

    //获取图片
    cmctimgs = descr.replace(descr.slice(0,descr.search(/\[\/quote\]/)+7), '');
    var tmp_text = '';
    while (cmctimgs.match(/\[quote\]/)) {
        tmp_text = cmctimgs.replace(cmctimgs.slice(0,cmctimgs.search(/\[quote\]/)+7), '');
        if (!tmp_text.match(/\[img\].*?\[\/img\]/)){
            break;
        } else {
            cmctimgs = tmp_text;
        }
    }
    cmctimgs = cmctimgs.match(/(\[url=.*?\])?\[img\].*?\[\/img\](\[\/url\])?/g);
    if (cmctimgs){
        console.log(cmctimgs)
        cmctimgs = cmctimgs.join(' ');
    } else {
        cmctimgs = '';
    }

    info.mediainfo = cmctinfos.trim();
    info.pic_info = cmctimgs.trim();

    return info;
}

function fill_raw_info(raw_info){
    //标题肯定都有，副标题可能没有，从简介获取
    if (raw_info.small_descr == ''){
        raw_info.small_descr = get_small_descr_from_descr(raw_info.descr, raw_info.name);
    }

    if (raw_info.type == '电影'){
        if (raw_info.descr.match(/类[\s\S]{0,5}别[\s\S]{0,30}纪录片/i)) {
            raw_info.type = '纪录';
        } 
    }

    //补充豆瓣和imdb链接
    if (raw_info.url == ''){
        var url = raw_info.descr.match(/http(s*):\/\/www.imdb.com\/title\/tt(\d+)/i);
        if (url){
            raw_info.url = url[0] + '/';
        }
    }
    if (raw_info.dburl == ''){
        var dburl = raw_info.descr.match(/http(s*):\/\/.*?douban.com\/subject\/(\d+)/i);
        if (dburl){
            raw_info.dburl = dburl[0] + '/';
        }
    }

    //没有来源或者指向不明
    if (raw_info.source_sel == '' || raw_info.source_sel.match(/(港台|日韩)/)){
        var region = get_source_sel_from_descr(raw_info.descr);
        if (region != ''){
            raw_info.source_sel = region;
        }
    }

    //如果没有媒介, 从标题获取
    if (raw_info.medium_sel == ''){
        raw_info.medium_sel = raw_info.name.medium_sel();
    } 
    if (raw_info.medium_sel == 'Blu-ray' && raw_info.name.match(/UHD|2160P/i)){
        raw_info.medium_sel = raw_info.name.medium_sel();
    }

    //如果没有编码信息
    if (raw_info.codec_sel == ''){
        raw_info.codec_sel = raw_info.name.codec_sel();
    }

    //没有音频编码, 从标题获取，最后从简介获取
    if (raw_info.audiocodec_sel == ''){
        raw_info.audiocodec_sel = raw_info.name.audiocodec_sel();
        if (raw_info.audiocodec_sel == ''){
            raw_info.audiocodec_sel = raw_info.descr.audiocodec_sel();
        }
    }

    //没有分辨率
    if (raw_info.standard_sel == ''){
        raw_info.standard_sel = raw_info.name.standard_sel();
    }

    if (raw_info.name.match(/Remux/i)){
        raw_info.medium_sel = 'Remux';
    }

    return raw_info;
}

//PTHome、HDHome、杜比标签勾选
function check_label(nodes, value) {
    for (i=0; i<nodes.length; i++){
        if (nodes[i].value == value){
            nodes[i].checked = true;
            break;
        }
    }
}

function init_buttons_for_transfer(container, site, mode, raw_info) {

    //imdb框
    var input_box = document.createElement('input');
    input_box.type="text";
    input_box.className="input";
    input_box.id="input_box";
    input_box.value = raw_info.url;

    if (site == 'PTP') {
        input_box.style.width = '320px';
    }else if (site == 'PHD' || site == 'avz' || site == 'BHD') {
        input_box.style.width = '270px';
    } else {
        input_box.style.width = '280px';
    }
    if (site == 'TorrentLeech') {
        input_box.style.border = '1px solid green';
    }
    container.appendChild(input_box);

    var search_button = document.createElement("input");
    search_button.type = "button";
    search_button.style.marginLeft = '12px';
    search_button.style.marginRight = '4px';
    search_button.value = "检索名称";
    search_button.id = 'search_button';
    container.appendChild(search_button);

    var checkBox=document.createElement("input");
    checkBox.setAttribute("type","checkbox");
    checkBox.setAttribute("id",'douban_api');
    var douban_text = document.createTextNode('API');
    container.append(checkBox);
    container.append(douban_text);

    var ptgen_button = document.createElement("input");
    ptgen_button.type = "button";
    ptgen_button.style.marginLeft = '12px';
    ptgen_button.value = "ptgen跳转";
    ptgen_button.id = 'ptgen_button';
    container.appendChild(ptgen_button);

    var douban_button = document.createElement("input");
    douban_button.type = "button";
    douban_button.value = "点击获取";
    douban_button.id = 'douban_button';
    douban_button.style.marginLeft = '12px';
    container.appendChild(douban_button);


    if (raw_info.images.length > 0 && ['HDB','PHD','avz', 'FileList'].indexOf(site) > -1) {
        var download_button = document.createElement('input');
        download_button.type = "button";
        download_button.id = 'download_pngs';
        download_button.value = '下载截图';
        // download_button.style.fontSize = '11px';
        download_button.style.marginLeft = '12px';
        download_button.onclick = function() {
            download_button.disable = true;
            for (var idx = 0; idx < raw_info.images.length; ++idx) {
                var url = raw_info.images[idx];
                if(site == 'FileList'){
                    url = url.replace(/\.md/g,'');
                }
                console.log(url);
                var name = url.split('/').pop();
                if (!name.match(/\.(png|jpg)$/i)){
                    name = name + '.png';
                }
                GM_download({url: url, name: name});
            }
        };
        container.appendChild(download_button);
    }

    var textarea = document.createElement('textarea');
    textarea.style.marginTop = '12px';
    textarea.style.height = '120px';
    textarea.style.width = '580px';
    textarea.id = 'textarea';
    container.appendChild(textarea);
    textarea.style.display = 'none';


    checkBox.addEventListener('click', function(e){
        if (e.target.checked) {
            $('#textarea').slideDown();
        } else {
            $('#textarea').slideUp();
        }
    }, false);

    // 上下结构

    if (mode == 1) {
        container.align = 'center';
         //匹配站点样式，为了美观
        if (site == 'MTV'){
             $('#douban_button,#ptgen_button,#search_button,#download_pngs').css({"backgroundColor": "#262626"});
        } else if (site != 'BTN'){
            $('#douban_button,#ptgen_button,#search_button,#download_pngs').css({"border": "1px solid #2F3546", "color": "#FFFFFF", "backgroundColor": "#2F3546"});
            if (site == 'PTP') {
                textarea.style.width = '595px';
            }
        } else if (site == 'BTN') {
            textarea.style.width = '530px';
        }

    } else {
        if (site == 'hon3yhd') {
            $('#textarea').before('<br>');
            textarea.style.width = '580px';
        }
        if (site == 'BHD' || site == 'BLU'){
            $('#douban_button,#ptgen_button,#search_button,#download_pngs').css({"border": "1px solid #0D8ED9", "color": "#FFFFFF", "backgroundColor": "#292929"});
        } else if (site == 'TorrentLeech') {
             $('#douban_button,#ptgen_button,#search_button,#download_pngs').css({"border": "1px solid green", "color": "#FFFFFF", "backgroundColor": "#292929"});
        }
        if (site == 'BHD') {
            textarea.style.width = '550px';
        } else if (site == 'BLU') {
            textarea.style.width = '585px';
        }
    }

    if (raw_info.images.length > 0 && ['HDB','PHD','avz', 'FileList'].indexOf(site) > -1) {
        var width = textarea.style.width.match(/\d+/)[0];
        if (site == 'PHD' || site == 'avz') {
            textarea.style.width = `${parseInt(width) + 90}px`;
        } else if (site == 'FileList'){
            textarea.style.width = `${parseInt(width) + 35}px`;
        } else if (site == 'HDB'){
            textarea.style.width = `${parseInt(width) + 55}px`;
        }
    }

    //把白框换个颜色
    if (['PTP', 'xthor', 'HDF', 'BHD', 'BLU', 'TorrentLeech'].indexOf(site) > -1) {
        textarea.style.backgroundColor = '#4d5656';
        textarea.style.color = 'white';
        input_box.style.backgroundColor = '#4d5656';
        input_box.style.color = 'white';
    }
}

function get_size_from_descr(descr){

   size_ = 0;
    try{
        if (descr.match(/disc.{1,10}size.*?([\d,]+).*?bytes/i)){
            var size = descr.match(/disc.{1,10}size.*?([\d,]+).*?bytes/i)[1];
            size = size.replace(/,/g, '');
            size_ = parseInt(size)/1024/1024/1024;
        } else if (descr.match(/size[^\d]{0,20}(\d+\.\d+).+GiB/i)) {
            size_ = parseInt(descr.match(/size[^\d]{0,20}(\d+\.\d+).+GiB/i)[1]);
        }
    } catch (err) {
        // alert(err)
    }
    return size_;
}

function match_link(site, data) {
    var link = '';
    if (site == 'imdb' && data.match(/http(s*):\/\/.*?imdb.com\/title\/tt\d+/i)){
        link = data.match(/http(s*):\/\/.*?imdb.com\/title\/tt\d+/i)[0] + '/';
    } else if (site == 'douban' && data.match(/http(s*):\/\/.*?douban.com\/subject\/(\d+)/i)){
        link = data.match(/http(s*):\/\/.*?douban.com\/subject\/(\d+)/i)[0] + '/';
    } else if (site == 'anidb' && data.match(/https:\/\/anidb\.net\/a\d+/i)){
        link = data.match(/https:\/\/anidb\.net\/a\d+/i)[0] + '/';
    }else if(site == 'tmdb' && data.match(/http(s*):\/\/www.themoviedb.org\//i)){
        link = data.match(/http(s*):\/\/www.themoviedb.org\/(tv|movie)\/\d+/i)[0] + '/';
    }
    return link;
}

function set_jump_href(raw_info, mode) {

    if (mode == 1) {
        for (key in site_info) {
            if (key == 'CMCT'){
                forward_url = site_info[key] + 'upload.new.php';
            } else if (key == 'HDPost' && (raw_info.type == '剧集' || raw_info.type == '纪录' || raw_info.type == '综艺')) {
                forward_url = site_info[key] + 'upload/2';
            } else if (key == 'HDPost') {
                forward_url = site_info[key] + 'upload/1';
            } else if (key == 'HDCity' || key == 'BHD' || key == 'HDB') {
                forward_url = site_info[key] + 'upload';
            } else if (key == 'LemonHD' && (raw_info.type == '电影')) {
                forward_url = site_info[key] + 'upload_movie.php';
            } else if (key == 'LemonHD' && (raw_info.type == '剧集' || raw_info.type == '综艺')) {
                forward_url = site_info[key] + 'upload_tv.php';
            } else if (key == 'LemonHD' && (raw_info.type == '音乐')) {
                forward_url = site_info[key] + 'upload_music.php';
            } else if (key == 'LemonHD' && (raw_info.type == '动漫')) {
                forward_url = site_info[key] + 'upload_animate.php';
            } else if (key == 'LemonHD' && (raw_info.type == '纪录')) {
                forward_url = site_info[key] + 'upload_doc.php';
            } else if (key == 'LemonHD') {
                forward_url = site_info[key] + 'upload_other.php';
            } else if (key == 'BLU' && (raw_info.type == '剧集' || raw_info.type == '纪录' || raw_info.type == '综艺')) {
                forward_url = site_info[key] + 'upload/2';
            } else if (key == 'BLU') {
                forward_url = site_info[key] + 'upload/1';
            } else if (key == 'HDSpace') {
                forward_url = site_info[key] + 'index.php?page=upload';
            } else {
                forward_url = site_info[key] + 'upload.php';
            }
            jump_str = dictToString(raw_info);
            document.getElementById(key).href = forward_url + seperator + encodeURI(jump_str);
        }
    } else {
        if (raw_info.type == '剧集'){
            try{
                search_name = raw_info.name.split(/S\d{2}/i)[0];
                search_name = search_name.replace(/(19|20)\d{4}/ig, '').trim(); 
            } catch(err){
                search_name = raw_info.name.split(/(19|20)\d{2}/)[0];
            }
        } else {
            if (raw_info.name.match(/\d{4}/)){
                search_name = raw_info.name.split(/(19|20)\d{2}/)[0];
            } else {
                search_name = raw_info.name;
            }
        }

        if (raw_info.url){
            var url = raw_info.url.match(/tt\d+/)[0];
            for (key in site_info) {
                if (key == 'TTG') {
                    forward_url = site_info[key] + 'browse.php?search_field={name}&c=M'.format({'name': search_name});
                } else if (key == 'HDRoute') {
                    forward_url = site_info[key] + 'browse.php?s={name}&dp=0&add=0&action=s&or=1&imdb={url}'.format({'name': search_name, 'url': url});
                } else if (key == 'LemonHD' && (raw_info.type == '电影')) {
                    forward_url = site_info[key] + 'torrents_movie.php?search={url}&search_area=imdb&suggest=4'.format({'url': url});
                } else if (key == 'LemonHD' && (raw_info.type == '剧集' || raw_info.type == '综艺')) {
                    forward_url = site_info[key] + 'torrents_tv.php?search={url}&search_area=imdb&suggest=4'.format({'url': url});
                } else if (key == 'LemonHD' && (raw_info.type == '音乐')) {
                    forward_url = site_info[key] + 'torrents_music.php?search={url}&search_area=imdb&suggest=4'.format({'url': url});
                } else if (key == 'LemonHD' && (raw_info.type == '动漫')) {
                    forward_url = site_info[key] + 'torrents_animate.php?search={url}&search_area=imdb&suggest=4'.format({'url': url});
                } else if (key == 'LemonHD' && (raw_info.type == '纪录')) {
                    forward_url = site_info[key] + 'torrents_doc.php?search={url}&search_area=imdb&suggest=4'.format({'url': url});
                } else if (key == 'LemonHD') {
                    forward_url = site_info[key] + 'torrents_other.php?search={url}&search_area=imdb&suggest=4'.format({'url': url});
                } else if (key == 'HDPost') {
                    forward_url = site_info[key] + '/torrents?imdb={url}'.format({'url': url});
                } else {
                    forward_url = site_info[key] + 'torrents.php?incldead=0&spstate=0&inclbookmarked=0&search={url}&search_area=4&search_mode=0'.format({'url': url});
                }
                document.getElementById(key).href = forward_url;
            }
        } else {
            for (key in site_info) {
                if (key == 'TTG') {
                    forward_url = site_info[key] + 'browse.php?search_field={name}&c=M'.format({'name': search_name});
                } else if (key == 'HDRoute') {
                    forward_url = site_info[key] + 'browse.php?s={name}&dp=0&add=0&action=s&or=1&imdb='.format({'name': search_name});
                } else {
                    forward_url = site_info[key] + 'torrents.php?incldead=0&spstate=0&inclbookmarked=0&search={name}&search_area=0&search_mode=0'.format({'name': search_name});
                }
                document.getElementById(key).href = forward_url;
            }
        }
    }
}

function getDoc(url, meta, callback) {
    GM_xmlhttpRequest({
        method: 'GET',
        url: url,
        onload: function (responseDetail) {
            if (responseDetail.status === 200) {
                let doc = page_parser(responseDetail.responseText);
                callback(doc, responseDetail, meta);
            }
        }
    });
}

function page_parser(responseText) {
    responseText = responseText.replace(/s+src=/ig, ' data-src=');
    responseText = responseText.replace(/<script[^>]*?>[\S\s]*?<\/script>/ig, '');
    return (new DOMParser()).parseFromString(responseText, 'text/html');
}

function get_search_name(name) {
    search_name = name;
    if (name.match(/S\d{1,3}/i)){
        search_name = name.split(/S\d{1,3}/i)[0];
        search_name = search_name.replace(/(19|20)\d{2}/ig, '').trim(); 
    } else{
        if (name.match(/\d{4}/)){
            search_name = name.split(/(19|20)\d{2}/)[0];
        }
    }
    search_name = search_name.replace(/repack|Extended|cut/ig, '');
    return search_name;
}

function getJson(url, meta, callback) {
    GM_xmlhttpRequest({
        method: 'GET',
        url: url,
        onload: function (responseDetail) {
            if (responseDetail.status === 200) {
                let response = JSON.parse(responseDetail.responseText);
                callback(response, responseDetail, meta);
            }
        }
    });
}

if (site_url.match(/https:\/\/hdbits\.org\/browse.*/) && SHOW_HDB_SEARCH_URLS) {
    setTimeout(function(){
        $('#torrent-list').find('tr').each(function(){
            try{
                var imdbid = $(this).html().match(/https:\/\/www\.imdb\.com\/title\/(tt\d+)/i)[1];
                var imdbno = imdbid.substring(2);
                var name = $(this).find('td:eq(2)').find('a').first().text();

                var search_name = get_search_name(name)
                if (name.match(/S\d+/i)){
                    var number = parseInt(name.match(/S(\d+)/i)[1]);
                    search_name = search_name + ' Season ' + number;
                }
                var $container = $(this).find('td:eq(2)');
                add_search_urls($container, imdbid, imdbno, search_name, 1);
            } catch(err){}
        });
    }, 500);
}

if (site_url.match(/https:\/\/passthepopcorn\.me\/torrents\.php.*/i) && SHOW_PTP_SEARCH_URLS) {
    $(`tbody tr.basic-movie-list__details-row`).each(function(){
        try{
            var $container = $(this).find('td:eq(1)');
            var search_name = $container.find('span.basic-movie-list__movie__title-row:eq(0)').find('a').first().text();
            var imdbid = $(this).html().match(/http:\/\/www\.imdb\.com\/title\/(tt\d+)/i)[1];
            var imdbno = imdbid.substring(2);
            add_search_urls($container, imdbid, imdbno, search_name, 3);
        } catch(Err) {console.log(Err)}
    });
}

if (site_url.match(/https:\/\/uhdbits\.org\/torrents\.php.*/i) && SHOW_UHD_SEARCH_URLS) {
    $('#torrent_table td.big_info').each(function(){
        try {
            var $container = $(this).find('div:eq(0)');
            var search_name = $container.find('a').first().text();
            var imdbid = $(this).html().match(/http:\/\/www\.imdb\.com\/title\/(tt\d+)/i)[1];
            var imdbno = imdbid.substring(2);
            add_search_urls($container, imdbid, imdbno, search_name, 1);
        } catch(Err) {console.log(Err)}
    });
}

if (site_url.match(/https:\/\/hd-torrents\.org\/torrents.*/) && SHOW_HDT_SEARCH_URLS) {
    $('.mainblockcontenttt tr').each(function(){     
        var $td = $(this).find('td:eq(2)');
        var name = $td.find('a').first().text();
        if (name) {
            try{
                var imdbid = $td.html().match(/imdb\.com\/title\/(tt\d+)/i)[1];
                var imdbno = imdbid.substring(2);
                
                var search_name = get_search_name(name);
                if (name.match(/S\d+/i)){
                    var number = parseInt(name.match(/S(\d+)/i)[1]);
                    search_name = search_name + ' Season ' + number;
                }
                var $container = $td;
                add_search_urls($container, imdbid, imdbno, search_name, 1);
            } catch(err){}
        }
        
    });

    $('.hdblock:eq(1) tr').each(function(){     
        var $td = $(this).find('td:eq(1)');
        var name = $td.find('a').first().text();
        if (name) {
            try{
                var imdbid = $td.html().match(/imdb\.com\/title\/(tt\d+)/i)[1];
                var imdbno = imdbid.substring(2);
                
                var search_name = get_search_name(name);
                if (name.match(/S\d+/i)){
                    var number = parseInt(name.match(/S(\d+)/i)[1]);
                    search_name = search_name + ' Season ' + number;
                }
                var $container = $td;
                add_search_urls($container, imdbid, imdbno, search_name, 1);
            } catch(err){}
        }
        
    });
}

//添加豆瓣到ptgen跳转
if(site_url.match(/^https:\/\/movie.douban.com\/subject\/\d+/i)){
    $(document).ready(function () {
        var douban_button = document.createElement("input");
        douban_button.type = "button";
        douban_button.value = "跳转查询";
        douban_button.style.width = '80px';
        douban_button.style.height = '30px';
        douban_button.style.border = 'none';
        douban_button.id = 'douban_button';
        $('h1').append(douban_button);
        $('#douban_button').click(function(){
            url = 'https://www.bfdz.ink/tools/ptgen/?imdb=' + site_url.match(/subject\/(\d+)\//)[1];
            window.open(url, target = '_blank');
        });

        try { 
            if($('#info').html().match(/tt\d+/i)){
                var imdbid = $('#info').html().match(/tt\d+/i)[0];
                var imdbno = imdbid.substring(2);
                var search_name = $('h1').text().trim().match(/[a-z ]{2,200}/i)[0];
                search_name = search_name.replace(/season/i, '');
                var $container = $('h1');
                add_search_urls($container, imdbid, imdbno, search_name, 2);
            }
        } catch(err) {console.log(err)}
    });
    return;
}
//柠檬发布页根据name自动填写
if (site_url.match(/https:\/\/lemonhd.org\/upload_.{2,20}.php$/i)) {
    var td_rowhead = document.getElementsByClassName('rowhead');
    for (var i = td_rowhead.length - 1; i > 0; i--) {
        if (td_rowhead[i].textContent == '类型*') {
            var auto_fill = document.createElement('input');
            auto_fill.type = 'button';
            auto_fill.value = 'Auto_Fill';
            td_rowhead[i].nextSibling.append(auto_fill);

            auto_fill.addEventListener('click', function(){
                var name = document.getElementsByName('name')[0].value;
                var medium_sel = name.medium_sel();
                var codec_sel = name.codec_sel();
                var audiocodec_sel = name.audiocodec_sel();
                var standard_sel = name.standard_sel();

                var audiocodec_box = document.getElementsByName('audiocodec_sel')[0];
                var audiocodec_dict = {
                    'Flac': 7,
                    'APE': 7,
                    'AC3': 9,
                    'WAV': 8,
                    'Atmos': 1,
                    'AAC': 8,
                    'DTS-HDMA': 4,
                    'Atmos': 1,
                    'TrueHD': 2,
                    'DTS': 6,
                    'LPCM': 10,
                    'DTS-HDMA:X 7.1': 4,
                    'DTS-HDHR': 5,
                    'DTS-X': 3
                };
                if (audiocodec_sel == 'DTS-HD') {
                    if (name.match(/DTS-HD.?HR/i)) {
                        audiocodec_sel = 'DTS-HDHR'
                    } else {
                        audiocodec_sel = 'DTS-HDMA'
                    }
                }
                if (audiocodec_dict.hasOwnProperty(audiocodec_sel)) {
                    var index = audiocodec_dict[audiocodec_sel];
                    audiocodec_box.options[index].selected = true;
                }

                var medium_box = document.getElementsByName('medium_sel')[0];
                var medium_dict = { 'UHD': 1, 'Blu-ray': 2, 'Encode': 4, 'HDTV': 5, 'WEB-DL': 6, 'Remux': 3 };
                if (medium_dict.hasOwnProperty(medium_sel)) {
                    var index = medium_dict[medium_sel];
                    medium_box.options[index].selected = true;
                }
                if (name.match(/x264|x265/i)) {
                    medium_box.options[4].selected = true;
                }
                if (name.match(/WEB|WEB-DL/i)) {
                    medium_box.options[6].selected = true;
                }
                if (name.match(/remux/i)) {
                    medium_box.options[3].selected = true;
                }

                var codec_box = document.getElementsByName('codec_sel')[0];
                //alert(codec_box.innerHTML)
                var codec_dict = { 'H264': 1, 'X265': 5, 'X264': 6, 'H265': 2, 'VC-1': 3, 'MPEG-2': 4, 'MPEG-4': 1 };
                if (codec_dict.hasOwnProperty(codec_sel)) {
                    var index = codec_dict[codec_sel];
                    codec_box.options[index].selected = true;
                }
                if (name.match(/x264/i)) {
                    codec_box.options[6].selected = true;
                }

                var standard_box = document.getElementsByName('standard_sel')[0];
                var standard_dict = {'8K': 1, '4K': 2, '1080p': 3, '1080i': 3, '720p': 4, 'SD': 5, '': 5};
                if (standard_dict.hasOwnProperty(standard_sel)) {
                    var index = standard_dict[standard_sel];
                    standard_box.options[index].selected = true;
                }

                var descr = document.getElementsByName('descr')[0].value;
                if (descr != '') {
                    var source_sel = get_source_sel_from_descr(descr);
                    var team_box = document.getElementsByName('processing_sel')[0];
                    var team_dict = { '欧美': 3, '大陆': 1, '香港': 2, '台湾': 8, '日本': 4, '韩国': 4, '印度': 6, '其他': 6 };
                    if (team_dict.hasOwnProperty(source_sel)) {
                        var index = team_dict[source_sel];
                        team_box.options[index].selected = true;
                    }
                }
                

            }, false);
            break;
        }
    }
    return;
}

/*******************************************************************************************************************
*                                         part 3 页面逻辑处理（源网页）                                              *
********************************************************************************************************************/
var sleep_time = 0;
if (origin_site == "HDF"){
    sleep_time = 1000;
}

setTimeout(function(){
    if (judge_if_the_site_as_source() == 1) {
        raw_info.origin_site = origin_site;
        raw_info.origin_url = site_url.replace('/', '***');

        var title, small_descr,descr, tbody, frds_nfo;
        var cmct_mode = 1;
        var torrent_id = "";//gz架构站点种子id
        var douban_button_needed = false;

        var is_inserted = false;
        var opencd_mode = 0; //皇后有两种版面,默认新版面
        if (origin_site == 'OpenCD' && document.getElementById('kdescr')) {
            opencd_mode = 1;  //皇后老版面
        }

        //----------------------------------标题简介获取——国内站点-------------------------------------------
        if (judge_if_the_site_in_domestic(site_url) || opencd_mode) {
            if (origin_site == 'TTG' || origin_site == 'PuTao' || origin_site == 'HDArea' || origin_site == 'OpenCD') {
                title = document.getElementsByTagName("h1")[0];
            } else if (origin_site == 'HUDBT'){
                title = document.getElementById('page-title');
            } else if (origin_site == 'byr'){
                title = document.getElementById("share");
            } else {
                title = document.getElementById("top");
            }

            for (i = 0; i < title.childNodes.length; i++) {
                raw_info.name = raw_info.name + title.childNodes[i].textContent;
            }
            if (origin_site == 'byr') {
                raw_info.name = raw_info.name.replace(/\[|\]/ig, '-');
            }
            if (origin_site == 'TTG') {
                descr = document.getElementById("kt_d");
            }
            else {
                descr = document.getElementById("kdescr"); //kdescr
                if (!descr && origin_site == 'CMCT') {
                    descr = document.getElementById("kposter");
                    cmct_mode = 2;
                }
                if (origin_site == 'FRDS') {
                    frds_nfo = document.getElementById("knfo");
                }
            }

            if (origin_site == 'PThome') {
                try{
                    var mediainfo1 = document.getElementsByClassName("codemain")[0].getElementsByTagName('font')[0];
                    mediainfo1 = walkDOM(mediainfo1.cloneNode(true));
                    mediainfo1 = mediainfo1.replace(/(<div class="codemain">|<\/div>|\[.{1,20}\])/g, '');
                    mediainfo1 = mediainfo1.replace(/<br>/g, '\n');
                    raw_info.full_mediainfo=mediainfo1;
                    raw_info.descr = "";
                } catch(err){
                }
            }

            //获取最外层table
            tbody = descr.parentNode.parentNode.parentNode;
            descr = descr.cloneNode(true);

            try{
                var codemain = descr.getElementsByClassName('codemain');
                var codetop = descr.getElementsByClassName('codetop');
                if (codetop.length>0) {
                    descr.removeChild(codetop[0]);
                }
                if (codemain.length>0) {
                    codemain[0].innerHTML = '[quote]{mediainfo}[/quote]'.format({ 'mediainfo': codemain[0].innerHTML });
                }

                if (origin_site == 'PTer' && descr.getElementsByTagName('table')[0]){
                    var descr_table = descr.getElementsByTagName('table')[0];
                    if (descr_table.textContent.match(/general/i)){
                        descr.removeChild(descr_table);
                    }
                }
            }catch(err){
                console.log(err);
            }

            raw_info.descr = walkDOM(descr);

            if (origin_site == 'FRDS') {
                if (frds_nfo != null) {
                    raw_info.descr = raw_info.descr + "[quote]" + frds_nfo.textContent + "[/quote]";
                }
            }

            //ourbits没有简介的话补充简介
            if (origin_site == 'OurBits') {
                try{
                    var imdbnew2 = document.getElementsByClassName("imdbnew2")[0];
                    raw_info.url = match_link('imdb', imdbnew2.innerHTML);
                } catch(err){
                    console.log(err);
                }

                if (raw_info.descr.search(/主.*演/i) < 0 && raw_info.descr.search(/类.*别/i) < 0) {
                    try{
                        var doubanimg = document.getElementsByClassName("doubannew")[0];
                        doubanimg = doubanimg.getElementsByTagName("img")[0].src;
                        var douban = document.getElementsByClassName("doubaninfo")[0];
                        var douban_new = douban.cloneNode(true);
                        douban = domToString(douban_new);
                        douban = douban.replace(/<br>/g, '\n').replace('<div class="doubaninfo">', '').replace('</div>', '');
                        raw_info.descr = '[img]' + doubanimg + '[/img]\n' + douban + '\n\n' + raw_info.descr;
                    } catch(err){
                        if (raw_info.url) {
                            douban_button_needed = true;
                        }
                    }
                }
            }

            if (origin_site == 'HDChina'){
                if (raw_info.descr.search(/主.*演/i) < 0 && raw_info.descr.search(/类.*别/i) < 0){
                    var douban_content = document.getElementsByClassName('douban_content');
                    if (douban_content[0]){
                        raw_info.dburl = match_link('douban', douban_content[0].textContent);
                        if (raw_info.dburl){
                            douban_button_needed = true;
                        }
                    }
                }
            }
        }

        //------------------------------国外站点table获取(简介后续单独处理)-------------------------------------------
        var table, insert_row, douban_box;
        if (origin_site == 'HDT') {
            tbody = document.getElementById("TorrentsdetailsHideShowTR");
            tbody = tbody.getElementsByTagName('tbody')[0];
        }

        if (origin_site == 'PHD' || origin_site == 'avz') {
            tbody = document.getElementsByTagName("tbody")[0];
        }

        if (origin_site == 'PTP') {
            if (site_url.match(/torrentid=(\d+)/)) {
                torrent_id = site_url.match(/torrentid=(\d+)/)[1];
            }
            try {
                raw_info.url = document.getElementById("imdb-title-link").href;
            } catch (err) {}
            tbody = document.getElementById("torrent-table");
            var tr_matched = document.getElementById('group_torrent_header_' + torrent_id);

            if (tr_matched.innerHTML.match(/High quality torrent/)){
                raw_info.golden_torrent = true;   
            }
            try{
                var youtube_info = $('.youtube-player').attr('src');
                raw_info.youtube_url = youtube_info.match(/https:\/\/www.youtube.com\/embed\/([a-zA-Z0-9-]*)/)[1];
            } catch(err){}
            raw_info.ptp_poster = $('.sidebar-cover-image').parent().html();
            if (raw_info.ptp_poster.match(/https:\/\/ptpimg.me\/.*?.(jpg|png)/)){
                raw_info.ptp_poster = raw_info.ptp_poster.match(/https:\/\/ptpimg.me\/.*?.(jpg|png)/)[0];
            } else {
                raw_info.ptp_poster = '';
            }
        }

        if (origin_site == 'BTN') {
            tbody = document.getElementsByClassName('torrent_table')[0];
            raw_info.type = '剧集';
            if (site_url.match(/torrentid=(\d+)/)) {
                torrent_id = site_url.match(/torrentid=(\d+)/)[1];
            }
            setTimeout(()=>{
                var series_num = $('.thin').find('a').attr('href');
                getDoc('https://broadcasthe.net/' + series_num, null, function(doc){
                    var link_as = doc.getElementsByClassName('box')[1].getElementsByTagName('a');
                    for (i=0;i<link_as.length;i++){
                        if (link_as[i].href.match(/imdb.com/)){
                            raw_info.url = link_as[i].href;
                            try{
                                $('#input_box').val(raw_info.url);
                            } catch(err){console.log(err)}
                            break;
                        }

                    }
                });
            }, 2000);

            //获取name
            var torrent_tr = document.getElementById('torrent_' + torrent_id);
            raw_info.name = torrent_tr.previousElementSibling.getElementsByTagName('td')[0].textContent.replace('» ', '').trim();

            //获取简介
            var descr_box = torrent_tr.getElementsByTagName('blockquote');
            for (i=0; i<descr_box.length; i++){
                var tmp_descr = descr_box[i].textContent;
                if (tmp_descr.match(/Unique ID|DISC INFO:|.MPLS|General/i)){
                    descr_box = descr_box[i];
                    break;
                }
            }
            raw_info.descr =  '[quote]' + descr_box.textContent + '[/quote]\n\n';
            var imgs = descr_box.getElementsByTagName('img');
            var img_urls = '';
            for (i=0; i < imgs.length; i++) {
                if (imgs[i].parentNode.nodeName == 'A'){
                    img_urls += '[url='+ imgs[i].parentNode.href +'][img]' + imgs[i].src + '[/img][/url]';
                } else {
                    img_urls += '[img]' + imgs[i].src + '[/img]';
                }
            }
            raw_info.descr += img_urls;
        }

        if (origin_site == 'MTV') {
            if (site_url.match(/torrentid=(\d+)/)) {
                torrent_id = site_url.match(/torrentid=(\d+)/)[1];
            }
            var imdb_box = document.getElementsByClassName('box torrent_description')[0];
            raw_info.url = match_link('imdb', imdb_box.innerHTML);
            tbody = document.getElementById('torrent_details');
        }

        if (origin_site == 'BHD'){
            tbody = document.getElementsByClassName('table-details')[0].getElementsByTagName('tbody')[0];
            var imdb_box = document.getElementsByClassName('movie-details')[0];
            raw_info.url = match_link('imdb', imdb_box.innerHTML);
            var trailer_info = $('.movie-details').find('span').last().html();
            if (trailer_info.match(/https:\/\/www.youtube.com\/watch\?v=.*/)){
                raw_info.youtube_url = trailer_info.match(/https:\/\/www.youtube.com\/watch\?v=[a-zA-Z0-9-]*/)[0];
            }
        }

        if (origin_site == 'BLU') {
            var iii = document.getElementsByTagName('h4')[0].parentNode.parentNode;
            var div_box = iii.getElementsByClassName('table-responsive')[0];
            tbody = div_box.getElementsByTagName('table')[0];
            var imdb_box = document.getElementsByClassName('movie-details')[0];
            raw_info.url = match_link('imdb', imdb_box.parentNode.innerHTML);
        }

        if (origin_site == 'UHD') {
            uhd_lack_descr = true;
            if (site_url.match(/torrentid=(\d+)/)) {
                torrent_id = site_url.match(/torrentid=(\d+)/)[1];
            }
            var imdb_box = document.getElementsByClassName('imovie_title')[0];
            raw_info.url = match_link('imdb', imdb_box.innerHTML);
            tbody = document.getElementById('torrent_details');
            try{
                var youtube_info = $('.box_trailer').html();
                if (youtube_info.match(/www.youtube.com\/embed\/([a-zA-Z0-9-]*)/)){
                    raw_info.youtube_url = youtube_info.match(/www.youtube.com\/embed\/([a-zA-Z0-9-]*)/)[1];
                }
            } catch(err) {}
        }

        if (origin_site == 'HDF') {
            if (site_url.match(/torrentid=(\d+)/)) {
                torrent_id = site_url.match(/torrentid=(\d+)/)[1];
            }
            var imdb_box = document.getElementsByClassName('torrent_description')[0];
            raw_info.url = match_link('imdb', imdb_box.innerHTML);
            tbody = document.getElementById('torrent_details');
        }

        if (origin_site == 'HDB') {
            raw_info.url = match_link('imdb', document.getElementById('details').innerHTML);
            tbody = document.getElementById('details');
        }

        if (origin_site == 'RED'){
            if (site_url.match(/torrentid=(\d+)/)) {
                torrent_id = site_url.match(/torrentid=(\d+)/)[1];
            }
            raw_info.name = document.getElementsByTagName('h2')[0].textContent;
            raw_info.name = raw_info.name.replace(/\[|\]/g, '*');
            var cover_box = document.getElementById('cover_div_0');
            try{
                var cover = cover_box.getElementsByTagName('img')[0].getAttribute('onclick');
                cover = cover.match(/'(.*)'/)[1];
            } catch (err) {
                var cover = cover_box.getElementsByTagName('img')[0].getAttribute('src');
            }
            var mediainfo = document.getElementsByClassName('torrent_description')[0].getElementsByClassName('body')[0];
            raw_info.tracklist = mediainfo.textContent;
            raw_info.descr = '[img]' + cover + '[/img]\n\n';
            raw_info.type = '音乐';
            tbody = document.getElementById('torrent_details');
        }

        if (origin_site == 'jpop') {
            raw_info.name = document.getElementsByTagName('h2')[0].textContent.replace(/\[|\]/g, '');
            raw_info.name = raw_info.name.replace(/album|Single/i, '').trim();
            if (site_url.match(/torrentid=(\d+)/)) {
                torrent_id = site_url.match(/torrentid=(\d+)/)[1];
            }
            tbody = document.getElementsByClassName('torrent_table')[0];
            raw_info.type = '音乐';
            var cover_box = document.getElementsByClassName('box')[1];
            var cover = 'https://jpopsuki.eu/' + cover_box.getElementsByTagName('img')[0].getAttribute('src');
            var info_box = document.getElementsByClassName('body')[2];
            var info = info_box.textContent.trim();
            raw_info.descr = '[img]' + cover + '[/img]\n\n' + info;

            var tr_matched = document.getElementById('torrent_' + torrent_id);
            var table = tr_matched.getElementsByTagName('table')[0];
            var tds = table.getElementsByTagName('td');
            for (i=2; i < tds.length; i+=2) {
                if (tds[i].textContent.match(/\.flac/i)) {
                    raw_info.tracklist += tds[i].textContent + '\n';
                }
            }
            if (!raw_info.tracklist.trim()) {
                raw_info.tracklist = info;
            }

            var label_box = document.getElementsByClassName('box')[3];
            var label_info = label_box.getElementsByTagName('ul')[0].textContent;
            raw_info.source_sel = label_info.source_sel();
            if (!raw_info.source_sel) {
                raw_info.source_sel = '日韩';
            }
            raw_info.music_media = tr_matched.previousElementSibling.innerHTML;
        }

        if (origin_site == 'OpenCD' && !opencd_mode) {
            raw_info.name = document.getElementsByClassName('title')[0].textContent;
            raw_info.type = '音乐';

            var cover_box = document.getElementsByClassName('cover')[0];
            try{
                var cover = cover_box.getElementsByTagName('img')[0].getAttribute('onclick');
                cover = cover.match(/'(.*)'/)[1];
                cover = 'https://open.cd/' + cover;
            } catch (err) {
                var cover = cover_box.getElementsByTagName('img')[0].getAttribute('src');
            }

            var descr_box = document.getElementById('divdescr');
            raw_info.descr = '[img]' + cover + '[/img]\n\n' + descr_box.textContent;

            var tracklist_box = document.getElementById('divtracklist');
            raw_info.tracklist = tracklist_box.textContent;

            var nfo_box = document.getElementById('divnfo');
            raw_info.log_info = nfo_box.textContent;

            tbodys = document.getElementById('outer').getElementsByTagName('tbody');
            if (tbodys.length == 6){
                tbody = tbodys[2];
            } else {
                tbody = tbodys[1];
            }
        }

        if (origin_site == 'TorrentLeech') {
            var name = document.getElementById('torrentnameid');
            raw_info.name = name.textContent.replace(/freeleech/ig, '').trim();
            
            tbody = document.getElementsByClassName('table borderless')[0];

            var imdb_box = document.getElementsByClassName('torrent-main row mt-30')[0];
            if (imdb_box.innerHTML.match(/http(s*):\/\/www.imdb.com\/title\/tt(\d+)/i)){
                raw_info.url = imdb_box.innerHTML.match(/http(s*):\/\/www.imdb.com\/title\/tt(\d+)/i)[0];
            }
        }

        if (origin_site == 'hon3yhd') {
            var tables = document.getElementsByTagName('table');
            var table = tables[1];
            var divs = table.getElementsByTagName('div');

            for (var i = 0; i < divs.length; i++) {
                if (divs[i].getAttribute("class") == 'round') {
                    if (i < 5){
                        if (divs[i].innerHTML.match(/http(s*):\/\/www.imdb.com\/title\/tt(\d+)/i)){
                            raw_info.url = divs[i].innerHTML.match(/http(s*):\/\/www.imdb.com\/title\/tt(\d+)/i)[0];
                        }
                    } else if (i < 15){
                        tbody = divs[i].getElementsByTagName('tbody')[0];
                        var trs = tbody.getElementsByTagName('tr');
                        raw_info.name = trs[0].textContent;
                        if (raw_info.name.match(/\.-\./i)){
                            raw_info.name = raw_info.name.replace('.-.', '-');
                        }
                        raw_info.name = raw_info.name.replace(/{|}|\(|\)/g, '');
                    }
                }
            }
            raw_info.type = '电影';
        }

        if (origin_site == 'xthor') {
            try{raw_info.name = document.getElementsByTagName('h1')[0].textContent;}catch{
                raw_info.name = document.getElementsByTagName('h2')[0].textContent;
            }
            var download = document.getElementById('Download');
            var tbody = download.getElementsByTagName('tbody')[0];
            raw_info.url = match_link('imdb', download.innerHTML);

            if (download.innerHTML.match(/https:\/\/xthor.tk\/pic\/bannieres\/info_film.png/i)){
                raw_info.type = '电影';
            } else if (download.innerHTML.match(/https:\/\/xthor.tk\/pic\/bannieres\/info_serie.png/i)){
                raw_info.type = '剧集';
            }
            if (!raw_info.type && raw_info.name.match(/s\d+/i)) {
                raw_info.type = '剧集';
            } else {
                raw_info.type = '电影';
            }
            var div_index = document.getElementsByClassName('breadcrumb')[0];
            var div = document.createElement('div');
            var mytable = document.createElement('table');
            var mytbody = document.createElement('tbody');
            insert_row = mytable.insertRow(0);
            douban_box = mytable.insertRow(0);
            div.appendChild(mytable);
            div_index.parentNode.insertBefore(div, div_index);

            var nfo = document.getElementById('NFO');
            raw_info.descr = nfo.textContent;
            raw_info.descr = '[quote]\n' + raw_info.descr + '\n[/quote]';
        }

        if (origin_site == 'elite-tracker') {
            var tmp_name = document.getElementById('shadetabs').textContent;
            raw_info.name = tmp_name.split('/').pop().trim();

            if (tmp_name.match(/films/i)) {
                raw_info.type = '电影';
            } else if (tmp_name.match(/musiques/i)) {
                raw_info.type = '音乐';
            } else if (tmp_name.match(/SERIES/i)) {
                raw_info.type = '剧集';
            } else if (tmp_name.match(/DOCUMENTAIRES/i)) {
                raw_info.type = '纪录';
            }
            
            var tbody = document.getElementById('details').getElementsByTagName('tbody')[0];
            raw_info.url = match_link('imdb', document.getElementById('details').innerHTML);

            var insert_num = tbody.childElementCount - 1;

            insert_row = tbody.insertRow(insert_num);
            douban_box = tbody.insertRow(insert_num);

            var tid = site_url.match(/id=(\d+)/i)[1];
            var mediainfo_url = 'https://elite-tracker.net/downloadnfo.php?name=' + raw_info.name + '&tid=' + tid;

            setTimeout(() => {
                getDoc(mediainfo_url, null, function(doc){
                    var mediainfo = doc.getElementsByTagName('body')[0].textContent.trim();
                    raw_info.descr = '[quote]' + mediainfo + '[/quote]';
                });
            }, 2000);
        }

        if (origin_site == 'FileList') {
            raw_info.name = document.getElementsByTagName('h4')[0].textContent;

            var mydiv = document.getElementsByClassName('cblock-innercontent')[0];
            raw_info.url = match_link('imdb', mydiv.innerHTML);
            var filelist_tmdb = match_link('tmdb', mydiv.innerHTML);

            if(filelist_tmdb){
                var bbbs = document.getElementsByTagName('b');
                for(i=0; i<bbbs.length; i++) {
                    if(bbbs[i].textContent == 'Category') {
                        var info = bbbs[i].parentNode.textContent;
                        if (info.match(/Filme/)){
                            raw_info.type = '电影';
                        } else if(info.match(/Seriale HD/)){
                            raw_info.type = '剧集';
                        } else if (info.match(/Anime|Desene/)) {
                            raw_info.type = '动漫';
                        }
                    }
                }

                var div_index = document.getElementById('descr');
                var div = document.createElement('div');
                var mytable = document.createElement('table');
                var mytbody = document.createElement('tbody');
                insert_row = mytable.insertRow(0);
                douban_box = mytable.insertRow(0);
                div.appendChild(mytable);

                var hr = document.createElement('hr');
                hr.setAttribute('class', 'separator');
                hr.style.marginTop =  '15px';
                hr.style.marginBottom =  '15px';
                div.appendChild(hr);

                div_index.previousElementSibling.parentNode.insertBefore(div, div_index.previousElementSibling);
                tbody = mytbody;

                var imgs = div_index.getElementsByTagName('img');
                try{raw_info.youtube_url = mydiv.innerHTML.match(/www.youtube.com\/embed\/([a-zA-Z0-9-]*)/)[1];} catch(err) {raw_info.youtube_url='';}
            } else {
                var tds = document.getElementsByTagName('td');
                for(i=0; i<tds.length; i++) {
                    if(tds[i].textContent.trim() == 'Type') {
                        var info = tds[i+1].textContent;
                        if (info.match(/Filme/)){
                            raw_info.type = '电影';
                        } else if(info.match(/Seriale HD/)){
                            raw_info.type = '剧集';
                        } else if (info.match(/Anime|Desene/)) {
                            raw_info.type = '动漫';
                        }
                    }
                }

                var mytable = document.getElementsByClassName('cblock-innercontent')[0].getElementsByTagName('tbody')[0];
                insert_row = mytable.insertRow(1);
                douban_box = mytable.insertRow(1);
                tbody = mytable;

                var description = document.getElementsByTagName('center')[0];
                var imgs = description.getElementsByTagName('img');
            }
            
            var img_urls = '';
            for (i=0; i < imgs.length; i++) {
                if (imgs[i].parentNode.nodeName == 'A'){
                    raw_info.images.push(imgs[i].src);
                    img_urls += '[url='+ imgs[i].parentNode.href +'][img]' + imgs[i].src + '[/img][/url]';
                }
            }

            img_urls = img_urls.replace(/https:\/\/filelist.io\/redir.php\?/ig, '');

            var torrentid = site_url.match(/id=\d+/)[0];
            var mediainfo_url = 'https://filelist.io/mediainfo.php?' + torrentid;
            setTimeout(() => {
                getDoc(mediainfo_url, null, function(doc){
                    var mediainfo = doc.getElementById('maincolumn').getElementsByClassName('cblock-innercontent')[0];
                    descr = walkDOM(mediainfo.cloneNode(true));
                    raw_info.descr = '[quote]' + descr + '[/quote]\n\n' + img_urls;
                })
                
            }, 2000);
        }

        if (origin_site == 'Bdc') {
            var tmp_name = document.getElementById('shadetabs').textContent.trim();
            raw_info.name = tmp_name.split('/').pop().match(/[^-]*?(1080p|720p|2160p|4k).*-.*?$/i)[0];

            var torrent_details = document.getElementById('details');
            if (torrent_details.getElementsByTagName('table')[0].innerHTML.match(/TV/)) {
                raw_info.type = '剧集';
            } else {
                raw_info.type = '电影';
            }
            tbody = torrent_details.getElementsByTagName('table')[1];
            insert_row = tbody.insertRow(2);
            douban_box = tbody.insertRow(2);
            tbody.getElementsByTagName('td')[0].colSpan = "2";
            tbody.getElementsByTagName('td')[1].colSpan = "2";

            var table_2 = torrent_details.getElementsByTagName('table')[2];
            raw_info.url = match_link('imdb', table_2.innerHTML);

            var mediainfo = document.getElementsByClassName('codemain')[0];
            var picture_box = mediainfo.parentNode;
            var imgs = picture_box.getElementsByTagName('img');
            var img_urls = '';
            for (i=0; i < imgs.length; i++) {
                if (imgs[i].parentNode.parentNode.nodeName == 'A'){
                    img_urls += '[url='+ imgs[i].parentNode.parentNode.href +'][img]' + imgs[i].src + '[/img][/url]';
                }
            }

            raw_info.descr = "[quote]\n" + mediainfo.textContent.trim() + '\n[/quote]\n\n' + img_urls;
        }

        if (origin_site == 'CG') {
            tbody = document.getElementById('torrent_details').parentNode.getElementsByTagName('table')[0];
            raw_info.type = '电影';
        }

        if (origin_site == 'KG') {
            tbody = document.getElementsByClassName('main')[0].getElementsByTagName('table');
            for (i=0;i<tbody.length;i++){
                if (tbody[i].getElementsByTagName('td').length > 8) {
                    tbody = tbody[i];
                    break;
                }
            }
            insert_row = tbody.insertRow(1);
            douban_box = tbody.insertRow(1);
        }

        if (origin_site == 'iTS') {
            if (site_url.match(/id=(\d+)/)) {
                torrent_id = site_url.match(/id=(\d+)/)[1];
            }
            raw_info.name = document.getElementsByTagName('h1')[0].textContent;
            raw_info.url = match_link('imdb', document.getElementsByClassName('IMDBtable')[0].innerHTML);
            tbody = document.getElementsByClassName('IMDBtable')[0].parentNode.parentNode.parentNode;
            table = tbody.parentNode;
        }

        //-------------------------------------根据table获取其他信息——包含插入节点（混合）-------------------------------------------
        var tds = tbody.getElementsByTagName("td");
        if (origin_site == 'HUDBT'){
            tds = tbody.getElementsByTagName("dt");
        }

        //循环处理所有信息
        for (i = 0; i < tds.length; i++) {
            if (origin_site == 'PHD' || origin_site == 'avz') {
                if (i == 1 && tds[i].innerHTML.match(/Movie$/i)) {
                    raw_info.type = '电影';
                } else if (i == 1 && tds[i].innerHTML.match(/TV-Show$/i)) {
                    raw_info.type = '剧集';
                } else if (i == 3) {
                    raw_info.name = tds[i].innerHTML;
                }
                if (tds[i].textContent == 'Video Quality') {
                    raw_info.standard_sel = tds[i + 1].innerHTML.trim();
                } else if (tds[i].textContent == 'Description') {
                    raw_info.descr += walkDOM(tds[i + 1]);
                } else if (tds[i].textContent == 'Rip Type') {
                    var tmp_type = tds[i + 1].innerHTML.trim();
                    if (tmp_type.match(/BluRay Raw/i)){
                        raw_info.medium_sel = 'Blu-ray';
                    } else if (tmp_type.match(/BluRay/i)){
                        raw_info.medium_sel = 'Encode';
                    }
                } else if (tds[i].textContent == 'Filename') {
                    table = tds[i].parentNode.parentNode;
                    insert_row = table.insertRow(i / 2 + 1);
                    douban_box = table.insertRow(i / 2 + 1);
                }
            }

            if (origin_site == 'HDT') {
                if (tds[i].textContent.match(/Category:/i) && i>1) {
                    if(tds[i+1].textContent.match(/Movie/i)){
                        raw_info.type = '电影';
                    } else if (tds[i+1].textContent.match(/TV Show/i)) {
                        raw_info.type = '剧集';
                    }
                    if (tds[i+1].textContent.medium_sel()) {
                        raw_info.medium_sel = tds[i+1].textContent.medium_sel();
                    }
                }

                if (i < 5 && tds[i].textContent.match(/Torrent/)) {
                    raw_info.name = tds[i+1].textContent;
                }
                if (tds[i].innerHTML.match(/http(s*):\/\/www.imdb.com\/title\/tt(\d+)/i)) {
                    raw_info.url = tds[i].innerHTML.match(/http(s*):\/\/www.imdb.com\/title\/tt(\d+)/i)[0] + '/';
                }
            }

            if (origin_site == 'iTS'){
                if (tds[i].textContent == 'Info hash'){
                    insert_row = table.insertRow(i / 2 + 1);
                    douban_box = table.insertRow(i / 2 + 1);
                } else if (tds[i].textContent == 'Type') {
                    if(tds[i+1].textContent.match(/Movie/i)){
                        raw_info.type = '电影';
                    } else if (tds[i+1].textContent.match(/TV/i)) {
                        raw_info.type = '剧集';
                    }
                } else if (tds[i].textContent == 'Description') {    
                    descr = tds[i+1].cloneNode(true);
                    raw_info.descr = walkDOM(descr);
                    raw_info.descr = '[quote]\n' + raw_info.descr + '\n[/quote]';
                    raw_info.descr = raw_info.descr.replace(/\[img\]https:\/\/shadowthein.*?\.gif\[\/img\]/g, '');
                    raw_info.descr = raw_info.descr.replace(/This image.*?Click this bar to view the full image./g, '');
                    raw_info.descr = raw_info.descr.replace(/\[url=.*https:\/\/i.ibb.co\/KD855ZM\/IMDb-Logo-2016.png\[\/img\]\[\/url\].*?\[size=3\]/, '');
                    raw_info.descr = raw_info.descr.replace(/\[url=.*?www.rottentomatoes.com.*rt-logo.png\[\/img\]\[\/url\]/, '');
                    raw_info.descr = raw_info.descr.replace('[img]https://i.ibb.co/VWMtVnN/0fa9aceda3e5.png[/img]', '');
                    var img_urls = raw_info.descr.match(/(\[url=.*\])?\[img\].*?\[\/img\](\[\/url\])?/g);
                    if (img_urls){
                        img_urls = img_urls.join('\n');
                        img_urls = img_urls.replace(/https:\/\/shadowthein.net\/redir.php\?/g, '');
                    } else {
                        img_urls = '';
                    }

                    var mediainfo_url = 'https://shadowthein.net/mediainfo.php?id=' + torrent_id;
                    getDoc(mediainfo_url, null, function(doc){
                        var mediainfo = doc.getElementsByTagName('pre')[0];
                        descr = mediainfo.textContent;
                        raw_info.descr = '';
                        raw_info.descr = '[quote]' + descr + '[/quote]\n\n' + img_urls;
                    });
                }
            }

            if (['PTP', 'MTV', 'UHD', 'HDF', 'RED' , 'BTN', 'jpop'].indexOf(origin_site) > -1) {
                if (origin_site == 'PTP' || origin_site == 'UHD') {
                    raw_info.type = '电影';
                } else if (origin_site == 'BTN' || origin_site == 'MTV'){
                    raw_info.type = '剧集';
                }

                if (tds[i].innerHTML.match('torrent_' + torrent_id) || (['BTN','jpop'].indexOf(origin_site) >-1 && tds[i].parentNode.innerHTML.match('id=' + torrent_id))) {
                    table = tds[i].parentNode.parentNode;
                    if (origin_site == 'HDF' || origin_site == 'UHD') {
                        if(tds[i].parentNode.textContent.match(/s\d{1,3}/i)) {
                            raw_info.type = '剧集';
                        } else {
                            raw_info.type = '电影';
                        }
                    } else if (origin_site == 'RED') {
                        raw_info.small_descr = tds[i].getElementsByTagName('a')[3].textContent;
                        var tr = tds[i].parentNode;
                        while(true){
                            tr = tr.previousElementSibling;
                            var class_info = tr.getAttribute('class');
                            if (class_info.match(/release/) && !class_info.match(/torrentdetails/)) {
                                raw_info.music_media = tr.textContent.trim();
                                break;
                            }
                        }
                    }
                    if (!is_inserted) {
                        var child_nodes = table.childNodes;
                        var rowcount = 0;
                        for (k = 0; k < child_nodes.length; k++) {
                            if (child_nodes[k].nodeName == 'TR') {
                                rowcount = rowcount + 1;
                                if (child_nodes[k].id.match('torrent_' + torrent_id)) {
                                    break;
                                }
                            }
                        }
                        search_row = table.insertRow(rowcount - 1);
                        insert_row = table.insertRow(rowcount - 1);
                        is_inserted = true;
                    }
                }
            }

            if (origin_site == 'BHD' || origin_site == 'BLU'){

                if (tds[i].textContent.trim() == 'Name') {
                    raw_info.name = tds[i+1].textContent.replace(/ *\n.*/gm, '').trim();
                    table = tds[i].parentNode.parentNode;
                    insert_row = table.insertRow(i / 2 + 1);
                    douban_box = table.insertRow(i / 2 + 1);
                }
                if (tds[i].textContent.trim() == 'Category'){
                    if (tds[i+1].innerHTML.match(/Movie/i)) {
                        raw_info.type = '电影';
                    }
                    if (tds[i+1].innerHTML.match(/(TV-Show|TV)/i)) {
                        raw_info.type = '剧集';
                    }
                }
                if (tds[i].textContent == 'Type') {
                    //还有一些类型
                    var tmp_type = tds[i + 1].innerHTML.trim();
                    if (tmp_type.match(/BD 50/i)){
                        raw_info.medium_sel = 'Blu-ray';
                    } else if (tmp_type.match(/BD Remux/i)){
                        raw_info.medium_sel = 'Remux';
                    }
                }
            } else {
                if (tds[i].textContent.match(/Category/)){
                    if (origin_site == 'HDB') {
                        raw_info.type = tds[i].textContent.get_type();
                        raw_info.medium_sel = tds[i].textContent.medium_sel();
                    } else {
                        raw_info.type = tds[i+1].textContent.get_type();
                        raw_info.medium_sel = tds[i+1].textContent.medium_sel();
                    }
                }
            }

            if (origin_site == 'TorrentLeech') {
                if (tds[i].textContent.trim() == 'Added') {
                    table = tds[i].parentNode.parentNode;
                    insert_row = table.insertRow(i / 2 + 1);
                    douban_box = table.insertRow(i / 2 + 1);
                }
                if (tds[i].textContent.trim() == 'Category') {
                    if (tds[i+1].textContent.match(/(DVDRip|webrip|HDRIP|BLURAY|DVDR|4K)/i)) {
                        raw_info.type = '电影';
                    } else if (tds[i+1].textContent.match(/(Episodes)/i)) {
                        raw_info.type = '剧集';
                    } else if (tds[i+1].textContent.match(/documentaries/i)) {
                        raw_info.type = '纪录';
                    }
                }
                if (raw_info.name.match(/s\d+/i)){
                    raw_info.type = '剧集';
                }
            }

            if (origin_site == 'hon3yhd'){
                if (tds[i].textContent.trim() == 'Info hash') {
                    table = tds[i].parentNode.parentNode;
                    insert_row = table.insertRow(i / 2 + 1);
                    douban_box = table.insertRow(i / 2 + 1);
                }
                if (tds[i].textContent.trim() == 'Description'){
                    descr = tds[i+1].cloneNode(true);
                    raw_info.descr = walkDOM(descr);
                    raw_info.descr = raw_info.descr.replace(/\[url=.*?.gif\]\[img\].*?gif\[\/img\]\[\/url\]/g, '');
                    raw_info.descr = '[quote]\n' + raw_info.descr + '\n[/quote]';
                    raw_info.descr = raw_info.descr.replace(/\[url=[\s\S]*SAXZ7LOZ_o.png.*?\[\/url\]/, '').replace(/\n[\n\s]+/g, '\n\n');
                    raw_info.descr = raw_info.descr.replace(/\n[\n\r\t \s]+/g, '\n\n');

                    var img_infos = raw_info.descr.match(/(\[url=.*\])?\[img\].*?\[\/img\](\[\/url\])?/g);
                    if (img_infos){
                        img_infos = img_infos.join('\n');
                        raw_info.descr = raw_info.descr.replace(/(\[url=.*\])?\[img\].*?\[\/img\](\[\/url\])?/g, '');
                        raw_info.descr = raw_info.descr + '\n\n' + img_infos;
                    } else {
                        img_infos = '';
                    }

                    if (raw_info.name.match(/DRs$/i)){
                        raw_info.name = get_bluray_name_from_descr(raw_info.descr, raw_info.name);
                        raw_info.name = raw_info.name.replace(/\.•\./g, '.').replace(/.BD(50|25).*?DRs/g, '').replace(/â€¢./g, '');
                        raw_info.name = raw_info.name.replace('UNTOUCHED', 'DRs');
                    }
                }
            }

            if (origin_site == 'HDChina') {
                if (tds[i].innerHTML == '字幕') {
                    table = tds[i].parentNode.parentNode;
                    insert_row = table.insertRow(i / 2 + 1);
                    if (douban_button_needed){
                        douban_box = table.insertRow(i / 2 + 1);
                    }
                }
            }
            else if (origin_site == 'HUDBT'){
                if (!is_inserted){
                    if (['行为'].indexOf(tds[i].textContent) >-1 ) {
                        table = tds[i].parentNode;
                        var dd = document.createElement('dd');
                        table.insertBefore(dd, tds[i]);
                        var dt = document.createElement('dt');
                        dt.textContent = '转载';
                        table.insertBefore(dt, dd);
                        is_inserted = true;
                    }
                }
            } else {
                if (['行为', '小货车', '行為', '种子认领', '簡介', '操作', 'Action', 'Tagline', 'Tools:'].indexOf(tds[i].textContent.trim()) >-1 && origin_site != 'KG') {
                    if (!is_inserted){
                        if (origin_site != 'MTV') {
                            table = tds[i].parentNode.parentNode;
                            if (origin_site == 'TTG'){
                                insert_row = table.insertRow(i / 2 - 1);
                            } else if (origin_site == 'OpenCD'){
                                insert_row = table.insertRow(6);
                                douban_box = table.insertRow(6);
                            } else {
                                insert_row = table.insertRow(i / 2 + 1);
                            }
                        }
                        if (origin_site == 'HDT' || origin_site == 'CG') {
                            douban_box = table.insertRow(i / 2 + 1);
                        } else if (origin_site == 'OurBits' && douban_button_needed) {
                            douban_box = table.insertRow(i / 2 + 1);
                        }
                        is_inserted = true;
                    }
                }
            }

            if (['副标题','副標題','副标题', 'Small Description'].indexOf(tds[i].textContent) > -1) {
                if (origin_site == 'HUDBT') {
                    raw_info.small_descr = tds[i].nextSibling.textContent;
                } else {
                    if (origin_site != 'FileList') {
                        raw_info.small_descr = tds[i].parentNode.lastChild.textContent;
                    }   
                }
            }

            if (origin_site == 'CG') {
                if (tds[i].textContent == 'IMDB') {
                    raw_info.url = 'https://www.imdb.com/title/' + tds[i+1].textContent + '/'
                }
                if (tds[i].textContent == 'Description') {
                    var imgs = tds[i+1].getElementsByTagName('img');
                    var imgs_str = '';
                    for (kk=0; kk < imgs.length; kk++){
                        if (imgs[kk].src.match(/cinemageddon.net/)) {
                            var img_url = imgs[kk].src;
                            try{img_url = img_url.split('=')[1].replace(/%3A/g, ':').replace(/%2F/g, '/');}catch(err){}
                            imgs_str += '[img]' + img_url + '[/img]';
                        } else {
                            imgs_str += '[img]' + imgs[kk].src + '[/img]';
                        }
                        
                    }
                }
                if (tds[i].textContent == 'mediainfo') {
                    raw_info.name = tds[i+1].getElementsByTagName('a')[0].textContent;
                    var descr_box = tds[i+1].getElementsByTagName('div')[0].cloneNode(true);
                    raw_info.descr = walkDOM(descr_box);
                    raw_info.descr = '[quote]' + raw_info.descr + '[/quote]\n\n' + imgs_str; 
                }
            }

            if (origin_site == 'KG') {
                if (tds[i].textContent == 'Internet Link') {
                    raw_info.url = tds[i+1].textContent + '/';
                } else if (tds[i].textContent == 'Type') {
                    if (tds[i+1].textContent.match(/movie/i)) {
                        raw_info.type = '电影';
                    } else if (tds[i+1].textContent.match(/music/i)) {
                        raw_info.type = '音乐';
                    }
                } else if (tds[i].textContent == 'Description') {
                    var imgs = tds[i+1].getElementsByTagName('img');
                    var imgs_str = '';
                    for (kk=0; kk < imgs.length; kk++){
                        imgs_str += '[img]' + imgs[kk].src + '[/img]';
                    }
                } else if (tds[i].textContent == 'Rip Specs') {
                    try{
                        raw_info.name = tds[i+1].getElementsByTagName('a')[0].textContent;
                        raw_info.descr = tds[i+1].getElementsByClassName('mediainfo')[0].textContent;
                    } catch(err){
                        raw_info.name=document.getElementsByTagName('h1')[0].textContent.split('-').pop().trim();
                        raw_info.descr = tds[i+1].textContent;
                    }
                    raw_info.descr = '[quote]' + raw_info.descr + '[/quote]\n\n' + imgs_str; 
                }
            }

            //主要是类型、medium_sel、地区等等信息
            if (['基本信息', '类型', '基本資訊', '標籤列表：', '媒介：', 'Basic Info'].indexOf(tds[i].textContent) >-1) {
                if (i + 1 < tds.length) {
                    if (origin_site == 'HUDBT') {
                        info_text = tds[i].nextSibling.textContent;
                    } else {
                        info_text = tds[i + 1].textContent;
                    }
                    if(info_text.source_sel()){
                        raw_info.source_sel = info_text.source_sel();
                    }
                    if (tds[i].innerHTML == '標籤列表：') {
                        raw_info.music_type = tds[i+1].textContent;
                        raw_info.descr += '\n\n标签： ' + raw_info.music_type + '\n\n';
                    } else if (tds[i].innerHTML == '媒介：') {
                        raw_info.music_media = tds[i+1].textContent;
                    }

                    if (tds[i].innerHTML == '基本資訊' && opencd_mode) {
                        raw_info.music_type = tds[i+1].textContent;
                        raw_info.music_media = tds[i+1].textContent;
                    }
                    if (info_text.get_type()){
                        raw_info.type = info_text.get_type();
                    }
                    if (origin_site == 'TTG' && info_text == 'BluRay原盘'){
                        raw_info.type = '电影';
                    }
                    if(info_text.medium_sel()){
                        raw_info.medium_sel = info_text.medium_sel();
                    }
                    if (info_text.codec_sel()){
                        raw_info.codec_sel = info_text.codec_sel();
                    }
                    if (info_text.audiocodec_sel()){
                        raw_info.audiocodec_sel = info_text.audiocodec_sel();
                    }
                    if (origin_site != 'TTG'){
                        if (info_text.standard_sel()){
                            raw_info.standard_sel = info_text.standard_sel();
                        }
                    }
                }
            }

            if (tds[i].innerHTML == '详细信息' && origin_site == 'TJUPT') {
                if (tds[i+1].innerHTML.match(/英文名:(.*)/i)){
                    raw_info.name = tds[i+1].innerHTML.match(/英文名:<\/b>(.*?)<br>/i)[1];
                }
            }
        }

        //------------------------------------国外站点简介单独处理，最后辅以豆瓣按钮----------------------------------------------

        if (origin_site == 'PTP') {
            var torrent_box = document.getElementById("torrent_" + torrent_id);
            var torrent_div = torrent_box.getElementsByClassName("bbcode-table-guard");
            torrent_div = torrent_div[torrent_div.length-1];

            var tmp_tag_as = torrent_div.getElementsByTagName('a');
            var compare_picture = '';
            for (i=0; i< tmp_tag_as.length; i++){
                if (tmp_tag_as[i].getAttribute("onclick") == 'BBCode.MediaInfoToggleShow( this );'){
                    raw_info.name = tmp_tag_as[i].textContent.replace(/\[|\]|\(|\)|mkv$|mp4$/g, '').trim();
                }
                try {
                    if (tmp_tag_as[i].getAttribute("onclick").match(/BBCode.ScreenshotComparisonToggleShow/i)){
                        comparing_picture = tmp_tag_as[i].getAttribute("onclick");
                        info = comparing_picture.match(/\[.*?\]/ig);
                        if (info){
                            try {
                                tmp_string_0 = info[0].replace(/\[|\]|"/ig, '');
                                tmp_string_0 = tmp_string_0.replace(/,/ig, ' | ');
                                compare_picture += '\n' + tmp_string_0 + '\n';
                                team_count = tmp_string_0.split('|').length;
                                tmp_string_1 = info[1].replace(/\[|\]|"/ig, '');
                                pictures = tmp_string_1.split(',');
                                for (idd = 0; idd < pictures.length; idd++){
                                    if ((idd+1) % team_count == 0){
                                        compare_picture += '[img]' + pictures[idd].replace(/\\/g, '') + '[/img]\n';
                                    } else {
                                        compare_picture += '[img]' + pictures[idd].replace(/\\/g, '')+ '[/img]';
                                    }
                                }
                            } catch (err){
                            }
                        }
                    }
                } catch (err){
                }
            }

            if (!raw_info.name) {
                var file_box = document.getElementById('files_' + torrent_id);
                raw_info.name = file_box.getElementsByTagName('td')[0].textContent.replace(/\[|\]|\(|\)|mkv$|mp4$/g, '').trim();
            }
            var descr_box = torrent_box.getElementsByTagName('blockquote');
            for (i=0; i<descr_box.length; i++){
                var tmp_descr = descr_box[i].textContent;
                if (tmp_descr.match(/Unique ID|DISC INFO:|.MPLS|General/i)){
                    descr_box = descr_box[i];
                    break;
                }
            }
            raw_info.descr = '[quote]' + descr_box.textContent + '[/quote]\n\n';
            var img_urls = '';
            var imgs = torrent_div.getElementsByTagName('img');
            for (i=0; i< imgs.length; i++){
                img_urls += '[img]' + imgs[i].src + '[/img]\n';
            }

            raw_info.descr += img_urls;

            if (compare_picture){
                raw_info.descr += '[b]对比图[/b]\n' + compare_picture;
            }

            raw_info.name = raw_info.name.replace(/\s+-\s+/i, '-');
            //PTP原盘处理
            if(raw_info.descr.match(/.MPLS/i)) {
                var tmp_name = document.getElementsByTagName('h2')[0].textContent.split('[')[0].trim();
                var tmp_year = document.getElementsByTagName('h2')[0].textContent.match(/\[(\d+)\]/)[1];
                raw_info.name = get_bluray_name_from_descr(raw_info.descr, tmp_name+' '+tmp_year);

                var team = document.getElementById('group_torrent_header_' + torrent_id).getAttribute('data-releasegroup');
                if (team) {
                    raw_info.name = raw_info.name.replace('UNTOUCHED', team);
                }
            }
            else {
                raw_info.name  =  raw_info.name;
            }
        }

        if (origin_site == 'HDB') {
            var html = '<tr><td><table id="HDB"><tbody></tbody></table></td></tr>';
            $('#details').find('tr:eq(0)').after(html);
            table = document.getElementById('HDB');
            insert_row = table.insertRow(0);
            douban_box = table.insertRow(0);
            raw_info.name = document.getElementsByTagName('h1')[0].textContent.trim();

            var divs = document.getElementsByTagName('div');
            for (var i=0; i< divs.length; i++) {
                if (divs[i].textContent == 'Tags') {
                    var descr = divs[i].parentNode.parentNode.previousElementSibling;
                    if (descr.innerHTML.match(/Edit torrent/)){
                        descr = descr.previousElementSibling;
                    }
                    raw_info.descr = '[quote]' + walkDOM(descr.cloneNode(true)) + '[/quote]\n\n';
                    var imgs = raw_info.descr.match(/\[url=.*?\].*?\[\/img\]\[\/url\]/g);
                    if (imgs){
                        for (ii = 0; ii< imgs.length; ii++){
                            raw_info.descr = raw_info.descr.replace(imgs[ii], '');
                            if (!imgs[ii].match(/https:\/\/img\.hdbits\.org\//i)){
                                raw_info.descr += imgs[ii] + '\n';
                            } else {
                                var link = imgs[ii].match(/\[url=(.*)\]\[img/i)[1];
                                raw_info.images.push(link.replace('hdbits.org', 'hdbits.org/getimg'));
                            }
                        }
                    }
                    raw_info.descr = raw_info.descr.replace('Quote', '')
                    raw_info.descr = raw_info.descr.replace(/[\n ]*\[\/quote\]/gi, '[/quote]');

                    var mediainfo = descr.previousElementSibling;
                    if (mediainfo.textContent.match(/Technical Information/)){
                        var log_a = mediainfo.getElementsByTagName('a')[0];
                        var url = log_a.getAttribute('href');
                        if (url.match(/mediainfo/)){
                            getDoc(url, null, function(doc){
                                raw_info.descr = '[quote]' + doc + '[/quote]\n\n' + raw_info.descr;
                            });
                        }
                    }
                    break;
                }
            }
        }

        if (origin_site == 'RED') {
            var torrent_box = document.getElementById('torrent_' + torrent_id);
            var aaas = torrent_box.getElementsByTagName('a')[2];
            if (aaas.getAttribute('onclick').match(/show_logs/)){
                aaas.click();
                setTimeout(function(){
                    try {
                        var log_box = document.getElementById('logs_' + torrent_id);
                        raw_info.log_info = log_box.textContent;
                    } catch (err) {}
                }, 3000);
            }

            var append_info = torrent_box.getElementsByTagName('blockquote');
            append_info = append_info[append_info.length-1].textContent;
            if (!append_info.match(/Uploaded/)){
                raw_info.descr += append_info;
            }

            var tag_box = document.getElementsByClassName('nobullet');
            tag_box = tag_box[tag_box.length-1];
            var aaaas = tag_box.getElementsByTagName('a');

            raw_info.descr += '\n\n标签： ';

            for(i=0; i<aaaas.length; i++){
                if (aaaas[i].textContent.match(/[a-z]/i)){
                    if (i>0){
                        raw_info.descr += ' | ' + aaaas[i].textContent;
                    } else {
                        raw_info.descr += aaaas[i].textContent;
                    }
                }
            }
            raw_info.descr += '\n\n';
        }

        if (origin_site == 'HDF') {
            var file_box = document.getElementById('files_' + torrent_id);
            var filelist_path = file_box.getElementsByClassName('filelist_path')[0];
            if (filelist_path.innerHTML){
                raw_info.name = filelist_path.innerHTML.replace(/\//g, '').trim();
            } else {
                var h2 = document.getElementsByTagName('h2')[0];
                raw_info.name = h2.getElementsByTagName('span')[0].textContent;
            }

            var torrent_info_box = document.getElementById('torrent_' + torrent_id);
            var $content_box = $('#content');
            var $main_box = $content_box.find('div').filter('.thin').find('.main_column');
            var $torrent_table = $('#torrent_'+torrent_id).parent().parent();
            $main_box.prepend($torrent_table);
            $('.head').hide();
            $content_box.prepend($content_box.find('div').filter('.thin'));

            var torrent_info = torrent_info_box.getElementsByTagName('blockquote');
            for (i=0; i<torrent_info.length; i++) {
                if (torrent_info[i].textContent.match(/general|format|duration|bitrate/i)) {
                    raw_info.descr = '[quote]' + torrent_info[i].textContent + '[/quote]';
                    break;
                }
            }
        }

        if (origin_site == 'UHD') {
            var realese_box = document.getElementById('release_' + torrent_id);
            var mediainfo_url = realese_box.getElementsByTagName('a')[0].href;
            var compare_string = '';
            var img_urls = '';
            getDoc(mediainfo_url, null, function(doc){
                raw_info.descr = '[quote]' + data + '[/quote]\n\n' + raw_info.descr;
            });
            setTimeout(function(){
                var torrent_tr = document.getElementById('torrent_' + torrent_id);
                var description_box = document.getElementById('files_' + torrent_id);
                raw_info.name = description_box.getElementsByTagName('tr')[1].getElementsByTagName('td')[0].textContent;
                raw_info.name = raw_info.name.replace(/(\.mkv$|\.mp4)/, '');
                if (raw_info.name.match(/S\d+/i)){
                    raw_info.type = '剧集';
                }
                try{
                    raw_info.name = description_box.getElementsByTagName('tr')[0].textContent.match(/\/(.*)\//)[1];
                } catch(err) {}

                if(raw_info.descr.match(/.MPLS/i)) {
                    var tmp_name = document.getElementsByClassName('imovie_title')[0].textContent.replace(/\(|\)/g, '').trim();
                    raw_info.name = get_bluray_name_from_descr(raw_info.descr, tmp_name);
                }

                raw_info.name = deal_with_title(raw_info.name);

                while (true){
                    description_box = description_box.nextSibling;
                    if (description_box.nodeName == 'DIV'){
                        break;
                    }
                }
                var spans = description_box.getElementsByTagName('span');
                compare_count = 0;
                for (i = 0; i < spans.length; i++){
                    if (spans[i].style.color) {
                        color = rgb_2_hex(spans[i].style.color);
                        compare_string += '|' + '[color=' + color + ']' + spans[i].textContent + '[/color]';
                        compare_count += 1;
                    }
                }
                if (compare_string) {
                    compare_string += '|';
                }
                var imgs = description_box.getElementsByTagName('img');
                img_count = 0;
                for (i=0; i < imgs.length; i++) {
                    if (imgs[i].parentNode.nodeName == 'A'){
                        if (compare_count){
                            img_count += 1;
                            if ((img_count) % compare_count == 0 && i != 1){
                                img_urls += '[url='+ imgs[i].parentNode.href +'][img]' + imgs[i].src + '[/img][/url]\n';
                            } else {
                                img_urls += '[url='+ imgs[i].parentNode.href +'][img]' + imgs[i].src + '[/img][/url]';
                            }
                        }
                        else {
                            img_urls += '[url='+ imgs[i].parentNode.href +'][img]' + imgs[i].src + '[/img][/url]';
                        }
                    } else {
                        img_urls += '[img]' + imgs[i].src + '[/img]\n';
                    }
                }
                img_urls = img_urls.replace(/http:\/\/anonym.to\/\?/ig, '');
                raw_info.descr += img_urls;

                set_jump_href(raw_info, 1);

            }, 2000);
        }

        if (origin_site == 'PHD' || origin_site == 'avz') {

            var mediainfo = document.getElementById('collapseMediaInfo').innerHTML;
            mediainfo = mediainfo.replace('<pre>', '');
            mediainfo = mediainfo.replace('</pre>', '');

            var picture_info = document.getElementById('collapseScreens');
            var imgs = picture_info.getElementsByTagName('img');
            var img_urls = '';
            for (i = 0; i < imgs.length; i++) {
                raw_info.images.push(imgs[i].parentNode.href);
                img_urls += '[url='+ imgs[i].parentNode.href +'][img]' + imgs[i].src + '[/img][/url]\n';
            }
            picture_info = img_urls;

            raw_info.descr = '[quote]' + mediainfo + '[/quote]\n\n' + picture_info;
            var movie_detail = document.getElementsByClassName('movie-details')[0];
            var movie_as = movie_detail.getElementsByTagName('a');
            for (i = 0; i < movie_as.length; i++) {
                if (movie_as[i].href.match(/www.imdb.com/i)) {
                    raw_info.url = 'http://www.imdb.com/title/' + movie_as[i].innerHTML;
                    break;
                }
            }
        }

        if (origin_site == 'HDT'){
            var descr = document.getElementById('technicalInfoHideShowTR');
            descr = descr.cloneNode(true);
            descr = walkDOM(descr);

            var reg_img = descr.match(/\[url=.*?]\[img\].*?\[\/img\]/i);
            if (reg_img) {
                var replace_str = '[/quote]\n\n' + reg_img[0];
                raw_info.descr = '[quote]{descr}\n\n'.format({'descr': descr.replace(reg_img, replace_str)});
            }
            else{
                raw_info.descr = '[quote]{descr}\n[/quote]\n\n'.format({'descr': raw_info.descr});
            }
            raw_info.descr = raw_info.descr.replace("Torrent:", "");
            raw_info.descr = raw_info.descr.replace("Quote:", "");
            raw_info.descr = raw_info.descr.replace(/\[img\]https:\/\/hd-torrents\.org\/images\/.*\/.*.gif\[\/img\]|-\(SCREENSHOTS\)-/g, '');
            raw_info.descr = raw_info.descr.replace('[img]https://hdts.ru/avatars/kralimarko.png[/img]', '');
            raw_info.descr = raw_info.descr.replace(/\[font=consolas\].*KRaLiMaRKo wishes you lots of fun! Don't forget to keep seeding[\s\S]*$/, '');
            raw_info.descr = raw_info.descr.replace(/[\n ]*\[\/quote\]/gi, '[/quote]');


            var quotes = '';
            var mediainfo = '';
            quotes = raw_info.descr.match(/\[quote[\s\S]*?\[\/quote\]/g);
            mediainfo = quotes[quotes.length-1];
            raw_info.mediainfo_cmct = mediainfo;
            raw_info.mediainfo_cmct = mediainfo.replace(/\[.?quote.*?\]/ig, '');
            var imgs = '';
            imgs = raw_info.descr.match(/\[url=.*?\] *\[img\].*?\[\/img\] *\[\/url\]/g);
            var imginfo = '';

            //从0开始，海报不在上述匹配模式里
            for (i = 0; i < imgs.length; i++) {
                if (!imgs[i].match(/(kralimarko)/i)) {
                    imginfo += imgs[i] + '\n';
                }
            }
            raw_info.imgs_cmct = imginfo;
        }

        if (origin_site == 'MTV'){
            var file_box = document.getElementById('files_' + torrent_id);
            var filelist_path = file_box.getElementsByClassName('filelist_path')[0];
            if (filelist_path.innerHTML){
                raw_info.name = filelist_path.innerHTML.replace(/\//g, '').trim();
            } else {
                var h2 = document.getElementsByTagName('h2')[0];
                raw_info.name = h2.getElementsByTagName('span')[0].textContent;
            }
            var torrent_info_box = document.getElementById('torrent_' + torrent_id);
            var torrent_info = torrent_info_box.getElementsByClassName('hidden spoiler');
            var img_info = '';
            var text_info = '';
            for (i=0; i< torrent_info.length; i++){
                text_info = torrent_info[i].previousElementSibling.previousElementSibling;
                if (text_info.textContent == 'Screenshots'){
                    img_info = walkDOM(torrent_info[i]);
                    img_info = img_info.replace('[url=javascript:void(0);]Show[/url]', '');
                }
                if (torrent_info[i].previousElementSibling.textContent == '[url=javascript:void(0);]Show[/url]'){
                    torrent_info[i].previousElementSibling.textContent = 'Show';
                }
            }
            raw_info.descr = img_info;
        }

        if (origin_site == 'BHD'){

            var mediainfo_box = document.getElementById('stats-full');
            var code_box = mediainfo_box.getElementsByTagName('code')[0];
            var mediainfo = code_box.textContent.trim();

            var picture_info = document.getElementsByClassName('decoda-image');
            var img_urls = '';
            for (i = 0; i < picture_info.length; i++){
                img_urls += '[url='+ picture_info[i].parentNode.href +'][img]' + picture_info[i].src + '[/img][/url] ';
            }
            picture_info = img_urls;
            raw_info.mediainfo_cmct = mediainfo;
            raw_info.imgs_cmct = img_urls;
            raw_info.descr = '[quote]' + mediainfo + '[/quote]\n\n' + picture_info;
            raw_info.descr = raw_info.descr.replace('[url=undefined][img]https://beyondhd.co/images/2017/11/30/c5802892418ee2046efba17166f0cad9.png[/img][/url]', '');
        }

        if (origin_site == 'BLU') {

            var mediainfo_lack = false;
            try {
                var mediainfo_box = document.getElementsByClassName('slidingDiv')[0];
                var code_box = mediainfo_box.getElementsByTagName('code')[0];
                var mediainfo = code_box.textContent.trim();
            } catch (err) {
                console.log('no mediainfo');
                mediainfo_lack = true;
            }
            var picture_boxes = document.getElementsByClassName('panel panel-chat shoutbox');
            var picture_info = document.getElementsByClassName('panel panel-chat shoutbox')[1]; //默认是1
            for (i=0; i<picture_boxes.length; i++) {
                var tmp_str = picture_boxes[i].getElementsByTagName('h4')[0].textContent;
                if (tmp_str.trim().match('Description')) {
                    picture_info = picture_boxes[i];
                    break;
                }
            }
            //候补方式获取mediainfo
            if (mediainfo_lack) {
                var tmp_box = picture_info.getElementsByTagName('table')[0].cloneNode(true);
                mediainfo = walkDOM(tmp_box);
                mediainfo = mediainfo.slice(0, mediainfo.search(/\[url=/i));
                mediainfo = mediainfo.replace('[img]https://blutopia.xyz/img/joypixels/24c2.png[/img]', ':m:');
                mediainfo = mediainfo.trim();
            }

            picture_info = picture_info.getElementsByTagName('img');
            var img_urls = '';
            for (i = 0; i < picture_info.length; i++){
                if (picture_info[i].parentNode.href){
                    img_urls += '[url='+ picture_info[i].parentNode.href +'][img]' + picture_info[i].src + '[/img][/url] ';
                }
            }
            picture_info = img_urls;
            raw_info.mediainfo_cmct = mediainfo;
            raw_info.imgs_cmct = img_urls;
            raw_info.descr = '[quote]' + mediainfo + '[/quote]\n\n' + picture_info;
        }

        if (origin_site == 'TorrentLeech') {
            var mediainfo_box = document.getElementById('nfo_text');
            var tmp_box = mediainfo_box.cloneNode(true);
            var mediainfo = walkDOM(tmp_box);

            var picture_info = document.getElementsByClassName('galleryContents text-center mt-30')[0];
            picture_info = picture_info.getElementsByTagName('img');
            var img_urls = '';
            try{
                for (i = 0; i < picture_info.length; i++){
                    img_urls += '[url='+ picture_info[i].parentNode.href +'][img]' + picture_info[i].src + '[/img][/url]\n';
                }
            } catch(err) {}
            picture_info = img_urls;
            raw_info.mediainfo_cmct = mediainfo;
            raw_info.imgs_cmct = img_urls;
            raw_info.descr = '[quote]' + mediainfo + '[/quote]\n\n' + picture_info;
            raw_info.descr = raw_info.descr.replace(/\[img\]https:\/\/i\.ibb\.co.*\.png\[\/img\]/gi, "");
            raw_info.descr = raw_info.descr.replace(/\[img\]https:\/\/i\.imgur\.com.*\.png\[\/img\]/gi, "");
            raw_info.descr = raw_info.descr.replace(/\[img\]https:\/\/i\.imgur\.com.*\.jpg\[\/img\]/gi, "");

            img_urls = raw_info.descr.match(/(\[url=.*?\])?\[img\].*?\[\/img\](\[\/url\])?/ig);
            var img_info = '';
            try{
                for (i=0; i<img_urls.length; i++){
                    if (raw_info.descr.indexOf(img_urls[i])<10){
                    } else{
                        raw_info.descr = raw_info.descr.replace(img_urls[i], '');
                        try{img_info += img_urls[i].match(/(\[url=.*?\])?\[img\].*\[\/img\](\[\/url\])?/)[0];}catch(err){}
                    }
                }
            } catch (err) {}
            img_info = img_info.replace(/(\[url=.*?\])?\[img\]https:\/\/funkyimg.com\/i\/38aAB\.png\[\/img\](\[\/url\])?/, '');
            raw_info.descr = raw_info.descr + '\n\n' + img_info;
            raw_info.descr = raw_info.descr.replace(/\[color=.*?\]|\[\/color\]/ig, '');
            raw_info.descr = raw_info.descr.replace(/\n\n+/ig, '\n\n');
        }

        //----------------------------------------------对国内站点获取的信息进行一些修复-------------------------------------------------------

        if (origin_site == 'TTG') {
            raw_info.small_descr = raw_info.name.split('[')[1].replace(']', '');
            raw_info.small_descr = raw_info.small_descr.replace('「', '');
            raw_info.small_descr = raw_info.small_descr.replace('」', '');
            raw_info.name = raw_info.name.split('[')[0];
        }

        if (origin_site == 'FRDS') {
            var temp = ""; //主副标题互换
            temp = raw_info.name;
            raw_info.name = raw_info.small_descr;
            raw_info.small_descr = temp;
            raw_info.small_descr = raw_info.small_descr.replace(/免费|50%/g, "");
            raw_info.small_descr = raw_info.small_descr.trim(); //去除首尾空格
            raw_info.medium_sel = 'Encode';
        }

        if (origin_site == 'HDHome') {
            raw_info.small_descr = raw_info.small_descr.replace(/【|】/g, " ");
            raw_info.small_descr = raw_info.small_descr.replace(/diy/i, "【DIY】");

            //DIY图文换序兼顾圆盘补quote
            var img_info = '';
            if (raw_info.name.match(/DIY/i)){
                var img_urls = raw_info.descr.match(/(\[url=.*?\])?\[img\].*?\[\/img\](\[\/url\])?/ig);
                for (i=0; i<img_urls.length; i++){
                    if (raw_info.descr.indexOf(img_urls[i])<10){
                    } else{
                        raw_info.descr = raw_info.descr.replace(img_urls[i], '');
                        img_info += img_urls[i].match(/\[img\].*?\[\/img\]/)[0];
                    }
                }
            }

            raw_info.descr = raw_info.descr.replace(/\n{3,10}/g, '\n\n');

            //圆盘补quote
            var tem_str = "";
            if (raw_info.descr.match(/DISC INFO/i)) {
                tem_str = raw_info.descr.slice(raw_info.descr.indexOf('DISC INFO') - 10, raw_info.descr.length);
                if (!tem_str.match(/quote/i)) {
                    raw_info.descr = raw_info.descr.replace("DISC INFO", "[img]https://images2.imgbox.com/04/6b/Ggp5ReQb_o.png[/img]\n\n[quote]\rDISC INFO");
                    raw_info.descr = raw_info.descr + "\r" + "[/quote]";
                }
            }
            raw_info.descr = raw_info.descr + '\n\n' + img_info;
        }

        if (origin_site == 'PTer'){
            raw_info.descr = raw_info.descr.replace(/https:\/\/pterclub.com\/link.php\?sign=.*?&target=/ig, '');
        }

        if (origin_site == 'MTeam'){
            raw_info.descr = raw_info.descr.replace(/https:\/\/kp.m-team.cc.*?url=/ig, '');
        }

        if (origin_site == 'byr') {
            raw_info.descr = raw_info.descr.replace(/\n+\t+\n/ig, '\n').replace('Powered by BYRBT Info Clone', '');
            raw_info.descr = raw_info.descr.replace(/\t+/ig, '');
            raw_info.descr = raw_info.descr.replace(/\t\n/ig, '');
            raw_info.descr = raw_info.descr.replace(/\n\n\t/ig, '\n\t');
            raw_info.descr = raw_info.descr.replace(/\n\n+/ig, '\n\n');
            if (raw_info.type == '动漫'){
                raw_info.animate_info = document.getElementById("share").textContent;
            }
        }

        if (origin_site == 'U2'){
            raw_info.descr = raw_info.descr.replace('我就是手贱我真是手贱', '');
            raw_info.animate_info = raw_info.name;
            raw_info.name = raw_info.name.replace(/\[|\]/g, ' ').replace(/ +/g, ' ');
            raw_info.type = '动漫';
            try{raw_info.anidb = raw_info.descr.match(/https:\/\/anidb\.net\/a\d+/i)[0];}catch(err){}
            if (!raw_info.anidb){
                try{raw_info.anidb = document.getElementById('kanidb').parentNode.innerHTML.match(/https:\/\/anidb\.net\/a\d+/i)[0];}catch(err){}
            }
            raw_info.anidb = raw_info.anidb.replace('anidb.net/a', 'anidb.net/anime/');
            try{raw_info.url = raw_info.descr.match(/https:\/\/www\.imdb\.com\/title\/tt\d+/i)[0];}catch(err){}
        }

        if (origin_site == 'HDChina') {
            raw_info.small_descr = document.getElementsByTagName("h3")[0].textContent;
            var movie_info = $('.info_box ul').eq(2).html();
            raw_info.type = movie_info.get_type();
            raw_info.medium_sel = movie_info.medium_sel();
            raw_info.codec_sel = movie_info.codec_sel();
            raw_info.audiocodec_sel = movie_info.audiocodec_sel();
            raw_info.standard_sel = movie_info.standard_sel();
            raw_info.descr = raw_info.descr.replace(/\[size=3\]\[color=green\]\[font=Microsoft YaHei\][\s\S]*$/i, '');
        }

        if (origin_site  == 'LemonHD'){
            raw_info.descr = raw_info.descr.slice(0, raw_info.descr.search(/\[color=green\]\[size=3\]本站提供的所有影视作品/));
            if (raw_info.type == '动漫'){
                raw_info.animate_info = raw_info.name;
                raw_info.name = raw_info.name.split('    ')[0].replace(/\[|\]/g, ' ').replace(/\(.*\)/, '').replace(/ +/g, ' ');
            }
        }

        if (origin_site  == 'HDArea'){
            raw_info.descr = raw_info.descr.slice(0, raw_info.descr.search(/\[quote\]\[color=red\]\[size=2\]\[font=Tahoma\] 本站列出的文件并没有保存在本站的服务器上/));
        }

        if (origin_site == 'CMCT' || origin_site == 'NanYang' || origin_site == 'CHDBits') {
            raw_info.name = raw_info.name.replace(/\d\.\d\/10.*$/g, '');
        }

        if (raw_info.type == '动漫') {
            if (['MTeam', 'PTer', 'PThome', 'HDHome', 'HDDolby'].indexOf(origin_site) > -1) {
                var bookmark = document.getElementById('bookmark0');
                while (bookmark.previousElementSibling) {
                    bookmark = bookmark.previousElementSibling;
                    if (bookmark.nodeName == 'A') {
                        raw_info.torrent_name = bookmark.textContent.replace('.torrent', '');
                        break;
                    }
                }
            }
        }

        raw_info.name = deal_with_title(raw_info.name);
        raw_info.small_descr = deal_with_subtitle(raw_info.small_descr);
        
        //判断官种表达感谢
        if (reg_team_name.hasOwnProperty(origin_site) && raw_info.name.match(reg_team_name[origin_site])){
            raw_info.descr = thanks_str.format({'site': origin_site, 'descr': raw_info.descr});
        }
        //获取跳转的字符串
        var jump_str = dictToString(raw_info);

    /*****************************************************************************************************************
    *                                       part 4 源网页转发跳转及功能部署                                             *
    ******************************************************************************************************************/
        var forward_l, forward_r;
        if (['PTP', 'MTV', 'UHD', 'HDF', 'RED', 'BTN', 'jpop'].indexOf(origin_site) > -1) {
            forward_r = insert_row.insertCell(0);
            forward_r.colSpan="5";
            forward_r.style.paddingLeft = '12px'; forward_r.style.paddingTop = '10px';
            forward_r.style.paddingBottom = '10px';
            forward_l = search_row.insertCell(0);
            forward_l.colSpan="5";
            if (origin_site != 'RED' && origin_site != 'jpop') {
                init_buttons_for_transfer(forward_l, origin_site, 1, raw_info);
            }
        } else if (origin_site == 'HUDBT') {
            forward_r = dd;
        } else {
            forward_l = insert_row.insertCell(0);
            forward_r = insert_row.insertCell(1);
            if (origin_site == 'xthor' || origin_site == 'FileList' || origin_site == 'HDB' || origin_site == 'Bdc') {
                if (origin_site == 'Bdc') {
                    forward_l.style.width = '60px'; forward_r.style.paddingTop = '8px';
                    forward_r.style.paddingBottom = '8px'; forward_r.style.paddingLeft = '8px';
                } else {
                    forward_l.style.width = '80px'; forward_r.style.paddingTop = '10px';
                    forward_r.style.paddingBottom = '10px'; forward_r.style.paddingLeft = '12px';
                    if (origin_site == 'HDB'){
                        forward_l.style.paddingRight = '12px'; forward_r.style.paddingBottom = '12px';
                        forward_r.style.borderTop = 'none'; forward_r.style.borderBottom = 'none';
                        forward_r.style.borderRight = 'none'; forward_l.style.border = 'none';
                    }
                }
            } else if (origin_site == 'OpenCD') {
                forward_r.colSpan="4";
            }

            forward_l.innerHTML = "转发种子"; forward_l.valign = "top"; forward_l.style.fontWeight = "bold";

            if ((!judge_if_the_site_in_domestic() && origin_site != 'OpenCD' && origin_site != 'RED') || douban_button_needed) {
                var direct;
                if (origin_site == 'PHD' || origin_site == 'avz' || origin_site == 'BLU' || origin_site == 'TorrentLeech' || origin_site == 'BHD') {
                    direct = "left";
                } else {
                    direct = "right";
                }
                forward_l.align = direct;
                var box_left = douban_box.insertCell(0);
                var box_right = douban_box.insertCell(1);
                if (origin_site == 'FileList' || origin_site == 'xthor' || origin_site == 'HDB') {
                    box_right.style.paddingLeft = '12px';
                    if (origin_site == 'HDB'){
                        box_left.style.paddingRight = '12px'; box_left.style.paddingTop = '12px';
                        box_left.style.paddingBottom = '12px';
                        box_right.style.borderTop = 'none'; box_right.style.borderBottom = 'none';
                        box_right.style.borderRight = 'none'; box_left.style.border = 'none';
                    }
                }
                box_left.innerHTML = '豆瓣信息';
                box_left.align = direct;
                box_left.style.fontWeight = "bold";
                box_right.id = 'box_right';
                init_buttons_for_transfer(box_right, origin_site, 0, raw_info);
            }
            else {
                forward_l.align = "right";
            }
        }

        forward_r.innerHTML = ""; forward_r.valign = "top"; forward_r.align = "left";
        //样式美化
        if (origin_site == 'CMCT' || origin_site == 'OurBits' || origin_site == 'TJUPT') {
            if (origin_site == 'TJUPT'){
                forward_r.style.border = "2px solid #FFFFFF";
            } else {
                forward_l.style.border = "1px solid #D0D0D0";
                forward_r.style.border = "1px solid #D0D0D0";
            }
            if (douban_button_needed){
                box_left.style.border = "1px solid #D0D0D0";
                box_right.style.border = "1px solid #D0D0D0";
            }
        }

        if (origin_site == 'HDT') {
            forward_l.setAttribute('class', 'detailsleft');
            forward_r.setAttribute('class', 'detailsright');
            box_left.setAttribute('class', 'detailsleft');
            box_right.setAttribute('class', 'detailsright');
        } else if (origin_site == 'BHD') {
            forward_l.parentNode.setAttribute('class', 'dotborder');
            box_left.parentNode.setAttribute('class', 'dotborder');
        } else if (origin_site == 'iTS') {
            forward_l.setAttribute('class', 'row2');
            forward_r.setAttribute('class', 'row1');
            box_left.setAttribute('class', 'row2');
            box_right.setAttribute('class', 'row1');
        }

        if (origin_site == 'FileList') {
            tds = mytable.getElementsByTagName('td');
            for(i=0; i<tds.length; i++){
                tds[i].style.border = '0px solid #0D8ED9';
            }
            if (!filelist_tmdb) {
                forward_l.setAttribute('class', 'colhead');
                box_left.setAttribute('class', 'colhead');
            }
        }

        if (origin_site == 'CG') {
            forward_l.setAttribute('class', 'rowhead');
            box_left.setAttribute('class', 'rowhead');
        } 

        if (origin_site == 'elite-tracker') {
            forward_r.colSpan = '2'; box_right.colSpan = '2';
        }

        //循环部署转发节点，根据自己情况进行增加或删减
        var para;
        forward_r.id = 'forward_r';
        var style = document.createElement("style");
        style.type = "text/css";
        var text = document.createTextNode(".round_icon{ width: 15px;height: 15px;border-radius: 75%;} #douban_button {outline:none;}");
        style.appendChild(text);
        var head = document.getElementsByTagName("head")[0];
        head.appendChild(style);

        var img_url, forward_url, key;
        for (key in site_info) {
            if (forward_r.innerHTML) {
                forward_r.innerHTML = forward_r.innerHTML + ' | ';
            }
            para = document.createElement("a");
            para.setAttribute('class', 'forward_a');
            forward_r.appendChild(para);
            para.target = "_blank"; para.id = key;

            if(site_img_info.hasOwnProperty(key)){
                img_url = site_img_info[key];
            }
            else{
                img_url = site_info[key] + 'favicon.ico';
            }
            para.innerHTML = '<img src='+ img_url+ ' class="round_icon">' + ' ' + key;
        }
        //添加ptgen跳转
        if (raw_info.url == ''){
            raw_info.url = match_link('imdb', raw_info.descr);
        }
        if (raw_info.dburl == ''){
            raw_info.dburl = match_link('douban', raw_info.descr);
        }

        forward_r.innerHTML = forward_r.innerHTML + ' | ';
        var ptgen = document.createElement('a');
        ptgen.innerHTML = 'PTgen';
        ptgen.id = 'ptgen';
        if (raw_info.dburl){
            ptgen.href = 'https://www.bfdz.ink/tools/ptgen/?imdb=' + raw_info.dburl.match(/\d+/)[0];
        } else if (raw_info.url) {
            ptgen.href = 'https://www.bfdz.ink/tools/ptgen/?imdb=' + raw_info.url.match(/tt\d+/i)[0];
        }
        ptgen.target = '_blank';
        forward_r.appendChild(ptgen);

        //添加常用链接跳转
        if (common_sites.length > 0){
            forward_r.innerHTML = forward_r.innerHTML + ' | ';

            var common_link = document.createElement('a');
            forward_r.appendChild(common_link);
            common_link.id = 'common_link';
            common_link.setAttribute('class', 'forward_a');

            common_link.href = '#common_link';
            window.scrollBy(0, -150);
            common_link.innerHTML = '常用站点';
        }

        forward_r.innerHTML = forward_r.innerHTML + ' | ';
        var mediainfo_link = document.createElement('a');
        mediainfo_link.innerHTML = '简化MI ';
        mediainfo_link.href = 'https://www.bfdz.ink/tools/ptgen/';
        mediainfo_link.target = '_blank';
        forward_r.appendChild(mediainfo_link);

        var check=document.createElement("input");
        check.setAttribute("type","checkbox");
        check.setAttribute("id",'search_type');
        var check_text = document.createTextNode('查重');
        forward_r.append(check);
        forward_r.append(check_text);
        set_jump_href(raw_info, 1);
        check.addEventListener('click', function(e){
            if (!e.target.checked) {
                set_jump_href(raw_info, 1);
            } else {
                set_jump_href(raw_info, 0);
            }
        }, false);

        if (common_sites.length > 0) {
            if (origin_site != 'CMCT' || cmct_mode == 1){
                if (origin_site != 'UHD' && origin_site != 'TTG') {
                    document.getElementById('common_link').onclick = function(){
                        var key;
                        for (key in common_sites){
                            if (origin_site != common_sites[key]){
                                var site_href = document.getElementById(common_sites[key]).href;
                                window.open(site_href, '_blank');
                            }
                        }
                    };
                }
            }
        }
        var search_name = get_search_name(raw_info.name);
        try { 
            var imdbid = raw_info.url.match(/tt\d+/i)[0];
            var imdbno = imdbid.substring(2);
            var container = $('#forward_r');
            add_search_urls(container, imdbid, imdbno, search_name, 0);
        } catch(err) {}

        //修复cmct延迟加载mediainfo获取不到的bug
        if (origin_site == 'CMCT' && cmct_mode == 2){

            setTimeout(function(){
                raw_info.descr = '';
                //海报和简介
                var img_address = document.getElementById("kposter").getElementsByTagName("img")[0].src;
                try {
                    var descr_box = document.getElementsByClassName('info douban-info');
                    var descr_node = descr_box[0].getElementsByTagName('artical')[0];
                    descr_node = descr_node.cloneNode(true);
                    raw_info.descr = walk_cmct(descr_node);
                } catch (err){}
                raw_info.descr = '[img]' + img_address + '[/img]\n\n' + raw_info.descr + '\n\n';

                try{
                    var $html = $('td').filter('.douban_info').html();
                    if ($html.match(/https:\/\/www.imdb.com\/title\/tt\d+/)){
                        raw_info.url = $html.match(/https:\/\/www.imdb.com\/title\/tt\d+/)[0];
                        var imdbid = raw_info.url.match(/tt\d+/i)[0];
                        var imdbno = imdbid.substring(2);
                        var container = $('#forward_r');
                        add_search_urls(container, imdbid, imdbno, search_name, 0);
                    }
                } catch(err) {}

                //mediainfo——短
                try{
                    var mediainfo = document.getElementsByClassName("codemain")[0];
                    mediainfo = domToString(mediainfo.cloneNode(true));
                    mediainfo = mediainfo.replace(/(<div class="codemain">|<\/div>)/g, '');
                    mediainfo = mediainfo.replace(/<br>/g, '\n');
                    raw_info.descr += '[quote]' + mediainfo + '[/quote]\n\n';
                } catch(err){
                    console.log('获取mediainfo失败：'+err);
                }

                try{
                    var mediainfo1 = document.getElementsByClassName("codemain")[1];
                    mediainfo1 = domToString(mediainfo1.cloneNode(true));
                    mediainfo1 = mediainfo1.replace(/(<div class="codemain">|<\/div>)/g, '');
                    mediainfo1 = mediainfo1.replace(/<br>/g, '\n');
                    raw_info.full_mediainfo=mediainfo1;
                    if (this.id == 'PTer'){
                        raw_info.descr += '[hide]' + mediainfo1 + '[/hide]\n\n';
                    }
                } catch(err){
                    console.log('获取mediainfo失败：'+err);
                }

                //截图
                var screenshot = document.getElementsByClassName("screenshots-container");
                for (i = 0; i < screenshot.length; i++) {
                    var img = screenshot[i].getElementsByTagName("img");
                    for (j=0; j<img.length;j++){
                        if (img[j] && img[j].src.search(/detail/i) < 0) {
                            raw_info.descr = raw_info.descr + '[img]' + img[j].src + '[/img]\n';
                        }
                    }
                }

                raw_info.descr = thanks_str.format({'site': origin_site, 'descr': raw_info.descr});
            }, 1000);


            $('.forward_a').click(function(e){
                e.preventDefault();
                jump_str = dictToString(raw_info);
                if (this.id != 'common_link'){
                    this.href = decodeURI(this.href).split(seperator)[0] + seperator + encodeURI(jump_str);
                    window.open(this.href, '_blank');
                } else{
                    var key;
                    for (key in common_sites){
                        if (origin_site != common_sites[key]){
                            var site_href = document.getElementById(common_sites[key]).href;
                            site_href = decodeURI(site_href).split(seperator)[0] + seperator + encodeURI(jump_str);
                            window.open(site_href, '_blank');
                        }
                    }
                }
            });
        }

        if (origin_site == 'TTG') {
            $('.forward_a').click(function(e){
                e.preventDefault();

                raw_info.descr = '';

                if (reg_team_name.hasOwnProperty(origin_site) && raw_info.name.match(reg_team_name[origin_site])){
                    raw_info.descr = thanks_str.format({'site': origin_site, 'descr': raw_info.descr});
                }

                descr = document.getElementById('kt_d');
                descr_box = descr.cloneNode(true);
                raw_info.descr = walkDOM(descr_box);

                var reg_img = raw_info.descr.match(/\[img\]http(s*):\/\/totheglory.im\/pic\/ico_(free|half|30).gif\[\/img\].*/i);
                if (reg_img) {
                    raw_info.descr = raw_info.descr.replace(reg_img[0], '');
                }
                //替换官种简介顺序
                var reg_source = raw_info.descr.match(/\[color=.*?\]\.Comparisons[\s\S]*(thumb\.png|ajax-loader\.gif)\[\/img\]\[\/url\][\s\S]*?\[\/quote\]/im);
                if (reg_source){
                    reg_source = reg_source[0];
                    raw_info.descr = raw_info.descr.replace(reg_source, '');
                    if (reg_source.match(/\[size=3\].*\[\/size\]/)) {
                        var tmp_name = reg_source.match(/\[size=3\].*\[\/size\]/)[0];
                        reg_source = reg_source.split(tmp_name);
                        reg_source[0] = reg_source[0].replace(/http/g, 'https').replace(/httpss/g, 'https');
                        reg_source = tmp_name + reg_source[1] + '\n\n' + reg_source[0];
                    }
                    raw_info.descr = raw_info.descr + reg_source;
                    raw_info.descr = raw_info.descr.replace(/\n{3,5}/ig, '\n\n');
                }
                jump_str = dictToString(raw_info);
                if (this.id != 'common_link'){
                    this.href = decodeURI(this.href).split(seperator)[0] + seperator + encodeURI(jump_str);
                    window.open(this.href, '_blank');
                } else{
                    var key;
                    for (key in common_sites){
                        if (origin_site != common_sites[key]){
                            var site_href = document.getElementById(common_sites[key]).href;
                            site_href = decodeURI(site_href).split(seperator)[0] + seperator + encodeURI(jump_str);
                            window.open(site_href, '_blank');
                        }
                    }
                }
            });
        }

        if (['UHD', 'FileList', 'RED', 'TJUPT', 'HDB', 'elite-tracker'].indexOf(origin_site) > -1) {
            $('.forward_a').click(function(e){
                e.preventDefault();
                if (origin_site == 'UHD' && uhd_lack_descr){
                    var tmp_name = raw_info.descr.match(/movie name.*?:(.*)/i);
                    if (tmp_name && !raw_info.name){
                        raw_info.name = tmp_name[1].trim();
                        if (check_descr(raw_info.descr)) {
                            tmp_name = document.getElementsByClassName('imovie_title')[0].textContent.replace(/\(|\)/g, '').trim();
                            raw_info.name = get_bluray_name_from_descr(raw_info.descr, tmp_name);
                        }
                    }
                    raw_info.name = deal_with_title(raw_info.name);
                    if (raw_info.name.match(/S\d{2,3}/i)){
                        raw_info.type = '剧集';
                    } else {
                        raw_info.type = '电影';
                    }
                    uhd_lack_descr = false;
                }
                if (origin_site == 'TJUPT'){
                    if (raw_info.type == '动漫') {
                        raw_info.animate_info = document.getElementById('top').textContent;
                    }
                    descr = document.getElementById("kdescr");
                    descr = descr.cloneNode(true);
                    raw_info.descr = '';
                    raw_info.descr = walkDOM(descr);
                    raw_info.descr = raw_info.descr.replace(/站外链接 :: /ig, '');
                }

                jump_str = dictToString(raw_info);
                if (this.id != 'common_link'){
                    this.href = decodeURI(this.href).split(seperator)[0] + seperator + encodeURI(jump_str);
                    window.open(this.href, '_blank');
                } else{
                    var key;
                    for (key in common_sites){
                        if (origin_site != common_sites[key]){
                            var site_href = document.getElementById(common_sites[key]).href;
                            site_href = decodeURI(site_href).split(seperator)[0] + seperator + encodeURI(jump_str);
                            window.open(site_href, '_blank');
                        }
                    }
                }

            });
        }

        //----------------------------------界面部署层逻辑：获取豆瓣链接button绑定点击事件-------------------------------------------------

        if ((!judge_if_the_site_in_domestic() && origin_site != 'RED' && origin_site != 'OpenCD') || douban_button_needed){

            douban_button.addEventListener('click', function() {

                var douban_info = '';
                douban_button.value = '获取中……';

                var is_douban_needed = false;

                if (raw_info.name.match(/S\d{2}E\d{2}/ig) || raw_info.type == '剧集') {
                    if(raw_info.name.match(/S\d{2}/ig)){
                        if(!raw_info.name.match(/S01/ig)){
                            is_douban_needed = true;
                        }
                    }
                }

                if (raw_info.url && !judge_if_the_site_in_domestic() && !raw_info.dburl) {
                    is_douban_needed = true;
                }
                if (douban_button_needed && raw_info.url == '' && raw_info.dburl == ''){
                    is_douban_needed = true;
                }
                var tmp_url = document.getElementById('input_box').value;
                if (tmp_url.match(/douban.com/)) {
                    raw_info.dburl = tmp_url;
                    is_douban_needed = false;
                }
                var textarea = document.getElementById('textarea');
                if (textarea && textarea.selectionStart != undefined && textarea.selectionEnd != undefined){
                    var chosen_value = textarea.value.substring(textarea.selectionStart, textarea.selectionEnd);
                    var dburl = chosen_value.match(/http(s*):\/\/.*?douban.com\/subject\/(\d+)/i);
                    if (dburl){
                        raw_info.dburl = dburl[0] + '/';
                        is_douban_needed = false;
                    }
                }

                create_site_url_for_douban_info(raw_info, is_douban_needed)
                .then(function(data){
                    if (raw_info.dburl){
                        url_data = {
                            'url': raw_info.dburl
                        };
                        url_to_search = '?url=' + raw_info.dburl;
                    } else{
                        url_data = {
                            'site': 'douban',
                            'sid': raw_info.url.match(/tt\d+/)[0]
                        };
                        url_to_search = '?site=douban&sid=' + raw_info.url.match(/tt\d+/)[0];
                    }
                    getJson(apis[api_chosen] + url_to_search, null, function(res){
                        var douban_info = res.success ? res.format : "";
                        douban_info = douban_info.replace("[/img][/center]", "[/img]");
                        douban_info = douban_info.replace("hongleyou.cn", "doubanio.com");
                        if (douban_info != '') {
                            raw_info.descr = douban_info + '\n\n' + raw_info.descr;

                            if (is_douban_needed && raw_info.descr.match(/http(s*):\/\/www.imdb.com\/title\/tt(\d+)/i)){
                                raw_info.url = raw_info.descr.match(/http(s*):\/\/www.imdb.com\/title\/tt(\d+)/i)[0] + '/';
                            }
                            if (raw_info.descr.match(/类[\s\S]{0,5}别[\s\S]{0,30}纪录片/i)) {
                                raw_info.type = '纪录';
                            } else if (raw_info.descr.match(/类[\s\S]{0,5}别[\s\S]{0,30}动画/i)) {
                                raw_info.type = '动漫';
                            }
                            set_jump_href(raw_info, 1);
                            jump_str = dictToString(raw_info);
                            douban_button.value = '获取成功';
                            $('#textarea').val(douban_info);
                            GM_setClipboard(douban_info);

                            tag_aa = forward_r.getElementsByClassName('forward_a');
                            for (i = 0; i < tag_aa.length; i++) {
                                if (tag_aa[i].textContent != '常用站点' && tag_aa[i].textContent != 'PTgen' && tag_aa[i].textContent != '简化MI'){
                                    tag_aa[i].href = decodeURI(tag_aa[i]).split(seperator)[0] + seperator + encodeURI(jump_str);
                                }
                            }
                        } else {
                            douban_button.value = '获取失败';
                        }
                    });
                })
                .catch(function(err){
                    console.log(err);
                });

            }, false);

            search_button.addEventListener('click', function() {
                var search_name = get_search_name(raw_info.name);
                if (raw_info.type == '剧集'){
                    if (raw_info.name.match(/S\d+/i)){
                        var number = parseInt(raw_info.name.match(/S(\d+)/i)[1]);
                        search_name = search_name + ' Season ' + number;
                    }
                }
                if ($('#douban_api').prop('checked')){
                    const url_prex = 'https://movie.douban.com/j/subject_suggest?q=';
                    const douban_prex = 'https://movie.douban.com/subject/';
                    var search_url = url_prex + search_name;
                    var textarea = document.getElementById('textarea');
                    getJson(search_url, null, function(data){
                        if (data.length > 0) {
                            textarea.value = `搜索的影视名称为：${raw_info.name}\n`;
                            for(i=0;i<data.length;i++){
                                textarea.value +=  `${data[i].sub_title}---${data[i].title}: ${douban_prex}${data[i].id}/\n`;
                            }
                        }
                    });

                } else {
                    var search_url = 'https://search.douban.com/movie/subject_search?search_text=' + search_name;
                    window.open(search_url, target='_blank');
                }

            }, false);
            ptgen_button.addEventListener('click', function(){
                var tmp_url = document.getElementById('input_box').value;
                create_site_url_for_douban_info(raw_info, true).then(function(data){
                    if (raw_info.dburl){
                        tmp_url = raw_info.dburl.match(/subject\/(\d+)/i)[1];
                    } else{
                        tmp_url = tmp_url.match(/tt\d+/)[0];
                    }
                    url = 'https://www.bfdz.ink/tools/ptgen/?imdb=' + tmp_url;
                    window.open(url, '_blank');
                }, function() {
                    url = 'https://www.bfdz.ink/tools/ptgen/?imdb=' + tmp_url.match(/tt\d+/)[0];
                    window.open(url, '_blank');
                });
            }, false);
        }
    }

    /*****************************************************************************************************************
    *                                       part 5 发布页数据逻辑处理                                                  *
    ******************************************************************************************************************/
    else if (judge_if_the_site_as_source() == 0) {
        var upload_site = site_url.split(seperator)[0]; //转发的站点
        raw_info = stringToDict(site_url.split(seperator)[1]); //将弄回来的字符串转成字典
        raw_info.descr = raw_info.descr.replace(/ /g, ' ');
        var forward_site = find_origin_site(upload_site);
        var LemonHD_music = false, LemonHD_animate = false, LemonHD_documentary = false;
        var search_name = get_search_name(raw_info.name);

        //副标题加上原盘版本信息
        if (check_descr(raw_info.descr) && !raw_info.name.match(/(diy|@)/i) && judge_forward_sit_in_domestic(forward_site)){
            if (blurayVersion(raw_info.name)){
                raw_info.small_descr = raw_info.small_descr +'    '+ blurayVersion(raw_info.name);
            }
        }
        if (raw_info.golden_torrent == true) {
            raw_info.small_descr = raw_info.small_descr +' | '+ 'PTP Golden Popcorn';
        }

        if (upload_site.match(/music/i) && forward_site == 'LemonHD'){
            LemonHD_music = true;
        } else if (raw_info.origin_site == 'OpenCD' || raw_info.origin_site == 'RED') {
            raw_info.name = raw_info.name.replace(/\*/g, '');
            if (raw_info.tracklist) {
                raw_info.tracklist = '[quote=Tracklist]' + raw_info.tracklist + '[/quote]';
            } else {
                raw_info.tracklist = '';
            }
            if (raw_info.log_info){
                raw_info.log_info = '\n\n[hide]' + raw_info.log_info + '[/hide]\n\n';
            } else {
                raw_info.log_info = '';
            }
            raw_info.descr = raw_info.descr + raw_info.log_info + raw_info.tracklist;
        } else if (upload_site.match(/animate/i) && forward_site == 'LemonHD'){
            LemonHD_animate = true;
        } else if (upload_site.match(/upload_doc/i) && forward_site == 'LemonHD'){
            LemonHD_documentary = true;
        }

        raw_info.descr = raw_info.descr.replace(/\%2F/g, '/');
        raw_info.descr = raw_info.descr.replace(/\%3A/g, ':');

        raw_info = fill_raw_info(raw_info);

        //-------------------------------------数据填充到指定位置--------------------------------------
        if (LemonHD_music) {
            var info_text = raw_info.name.split('*');
            var author_name = info_text[0];
            var author = author_name.split('-')[0].trim();
            var music_name = '待填';
            if (author_name.split('-').length > 1) {
                music_name = author_name.split('-')[1].trim();
            }
            var year = '';
            if (raw_info.name.match(/(19|20)\d+/)){
                year = raw_info.name.match(/(19|20)\d+/)[0];
                music_name = music_name.split(year)[0].trim();
            }
        }

        if (LemonHD_animate) {
            var check_links = {
                'douban': 'https://www.douban.com/search?q={name}',
                'anidb': 'https://anidb.net/anime/?adb.search={name}',
                'LemonHD': 'https://lemonhd.org/torrents.php?animate=yes&inclbookmarked=0&search={name}'
            };

            //修改页面的函数有anidb的时候直接调用，禁用掉button，返回数据对现有填写的数据做一个补充
            function autoSetAnimateRemark(textareaId) {
                var anidbUrl = document.getElementsByName('anidb_url')[0].value;
                if (!anidbUrl) {alert('请填写正确的Anidb地址');return;}
                var autoSetRemarkBtn = document.getElementById('autoSetAnimateRemarkBtn');
                autoSetRemarkBtn.disabled = true;
                ajax.get('getextinfoajax.php?action=anidbInfo&url=' + anidbUrl, function (res) {
                    if (res) {
                        var data = eval("(" + res + ")");
                        if (data.type) {
                            if (data.type == 'Movie') {
                                document.getElementsByName('animate_type')[0].value = 1;
                            }
                            else if (data.type.startWith('TV Series')) {
                                document.getElementsByName('animate_type')[0].value = 3;
                            }
                        }
                        if (data.year) {document.getElementsByName('year')[0].value = data.year;}
                        if (data.cnName) {alert(data.cnName); document.getElementsByName('cn_name')[0].value = data.cnName;}
                        if (data.enName) {document.getElementsByName('en_name')[0].value = data.enName;}
                        if (data.jpName) {document.getElementsByName('jp_name')[0].value = data.jpName;}
                        var dd = data.plot.replace(/<\/?.+?>/g, " ");
                        var dds = dd.replace(/  /g, "");//dds为得到后的内容
                        raw_info.descr = "[size=2][color=blue]Anidb info:[/color][/size]\n" + dds.trim() + '\n\n' + raw_info.descr;
                        document.getElementById(textareaId).value = raw_info.descr;
                    }
                });
            }

            function autoSetRemark(textareaId) {
                var doubanUrl = document.getElementsByName('douban_url')[0].value;
                if (!doubanUrl) { alert('请填写正确的豆瓣地址'); return;}
                var autoSetRemarkBtn = document.getElementById('autoSetRemarkBtn');
                autoSetRemarkBtn.disabled = true;
                ajax.get('https://movieinfo.lemonhd.org/doubanAjax.php?url=' + doubanUrl, function (res) {
                    var content = "获取电影简介失败";
                    if (res) {
                        var data = eval("(" + res + ")");
                        if (data.error_code === 2000) {
                            content = "";
                            if (data.pic) content += "[img]" + data.pic + "[/img]\n";
                            if (data.allName) {
                                content += "\n◎译　　名　" + data.allName.join("/");
                                document.getElementsByName("small_descr")[0].value = data.allName.join("/");
                            }
                            if (data.name) { content += "\n◎片　　名　" + data.name;}
                            if (data.year) { content += "\n◎年　　代　" + data.year;}
                            if (data.country && data.country.length > 0) { content += "\n◎产　　地　" + data.country.join(" / ");}
                            if (data.genre && data.genre.length > 0) { content += "\n◎类　　别　" + data.genre.join(" / "); }
                            if (data.language && data.language.length > 0) { content += "\n◎语　　言　" + data.language.join(" / ");}
                            if (data.release && data.release.length > 0) { content += "\n◎上映日期　" + data.release.join(" / ");}
                            if (data.firstRelease && data.firstRelease.length > 0) { content += "\n◎首　　播　" + data.firstRelease.join(" / ");}
                            if (data.num) {content += "\n◎集　　数　" + data.num;}
                            if (data.imdbRating) {content += "\n◎IMDb评分  " + data.imdbRating + "/10 from " + data.imdbVotes + " users";}
                            if (data.imdbUrl) { content += "\n◎IMDb链接  " + data.imdbUrl; document.getElementsByName("url")[0].value = data.imdbUrl;}
                            if (data.rating) {content += "\n◎豆瓣评分　" + data.rating + "/10 from " + data.votes + " users";}
                            if (data.url) { content += "\n◎豆瓣链接　" + data.url;}
                            if (data.runtime && data.runtime.length > 0) { content += "\n◎片　　长　" + data.runtime.join(" / ");}
                            if (data.director && data.director.length > 0) {
                                var str = "";
                                for (var i = 0; i < data.director.length; i++) {
                                    if (i > 0) {
                                        str = str + "\n　　　　　  ";
                                    }
                                    str = str + data.director[i].name;
                                }
                                content += "\n◎导　　演　" + str;
                            }
                            if (data.writer && data.writer.length > 0) {
                                var str = "";
                                for (var i = 0; i < data.writer.length; i++) {
                                    if (i > 0) {
                                        str = str + "\n　　　　　  ";
                                    }
                                    str = str + data.writer[i].name;
                                }
                                content += "\n◎编　　剧　" + str;
                            }
                            if (data.cast && data.cast.length > 0) {
                                var str = "";
                                for (var i = 0; i < data.cast.length; i++) {
                                    if (i > 0) {
                                        str = str + "\n　　　　　  ";
                                    }
                                    str = str + data.cast[i].name;
                                }
                                content += "\n◎主　　演　" + str;
                            }
                            if (data.tags && data.tags.length > 0) {
                                content += "\n\n\n◎标　　签　" + data.tags.join(" | ");
                            }
                            if (data.plot) {
                                var reg = new RegExp("<br \/>", "g");
                                content += "\n\n◎简　　介　" + "\n\n " + data.plot.replace(reg, "\n");
                            }
                            if (data.awards && data.awards.length > 0) {
                                var str = "";
                                for (var i = 0; i < data.awards.length; i++) {
                                    str += "\n\n　　" + data.awards[i].title;
                                    var list = data.awards[i].content;
                                    for (var j = 0; j < list.length; j++) {
                                        str += "\n　　" + list[j];
                                    }
                                }
                                content += "\n\n◎获奖情况　" + str;
                            }
                            content += "\n\n";
                        }
                    }
                    var ele = document.getElementById(textareaId);
                    raw_info.descr = content + '\n\n' + raw_info.descr
                    ele.value = raw_info.descr;
                });
            }

            if (raw_info.animate_info){
                raw_info.standard_sel = (raw_info.animate_info + raw_info.torrent_name).standard_sel();
            } else{
                if (!raw_info.standard_sel) {
                    raw_info.standard_sel = raw_info.descr.standard_sel();
                }
            }
            var sourceAuthors = ['lolihouse', 'Raws','raws','ANK', 'VCB-Studio', 'VCB','ANK-Raws', 'AI-Raws','LittlePox', 'LittleBakas','ANE','Reinforce','Moozzi2','mawen1250','philosophy-raws'];
            setTimeout(()=>{
                if (raw_info.animate_info) {
                    if (raw_info.origin_site != 'U2'){
                        $("input[name='en_name']").val(raw_info.animate_info.match(/\[.*?\]/g)[3].replace(/\[|\]/g, ''));
                        $("input[name='cn_name']").val(raw_info.animate_info.match(/\[.*?\]/g)[2].replace(/\[|\]/g, ''));
                        $("input[name='sourceAuthor']").val(raw_info.animate_info.match(/\[.*?\]/g)[1].replace(/\[|\]/g, ''));
                    } else {
                        $("input[name='en_name']").val(raw_info.animate_info.match(/\[.*?\]/g)[1].replace(/\[|\]/g, ''));
                        $("input[name='cn_name']").val(raw_info.animate_info.match(/\[.*?\]/g)[0].replace(/\[|\]/g, ''));
                        $("input[name='jp_name']").val(raw_info.animate_info.match(/\[.*?\]/g)[2].replace(/\[|\]/g, ''));

                        for (author of sourceAuthors){
                            var reg = new RegExp(author, 'i');
                            if (reg.exec(raw_info.animate_info)){
                                $("input[name='sourceAuthor']").val(author);
                                break;
                            }
                        }
                    }
                    $('tr').eq(13).find('td').eq(1).append(`<div style="margin: 5px 0;"><label style="font-weight: bold">辅助填写 &nbsp;&nbsp;<input type="text" style="width: 80%;padding: 3px;" value="${raw_info.animate_info}"></label>
                        <span style="color: gray;padding-left: 5px;"><i>辅助信息</i></span></div>`);

                } else {
                    $("input[name='en_name']").val(raw_info.name);
                    $("input[name='cn_name']").val(raw_info.small_descr);
                    try{$("input[name='sourceAuthor']").val(raw_info.name.match(/-([^ ]*?)$/)[1]);}catch(err){}
                    for (author of sourceAuthors){
                        var reg = new RegExp(author, 'i');
                        if (reg.exec(raw_info.name)){
                            $("input[name='sourceAuthor']").val(author);
                            break;
                        }
                    }
                    if (raw_info.torrent_name){
                        $('tr').eq(13).find('td').eq(1).append(`<div style="margin: 5px 0;"><label style="font-weight: bold">辅助填写 &nbsp;&nbsp;<input type="text" style="width: 80%;padding: 3px;" value="${raw_info.torrent_name}"></label>
                            <span style="color: gray;padding-left: 5px;"><i>辅助信息</i></span></div>`);
                    }
                    raw_info.animate_info = raw_info.name + raw_info.torrent_name;
                }

                //根据anidb填写并重定向绑定anidb和豆瓣按钮点击事件
                if (raw_info.anidb){
                    $("input[name='anidb_url']").val(raw_info.anidb);
                }

                $('#autoSetAnimateRemarkBtn').removeAttr('onclick');
                $('#autoSetAnimateRemarkBtn').click((e)=>{
                    autoSetAnimateRemark('descr');
                });

                $('#autoSetRemarkBtn').removeAttr('onclick');
                $('#autoSetRemarkBtn').click((e)=>{
                    autoSetRemark('descr');
                });


                if (raw_info.animate_info.match(/BDRIP/i) || raw_info.animate_info.match(/BluRay/i)){
                    $("select[name='animate_category']").val('2');
                } else if (raw_info.animate_info.match(/WEB/i)) {
                    $("select[name='animate_category']").val('7');
                } else if (raw_info.animate_info.match(/DVDRip/i)) {
                    $("select[name='animate_category']").val('4');
                } else if (raw_info.animate_info.match(/TVRip/i)) {
                    $("select[name='animate_category']").val('6');
                } else if (raw_info.animate_info.match(/HDTV/i)) {
                    $("select[name='animate_category']").val('5');
                } else if (raw_info.animate_info.match(/BDMV/i)) {
                    $("select[name='animate_category']").val('1');
                }

                $("select[name='animate_type']").val('3');
                if (raw_info.animate_info.match(/剧场/i) || raw_info.small_descr.match(/剧场版/)){
                    $("select[name='animate_type']").val('2');
                } else if (raw_info.animate_info.match(/\[TV\]|连载/i)){
                    $("select[name='animate_type']").val('3');
                } else if (raw_info.animate_info.match(/OVA/i)){
                    $("select[name='animate_type']").val('4');
                }
                var year = '';
                if (raw_info.animate_info.match(/(19|20)\d+/) && (raw_info.origin_site != 'U2')){
                    year = raw_info.animate_info.match(/(19|20)\d+/)[0];
                    $("input[name='year']").val(year);
                }
                if (raw_info.animate_info.match(/fin/i)){
                    $('#fin').attr("checked", true);
                }

                if (raw_info.animate_info.match(/日漫/)){
                    $("select[name='processing_sel']").val('4');
                } else if (raw_info.animate_info.match(/国产/)){
                    $("select[name='processing_sel']").val('1');
                }

                if (raw_info.origin_site == 'U2'){
                    if (raw_info.animate_info.match(/\[JP\]/i)){
                        $("select[name='processing_sel']").val('4');
                    }else if (raw_info.animate_info.match(/\[USA\]/i)){
                        $("select[name='processing_sel']").val('3');
                    } else if (raw_info.animate_info.match(/\[THA\]/i)){
                        $("select[name='processing_sel']").val('6');
                    } else if (raw_info.animate_info.match(/\[ITA\]/i)){
                        $("select[name='processing_sel']").val('3');
                    } else {$("select[name='processing_sel']").val('4');}
                }

                $('tr').eq(13).after('<tr><td class="rowhead" style="padding: 3px;vertical-align: top">检查信息</td><td class="rowfollow" id="checker"></td></tr>');
                for (key in check_links) {
                    $('#checker').append(`<input type="button" class="checker" value="${key}" id="${key}">`);
                }
                $('.checker:gt(0)').css({'marginLeft': '5px'});
                $('.checker').click((e)=>{
                    var name = $("input[name='cn_name']").val();
                    if (!name) {return;}
                    var url = check_links[e.target.id].format({'name': name});
                    window.open(url, '_blank');
                })
            }, 1000);
        }

        var allinput = document.getElementsByTagName("input");
        for (i = 0; i < allinput.length; i++) {
            if (allinput[i].name == 'name') { //填充标题
                if (forward_site.match(/(HDChina|NanYang|CMCT|iTS)/i)) {
                    allinput[i].value = raw_info.name.replace(/\s/g, ".");
                } else if (forward_site == 'TTG') {
                    raw_info.name = raw_info.name.replace(/(5\.1|2\.0|7\.1|1\.0)/, function(data){
                        return data.replace('.', '{@}');
                    });
                    raw_info.name = '{name} [{small_descr}]'.format({
                        'name': raw_info.name,
                        'small_descr': raw_info.small_descr
                    });
                    allinput[i].value = raw_info.name;
                } else if (forward_site == 'PuTao'){
                    raw_info.name = '[{chines}] {english}'.format({
                        'english': raw_info.name,
                        'chines': raw_info.small_descr
                    });
                    allinput[i].value = raw_info.name;
                } else {
                    allinput[i].value = raw_info.name;
                }
            }
            if (LemonHD_music) {
                if (allinput[i].name == 'author'){
                    allinput[i].value = author;
                } else if (allinput[i].name == 'title'){
                    allinput[i].value = music_name;
                } else if (allinput[i].name == 'year'){
                    allinput[i].value = year;
                }
            }
            if (allinput[i].name == 'small_descr') { //填充副标题
                allinput[i].value = raw_info.small_descr;
                if (LemonHD_music) {
                    if (raw_info.small_descr){
                        allinput[i].value = raw_info.small_descr + ' | 转自：' + raw_info.origin_site;
                    } else {
                        allinput[i].value = raw_info.name + ' | 转自：' + raw_info.origin_site;
                    }
                }
            }

            if (allinput[i].name == 'url' && allinput[i].type == "text") { //填充imdb信息
                if (forward_site == 'OurBits' && raw_info.url == ''){
                    if (raw_info.dburl){
                        raw_info.url = raw_info.dburl;
                    }
                }
                if (forward_site == 'CMCT'){
                    if (raw_info.dburl){
                        allinput[i].value = raw_info.dburl;
                    } else {
                        allinput[i].value = raw_info.url;
                    }
                } else {
                    allinput[i].value = raw_info.url;
                }
            }

            if (['url_douban', 'douban', 'dburl', 'douban_url', 'douban_id', 'durl'].indexOf(allinput[i].name)>-1) { //豆瓣信息
                allinput[i].value = raw_info.dburl;
            }

            if (['HDDolby'].indexOf(forward_site) > -1 && allinput[i].name == 'douban_id' && raw_info.dburl){
                allinput[i].value = raw_info.dburl.match(/\d+/i)[0];
            }

            if (forward_site == 'BTSchool' && allinput[i].name == 'imdbid' && raw_info.url){
                allinput[i].value = raw_info.url.match(/tt\d+/i)[0];
            }
            if (forward_site == 'BTSchool' && allinput[i].name == 'doubanid' && raw_info.dburl){
                allinput[i].value = raw_info.dburl.match(/\d+/i)[0];
            }

            if (['TJUPT'].indexOf(forward_site) > -1 && allinput[i].name == 'external_url'){
                allinput[i].value = raw_info.url? raw_info.url:raw_info.dburl;
            }

            if (forward_site == 'HDT' && allinput[i].name == 'filename') {
                allinput[i].value = raw_info.name.replace(/DDP/i, 'DD+');
            }
            if (forward_site == 'HDT' && allinput[i].name == 'infosite') {
                allinput[i].value = raw_info.url.replace('http:', 'https:').replace(/(tt\d+[^/]$)/, '$1/');
            }
        }

        //填写简介，一般都是textarea，特殊情况后续处理--CMCT改版兼容
        var descr_box = document.getElementsByTagName('textarea');
        if (['CMCT', 'ptsbao', 'HDPost','HDCity', 'BLU', 'UHD', 'HDSpace', 'HDB', 'iTS'].indexOf(forward_site) < 0){
            if (forward_site == 'HDT') {
                descr_box[0].style.height = '600px';
                var mediainfo_hdt = get_mediainfo_picture_from_descr(raw_info.descr);
                descr_box[0].value = '[quote]' + mediainfo_hdt.mediainfo + '[/quote]\n' + mediainfo_hdt.pic_info.replace(/\n/g,'');
            } else if (forward_site != 'HaiDan'){
                descr_box[0].style.height = '800px';
                descr_box[0].value = raw_info.descr;
                if (forward_site == 'BHD') {
                    var evt = document.createEvent("HTMLEvents");
                    evt.initEvent("change", false, true);
                    document.getElementById('mediainfo').dispatchEvent(evt);
                }
            } else {
                descr_box[2].value = raw_info.descr;
            }
        }

        if (LemonHD_music) {
            if (raw_info.log_info) {
                raw_info.log_info = '[quote=Logs]' + raw_info.log_info + '[/quote]';
            } else {
                raw_info.log_info = '';
            }
            descr_box[0].value = raw_info.descr + '\n\n' + raw_info.name.replace(/\*/g, '') + '\n\n' + raw_info.log_info + raw_info.tracklist;
        }

        if (forward_site == 'TTG'){
            setTimeout(function(){
                descr_box[0].value = descr_box[0].value.replace(/http:\/\/anonym\.to\/\?/ig, '');
            }, 2000);
        }

        //-------------------------------------------勾选国语粤语中字等标签--------------------------------------------------------
        var label_str = raw_info.small_descr + raw_info.name + raw_info.descr;
        var labels = label_str.get_label();
        try {
            switch (forward_site){
                case 'PTer':
                    if (labels.gy){ document.getElementById('guoyu').checked=true; }
                    if (labels.yy){ document.getElementById('yueyu').checked=true; }
                    if (labels.zz){ document.getElementById('zhongzi').checked=true; }
                    if (labels.diy){ document.getElementById('diy').checked=true; }
                    break;
                case 'CHDBits':
                    if (labels.gy){ document.getElementsByName('cnlang')[0].checked=true; }
                    if (labels.zz){ document.getElementsByName('cnsub')[0].checked=true; }
                    if (labels.diy){ document.getElementsByName('diy')[0].checked=true; }
                    break;
                case 'OurBits':
                    if (labels.gy){ document.getElementById('tagGY').checked=true; }
                    if (labels.yy){ document.getElementById('tagGY').checked=true; }
                    if (labels.zz){ document.getElementById('tagZZ').checked=true; }
                    if (labels.diy){ document.getElementById('tagDIY').checked=true; }
                    break;
                case 'MTeam':
                    if (labels.gy){ document.getElementById('l_dub').checked=true; }
                    if (labels.yy){ document.getElementById('l_dub').checked=true; }
                    if (labels.zz){ document.getElementById('l_sub').checked=true; }
                    if (labels.diy){ document.getElementById('l_diy').checked=true; }
                    break;
                case 'HDSky':
                    if (labels.diy){ document.getElementsByName('option_sel[]')[3].checked=true; }
                    if (labels.gy){ document.getElementsByName('option_sel[]')[4].checked=true; }
                    if (labels.yy){ document.getElementsByName('option_sel[]')[5].checked=true; }
                    if (labels.zz){ document.getElementsByName('option_sel[]')[6].checked=true; }
                    break;
                case 'HDDolby': case 'PThome': case 'HDHome':
                    if (labels.gy){ check_label(document.getElementsByName('tags[]'), 'gy'); }
                    if (labels.yy){ check_label(document.getElementsByName('tags[]'), 'yy'); }
                    if (labels.zz){ check_label(document.getElementsByName('tags[]'), 'zz'); }
                    if (labels.diy){ check_label(document.getElementsByName('tags[]'), 'diy'); }
                    if (labels.hdr10) { check_label(document.getElementsByName('tags[]'), 'hdr10'); }
                    if (labels.db) {check_label(document.getElementsByName('tags[]'), 'db');}
                    break;
                case 'LemonHD':
                    if (labels.gy){ document.getElementsByName('tag_gy')[0].checked=true; }
                    if (labels.yy){ document.getElementsByName('tag_yy')[0].checked=true; }
                    if (labels.zz){ document.getElementsByName('tag_zz')[0].checked=true; }
                    if (labels.diy) {
                        document.getElementsByName('tag_diy')[0].checked=true;
                    } else if (raw_info.medium_sel == 'UHD' || raw_info.medium_sel == 'Blu-ray' ) {
                        document.getElementsByName('tag_wuyi')[0].checked=true;
                        if (labels.zz) { document.getElementsByName('tag_yszz')[0].checked=true;}
                    }
                    break;
                case 'ptsbao':
                    if (labels.zz){ document.getElementsByName('zz')[0].checked=true; }
                    break;
                case 'HaiDan':
                    if (labels.gy){ document.getElementsByName('tag_list[]')[4].checked=true; }
                    if (labels.yy){ document.getElementsByName('tag_list[]')[9].checked=true; }
                    if (labels.zz){ document.getElementsByName('tag_list[]')[2].checked=true; }
                    if (labels.diy){ document.getElementsByName('tag_list[]')[3].checked=true; }
                    break;
                case '52PT':
                    if (labels.gy){ document.getElementsByName('tags[]')[4].checked=true; }
                    if (labels.yy){ document.getElementsByName('tags[]')[4].checked=true; }
                    if (labels.zz){ document.getElementsByName('tags[]')[5].checked=true; }
                    break;
                case 'HDRoute':
                    if (labels.gy){ document.getElementsByName('is_mandrain')[0].checked=true; }
                    if (labels.yy){ document.getElementsByName('is_cantonese')[0].checked=true; }
                    if (labels.diy){ document.getElementsByName('is_diyed')[0].checked=true; }
            }
        } catch (err) {
        }

        //匿名勾选
        if (forward_site == 'TTG') {
            var anonymity = if_uplver ? "option[value='yes']" : "option[value='no']";
            $("select[name='anonymity']").find(anonymity).attr("selected", true);
        } else if (forward_site == 'HDRoute') {
            document.getElementsByName('is_anonymous')[0].checked = if_uplver;
        } else if (forward_site == 'HDT') {
            document.getElementsByName('anonymous')[1].checked = if_uplver;
        } else if (forward_site == 'UHD') {
            $('#anonymous').prop('checked', true);
        } else if (forward_site == 'HDSpace') {
            $('input[name="anonymous"]:eq(1)').prop('checked', true);
        } else if (['HDPost', 'BLU', 'BHD', 'iTS'].indexOf(forward_site) < 0){
            try {
                setTimeout(()=>{
                    document.getElementsByName('uplver')[0].checked = if_uplver;
                }, 1000)
            } catch(err) {}
        }

        //---------------------------------------干掉选择种子后主标题变化的bug------------------------------------------
        var torrent_box = document.getElementById("torrent");
        try{
            if (forward_site == 'CHDBits') {
                torrent_box.parentNode.innerHTML = '<input type="file" class="file" id="torrent" name="torrentfile" accept=".torrent">';
            } else if (forward_site == 'HDCity' || forward_site == 'HDSpace') {

            } else if (forward_site == 'BHD') {
                torrent_box.parentNode.innerHTML = ' <input class="beta-form-main" type="file" accept=".torrent" name="torrent" id="torrent" style="width: 100% !important;" required="">';
            } else if (forward_site == 'BLU' || forward_site == 'HDPost') {
                torrent_box.parentNode.innerHTML = '<input class="upload-form-file" type="file" accept=".torrent" name="torrent" id="torrent" required="">';
            } else {
                torrent_box.parentNode.innerHTML = '<input type="file" class="file" id="torrent" name="file" accept=".torrent">';
            }
        } catch(err){}


        //-----------------------------------------------选择类填写------------------------------------------------
        if (LemonHD_music) {
            var team_box = document.getElementsByName('processing_sel')[0];
            if (!raw_info.source_sel) {
                raw_info.source_sel = raw_info.music_type.source_sel();
            }
            var team_dict = { '欧美': 3, '大陆': 1, '香港': 2, '台湾': 2, '港台': 2, '日韩': 4, '日本': 4, '韩国': 4, '印度': 5, '其他': 6 };
            if (team_dict.hasOwnProperty(raw_info.source_sel)) {
                var index = team_dict[raw_info.source_sel];
                team_box.options[index].selected = true;
            }

            var format_box = document.getElementsByName('music_type')[0];
            var useful_info = raw_info.music_media + raw_info.music_type + raw_info.small_descr + raw_info.name.replace(/\*/g, ' ');
            format_box.options[1].selected = true;

            //这里更多的是从red来匹配
            var music_category = document.getElementsByName('music_category')[0];
            if (useful_info.match(/Album/i)){
                music_category.options[1].selected = true;
            } else if (useful_info.match(/ EP /)){
                music_category.options[3].selected = true;
            } else if (useful_info.match(/ Single /)){
                music_category.options[3].selected = true;
            } else if (useful_info.match(/ Live album /)){
                music_category.options[2].selected = true;
            } else if (useful_info.match(/ Soundtrack /)){
                music_category.options[5].selected = true;
            }
        }

        //对类别做出简单修正
        if (raw_info.descr.match(/类[\s\S]{0,5}别[\s\S]{0,30}纪录片/i)) {
            raw_info.type = '纪录';
        } else if (raw_info.descr.match(/类[\s\S]{0,5}别[\s\S]{0,30}动画/i)) {
            raw_info.type = '动漫';
        }

        if (forward_site == 'PTer'){
            var browsecat = document.getElementById('browsecat');
            var type_dict = {'电影': 1, '剧集': 2, '动漫': 3, '综艺': 4, '音乐': 6, '纪录': 7,
                             '体育': 8, '软件': 11, '学习': 12};
            if (type_dict.hasOwnProperty(raw_info.type)){
                var index = type_dict[raw_info.type];
                browsecat.options[index].selected = true;
            }

            var source_box = document.getElementsByTagName('select')[4];
            switch(raw_info.medium_sel){
                case 'UHD': source_box.options[1].selected = true; break;
                case 'Blu-ray': source_box.options[2].selected = true; break;
                case 'Remux': source_box.options[3].selected = true; break;
                case 'HDTV': source_box.options[4].selected = true; break;
                case 'WEB-DL': source_box.options[5].selected = true; break;
                case 'Encode': source_box.options[6].selected = true; break;
                case 'DVD': source_box.options[7].selected = true;
            }
            switch(raw_info.audiocodec_sel){
                case 'Flac': source_box.options[8].selected = true; break;
                case 'WAV': source_box.options[9].selected = true;
            }
            var team_box = document.getElementsByTagName('select')[5];
            var team_dict = {'欧美': 8, '大陆': 1, '香港': 2, '台湾': 3, '日本': 6, '韩国': 5, '印度': 7 };
            if (team_dict.hasOwnProperty(raw_info.source_sel)){
                var index = team_dict[raw_info.source_sel];
                team_box.options[index].selected = true;
            }
            var reg_region = raw_info.descr.match(/(地.{0,5}?区|国.{0,5}?家|产.{0,5}?地)([^\r\n]+)/);
            if (reg_region) {
                var regions = reg_region[2].trim().split('/');
                for (var idx = 0; idx < regions.length; ++idx) {
                    if (regions[idx].trim().match(/(美国|英国)/)) {
                        team_box.options[4].selected = true;
                        break;
                    }
                }
            }
        }

        else if (forward_site == 'MTeam'){
            var browsecat = document.getElementById('browsecat');
            switch (raw_info.type){
                case '电影':
                    if (raw_info.medium_sel == 'Blu-ray' || raw_info.medium_sel == 'UHD'){
                        browsecat.options[3].selected = true;
                    } else if (raw_info.medium_sel == 'Remux'){
                        browsecat.options[4].selected = true;
                    } else if (raw_info.medium_sel == 'DVD' || raw_info.medium_sel == 'DVDRip'){
                        browsecat.options[2].selected = true;
                    } else {
                        if (raw_info.standard_sel != 'SD'){
                            browsecat.options[1].selected = true;
                        } else{
                            browsecat.options[0].selected = true;
                        }
                    }
                    break;
                case '剧集': case '综艺':
                    if (raw_info.medium_sel == 'Blu-ray' || raw_info.medium_sel == 'UHD'){
                        browsecat.options[8].selected = true;
                    } else if (raw_info.medium_sel == 'DVD' || raw_info.medium_sel == 'DVDRip'){
                        browsecat.options[7].selected = true;
                    } else {

                        if (raw_info.standard_sel != 'SD'){
                            browsecat.options[6].selected = true;
                        } else{
                            browsecat.options[5].selected = true;
                        }
                    }
                    break;

                case '纪录': case '学习':
                    browsecat.options[9].selected = true; break;
                case '动漫': browsecat.options[10].selected = true; break;
                case '音乐':
                    if(raw_info.name.match(/(flac|ape)/i)){
                        $('#browsecat').val('13');
                    } else if (raw_info.name.match(/mv/i)){
                        browsecat.options[11].selected = true;
                    } else {
                        browsecat.options[12].selected = true;
                    }
                    break;
                case '体育': browsecat.options[14].selected = true; break;
                case '软件': browsecat.options[15].selected = true;
            }

            //编码，馒头有两种标准——音频和视频先匹配音频，视频就会覆盖音频
            var codec_box = document.getElementsByTagName('select')[1];
            var audiocodec_dict = {'Flac': 5, 'APE': 6, 'DTS': 7, 'AC3': 8, 'WAV': 9, 'MP3': 10,
                                   'AAC': 14 };
            if (audiocodec_dict.hasOwnProperty(raw_info.audiocodec_sel)){
                var index = audiocodec_dict[raw_info.audiocodec_sel];
                codec_box.options[index].selected = true;
            }

            switch (raw_info.codec_sel){
                case 'H264': case 'X264':
                    codec_box.options[1].selected = true; break;
                case 'VC-1':
                    codec_box.options[2].selected = true; break;
                case 'XVID':
                    codec_box.options[3].selected = true; break;
                case 'MPEG-2':
                    codec_box.options[4].selected = true; break;
                case 'MPEG-4':
                    codec_box.options[11].selected = true; break;
                case 'H265': case 'X265':
                    codec_box.options[12].selected = true;
            }

            var standard_box = document.getElementsByTagName('select')[2];
            var standard_dict = {
                '4K': 5, '1080p': 1, '1080i': 2, '720p': 3, 'SD': 4, '': 0
            };
            if (standard_dict.hasOwnProperty(raw_info.standard_sel)){
                var index = standard_dict[raw_info.standard_sel];
                standard_box.options[index].selected = true;
            }
            var processing_box = document.getElementsByTagName('select')[3];
            var processing_dict = {'欧美': 2, '大陆': 1, '香港': 3, '台湾': 3, '日本': 4, '韩国': 5,
                                   '印度': 6, '': 6, '港台': 3};
            if (processing_dict.hasOwnProperty(raw_info.source_sel)){
                var index = processing_dict[raw_info.source_sel];
                processing_box.options[index].selected = true;
            }
        }

        else if (forward_site == 'CMCT'){
            var browsecat = document.getElementById('browsecat');
            var type_dict = {'电影': 1, '剧集': 2, '动漫': 4, '综艺': 5, '音乐': 8, '纪录': 3,
                             '体育': 6, '软件': 9, '学习': 9, '': 9};
            if (type_dict.hasOwnProperty(raw_info.type)){
                var index = type_dict[raw_info.type];
                browsecat.options[index].selected = true;
            }

            var medium_box = document.getElementsByName('medium_sel')[0];
            medium_box.options[12].selected = true;
            switch(raw_info.medium_sel){
                case 'UHD': case 'Blu-ray':
                    medium_box.options[1].selected = true; break;
                case 'DVD': medium_box.options[3].selected = true; break;
                case 'Remux': medium_box.options[2].selected = true; break;
                case 'HDTV': medium_box.options[7].selected = true; break;
                case 'WEB-DL':
                    if (raw_info.name.match(/webrip/i)){
                        medium_box.options[6].selected = true;
                    } else {
                        medium_box.options[5].selected = true;
                    }
                    break;
                case 'Encode': medium_box.options[4].selected = true; break;
                case 'DVD':
                    if (raw_info.name.match(/dvdrip/i)){
                        medium_box.options[10].selected = true;
                    } else {
                        medium_box.options[9].selected = true;
                    }
            }
            var codec_box = document.getElementsByName('codec_sel')[0];
            switch (raw_info.codec_sel){
                case 'H265': case 'X265':
                    codec_box.options[1].selected = true; break;
                case 'H264': case 'X264':
                    codec_box.options[2].selected = true; break;
                case 'XVID':
                    codec_box.options[3].selected = true; break;
                case 'MPEG-2': case 'MPEG-4':
                    codec_box.options[4].selected = true;
            }

            var audiocodec_box = document.getElementsByName('audiocodec_sel')[0];
            switch (raw_info.audiocodec_sel){

                case 'DTS-HD': case 'DTS-HDMA:X 7.1': case 'DTS-HDMA':
                    audiocodec_box.options[1].selected = true; break;
                case 'TrueHD': case 'Atmos':
                    audiocodec_box.options[2].selected = true; break;
                case 'LPCM':
                    audiocodec_box.options[3].selected = true; break;
                case 'DTS':
                    audiocodec_box.options[4].selected = true; break;
                case 'AC3':
                    audiocodec_box.options[5].selected = true; break;
                case 'AAC':
                    audiocodec_box.options[6].selected = true; break;
                case 'Flac':
                    audiocodec_box.options[7].selected = true; break;
                case 'APE':
                    audiocodec_box.options[8].selected = true; break;
                case 'WAV':
                    audiocodec_box.options[9].selected = true;
            }
            var standard_box = document.getElementsByName('standard_sel')[0];
            var standard_dict = {
                '4K': 1, '1080p': 2, '1080i': 3, '720p': 4, 'SD': 5, '': 0
            };
            if (standard_dict.hasOwnProperty(raw_info.standard_sel)){
                var index = standard_dict[raw_info.standard_sel];
                standard_box.options[index].selected = true;
            }

            var source_box = document.getElementsByName('source_sel')[0];
            var source_dict = {'欧美': 3, '大陆': 1, '香港': 2, '台湾': 2, '日本': 4, '韩国': 4, '日韩': 4,
                               '印度': 5, '': 5, '港台': 2};
            if (source_dict.hasOwnProperty(raw_info.source_sel)){
                var index = source_dict[raw_info.source_sel];
                source_box.options[index].selected = true;
            }

            var poster = document.getElementsByName('url_poster')[0];
            if (raw_info.descr.match(/\[img\](\S*?)\[\/img\]/i)){
                poster.value = raw_info.descr.match(/\[img\](\S*?)\[\/img\]/i)[1].split('=').pop();
            }

            descr_box[0].style.height = '120px';
            descr_box[1].style.height = '200px';
            descr_box[2].style.height = '600px';

            var info = get_mediainfo_picture_from_descr(raw_info.descr);
            var cmctinfos = info.mediainfo;//图片
            var cmctimgs = info.pic_info;//mediainfo

            //获取简介
            cmctdescr = raw_info.descr.slice(0,raw_info.descr.search(/\[quote\]/));
            cmctdescr = cmctdescr.replace(/\[img\]htt.*[\s\S]*?img\]/i, '');

            if (raw_info.imgs_cmct){
                descr_box[0].value = raw_info.imgs_cmct.trim();
            } else {
                descr_box[0].value = cmctimgs.replace(/\n\n+/g, '\n').trim();
            }
            if (raw_info.mediainfo_cmct){
                descr_box[1].value = raw_info.mediainfo_cmct.trim();
            } else {
                descr_box[1].value = cmctinfos.trim();
            }

            descr_box[2].value = raw_info.descr;

            var clear = document.createElement('input');
            clear.type = 'button';
            clear.value = " 清空附加信息 ";
            clear.id = 'clear';
            document.getElementById('qr').parentNode.insertBefore(clear, document.getElementById('qr'));
            $('#clear').css({'color': 'white', 'background' :'url(https://springsunday.net/styles/Maya/images/btn_submit_bg.gif) repeat left top', 'border': '1px black'});

            $('#clear').click(function(){
                descr_box[2].value = '';
                descr_box[2].style.height = '200px';
            });
        }

        else if (forward_site == 'TTG'){
            var browsecat = document.getElementsByTagName('select')[0];
            switch (raw_info.type){
                case '电影':
                    if (raw_info.medium_sel == 'Blu-ray'){
                        browsecat.options[24].selected = true;
                    } else if (raw_info.medium_sel == 'UHD') {
                        browsecat.options[26].selected = true;
                    } else if (raw_info.medium_sel == 'DVD' || raw_info.medium_sel == 'DVDRip'){
                        browsecat.options[21].selected = true;
                    } else {
                        if (raw_info.standard_sel == '720p'){
                            browsecat.options[22].selected = true;
                        } else if (raw_info.standard_sel == '1080p' || raw_info.standard_sel == '1080i'){
                            browsecat.options[23].selected = true;
                        } else if (raw_info.standard_sel == '4K'){
                            browsecat.options[25].selected = true;
                        }
                    }
                    break;

                case '纪录':
                    if (raw_info.medium_sel == 'Blu-ray' || raw_info.medium_sel == 'UHD'){
                        browsecat.options[29].selected = true;
                    } else {
                        if (raw_info.standard_sel == '720p'){
                            browsecat.options[27].selected = true;
                        } else if (raw_info.standard_sel == '1080p' || raw_info.standard_sel == '1080i'){
                            browsecat.options[28].selected = true;
                        } else if (raw_info.standard_sel == '4K'){
                            browsecat.options[25].selected = true;
                        }
                    }
                    break;

                case '剧集':
                    switch (raw_info.source_sel){

                        case '大陆': case '台湾': case '香港': case '港台':
                            //是否合集
                            if (raw_info.name.match(/(complete|S\d{2}[^E])/i) && (!raw_info.name.match(/E\d{2,3}/i))) {
                                browsecat.options[39].selected = true;
                            } else {
                                if (raw_info.standard_sel == '720p'){
                                    browsecat.options[34].selected = true;
                                } else if (raw_info.standard_sel == '1080p' || raw_info.standard_sel == '1080i'){
                                    browsecat.options[35].selected = true;
                                }
                            }

                            break;

                        case '日本':
                            if (raw_info.name.match(/(complete|S\d{2}[^E])/i)) {
                                browsecat.options[37].selected = true;
                            } else {
                                browsecat.options[32].selected = true;
                            }
                            break;
                        case '韩国':
                            if (raw_info.name.match(/(complete|S\d{2}[^E])/i)) {
                                browsecat.options[38].selected = true;
                            } else {
                                browsecat.options[33].selected = true;
                            }
                            break;

                        case '欧美':
                            if (raw_info.name.match(/(S\d{2}E\d{2})/i)) {
                                if (raw_info.standard_sel == '720p'){
                                    browsecat.options[30].selected = true;
                                } else if (raw_info.standard_sel == '1080p' || raw_info.standard_sel == '1080i'){
                                    browsecat.options[31].selected = true;
                                }
                            } else {
                                browsecat.options[36].selected = true;
                            }
                            break;
                    }
                    if (raw_info.standard_sel == '4K'){
                        browsecat.options[25].selected = true;
                    }
                    break;
                case '综艺':
                    if (raw_info.source_sel == '日本'){
                        browsecat.options[50].selected = true;
                    } else if (raw_info.source_sel == '韩国'){
                        browsecat.options[48].selected = true;
                    } else {
                        browsecat.options[49].selected = true;
                    }
                    break;

                case '动漫':
                    browsecat.options[47].selected = true; break;
                case '音乐':
                    if (raw_info.name.match(/(Flac|APE)/i)){
                        browsecat.options[44].selected = true;
                    } else {
                        browsecat.options[45].selected = true;
                    }
                    break;

                case '体育': browsecat.options[46].selected = true; break;
                case '软件': browsecat.options[56].selected = true; break;
                case '学习': browsecat.options[55].selected = true;
            }

            if (raw_info.name.match(/(pad$|ipad)/i)){
                browsecat.options[53].selected = true;
            }
            if (raw_info.url != ''){
                $("input[name='imdb_c']").val(raw_info.url.match(/tt\d+/i));
            }
        }

        else if (forward_site == 'OurBits'){
            var browsecat = document.getElementById('browsecat');
            switch (raw_info.type){
                case '电影':
                    if (raw_info.name.match(/3D/i)){
                        browsecat.options[2].selected = true;
                    } else {
                        browsecat.options[1].selected = true;
                    }
                    break;
                case '剧集':
                    if (raw_info.name.match(/(S\d{2}[^E]|complete)/i)){
                        browsecat.options[5].selected = true;
                    } else {
                        browsecat.options[4].selected = true;
                    }
                    break;
                case '音乐':
                    if (raw_info.small_descr.match(/音乐会/i)){
                        browsecat.options[3].selected = true;
                    } else if (raw_info.name.match(/MV/i)) {
                        browsecat.options[10].selected = true;
                    } else {
                        browsecat.options[11].selected = true;
                    }
                    break;

                case '综艺': browsecat.options[6].selected = true; break;
                case '纪录': browsecat.options[7].selected = true; break;
                case '动漫': browsecat.options[8].selected = true; break;
                case '体育': browsecat.options[9].selected = true;
            }

            switch(raw_info.medium_sel){
                case 'UHD': $("select[name='medium_sel']").val('12'); break;
                case 'Blu-ray': $("select[name='medium_sel']").val('1'); break;
                case 'HDTV': $("select[name='medium_sel']").val('5'); break;
                case 'WEB-DL': $("select[name='medium_sel']").val('9'); break;
                case 'Encode': $("select[name='medium_sel']").val('7'); break;
                case 'DVD': $("select[name='medium_sel']").val('2');
            }

            switch (raw_info.codec_sel){
                case 'H265': case 'X265':
                    $("select[name='codec_sel']").val('14'); break;
                case 'H264': case 'X264':
                    $("select[name='codec_sel']").val('12'); break;
                case 'XVID':
                    $("select[name='codec_sel']").val('17'); break;
                case 'VC-1':
                    $("select[name='codec_sel']").val('16'); break;
                case 'MPEG-2': case 'MPEG-4':
                    $("select[name='codec_sel']").val('15'); break;
                case '':
                    $("select[name='codec_sel']").val('18');
            }

            switch (raw_info.audiocodec_sel){
                case 'DTS-HDMA:X 7.1': case 'DTS-HDMA': case 'DTS-HD':
                    $("select[name='audiocodec_sel']").val('1'); break;
                case 'Atmos':
                    $("select[name='audiocodec_sel']").val('14'); break;
                case 'TrueHD':
                    $("select[name='audiocodec_sel']").val('2'); break;
                case 'LPCM':
                    $("select[name='audiocodec_sel']").val('5'); break;
                case 'DTS':
                    if (raw_info.name.match(/DTS.?X[^ \d]/i)){
                        $("select[name='audiocodec_sel']").val('21');
                    } else {
                        $("select[name='audiocodec_sel']").val('4');
                    }
                    break;
                case 'AC3':
                    $("select[name='audiocodec_sel']").val('6'); break;
                case 'AAC':
                    $("select[name='audiocodec_sel']").val('7'); break;
                case 'Flac':
                    $("select[name='audiocodec_sel']").val('13'); break;
                case 'APE':
                    $("select[name='audiocodec_sel']").val('12'); break;
                case 'WAV':
                    $("select[name='audiocodec_sel']").val('11');
            }

            var standard_dict = {
                '4K': '5', '1080p': '1', '1080i': '2', '720p': '3', 'SD': '4', '': '0'
            };
            if (standard_dict.hasOwnProperty(raw_info.standard_sel)){
                var index = standard_dict[raw_info.standard_sel];
                $("select[name='standard_sel']").val(index);
            }

            var source_dict = {'欧美': '2', '大陆': '1', '香港': '3', '台湾': '3', '日本': '4', '韩国': '5', '印度': 6, '': 6};
            if (source_dict.hasOwnProperty(raw_info.source_sel)){
                var index = source_dict[raw_info.source_sel];
                $("select[name='processing_sel']").val(index);
            }
        }

        else if (forward_site == 'HDChina'){

            switch (raw_info.type){
                case '电影':
                    if (raw_info.medium_sel == 'Blu-ray' || raw_info.medium_sel == 'UHD'){
                        if (raw_info.standard_sel == '4K'){
                            $('#browsecat').val('410');
                        } else{
                            $('#browsecat').val('20');
                        }
                    } else {
                        if (raw_info.standard_sel == '720p'){
                            $('#browsecat').val('9');
                        } else if(raw_info.standard_sel == '1080i'){
                            $('#browsecat').val('16');
                        } else if (raw_info.standard_sel == '1080p'){
                            $('#browsecat').val('17');
                        }
                    }
                    break;
                case '剧集':
                    switch (raw_info.source_sel){

                        case '大陆': case '台湾': case '香港': case '港台':
                            //是否合集
                            if (raw_info.name.match(/(complete|S\d{2}[^E])/i) && (!raw_info.name.match(/E\d{2,3}/i))) { //合集
                                $('#browsecat').val('22');
                            } else {
                                $('#browsecat').val('25');
                            }
                            break;

                        case '日本':
                            if (raw_info.name.match(/(complete|S\d{2}[^E])/i)) {
                                $('#browsecat').val('23');
                            } else {
                                $('#browsecat').val('24');
                            }
                            break;
                        case '韩国':
                            if (raw_info.name.match(/(complete|S\d{2}[^E])/i)) {
                                $('#browsecat').val('23');
                            } else {
                                $('#browsecat').val('24');
                            }
                            break;

                        case '欧美':
                            //单集
                            if (raw_info.name.match(/(S\d{2}E\d{2})/i)) {
                                $('#browsecat').val('13');
                            } else {
                                $('#browsecat').val('21');
                            }
                            break;
                    }
                    break;
                case '音乐':
                    if (raw_info.small_descr.match(/音乐会/i)){
                        $('#browsecat').val('402');
                    } else if (raw_info.name.match(/MV/i)) {
                        $('#browsecat').val('406');
                    } else {
                        $('#browsecat').val('408');
                    }
                    break;

                case '综艺': $('#browsecat').val('401');  break;
                case '动漫': $('#browsecat').val('14');  break;
                case '学习': $('#browsecat').val('404');  break;
                case '纪录': $('#browsecat').val('5');  break;
                case '动漫': $('#browsecat').val('14');  break;
                case '体育': $('#browsecat').val('15');
            }
            if (raw_info.name.match(/(pad$|ipad)/i)){
                $('#browsecat').val('27');
            }
            $('#share_rule').val('3');

            //格式
            $("select[name='standard_sel']").val('10'); //默认其它
            switch (raw_info.standard_sel){
                case '8K': $("select[name='standard_sel']").val('19'); break;
                case '4K': $("select[name='standard_sel']").val('17'); break;
                case '2K': $("select[name='standard_sel']").val('18'); break;
                case '1080p': $("select[name='standard_sel']").val('11'); break;
                case '1080i': $("select[name='standard_sel']").val('12'); break;
                case '720p': $("select[name='standard_sel']").val('13'); break;
                case 'SD': $("select[name='standard_sel']").val('15');
            }

            $("select[name='medium_sel']").val('15');  //默认其它
            if (raw_info.name.match(/MiniBD/i)) {
                $("select[name='medium_sel']").val('2');
            }
            else {
                switch (raw_info.medium_sel){
                    case 'UHD': case 'Blu-ray':
                        $("select[name='medium_sel']").val('11'); break;
                    case 'HDTV': $("select[name='medium_sel']").val('13'); break;
                    case 'WEB-DL': $("select[name='medium_sel']").val('21'); break;
                    case 'Encode': $("select[name='medium_sel']").val('5'); break;
                    case 'Remux': $("select[name='medium_sel']").val('6'); break;
                    case 'DVD':
                        if (raw_info.name.match(/DVDR/i)) {
                            $("select[name='medium_sel']").val('4');
                        } else if (raw_info.name.match(/HD.?DVD/i)){
                            $("select[name='medium_sel']").val('12');
                        } else {
                            $("select[name='medium_sel']").val('14');
                        }
                }
            }

            switch (raw_info.codec_sel){
                case 'H265': case 'X265':
                    $("select[name='codec_sel']").val('10'); break;
                case 'H264':
                    $("select[name='codec_sel']").val('1'); break;
                case 'X264':
                    $("select[name='codec_sel']").val('6'); break;
                case 'XVID':
                    $("select[name='codec_sel']").val('3'); break;
                case 'VC-1':
                    $("select[name='codec_sel']").val('2'); break;
                case 'MPEG-2': case 'MPEG-4':
                    $("select[name='codec_sel']").val('4'); break;
                case '':
                    $("select[name='codec_sel']").val('5');
            }

            //音频编码
            $("select[name='audiocodec_sel']").val('7'); //默认其它
            switch (raw_info.audiocodec_sel){
                case 'DTS-HDMA:X 7.1': case 'DTS-HDMA':
                    $("select[name='audiocodec_sel']").val('12'); break;
                case 'Atmos':
                    $("select[name='audiocodec_sel']").val('15'); break;
                case 'TrueHD':
                    $("select[name='audiocodec_sel']").val('13'); break;
                case 'LPCM':
                    $("select[name='audiocodec_sel']").val('11'); break;
                case 'DTS': case 'DTS-HD':
                    if (raw_info.name.match(/DTS.?X[^ \d]/i)){
                        $("select[name='audiocodec_sel']").val('14');
                    } else {
                        $("select[name='audiocodec_sel']").val('3');
                    }
                    break;
                case 'AC3':
                    $("select[name='audiocodec_sel']").val('8'); break;
                case 'AAC':
                    $("select[name='audiocodec_sel']").val('6'); break;
                case 'Flac':
                    $("select[name='audiocodec_sel']").val('1'); break;
                case 'APE':
                    $("select[name='audiocodec_sel']").val('2'); break;
                case 'MP3':
                    $("select[name='audiocodec_sel']").val('4'); break;
                case 'WAV':
                    $("select[name='audiocodec_sel']").val('9');
            }


            //海报，从简介获取
            reg_img = raw_info.descr.match(/\[img\](.*?)\[\/img\][\s\S]+?(主.{0,6}演|译.{0,6}名)/i);
            if (reg_img){
                $('#cover').val(reg_img[1]);
            }

            $("select[name='team_sel']").val('5');
        }

        else if (forward_site == 'PThome'){
            var browsecat = document.getElementById('browsecat');
            var type_dict = {'电影': 1, '剧集': 4, '动漫': 3, '综艺': 5, '音乐': 7, '纪录': 2,
                             '体育': 6, '软件': 9, '学习': 10, '游戏': 8};
            browsecat.options[11].selected = true;//默认其他
            if (type_dict.hasOwnProperty(raw_info.type)){
                var index = type_dict[raw_info.type];
                browsecat.options[index].selected = true;
            }
            if (raw_info.type == '音乐' && raw_info.name.match(/mv/i)){
                browsecat.options[6].selected = true;
            }
            if (raw_info.name.match(/-HDSPad/i)){
                 browsecat.options[1].selected = true;
            }

            var evt = document.createEvent("HTMLEvents");
            evt.initEvent("change", false, true);
            document.getElementById('browsecat').dispatchEvent(evt);

            //媒介
            var medium_box = document.getElementsByName('medium_sel')[0];
            medium_box.options[12].selected = true; //默认其他
            switch(raw_info.medium_sel){
                case 'UHD':
                    if (raw_info.name.match(/DIY|@/i)){
                        medium_box.options[1].selected = true;
                    } else{
                        medium_box.options[1].selected = true;
                    }
                    break;
                case 'Blu-ray':
                    if (raw_info.name.match(/DIY|@/i)){
                        medium_box.options[4].selected = true;
                    } else{
                        medium_box.options[3].selected = true;
                    }
                    break;

                case 'DVD': medium_box.options[9].selected = true; break;
                case 'Remux': medium_box.options[5].selected = true; break;
                case 'HDTV': medium_box.options[6].selected = true; break;
                case 'Encode': medium_box.options[7].selected = true; break;
                case 'WEB-DL': medium_box.options[8].selected = true;
            }

            //视频编码
            var codec_box = document.getElementsByName('codec_sel')[0];
            codec_box.options[5].selected = true;
            switch (raw_info.codec_sel){
                case 'H265': case 'X265':
                    codec_box.options[1].selected = true; break;
                case 'H264': case 'X264':
                    codec_box.options[2].selected = true; break;
                case 'VC-1':
                    codec_box.options[3].selected = true; break;
                case 'MPEG-2': case 'MPEG-4':
                    codec_box.options[4].selected = true;
            }

            //音频编码
            var audiocodec_box = document.getElementsByName('audiocodec_sel')[0];
            audiocodec_box.options[10].selected = true;
            switch (raw_info.audiocodec_sel){
                case 'DTS-HD': case 'DTS-HDMA:X 7.1': case 'DTS-HDMA':
                    audiocodec_box.options[1].selected = true; break;
                case 'TrueHD': case 'Atmos':
                    audiocodec_box.options[2].selected = true; break;
                case 'LPCM':
                    audiocodec_box.options[3].selected = true; break;
                case 'DTS':
                    audiocodec_box.options[4].selected = true; break;
                case 'AC3':
                    audiocodec_box.options[5].selected = true; break;
                case 'AAC':
                    audiocodec_box.options[6].selected = true; break;
                case 'Flac':
                    audiocodec_box.options[7].selected = true; break;
                case 'APE':
                    audiocodec_box.options[8].selected = true; break;
                case 'WAV':
                    audiocodec_box.options[9].selected = true;
            }
            if (raw_info.name.match(/Atmos/i)){
                audiocodec_box.options[2].selected = true;
            }

            //分辨率
            var standard_box = document.getElementsByName('standard_sel')[0];
            var standard_dict = {
                '8K': 1, '4K': 2, '1080p': 3, '1080i': 4, '720p': 5, 'SD': 6, '': 0
            };
            if (standard_dict.hasOwnProperty(raw_info.standard_sel)){
                var index = standard_dict[raw_info.standard_sel];
                standard_box.options[index].selected = true;
            }
        }

        else if (forward_site == 'HDHome'){
            function disableother(select,target)
            {
                if (document.getElementById(select).value == 0)
                    document.getElementById(target).disabled = false;
                else {
                document.getElementById(target).disabled = true;
                document.getElementById(select).disabled = false;
                }
            }
            //类型
            var is_pad = false;
            if (raw_info.name.match(/pad$|ipad/i)){
                is_pad = true;
            }
            switch (raw_info.type){

                case '电影':
                    if (raw_info.medium_sel == 'Blu-ray'){
                        set_selected_option_by_value('browsecat','450');
                    } else if(raw_info.medium_sel == 'UHD'){
                        set_selected_option_by_value('browsecat','499');
                    } else if(raw_info.medium_sel == 'Remux'){
                        set_selected_option_by_value('browsecat','415');
                    } else {
                        if (is_pad){
                            set_selected_option_by_value('browsecat','412');
                        } else{
                            if (raw_info.standard_sel == '720p'){
                                set_selected_option_by_value('browsecat','413');
                            } else if(raw_info.standard_sel == '1080i' || raw_info.standard_sel == '1080p'){
                                set_selected_option_by_value('browsecat','414');
                            } else if (raw_info.standard_sel == '4K'){
                                set_selected_option_by_value('browsecat','416');
                            } else if (raw_info.standard_sel == 'SD'){
                                set_selected_option_by_value('browsecat','411');
                            }
                        }

                    }
                    break;
                case '剧集':
                    if (raw_info.medium_sel == 'Blu-ray' || raw_info.medium_sel == 'UHD'){
                        if (raw_info.standard_sel == '4K'){
                            set_selected_option_by_value('browsecat','502');
                        } else{
                            set_selected_option_by_value('browsecat','453');
                        }
                    }  else if(raw_info.medium_sel == 'Remux'){
                        set_selected_option_by_value('browsecat','437');
                    } else {
                        if (is_pad){
                            set_selected_option_by_value('browsecat','433');
                        } else{
                            if (raw_info.standard_sel == '720p'){
                                set_selected_option_by_value('browsecat','434');
                            } else if(raw_info.standard_sel == '1080i'){
                                set_selected_option_by_value('browsecat','435');
                            } else if (raw_info.standard_sel == '1080p'){
                                set_selected_option_by_value('browsecat','436');
                            } else if (raw_info.standard_sel == '4K'){
                                set_selected_option_by_value('browsecat','438');
                            } else if (raw_info.standard_sel == 'SD'){
                                set_selected_option_by_value('browsecat','432');
                            }
                        }

                    }

                    break;
                case '音乐':
                    if (raw_info.name.match(/MV/i)) {
                        set_selected_option_by_value('browsecat','441');
                    } else if (raw_info.name.match(/APE/i)) {
                        set_selected_option_by_value('browsecat','439');
                    } else if (raw_info.name.match(/Flac/i)) {
                        set_selected_option_by_value('browsecat','440');
                    }
                    break;

                case '综艺':
                    if (raw_info.medium_sel == 'Blu-ray' || raw_info.medium_sel == 'UHD'){
                        set_selected_option_by_value('browsecat','452');
                    } else if(raw_info.medium_sel == 'Remux'){
                        set_selected_option_by_value('browsecat','430');
                    } else {
                        if (is_pad){
                            set_selected_option_by_value('browsecat','426');
                        } else{
                            if (raw_info.standard_sel == '720p'){
                                set_selected_option_by_value('browsecat','427');
                            } else if(raw_info.standard_sel == '1080i'){
                                set_selected_option_by_value('browsecat','428');
                            } else if (raw_info.standard_sel == '1080p'){
                                set_selected_option_by_value('browsecat','429');
                            } else if (raw_info.standard_sel == '4K'){
                                set_selected_option_by_value('browsecat','431');
                            } else if (raw_info.standard_sel == 'SD'){
                                set_selected_option_by_value('browsecat','425');
                            }
                        }

                    }
                    break;
                case '纪录':
                    if (raw_info.medium_sel == 'Blu-ray'){
                        set_selected_option_by_value('browsecat','451');
                    } else if (raw_info.medium_sel == 'UHD'){
                        set_selected_option_by_value('browsecat','500');
                    } else if(raw_info.medium_sel == 'Remux'){
                        set_selected_option_by_value('browsecat','421');
                    } else {
                        if (is_pad){
                            set_selected_option_by_value('browsecat','418');
                        } else{
                            if (raw_info.standard_sel == '720p'){
                                set_selected_option_by_value('browsecat','419');
                            } else if(raw_info.standard_sel == '1080i' || raw_info.standard_sel == '1080p'){
                                set_selected_option_by_value('browsecat','420');
                            } else if (raw_info.standard_sel == '4K'){
                                set_selected_option_by_value('browsecat','422');
                            } else if (raw_info.standard_sel == 'SD'){
                                set_selected_option_by_value('browsecat','417');
                            }
                        }

                    }

                    break;

                case '动漫':
                    if (raw_info.medium_sel == 'Blu-ray'){
                        set_selected_option_by_value('browsecat','454');
                    } else if (raw_info.medium_sel == 'UHD'){
                        set_selected_option_by_value('browsecat','501');
                    } else if(raw_info.medium_sel == 'Remux'){
                        set_selected_option_by_value('browsecat','448');
                    } else {
                        if (is_pad){
                            set_selected_option_by_value('browsecat','445');
                        } else{
                            if (raw_info.standard_sel == '720p'){
                                set_selected_option_by_value('browsecat','446');
                            } else if(raw_info.standard_sel == '1080i' || raw_info.standard_sel == '1080p'){
                                set_selected_option_by_value('browsecat','447');
                            } else if (raw_info.standard_sel == '4K'){
                                set_selected_option_by_value('browsecat','449');
                            } else if (raw_info.standard_sel == 'SD'){
                                set_selected_option_by_value('browsecat','444');
                            }
                        }

                    }
                    break;
                case '学习': set_selected_option_by_value('browsecat','409');  break;
                case '体育':
                    if (raw_info.standard_sel == '720p'){
                        set_selected_option_by_value('browsecat','442');
                    } else if(raw_info.standard_sel == '1080i' || raw_info.standard_sel == '1080p'){
                        set_selected_option_by_value('browsecat','443');
                    }
            }

            disableother('browsecat','specialcat');

            //来源
            var source_box = document.getElementsByName('source_sel')[0];
            source_box.options[6].selected=true;
            switch(raw_info.medium_sel){
                case 'UHD': source_box.options[1].selected=true; break;
                case 'Blu-ray': source_box.options[2].selected=true; break;
                case 'Encode': source_box.options[2].selected = true; break;
                case 'HDTV': source_box.options[3].selected=true; break;
                case 'WEB-DL': source_box.options[5].selected=true; break;
                case 'DVD': source_box.options[4].selected=true;
            }

            //媒介
            var medium_box = document.getElementsByName('medium_sel')[0];
            switch(raw_info.medium_sel){
                case 'UHD': medium_box.options[1].selected = true; break;
                case 'Blu-ray': medium_box.options[2].selected = true; break;
                case 'DVD': medium_box.options[6].selected = true; break;
                case 'Remux': medium_box.options[3].selected = true; break;
                case 'HDTV': medium_box.options[5].selected = true; break;
                case 'Encode': medium_box.options[4].selected = true; break;
                case 'WEB-DL': medium_box.options[8].selected = true;
            }
            if (raw_info.name.match(/MiniBD/i)){
                medium_box.options[7].selected = true;
            }

            //视频编码
            var codec_box = document.getElementsByName('codec_sel')[0];
            codec_box.options[5].selected = true;
            switch (raw_info.codec_sel){
                case 'H265': case 'X265':
                    if (raw_info.name.match(/HEVC/i)){
                        codec_box.options[6].selected = true;
                    } else {
                        codec_box.options[2].selected = true;
                    }
                    break;
                case 'H264': case 'X264':
                    codec_box.options[1].selected = true; break;
                case 'VC-1':
                    codec_box.options[3].selected = true; break;
                case 'MPEG-2': case 'MPEG-4':
                    codec_box.options[4].selected = true;
            }

            //音频编码
            var audiocodec_box = document.getElementsByName('audiocodec_sel')[0];
            audiocodec_box.options[13].selected = true;

            switch (raw_info.audiocodec_sel){
                case 'DTS-HD': audiocodec_box.options[9].selected = true; break;
                case 'DTS-HDMA:X 7.1': audiocodec_box.options[12].selected = true; break;
                case 'DTS-HDMA': audiocodec_box.options[9].selected = true; break;
                case 'TrueHD': audiocodec_box.options[7].selected = true; break;
                case 'Atmos': audiocodec_box.options[11].selected = true; break;
                case 'LPCM': audiocodec_box.options[8].selected = true; break;
                case 'DTS': audiocodec_box.options[6].selected = true; break;
                case 'AC3': audiocodec_box.options[2].selected = true; break;
                case 'AAC': audiocodec_box.options[1].selected = true; break;
                case 'Flac': audiocodec_box.options[5].selected = true; break;
                case 'APE': audiocodec_box.options[3].selected = true; break;
                case 'WAV': audiocodec_box.options[4].selected = true;
            }

            if (raw_info.name.match(/DTS-?HD.?HRA/i)){
                audiocodec_box.options[10].selected = true;
            }

            //分辨率
            var standard_box = document.getElementsByName('standard_sel')[0];
            var standard_dict = {
                '4K': 1, '1080p': 2, '1080i': 3, '720p': 4, 'SD': 5, '': 0
            };
            if (standard_dict.hasOwnProperty(raw_info.standard_sel)){
                var index = standard_dict[raw_info.standard_sel];
                standard_box.options[index].selected = true;
            }
        }

        else if (forward_site == 'HDSky'){
            try{
                var browsecat = document.getElementById('browsecat');

                switch (raw_info.type){

                    case '电影': browsecat.options[1].selected = true;  break;
                    case '剧集': browsecat.options[6].selected = true;  break;
                    case '纪录': browsecat.options[2].selected = true;  break;
                    case '动漫': browsecat.options[4].selected = true;  break;
                    case '综艺': browsecat.options[7].selected = true;  break;
                    case '音乐': browsecat.options[8].selected = true;  break;
                    case '体育': browsecat.options[9].selected = true;  break;
                    case '学习': browsecat.options[11].selected = true;  break;
                    case '软件': browsecat.options[11].selected = true;

                }
                if (raw_info.name.match(/(pad$|ipad)/i)){
                    browsecat.options[3].selected = true;
                }

                //音频编码
                var audiocodec_box = document.getElementsByName('audiocodec_sel')[0];
                var audiocodec_dict = {'Flac': 7, 'APE': 8, 'DTS': 5, 'AC3': 12, 'WAV': 15, 'MP3': 9,
                                       'AAC': 11, 'DTS-HDMA': 1, 'Atmos': 3, 'TrueHD': 4, 'LPCM': 6};
                if (audiocodec_dict.hasOwnProperty(raw_info.audiocodec_sel)){
                    var index = audiocodec_dict[raw_info.audiocodec_sel];
                    audiocodec_box.options[index].selected = true;
                }

                //分辨率
                var standard_box = document.getElementsByName('standard_sel')[0];
                var standard_dict = {'4K': 1, '1080p': 2, '1080i': 3, '720p': 4, 'SD': 5, '': 0 };
                if (standard_dict.hasOwnProperty(raw_info.standard_sel)){
                    var index = standard_dict[raw_info.standard_sel];
                    standard_box.options[index].selected = true;
                }

                //视频编码
                var codec_box = document.getElementsByName('codec_sel')[0];
                //alert(codec_box.innerHTML)
                var codec_dict = {'H264': 1, 'X265': 2, 'X264': 3, 'H265': 4, 'VC-1': 5, 'MPEG-2': 6, 'Xvid': 7, '': 8 };
                if (codec_dict.hasOwnProperty(raw_info.codec_sel)){
                    var index = codec_dict[raw_info.codec_sel];
                    codec_box.options[index].selected = true;
                }
                //单独对x264和x265匹配
                if (raw_info.codec_sel == 'H264'){
                    if (raw_info.name.match(/X264/i)){
                        codec_box.options[3].selected = true;
                    }
                }
                if (raw_info.codec_sel == 'H265'){
                    if (raw_info.name.match(/X265/i)){
                        codec_box.options[2].selected = true;
                    }
                }

                //媒介
                var medium_box = document.getElementsByName('medium_sel')[0];
                var medium_dict = {'UHD': 1, 'Blu-ray': 3, 'Encode': 6, 'HDTV': 7, 'WEB-DL': 12, 'Remux': 5};
                if (medium_dict.hasOwnProperty(raw_info.medium_sel)){
                    var index = medium_dict[raw_info.medium_sel];
                    medium_box.options[index].selected = true;
                }
                switch (raw_info.medium_sel){
                    case 'UHD':
                        if (raw_info.name.match(/(diy|@)/i)) {
                            medium_box.options[2].selected = true;
                        }
                        break;
                    case 'Blu-ray':
                        if (raw_info.name.match(/(diy|@)/i)) {
                            medium_box.options[4].selected = true;
                        }
                }

                // 制作组
                document.getElementsByName('team_sel')[0].options[10].selected = true;
            } catch(err) {
                alert(err);
            }
        }

        else if (forward_site == 'CHDBits') {
            try {
                var browsecat = document.getElementById('browsecat');
                var type_dict = {
                    '电影': 1,
                    '剧集': 4,
                    '动漫': 3,
                    '综艺': 5,
                    '音乐': 6,
                    '纪录': 2,
                    '体育': 7
                };
                //如果当前类型在上述字典中
                if (type_dict.hasOwnProperty(raw_info.type)) {
                    var index = type_dict[raw_info.type];
                    browsecat.options[index].selected = true;
                }
                var audiocodec_box = document.getElementsByName('audiocodec_sel')[0];
                var audiocodec_dict = {
                    'Flac': 6,
                    'APE': 7,
                    'AC3': 2,
                    'WAV': 8,
                    'Atmos': 4,
                    'AAC': 9,
                    'DTS-HDMA': 3,
                    'TrueHD Atmos': 4,
                    'TrueHD': 4,
                    'DTS': 1,
                    'LPCM': 5,
                    'DTS-HDMA:X 7.1': 3
                };
                if (audiocodec_dict.hasOwnProperty(raw_info.audiocodec_sel)) {
                    var index = audiocodec_dict[raw_info.audiocodec_sel];
                    audiocodec_box.options[index].selected = true;
                }
                var standard_box = document.getElementsByName('standard_sel')[0];
                var standard_dict = {
                    '8K': 5,
                    '4K': 6,
                    '1080p': 1,
                    '1080i': 2,
                    '720p': 3,
                    'SD': 4,
                    '': 4
                };
                if (standard_dict.hasOwnProperty(raw_info.standard_sel)) {
                    var index = standard_dict[raw_info.standard_sel];
                    standard_box.options[index].selected = true;
                }

                var codec_box = document.getElementsByName('codec_sel')[0];
                var codec_dict = { 'H264': 1, 'X265': 2, 'X264': 1, 'H265': 2, 'VC-1': 5, 'MPEG-2': 4 };
                if (codec_dict.hasOwnProperty(raw_info.codec_sel)) {
                    var index = codec_dict[raw_info.codec_sel];
                    codec_box.options[index].selected = true;
                }

                var medium_box = document.getElementsByName('medium_sel')[0];
                var medium_dict = { 'UHD': 2, 'Blu-ray': 1, 'Encode': 4, 'HDTV': 5, 'WEB-DL': 6, 'Remux': 3 };
                if (medium_dict.hasOwnProperty(raw_info.medium_sel)) {
                    var index = medium_dict[raw_info.medium_sel];
                    medium_box.options[index].selected = true;
                }
                switch (raw_info.medium_sel) {
                    case 'UHD':
                        if (raw_info.name.match(/(diy|@)/i)) {
                            medium_box.options[2].selected = true;
                        }
                        break;
                    case 'Blu-ray':
                        if (raw_info.name.match(/(diy|@)/i)) {
                            medium_box.options[4].selected = true;
                        }
                }

            } catch (err) {
                alert(err);
            }
        }

        else if (forward_site == 'LemonHD') {
            if (LemonHD_music || LemonHD_animate) {
                return;
            }
            switch (raw_info.type) {
                case '电影':
                    $('#browsecat').val("401"); break;
                case '纪录':
                    $('#browsecat').val("404"); break;
                case '剧集':
                    $('#browsecat').val("402"); break;
                case '综艺':
                    $('#browsecat').val("403"); break;
                case '体育':
                    $('#browsecat').val("407"); break;
                case '学习':
                    $('#browsecat').val("421"); break;
                case '游戏':
                    $('#browsecat').val("422"); break;
                default:
                    $('#browsecat').val("409");
            }

            var audiocodec_box = document.getElementsByName('audiocodec_sel')[0];
            var audiocodec_dict = {
                'Flac': 7,
                'APE': 7,
                'AC3': 9,
                'WAV': 8,
                'Atmos': 1,
                'AAC': 8,
                'DTS-HDMA': 4,
                'Atmos': 1,
                'TrueHD': 2,
                'DTS': 6,
                'LPCM': 10,
                'DTS-HDMA:X 7.1': 4,
                'DTS-HDHR': 5,
                'DTS-X': 3
            };
            if (raw_info.audiocodec_sel == 'DTS-HD') {
                if (raw_info.name.match(/DTS-HD.?HR/i)) {
                    raw_info.audiocodec_sel = 'DTS-HDHR'
                } else {
                    raw_info.audiocodec_sel = 'DTS-HDMA'
                }
            }
            if (audiocodec_dict.hasOwnProperty(raw_info.audiocodec_sel)) {
                var index = audiocodec_dict[raw_info.audiocodec_sel];
                audiocodec_box.options[index].selected = true;
            }
            if (raw_info.name.match(/wiki/i)) {

                var temp_info_wiki = "";
                temp_info_wiki = raw_info.descr.slice(raw_info.descr.search(/Media.Info/), raw_info.descr.search(/x264.Info/));
                if (temp_info_wiki.match(/AUDiO CODEC[\s\S]{0,30}DTS/i)) {
                    audiocodec_box.options[6].selected = true;
                } else
                    audiocodec_box.options[9].selected = true;
            }

            var medium_box = document.getElementsByName('medium_sel')[0];
            var medium_dict = { 'UHD': 1, 'Blu-ray': 2, 'Encode': 4, 'HDTV': 5, 'WEB-DL': 6, 'Remux': 3 };
            if (medium_dict.hasOwnProperty(raw_info.medium_sel)) {
                var index = medium_dict[raw_info.medium_sel];
                medium_box.options[index].selected = true;
            }
            if (raw_info.name.match(/x264|x265/i)) {
                medium_box.options[4].selected = true;
            }
            if (raw_info.name.match(/WEB|WEB-DL/i)) {
                medium_box.options[6].selected = true;
            }
            if (raw_info.name.match(/remux/i)) {
                medium_box.options[3].selected = true;
            }

            var codec_box = document.getElementsByName('codec_sel')[0];
            var codec_dict = { 'H264': 1, 'X265': 5, 'X264': 6, 'H265': 2, 'VC-1': 3, 'MPEG-2': 4, 'MPEG-4': 1 };
            if (codec_dict.hasOwnProperty(raw_info.codec_sel)) {
                var index = codec_dict[raw_info.codec_sel];
                codec_box.options[index].selected = true;
            }
            if (raw_info.name.match(/x264/i)) {
                codec_box.options[6].selected = true;
            }

            var team_box = document.getElementsByName('processing_sel')[0];
            var team_dict = { '欧美': 3, '大陆': 1, '香港': 2, '台湾': 8, '日本': 4, '韩国': 4, '印度': 6, '其他': 6 };
            if (team_dict.hasOwnProperty(raw_info.source_sel)) {
                var index = team_dict[raw_info.source_sel];
                team_box.options[index].selected = true;
            }

            var standard_box = document.getElementsByName('standard_sel')[0];
            var standard_dict = {'8K': 1, '4K': 2, '1080p': 3, '1080i': 3, '720p': 4, 'SD': 5, '': 5};
            if (standard_dict.hasOwnProperty(raw_info.standard_sel)) {
                var index = standard_dict[raw_info.standard_sel];
                standard_box.options[index].selected = true;
            }

            var tag_zz = document.getElementsByName('tag_zz')[0];
            if (raw_info.descr.match(/SUBTITLE[\s\S]{0,30}CHS|SUBTITLE[\s\S]{0,30}Cht|SUBTITLE.*Chinese/i) || raw_info.descr.match(/Language[\s\S]{0,50}Chinese|Graphics[\s\S]{0,30}Chinese/i)) {
                tag_zz.checked = true;
            }
            var tag_diy = document.getElementsByName('tag_diy')[0];
            var tag_3d = document.getElementsByName('tag_3d')[0];
            if (raw_info.descr.match(/.MPLS/i) || raw_info.medium_sel == 'Blu-ray' || raw_info.medium_sel == 'UHD') {
                if (raw_info.name.match(/@|diy/i)) {
                    tag_diy.options[1].selected = true;
                } else {
                    tag_diy.options[2].selected = true;
                }
                if (raw_info.name.match(/3D/)) {
                    tag_3d.options[2].selected = true;
                } else {
                    tag_3d.options[1].selected = true;
                }
            }
            var tag_gold = document.getElementsByName('tag_gold')[0];
            if (raw_info.golden_torrent == true) {
                tag_gold.checked = true;
            }
            document.getElementsByName('from_url')[0].value = raw_info.origin_url.replace('***', '/');
        }

        else if (forward_site == 'HUDBT') {
            //类型
            switch (raw_info.type){
                case '电影':
                    if (raw_info.source_sel == '欧美'){
                        set_selected_option_by_value('browsecat', '415');
                    } else if (raw_info.source_sel == '大陆') {
                        set_selected_option_by_value('browsecat', '401');
                    } else if (['港台', '香港', '台湾'].indexOf(raw_info.source_sel)>-1){
                        set_selected_option_by_value('browsecat', '413');
                    } else if (['日本', '韩国', '日韩', '印度'].indexOf(raw_info.source_sel)>-1){
                        set_selected_option_by_value('browsecat', '414');
                    }
                    break;
                case '纪录': set_selected_option_by_value('browsecat', '404'); break;
                case '剧集':
                    switch (raw_info.source_sel){
                        case '大陆': set_selected_option_by_value('browsecat', '402'); break;
                        case '台湾': case '香港': case '港台':
                            set_selected_option_by_value('browsecat', '417'); break;
                        case '日本': case '韩国': case '日韩': case '印度':
                            set_selected_option_by_value('browsecat', '416'); break;
                        case '欧美': set_selected_option_by_value('browsecat', '418');
                    }
                    break;

                case '综艺':
                    switch (raw_info.source_sel){
                        case '大陆': set_selected_option_by_value('browsecat', '403'); break;
                        case '台湾': case '香港': case '港台':
                            set_selected_option_by_value('browsecat', '419');
                            break;
                        case '日本': case '韩国': case '日韩':
                            set_selected_option_by_value('browsecat', '420');
                            break;
                        case '欧美': set_selected_option_by_value('browsecat', '421');
                    }
                    break;

                case '动漫': set_selected_option_by_value('browsecat', '427'); break;
                //太乱，随便匹配一个
                case '音乐': set_selected_option_by_value('browsecat', '408'); break;

                case '体育': set_selected_option_by_value('browsecat', '407'); break;
                case '软件': set_selected_option_by_value('browsecat', '411'); break;
                case '学习': set_selected_option_by_value('browsecat', '412');
            }

            //分辨率
            var standard_box = document.getElementsByName('standard_sel')[0];
            var standard_dict = {
                '4K': 0, '1080p': 1, '1080i': 2, '720p': 3, 'SD': 4, '': 0
            };
            if (standard_dict.hasOwnProperty(raw_info.standard_sel)){
                var index = standard_dict[raw_info.standard_sel];
                standard_box.options[index].selected = true;
            }
        }

        else if (forward_site == 'NanYang'){
            var browsecat = document.getElementById('browsecat');
            var type_dict = {'电影': 1, '剧集': 2, '动漫': 3, '综艺': 4, '音乐': 7, '纪录': 6,
                             '体育': 5, '软件': 9, '学习': 8, '': 11};
            //如果当前类型在上述字典中
            if (type_dict.hasOwnProperty(raw_info.type)){
                var index = type_dict[raw_info.type];
                browsecat.options[index].selected = true;
            }
        }

        else if (forward_site == 'PuTao'){
            //类型
            switch (raw_info.type){
                case '电影':
                    if (raw_info.source_sel == '欧美'){
                        set_selected_option_by_value('browsecat', '402');
                    } else if (['大陆', '港台', '香港', '台湾'].indexOf(raw_info.source_sel)>-1){
                        set_selected_option_by_value('browsecat', '401');
                    } else if (['日本', '韩国', '日韩', '印度'].indexOf(raw_info.source_sel)>-1){
                        set_selected_option_by_value('browsecat', '403');
                    }
                    break;

                case '纪录': set_selected_option_by_value('browsecat', '406'); break;

                case '剧集':
                    switch (raw_info.source_sel){
                        case '大陆': set_selected_option_by_value('browsecat', '409'); break;
                        case '台湾': case '香港': case '港台':
                            set_selected_option_by_value('browsecat', '407'); break;
                        case '日本': case '韩国': case '日韩': case '印度':
                            set_selected_option_by_value('browsecat', '408'); break;
                        case '欧美': set_selected_option_by_value('browsecat', '410');
                    }
                    break;

                case '综艺':
                    switch (raw_info.source_sel){
                        case '大陆': set_selected_option_by_value('browsecat', '411'); break;
                        case '台湾': case '香港': case '港台':
                            set_selected_option_by_value('browsecat', '412');
                            break;
                        case '日本': case '韩国': case '日韩':
                            set_selected_option_by_value('browsecat', '414');
                            break;
                        case '欧美': set_selected_option_by_value('browsecat', '413');
                    }
                    break;

                case '动漫': set_selected_option_by_value('browsecat', '431'); break;
                //太乱，随便匹配一个
                case '音乐': set_selected_option_by_value('browsecat', '423'); break;

                case '体育': set_selected_option_by_value('browsecat', '432'); break;
                case '软件': set_selected_option_by_value('browsecat', '434'); break;
                case '学习': set_selected_option_by_value('browsecat', '435');
            }

            //视频编码, 跟馒头一样视频音频混合
            var codec_box = document.getElementsByName('codec_sel')[0];
            var audiocodec_dict = {'Flac': 5, 'APE': 6, 'DTS': 7, 'AC3': 8, 'WAV': 9, 'MP3': 9,
                                   'AAC': 9 };
            if (audiocodec_dict.hasOwnProperty(raw_info.audiocodec_sel)){
                var index = audiocodec_dict[raw_info.audiocodec_sel];
                codec_box.options[index].selected = true;
            }
            var codec_dict = {'H264': 1, 'X265': 10, 'X264': 1, 'H265': 10, 'VC-1': 2, 'MPEG-2': 4, 'Xvid': 3};
            if (codec_dict.hasOwnProperty(raw_info.codec_sel)){
                var index = codec_dict[raw_info.codec_sel];
                codec_box.options[index].selected = true;
            }

            //分辨率
            var standard_box = document.getElementsByName('standard_sel')[0];
            var standard_dict = {'4K': 6, '1080p': 1, '1080i': 2, '720p': 3, 'SD': 4, '': 5 };
            if (standard_dict.hasOwnProperty(raw_info.standard_sel)){
                var index = standard_dict[raw_info.standard_sel];
                standard_box.options[index].selected = true;
            }
        }

        else if (forward_site == 'TLFbits'){
            //类型
            var browsecat = document.getElementById('browsecat');
            var type_dict = {'电影': 1, '剧集': 2, '动漫': 4, '综艺': 3, '音乐': 8, '纪录': 5,
                             '体育': 6, '软件': 10, '学习': 11, '': 12, '游戏': 9};
            //如果当前类型在上述字典中
            if (type_dict.hasOwnProperty(raw_info.type)){
                var index = type_dict[raw_info.type];
                browsecat.options[index].selected = true;
            }

            //质量类型
            document.getElementsByName('source_sel')[0].options[2].selected = true;

            //媒介
            var medium_box = document.getElementsByName('medium_sel')[0];
            var medium_dict = {'UHD': 2, 'Blu-ray': 3, 'Encode': 1, 'HDTV': 6, 'WEB-DL': 5, 'Remux': 4, 'DVD': 7, '': 9 };
            if (medium_dict.hasOwnProperty(raw_info.medium_sel)){
                var index = medium_dict[raw_info.medium_sel];
                medium_box.options[index].selected = true;
            }

            //视频编码
            var codec_box = document.getElementsByName('codec_sel')[0];
            var codec_dict = {'H264': 1, 'X265': 2, 'X264': 1, 'H265': 2, 'VC-1': 4, 'MPEG-2': 3, 'Xvid': 5, '': 6};
            if (codec_dict.hasOwnProperty(raw_info.codec_sel)){
                var index = codec_dict[raw_info.codec_sel];
                codec_box.options[index].selected = true;
            }

            //音频编码
            var audiocodec_box = document.getElementsByName('audiocodec_sel')[0];
            var audiocodec_dict = {'Flac': 8, 'APE': 9, 'DTS': 7, 'AC3': 4, 'WAV': 10, 'MP3': 13,
                                   'AAC': 11, 'DTS-HDMA': 5, 'Atmos': 2, 'TrueHD': 3, 'LPCM': 1};
            if (audiocodec_dict.hasOwnProperty(raw_info.audiocodec_sel)){
                var index = audiocodec_dict[raw_info.audiocodec_sel];
                audiocodec_box.options[index].selected = true;
            }

            //分辨率
            var standard_box = document.getElementsByName('standard_sel')[0];
            var standard_dict = {'4K': 6, '1080p': 4, '1080i': 3, '720p': 2, 'SD': 1, '': 7 };
            if (standard_dict.hasOwnProperty(raw_info.standard_sel)){
                var index = standard_dict[raw_info.standard_sel];
                standard_box.options[index].selected = true;
            }

            //地区
            var processing_box = document.getElementsByName('processing_sel')[0];
            var processing_dict = {'欧美': 5, '大陆': 1, '香港': 2, '台湾': 2, '日本': 3, '韩国': 4, '': 6, '印度': 6};
            if (processing_dict.hasOwnProperty(raw_info.source_sel)){
                var index = processing_dict[raw_info.source_sel];
                processing_box.options[index].selected = true;
            }

            //选择其他组
            document.getElementsByName('team_sel')[0].options[4].selected = true;
        }

        else if (forward_site == 'HDDolby'){
            //类型
            var browsecat = document.getElementById('browsecat');
            var type_dict = {'电影': 1, '剧集': 2, '动漫': 4, '综艺': 5, '音乐': 8, '纪录': 3,
                             '体育': 7, '软件': 8, '学习': 10, '': 11};
            //如果当前类型在上述字典中
            if (type_dict.hasOwnProperty(raw_info.type)){
                var index = type_dict[raw_info.type];
                browsecat.options[index].selected = true;
            }
            if (raw_info.name.match(/Pad$|ipad/i)){
                 browsecat.options[1].selected = true;
            }

            //媒介
            var medium_box = document.getElementsByName('medium_sel')[0];
            switch(raw_info.medium_sel){
                case 'UHD': medium_box.options[1].selected = true; break;
                case 'Blu-ray': medium_box.options[2].selected = true; break;
                case 'DVD': medium_box.options[8].selected = true; break;
                case 'Remux': medium_box.options[3].selected = true; break;
                case 'HDTV': medium_box.options[5].selected = true; break;
                case 'WEB-DL':
                    if (raw_info.name.match(/webrip/i)){
                        medium_box.options[7].selected = true;
                    } else {
                        medium_box.options[6].selected = true;
                    }
                    break;
                case 'Encode': medium_box.options[10].selected = true; break;
                default: medium_box.options[11].selected = true; break;
            }

            //视频编码和音频混合了
            var codec_box = document.getElementsByName('codec_sel')[0];

            var audiocodec_dict = {'Flac': 7, 'APE': 8};
            if (audiocodec_dict.hasOwnProperty(raw_info.audiocodec_sel)){
                var index = audiocodec_dict[raw_info.audiocodec_sel];
                codec_box.options[index].selected = true;
            }

            var codec_dict = {'H264': 1, 'X265': 4, 'X264': 3, 'H265': 2, 'VC-1': 5, 'MPEG-2': 6, 'Xvid': 5, '': 6};
            if (codec_dict.hasOwnProperty(raw_info.codec_sel)){
                var index = codec_dict[raw_info.codec_sel];
                codec_box.options[index].selected = true;
            }

            //分辨率
            var standard_box = document.getElementsByName('standard_sel')[0];
            var standard_dict = {'4K': 1, '1080p': 2, '1080i': 3, '720p': 4, 'SD': 5, '': 5 };
            if (standard_dict.hasOwnProperty(raw_info.standard_sel)){
                var index = standard_dict[raw_info.standard_sel];
                standard_box.options[index].selected = true;
            }
        }

        else if (forward_site == 'HDTime') {

            var browsecat = document.getElementById('browsecat');
            var type_dict = {'电影': 1, '剧集': 3, '动漫': 5, '综艺': 4, '音乐': 10, '纪录': 8,
                             '体育': 7, '软件': 6, '学习': 12, '游戏': 11, '': 13 };
            //如果当前类型在上述字典中
            if (type_dict.hasOwnProperty(raw_info.type)){
                var index = type_dict[raw_info.type];
                browsecat.options[index].selected = true;
            }
            if (raw_info.type == '电影' && raw_info.medium_sel == 'Blu-ray') {
                 browsecat.options[2].selected = true;
            }

            // 小组
            document.getElementsByName('team_sel')[0].options[9].selected = true;

            //媒介
            var medium_box = document.getElementsByName('medium_sel')[0];
            switch(raw_info.medium_sel){
                case 'UHD': medium_box.options[1].selected = true; break;
                case 'Blu-ray': medium_box.options[1].selected = true; break;
                case 'DVD':
                    if (raw_info.name.match(/HD ?DVD/i)){
                        medium_box.options[2].selected = true;
                    } else {
                        medium_box.options[7].selected = true;
                    }
                    break;
                case 'Remux': medium_box.options[3].selected = true; break;
                case 'HDTV': medium_box.options[6].selected = true; break;
                case 'Encode': medium_box.options[4].selected = true; break;
            }

            //视频编码
            var codec_box = document.getElementsByName('codec_sel')[0];
            var codec_dict = {'H264': 1, 'X265': 5, 'X264': 6, 'H265': 5, 'VC-1': 2, 'MPEG-2': 3, 'Xvid': 7, '': 8};
            if (codec_dict.hasOwnProperty(raw_info.codec_sel)){
                var index = codec_dict[raw_info.codec_sel];
                codec_box.options[index].selected = true;
            }
            if (raw_info.codec_sel == 'X264' && raw_info.name.match(/10.?bit/)){
                codec_box.options[4].selected = true;
            }

            // $('#browsecat').trigger('change');
            // $('#browsecat').change();
            var evt = document.createEvent("HTMLEvents");
            evt.initEvent("change", false, true);
            document.getElementById('browsecat').dispatchEvent(evt);

            var medium_box = document.getElementsByName('source_sel')[0];
            switch (raw_info.type){
                case '电影':
                    switch(raw_info.medium_sel){
                        case 'DVD': medium_box.options[6].selected = true; break;
                        case 'Remux': medium_box.options[1].selected = true; break;
                        case 'WEB-DL': medium_box.options[4].selected = true; break;
                        case 'Blu-ray':
                            if (labels.diy) {
                                medium_box.options[2].selected = true;
                            } else {
                                medium_box.options[1].selected = true;
                            }
                            break;
                        case 'Encode': case 'HDTV':
                            if (raw_info.standard_sel == '1080p' || raw_info.standard_sel == '4K' || raw_info.standard_sel == '1080i'){
                                medium_box.options[3].selected = true;
                            } else if(raw_info.standard_sel == '720p'){
                                medium_box.options[4].selected = true;
                            }
                            if (raw_info.name.match(/pad$|ipad/i)) {
                                medium_box.options[5].selected = true;
                            }
                            break;
                        default:
                            if (raw_info.standard_sel == '1080p' || raw_info.standard_sel == '4K' || raw_info.standard_sel == '1080i'){
                                medium_box.options[3].selected = true;
                            } else if(raw_info.standard_sel == '720p'){
                                medium_box.options[4].selected = true;
                            }
                    }
                    if (raw_info.name.match(/10bit/)) {
                        medium_box.options[2].selected = true;
                    }

                    break;
                case '剧集':
                    switch (raw_info.source_sel){
                        case '大陆': medium_box.options[2].selected = true; break;
                        case '台湾': case '香港': case '港台': medium_box.options[3].selected = true; break;
                        case '日本': medium_box.options[5].selected = true; break;
                        case '韩国': medium_box.options[6].selected = true; break;
                        case '欧美': medium_box.options[4].selected = true; break;
                    }
                    if (raw_info.name.match(/S\d+[^E]|complete/i)) {
                        medium_box.options[1].selected = true;
                    }
                    break;
                case '综艺': medium_box.options[2].selected = true; break;
                case '纪录': medium_box.options[7].selected = true; break;
                case '动漫': medium_box.options[2].selected = true; break;
                case '音乐': medium_box.options[1].selected = true; break;
                case '体育': medium_box.options[3].selected = true;
                case '学习': case '软件': medium_box.options[4].selected = true; break;
            }
        }

        else if (forward_site == 'HDArea'){
            try{
                //类型
                switch (raw_info.type){
                    case '电影':
                        if (raw_info.medium_sel == 'UHD') {
                            set_selected_option_by_value('browsecat', '300');
                        } else if (raw_info.medium_sel == 'Blu-ray') {
                            set_selected_option_by_value('browsecat', '401');
                        } else if (raw_info.medium_sel == 'Remux') {
                            set_selected_option_by_value('browsecat', '415');
                        } else if (raw_info.medium_sel == 'WEB-DL') {
                            set_selected_option_by_value('browsecat', '412');
                        } else if (raw_info.medium_sel == 'HDTV') {
                            set_selected_option_by_value('browsecat', '413');
                        } else if (raw_info.medium_sel == 'DVD') {
                            set_selected_option_by_value('browsecat', '414');
                        } else {
                            if (raw_info.name.match(/pad$|ipad/i)){
                                set_selected_option_by_value('browsecat', '417');
                            } else{
                                if (raw_info.standard_sel == '4K') {
                                    set_selected_option_by_value('browsecat', '300');
                                } else if (raw_info.standard_sel == '1080p') {
                                    set_selected_option_by_value('browsecat', '410');
                                } else if (raw_info.standard_sel == '720p') {
                                    set_selected_option_by_value('browsecat', '411');
                                }
                            }
                        }
                        break;
                    case '剧集': set_selected_option_by_value('browsecat', '402');  break;
                    case '纪录': set_selected_option_by_value('browsecat', '404');  break;
                    case '动漫': set_selected_option_by_value('browsecat', '405');  break;
                    case '综艺': set_selected_option_by_value('browsecat', '403');  break;
                    case '音乐':
                        if (raw_info.name.match(/mv/i)){
                            set_selected_option_by_value('browsecat', '406');
                        }
                        else{
                            set_selected_option_by_value('browsecat', '408');
                        }

                        break;
                    case '体育': set_selected_option_by_value('browsecat', '407'); break;

                    default:
                        set_selected_option_by_value('browsecat', '409');
                }

                //媒介
                var medium_box = document.getElementsByName('medium_sel')[0];
                switch(raw_info.medium_sel){
                    case 'UHD': medium_box.options[1].selected = true; break;
                    case 'Blu-ray': medium_box.options[1].selected = true; break;
                    case 'Remux': medium_box.options[2].selected = true; break;
                    case 'Encode': medium_box.options[3].selected = true; break;
                    case 'HDTV': medium_box.options[6].selected = true; break;
                    case 'WEB-DL': medium_box.options[4].selected = true; break;
                    case 'DVD': medium_box.options[8].selected = true;
                }
                if (raw_info.name.match(/MiniBD/i)){
                    medium_box.options[5].selected = true;
                }

                //视频编码
                var codec_box = document.getElementsByName('codec_sel')[0];
                codec_box.options[6].selected = true;
                switch (raw_info.codec_sel){
                    case 'H264': case 'MPEG-4': codec_box.options[2].selected = true; break;
                    case 'H265': case 'X265': codec_box.options[3].selected = true; break;
                    case 'VC-1': codec_box.options[6].selected = true; break;
                    case 'MPEG-2': codec_box.options[4].selected = true; break;
                    case 'X264': codec_box.options[1].selected = true; break;
                    case 'XVID': codec_box.options[5].selected = true;
                }
                //单独对x264匹配
                if (raw_info.codec_sel == 'H264'){
                    if (raw_info.name.match(/X264/i)){
                        codec_box.options[1].selected = true;
                    }
                }

                //音频编码
                var audiocodec_box = document.getElementsByName('audiocodec_sel')[0];
                var audiocodec_dict = { 'AAC': 1, 'AC3': 2, 'TrueHD': 3,
                                        'DTS': 4, 'DTS-HD': 5, 'DTS-HDMA': 5, 'DTS-HDMA:X 7.1': 5,
                                        'LPCM': 6, 'WAV': 7, 'APE': 8, 'Flac': 9, 'Atmos': 10};
                if (audiocodec_dict.hasOwnProperty(raw_info.audiocodec_sel)){
                    var index = audiocodec_dict[raw_info.audiocodec_sel];
                    audiocodec_box.options[index].selected = true;
                }
                if (raw_info.audiocodec_sel == 'AC3'){
                    if (raw_info.name.match(/DD.?2.0/i)){
                        audiocodec_box.options[11].selected = true;
                    }
                }

                //分辨率
                var standard_box = document.getElementsByName('standard_sel')[0];
                var standard_dict = {'4K': 5, '1080p': 2, '1080i': 4, '720p': 1, 'SD': 3};
                if (standard_dict.hasOwnProperty(raw_info.standard_sel)){
                    var index = standard_dict[raw_info.standard_sel];
                    standard_box.options[index].selected = true;
                }
            } catch(err){}
        }

        else if (forward_site == 'BTSchool'){
            //类型
            var browsecat = document.getElementById('browsecat');
            var type_dict = {'电影': 1, '剧集': 2, '动漫': 3, '纪录': 4, '综艺': 5, '软件': 6,
                             '学习': 7, '游戏': 8, '音乐': 9, '体育': 10, '': 11};
            //如果当前类型在上述字典中
            if (type_dict.hasOwnProperty(raw_info.type)){
                var index = type_dict[raw_info.type];
                browsecat.options[index].selected = true;
            }

            //媒介
            var medium_box = document.getElementsByName('medium_sel')[0];
            switch(raw_info.medium_sel){
                case 'UHD': medium_box.options[2].selected = true; break;
                case 'Blu-ray': medium_box.options[1].selected = true; break;
                case 'DVD': medium_box.options[7].selected = true; break;
                case 'Remux': medium_box.options[5].selected = true; break;
                case 'HDTV': medium_box.options[6].selected = true; break;
                case 'WEB-DL': medium_box.options[4].selected = true; break;
                case 'Encode': medium_box.options[3].selected = true; break;
                default: medium_box.options[9].selected = true;
            }

            //视频编码
            var codec_box = document.getElementsByName('codec_sel')[0];
            codec_box.options[6].selected = true;
            switch (raw_info.codec_sel){
                case 'H264': case 'MPEG-4': case 'X264': codec_box.options[1].selected = true; break;
                case 'H265': case 'X265': codec_box.options[2].selected = true; break;
                case 'VC-1': codec_box.options[4].selected = true; break;
                case 'MPEG-2': codec_box.options[3].selected = true; break;
                case 'XVID': codec_box.options[5].selected = true;
            }

            //音频编码
            var audiocodec_box = document.getElementsByName('audiocodec_sel')[0];
            var audiocodec_dict = { 'TrueHD': 1, 'Atmos': 1, 'DTS': 2, 'DTS-HD': 2, 'DTS-HDMA': 2, 'DTS-HDMA:X 7.1': 2,
                                    'AC3': 3, 'LPCM': 4, 'Flac': 5, 'MP3': 6, 'AAC': 7, 'APE': 8, '': 9 };
            if (audiocodec_dict.hasOwnProperty(raw_info.audiocodec_sel)){
                var index = audiocodec_dict[raw_info.audiocodec_sel];
                audiocodec_box.options[index].selected = true;
            }

            //分辨率
            var standard_box = document.getElementsByName('standard_sel')[0];
            var standard_dict = {'4K': 1, '1080p': 2, '1080i': 2, '720p': 3, 'SD': 4, '': 5 };
            if (standard_dict.hasOwnProperty(raw_info.standard_sel)){
                var index = standard_dict[raw_info.standard_sel];
                standard_box.options[index].selected = true;
            }
        }

        else if (forward_site == 'TJUPT') {
            try{
                //类型
                switch (raw_info.type) {
                    case '电影': set_selected_option_by_value('browsecat', '401');  break;
                    case '剧集': set_selected_option_by_value('browsecat', '402');  break;
                    case '纪录': set_selected_option_by_value('browsecat', '411');  break;
                    case '动漫': set_selected_option_by_value('browsecat', '405');  break;
                    case '综艺': set_selected_option_by_value('browsecat', '403');  break;
                    case '学习': set_selected_option_by_value('browsecat', '404');  break;
                    case '音乐': set_selected_option_by_value('browsecat', '406');  break;
                    case '体育': set_selected_option_by_value('browsecat', '407');  break;
                    case '软件': set_selected_option_by_value('browsecat', '408');  break;
                    default:
                        set_selected_option_by_value('browsecat', '410');
                }

                //ipad的简单判定
                if (raw_info.name.match(/(pad$|ipad)/i)){
                    set_selected_option_by_value('browsecat', '412');
                }

                getcategory('class2','browsecat');

                setTimeout(function(){
                    //中文译名填写
                    cname = raw_info.descr.match(/译.{0,5}名[^\r\n]+/i);
                    if (cname) {
                        vidoename = raw_info.descr.match(/译.*?名([^\r\n]+)/)[1];
                        videoname = vidoename.trim(); //去除首尾空格
                        cname_box = document.getElementById('cname');
                        cname_box.value = videoname;
                    }

                    //英文名填写
                    ename_box = document.getElementById('ename');
                    ename_box.value = raw_info.name.replace(/\s+/ig, '.');

                    //地区填写，针对电影
                    if (raw_info.type == '电影' || raw_info.type == '综艺'){
                        district_box = document.getElementById('district');
                        district = raw_info.descr.match(/(地.{0,5}?区|国.{0,5}?家|产.{0,5}?地)([^\r\n]+)/);
                        if (district) {
                            district = district[2];
                            district = district.trim(); //去除首尾空格
                            district_box.value = district;
                        }
                        else{
                            district_box.value = raw_info.source_sel;
                        }
                    }

                    //剧集类型，针对剧集
                    if (raw_info.type == '剧集'){
                        switch (raw_info.source_sel){
                            case '大陆':
                                $('#specificcat1').attr('checked','true'); break;
                            case '台湾': case '香港': case '港台':
                                $('#specificcat2').attr('checked','true'); break;
                            case '日本':
                                $('#specificcat4').attr('checked','true'); break;
                            case '韩国':
                                $('#specificcat5').attr('checked','true'); break;
                            case '欧美':
                                $('#specificcat3').attr('checked','true'); break;
                            default:
                                $('#specificcat6').attr('checked','true'); break;
                        }
                        getcheckboxvalue('specificcat',7);
                    }

                    if (raw_info.type == '综艺'){
                        //字幕,还需要复杂处理，先简单这样
                        if (labels.zz){
                            document.getElementsByName('subsinfo')[0].options[2].selected=true;
                        }
                        //语言
                        language = raw_info.descr.match(/语.{0,5}?言([^\r\n]+)/);
                        if (language) {
                            language = language[1];
                            language = language.trim(); //去除首尾空格
                            language_box = document.getElementById('language');
                            language_box.value = language;
                        }
                    }

                    if (raw_info.type == '纪录') {

                        //格式
                        var format_box = document.getElementById('format');
                        if (raw_info.standard_sel == '1080p' || raw_info.standard_sel == '1080i'){
                            $('#format1').attr('checked', true);
                        } else if (raw_info.standard_sel == '720p') {
                            $('#format2').attr('checked', true);
                        } else {
                            if (raw_info.name.match(/BDRIP/i)){
                                $('#format3').attr('checked', true);
                            } else if (raw_info.name.match(/DVDRIP/i)){
                                $('#format4').attr('checked', true);
                            } else if (raw_info.name.match(/TVRIP/i)){
                                $('#format5').attr('checked', true);
                            }
                        }

                        //字幕,还需要复杂处理，先简单这样
                        if (labels.zz){
                            document.getElementsByName('subsinfo')[0].options[2].selected=true;
                        }

                        //语言
                        language = raw_info.descr.match(/语.{0,5}?言([^\r\n]+)/);
                        if (language) {
                            language = language[1];
                            language = language.trim(); //去除首尾空格
                            language_box = document.getElementById('language');
                            language_box.value = language;
                        }
                    }

                }, 3000);
            } catch (err){
                alert(err);
            }
        }

        else if (forward_site == 'TCCF') {
            try{
                //类型
                switch (raw_info.type) {
                    case '电影': set_selected_option_by_value('browsecat', '601');  break;
                    case '剧集':
                        if (raw_info.source_sel == '大陆'){
                            set_selected_option_by_value('browsecat', '606');
                        } else if (raw_info.source_sel == '欧美'){
                            set_selected_option_by_value('browsecat', '607');
                        } else if (raw_info.source_sel == '台湾' || raw_info.source_sel == '香港'){
                            set_selected_option_by_value('browsecat', '608');
                        } else if (raw_info.source_sel == '日本' || raw_info.source_sel == '韩国'){
                            set_selected_option_by_value('browsecat', '609');
                        }
                        break;
                    case '纪录': set_selected_option_by_value('browsecat', '604');  break;
                    case '动漫': set_selected_option_by_value('browsecat', '602');  break;
                    case '综艺': set_selected_option_by_value('browsecat', '610');  break;
                    case '学习': set_selected_option_by_value('browsecat', '605');  break;
                    case '音乐': set_selected_option_by_value('browsecat', '615');  break;
                    case '体育': set_selected_option_by_value('browsecat', '603');  break;
                    case '软件': set_selected_option_by_value('browsecat', '616');  break;
                    default:
                        set_selected_option_by_value('browsecat', '621');
                }

                var medium_box = document.getElementsByName('medium_sel')[0];
                switch(raw_info.medium_sel){
                    case 'UHD': medium_box.options[1].selected = true; break;
                    case 'Blu-ray': medium_box.options[2].selected = true; break;
                    case 'DVD':
                        medium_box.options[8].selected = true;
                        if (raw_info.name.match(/dvdrip/i)){
                            medium_box.options[7].selected = true;
                        }
                        break;
                    case 'Remux': medium_box.options[3].selected = true; break;
                    case 'HDTV': medium_box.options[6].selected = true; break;
                    case 'WEB-DL': medium_box.options[5].selected = true; break;
                    case 'Encode': medium_box.options[4].selected = true; break;
                    default: medium_box.options[9].selected = true;
                }
                //视频编码
                var codec_box = document.getElementsByName('codec_sel')[0];
                codec_box.options[8].selected = true;
                switch (raw_info.codec_sel){
                    case 'H264': case 'MPEG-4': codec_box.options[1].selected = true; break;
                    case 'H265': codec_box.options[3].selected = true; break;
                    case 'X265': codec_box.options[2].selected = true; break;
                    case 'X264': codec_box.options[4].selected = true; break;
                    case 'VC-1': codec_box.options[5].selected = true; break;
                    case 'MPEG-2': codec_box.options[7].selected = true; break;
                    case 'XVID': codec_box.options[6].selected = true;
                }

                //音频编码
                var audiocodec_box = document.getElementsByName('audiocodec_sel')[0];
                var audiocodec_dict = { 'TrueHD': 7, 'Atmos': 7,
                                        'DTS': 3, 'DTS-HD': 6, 'DTS-HDMA': 6, 'DTS-HDMA:X 7.1': 6,
                                        'AC3': 4, 'LPCM': 8, 'Flac': 1, 'MP3': 10, 'AAC': 5, 'APE': 2, '': 11 };
                if (audiocodec_dict.hasOwnProperty(raw_info.audiocodec_sel)){
                    var index = audiocodec_dict[raw_info.audiocodec_sel];
                    audiocodec_box.options[index].selected = true;
                }

                //分辨率
                var standard_box = document.getElementsByName('standard_sel')[0];
                var standard_dict = {'4K': 1, '1080p': 2, '1080i': 3, '720p': 4, 'SD': 5, '': 5 };
                if (standard_dict.hasOwnProperty(raw_info.standard_sel)){
                    var index = standard_dict[raw_info.standard_sel];
                    standard_box.options[index].selected = true;
                }
            } catch (err){

            }
        }

        else if (forward_site == 'ptsbao'){

            function removeSubcat() {
                if ($("#subcat").length > 0) {
                    $("#subcat").slideUp(function () {
                        $(this).remove();
                    });
                }
            }

            //类型
            switch (raw_info.type) {
                case '电影': set_selected_option_by_value('browsecat', '401');  break;
                case '剧集': set_selected_option_by_value('browsecat', '401');  break;
                case '纪录': set_selected_option_by_value('browsecat', '404');  break;
                case '动漫': set_selected_option_by_value('browsecat', '405');  break;
                case '综艺': set_selected_option_by_value('browsecat', '403');  break;
                case '学习': set_selected_option_by_value('browsecat', '409');  break;
                case '音乐': set_selected_option_by_value('browsecat', '414');  break;
                case '体育': set_selected_option_by_value('browsecat', '409');  break;
                case '软件': set_selected_option_by_value('browsecat', '409');  break;
                default:
                    set_selected_option_by_value('browsecat', '409');
            }

            //显示子类型
            setTimeout(function(){
                var evt = document.createEvent("HTMLEvents");
                evt.initEvent("change", false, true);
                document.getElementById('browsecat').dispatchEvent(evt);
                var medium_box = document.getElementById('source_sel');
                var type_box = document.getElementsByName('source_sel')[1];
                switch (raw_info.type) {
                    case '电影':
                        switch(raw_info.medium_sel){
                            case 'UHD': case 'Blu-ray': medium_box.options[4].selected = true; type_box.options[4].selected = true; break;
                            case 'DVD': medium_box.options[9].selected = true; type_box.options[9].selected = true; break;
                            case 'Remux': medium_box.options[7].selected = true; type_box.options[7].selected = true; break;
                            case 'HDTV': medium_box.options[8].selected = true; type_box.options[8].selected = true; break;
                            case 'WEB-DL': medium_box.options[6].selected = true; type_box.options[6].selected = true; break;
                            case 'Encode':
                                if (raw_info.standard_sel == '1080p'){
                                    medium_box.options[2].selected = true; type_box.options[2].selected = true;
                                } else if(raw_info.standard_sel == '720p'){
                                    medium_box.options[3].selected = true; type_box.options[3].selected = true;
                                } else if (raw_info.standard_sel == '4K') {
                                    medium_box.options[1].selected = true; type_box.options[1].selected = true;
                                }
                                break;
                            default:
                                if (raw_info.standard_sel == '1080p'){
                                    medium_box.options[2].selected = true; type_box.options[2].selected = true;
                                } else if(raw_info.standard_sel == '720p'){
                                    medium_box.options[3].selected = true; type_box.options[3].selected = true;
                                } else if (raw_info.standard_sel == '4K'){
                                    medium_box.options[1].selected = true; type_box.options[1].selected = true;
                                }
                        }
                        break;
                    case '剧集':
                        switch (raw_info.source_sel){
                            case '大陆': medium_box.options[1].selected = true; type_box.options[10].selected = true; break;
                            case '台湾': case '香港': case '港台': medium_box.options[4].selected = true; type_box.options[13].selected = true; break;
                            case '日本': medium_box.options[5].selected = true; type_box.options[14].selected = true; break;
                            case '韩国': medium_box.options[3].selected = true; type_box.options[12].selected = true; break;
                            case '欧美': medium_box.options[2].selected = true; type_box.options[11].selected = true; break;
                        }
                        break;
                    //这里可以展开的
                    case '纪录': medium_box.options[7].selected = true; type_box.options[28].selected = true; break;
                    case '动漫': medium_box.options[2].selected = true; type_box.options[31].selected = true; break;
                    case '综艺': medium_box.options[1].selected = true; type_box.options[17].selected = true; break;
                    case '音乐': medium_box.options[1].selected = true; type_box.options[4].selected = true; break;
                    case '体育': case '学习': case '软件':
                        medium_box.options[3].selected = true; type_box.options[4].selected = true; break;
                }

                removeSubcat();
                $.getJSON("guize.php?id=" + $("#browsecat").val() + "&source_sel=" + $('source_sel').val() + "&t=" + new Date(), function (result) {
                    $("td td:has('#name')").prepend(result[1]);
                    $("#subcat").slideDown();
                });

                //先转换成bbcode编辑模式
                document.getElementsByClassName('sceditor-button-source')[0].click();
                var display = document.getElementsByTagName('iframe')[0].style.display;
                if (display == 'none'){
                    while (true) {
                        document.getElementById('sceditorclear').click();
                        if (! document.getElementsByTagName('textarea')[1].value) {
                            break;
                        }
                    }
                    document.getElementsByTagName('textarea')[1].value = raw_info.descr;
                }
            }, 2000);

            //媒介
            var medium_box = document.getElementsByName('medium_sel')[0];
            medium_box.options[7].selected = true; //默认其他
            switch(raw_info.medium_sel){
                case 'UHD': medium_box.options[1].selected = true; break;
                case 'Blu-ray': medium_box.options[2].selected = true; break;
                case 'DVD': medium_box.options[5].selected = true; break;
                case 'Remux': medium_box.options[5].selected = true; break;
                case 'HDTV': medium_box.options[4].selected = true; break;
                case 'Encode': medium_box.options[2].selected = true; break;
                case 'WEB-DL': medium_box.options[3].selected = true;
            }

            //编码
            var codec_box = document.getElementsByName('codec_sel')[0];
            var codec_dict = {'H264': 2, 'X265': 1, 'X264': 2, 'H265': 1, 'VC-1': 3, 'MPEG-2': 4, 'Xvid': 6, '': 7};
            if (codec_dict.hasOwnProperty(raw_info.codec_sel)){
                var index = codec_dict[raw_info.codec_sel];
                codec_box.options[index].selected = true;
            }

            //音频编码
            var audiocodec_box = document.getElementsByName('audiocodec_sel')[0];
            var audiocodec_dict = {
                'Flac': 7,
                'APE': 8,
                'AC3': 4,
                'WAV': 8,
                'Atmos': 2,
                'AAC': 5,
                'DTS-HDMA': 1,
                'TrueHD': 2,
                'DTS': 6,
                'LPCM': 11,
                'DTS-HDMA:X 7.1': 1,
                'DTS-HDHR': 1,
                'DTS-X': 6
            };
            if (audiocodec_dict.hasOwnProperty(raw_info.audiocodec_sel)) {
                var index = audiocodec_dict[raw_info.audiocodec_sel];
                audiocodec_box.options[index].selected = true;
            }

            //分辨率
            var standard_box = document.getElementsByName('standard_sel')[0];
            var standard_dict = {'4K': 1, '1080p': 3, '1080i': 3, '720p': 4, 'SD': 6, '': 7 };
            if (standard_dict.hasOwnProperty(raw_info.standard_sel)){
                var index = standard_dict[raw_info.standard_sel];
                standard_box.options[index].selected = true;
            }

            //处理
            var processing_box = document.getElementsByName('processing_sel')[0];
            if (raw_info.medium_sel == 'Remux') {
                processing_box.options[1].selected = true;
            } else if (raw_info.medium_sel == 'UHD' || raw_info.medium_sel == 'Blu-ray') {
                processing_box.options[4].selected = true;
            } else if (raw_info.medium_sel == 'Encode') {
                processing_box.options[3].selected = true;
            } else {
                processing_box.options[2].selected = true;
            }
        }

        else if (forward_site == 'HaiDan') {
            //类型
            var browsecat = document.getElementById('browsecat');
            var type_dict = {'电影': 2, '剧集': 4, '动漫': 3, '综艺': 5, '音乐': 9, '纪录': 1,
                             '体育': 7, '软件': 8, '学习': 8};
            //如果当前类型在上述字典中
            browsecat.options[8].selected = true;//默认其他
            if (type_dict.hasOwnProperty(raw_info.type)){
                var index = type_dict[raw_info.type];
                browsecat.options[index].selected = true;
            }

            //剧集
            if (raw_info.type == '剧集') {
                if (raw_info.name.match(/S(\d+)E(\d+)/i)) {
                    document.getElementById('season').value = numToChinese(raw_info.name.match(/S(\d+)E(\d+)/i)[1]);
                    document.getElementById('episode').value =  numToChinese(raw_info.name.match(/S(\d+)E(\d+)/i)[2]);
                } else if (raw_info.name.match(/S(\d+)/i)) {
                    document.getElementById('season').value = numToChinese(raw_info.name.match(/S(\d+)/i)[1]);
                }
            }

            //媒介
            var medium_box = document.getElementsByName('medium_sel')[0];
            switch(raw_info.medium_sel){
                case 'UHD': medium_box.options[1].selected = true; break;
                case 'Blu-ray': medium_box.options[2].selected = true; break;
                case 'DVD':  medium_box.options[7].selected = true; break;
                case 'Remux': medium_box.options[3].selected = true; break;
                case 'HDTV': medium_box.options[5].selected = true; break;
                case 'WEB-DL': medium_box.options[6].selected = true; break;
                case 'Encode': medium_box.options[4].selected = true; break;
                default: medium_box.options[7].selected = true;
            }

            //视频编码
            var codec_box = document.getElementsByName('codec_sel')[0];
            switch (raw_info.codec_sel){
                case 'H264': case 'X264': codec_box.options[1].selected = true; break;
                case 'H265': case 'X265': codec_box.options[5].selected = true; break;
                case 'VC-1': codec_box.options[2].selected = true; break;
                case 'MPEG-2': codec_box.options[3].selected = true; break;
                case 'XVID': codec_box.options[6].selected = true; break;
                default: codec_box.options[4].selected = true;
            }

            //音频编码
            var audiocodec_box = document.getElementsByName('audiocodec_sel')[0];
            var audiocodec_dict = { 'TrueHD': 10, 'Atmos': 10, 'DTS': 3, 'DTS-HD': 6, 'DTS-HDMA': 9, 'DTS-HDMA:X 7.1': 9,
                                    'AC3': 7, 'LPCM': 8, 'Flac': 1, 'MP3': 10, 'AAC': 5, 'APE': 2, '': 6 };
            if (audiocodec_dict.hasOwnProperty(raw_info.audiocodec_sel)){
                var index = audiocodec_dict[raw_info.audiocodec_sel];
                audiocodec_box.options[index].selected = true;
            }

            //分辨率
            var standard_box = document.getElementsByName('standard_sel')[0];
            var standard_dict = {'4K': 1, '1080p': 2, '1080i': 3, '720p': 4, 'SD': 5, '': 5 };
            if (standard_dict.hasOwnProperty(raw_info.standard_sel)){
                var index = standard_dict[raw_info.standard_sel];
                standard_box.options[index].selected = true;
            }

            //制作组
            var team = raw_info.name.match(/-([^-]*?)$/i);
            if (team) {
                document.getElementById('team_suffix').value = team[1];
            }

            var info = get_mediainfo_picture_from_descr(raw_info.descr);
            var cmctinfos = info.mediainfo;
            var cmctimgs = info.pic_info;

            descr_box[0].style.height = '300px';
            descr_box[1].style.height = '400px';
            descr_box[2].style.height = '600px';

            document.getElementsByName('nfo-string')[0].value = cmctinfos;
            document.getElementsByName('preview-pics')[0].value = cmctimgs;

            //清空附加信息
            var clear = document.createElement('input');
            clear.type = 'button';
            clear.value = " 清空附加信息 ";
            clear.id = 'clear';
            document.getElementById('qr').parentNode.insertBefore(clear, document.getElementById('qr'));
            $('#clear').css({'color': 'white', 'background' :'url(https://springsunday.net/styles/Maya/images/btn_submit_bg.gif) repeat left top', 'border': '1px black'});

            $('#clear').click(function(){
                descr_box[2].value = '';
                descr_box[2].style.height = '200px';
            });
        }

        else if (forward_site == 'HDfans') {
            //类型
            var browsecat = document.getElementById('browsecat');
            var type_dict = {'电影': 1, '剧集': 2, '动漫': 6, '综艺': 5, '音乐': 4, '纪录': 3,
                             '体育': 14, '软件': 15, '学习': 9, '': 18};
            //如果当前类型在上述字典中
            browsecat.options[16].selected = true;//默认其他
            if (type_dict.hasOwnProperty(raw_info.type)){
                var index = type_dict[raw_info.type];
                browsecat.options[index].selected = true;
            }

            //来源
            var medium_box = document.getElementsByName('source_sel')[0];
            switch(raw_info.medium_sel){
                case 'UHD':
                    if (labels.diy) {
                        medium_box.options[2].selected = true;
                    } else if (raw_info.name.match(/remux/i)){
                        medium_box.options[3].selected = true;
                    } else {
                        medium_box.options[1].selected = true;
                    }
                    break;
                case 'Blu-ray':
                    if (labels.diy) {
                        medium_box.options[6].selected = true;
                    } else if (raw_info.name.match(/remux/i)){
                        medium_box.options[7].selected = true;
                    } else {
                        medium_box.options[5].selected = true;
                    }
                    break;
                case 'DVD':  medium_box.options[13].selected = true; break;
                case 'Remux': medium_box.options[7].selected = true; break;
                case 'HDTV': medium_box.options[11].selected = true; break;
                case 'WEB-DL': medium_box.options[12].selected = true; break;
                case 'Encode':
                    if (raw_info.standard_sel == '4K'){
                        medium_box.options[4].selected = true;
                    } else if (raw_info.standard_sel == '1080p') {
                        medium_box.options[8].selected = true;
                    } else if (raw_info.standard_sel == '720p') {
                        medium_box.options[9].selected = true;
                    }
                    break;
                default: medium_box.options[13].selected = true;
            }

            //视频编码
            var codec_box = document.getElementsByName('codec_sel')[0];
            switch (raw_info.codec_sel){
                case 'H264': codec_box.options[1].selected = true; break;
                case 'X264': codec_box.options[2].selected = true; break;
                case 'H265': codec_box.options[3].selected = true; break;
                case 'X265': codec_box.options[4].selected = true; break;
                case 'VC-1': codec_box.options[5].selected = true; break;
                case 'MPEG-2': codec_box.options[6].selected = true; break;
                case 'XVID': codec_box.options[8].selected = true; break;
                default: codec_box.options[9].selected = true;
            }

            //媒介
            var medium_box = document.getElementsByName('medium_sel')[0];
            switch(raw_info.medium_sel){
                case 'UHD': medium_box.options[1].selected = true; break;
                case 'Blu-ray': medium_box.options[2].selected = true; break;
                case 'DVD':  medium_box.options[7].selected = true; break;
                case 'Remux': medium_box.options[3].selected = true; break;
                case 'HDTV': medium_box.options[6].selected = true; break;
                case 'WEB-DL': medium_box.options[5].selected = true; break;
                case 'Encode': medium_box.options[2].selected = true; break;
                default: medium_box.options[10].selected = true;
            }

            //音频编码
            var audiocodec_box = document.getElementsByName('audiocodec_sel')[0];
            var audiocodec_dict = { 'TrueHD': 6, 'Atmos': 1, 'DTS': 2, 'DTS-HD': 5, 'DTS-HDMA': 4, 'DTS-HDMA:X 7.1': 4, 'DTS-X': 3,
                                    'AC3': 10, 'LPCM': 7, 'Flac': 12, 'MP3': 10, 'AAC': 11, 'APE': 13, '': 19 };
            if (audiocodec_dict.hasOwnProperty(raw_info.audiocodec_sel)){
                var index = audiocodec_dict[raw_info.audiocodec_sel];
                audiocodec_box.options[index].selected = true;
            }

            //分辨率
            var standard_box = document.getElementsByName('standard_sel')[0];
            var standard_dict = {'4K': 2, '1080p': 3, '1080i': 4, '720p': 5, 'SD': 6, '': 7 };
            if (standard_dict.hasOwnProperty(raw_info.standard_sel)){
                var index = standard_dict[raw_info.standard_sel];
                standard_box.options[index].selected = true;
            }

            var team_box = document.getElementsByName('processing_sel')[0];
            var team_dict = {'欧美': 2, '大陆': 1, '香港': 4, '台湾': 5, '日本': 6, '韩国': 7,
                             '印度': 9, '': 10 };
            if (team_dict.hasOwnProperty(raw_info.source_sel)){
                var index = team_dict[raw_info.source_sel];
                team_box.options[index].selected = true;
            }
        }

        else if (forward_site == 'HD4FANS') {
            //类型
            var browsecat = document.getElementById('browsecat');
            var type_dict = {'电影': 1, '剧集': 4, '动漫': 3, '综艺': 5, '音乐': 6, '纪录': 2,
                             '体育': 7, '软件': 8, '学习': 8, '': 8};
            //如果当前类型在上述字典中
            browsecat.options[8].selected = true;//默认其他
            if (type_dict.hasOwnProperty(raw_info.type)){
                var index = type_dict[raw_info.type];
                browsecat.options[index].selected = true;
            }

            //媒介
            var medium_box = document.getElementsByName('medium_sel')[0];
            switch(raw_info.medium_sel){
                case 'UHD': medium_box.options[1].selected = true; break;
                case 'Blu-ray': medium_box.options[1].selected = true; break;
                case 'DVD':
                    if (raw_info.name.match(/HD ?DVD/i)){
                        medium_box.options[2].selected = true;
                    } else {
                        medium_box.options[7].selected = true;
                    }
                    break;
                case 'Remux': medium_box.options[3].selected = true; break;
                case 'HDTV': medium_box.options[6].selected = true; break;
                case 'Encode': medium_box.options[4].selected = true; break;
                default: medium_box.options[10].selected = true;
            }

            //视频编码
            var codec_box = document.getElementsByName('codec_sel')[0];
            switch (raw_info.codec_sel){
                case 'H264': codec_box.options[1].selected = true; break;
                case 'X264': codec_box.options[1].selected = true; break;
                case 'H265': codec_box.options[2].selected = true; break;
                case 'X265': codec_box.options[2].selected = true; break;
                case 'VC-1': codec_box.options[3].selected = true; break;
                case 'MPEG-2': codec_box.options[5].selected = true; break;
                case 'XVID': codec_box.options[4].selected = true; break;
                default: codec_box.options[6].selected = true;
            }

            //分辨率
            var standard_box = document.getElementsByName('standard_sel')[0];
            var standard_dict = {'4K': 2, '1080p': 1, '1080i': 3, '720p': 4, 'SD': 5, '': 5 };
            if (standard_dict.hasOwnProperty(raw_info.standard_sel)){
                var index = standard_dict[raw_info.standard_sel];
                standard_box.options[index].selected = true;
            }
        }

        else if (forward_site == 'HDRoute') {
            var title_chs = document.getElementById('title_chs');
            title_chs.value = raw_info.small_descr.split('/', 1)[0].trim();

            descr_box[0].value = raw_info.descr.substring(raw_info.descr.indexOf('\n') + 1).trim();

            //类型
            var type_category = document.getElementById('type_category');
            var type_dict = {'电影': 1, '剧集': 3, '动漫': 4, '综艺': 4, '音乐': 8, '纪录': 2,
                             '体育': 6, '软件': 9, '学习': 9};
            //如果当前类型在上述字典中
            if (type_dict.hasOwnProperty(raw_info.type)){
                var index = type_dict[raw_info.type];
                type_category.options[index].selected = true;
            }

            //音频编码
            var type_audio = document.getElementById('type_audio');
            var audiocodec_dict = { 'TrueHD': 3, 'Atmos': 3, 'DTS': 4, 'DTS-HD': 2, 'DTS-HDMA': 2, 'DTS-HDMA:X 7.1': 2,
                                    'AC3': 5, 'LPCM': 1, 'Flac': 7, 'MP3': 6, 'AAC': 9, 'APE': 6, '': 8 };
            if (audiocodec_dict.hasOwnProperty(raw_info.audiocodec_sel)){
                var index = audiocodec_dict[raw_info.audiocodec_sel];
                type_audio.options[index].selected = true;
            }

            //视频编码
            var codec_box = document.getElementById('type_codec');
            codec_box.options[5].selected = true;
            switch (raw_info.codec_sel){
                case 'H264': case 'X264': codec_box.options[1].selected = true; break;
                case 'H265': case 'X265': codec_box.options[7].selected = true; break;
                case 'VC-1': codec_box.options[2].selected = true; break;
                case 'MPEG-2': codec_box.options[3].selected = true; break;
                case 'XVID': codec_box.options[4].selected = true;
            }

            //媒介
            var medium_box = document.getElementById('type_medium');
            switch(raw_info.medium_sel){
                case 'UHD': medium_box.options[1].selected = true; break;
                case 'Blu-ray': medium_box.options[1].selected = true; break;
                case 'DVD': medium_box.options[6].selected = true; break;
                case 'Remux': medium_box.options[2].selected = true; break;
                case 'HDTV': medium_box.options[3].selected = true; break;
                case 'WEB-DL': medium_box.options[6].selected = true; break;
                case 'Encode': medium_box.options[4].selected = true; break;
                default: medium_box.options[6].selected = true;
            }

            //分辨率
            var standard_box = document.getElementById('type_resolution');
            var standard_dict = {'4K': 5, '1080p': 1, '1080i': 2, '720p': 3, 'SD': 4, '': 4 };
            if (standard_dict.hasOwnProperty(raw_info.standard_sel)){
                var index = standard_dict[raw_info.standard_sel];
                standard_box.options[index].selected = true;
            }

            //英文标题
            var title_eng = document.getElementById('title_eng');
            title_eng.value = raw_info.name;

            //简介
            var upload_introduction = document.getElementById('upload_introduction');
            if (raw_info.descr.match(/简[\s]*?介[\s\S]+?\[quote\]/)){
                var introduction = raw_info.descr.match(/简[\s]*?介([\s\S]+?)\[quote\]/i)[1].trim();
                if (introduction.match(/◎获奖情况/)){
                    introduction = introduction.split('◎获奖情况')[0].trim();
                }
                upload_introduction.value = introduction;
            }

            //大海报
            var poster_big = document.getElementsByName('poster_big')[0];
            if (raw_info.descr.match(/\[img\](\S*?)\[\/img\]/i)){
                poster_big.value = raw_info.descr.match(/\[img\](\S*?)\[\/img\]/i)[1];
                $('input[name="poster"]').val(raw_info.descr.match(/\[img\](\S*?)\[\/img\]/i)[1]);
            }

            //imdb得分及其编号
            if(raw_info.descr.match(/IMDb评分.*?(\d+\.\d)\/10/)){
                var upload_imdb = document.getElementById('upload-imdb');
                upload_imdb.value = raw_info.descr.match(/IMDb评分.*?(\d+\.\d)\/10/)[1].trim();
            }
            if (raw_info.url) {
                var upload_imdb_url = document.getElementById('upload-imdb_url');
                upload_imdb_url.value = raw_info.url.match(/tt(\d+)/i)[1];
            }
        }

        else if (forward_site == 'HDCity') {
            document.getElementById('qr').disabled = false;
            var jump_str = dictToString(raw_info);
            GM_setClipboard(jump_str);
        }

        else if(forward_site == 'BHD') {

            var title = document.getElementById('title');
            title.value = raw_info.name;

            //Category
            var category_id = document.getElementById('category_id');
            var type_dict = {'电影': 1, '剧集': 2, '纪录': 2, '综艺': 2};
            //如果当前类型在上述字典中
            if (type_dict.hasOwnProperty(raw_info.type)){
                var index = type_dict[raw_info.type];
                category_id.options[index].selected = true;
            }

            //Source
            var autosource = document.getElementById('autosource');
            switch(raw_info.medium_sel){
                case 'Remux': case 'UHD': case 'Blu-ray': case 'Encode': autosource.options[1].selected = true; break;
                case 'DVD': autosource.options[5].selected = true; break;
                case 'HDTV': autosource.options[4].selected = true; break;
                case 'WEB-DL': autosource.options[3].selected = true; break;
                default: autosource.options[0].selected = true;
            }

            var size = 0;
            if (raw_info.medium_sel == 'Blu-ray' || raw_info.medium_sel == 'UHD') {
                size = get_size_from_descr(raw_info.descr);
            }

            //Type
            var autotype = document.getElementById('autotype');
            switch(raw_info.standard_sel){
                case '4K':
                    if (raw_info.medium_sel == 'UHD') {
                        if (0 <= size && size < 50) {
                            autotype.options[3].selected = true;
                        } else if (size < 66) {
                            autotype.options[2].selected = true;
                        } else {
                            autotype.options[1].selected = true;
                        }
                    } else if (raw_info.medium_sel == 'Remux') {
                        autotype.options[4].selected = true;
                    } else {
                        autotype.options[8].selected = true;
                    }
                    break;
                case '1080p':
                    if (raw_info.medium_sel != 'Blu-ray' && raw_info.medium_sel != 'Remux') {
                        autotype.options[9].selected = true;
                        break;
                    }
                case '1080i':
                    if (raw_info.medium_sel == 'Blu-ray') {
                        if (0 <= size && size < 25) {
                            autotype.options[6].selected = true;
                        } else {
                            autotype.options[5].selected = true;
                        }
                    } else if (raw_info.medium_sel == 'Remux') {
                        autotype.options[7].selected = true;
                    } else {
                        autotype.options[10].selected = true;
                    }
                    break;
                case '720p': autotype.options[11].selected = true; break;
                default: autotype.options[0].selected = true;
            }

            // Region (For Discs)
            var region = document.getElementsByName('region')[0];
            var options = region.options;
            for (i=0; i<options.length; i++) {
                if (options[i].value) {
                    var reg = new RegExp(' '+ options[i].value + ' ', 'i');
                    if (raw_info.name.match(reg)) {
                        options[i].selected = true;
                        break;
                    }
                }
            }

            //Edition (Optional)
            var edition = document.getElementsByName('edition')[0];
            if(raw_info.name.match(/Collector/)){
                edition.options[1].selected = true;
            } else if(raw_info.name.match(/Director/)){
                edition.options[2].selected = true;
            } else if(raw_info.name.match(/Extended/)){
                edition.options[3].selected = true;
            } else if(raw_info.name.match(/Limited/)){
                edition.options[4].selected = true;
            } else if(raw_info.name.match(/Special/)){
                edition.options[5].selected = true;
            } else if(raw_info.name.match(/Theatrical/)){
                edition.options[6].selected = true;
            } else if(raw_info.name.match(/Uncut/)){
                edition.options[7].selected = true;
            } else if(raw_info.name.match(/Unrated/)){
                edition.options[8].selected = true;
            }


            //MediaInfo/BDInfo
            infos = get_mediainfo_picture_from_descr(raw_info.descr);
            // GM_setClipboard(infos.mediainfo);
            $('#mediainfo').val(infos.mediainfo);
            $('#upload-form-description').val(infos.pic_info);

            //imdb编号
            if (raw_info.url) {
                var upload_imdb_url = document.getElementById('imdbauto');
                upload_imdb_url.value = raw_info.url.match(/(tt\d+)/i)[1];
            }

            if (if_uplver) {
                document.getElementsByName('anonymous')[0].checked = true;
            }

            $('#userValue').val(search_name);
            $('#userSearch').attr('id', 'search');
            setTimeout(function(){
                $('#search').click(function(e){
                    e.preventDefault();
                    if (search_name && tmdb_key) {
                        var $div = $('#userMatches');
                        if ($div.find('table').length > 0){
                            $div.find('table').first().slideDown(1000);
                            return
                        }
                        var $table = $(`<table class="table-new" style="margin-top: 10px;"></table>`);
                        $div.append($table);
                        $('#apimatch').val(raw_info.name);
                        var search_url;
                        if (raw_info.type == '剧集') {
                            search_url = 'http://api.tmdb.org/3/search/tv?api_key={key}&language=zh-CN&query={name}&page=1&include_adult=true';
                        } else if (raw_info.type == '电影') {
                            search_url = 'http://api.tmdb.org/3/search/movie?api_key={key}&language=zh-CN&query={name}&page=1&include_adult=true';
                        } else {
                            search_url = 'http://api.tmdb.org/3/search/multi?api_key={key}&language=zh-CN&query={name}&page=1&include_adult=true';
                        }
                        search_url = search_url.format({'key': tmdb_key, 'name': search_name});
                        console.log(search_url)

                        function compare(date){
                            return function(obj1, obj2) {
                                try{ var value1 = obj1[date].split('-')[0]+obj1[date].split('-')[1]+obj1[date].split('-')[2];} catch(err) {value1='00000000'}
                                try{ var value2 = obj2[date].split('-')[0]+obj2[date].split('-')[1]+obj2[date].split('-')[2];} catch(err) {value2='00000000'}
                                return value2 - value1;
                            }
                        }
                        getJson(search_url, null, function(data) {
                            if (data.results.length > 2) {
                                if (raw_info.type == '剧集') {
                                    data.results = data.results.sort(compare('first_air_date'));
                                } else {
                                    data.results = data.results.sort(compare('release_date'));
                                }
                            }
                            if (data.results.length > 0) {
                                for(i=0;i<data.results.length;i++){
                                    var $tr=$("<tr></tr>");
                                    if (raw_info.type == '剧集'){
                                        $td0 = $(`<td><img src="https://image.tmdb.org/t/p/w300_and_h450_bestv2${data.results[i].poster_path}"; style="width:80px; height: 120px;"></td>`);
                                        $td1 = $(`<td>${data.results[i].first_air_date}</td>`);
                                        $td2 = $(`<td>${data.results[i].original_name}</td>`);
                                        $td3 = $(`<td><a href="https://www.themoviedb.org/TV/${data.results[i].id}" target="_blank">${data.results[i].name}</a></td>`);
                                        $td5 = $(`<td><input type="button" class="fill_number" name=${data.results[i].id} value="USE"></td>`);
                                        $tr.append($td0); $tr.append($td1); $tr.append($td2); $tr.append($td3); $tr.append($td5);
                                    } else {
                                        $td0 = $(`<td><img src="https://image.tmdb.org/t/p/w300_and_h450_bestv2${data.results[i].poster_path}"; style="width: 80px; height: 120px;"></td>`);
                                        $td1 = $(`<td>${data.results[i].release_date}</td>`);
                                        $td2 = $(`<td>${data.results[i].original_title}</td>`);
                                        $td3 = $(`<td><a href="https://www.themoviedb.org/movie/${data.results[i].id}" target="_blank">${data.results[i].title}</a></td>`);
                                        $td5 = $(`<td><input type="button" class="fill_number" name=${data.results[i].id} value="USE"></td>`);
                                        $tr.append($td0); $tr.append($td1); $tr.append($td2); $tr.append($td3); $tr.append($td5);
                                    }
                                    $table.append($tr);
                                }
                                $('.fill_number').css({'backgroundColor': 'rgb(70, 77, 96)'});
                                $('.fill_number').click(function(){
                                    $('#tmdbauto').val($(this).attr('name'));
                                    $table.slideUp(500);
                                    window.scrollTo(0, 600);
                                });
                                $table.find('td').css({'backgroundColor': 'rgb(38, 38, 50)'});
                            }
                        });
                    }
                });

                $('#search').click();

            }, 2000);
        }

        else if (forward_site == 'HDU') {
            //类型
            var browsecat = document.getElementById('browsecat');
            var type_dict = {'电影': 1, '剧集': 2, '动漫': 5, '综艺': 3, '音乐': 6, '纪录': 4,
                             '体育': 7, '软件': 9, '学习': 9, '': 9, '游戏': 10};
            //如果当前类型在上述字典中
            browsecat.options[9].selected = true;//默认其他
            if (type_dict.hasOwnProperty(raw_info.type)){
                var index = type_dict[raw_info.type];
                browsecat.options[index].selected = true;
            }

            //媒介
            var medium_box = document.getElementsByName('medium_sel')[0];
            switch(raw_info.medium_sel){
                case 'UHD': medium_box.options[2].selected = true; break;
                case 'Blu-ray': medium_box.options[1].selected = true; break;
                case 'DVD': medium_box.options[4].selected = true; break;
                case 'Remux':
                    if (raw_info.standard_sel == '4K' && raw_info.type == '剧集'){
                        medium_box.options[7].selected = true; break;
                    } else if (raw_info.standard_sel == '4K') {
                        medium_box.options[6].selected = true; break;
                    } else if (raw_info.type == '剧集'){
                        medium_box.options[8].selected = true; break;
                    } else {
                        medium_box.options[5].selected = true;
                    }
                    break;
                case 'HDTV': medium_box.options[3].selected = true; break;
                case 'WEB-DL':
                    if (raw_info.type == '剧集'){
                        medium_box.options[12].selected = true; break;
                    } else {
                        medium_box.options[11].selected = true; break;
                    }
                case 'Encode':
                    if (raw_info.type == '剧集'){
                        medium_box.options[10].selected = true; break;
                    } else {
                        medium_box.options[9].selected = true; break;
                    }
                default: medium_box.options[9].selected = true;
            }

            //视频编码
            var codec_box = document.getElementsByName('codec_sel')[0];
            switch (raw_info.codec_sel){
                case 'H264': codec_box.options[1].selected = true; break;
                case 'X264': codec_box.options[4].selected = true; break;
                case 'H265': codec_box.options[2].selected = true; break;
                case 'X265': codec_box.options[2].selected = true; break;
                case 'VC-1': codec_box.options[3].selected = true; break;
                case 'MPEG-2': codec_box.options[6].selected = true; break;
                case 'XVID': codec_box.options[5].selected = true; break;
                default: codec_box.options[7].selected = true;
            }

            //音频编码
            var audiocodec_box = document.getElementsByName('audiocodec_sel')[0];
            var audiocodec_dict = { 'TrueHD': 3, 'Atmos': 3, 'DTS': 5, 'DTS-HD': 6, 'DTS-HDMA': 2, 'DTS-HDMA:X 7.1': 1, 'WAV': 9,
                                    'AC3': 6, 'LPCM': 4, 'Flac': 1, 'MP3': 10, 'AAC': 7, 'APE': 8, '': 11 };
            if (audiocodec_dict.hasOwnProperty(raw_info.audiocodec_sel)){
                var index = audiocodec_dict[raw_info.audiocodec_sel];
                audiocodec_box.options[index].selected = true;
            }

            //分辨率
            var standard_box = document.getElementsByName('standard_sel')[0];
            var standard_dict = {'4K': 3, '1080p': 1, '1080i': 2, '720p': 4, 'SD': 5, '': 5 };
            if (standard_dict.hasOwnProperty(raw_info.standard_sel)){
                var index = standard_dict[raw_info.standard_sel];
                standard_box.options[index].selected = true;
            }
            //ipad的简单判定
            if (raw_info.name.match(/(pad$|ipad)/i)){
                standard_box.options[6].selected = true;
            }

            //地区
            var source_box = document.getElementsByName('processing_sel')[0];
            var source_dict = {'欧美': 3, '大陆': 1, '香港': 2, '台湾': 2, '日本': 4, '韩国': 5, '日韩': 5,
                               '印度': 6, '': 8, '港台': 2};
            if (source_dict.hasOwnProperty(raw_info.source_sel)){
                var index = source_dict[raw_info.source_sel];
                source_box.options[index].selected = true;
            }
        }

        else if (forward_site == 'CCF') {
            var title_chs = document.getElementsByName('chname')[0];
            var small_descr = '';
            if(raw_info.descr.match(/译.*?名([^\r\n]+)/) == null){
                small_descr = raw_info.descr.match(/片.*?名([^\r\n]+)/)[1].trim();
            }else{
                small_descr = raw_info.descr.match(/译.*?名([^\r\n]+)/)[1].trim();
            }
            title_chs.value = small_descr;
            document.getElementsByName('imdb')[0].value = raw_info.url;

            var medium_box = document.getElementsByName('type')[0];
            switch(raw_info.medium_sel){
                case 'UHD': medium_box.options[2].selected = true; break;
                case 'Blu-ray': medium_box.options[2].selected = true; break;
                case 'DVD':
                    if (raw_info.name.match(/HD ?DVD/i)){
                        medium_box.options[1].selected = true;
                    } else {
                        medium_box.options[18].selected = true;
                    }
                    break;
                case 'Remux': case 'WEB-DL': case 'Encode':
                    if (raw_info.type == '电影') {
                        if (raw_info.standard_sel == '1080p' || raw_info.standard_sel == '4K') {
                            medium_box.options[3].selected = true; break;
                        } else {
                            medium_box.options[4].selected = true; break;
                        }
                    } else if (raw_info.type == '剧集') {
                        switch (raw_info.source_sel){

                            case '大陆':
                                if (raw_info.name.match(/(complete|S\d{2}[^E])/i) && (!raw_info.name.match(/E\d{2,3}/i))) {
                                    medium_box.options[14].selected = true; break;
                                } else {
                                    medium_box.options[6].selected = true;
                                }
                                break;
                            case '台湾': case '香港': case '港台':
                                if (raw_info.name.match(/(complete|S\d{2}[^E])/i)) {
                                    medium_box.options[15].selected = true; break;
                                } else {
                                    medium_box.options[7].selected = true;
                                }
                                break;
                            case '日本': case '韩国':
                                if (raw_info.name.match(/(complete|S\d{2}[^E])/i)) {
                                    medium_box.options[16].selected = true;
                                } else {
                                    medium_box.options[8].selected = true;
                                }
                                break;
                            case '欧美':
                                if (raw_info.name.match(/(complete|S\d{2}[^E])/i)) {
                                    medium_box.options[13].selected = true;
                                } else {
                                    medium_box.options[5].selected = true;
                                }
                                break;
                        }
                    } else if (raw_info.type == '动漫'){
                        medium_box.options[11].selected = true; break;
                    } else if (raw_info.type == '体育'){
                        medium_box.options[10].selected = true; break;
                    } else if (raw_info.type == '纪录'){
                        medium_box.options[9].selected = true; break;
                    }

                case 'HDTV': medium_box.options[17].selected = true; break;
                default:
                    if (raw_info.type == '音乐') {
                        medium_box.options[20].selected = true;
                    } else if (raw_info.codec_sel == 'XVID') {
                        medium_box.options[19].selected = true;
                    } else {
                        medium_box.options[21].selected = true;
                    }
            }

            // 带宽
            document.getElementsByName('addinfo1')[0].value = '上下百兆对等';
            document.getElementsByName('addinfo2')[0].value = '7x24小时不间断做种';
        }

        else if (forward_site == 'Dragon') {
            var browsecat = document.getElementById('browsecat');
            switch (raw_info.type){
                case '电影': browsecat.options[1].selected = true;  break;
                case '剧集': browsecat.options[2].selected = true;  break;
                case '游戏': browsecat.options[3].selected = true;  break;
                case '纪录': browsecat.options[4].selected = true;  break;
                case '动漫': browsecat.options[5].selected = true;  break;
                case '综艺': browsecat.options[6].selected = true;  break;
                case '音乐': browsecat.options[9].selected = true;  break;
                case '体育': browsecat.options[8].selected = true;  break;
                case '学习': browsecat.options[11].selected = true;  break;
                case '软件': browsecat.options[11].selected = true;
            }

            //媒介
            var medium_box = document.getElementsByName('medium_sel')[0];
            medium_box.options[9].selected = true;
            switch(raw_info.medium_sel){
                case 'UHD': medium_box.options[1].selected = true; break;
                case 'Blu-ray': medium_box.options[2].selected = true; break;
                case 'DVD': medium_box.options[6].selected = true; break;
                case 'Remux': medium_box.options[3].selected = true; break;
                case 'HDTV': medium_box.options[7].selected = true; break;
                case 'Encode': medium_box.options[4].selected = true; break;
                case 'WEB-DL': medium_box.options[5].selected = true;
            }

            //视频编码
            var codec_box = document.getElementsByName('codec_sel')[0];
            codec_box.options[5].selected = true;
            switch (raw_info.codec_sel){
                case 'H265': case 'X265': codec_box.options[2].selected = true; break;
                case 'H264': case 'X264': codec_box.options[1].selected = true; break;
                case 'VC-1': codec_box.options[3].selected = true; break;
                case 'MPEG-2': case 'MPEG-4': codec_box.options[4].selected = true;
            }

            //音频编码
            var audiocodec_box = document.getElementsByName('audiocodec_sel')[0];
            audiocodec_box.options[15].selected = true;
            switch (raw_info.audiocodec_sel){
                case 'DTS-HD': audiocodec_box.options[1].selected = true; break;
                case 'DTS-HDMA:X 7.1': audiocodec_box.options[3].selected = true; break;
                case 'DTS-HDMA': audiocodec_box.options[4].selected = true; break;
                case 'TrueHD': audiocodec_box.options[2].selected = true; break;
                case 'Atmos': audiocodec_box.options[1].selected = true; break;
                case 'LPCM': audiocodec_box.options[10].selected = true; break;
                case 'DTS': audiocodec_box.options[6].selected = true; break;
                case 'AC3': audiocodec_box.options[9].selected = true; break;
                case 'AAC': audiocodec_box.options[8].selected = true; break;
                case 'Flac': audiocodec_box.options[7].selected = true; break;
                case 'APE': audiocodec_box.options[13].selected = true; break;
                case 'WAV': audiocodec_box.options[14].selected = true;
            }

            //分辨率
            var standard_box = document.getElementsByName('standard_sel')[0];
            var standard_dict = {'8K': 1, '4K': 2, '1080p': 4, '1080i': 4, '720p': 5, 'SD': 6, '': 6 };
            if (standard_dict.hasOwnProperty(raw_info.standard_sel)){
                var index = standard_dict[raw_info.standard_sel];
                standard_box.options[index].selected = true;
            }
        }

        else if (forward_site == '52PT') {
            //类型
            var browsecat = document.getElementById('browsecat');
            var type_dict = {'电影': 1, '剧集': 4, '动漫': 3, '综艺': 5, '音乐': 6, '纪录': 2,
                             '体育': 7, '软件': 8, '学习': 8, '': 8, '游戏': 8};
            //如果当前类型在上述字典中
            browsecat.options[8].selected = true;//默认其他
            if (type_dict.hasOwnProperty(raw_info.type)){
                var index = type_dict[raw_info.type];
                browsecat.options[index].selected = true;
            }

            //媒介
            var medium_box = document.getElementsByName('medium_sel')[0];
            medium_box.options[14].selected = true;
            switch(raw_info.medium_sel){
                case 'UHD':
                    if (labels.diy){
                        medium_box.options[4].selected = true;
                    } else {
                        medium_box.options[1].selected = true;
                    }
                    break;
                case 'Blu-ray':
                    if (labels.diy){
                        medium_box.options[3].selected = true;
                    } else {
                        medium_box.options[2].selected = true;
                    }
                    break;
                case 'DVD': medium_box.options[11].selected = true; break;
                case 'Remux':
                    if (raw_info.name.match(/uhd/i)){
                        medium_box.options[10].selected = true;
                    } else {
                        medium_box.options[9].selected = true;
                    }
                case 'HDTV': medium_box.options[7].selected = true; break;
                case 'Encode': medium_box.options[8].selected = true; break;
                case 'WEB-DL': medium_box.options[13].selected = true;
            }

            var codec_box = document.getElementsByName('codec_sel')[0];
            switch (raw_info.codec_sel){
                case 'H264': codec_box.options[1].selected = true; break;
                case 'X264': codec_box.options[4].selected = true; break;
                case 'H265':
                    if (raw_info.name.match(/HEVC/i)){
                        codec_box.options[2].selected = true;
                    } else {
                        codec_box.options[6].selected = true;
                    }
                    break;
                case 'X265': codec_box.options[7].selected = true; break;
                case 'VC-1': codec_box.options[9].selected = true; break;
                case 'MPEG-2': codec_box.options[3].selected = true; break;
                case 'XVID': codec_box.options[8].selected = true; break;
                default: codec_box.options[4].selected = true;
            }

            //音频编码
            var audiocodec_box = document.getElementsByName('audiocodec_sel')[0];
            var audiocodec_dict = { 'TrueHD': 2, 'Atmos': 3, 'DTS': 7, 'DTS-HD': 1, 'DTS-HDMA': 1, 'DTS-HDMA:X 7.1': 4, 'WAV': 11,
                                    'AC3': 5, 'LPCM': 6, 'Flac': 9, 'MP3': 13, 'AAC': 8, 'APE': 10, '': 13 };
            if (audiocodec_dict.hasOwnProperty(raw_info.audiocodec_sel)){
                var index = audiocodec_dict[raw_info.audiocodec_sel];
                audiocodec_box.options[index].selected = true;
            }

            //分辨率
            var standard_box = document.getElementsByName('standard_sel')[0];
            var standard_dict = {'4K': 2, '1080p': 1, '1080i': 3, '720p': 4, 'SD': 5, '': 6, '8K': 7};
            if (standard_dict.hasOwnProperty(raw_info.standard_sel)){
                var index = standard_dict[raw_info.standard_sel];
                standard_box.options[index].selected = true;
            }
        }

        else if (forward_site == 'YDY') {
            var browsecat = document.getElementById('browsecat');
            if (raw_info.type == '电影') {
                if (raw_info.medium_sel == 'Blu-ray' || raw_info.medium_sel == 'UHD') {
                    browsecat.options[8].selected = true;
                } else {
                    browsecat.options[7].selected = true;
                }
            } else if (raw_info.type == '剧集') {
                if (raw_info.medium_sel == 'Blu-ray' || raw_info.medium_sel == 'UHD') {
                    browsecat.options[10].selected = true;
                } else {
                    browsecat.options[9].selected = true;
                }
            } else {
                browsecat.options[12].selected = true;
            }

            $('input[name="url"]').css({"width": "650px"});

            //来源
            var source_box = document.getElementsByName('source_sel')[0];
            source_box.options[7].selected=true;
            switch(raw_info.medium_sel){
                case 'UHD': source_box.options[1].selected=true; break;
                case 'Blu-ray': source_box.options[2].selected=true; break;
                case 'Encode': source_box.options[2].selected = true; break;
                case 'HDTV': source_box.options[3].selected=true; break;
                case 'WEB-DL': source_box.options[5].selected=true; break;
                case 'DVD': source_box.options[4].selected=true;
            }
            if (raw_info.name.match(/dvdrip|webrip/i)) {
                source_box.options[6].selected=true;
            }

            //媒介
            var medium_box = document.getElementsByName('medium_sel')[0];
            switch(raw_info.medium_sel){
                case 'UHD': medium_box.options[1].selected = true; break;
                case 'Blu-ray': medium_box.options[2].selected = true; break;
                case 'Remux': medium_box.options[3].selected = true; break;
                case 'HDTV': medium_box.options[5].selected = true; break;
                case 'Encode': medium_box.options[4].selected = true; break;
            }

            //视频编码
            var codec_box = document.getElementsByName('codec_sel')[0];
            codec_box.options[6].selected = true;
            switch (raw_info.codec_sel){
                case 'H265': case 'X265': codec_box.options[5].selected = true; break;
                case 'H264': case 'X264': codec_box.options[1].selected = true; break;
                case 'VC-1': codec_box.options[2].selected = true; break;
                case 'MPEG-2': case 'MPEG-4': codec_box.options[4].selected = true; break;
                case 'XVID': codec_box.options[3].selected = true;
            }

            //音频编码
            var audiocodec_box = document.getElementsByName('audiocodec_sel')[0];
            switch (raw_info.audiocodec_sel){
                case 'DTS-HD': audiocodec_box.options[8].selected = true; break;
                case 'DTS-HDMA:X 7.1': audiocodec_box.options[8].selected = true; break;
                case 'DTS-HDMA': audiocodec_box.options[8].selected = true; break;
                case 'TrueHD': audiocodec_box.options[7].selected = true; break;
                case 'Atmos': audiocodec_box.options[9].selected = true; break;
                case 'DTS': audiocodec_box.options[1].selected = true; break;
                case 'AC3': audiocodec_box.options[5].selected = true; break;
                case 'AAC': audiocodec_box.options[6].selected = true; break;
                case 'Flac': audiocodec_box.options[2].selected = true; break;
                case 'APE': audiocodec_box.options[4].selected = true; break;
                case 'WAV': audiocodec_box.options[3].selected = true;
            }

            //分辨率
            var standard_box = document.getElementsByName('standard_sel')[0];
            var standard_dict = {
                '4K': 1, '1080p': 2, '1080i': 3, '720p': 4, 'SD': 5, '': 5
            };
            if (standard_dict.hasOwnProperty(raw_info.standard_sel)){
                var index = standard_dict[raw_info.standard_sel];
                standard_box.options[index].selected = true;
            }
        }

        else if (forward_site == 'PTMSG') {
            //类型
            var browsecat = document.getElementById('browsecat');
            var type_dict = {'电影': 1, '剧集': 4, '动漫': 3, '综艺': 5, '音乐': 6, '纪录': 2,
                             '体育': 7, '软件': 8, '学习': 8, '': 8, '游戏': 8};
            //如果当前类型在上述字典中
            browsecat.options[8].selected = true;//默认其他
            if (type_dict.hasOwnProperty(raw_info.type)){
                var index = type_dict[raw_info.type];
                browsecat.options[index].selected = true;
            }

            //媒介
            var medium_box = document.getElementsByName('medium_sel')[0];
            medium_box.options[11].selected = true;
            switch(raw_info.medium_sel){
                case 'UHD': medium_box.options[1].selected = true; break;
                case 'Blu-ray': medium_box.options[1].selected = true; break;
                case 'DVD':
                    if (raw_info.name.match(/HD ?DVD/i)){
                        medium_box.options[2].selected = true;
                    } else {
                        medium_box.options[7].selected = true;
                    }
                    break;
                case 'Remux': medium_box.options[3].selected = true; break;
                case 'HDTV': medium_box.options[6].selected = true; break;
                case 'Encode': medium_box.options[4].selected = true; break;
                case 'WEB-DL': medium_box.options[10].selected = true;
            }
            if (raw_info.name.match(/MiniBD/i)){
                medium_box.options[5].selected = true;
            }

            //编码 音频视频混合了
            var codec_box = document.getElementsByName('codec_sel')[0];
            var audiocodec_dict = {'Flac': 7, 'APE': 8, 'DTS': 9, 'AC3': 10, 'WAV': 11, 'MP3': 12,
                                   'AAC': 16 };
            if (audiocodec_dict.hasOwnProperty(raw_info.audiocodec_sel)){
                var index = audiocodec_dict[raw_info.audiocodec_sel];
                codec_box.options[index].selected = true;
            }

            switch (raw_info.codec_sel){
                case 'H264': case 'X264':
                    codec_box.options[1].selected = true; break;
                case 'VC-1':
                    codec_box.options[2].selected = true; break;
                case 'XVID':
                    codec_box.options[3].selected = true; break;
                case 'MPEG-2':
                    codec_box.options[4].selected = true; break;
                case 'MPEG-4':
                    codec_box.options[13].selected = true; break;
                case 'H265': case 'X265':
                    codec_box.options[14].selected = true;
            }

            //分辨率
            var standard_box = document.getElementsByName('standard_sel')[0];
            var standard_dict = {'4K': 6, '1080p': 1, '1080i': 2, '720p': 3, 'SD': 4, '': 5, '8K': 6};
            if (standard_dict.hasOwnProperty(raw_info.standard_sel)){
                var index = standard_dict[raw_info.standard_sel];
                standard_box.options[index].selected = true;
            }
        }

        else if (forward_site == 'SoulVoice') {
            //类型
            var browsecat = document.getElementById('browsecat');
            var type_dict = {'电影': 2, '剧集': 3, '动漫': 5, '综艺': 6, '音乐': 8, '纪录': 4,
                             '体育': 7, '软件': 9, '学习': 1, '': 9, '游戏': 9};
            //如果当前类型在上述字典中
            browsecat.options[9].selected = true;//默认其他
            if (type_dict.hasOwnProperty(raw_info.type)){
                var index = type_dict[raw_info.type];
                browsecat.options[index].selected = true;
            }

            //媒介
            var medium_box = document.getElementsByName('medium_sel')[0];
            medium_box.options[5].selected = true;
            if (raw_info.medium_sel == 'Encode') {
                medium_box.options[1].selected = true;
            } else if (raw_info.name.match(/MiniBD/i)){
                medium_box.options[2].selected = true;
            } else if (raw_info.audiocodec_sel == 'Flac' || raw_info.audiocodec_sel == 'APE') {
                medium_box.options[3].selected = true;
            } else if (raw_info.type == '音乐' && raw_info.name.mathc(/dsd/i)){
                medium_box.options[4].selected = true;
            }

            //编码
            var codec_box = document.getElementsByName('codec_sel')[0];
            switch (raw_info.codec_sel){
                case 'H264': case 'X264': codec_box.options[1].selected = true; break;
                case 'H265': case 'X265': codec_box.options[2].selected = true; break;
                default: codec_box.options[3].selected = true;
            }
            //格式
            var audiocodec_box = document.getElementsByName('audiocodec_sel')[0];
            audiocodec_box.options[5].selected = true;

            //分辨率
            var standard_box = document.getElementsByName('standard_sel')[0];
            var standard_dict = {'4K': 3, '1080p': 1, '1080i': 2, '720p': 4, 'SD': 4, '': 4, '8K': 4};
            if (standard_dict.hasOwnProperty(raw_info.standard_sel)){
                var index = standard_dict[raw_info.standard_sel];
                standard_box.options[index].selected = true;
            }

            //类别
            var source_box = document.getElementsByName('processing_sel')[0];
            source_box.options[12].selected = true;

            function disableother(select,target)
            {
                if (document.getElementById(select).value == 0)
                    document.getElementById(target).disabled = false;
                else {
                    document.getElementById(target).disabled = true;
                    document.getElementById(select).disabled = false;
                }
            }
            disableother('browsecat','specialcat');

            //类别
            var source_box = document.getElementsByName('processing_sel')[0];
            source_box.options[13].selected = true;
        }

        else if (forward_site == 'DiscFan') {
            var browsecat = document.getElementById('browsecat');
            switch (raw_info.type){
                case '电影': case '动漫':
                    if (raw_info.source_sel == '大陆'){
                        browsecat.options[1].selected = true;
                    } else if (raw_info.source_sel == '香港'){
                        browsecat.options[2].selected = true;
                    } else if (raw_info.source_sel == '台湾'){
                        browsecat.options[3].selected = true;
                    } else if (raw_info.source_sel == '日本'){
                        browsecat.options[5].selected = true;
                    } else if (raw_info.source_sel == '韩国'){
                        browsecat.options[6].selected = true;
                    } else {
                        var reg_region = raw_info.descr.match(/(地.{0,5}?区|国.{0,5}?家|产.{0,5}?地)([^\r\n]+)/);
                        if (reg_region && reg_region[2].match(/泰国/)) {
                            browsecat.options[4].selected = true;
                        } else {
                            browsecat.options[7].selected = true;
                        }
                    }
                    break;
                case '剧集': browsecat.options[8].selected = true;  break;
                case '纪录': browsecat.options[10].selected = true;  break;
                case '综艺': browsecat.options[11].selected = true;  break;
                case '音乐': browsecat.options[9].selected = true;  break;
                case '体育': browsecat.options[12].selected = true;  break;
            }

            var source_box = document.getElementsByName('source_sel')[0];
            if (raw_info.standard_sel == '4K') {
                source_box.options[2].selected = true;
            }
            switch(raw_info.medium_sel){
                case 'UHD': source_box.options[1].selected = true; break;
                case 'Blu-ray': source_box.options[2].selected = true; break;
                case 'DVD':  source_box.options[3].selected = true; break;
                // case 'Remux': source_box.options[3].selected = true; break;
                case 'HDTV': source_box.options[1].selected = true; break;
                case 'Encode': source_box.options[10].selected = true; break;
                case 'WEB-DL': source_box.options[9].selected = true;
            }
            if (raw_info.name.match(/dvdrip|BDRIP/i)) {
                source_box.options[10].selected = true;
            } else if (raw_info.name.match(/tvrip/i)) {
                source_box.options[5].selected = true;
            } else if (raw_info.name.match(/ldrip/i)) {
                source_box.options[7].selected = true;
            } else if (raw_info.name.match(/vcd/i)) {
                source_box.options[6].selected = true;
            } else if (raw_info.name.match(/vhsrip/i)) {
                source_box.options[8].selected = true;
            }
        }

        else if (forward_site == 'JoyHD') {

            $('input[name="imdburl"]').val(raw_info.url);

            //类型
            var browsecat = document.getElementById('browsecat');
            var type_dict = {'电影': 1, '剧集': 2, '动漫': 4, '综艺': 3, '音乐': 5, '纪录': 7,
                             '体育': 6, '软件': 9, '学习': 11, '': 12, '游戏': 10};
            //如果当前类型在上述字典中
            browsecat.options[12].selected = true;//默认其他
            if (type_dict.hasOwnProperty(raw_info.type)){
                var index = type_dict[raw_info.type];
                browsecat.options[index].selected = true;
            }

            // $('#browsecat').trigger('change');
            // $('#browsecat').change();
            var evt = document.createEvent("HTMLEvents");
            evt.initEvent("change", false, true);
            document.getElementById('browsecat').dispatchEvent(evt);
            var medium_box = document.getElementsByName('source_sel')[0];
            switch (raw_info.type){
                case '电影':
                    switch(raw_info.medium_sel){
                        case 'UHD': case 'Blu-ray': medium_box.options[5].selected = true; break;
                        case 'DVD': medium_box.options[8].selected = true; break;
                        case 'Remux': medium_box.options[6].selected = true; break;
                        case 'HDTV': medium_box.options[9].selected = true; break;
                        case 'WEB-DL': medium_box.options[4].selected = true; break;
                        case 'Encode':
                            if (raw_info.standard_sel == '1080p'){
                                medium_box.options[2].selected = true;
                            } else if(raw_info.standard_sel == '720p'){
                                medium_box.options[1].selected = true;
                            } else if (raw_info.standard_sel == '4K') {
                                medium_box.options[11].selected = true;
                            }
                            if (raw_info.name.match(/pad$|ipad/i)) {
                                medium_box.options[12].selected = true;
                            }
                            break;
                        default:
                            if (raw_info.standard_sel == '1080p'){
                                medium_box.options[2].selected = true;
                            } else if(raw_info.standard_sel == '720p'){
                                medium_box.options[1].selected = true;
                            } else if (raw_info.standard_sel == '4K'){
                                medium_box.options[11].selected = true;
                            }
                    }
                    if (raw_info.match(/10bit/)) {
                        medium_box.options[3].selected = true;
                    } else if (raw_info.name.match(/BDRIP/i)) {
                        medium_box.options[10].selected = true;
                    }

                    break;
                case '剧集':
                    switch (raw_info.source_sel){
                        case '大陆': medium_box.options[2].selected = true; break;
                        case '台湾': case '香港': case '港台': medium_box.options[3].selected = true; break;
                        case '日本': medium_box.options[5].selected = true; break;
                        case '韩国': medium_box.options[6].selected = true; break;
                        case '欧美': medium_box.options[4].selected = true; break;
                    }
                    if (raw_info.name.match(/S\d+[^E]|complete/i)) {
                        medium_box.options[1].selected = true;
                    }
                    break;
                case '综艺': medium_box.options[2].selected = true; break;
                case '纪录': medium_box.options[7].selected = true; break;
                case '动漫': medium_box.options[2].selected = true; break;
                case '音乐': medium_box.options[1].selected = true; break;
                case '体育': case '学习': case '软件': medium_box.options[4].selected = true; break;
            }
        }

        else if (forward_site == 'HDZone') {
            var is_pad = false;
            if (raw_info.name.match(/pad$|ipad/i)){
                is_pad = true;
            }
            switch (raw_info.type){
                case '电影':
                    if (raw_info.medium_sel == 'Blu-ray'){
                        set_selected_option_by_value('browsecat','450');
                    } else if(raw_info.medium_sel == 'UHD'){
                        set_selected_option_by_value('browsecat','499');
                    } else if(raw_info.medium_sel == 'Remux'){
                        set_selected_option_by_value('browsecat','415');
                    } else {
                        if (is_pad){
                            set_selected_option_by_value('browsecat','412');
                        } else{
                            if (raw_info.standard_sel == '720p'){
                                set_selected_option_by_value('browsecat','413');
                            } else if(raw_info.standard_sel == '1080i' || raw_info.standard_sel == '1080p'){
                                set_selected_option_by_value('browsecat','414');
                            } else if (raw_info.standard_sel == '4K'){
                                set_selected_option_by_value('browsecat','416');
                            } else if (raw_info.standard_sel == 'SD'){
                                set_selected_option_by_value('browsecat','411');
                            }
                        }

                    }
                    break;
                case '剧集':
                    if (raw_info.medium_sel == 'Blu-ray' || raw_info.medium_sel == 'UHD'){
                        if (raw_info.standard_sel == '4K'){
                            set_selected_option_by_value('browsecat','502');
                        } else{
                            set_selected_option_by_value('browsecat','453');
                        }
                    }  else if(raw_info.medium_sel == 'Remux'){
                        set_selected_option_by_value('browsecat','437');
                    } else {
                        if (is_pad){
                            set_selected_option_by_value('browsecat','433');
                        } else{
                            if (raw_info.standard_sel == '720p'){
                                set_selected_option_by_value('browsecat','434');
                            } else if(raw_info.standard_sel == '1080i'){
                                set_selected_option_by_value('browsecat','435');
                            } else if (raw_info.standard_sel == '1080p'){
                                set_selected_option_by_value('browsecat','436');
                            } else if (raw_info.standard_sel == '4K'){
                                set_selected_option_by_value('browsecat','438');
                            } else if (raw_info.standard_sel == 'SD'){
                                set_selected_option_by_value('browsecat','432');
                            }
                        }

                    }

                    break;
                case '音乐':
                    if (raw_info.name.match(/MV/i)) {
                        set_selected_option_by_value('browsecat','441');
                    } else if (raw_info.name.match(/APE/i)) {
                        set_selected_option_by_value('browsecat','439');
                    } else if (raw_info.name.match(/Flac/i)) {
                        set_selected_option_by_value('browsecat','440');
                    }
                    break;

                case '综艺':
                    if (raw_info.medium_sel == 'Blu-ray' || raw_info.medium_sel == 'UHD'){
                        set_selected_option_by_value('browsecat','452');
                    } else if(raw_info.medium_sel == 'Remux'){
                        set_selected_option_by_value('browsecat','430');
                    } else {
                        if (is_pad){
                            set_selected_option_by_value('browsecat','426');
                        } else{
                            if (raw_info.standard_sel == '720p'){
                                set_selected_option_by_value('browsecat','427');
                            } else if(raw_info.standard_sel == '1080i'){
                                set_selected_option_by_value('browsecat','428');
                            } else if (raw_info.standard_sel == '1080p'){
                                set_selected_option_by_value('browsecat','429');
                            } else if (raw_info.standard_sel == '4K'){
                                set_selected_option_by_value('browsecat','431');
                            } else if (raw_info.standard_sel == 'SD'){
                                set_selected_option_by_value('browsecat','425');
                            }
                        }

                    }
                    break;
                case '纪录':
                    if (raw_info.medium_sel == 'Blu-ray'){
                        set_selected_option_by_value('browsecat','451');
                    } else if (raw_info.medium_sel == 'UHD'){
                        set_selected_option_by_value('browsecat','500');
                    } else if(raw_info.medium_sel == 'Remux'){
                        set_selected_option_by_value('browsecat','421');
                    } else {
                        if (is_pad){
                            set_selected_option_by_value('browsecat','418');
                        } else{
                            if (raw_info.standard_sel == '720p'){
                                set_selected_option_by_value('browsecat','419');
                            } else if(raw_info.standard_sel == '1080i' || raw_info.standard_sel == '1080p'){
                                set_selected_option_by_value('browsecat','420');
                            } else if (raw_info.standard_sel == '4K'){
                                set_selected_option_by_value('browsecat','422');
                            } else if (raw_info.standard_sel == 'SD'){
                                set_selected_option_by_value('browsecat','417');
                            }
                        }

                    }

                    break;

                case '动漫':
                    if (raw_info.medium_sel == 'Blu-ray'){
                        set_selected_option_by_value('browsecat','454');
                    } else if (raw_info.medium_sel == 'UHD'){
                        set_selected_option_by_value('browsecat','501');
                    } else if(raw_info.medium_sel == 'Remux'){
                        set_selected_option_by_value('browsecat','448');
                    } else {
                        if (is_pad){
                            set_selected_option_by_value('browsecat','445');
                        } else{
                            if (raw_info.standard_sel == '720p'){
                                set_selected_option_by_value('browsecat','446');
                            } else if(raw_info.standard_sel == '1080i' || raw_info.standard_sel == '1080p'){
                                set_selected_option_by_value('browsecat','447');
                            } else if (raw_info.standard_sel == '4K'){
                                set_selected_option_by_value('browsecat','449');
                            } else if (raw_info.standard_sel == 'SD'){
                                set_selected_option_by_value('browsecat','444');
                            }
                        }

                    }
                    break;
                case '学习': set_selected_option_by_value('browsecat','409');  break;
                case '体育':
                    if (raw_info.standard_sel == '720p'){
                        set_selected_option_by_value('browsecat','442');
                    } else if(raw_info.standard_sel == '1080i' || raw_info.standard_sel == '1080p'){
                        set_selected_option_by_value('browsecat','443');
                    }
            }

            //来源
            var source_box = document.getElementsByName('source_sel')[0];
            source_box.options[6].selected=true;
            switch(raw_info.medium_sel){
                case 'UHD': source_box.options[1].selected=true; break;
                case 'Blu-ray': source_box.options[2].selected=true; break;
                case 'Encode': source_box.options[2].selected = true; break;
                case 'HDTV': source_box.options[3].selected=true; break;
                case 'WEB-DL': source_box.options[5].selected=true; break;
                case 'DVD': source_box.options[4].selected=true;
            }

            //媒介
            var medium_box = document.getElementsByName('medium_sel')[0];
            switch(raw_info.medium_sel){
                case 'UHD': medium_box.options[1].selected = true; break;
                case 'Blu-ray': medium_box.options[2].selected = true; break;
                case 'DVD': medium_box.options[6].selected = true; break;
                case 'Remux': medium_box.options[3].selected = true; break;
                case 'HDTV': medium_box.options[5].selected = true; break;
                case 'Encode': medium_box.options[4].selected = true; break;
                case 'WEB-DL': medium_box.options[5].selected = true;
            }
            if (raw_info.name.match(/MiniBD/i)){
                medium_box.options[7].selected = true;
            }

            //视频编码
            var codec_box = document.getElementsByName('codec_sel')[0];
            codec_box.options[5].selected = true;
            switch (raw_info.codec_sel){
                case 'H265': case 'X265':
                    if (raw_info.name.match(/HEVC/i)){
                        codec_box.options[6].selected = true;
                    } else {
                        codec_box.options[2].selected = true;
                    }
                    break;
                case 'H264': case 'X264':
                    codec_box.options[1].selected = true; break;
                case 'VC-1':
                    codec_box.options[3].selected = true; break;
                case 'MPEG-2': case 'MPEG-4':
                    codec_box.options[4].selected = true;
            }

            //音频编码
            var audiocodec_box = document.getElementsByName('audiocodec_sel')[0];
            audiocodec_box.options[10].selected = true;

            switch (raw_info.audiocodec_sel){
                case 'DTS-HD': audiocodec_box.options[5].selected = true; break;
                case 'DTS-HDMA:X 7.1': audiocodec_box.options[5].selected = true; break;
                case 'DTS-HDMA': audiocodec_box.options[5].selected = true; break;
                case 'TrueHD': audiocodec_box.options[6].selected = true; break;
                case 'Atmos': audiocodec_box.options[6].selected = true; break;
                case 'LPCM': audiocodec_box.options[7].selected = true; break;
                case 'DTS': audiocodec_box.options[3].selected = true; break;
                case 'AC3': audiocodec_box.options[8].selected = true; break;
                case 'AAC': audiocodec_box.options[4].selected = true; break;
                case 'Flac': audiocodec_box.options[1].selected = true; break;
                case 'APE': audiocodec_box.options[2].selected = true; break;
                case 'WAV': audiocodec_box.options[9].selected = true;
            }

            if (raw_info.name.match(/DTS-?HD.?HRA/i)){
                audiocodec_box.options[10].selected = true;
            }

            //分辨率
            var standard_box = document.getElementsByName('standard_sel')[0];
            var standard_dict = {
                '4K': 1, '1080p': 2, '1080i': 3, '720p': 4, 'SD': 5, '': 0
            };
            if (standard_dict.hasOwnProperty(raw_info.standard_sel)){
                var index = standard_dict[raw_info.standard_sel];
                standard_box.options[index].selected = true;
            }

            function disableother(select,target)
            {
                if (document.getElementById(select).value == 0)
                    document.getElementById(target).disabled = false;
                else {
                    document.getElementById(target).disabled = true;
                    document.getElementById(select).disabled = false;
                }
            }
            disableother('browsecat','specialcat');
        }

        else if (forward_site == 'Oshen') {
            //类型
            var browsecat = document.getElementById('browsecat');
            var type_dict = {'电影': 1, '剧集': 4, '动漫': 3, '综艺': 5, '音乐': 8, '纪录': 2,
                             '体育': 7, '软件': 9, '学习': 0, '': 0, '游戏': 10};
            //如果当前类型在上述字典中
            if (type_dict.hasOwnProperty(raw_info.type)){
                var index = type_dict[raw_info.type];
                browsecat.options[index].selected = true;
            }

            //媒介
            var medium_box = document.getElementsByName('medium_sel')[0];
            switch(raw_info.medium_sel){
                case 'UHD': medium_box.options[1].selected = true; break;
                case 'Blu-ray': medium_box.options[1].selected = true; break;
                case 'DVD':
                    if (raw_info.name.match(/HD ?DVD/i)){
                        medium_box.options[2].selected = true;
                    } else {
                        medium_box.options[7].selected = true;
                    }
                    break;
                case 'Remux': medium_box.options[3].selected = true; break;
                case 'HDTV': medium_box.options[6].selected = true; break;
                case 'Encode': medium_box.options[4].selected = true;
            }
            if (raw_info.name.match(/MiniBD/i)){
                medium_box.options[5].selected = true;
            }

            //视频编码
            var codec_box = document.getElementsByName('codec_sel')[0];
            codec_box.options[5].selected = true;
            switch (raw_info.codec_sel){
                case 'H264': case 'X264': codec_box.options[1].selected = true; break;
                case 'H265': case 'X265': codec_box.options[6].selected = true; break;
                case 'VC-1': codec_box.options[2].selected = true; break;
                case 'MPEG-2': codec_box.options[4].selected = true; break;
                case 'XVID': codec_box.options[3].selected = true;
            }

            //分辨率
            var standard_box = document.getElementsByName('standard_sel')[0];
            var standard_dict = {'4K': 5, '1080p': 1, '1080i': 2, '720p': 3, 'SD': 4};
            if (standard_dict.hasOwnProperty(raw_info.standard_sel)){
                var index = standard_dict[raw_info.standard_sel];
                standard_box.options[index].selected = true;
            }
        }

        else if (forward_site == 'PTNIC') {
            //类型
            var browsecat = document.getElementById('browsecat');
            var type_dict = {'电影': 1, '剧集': 2, '动漫': 5, '综艺': 3, '音乐': 8, '纪录': 4,
                             '体育': 7, '软件': 10, '学习': 12, '': 15, '游戏': 11};
            //如果当前类型在上述字典中
            browsecat.options[15].selected = true;//默认其他
            if (type_dict.hasOwnProperty(raw_info.type)){
                var index = type_dict[raw_info.type];
                browsecat.options[index].selected = true;
            }

            var team_box = document.getElementsByName('source_sel')[0];
            var team_dict = {'欧美': 2, '大陆': 1, '香港': 3, '台湾': 3, '港台': 3,'日本': 4, '韩国': 5,
                             '印度': 6, '': 6 };
            team_box.options[6].selected = true;
            if (team_dict.hasOwnProperty(raw_info.source_sel)){
                var index = team_dict[raw_info.source_sel];
                team_box.options[index].selected = true;
            }

            //媒介
            var medium_box = document.getElementsByName('medium_sel')[0];
            switch(raw_info.medium_sel){
                case 'UHD': medium_box.options[1].selected = true; break;
                case 'Blu-ray': medium_box.options[2].selected = true; break;
                case 'DVD': medium_box.options[7].selected = true; break;
                case 'Remux': medium_box.options[3].selected = true; break;
                case 'HDTV': medium_box.options[6].selected = true; break;
                case 'Encode': medium_box.options[5].selected = true; break;
                case 'WEB-DL': medium_box.options[4].selected = true;
            }
            if (raw_info.name.match(/MiniBD/i)){
                medium_box.options[9].selected = true;
            }

            //视频编码
            var codec_box = document.getElementsByName('codec_sel')[0];
            codec_box.options[6].selected = true;
            switch (raw_info.codec_sel){
                case 'H265': case 'X265': codec_box.options[2].selected = true; break;
                case 'H264': case 'X264': codec_box.options[1].selected = true; break;
                case 'VC-1': codec_box.options[3].selected = true; break;
                case 'XVID': codec_box.options[4].selected = true; break;
                case 'MPEG-2': case 'MPEG-4': codec_box.options[5].selected = true;
            }

            //音频编码
            var audiocodec_box = document.getElementsByName('audiocodec_sel')[0];
            audiocodec_box.options[14].selected = true;
            switch (raw_info.audiocodec_sel){
                case 'DTS-HD': audiocodec_box.options[2].selected = true; break;
                case 'DTS-HDMA:X 7.1': audiocodec_box.options[1].selected = true; break;
                case 'DTS-HDMA': audiocodec_box.options[2].selected = true; break;
                case 'TrueHD': audiocodec_box.options[4].selected = true; break;
                case 'Atmos': audiocodec_box.options[3].selected = true; break;
                case 'LPCM': audiocodec_box.options[6].selected = true; break;
                case 'DTS': audiocodec_box.options[5].selected = true; break;
                case 'AC3': audiocodec_box.options[11].selected = true; break;
                case 'AAC': audiocodec_box.options[10].selected = true; break;
                case 'Flac': audiocodec_box.options[7].selected = true; break;
                case 'APE': audiocodec_box.options[9].selected = true; break;
                case 'WAV': audiocodec_box.options[8].selected = true;
            }

            //分辨率
            var standard_box = document.getElementsByName('standard_sel')[0];
            var standard_dict = {'8K': 1, '4K': 2, '1080p': 3, '1080i': 4, '720p': 5, 'SD': 6};
            if (standard_dict.hasOwnProperty(raw_info.standard_sel)){
                var index = standard_dict[raw_info.standard_sel];
                standard_box.options[index].selected = true;
            }

            //处理
            var processing_box = document.getElementsByName('processing_sel')[0];
            if (raw_info.medium_sel == 'Remux') {
                processing_box.options[0].selected = true;
            } else if (raw_info.medium_sel == 'UHD' || raw_info.medium_sel == 'Blu-ray') {
                processing_box.options[1].selected = true;
            } else if (raw_info.medium_sel == 'Encode') {
                processing_box.options[2].selected = true;
            } else {
                processing_box.options[0].selected = true;
            }
            //简介分成了三个框——所以先暂时都放在最后一个框，然后把它们都调高一点，手动剪切粘贴
            descr_box[0].style.height = '120px';
            descr_box[1].style.height = '200px';
            descr_box[2].style.height = '600px';

            var info = get_mediainfo_picture_from_descr(raw_info.descr);
            var cmctinfos = info.mediainfo;//图片
            var cmctimgs = info.pic_info;//mediainfo

            //获取简介
            cmctdescr = raw_info.descr.slice(0,raw_info.descr.search(/\[quote\]/));
            cmctdescr = cmctdescr.replace(/\[img\]htt.*[\s\S]*?img\]/i, '');

            if (raw_info.imgs_cmct){
                descr_box[0].value = raw_info.imgs_cmct.trim();
            } else {
                descr_box[0].value = cmctimgs.replace(/\n\n+/g, '\n').trim();
            }
            if (raw_info.mediainfo_cmct){
                descr_box[1].value = raw_info.mediainfo_cmct.trim();
            } else {
                descr_box[1].value = cmctinfos.trim();
            }

            descr_box[2].value = raw_info.descr;

            var clear = document.createElement('input');
            clear.type = 'button';
            clear.value = " 清空附加信息 ";
            clear.id = 'clear';
            document.getElementById('qr').parentNode.insertBefore(clear, document.getElementById('qr'));
            $('#clear').css({'color': 'white', 'background' :'url(https://springsunday.net/styles/Maya/images/btn_submit_bg.gif) repeat left top', 'border': '1px black'});

            $('#clear').click(function(){
                descr_box[2].value = '';
                descr_box[2].style.height = '200px';
            });
        }

        else if (forward_site == 'HDAtmos') {
            //类型
            var browsecat = document.getElementById('browsecat');
            var type_dict = {'电影': 1, '剧集': 4, '动漫': 3, '综艺': 10, '音乐': 9, '纪录': 2,
                             '体育': 7, '软件': 8, '学习': 11, '': 11, '游戏': 5};
            browsecat.options[11].selected = true;//默认其他
            if (type_dict.hasOwnProperty(raw_info.type)){
                var index = type_dict[raw_info.type];
                browsecat.options[index].selected = true;
            }

            //来源
            var source_box = document.getElementsByName('source_sel')[0];
            var medium_box = document.getElementsByName('medium_sel')[0];
            source_box.options[12].selected = true;
            medium_box.options[12].selected = true;
            switch(raw_info.medium_sel){
                case 'UHD': source_box.options[1].selected = true; medium_box.options[1].selected = true; break;
                case 'Blu-ray': source_box.options[1].selected = true; medium_box.options[1].selected = true; break;
                case 'DVD':
                    if (raw_info.name.match(/HD ?DVD/i)){
                        source_box.options[7].selected = true; medium_box.options[7].selected = true;
                    } else {
                        source_box.options[8].selected = true; medium_box.options[8].selected = true;
                    }
                    break;
                case 'Remux': source_box.options[2].selected = true; medium_box.options[2].selected = true; break;
                case 'HDTV': source_box.options[4].selected = true; medium_box.options[4].selected = true; break;
                case 'Encode': source_box.options[6].selected = true; medium_box.options[6].selected = true; break;
                case 'WEB-DL': source_box.options[5].selected = true; medium_box.options[5].selected = true;
            }
            if (raw_info.name.match(/MiniBD/i)){
                source_box.options[3].selected = true; medium_box.options[3].selected = true;
            }

            //视频编码
            var codec_box = document.getElementsByName('codec_sel')[0];
            codec_box.options[7].selected = true;
            switch (raw_info.codec_sel){
                case 'H265': case 'X265': codec_box.options[3].selected = true; break;
                case 'H264': case 'X264': codec_box.options[1].selected = true; break;
                case 'VC-1': codec_box.options[3].selected = true; break;
                case 'MPEG-2': case 'MPEG-4': codec_box.options[4].selected = true; break;
                case 'XVID': codec_box.options[6].selected = true; break;
            }

            //音频编码
            var audiocodec_box = document.getElementsByName('audiocodec_sel')[0];
            audiocodec_box.options[14].selected = true;
            switch (raw_info.audiocodec_sel){
                case 'DTS-HD': audiocodec_box.options[1].selected = true; break;
                case 'DTS-HDMA:X 7.1': audiocodec_box.options[3].selected = true; break;
                case 'DTS-HDMA': audiocodec_box.options[1].selected = true; break;
                case 'TrueHD': audiocodec_box.options[4].selected = true; break;
                case 'Atmos': audiocodec_box.options[2].selected = true; break;
                case 'LPCM': audiocodec_box.options[6].selected = true; break;
                case 'DTS': audiocodec_box.options[5].selected = true; break;
                case 'AC3': audiocodec_box.options[12].selected = true; break;
                case 'AAC': audiocodec_box.options[11].selected = true; break;
                case 'Flac': audiocodec_box.options[8].selected = true; break;
                case 'APE': audiocodec_box.options[9].selected = true; break;
                case 'WAV': audiocodec_box.options[10].selected = true;
            }
            if (raw_info.name.match(/DD.?5.1/i)) {
                audiocodec_box.options[13].selected = true;
            }

            //分辨率
            var standard_box = document.getElementsByName('standard_sel')[0];
            var standard_dict = {
                '4K': 1, '1080p': 2, '1080i': 3, '720p': 4, 'SD': 5, '8K': 6, '': 7
            };
            if (standard_dict.hasOwnProperty(raw_info.standard_sel)){
                var index = standard_dict[raw_info.standard_sel];
                standard_box.options[index].selected = true;
            }

            var team_box = document.getElementsByName('processing_sel')[0];
            var team_dict = {'欧美': 6, '大陆': 1, '香港': 1, '台湾': 1, '港台': 1,'日本': 3, '韩国': 4,
                             '印度': 7, '': 7 };
            team_box.options[7].selected = true;
            if (team_dict.hasOwnProperty(raw_info.source_sel)){
                var index = team_dict[raw_info.source_sel];
                team_box.options[index].selected = true;
            }
            var reg_region = raw_info.descr.match(/(地.{0,5}?区|国.{0,5}?家|产.{0,5}?地)([^\r\n]+)/);
            if (reg_region && reg_region[2].match(/美国/)) {
                browsecat.options[2].selected = true;
            }
        }

        else if (forward_site == 'HDT') {
            var category_box = $('select[name="category"]');
            switch(raw_info.type) {
                case '电影':
                    switch(raw_info.medium_sel){
                        case 'UHD': category_box.val('70'); break;
                        case 'Blu-ray': category_box.val('1'); break;
                        case 'Remux':
                            if (raw_info.name.match(/uhd/i)){
                                category_box.val('71');
                            } else {
                                category_box.val('2');
                            }
                            break;
                        case 'HDTV':  case 'Encode': case 'WEB-DL': case 'DVD':
                            if (raw_info.standard_sel == '4K') {
                                category_box.val('64');
                            } else if (raw_info.standard_sel == '1080p' || raw_info.standard_sel == '1080i') {
                                category_box.val('5');
                            } else if (raw_info.standard_sel == '720p') {
                                category_box.val('3');
                            }
                            break;
                    }
                    break;
                case '剧集': case '纪录': case '综艺':

                    if (raw_info.name.match(/s\d+[^E]|complete/i)) {
                        $('select[name="season"]').val('true');
                    }

                    switch(raw_info.medium_sel){
                        case 'UHD': category_box.val('72'); break;
                        case 'Blu-ray': category_box.val('59'); break;
                        case 'Remux':
                            if (raw_info.name.match(/uhd/i)){
                                category_box.val('73');
                            } else {
                                category_box.val('60');
                            }
                            break;
                        case 'HDTV':  case 'Encode': case 'WEB-DL': case 'DVD':
                            if (raw_info.standard_sel == '4K') {
                                category_box.val('65');
                            } else if (raw_info.standard_sel == '1080p' || raw_info.standard_sel == '1080i') {
                                category_box.val('30');
                            } else if (raw_info.standard_sel == '720p') {
                                category_box.val('38');
                            }
                            break;
                    }
                    break;
            }

            if (raw_info.name.toLowerCase().indexOf(' 3d ') !== -1) {
                document.getElementsByName('3d')[0].options[1].selected = true;
            }

            var mediainfo = get_mediainfo_picture_from_descr(raw_info.descr).mediainfo;
            if (mediainfo.match(/HDR10/i)) {
                document.getElementsByName('HDR10')[0].checked = true;
            }
            if (mediainfo.match(/Dolby Vision/i)) {
                document.getElementsByName('DolbyVision')[0].checked = true;
            }
        }

        else if (forward_site == 'BLU') {
            if (raw_info.type == '剧集' || raw_info.type == '综艺' || raw_info.type == '纪录' ) {
                $('#autocat').val("2");
                try { $('#season_number').val(parseInt(raw_info.name.match(/S(\d+)/i)[1])) } catch (err) {$('#season_number').val("1")}
                try { $('#episode_number').val(parseInt(raw_info.name.match(/E(\d+)/i)[1])) } catch (err) {}
            }
            var source_box = document.getElementsByName('type_id')[0];
            switch(raw_info.medium_sel){
                case 'UHD': source_box.options[1].selected = true; break;
                case 'Blu-ray': source_box.options[1].selected = true; break;
                case 'Remux': source_box.options[2].selected = true; break;
                case 'HDTV': source_box.options[6].selected = true; break;
                case 'Encode': source_box.options[3].selected = true; break;
                case 'WEB-DL': source_box.options[4].selected = true;
            }
            if (raw_info.name.match(/webrip/i)) {
                source_box.options[5].selected = true;
            }

            //分辨率
            var standard_box = document.getElementsByName('resolution_id')[0];
            var standard_dict = {'4K': 2, '1080p': 3, '1080i': 4, '720p': 5, 'SD': 6, '': 10, '8K': 1};
            if (standard_dict.hasOwnProperty(raw_info.standard_sel)){
                var index = standard_dict[raw_info.standard_sel];
                standard_box.options[index].selected = true;
            }

            if (raw_info.standard_sel == 'SD') {
                $('input[name="sd"]:eq(0)').prop("checked", true);
            }

            if (raw_info.name.match(/576p/i)) {
                standard_box.options[6].selected = true;
            } else if (raw_info.name.match(/576i/i)) {
                standard_box.options[7].selected = true;
            } else if (raw_info.name.match(/480p/i)) {
                standard_box.options[8].selected = true;
            } else if (raw_info.name.match(/480i/i)) {
                standard_box.options[9].selected = true;
            }

            $('#apimatch').attr('disabled', false);
            if (search_name && tmdb_key) {

                var $div = $(`<div style="margin-top: 10px;"></div>`);
                var $table = $(`<table class="table table-condensed table-bordered table-striped table-hover"></table>`);
                $div.append($table);
                $('#apimatch').val(raw_info.name);
                var search_url;
                if (raw_info.type == '剧集') {
                    search_url = 'http://api.tmdb.org/3/search/tv?api_key={key}&language=zh-CN&query={name}&page=1&include_adult=true';
                } else if (raw_info.type == '电影') {
                    search_url = 'http://api.tmdb.org/3/search/movie?api_key={key}&language=zh-CN&query={name}&page=1&include_adult=true';
                } else {
                    search_url = 'http://api.tmdb.org/3/search/multi?api_key={key}&language=zh-CN&query={name}&page=1&include_adult=true';
                }
                search_url = search_url.format({'key': tmdb_key, 'name': search_name});
                console.log(search_url)

                function compare(date){
                    return function(obj1, obj2) {
                        try{ var value1 = obj1[date].split('-')[0]+obj1[date].split('-')[1]+obj1[date].split('-')[2];} catch(err) {value1='00000000'}
                        try{ var value2 = obj2[date].split('-')[0]+obj2[date].split('-')[1]+obj2[date].split('-')[2];} catch(err) {value2='00000000'}
                        return value2 - value1;
                    }
                }
                getJson(search_url, null, function(data){
                    if (data.results.length > 2) {
                        if (raw_info.type == '剧集') {
                            data.results = data.results.sort(compare('first_air_date'));
                        } else {
                            data.results = data.results.sort(compare('release_date'));
                        }
                    }
                    if (data.results.length > 0) {
                        for(i=0;i<data.results.length;i++){
                            var $tr=$("<tr></tr>");
                            if (raw_info.type == '剧集'){
                                $td0 = $(`<td><img src="https://image.tmdb.org/t/p/w300_and_h450_bestv2${data.results[i].poster_path}"; style="width:80px; height: 120px;"></td>`);
                                $td1 = $(`<td>${data.results[i].first_air_date}</td>`);
                                $td2 = $(`<td>${data.results[i].original_name}</td>`);
                                $td3 = $(`<td><a href="https://www.themoviedb.org/TV/${data.results[i].id}" target="_blank">${data.results[i].name}</a></td>`);
                                $td5 = $(`<td><input type="button" class="fill_number" name=${data.results[i].id} value="USE"></td>`);
                                $tr.append($td0); $tr.append($td1); $tr.append($td2); $tr.append($td3); $tr.append($td5);
                            } else {
                                $td0 = $(`<td><img src="https://image.tmdb.org/t/p/w300_and_h450_bestv2${data.results[i].poster_path}"; style="width: 80px; height: 120px;"></td>`);
                                $td1 = $(`<td>${data.results[i].release_date}</td>`);
                                $td2 = $(`<td>${data.results[i].original_title}</td>`);
                                $td3 = $(`<td><a href="https://www.themoviedb.org/movie/${data.results[i].id}" target="_blank">${data.results[i].title}</a></td>`);
                                $td5 = $(`<td><input type="button" class="fill_number" name=${data.results[i].id} value="USE"></td>`);
                                $tr.append($td0); $tr.append($td1); $tr.append($td2); $tr.append($td3); $tr.append($td5);
                            }
                            $table.append($tr);
                        }
                        $('.fill_number').css({'backgroundColor': 'rgb(70, 77, 96)'});
                        $('.fill_number').click(function(){
                            $('#autotmdb').val($(this).attr('name'));
                            $table.slideUp(500);
                            window.scrollTo(0, 500);
                        });

                        $('#autotmdb').change(function(){
                            if (!$(this).val()){
                                $table.slideDown(1000);
                            }
                        });
                        $table.find('td').css({'backgroundColor': 'rgb(62, 59, 100)'});
                    }
                });
                $('#apimatch').parent().append($div);
            }

            try{ $('#autoimdb').val(raw_info.url.match(/tt(\d+)/i)[1]); } catch(err) {}
            try{
                var infos = get_mediainfo_picture_from_descr(raw_info.descr);
                if (raw_info.medium_sel == 'UHD' || raw_info.medium_sel == 'Blu-ray' || raw_info.medium_sel == 'DVD') {
                    $('#upload-form-description').val('[code]' + infos.mediainfo + '[/code]\n' + infos.pic_info);
                    $('#upload-form-description').css({'height': '800px'});
                } else {
                    if (raw_info.full_mediainfo){
                        $('textarea[name="mediainfo"]').val(raw_info.full_mediainfo);
                    } else {
                        $('textarea[name="mediainfo"]').val(infos.mediainfo);
                    }
                    $('textarea[name="mediainfo"]').css({'height': '800px'});
                    $('#upload-form-description').val(infos.pic_info);
                }
            } catch(Err) {
                if (raw_info.full_mediainfo){
                    $('textarea[name="mediainfo"]').val(raw_info.full_mediainfo);
                } else {
                    $('textarea[name="mediainfo"]').val(raw_info.descr);
                }
                $('textarea[name="mediainfo"]').css({'height': '800px'});
            }

            if (if_uplver) {
                $('input[name="anonymous"]:eq(0)').prop("checked", true);
            }
        }

        else if (forward_site == 'HDPost') {
            if (raw_info.type == '剧集' || raw_info.type == '综艺' || raw_info.type == '纪录' ) {
                $('#autocat').val("2");
                try { $('#season_number').val(parseInt(raw_info.name.match(/S(\d+)/i)[1])) } catch (err) {$('#season_number').val("1")}
                try { $('#episode_number').val(parseInt(raw_info.name.match(/E(\d+)/i)[1])) } catch (err) {}
            }
            var source_box = document.getElementsByName('type_id')[0];
            switch(raw_info.medium_sel){
                case 'UHD': source_box.options[1].selected = true; break;
                case 'Blu-ray': source_box.options[1].selected = true; break;
                case 'Remux': source_box.options[2].selected = true; break;
                case 'HDTV': source_box.options[6].selected = true; break;
                case 'Encode': source_box.options[3].selected = true; break;
                case 'WEB-DL': source_box.options[4].selected = true;
            }
            if (raw_info.name.match(/webrip/i)) {
                source_box.options[5].selected = true;
            }

            //分辨率
            var standard_box = document.getElementsByName('resolution_id')[0];
            var standard_dict = {'4K': 2, '1080p': 3, '1080i': 4, '720p': 5, 'SD': 6, '': 10, '8K': 1};
            if (standard_dict.hasOwnProperty(raw_info.standard_sel)){
                var index = standard_dict[raw_info.standard_sel];
                standard_box.options[index].selected = true;
            }

            if (raw_info.standard_sel == 'SD') {
                $('input[name="sd"]:eq(0)').prop("checked", true);
            }

            if (raw_info.name.match(/576p/i)) {
                standard_box.options[6].selected = true;
            } else if (raw_info.name.match(/576i/i)) {
                standard_box.options[7].selected = true;
            } else if (raw_info.name.match(/480p/i)) {
                standard_box.options[8].selected = true;
            } else if (raw_info.name.match(/480i/i)) {
                standard_box.options[9].selected = true;
            }

            $('#apimatch').attr('disabled', false);
            if (search_name && tmdb_key) {

                var $div = $(`<div style="margin-top: 10px;"></div>`);
                var $table = $(`<table class="table table-condensed table-bordered table-striped table-hover"></table>`);
                $div.append($table);
                $('#apimatch').val(raw_info.name);
                var search_url;
                if (raw_info.type == '剧集') {
                    search_url = 'http://api.tmdb.org/3/search/tv?api_key={key}&language=zh-CN&query={name}&page=1&include_adult=true';
                } else if (raw_info.type == '电影') {
                    search_url = 'http://api.tmdb.org/3/search/movie?api_key={key}&language=zh-CN&query={name}&page=1&include_adult=true';
                } else {
                    search_url = 'http://api.tmdb.org/3/search/multi?api_key={key}&language=zh-CN&query={name}&page=1&include_adult=true';
                }
                search_url = search_url.format({'key': tmdb_key, 'name': search_name});
                console.log(search_url)

                function compare(date){
                    return function(obj1, obj2) {
                        try{ var value1 = obj1[date].split('-')[0]+obj1[date].split('-')[1]+obj1[date].split('-')[2];} catch(err) {value1='00000000'}
                        try{ var value2 = obj2[date].split('-')[0]+obj2[date].split('-')[1]+obj2[date].split('-')[2];} catch(err) {value2='00000000'}
                        return value2 - value1;
                    }
                }
                getJson(search_url, null, function(data){
                    if (data.results.length > 2) {
                        if (raw_info.type == '剧集') {
                            data.results = data.results.sort(compare('first_air_date'));
                        } else {
                            data.results = data.results.sort(compare('release_date'));
                        }
                    }
                    if (data.results.length > 0) {
                        for(i=0;i<data.results.length;i++){
                            var $tr=$("<tr></tr>");
                            if (raw_info.type == '剧集'){
                                $td0 = $(`<td><img src="https://image.tmdb.org/t/p/w300_and_h450_bestv2${data.results[i].poster_path}"; style="width:80px; height: 120px;"></td>`);
                                $td1 = $(`<td>${data.results[i].first_air_date}</td>`);
                                $td2 = $(`<td>${data.results[i].original_name}</td>`);
                                $td3 = $(`<td><a href="https://www.themoviedb.org/TV/${data.results[i].id}" target="_blank">${data.results[i].name}</a></td>`);
                                $td5 = $(`<td><input type="button" class="fill_number" name=${data.results[i].id} title="${data.results[i].name}" value="USE"></td>`);
                                $tr.append($td0); $tr.append($td1); $tr.append($td2); $tr.append($td3); $tr.append($td5);
                            } else {
                                $td0 = $(`<td><img src="https://image.tmdb.org/t/p/w300_and_h450_bestv2${data.results[i].poster_path}"; style="width: 80px; height: 120px;"></td>`);
                                $td1 = $(`<td>${data.results[i].release_date}</td>`);
                                $td2 = $(`<td>${data.results[i].original_title}</td>`);
                                $td3 = $(`<td><a href="https://www.themoviedb.org/movie/${data.results[i].id}" target="_blank">${data.results[i].title}</a></td>`);
                                $td5 = $(`<td><input type="button" class="fill_number" name=${data.results[i].id} title="${data.results[i].title}" value="USE"></td>`);
                                $tr.append($td0); $tr.append($td1); $tr.append($td2); $tr.append($td3); $tr.append($td5);
                            }
                            $table.append($tr);
                        }

                        $('.fill_number').css({'backgroundColor': 'rgb(70, 77, 96)'});

                        $('.fill_number').click(function(){
                            $('#autotmdb').val($(this).attr('name'));
                            $('#title').val($(this).attr('title')+ ' ' + $('#title').val());
                            $table.slideUp(500);
                            window.scrollTo(0, 500);
                        });

                        $('#autotmdb').change(function(){
                            if (!$(this).val()){
                                $table.slideDown(1000);
                            }
                        });

                        $table.find('td').css({'backgroundColor': 'rgb(62, 59, 100)'});
                    }
                });
                $('#apimatch').parent().append($div);
            }

            try{ $('#autoimdb').val(raw_info.url.match(/tt(\d+)/i)[1]); } catch(err) {}
            try{
                var infos = get_mediainfo_picture_from_descr(raw_info.descr);
                
                if (raw_info.full_mediainfo){
                    $('textarea[name="mediainfo"]').val(raw_info.full_mediainfo);
                } else {
                    $('textarea[name="mediainfo"]').val(infos.mediainfo);
                }
                $('textarea[name="mediainfo"]').css({'height': '800px'});
                $('#upload-form-description').val(infos.pic_info);

            } catch(err) {
                if (raw_info.full_mediainfo){
                    $('textarea[name="mediainfo"]').val(raw_info.full_mediainfo);
                } else {
                    $('textarea[name="mediainfo"]').val(raw_info.descr);
                }
                $('#upload-form-description').css({'height': '800px'});
            }
            if (if_uplver) {
                $('input[name="anonymous"]:eq(0)').prop("checked", true);
            }
        }

        else if (forward_site == 'UHD') {

            if (raw_info.type == '剧集' || raw_info.type == '纪录' || raw_info.type == '综艺') {
                $('#categories').val("2");
                var evt = document.createEvent("HTMLEvents");
                evt.initEvent("change", false, true);
                document.getElementById('categories').dispatchEvent(evt);
            }

            try{$('#imdbid').val(raw_info.url.match(/tt\d+/)[0]); $('#imdb_button').click();}catch(err){}

            setTimeout(function(){
                try{$('#imdbid').val(raw_info.url.match(/tt\d+/)[0]); }catch(err){}
                if (raw_info.type == '剧集' || raw_info.type == '纪录') {
                    try{$('#season').val(parseInt(raw_info.name.match(/S(\d+)/i)[1]));} catch(err){}
                }
                var standard_box = document.getElementsByName('format')[0];
                var standard_dict = {'4K': 5, '1080p': 3, '1080i': 4, '720p': 2, 'SD': 6, '': 6, '8K': 5};
                if (standard_dict.hasOwnProperty(raw_info.standard_sel)){
                    var index = standard_dict[raw_info.standard_sel];
                    standard_box.options[index].selected = true;
                }
                try{$('#team').val(raw_info.name.split('-').pop());}catch(err){}
                var source_box = document.getElementsByName('media')[0];
                switch(raw_info.medium_sel){
                    case 'UHD': source_box.options[1].selected = true; break;
                    case 'Blu-ray': source_box.options[1].selected = true; break;
                    case 'Remux': source_box.options[2].selected = true; break;
                    case 'HDTV': source_box.options[7].selected = true; break;
                    case 'Encode': source_box.options[3].selected = true; break;
                    case 'WEB-DL': source_box.options[4].selected = true; break;
                    default:
                        source_box.options[8].selected = true;
                }
                if (raw_info.name.match(/webrip/i)) {
                    source_box.options[5].selected = true;
                } else if (raw_info.name.match(/hdrip/i)) {
                    source_box.options[6].selected = true;
                }

                var infos = get_mediainfo_picture_from_descr(raw_info.descr);
                $('textarea[name="mediainfo"]').val(infos.mediainfo);
                $('textarea[name="mediainfo"]').css({'height': '400px'});
                $('textarea[name="release_desc"]').val(infos.pic_info);
                $('textarea[name="release_desc"]').css({'height': '300px'});

                $('#genre_tags').parent().append(`<input type="button" id="remove_id" value="移除ID"></input>`);
                $('#remove_id').click(function(){
                    $('#tags').removeAttr('id');
                    $('#remove_id').attr('disabled', true);
                });
            }, 5000);   
        }

        else if (forward_site == 'HDSpace') {
            $('#filename').val(raw_info.name);
            try{$('input[name="imdb"]').val(raw_info.url.match(/tt(\d+)/i)[1]);}catch(err){}
            var infos = get_mediainfo_picture_from_descr(raw_info.descr);
            $('textarea[name="info"]').val('[quote]' + infos.mediainfo + '[/quote]\n\n' + infos.pic_info);

            try{
                var imdbid = raw_info.url.match(/tt\d+/i)[0];
                var imdburl = 'http://www.omdbapi.com/?apikey=2edf5c13&i='+ imdbid +'&plot=full';
                getJson(imdburl, null, function(data){
                    if (data.Title) {
                        $('input[name="genre"]').val(data.Genre);
                    }
                });
            } catch(err) {}

            if (raw_info.medium_sel == 'UHD' || raw_info.medium_sel == 'Blu-ray' ) {
                $('select[name="category"]').val("15");
            } else if (raw_info.medium_sel == 'Remux') {
                $('select[name="category"]').val("40");
            } else if (raw_info.medium_sel == 'DVD') {
                $('select[name="category"]').val("16");
            } else if (raw_info.medium_sel == 'HDTV' || raw_info.medium_sel == 'WEB-DL' || raw_info.name.match(/webrip|web-dl|webdl/i)) {
                if (raw_info.standard_sel == '1080p') {
                    $('select[name="category"]').val("22");
                } else if (raw_info.standard_sel == '720p') {
                    $('select[name="category"]').val("21");
                }
            } else if (raw_info.medium_sel == 'Encode') {
                if (raw_info.type == '电影'){
                    if (raw_info.standard_sel == '1080p') {
                        $('select[name="category"]').val("19");
                    } else if (raw_info.standard_sel == '720p') {
                        $('select[name="category"]').val("18");
                    } else if (raw_info.standard_sel == '4K') {
                        $('select[name="category"]').val("41");
                    }
                } else if (raw_info.type == '纪录'){
                    if (raw_info.standard_sel == '1080p') {
                        $('select[name="category"]').val("25");
                    } else if (raw_info.standard_sel == '720p') {
                        $('select[name="category"]').val("24");
                    } 
                } else if (raw_info.type == '动画'){
                    if (raw_info.standard_sel == '1080p') {
                        $('select[name="category"]').val("28");
                    } else if (raw_info.standard_sel == '720p') {
                        $('select[name="category"]').val("27");
                    } 
                }
            } 
        }

        else if (forward_site == 'HDB') {
            $('#name').val(raw_info.name);
            switch (raw_info.type){
                case '电影': $('#type_category').val("1"); break;
                case '剧集': $('#type_category').val("2"); break;
                case '音乐': $('#type_category').val("4"); break;
                case '综艺': $('#type_category').val("2"); break;
                case '纪录': $('#type_category').val("3"); break;
                case '动漫': $('#type_category').val("8"); break;
                case '体育': $('#type_category').val("5"); 
            }

            switch (raw_info.codec_sel){
                case 'H264': case 'X264': $('#type_codec').val("1"); break;
                case 'H265': case 'X265': $('#type_codec').val("5"); break;
                case 'VC-1': $('#type_codec').val("3"); break;
                case 'MPEG-2': $('#type_codec').val("2"); break;
                case 'XVID': $('#type_codec').val("4"); break;
                default: $('#type_codec').val("0");
            }

            switch(raw_info.medium_sel){
                case 'UHD': case 'Blu-ray': case 'DVD':  $('#type_medium').val("1"); break;
                case 'Remux': $('#type_medium').val("5"); break;
                case 'HDTV': $('#type_medium').val("4"); break;
                case 'WEB-DL': $('#type_medium').val("6"); break;
                case 'Encode': $('#type_medium').val("3"); break;
                default: $('#type_medium').val("0");
            }

            var infos = get_mediainfo_picture_from_descr(raw_info.descr);
            if (raw_info.medium_sel == 'UHD' || raw_info.medium_sel == 'Blu-ray' || raw_info.medium_sel == 'DVD') {
                $('textarea[name="descr"]').val(infos.mediainfo + '\n\n' + infos.pic_info);
                $('textarea[name="descr"]').css({'height': '300px'});
            } else {
                $('textarea[name="techinfo"]').val(infos.mediainfo);
                $('textarea[name="techinfo"]').css({'height': '800px'});
                $('textarea[name="descr"]').val(infos.pic_info);
            }

            $('input[name="imdb"]').val(raw_info.url);
        }

        else if (forward_site == '1PTBA'){
            var browsecat = document.getElementById('browsecat');
            var type_dict = {'电影': 1, '纪录': 2, '动漫': 3, '剧集': 4, '综艺': 5, '音乐': 6, '体育': 7, '': 8, '学习': 10, '游戏': 11, '软件': 12};
            browsecat.options[8].selected = true;
            if (type_dict.hasOwnProperty(raw_info.type)){
                var index = type_dict[raw_info.type];
                browsecat.options[index].selected = true;
            }
            if (raw_info.type == '音乐' && raw_info.name.match(/mv/i)){
                browsecat.options[6].selected = true;
            }
            if (raw_info.name.match(/-HDSPad/i)){
                 browsecat.options[1].selected = true;
            }
            var evt = document.createEvent("HTMLEvents");
            evt.initEvent("change", false, true);
            document.getElementById('browsecat').dispatchEvent(evt);

            //媒介
            var medium_box = document.getElementsByName('medium_sel')[0];
            medium_box.options[12].selected = true;
            switch(raw_info.medium_sel){
                case 'UHD':
                    if (raw_info.name.match(/DIY|@/i)){
                        medium_box.options[2].selected = true;
                    } else{
                        medium_box.options[1].selected = true;
                    }
                    break;
                case 'Blu-ray':
                    if (raw_info.name.match(/DIY|@/i)){
                        medium_box.options[4].selected = true;
                    } else{
                        medium_box.options[3].selected = true;
                    }
                    break;

                case 'Remux': medium_box.options[5].selected = true; break;
                case 'HDTV': medium_box.options[6].selected = true; break;
                case 'Encode': medium_box.options[7].selected = true; break;
                case 'WEB-DL': medium_box.options[8].selected = true; break;
                case 'DVD': medium_box.options[9].selected = true; break;
                case 'CD': medium_box.options[10].selected = true; break;
                case 'Track': medium_box.options[1].selected = true;
            }

            //视频编码
            var codec_box = document.getElementsByName('codec_sel')[0];
            codec_box.options[6].selected = true;
            switch (raw_info.codec_sel){
                case 'H265': case 'X265': case 'HEVC': case 'H.265':
                    codec_box.options[1].selected = true; break;
                case 'H264': case 'X264': case 'AVC': case 'H.264':
                    codec_box.options[2].selected = true; break;
                case 'VC-1':
                    codec_box.options[3].selected = true; break;
                case 'Xvid':
                    codec_box.options[4].selected = true; break;
                case 'MPEG-2': case 'MPEG-4':
                    codec_box.options[5].selected = true;

            }

            //音频编码
            var audiocodec_box = document.getElementsByName('audiocodec_sel')[0];
            audiocodec_box.options[12].selected = true;
            switch (raw_info.audiocodec_sel){
                case 'DTS-HD': case 'DTS-HDMA:X 7.1': case 'DTS-HDMA':
                    audiocodec_box.options[1].selected = true; break;
                case 'TrueHD': case 'Atmos':
                    audiocodec_box.options[2].selected = true; break;
                case 'LPCM':
                    audiocodec_box.options[3].selected = true; break;
                case 'DTS':
                    audiocodec_box.options[4].selected = true; break;
                case 'AC3':
                    audiocodec_box.options[5].selected = true; break;
                case 'AAC': case 'DD':
                    audiocodec_box.options[6].selected = true; break;
                case 'Flac':
                    audiocodec_box.options[7].selected = true; break;
                case 'APE':
                    audiocodec_box.options[8].selected = true; break;
                case 'WAV':
                    audiocodec_box.options[9].selected = true; break;
                case 'MP3':
                    audiocodec_box.options[10].selected = true; break;
                case 'M4A':
                    audiocodec_box.options[11].selected = true;
            }
            if (raw_info.name.match(/Atmos/i)){
                audiocodec_box.options[10].selected = true;
            }

            //分辨率
            var standard_box = document.getElementsByName('standard_sel')[0];
            var standard_dict = {
                '8K': 1, '4K': 2, '2016p': 3, '1080p': 4, '1080i': 5, '720p': 6, 'SD': 7, '': 0
            };
            if (standard_dict.hasOwnProperty(raw_info.standard_sel)){
                var index = standard_dict[raw_info.standard_sel];
                standard_box.options[index].selected = true;
            }

            function disableother(select,target)
            {
                if (document.getElementById(select).value == 0)
                    document.getElementById(target).disabled = false;
                else {
                    document.getElementById(target).disabled = true;
                    document.getElementById(select).disabled = false;
                }
            }
            disableother('browsecat','specialcat');
        }

        else if (forward_site == 'HITPT'){
            var browsecat = document.getElementById('browsecat');
            var type_dict = {'电影': 1, '纪录': 6, '动漫': 4, '剧集': 2, '综艺': 7, '音乐': 8, '体育': 5, '': 0};
            browsecat.options[0].selected = true;
            if (type_dict.hasOwnProperty(raw_info.type)){
                var index = type_dict[raw_info.type];
                browsecat.options[index].selected = true;
            }
            if (raw_info.type == '音乐' && raw_info.name.match(/mv/i)){
                browsecat.options[8].selected = true;
            }
            if (raw_info.name.match(/-HDSPad/i)){
                 browsecat.options[1].selected = true;
            }
            var evt = document.createEvent("HTMLEvents");
            evt.initEvent("change", false, true);
            document.getElementById('browsecat').dispatchEvent(evt);

            var medium_box = document.getElementsByName('source_sel')[0];
            medium_box.options[7].selected = true;
            switch(raw_info.medium_sel){
                case 'UHD': medium_box.options[1].selected = true; break;
                case 'Blu-ray': medium_box.options[1].selected = true; break;
                case 'Remux': medium_box.options[1].selected = true; break;
                case 'HDTV': medium_box.options[4].selected = true; break;
                case 'Encode': medium_box.options[2].selected = true; break;
                case 'WEB-DL': medium_box.options[8].selected = true; break;
                case 'DVD': medium_box.options[3].selected = true; break;
                case 'CD': medium_box.options[6].selected = true; break;
                case 'TV': medium_box.options[5].selected = true;
            }

            var codec_box = document.getElementsByName('codec_sel')[0];
            codec_box.options[5].selected = true;
            switch (raw_info.codec_sel){
                case 'H265': case 'X265': case 'HEVC': case 'H.265':
                    codec_box.options[6].selected = true; break;
                case 'H264': case 'X264': case 'AVC': case 'H.264':
                    codec_box.options[1].selected = true; break;
                case 'VC-1':
                    codec_box.options[2].selected = true; break;
                case 'Xvid':
                    codec_box.options[3].selected = true; break;
                case 'MPEG-2': case 'MPEG-4':
                    codec_box.options[4].selected = true;

            }

            var standard_box = document.getElementsByName('standard_sel')[0];
            var standard_dict = {
                'SD': 1, '720p': 2, '1080i': 3, '1080p': 4, '2K': 5, '4K': 6, '': 0
            };
            if (standard_dict.hasOwnProperty(raw_info.standard_sel)){
                var index = standard_dict[raw_info.standard_sel];
                standard_box.options[index].selected = true;
            }

            if (raw_info.descr.match(/豆瓣评分.*?(\d+\.\d)\/10/)){
                var upload_imdb = document.getElementById('doubanScore');
                upload_imdb.value = raw_info.descr.match(/豆瓣评分.*?(\d+\.\d)\/10/)[1].trim();
            }
            if (raw_info.dburl){
                var upload_imdb_url = document.getElementById('doubanLink');
                upload_imdb_url.value = raw_info.dburl;
            }
            function disableother(select,target)
            {
                if (document.getElementById(select).value == 0)
                    document.getElementById(target).disabled = false;
                else {
                    document.getElementById(target).disabled = true;
                    document.getElementById(select).disabled = false;
                }
            }
            disableother('browsecat','specialcat');
        }

        else if (forward_site == 'PTT') {
            var browsecat = document.getElementById('browsecat');
            var type_dict = {'电影': 1, '剧集': 2, '动漫': 13, '综艺': 3, '音乐': 6, '纪录': 4,
                             '体育': 20, '软件': 20, '学习': 20, '': 20, '游戏': 5};
            browsecat.options[20].selected = true;//默认其他
            if (type_dict.hasOwnProperty(raw_info.type)){
                var index = type_dict[raw_info.type];
                browsecat.options[index].selected = true;
            }
        }

        else if (forward_site == 'iTS') {
            document.getElementsByName('imdblink')[0].value = raw_info.url;
            descr_box[0].style.height = '400px';
            var info_screenshots_splitted = 0;
            var descr = its_base_content;
            descr = descr.format({'youtube_url': raw_info.youtube_url});
            if (raw_info.ptp_poster){
                descr = descr.format({'poster': raw_info.ptp_poster});
            }
            try{
                var infos = get_mediainfo_picture_from_descr(raw_info.descr);
                if (raw_info.full_mediainfo){
                    $('textarea[name="mediainfo"]').val(raw_info.full_mediainfo);
                } else {
                    $('textarea[name="mediainfo"]').val(infos.mediainfo);
                }
                $('textarea[name="mediainfo"]').css({'height': '400px'});
                descr = descr.format({'screenshots': infos.pic_info});
                info_screenshots_splitted = 1;
            } catch(Err) {
                if (raw_info.full_mediainfo){
                    $('textarea[name="mediainfo"]').val(raw_info.full_mediainfo);
                } else {
                    $('textarea[name="mediainfo"]').val(raw_info.descr);
                }
                $('textarea[name="mediainfo"]').css({'height': '400px'});
            }
            if (raw_info.url) {
                descr = descr.format({'imdb_url': raw_info.url});
                if (!info_screenshots_splitted) {
                    descr = descr.format({'screenshots': raw_info.descr});
                }
                var base_url = 'https://api.nas.ink/?url=' + raw_info.url;
                getJson(base_url, null, function(data){
                    console.log(data)
                    descr = descr.format({'poster': data['poster']});
                    getDoc(raw_info.url, null, function (doc) {
                        var imdb_descr = $('.summary_text', doc).text().trim();
                        if (imdb_descr.match(/See full summary/)){
                            var full_descr_url = 'https://www.imdb.com' + $('.summary_text', doc).find('a').attr('href');
                            getDoc(full_descr_url, null, function (docx) {
                                imdb_descr = $('#plot-summaries-content', docx).find('p').text().trim();
                                descr = descr.format({'en_descr': imdb_descr});
                                $('textarea[name="descr"]').val(descr);
                            });
                        } else if (imdb_descr.match(/Add a Plot/)) {
                            descr = descr.format({'en_descr': `No data from IMDB: ${raw_info.url}`});
                            $('textarea[name="descr"]').val(descr);
                        } else {
                            descr = descr.format({'en_descr': imdb_descr});
                            $('textarea[name="descr"]').val(descr);
                        }
                    });
                    descr = descr.format({'imdb_score': data['imdb_rating_average']});
                });
            }
            $(`<p><a href="https://www.rottentomatoes.com/search?search=${search_name}" target="_blank"><input border="0" 
                type="text" onfocus="this.select()" size="87" style="background-color:#1e1d1d;color:white;border:1;font-weight:bold;text-align:center;" 
                value="搜索烂番茄"></p>`).insertAfter($('#myForm').find('p'));
            $(`<p><a href="https://www.themoviedb.org/search?language=zh-CN&query=${search_name}" target="_blank"><input border="0" 
                type="text" onfocus="this.select()" size="87" style="background-color:#1e1d1d;color:white;border:1;font-weight:bold;text-align:center;" 
                value="搜索TMDB"></p>`).insertAfter($('#myForm').find('p').last());
            $(`<p><a href="https://www.youtube.com/results?search_query=${search_name}" target="_blank"><input border="0" 
                type="text" onfocus="this.select()" size="87" style="background-color:#1e1d1d;color:white;border:1;font-weight:bold;text-align:center;" 
                value="搜索Youtube"></p>`).insertAfter($('#myForm').find('p').last());

            var $div = $(`<div style="margin-top: 10px;"></div>`);
            var $table = $(`<table class="line"></table>`);
            $div.append($table);
            function compare1(date){
                return function(obj1, obj2) {
                    value1=obj1[date];
                    value2=obj2[date];
                    return value2 - value1;
                }
            }
            function compare2(date){
                return function(obj1, obj2) {
                    try{ var value1 = obj1[date].split('-')[0]+obj1[date].split('-')[1]+obj1[date].split('-')[2];} catch(err) {value1='00000000'}
                    try{ var value2 = obj2[date].split('-')[0]+obj2[date].split('-')[1]+obj2[date].split('-')[2];} catch(err) {value2='00000000'}
                    return value2 - value1;
                }
            }
            var search_rt = 'https://www.rottentomatoes.com/api/private/v2.0/search?q=' + search_name;
            getJson(search_rt, null, function(data){
                if (data.movies.length > 2) {
                    data.results = data.movies.sort(compare1('year'));
                }
                if (data.movies.length > 0) {
                    for(i=0;i<data.movies.length;i++){
                        var $tr=$("<tr></tr>");
                        $td0 = $(`<td class="1"><img src="${data.movies[i].image}"; style="width: 60px; height: 90px;"></td>`);
                        $td1 = $(`<td class="1" style="width: 250px;">${data.movies[i].year}</td>`);
                        $td2 = $(`<td class="1" style="width: 250px;"><a href="https://www.rottentomatoes.com${data.movies[i].url}" target="_blank">${data.movies[i].name}</a></td>`);
                        if (data.movies[i].meterScore) {
                            $td3 = $(`<td class="1" style="width: 80px;">${data.movies[i].meterScore}</td>`);
                            $td4 = $(`<td class="1" style="width: 80px;"><input type="button" class="fill_number" name=${data.movies[i].url} title="${data.movies[i].meterScore}" value="USE"></td>`);
                        } else {
                            $td3 = $(`<td class="1" style="width: 80px;">0.0</td>`);
                            $td4 = $(`<td class="1" style="width: 80px;"><input type="button" class="fill_number" name=${data.movies[i].url} title="0" value="USE"></td>`);
                        }
                        $tr.append($td0); $tr.append($td1); $tr.append($td2); $tr.append($td3); $tr.append($td4);
                        $table.append($tr);
                    }

                    $('.fill_number').css({'backgroundColor': 'rgb(70, 77, 96)'});

                    $('.fill_number').click(function(){
                        descr = descr.format({'rt_url': 'https://www.rottentomatoes.com/' + $(this).attr('name')});
                        descr = descr.format({'rt_score': $(this).attr('title')});
                        $('textarea[name="descr"]').val(descr);
                    });

                    $('#autotmdb').change(function(){
                        if (!$(this).val()){
                            $table.slideDown(1000);
                        }
                    });
                    $table.find('.1').css({'backgroundColor': 'rgb(151, 46, 37)'});
                }
            });
            
            var search_imdb;
            if (raw_info.type == '剧集') {
                search_imdb = 'http://api.tmdb.org/3/search/tv?api_key={key}&language=zh-CN&query={name}&page=1&include_adult=true';
            } else if (raw_info.type == '电影') {
                search_imdb = 'http://api.tmdb.org/3/search/movie?api_key={key}&language=zh-CN&query={name}&page=1&include_adult=true';
            } else {
                search_imdb = 'http://api.tmdb.org/3/search/multi?api_key={key}&language=zh-CN&query={name}&page=1&include_adult=true';
            }
            search_imdb = search_imdb.format({'key': tmdb_key, 'name': search_name});
            getJson(search_imdb, null, function(data){
                if (data.results.length > 2) {
                    if (raw_info.type == '剧集') {
                        data.results = data.results.sort(compare2('first_air_date'));
                    } else {
                        data.results = data.results.sort(compare2('release_date'));
                    }
                }
                if (data.results.length > 0) {
                    for(i=0;i<data.results.length;i++){
                        var $tr=$("<tr></tr>");
                        if (raw_info.type == '剧集'){
                            $td0 = $(`<td class="2"><img src="https://image.tmdb.org/t/p/w300_and_h450_bestv2${data.results[i].poster_path}"; style="width:60px; height: 90px;"></td>`);
                            $td1 = $(`<td class="2" style="width: 250px;">${data.results[i].first_air_date}</td>`);
                            $td2 = $(`<td class="2" style="width: 250px;"><a href="https://www.themoviedb.org/TV/${data.results[i].id}" target="_blank">${data.results[i].original_name}</a></td>`);
                            $td3 = $(`<td class="2" style="width: 80px;">${data.results[i].vote_average}</td>`);
                            $td4 = $(`<td class="2" style="width: 80px;"><input type="button" class="fill_imdb" name="https://www.themoviedb.org/TV/${data.results[i].id}" score="${data.results[i].vote_average}" value="USE"></td>`);
                        } else {
                            $td0 = $(`<td class="2"><img src="https://image.tmdb.org/t/p/w300_and_h450_bestv2${data.results[i].poster_path}"; style="width: 60px; height: 90px;"></td>`);
                            $td1 = $(`<td class="2" style="width: 250px;">${data.results[i].release_date}</td>`);
                            $td2 = $(`<td class="2" style="width: 250px;"><a href="https://www.themoviedb.org/movie/${data.results[i].id}" target="_blank">${data.results[i].original_title}</a></td>`);
                            $td3 = $(`<td class="2" style="width: 80px;">${data.results[i].vote_average}</td>`);
                            $td4 = $(`<td class="2" style="width: 80px;"><input type="button" class="fill_imdb" name="https://www.themoviedb.org/movie/${data.results[i].id}" score="${data.results[i].vote_average}" value="USE"></td>`);
                        }
                        $tr.append($td0); $tr.append($td1); $tr.append($td2); $tr.append($td3); $tr.append($td4);
                        $table.append($tr);
                    }
                    $('.fill_imdb').css({'backgroundColor': 'rgb(70, 77, 96)'});
                    $('.fill_imdb').click(function(){
                        descr = descr.format({'tmdb_url': $(this).attr('name')});
                        descr = descr.format({'tmdb_score': parseInt($(this).attr('score')*10)});
                        $('textarea[name="descr"]').val(descr);
                    });
                    $('#autotmdb').change(function(){
                        if (!$(this).val()){
                            $table.slideDown(1000);
                        }
                    });
                    $table.find('.2').css({'backgroundColor': 'rgb(26, 184, 217)'});
                }
            });
            $div.insertAfter($('#myForm').find('p').last());
            if (raw_info.type == "电影" && ['1080p', '720p', '4K', '8K'].indexOf(raw_info.standard_sel) > -1) {
                $('select[name="type"]').val("68");
            } else if (raw_info.type == "电影") {
                $('select[name="type"]').val("67");
            } else if (raw_info.type == "剧集" || raw_info.type == "纪录") {
                $('select[name="type"]').val("65");
            }
        }
    } else if (judge_if_the_site_as_source() == 2) { //HDCity

        setTimeout(function(){
            var unSelected = "#999";
            var selected = "#333";
            $("select").css("color", unSelected);
            $("option").css("color", selected);
            $("select").change(function () {
                var selItem = $(this).val();
                if (selItem == $(this).find('option:first').val()) {
                    $(this).css("color", unSelected);
                } else {
                    $(this).css("color", selected);
                }
            });

            $('#bigname').css({'width': '650px'});

            var h1 = document.getElementsByTagName('h1')[0];
            var div = document.createElement('div');
            div.style.paddingTop = '20px';
            div.style.fontSize = '15px';
            var textarea = document.createElement('textarea');
            textarea.style.marginTop = '12px';
            textarea.style.marginBottom = '12px';
            textarea.style.height = '160px';
            textarea.style.width = '600px';
            textarea.id = 'textarea';
            div.appendChild(textarea);

            $('.header-inner').find('ul').prepend(`
                <li><a id="parser" href=""><i class="material-icons navi">forum</i> 解析</a></li>
                `)

            h1.appendChild(div);

            $('#parser').click(function(e) {
                e.preventDefault();
                var jump_str = textarea.value;
                if (jump_str) {
                    var raw_info = stringToDict(jump_str);
                    raw_info = fill_raw_info(raw_info);
                    $('#bigname').val(raw_info.name);
                    document.getElementsByName('small_descr')[0].value = raw_info.small_descr;
                    document.getElementsByName('url')[0].value = raw_info.url;
                    if (raw_info.descr.match(/\[img\](\S*?)\[\/img\]/i)){
                        document.getElementsByName('posterimg')[0].value = raw_info.descr.match(/\[img\](\S*?)\[\/img\]/i)[1];
                    }
                    $('#descr').val(raw_info.descr);


                    var info = get_mediainfo_picture_from_descr(raw_info.descr);
                    var cmctinfos = info.mediainfo;
                    $('#mediainfo').val(cmctinfos);
                    var browsecat = document.getElementById('browsecat');
                    var type_dict = {'电影': 1, '剧集': 2, '动漫': 4, '综艺': 5, '音乐': 6, '纪录': 3,
                                     '体育': 7, '软件': 11, '学习': 10, '': 12};
                    if (type_dict.hasOwnProperty(raw_info.type)){
                        var index = type_dict[raw_info.type];
                        browsecat.options[index].selected = true;
                    }

                    var medium_box = document.getElementsByName('medium_sel')[0];
                    medium_box.options[12].selected = true;
                    switch(raw_info.medium_sel){
                        case 'UHD': case 'Blu-ray':
                            medium_box.options[1].selected = true; break;
                        case 'DVD': medium_box.options[2].selected = true; break;
                        case 'Remux': medium_box.options[3].selected = true; break;
                        case 'HDTV': medium_box.options[6].selected = true; break;
                        case 'WEB-DL': medium_box.options[6].selected = true; break;
                        case 'Encode': medium_box.options[4].selected = true; break;
                    }

                    var codec_box = document.getElementsByName('codec_sel')[0];
                    var audiocodec_dict = {'Flac': 7, 'APE': 8, 'DTS': 9, 'AC3': 10, 'WAV': 12, 'MP3': 13,
                                           'AAC': 14, 'TrueHD': 11};
                    if (audiocodec_dict.hasOwnProperty(raw_info.audiocodec_sel)){
                        var index_ = audiocodec_dict[raw_info.audiocodec_sel];
                        codec_box.options[index_].selected = true;
                    }

                    switch (raw_info.codec_sel){
                        case 'H264': case 'X264':
                            codec_box.options[1].selected = true; break;
                        case 'VC-1':
                            codec_box.options[5].selected = true; break;
                        case 'XVID':
                            codec_box.options[4].selected = true; break;
                        case 'MPEG-2':
                            codec_box.options[3].selected = true; break;
                        case 'MPEG-4':
                            codec_box.options[3].selected = true; break;
                        case 'H265': case 'X265':
                            codec_box.options[2].selected = true;
                    }

                    var standard_box = document.getElementsByName('standard_sel')[0];
                    var standard_dict = {'4K': 3, '1080p': 5, '1080i': 6, '720p': 7, 'SD': 11, '': 0};
                    if (standard_dict.hasOwnProperty(raw_info.standard_sel)){
                        var index_1 = standard_dict[raw_info.standard_sel];
                        standard_box.options[index_1].selected = true;
                    }
                    if (if_uplver) {
                        document.getElementsByName('uplver')[0].checked = true;
                    }
                }

            });
        }, 2000);
    } 
}, sleep_time);
