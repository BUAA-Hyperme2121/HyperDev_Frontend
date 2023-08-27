<template>
  <div class="register-page">
    <div class="container">
      <div class="typed-out">\ Join Us /</div>
    </div>
    <!-- 注册表单 -->
    <el-form
      :model="registerForm"
      :rules="rules"
      ref="registerForm"
      label-position="top"
      status-icon
      size="mini"
    >
      <el-form-item label="用户名" prop="username">
        <el-input
          v-model="registerForm.username"
          placeholder="3~10个字符"
        ></el-input>
      </el-form-item>
      <!-- 真实姓名 -->
      <el-form-item label="真实姓名" prop="real_name">
        <el-input
          v-model="registerForm.real_name"
          placeholder="请输入真实姓名"
        ></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input
          v-model="registerForm.password"
          placeholder="6~16位密码"
          show-password
        ></el-input>
      </el-form-item>
      <!-- <el-form-item label="确认密码" prop="password_2">
        <el-input
          v-model="registerForm.password_2"
          placeholder="请再次输入密码"
          show-password
        ></el-input>
      </el-form-item> -->
      <el-form-item label="邮箱" prop="email">
        <el-input
          v-model="registerForm.email"
          placeholder="请输入邮箱"
          @keyup.enter.native="register('registerForm')"
        ></el-input>
      </el-form-item>
      <!-- 邮箱验证码 -->
      <!-- <el-form-item label="邮箱验证码" prop="sms_code">
        <div style="display: flex">
          <el-input
            v-model="registerForm.sms_code"
            placeholder="请输入邮箱验证码"
            style="margin-right: 20px"
          ></el-input> -->
      <!-- 获取邮箱验证码 -->
      <!-- <el-button
            type="primary"
            size="mini"
            @click="postEmailCode"
            :disabled="canPostCode"
            >{{ btnText }}</el-button
          >
        </div>
      </el-form-item> -->
    </el-form>
    <!-- 注册按钮 -->
    <el-button
      type="primary"
      @click="register('registerForm')"
      class="register-btn"
      >注册</el-button
    >
    <!-- 跳转到登录页面 -->
    <div class="to-login">
      <router-link to="/login" class="login-link">已有账号？去登录</router-link>
    </div>
  </div>
</template>

<script>
import qs from "qs";
export default {
  data() {
    return {
      // 获取邮箱验证码按钮文本
      // btnText: "获取邮箱验证码",
      // 是否可以点击获取邮箱验证码按钮
      // canPostCode: false,
      // 注册表单
      registerForm: {
        username: "",
        real_name: "",
        password: "",
        email: "",
        // sms_code: "",
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        real_name: [
          { required: true, message: "请输入真实姓名", trigger: "blur" },
          {
            min: 2,
            max: 10,
            message: "长度在 2 到 10 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 16,
            message: "长度在 6 到 16 个字符",
            trigger: "blur",
          },
        ],
        email: [
          { required: true, message: "请输入邮箱地址", trigger: "blur" },
          {
            validator: (rule, value, callback) => {
              if (!this.isEmail(value)) {
                callback(new Error("请输入正确的邮箱地址"));
              } else {
                callback();
              }
            },
            trigger: ["blur", "change"],
          },
        ],
        // sms_code: [
        //   { required: true, message: "请输入邮箱验证码", trigger: "blur" },
        //   {
        //     min: 6,
        //     max: 6,
        //     message: "请输入6位邮箱验证码",
        //     trigger: "blur",
        //   },
        // ],
      },
    };
  },
  methods: {
    register(formName) {
      // 处理注册逻辑
      this.$refs[formName].validate((validate) => {
        if (validate) {
          this.axios({
            method: "post",
            url: "/user/",
            data: qs.stringify({
              real_name: this.registerForm.real_name,
              username: this.registerForm.username,
              password: this.registerForm.password,
              email: this.registerForm.email,
            }),
          })
            .then((res) => {
              // 注册成功
              if (res.data.result == 0) {
                this.$message({
                  message: res.data.msg,
                  type: "success",
                });
                // 跳转到登录页面
                this.$router.push("/login");
              } else {
                // 注册失败
                this.$message({
                  message: res.data.msg,
                  type: "error",
                });
              }
            })
            .catch((err) => {
              // 服务器错误
              console.log(err);
              this.$message({
                message: "服务器开摆了~(￣▽￣)~*",
                type: "error",
              });
            });
        } else {
          // 表单验证失败
          this.$message({
            message: "请检查输入是否正确",
            type: "error",
          });
        }
      });
    },
    // 邮箱合法性验证
    isEmail(email) {
      let reg = /^([a-zA-Z]|[0-9])(\w|-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
      return reg.test(email);
    },
    //两次输入密码是否相同
    // isSamePassword() {
    //   return this.registerForm.password_1 === this.registerForm.password_2;
    // },
    //发送邮箱验证码
    // postEmailCode() {
    //   // 处理发送邮箱验证码逻辑
    //   this.$axios({
    //     method: "post",
    //     url: "/user/",
    //     data: qs.stringify({
    //       real_name: this.registerForm.realname,
    //       username: this.registerForm.username,
    //       password: this.registerForm.password,
    //       email: this.registerForm.email,
    //     }),
    //   });

    //   // 禁用获取验证码按钮
    //   this.canPostCode = true;
    //   // 获取验证码按钮倒计时
    //   let count = 60;
    //   this.btnText = count + "s后重新获取";
    //   let timer = setInterval(() => {
    //     if (count > 0) {
    //       count--;
    //       this.btnText = count + "s后重新获取";
    //     } else {
    //       clearInterval(timer);
    //       this.btnText = "获取邮箱验证码";
    //       this.canPostCode = false;
    //     }
    //   }, 1000);
    // },
  },
};
</script>

<style scoped>
.register-page {
  background-color: #fff;
  padding: 50px;
  border-radius: 5px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  width: 500px;
  margin: 20px auto;
}
.register-page h1 {
  text-align: center;
  font-family: "Gill Sans", "Gill Sans MT", Calibri, "Trebuchet MS", sans-serif;
}
.register-btn {
  margin: 0 auto;
  display: block;
}
.to-login {
  text-align: center;
  margin-top: 20px;
}
.login-link {
  font-size: 14px;
  color: #0366d6;
  text-decoration: none;
  transition: color 0.3s;
}
.login-link:hover {
  color: #044b9c;
}
.container {
  display: block;
  /* margin-left: 95px;
  margin-right: 95px; */
}
.typed-out {
  text-align: center;
  font-family: "Franklin Gothic Medium", "Arial Narrow", Arial, sans-serif;
  /* overflow: hidden; */
  /* border-right: 0.15em solid orange; */
  /* white-space: nowrap; */
  font-size: 35px;
  margin-bottom: 20px;
  /* width: 0; */
  /* animation: typing 2s steps(20, end) forwards; */
}
/* @keyframes typing {
  from {
    width: 0;
  }
  to {
    width: 100%;
  }
}
@keyframes blink {
  from {
    border-color: transparent;
  }
  to {
    border-color: black;
  }
} */
</style>
