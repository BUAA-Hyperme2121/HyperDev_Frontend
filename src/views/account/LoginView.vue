<template>
  <div class="login-page">
    <div class="container">
      <div class="typed-out">HyperDev</div>
    </div>
    <el-form
      :model="loginForm"
      :rules="rules"
      ref="loginForm"
      label-position="top"
      status-icon
    >
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="loginForm.email" placeholder="请输入邮箱"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input
          v-model="loginForm.password"
          placeholder="请输入密码"
          show-password
          @keyup.enter.native="login"
        ></el-input>
      </el-form-item>
    </el-form>
    <el-button type="primary" @click="login" class="btn-primary">
      登录
    </el-button>
    <router-link to="/register" class="register-link"
      >没有账号？去注册</router-link
    >
  </div>
</template>

<script>
import qs from "qs";
export default {
  data() {
    return {
      loginForm: {
        email: "",
        password: "",
      },
      rules: {
        email: [{ required: true, message: "请输入用户名", trigger: "blur" }],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            // min: 6,
            // max: 20,
            // message: "长度在 6 到 16 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    login() {
      // 处理登录逻辑
      this.$refs["loginForm"].validate((valid) => {
        console.log(this.loginForm);

        // var formData = new FormData();
        // formData.append("email", "2924147820@qq.com");
        // formData.append("password", "666666");

        if (valid) {
          this.axios({
            method: "post",
            url: "/user/token",
            data: qs.stringify({
              email: this.loginForm.email,
              password: this.loginForm.password,
            }),
            // headers: { 'Content-Type': 'multipart/form-data' },
          })
            .then((res) => {
              if (res.data.result == 0) {
                // 登录成功
                this.$message({
                  message: "登录成功",
                  type: "success",
                });
                // console.log(res.data);
                // 保存JWT
                console.log(res.data.data.jwt);
                localStorage.setItem("jwt", JSON.stringify(res.data.data.jwt));
                // 获取用户信息
                this.axios({
                  method: "get",
                  url: "/user/me",
                  params: {
                    jwt: JSON.parse(localStorage.getItem("jwt")),
                  },
                }).then((res) => {
                  if (res.data.result == 0) {
                    // console.log(res.data);
                    // 保存用户信息
                    this.$store.state.userInfo.username = res.data.username;
                    this.$store.state.userInfo.email = res.data.email;
                    this.$store.state.userInfo.real_name = res.data.real_name;
                  }
                });

                // 跳转到home页
                this.$router.push("/home");
              } else {
                // 登录失败
                this.$message({
                  message: res.data.msg,
                  type: "error",
                });
              }
            })
            .catch((err) => {
              console.log(err);
              this.$message({
                message: "服务器开摆了~(￣▽￣)~*",
                type: "error",
              });
            });
        } else {
          this.$message({
            message: "请检查输入是否正确",
            type: "error",
          });
        }
      });
    },
  },
};
</script>

<style scoped>
.login-page {
  background-color: #fff;
  padding: 50px;
  border-radius: 5px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  width: 400px;
  margin: 20px auto;
}

.btn-primary {
  display: block;
  width: 30%;
  text-align: center;
  background-color: #0366d6;
  color: #fff;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  font-weight: 600;
  padding: 15px 20px;
  margin: 0 auto;
  cursor: pointer;
  transition: background-color 0.3s;
}
.btn-primary:hover {
  background-color: #044b9c;
}
.register-link {
  display: block;
  text-align: center;
  margin-top: 20px;
  font-size: 14px;
  color: #0366d6;
  text-decoration: none;
  transition: color 0.3s;
}
.register-link:hover {
  color: #044b9c;
}
.findpsw-link {
  display: block;
  text-align: center;
  margin-top: 10px;
  margin-bottom: 10px;
  font-size: 14px;
  color: #0366d6;
  text-decoration: none;
  transition: color 0.3s;
}
.findpsw-link:hover {
  color: #044b9c;
}

.container {
  display: block;
}

.typed-out {
  font-family: "Franklin Gothic Medium", "Arial Narrow", Arial, sans-serif;
  font-weight: 700;
  font-size: 35px;
  text-align: center;
}
/* .typed-out {
  font-family: "Franklin Gothic Medium", "Arial Narrow", Arial, sans-serif;
  overflow: hidden;
  border-right: 0.15em solid orange;
  white-space: nowrap;
  font-size: 35px;
  width: 0;
  animation: typing 2s steps(20, end) forwards, blink 1.5s infinite;
}
@keyframes typing {
  from {
    width: 0;
  }
  to {
    width: 200%;
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
