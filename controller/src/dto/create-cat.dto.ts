// dto/create-cat.dto.ts
// 数据传输对象 (DTO) - 定义客户端发送数据的结构
export class CreateCatDto {
  name: string; // 猫咪名字
  age: number; // 猫咪年龄
  breed: string; // 猫咪品种
}
