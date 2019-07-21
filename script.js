(function(fn) {
  typeof exports === "object" && typeof module !== "undefined"
    ? (module.exports = fn)
    : typeof define === "function" && define.amd
    ? define([], function() {
        return fn;
      })
    : (this.LogIn = fn);
})((function() {
  var instance;
  function LogIn(opts) {
    if(instance) {
        return instance;
    }
    this.container = opts.container;
    this.apiUrl = opts.url;
    this.requestType = opts.type;
    this.callback = opts.callback;
    this.continue = true;
    return instance = this;
  }
  LogIn.prototype.Validate = function() {
    this.checkRequire()
      .then(this.validateMobile())
      .then(this.validatevCode());
    if (this.continue) {
      this.request();
    }
  };
  LogIn.prototype.checkRequire = function() {
    var self = this;
    this.continue = true;
    function checkRequire() {}
    checkRequire.prototype.resolve = function() {
      var item;
      for (var i in self.params) {
        if (self.params[i].require && !self.params[i].value) {
          for (var j in self.params[i]) {
            j = i;
            self.continue = false;
          }
          if (!self.continue) {
            break;
          }
        }
      }
      if (!self.continue) {
        $(self.container)
          .find("#" + item)
          .next(".require")
          .show()
          .siblings(".require")
          .hide();
      } else {
        $(self.container)
          .find(".require")
          .hide();
      }
    };
    checkRequire.prototype.then = function(fn) {
      return fn;
    };
    var instance = new checkRequire();
    instance.resolve();
    return instance;
  };
  LogIn.prototype.validateMobile = function() {
    var self = this;
    function validateMobile() {}
    validateMobile.prototype.resolve = function() {
      if (self.mobile == "" && self.params.mobile.require) {
        alert("手机号码不能为空");
        self.continue = false;
        return;
      } else {
        var reg = /^1[3-9]\d{9}$/;
        if (!reg.test(self.mobile)) {
          alert("请输入正确格式的手机号码");
          self.continue = false;
          return;
        }
      }
      self.continue = true;
    };
    validateMobile.prototype.then = function(fn) {
      return fn;
    };
    var instance = new validateMobile();
    if (this.continue) {
      instance.resolve();
    }
    return instance;
  };
  LogIn.prototype.validatevCode = function() {
    var self = this;
    function validatevCode() {}
    validatevCode.prototype.resolve = function() {
      if (self.vCode.length == "" && self.params.vCode.require) {
        alert("验证码不能为空");
        self.continue = false;
        return;
      } else if (self.vCode.length != 6) {
        alert("请输入6位数字验证码");
        self.continue = false;
        return;
      }
      self.continue = true;
    };
    validatevCode.prototype.then = function(fn) {
      return fn;
    };
    var instance = new validatevCode();
    if (this.continue) {
      instance.resolve();
    }
    return instance;
  };
  LogIn.prototype.request = function() {
    var self = this;
    $.ajax({
      url: this.apiUrl,
      type: this.requestType,
      data: { vCode: this.vCode, mobile: this.mobile },
      dataType: "json",
      success: function(res) {
        if (res.Status == 0) {
            self.callback();
        } else {
          alert(res.Message);
        }
      }
    });
  };
  LogIn.prototype.logIn = function(opts) {
    this.params = opts;
    this.mobile = opts.mobile;
    this.vCode = opts.vCode;
    this.require = opts.require || false;
    this.Validate();
  };
  LogIn.prototype.show = function() {
    $(this.container).show();
  };
  return LogIn;
})());
