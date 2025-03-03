import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 获取当前文件的目录
const root = fileURLToPath(import.meta.url);
const dirname = path.dirname(root);

// 读取 store/index.js 文件
const filePath = path.join(dirname, '..', 'store', 'index.js');
fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
        console.error('读取文件失败:', err);
        return;
    }

    // 使用正则表达式解析 defaultNewsArr
    const defaultNewsArrRegex = /defaultNewsArr:\s*(\[[\s\S]*?\])/;
    const match = data.match(defaultNewsArrRegex);

    if (match) {
        // 解析 defaultNewsArr
        const defaultNewsArr = eval(match[1]);

        // 对项目进行排序和编号
        const sortedNewsItems = defaultNewsArr.map((item, index) => {
            return { ...item, order: index }; // 只更新 order 字段
        });

        // 生成新的 defaultNewsArr 内容，保持其他字段的格式
        const newDefaultNewsArr = sortedNewsItems.map(item => {
            const paramsString = item.params ? 
                `params: { ${Object.entries(item.params).map(([key, value]) => `${key}: ${value}`).join(', ')} },` : 
                '';
            return `{
            label: "${item.label}",
            name: "${item.name}",
            ${paramsString}
            order: ${item.order},
            show: ${item.show}
        }`.trim();
        }).join(',\n');

        // 替换原有的 defaultNewsArr
        const newData = data.replace(defaultNewsArrRegex, `defaultNewsArr: [\n${newDefaultNewsArr}\n],`);

        // 去掉多余的逗号
        const finalData = newData.replace(/,,/g, ','); // 去掉多余的逗号

        // 写入文件
        fs.writeFile(filePath, finalData, 'utf8', (err) => {
            if (err) {
                console.error('写入文件失败:', err);
            } else {
                console.log('defaultNewsArr 已成功更新！');
            }
        });
    } else {
        console.log('未找到 defaultNewsArr');
    }
});