export default {
    //首页推荐
    home_page_data: {
        url: 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg',
        params: () => {
          return {
            g_tk: 5381,
            uin: 0,
            format: 'jsonp',
            inCharset: 'utf-8',
            outCharset: 'utf-8',
            notice: 0,
            platform: 'h5',
            needNewCode: 1,
            _: "1492177982521"
          }
        },
        jsonp: 'jsonpCallback'
    },
    //获取歌手详情
    singer_info: {
      url: 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg',
      params: (id) => {
        return {
          g_tk:1695008182,
          loginUin:983915916,
          hostUin:0,
          format:'jsonp',
          inCharset:'utf8',
          outCharset:'utf-8',
          notice:0,
          platform:'yqq',
          needNewCode:0,
          singermid:id,
          order:'listen',
          begin:0,
          jsonpCallback:'MusicJsonCallbacksinger_track',
          num:30,
          songstatus:1,
        }
      },
      jsonp: 'jsonpCallback'
    },
    //排行榜详情
    rank_songs: {
      url: 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg',
      params: (id) => {
        return {
          g_tk: 5381,
          uin: 0,
          format: 'json',
          inCharset: 'utf-8',
          outCharset: 'utf-8',
          notice: 0,
          platform: 'h5',
          needNewCode: 1,
          tpl: 3,
          page: 'detail',
          type: 'top',
          topid: id,
          _: new Date().getTime()
        }
      },
      jsonp: 'MusicJsonCallbacktoplist'
    },
    //排行榜
    rank_list: {
      url: 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg',
      params: () => {
        return {
          // page:'index',
          // format:'html',
          // tpl:'macv4',
          // v8debug:1
          format: 'jsonp',
          g_tk: 5381,
          uin: 0,
          inCharset: 'utf-8',
          outCharset: 'utf-8',
          notice: 0,
          platform: 'h5',
          needNewCode: 1,
          _: new Date().getTime()
        }
      },
      jsonp: 'MusicJsonCallback'
    },
    album: {
      url: 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_album_info_cp.fcg',
      params: (id) => {
        return {
          albummid: id,
          g_tk: 5381,
          loginUin: 0,
          hostUin: 0,
          format: 'jsonp',
          inCharset: 'utf8',
          outCharset: 'utf-8',
          notice: 0,
          platform: 'yqq',
          needNewCode: 0
        }
      },
      jsonp: 'jsonpCallback'
    },
    
    search: {
      url: 'https://c.y.qq.com/splcloud/fcgi-bin/smartbox_new.fcg',
      params: (key) => {
        return {
          is_xml: 0,
          format: 'jsonp',
          key: key,
          g_tk: 5381,
          loginUin: 0,
          hostUin: 0,
          inCharset: 'utf8',
          outCharset: 'utf-8',
          notice: 0,
          platform: 'yqq',
          needNewCode: 0
        }
      },
      jsonp: 'jsonpCallback'
    },
    hotkey: {
      url: 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg',
      params: () => {
        return {
          g_tk: 5381,
          loginUin: 0,
          hostUin: 0,
          format: 'jsonp',
          inCharset: 'utf8',
          outCharset: 'utf-8',
          notice: 0,
          platform: 'yqq',
          needNewCode: 0
        }
      },
      jsonp: 'jsonpCallback'
    },
    lyric: {
      url: 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric.fcg',
      params: (id) => {
        return {
          nobase64:1,
          musicid:id,
          songtype:0
        }
      },
      jsonp:'callback'
    }
  }