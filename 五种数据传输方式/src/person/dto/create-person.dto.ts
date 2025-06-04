/**
 * 创建用户的数据传输对象 (DTO)
 * 用于定义和验证传入的数据结构
 */
export class CreatePersonDto {
  /**
   * 用户姓名
   */
  name: string;

  /**
   * 用户年龄
   */
  age: number;
}
