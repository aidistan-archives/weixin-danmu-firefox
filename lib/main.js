var buttons = require('sdk/ui/button/action');
var tabs = require("sdk/tabs");
var pageMod = require("sdk/page-mod");
var self = require("sdk/self");
var notifications = require("sdk/notifications");

var button = buttons.ActionButton({
  id: "weixin-danmu",
  label: "微信弹幕",
  icon: {
    "16": "./icons/icon-o-16.png",
    "32": "./icons/icon-o-32.png",
    "64": "./icons/icon-o-64.png"
  },
  onClick: function() {
    if (danmu.attached) {
      if (danmu.shooting) {
        danmu.shooting = false;
        button.black();
      }
      else {
        danmu.shooting = true;
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

var danmu = {
  attached: false,
  shooting: true,
};

pageMod.PageMod({
  include: "https://wx.qq.com/",
  attachTo: "top",
  onAttach: function(worker){
    danmu.attached = true;
    button.light();
    notifications.notify({
      title: "微信弹幕",
      text: "引擎已加载，请登陆后选择相应的微信群作为弹药来源",
      iconURL: self.data.url("icons/icon.png")
    });
  },
  contentScriptFile: self.data.url("wx.qq.com.js")
});
