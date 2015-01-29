// Require SDK
var tmr     = require('sdk/timers');
var tabs    = require("sdk/tabs");
var self    = require("sdk/self");
var prefs   = require('sdk/simple-prefs').prefs;
var buttons = require('sdk/ui/button/action');
var pageMod = require("sdk/page-mod");
var toaster = require("sdk/notifications");

// Global Variables
var attached = false;
var shooting = true;
var wx_worker = undefined;
var dm_worker = undefined;
var dm_workers = {};

// Toolbar Button
var button = buttons.ActionButton({
  id: "weixin-danmu",
  label: "微信弹幕",
  icon: {
    "16": "./icons/icon-o-16.png",
    "32": "./icons/icon-o-32.png",
    "64": "./icons/icon-o-64.png"
  },
  onClick: function() {
    if (prefs["danmuDebug"]) {
      if (dm_worker) {
        var counter = 0;
        var timer = tmr.setInterval(function() {
          if (counter++ < 10) {
            dm_worker.port.emit("bullet", {content:{text: randomString() }});
          }
          else {
            tmr.clearTimeout(timer);
          }
        }, 500);
      }
    }
    else {
      if (attached) {
        if (shooting) {
          shooting = false;
          button.black();
          showNotification({ title: '停用微信弹幕' });
        }
        else {
          shooting = true;
          button.light();
          showNotification({ title: '启用微信弹幕' });
        }
      }
      else {
        tabs.open("https://wx.qq.com/");
      }
    }
  }
});
button.light = function() {
  button.icon = {
    "16": "./icons/icon-16.png",
    "32": "./icons/icon-32.png",
    "64": "./icons/icon-64.png"
  };
};
button.black = function() {
  button.icon = {
    "16": "./icons/icon-o-16.png",
    "32": "./icons/icon-o-32.png",
    "64": "./icons/icon-o-64.png"
  };
};

// Attach weixin.js
pageMod.PageMod({
  include: "*.qq.com",
  attachTo: "top",
  contentScriptFile: [
    self.data.url("jquery-2.1.3.min.js"),
    self.data.url("weixin.js")
  ],
  onAttach: function(worker){
    attached = true;
    button.light();
    showNotification({ title: '已加载信息捕获模块' });

    worker.port.on("notify", showNotification);
    worker.port.on("bullet", function(msg) {
      if (prefs["weixinDebug"]) {
        tabs.activeTab.attach({
          contentScript: 'alert("' + msg.content.text + '");'
        });
      }
      else {
        if (shooting && dm_worker) {
          dm_worker.port.emit("bullet", msg);
        }
      }
    });
    wx_worker = worker;
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
  showNotification({ title: '已加载弹幕发射模块', text: '至页面' + tab.url });
  var worker = tab.attach({
    contentScriptFile: [
      self.data.url("jquery-2.1.3.min.js"),
      self.data.url("danmu.js")
    ]
  });
  worker.port.on("notify", showNotification);
  pushDanmuSettings(worker);

  dm_workers[tab.id] = worker;
  if (tabs.activeTab.id == tab.id) {
    dm_worker = worker;
  }
}

function pushDanmuSettings(worker) {
  worker.port.emit("fontSize", prefs["fontSize"]);
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
  if (prefs["showNotifications"]) {
    toaster.notify({
      title: notify.title,
      text: notify.text,
      iconURL: self.data.url('icons/icon.png')
    });
  }
}
