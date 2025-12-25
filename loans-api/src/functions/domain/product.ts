export interface Product {
    id: string;                     // 设备型号 ID
    name: string;                   // 名称：MacBook Pro
    category: string;               // 类别：laptop / camera / tablet
    description?: string;           // 可选描述

    quantityTotal: number;          // 总库存
    quantityAvailable: number;      // 可用库存

    waitlist: string[];             // 等待该型号的用户列表
}
