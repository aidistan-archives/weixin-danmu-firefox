// Require SDK
var tmr     = require('sdk/timers');
var tabs    = require('sdk/tabs');
var self    = require('sdk/self');
var prefs   = require('sdk/simple-prefs').prefs;
var buttons = require('sdk/ui/button/action');
var pageMod = require('sdk/page-mod');
var toaster = require('sdk/notifications');

// Global Variables
var attached = false;
var wx_worker, dm_worker;
var dm_workers = {};

// Toolbar Button
var button = buttons.ActionButton({
  id: 'weixin-danmu',
  label: '微信弹幕',
  icon: {
    '16': './icons/icon-o-16.png',
    '32': './icons/icon-o-32.png',
    '64': './icons/icon-o-64.png'
  },
  onClick: function() {
    if (prefs.danmuDebug) {
      if (dm_worker) {
        var counter = 0;
        var timer = tmr.setInterval(function() {
          if (counter++ < 10) {
            dm_worker.port.emit('bullet', {content:{text: randomString(), image: ''}});
          }
          else {
            tmr.clearInterval(timer);
          }
        }, 500);
      }
    }
    else {
      if (attached) {
        tabs.open(self.data.url('pages/helper.html') + '?full#intro');
      }
      else {
        tabs.open('https://wx.qq.com/');
      }
    }
  }
});

// Attach weixin.js
pageMod.PageMod({
  include: ['*.qq.com', '*.wechat.com'],
  attachTo: 'top',
  contentScriptFile: [
    self.data.url('vendor/jquery-2.1.3.min.js'),
    self.data.url('weixin.js')
  ],
  onAttach: function(worker){
    showNotification({ title: '已加载信息捕获模块' });
    wx_worker = worker;
    attached = true;
    button.icon = {
      '16': './icons/icon-16.png',
      '32': './icons/icon-32.png',
      '64': './icons/icon-64.png'
    };

    wx_worker.port.on('bullet', function(msg) {
      showNotification({ title: '捕获消息', text: msg.content.text });
      if (prefs.weixinDebug) {
        tabs.activeTab.attach({
          contentScript: 'alert("' + msg.content.text + '");'
        });
      }
      else {
        if (!prefs.disableShooting && dm_worker) {
          dm_worker.port.emit('bullet', msg);
        }
      }
    });

    var timer = tmr.setTimeout(breakup, 5000);
    wx_worker.port.on('heartbeat', function() {
      tmr.clearTimeout(timer);
      timer = tmr.setTimeout(breakup, 5000);
    });

    function breakup() {
      button.icon = {
        '16': './icons/icon-o-16.png',
        '32': './icons/icon-o-32.png',
        '64': './icons/icon-o-64.png'
      };
      attached = false;
      wx_worker = undefined;
    }
  }
});

// Attach danmu.js
for (let tab of tabs) { autoloadDanmu(tab); }
tabs.on('open', autoloadDanmu);
tabs.on('activate', function(tab) {
  dm_worker = dm_workers[tab.id];
  if (dm_worker) {
    pushDanmuSettings(dm_worker);
  }
});

// Utility functions
function autoloadDanmu(tab) {
  attachDanmu(tab);
  tab.on('pageshow', attachDanmu);
}

function attachDanmu(tab) {
  // Do not attach to places where scripts are blocked internally
  if (/about:/.test(tab.url)) {
    return;
  }

  showNotification({ title: '已加载弹幕发射模块', text: '至页面' + tab.url });
  var worker = tab.attach({
    contentScriptFile: [
      self.data.url('vendor/jquery-2.1.3.min.js'),
      self.data.url('danmu.js')
    ]
  });
  pushDanmuSettings(worker);

  dm_workers[tab.id] = worker;
  if (tabs.activeTab.id == tab.id) {
    dm_worker = worker;
  }
}

function pushDanmuSettings(worker) {
  worker.port.emit('fontSize', prefs.fontSize);
}

function randomString(len) {
  len = len || 32;
  var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxy0z123456789';
  var maxPos = chars.length;
  var str = '';
  for (_i = 0; _i < len; _i++) {
    str += chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return str;
}

function showNotification(notify) {
  if (prefs.showNotifications) {
    toaster.notify({
      title: notify.title,
      text: notify.text,
      iconURL: self.data.url('icons/icon.png')
    });
  }
}
