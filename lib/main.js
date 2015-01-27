// Require SDK
var tabs    = require("sdk/tabs");
var self    = require("sdk/self");
var buttons = require('sdk/ui/button/action');
var pageMod = require("sdk/page-mod");
var toaster = require("sdk/notifications");

// App States
var attached = false;
var shooting = true;
var wx_worker = undefined;
var dm_worker = undefined;

// Main Button
var button = buttons.ActionButton({
  id: "weixin-danmu",
  label: "微信弹幕",
  icon: {
    "16": "./icons/icon-o-16.png",
    "32": "./icons/icon-o-32.png",
    "64": "./icons/icon-o-64.png"
  },
  onClick: function() {
    if (attached) {
      if (shooting) {
        shooting = false;
        button.black();
      }
      else {
        shooting = true;
        button.light();
      }
    }
    else {
      tabs.open("https://wx.qq.com/");
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

// Get bullets from Weixin
pageMod.PageMod({
  include: "https://wx.qq.com/",
  attachTo: "top",
  onAttach: function(worker){
    attached = true;
    button.light();
    toaster.notify({
      title: "微信弹幕",
      text: "引擎已加载，请登陆后选择相应的微信群作为弹药来源",
      iconURL: self.data.url("icons/icon.png")
    });
    console.log("已装载ContentScript");

    wx_worker = worker;
    wx_worker.port.on("bullet", function(msg) {
      if (this.shooting && dm_worker) {
        dm_worker.port.emit("bullet", msg);
      }
    });
  },
  contentScriptFile: [
    self.data.url("vendor/jquery-2.1.3.min.js"),
    self.data.url("wx.qq.com.js")
  ]
});

// Shoot bullets to current tab
tabs.on('activate', function(tab) {
  dm_worker = tab.attach({
    contentScriptFile: [
      self.data.url("vendor/jquery-2.1.3.min.js"),
      self.data.url("danmu.js")
    ]
  });
  dm_worker.port.emit("fontSize", require('sdk/simple-prefs').prefs['fontSize']);
});
