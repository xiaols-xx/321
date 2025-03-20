const fs = require("fs");
const axios = require("axios");
const FormData = require("form-data");

const payload = {
  prompt: "Lighthouse on a cliff overlooking the ocean",
  output_format: "png", // 修改为 PNG 格式
};

(async () => {
  try {
    const response = await axios.postForm(
      `https://api.stability.ai/v2beta/stable-image/generate/sd3`,
      axios.toFormData(payload, new FormData()),
      {
        validateStatus: undefined,
        responseType: "arraybuffer", // 确保接收二进制数据
        headers: { 
          Authorization: `Bearer sk-tHlVl5wbvlbZjPmdvftkBBITjbDw8sDlafh6f4sDUTDbvHe4`, // 替换为你的 API Key
          Accept: "image/*", 
        },
      },
    );

    if (response.status === 200) {
      // 检查 Content-Type 头，确保返回的是图片
      const contentType = response.headers["content-type"];
      if (!contentType || !contentType.startsWith("image/")) {
        throw new Error(`返回的数据不是图片格式，Content-Type: ${contentType}`);
      }

      // 保存图片到文件
      fs.writeFileSync("./lighthouse.png", Buffer.from(response.data));
      console.log("图片已保存为 lighthouse.png");
    } else {
      throw new Error(`${response.status}: ${response.data.toString()}`);
    }
  } catch (error) {
    console.error("生成图片失败:", error.message);
  }
})();